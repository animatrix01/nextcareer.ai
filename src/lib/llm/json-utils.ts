/**
 * Robust JSON extraction for LLM output.
 *
 * Tries, in order:
 *  1. Direct JSON.parse
 *  2. Stripping ```json fences
 *  3. Extracting the first balanced { ... } block (recovers JSON when the
 *     model wraps it in prose or reasoning text)
 *
 * Throws on total failure — callers map this to their own PARSE error.
 */
export function parseModelJson(text: string): unknown {
  const trimmed = text.trim();

  // 1. Direct parse
  try {
    return JSON.parse(trimmed);
  } catch {
    // fall through
  }

  // 2. Stripped code fences
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/im.exec(trimmed);
  if (fence?.[1]) {
    try {
      return JSON.parse(fence[1].trim());
    } catch {
      // fall through
    }
  }

  // 3. First balanced object — scan for the outermost { ... } and parse it.
  //    Handles prose like "Here is the roadmap: { ... } Hope this helps!"
  const start = trimmed.indexOf("{");
  if (start !== -1) {
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let i = start; i < trimmed.length; i++) {
      const ch = trimmed[i];
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (ch === '"') {
        if (!escaped) inString = !inString;
        continue;
      }
      if (inString) continue;
      if (ch === "{") depth++;
      else if (ch === "}") {
        depth--;
        if (depth === 0) {
          const candidate = trimmed.slice(start, i + 1);
          try {
            return JSON.parse(candidate);
          } catch {
            break; // not recoverable — give up below
          }
        }
      }
    }
  }

  throw new Error("Model output was not valid JSON");
}
