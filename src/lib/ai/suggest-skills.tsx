import { callGroqChatCompletion } from "@/lib/llm/client";
import { parseModelJson } from "@/lib/llm/json-utils";
import { SKILLS_JSON_SCHEMA } from "@/lib/llm/json-schemas";
import {
  buildSuggestSkillsSystemPrompt,
  buildSuggestSkillsUserPrompt,
} from "@/lib/llm/prompts/suggest-skills";
import {
  suggestSkillsResponseSchema,
  type SuggestSkillsResponse,
} from "@/lib/llm/schemas";

export class SkillSuggestionError extends Error {
  constructor(
    message: string,
    public readonly causeCode:
      | "PARSE"
      | "VALIDATION"
      | "LLM"
      | "UNKNOWN" = "UNKNOWN"
  ) {
    super(message);
    this.name = "SkillSuggestionError";
  }
}

export type SuggestSkillsInput = {
  jobTitle: string;
  currentSkills: string[];
};

export async function suggestSkills(
  input: SuggestSkillsInput
): Promise<SuggestSkillsResponse> {
  const system = buildSuggestSkillsSystemPrompt();
  const user = buildSuggestSkillsUserPrompt({
    jobTitle: input.jobTitle,
    currentSkills: input.currentSkills,
  });

  let raw: string;
  try {
    raw = await callGroqChatCompletion({
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      // Structured outputs: Groq enforces the JSON shape server-side
      jsonSchema: { name: "suggested_skills", schema: SKILLS_JSON_SCHEMA },
      temperature: 0.4,
    });
  } catch (e) {
    if (e instanceof Error) {
      throw new SkillSuggestionError(e.message, "LLM");
    }
    throw new SkillSuggestionError("Groq request failed", "LLM");
  }

  let parsed: unknown;
  try {
    parsed = parseModelJson(raw);
  } catch {
    throw new SkillSuggestionError("Model output was not valid JSON", "PARSE");
  }
  const validated = suggestSkillsResponseSchema.safeParse(parsed);
  if (!validated.success) {
    const detail = validated.error.issues
      .slice(0, 8)
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new SkillSuggestionError(
      `Skill suggestions JSON failed validation${detail ? `: ${detail}` : ""}`,
      "VALIDATION"
    );
  }

  return validated.data;
}
