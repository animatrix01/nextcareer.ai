/**
 * Centralised rate limiting for all AI API routes.
 *
 * Uses Upstash Redis + @upstash/ratelimit with a sliding window algorithm.
 * All limits are per authenticated Clerk userId.
 *
 * Limits (free tier):
 *  - roadmap:        5  requests / hour   (most expensive — full roadmap generation)
 *  - analyzer:       10 requests / hour
 *  - parse-resume:   10 requests / hour
 *  - enhance-summary:20 requests / hour
 *  - suggest-skills: 20 requests / hour
 *
 * Resilience:
 *  - The Redis client and limiters are created lazily, so a missing/misconfigured
 *    env var never crashes module import (previously `Redis.fromEnv()` could throw
 *    at import time and take down every API route).
 *  - If Redis is unreachable (e.g. deleted database, DNS failure), we "fail open"
 *    but cache the outage for 60s so we don't retry a dead host on every request.
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { logError } from "@/lib/logger";

// ── Lazy Redis client ────────────────────────────────────────────────────────
let cachedRedis: Redis | null | undefined;

function getRedis(): Redis | null {
  if (cachedRedis !== undefined) return cachedRedis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn("[rate-limit] UPSTASH_REDIS_REST_URL/TOKEN not set — rate limiting disabled (fail open)");
    cachedRedis = null;
    return cachedRedis;
  }

  try {
    cachedRedis = new Redis({ url, token });
  } catch (err) {
    logError("[rate-limit] Failed to create Redis client — rate limiting disabled", err);
    cachedRedis = null;
  }
  return cachedRedis;
}

// ── Outage cooldown — skip dead-host retries for 60s after a failure ─────────
let redisDownUntil = 0;
const REDIS_RETRY_AFTER_MS = 60_000;

// ── Lazy per-endpoint limiters ───────────────────────────────────────────────
type LimiterKey = "roadmap" | "analyzer" | "parseResume" | "enhanceSummary" | "suggestSkills";

const LIMITS: Record<LimiterKey, { requests: number; window: "1 h"; prefix: string }> = {
  roadmap: { requests: 5, window: "1 h", prefix: "rl:roadmap" },
  analyzer: { requests: 10, window: "1 h", prefix: "rl:analyzer" },
  parseResume: { requests: 10, window: "1 h", prefix: "rl:parse-resume" },
  enhanceSummary: { requests: 20, window: "1 h", prefix: "rl:enhance-summary" },
  suggestSkills: { requests: 20, window: "1 h", prefix: "rl:suggest-skills" },
};

export type RateLimiterKey = LimiterKey;

const limiterCache = new Map<LimiterKey, Ratelimit>();

function getLimiter(key: LimiterKey): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;

  let limiter = limiterCache.get(key);
  if (!limiter) {
    const cfg = LIMITS[key];
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(cfg.requests, cfg.window),
      prefix: cfg.prefix,
      analytics: false,
    });
    limiterCache.set(key, limiter);
  }
  return limiter;
}

/**
 * Check rate limit for a given endpoint + userId.
 *
 * Returns `null` if the request is allowed.
 * Returns a `NextResponse` (429) if the limit is exceeded — just return it from your route.
 *
 * Usage:
 * ```ts
 * const limited = await checkRateLimit("analyzer", userId);
 * if (limited) return limited;
 * ```
 */
export async function checkRateLimit(
  key: RateLimiterKey,
  userId: string
): Promise<NextResponse | null> {
  // Redis known-down — fail open without touching the dead host
  if (Date.now() < redisDownUntil) return null;

  const limiter = getLimiter(key);
  if (!limiter) return null; // Redis not configured — fail open

  try {
    const { success, limit, remaining, reset } = await limiter.limit(userId);

    if (!success) {
      const retryAfterSeconds = Math.ceil((reset - Date.now()) / 1000);
      return NextResponse.json(
        {
          ok: false,
          error: "Rate limit exceeded. Please slow down and try again later.",
          retryAfter: retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(reset),
            "Retry-After": String(retryAfterSeconds),
          },
        }
      );
    }

    // Allowed — return null so the caller can continue
    return null;
  } catch (err) {
    // Redis is down — fail open (don't block the user) but back off for a minute
    redisDownUntil = Date.now() + REDIS_RETRY_AFTER_MS;
    logError("[rate-limit] Redis error — failing open for 60s", err);
    return null;
  }
}
