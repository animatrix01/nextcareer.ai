import { callGroqChatCompletion } from "@/lib/llm/client";
import { parseModelJson } from "@/lib/llm/json-utils";
import { ROADMAP_JSON_SCHEMA } from "@/lib/llm/json-schemas";
import {
  buildRoadmapSystemPrompt,
  buildRoadmapUserPrompt,
} from "@/lib/llm/prompts/roadmap";
import {
  roadmapGenerationResultSchema,
  type RoadmapGenerationResult,
} from "@/lib/llm/schemas";

export class RoadmapGenerationError extends Error {
  constructor(
    message: string,
    public readonly causeCode:
      | "PARSE"
      | "VALIDATION"
      | "LLM"
      | "UNKNOWN" = "UNKNOWN"
  ) {
    super(message);
    this.name = "RoadmapGenerationError";
  }
}

export type GenerateRoadmapInput = {
  targetRole: string;
  currentSkills: string[];
};

export async function generateRoadmap(
  input: GenerateRoadmapInput
): Promise<RoadmapGenerationResult> {
  const system = buildRoadmapSystemPrompt();
  const user = buildRoadmapUserPrompt({
    targetRole: input.targetRole,
    currentSkills: input.currentSkills,
  });

  let raw: string;
  try {
    raw = await callGroqChatCompletion({
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      // Structured outputs: Groq enforces the JSON shape server-side,
      // eliminating flaky "Model output was not valid JSON" failures.
      jsonSchema: { name: "roadmap", schema: ROADMAP_JSON_SCHEMA },
      temperature: 0.35,
    });
  } catch (e) {
    if (e instanceof Error) {
      throw new RoadmapGenerationError(e.message, "LLM");
    }
    throw new RoadmapGenerationError("Groq request failed", "LLM");
  }

  let parsed: unknown;
  try {
    parsed = parseModelJson(raw);
  } catch {
    throw new RoadmapGenerationError("Model output was not valid JSON", "PARSE");
  }
  const validated = roadmapGenerationResultSchema.safeParse(parsed);
  if (!validated.success) {
    const detail = validated.error.issues
      .slice(0, 8)
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new RoadmapGenerationError(
      `Roadmap JSON failed validation${detail ? `: ${detail}` : ""}`,
      "VALIDATION"
    );
  }

  return validated.data;
}
