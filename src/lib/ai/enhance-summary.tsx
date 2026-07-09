import { callGroqChatCompletion } from "@/lib/llm/client";
import { parseModelJson } from "@/lib/llm/json-utils";
import { SUMMARY_JSON_SCHEMA } from "@/lib/llm/json-schemas";
import {
  buildEnhanceSummarySystemPrompt,
  buildEnhanceSummaryUserPrompt,
} from "@/lib/llm/prompts/enhance-summary";
import {
  enhanceSummaryResponseSchema,
  type EnhanceSummaryResponse,
} from "@/lib/llm/schemas";

export class SummaryEnhancementError extends Error {
  constructor(
    message: string,
    public readonly causeCode:
      | "PARSE"
      | "VALIDATION"
      | "LLM"
      | "UNKNOWN" = "UNKNOWN"
  ) {
    super(message);
    this.name = "SummaryEnhancementError";
  }
}

export type EnhanceSummaryInput = {
  currentSummary: string;
};

export async function enhanceSummary(
  input: EnhanceSummaryInput
): Promise<EnhanceSummaryResponse> {
  const system = buildEnhanceSummarySystemPrompt();
  const user = buildEnhanceSummaryUserPrompt({
    currentSummary: input.currentSummary,
  });

  let raw: string;
  try {
    raw = await callGroqChatCompletion({
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      // Structured outputs: Groq enforces the JSON shape server-side
      jsonSchema: { name: "enhanced_summary", schema: SUMMARY_JSON_SCHEMA },
      temperature: 0.3,
    });
  } catch (e) {
    if (e instanceof Error) {
      throw new SummaryEnhancementError(e.message, "LLM");
    }
    throw new SummaryEnhancementError("Groq request failed", "LLM");
  }

  let parsed: unknown;
  try {
    parsed = parseModelJson(raw);
  } catch {
    throw new SummaryEnhancementError("Model output was not valid JSON", "PARSE");
  }
  const validated = enhanceSummaryResponseSchema.safeParse(parsed);
  if (!validated.success) {
    const detail = validated.error.issues
      .slice(0, 8)
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new SummaryEnhancementError(
      `Enhancement JSON failed validation${detail ? `: ${detail}` : ""}`,
      "VALIDATION"
    );
  }

  return validated.data;
}
