type ChatMessage = { role: "system" | "user"; content: string };

export type GroqChatCompletionOptions = {
  messages: ChatMessage[];
  temperature?: number;
  /** OpenAI-style json_object response format */
  jsonMode?: boolean;
  /**
   * Groq structured outputs (`response_format: { type: "json_schema" }`).
   * Preferred over jsonMode — the provider enforces the shape server-side.
   */
  jsonSchema?: { name: string; schema: Record<string, unknown> };
  /** Per-call model override (defaults to GROQ_MODEL env or the app default) */
  model?: string;
};

/**
 * Normalizes env values from .env files (quotes, UTF-8 BOM, CRLF).
 * Groq API keys are issued as `gsk_...` from https://console.groq.com/keys
 */
function normalizeSecret(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  let v = value.replace(/^\uFEFF/, "").trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim();
  }
  return v.length > 0 ? v : undefined;
}

function requireGroqApiKey(): string {
  const key = normalizeSecret(process.env.GROQ_API_KEY);
  if (!key) {
    throw new Error(
      "GROQ_API_KEY is not configured. Set it in the server environment (e.g. .env.local)."
    );
  }
  if (!key.startsWith("gsk_")) {
    throw new Error(
      "GROQ_API_KEY must start with gsk_. Create an API key at https://console.groq.com/keys and paste it into .env.local, then restart `npm run dev`."
    );
  }
  // Groq issues URL-safe ASCII tokens; reject odd Unicode / whitespace inside the token
  if (!/^gsk_[A-Za-z0-9_-]+$/.test(key)) {
    throw new Error(
      "GROQ_API_KEY has invalid characters. Re-copy the key from https://console.groq.com/keys (ASCII only, no spaces)."
    );
  }
  return key;
}

function defaultModel(): string {
  // `llama-3.1-8b-instant` was removed from Groq's catalog (404 model_not_found).
  // `openai/gpt-oss-120b` is the most latency-consistent current chat model
  // (verified live: ~4.4s for full roadmaps, while `gpt-oss-20b` randomly
  // spikes to 12s+ under free-tier congestion). Override with GROQ_MODEL.
  return process.env.GROQ_MODEL?.trim() || "openai/gpt-oss-120b";
}

type GroqChatCompletionResponse = {
  choices?: Array<{
    message?: { content?: string | null };
    finish_reason?: string;
  }>;
  error?: { message?: string };
};

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Server-only Groq call (OpenAI-compatible chat completions).
 * Swap implementation here later for multi-provider routing.
 *
 * Resilience:
 *  - Retries transient failures (429 rate limits, 5xx, network errors) with backoff.
 *  - On 400 "failed_generation" (Groq's server-side JSON validation rejecting the
 *    output — happens intermittently with reasoning models), retries with the SAME
 *    format first; only the FINAL attempt drops response_format, because without
 *    it reasoning models tend to emit non-JSON prose (which previously caused
 *    cascading "Model output was not valid JSON" 422s).
 *  - 401/403 are never retried (bad key — retrying cannot help).
 */
export async function callGroqChatCompletion(
  options: GroqChatCompletionOptions
): Promise<string> {
  const apiKey = requireGroqApiKey();
  const model = options.model?.trim() || defaultModel();

  const baseBody: Record<string, unknown> = {
    model,
    messages: options.messages,
    temperature: options.temperature ?? 0.35,
  };

  if (options.jsonSchema) {
    baseBody.response_format = {
      type: "json_schema",
      json_schema: { name: options.jsonSchema.name, schema: options.jsonSchema.schema },
    };
  } else if (options.jsonMode) {
    baseBody.response_format = { type: "json_object" };
  }

  const MAX_ATTEMPTS = 3;
  let lastError: Error = new Error("Groq request failed");

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    // Final-resort: on the last attempt, drop response_format entirely —
    // the strict prompt + parseModelJson() recovery still extract the JSON.
    const body: Record<string, unknown> = { ...baseBody };
    if (attempt === MAX_ATTEMPTS && baseBody.response_format) {
      delete body.response_format;
    }

    let res: Response;
    try {
      res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch (e) {
      // Network-level failure (DNS, TLS, socket) — retryable
      lastError = new Error(
        `Groq request failed: ${e instanceof Error ? e.message : String(e)}`
      );
      if (attempt < MAX_ATTEMPTS) {
        await sleep(400 * attempt);
        continue;
      }
      throw lastError;
    }

    const rawText = await res.text();
    let parsed: GroqChatCompletionResponse;
    try {
      parsed = JSON.parse(rawText) as GroqChatCompletionResponse;
    } catch {
      throw new Error(`Groq returned non-JSON (status ${res.status})`);
    }

    if (!res.ok) {
      const msg = parsed.error?.message ?? rawText.slice(0, 500);

      if (res.status === 401) {
        throw new Error(
          [
            "Groq API error (401): Invalid API Key.",
            "1) Paste a new key from https://console.groq.com/keys into .env.local as GROQ_API_KEY=gsk_... (single line).",
            "2) Fully restart npm run dev.",
            "3) If it still fails: your OS or terminal may be overriding .env.local. In PowerShell run: Remove-Item Env:GROQ_API_KEY -ErrorAction SilentlyContinue",
            "   then check Windows Environment Variables for GROQ_API_KEY.",
            "4) In dev, open GET /api/ai/roadmap/debug to see whether the server sees a key (length only, no secret).",
          ].join(" ")
        );
      }

      const isJsonValidationFailure =
        res.status === 400 && /failed_generation|validate JSON/i.test(msg);
      const retryable =
        res.status === 429 || res.status >= 500 || isJsonValidationFailure;

      lastError = new Error(`Groq API error (${res.status}): ${msg}`);

      if (retryable && attempt < MAX_ATTEMPTS) {
        // Respect Retry-After when Groq provides it (rate limits), else back off
        const retryAfterHeader = res.headers.get("retry-after");
        const retryAfterMs = retryAfterHeader
          ? Math.min(Number(retryAfterHeader) * 1000, 5000)
          : 400 * attempt;
        await sleep(retryAfterMs);
        continue;
      }
      throw lastError;
    }

    const content = parsed.choices?.[0]?.message?.content;
    if (typeof content !== "string" || content.length === 0) {
      lastError = new Error("Groq response missing message content");
      if (attempt < MAX_ATTEMPTS) {
        await sleep(400 * attempt);
        continue;
      }
      throw lastError;
    }

    return content;
  }

  throw lastError;
}