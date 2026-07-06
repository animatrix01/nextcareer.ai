/**
 * JSON Schema definitions for Groq structured outputs
 * (`response_format: { type: "json_schema" }`).
 *
 * These mirror the Zod schemas in `schemas.tsx`. Structured outputs make the
 * provider enforce the shape server-side, so model output arrives as
 * schema-valid JSON — eliminating flaky "Failed to validate JSON" /
 * "Model output was not valid JSON" errors.
 */

export type JsonSchemaObject = {
  type: "object";
  properties: Record<string, unknown>;
  required: string[];
  additionalProperties?: boolean;
};

const STRING_ARRAY = { type: "array", items: { type: "string" }, minItems: 1 };

// ── Roadmap ──────────────────────────────────────────────────────────────────
export const ROADMAP_JSON_SCHEMA: JsonSchemaObject = {
  type: "object",
  properties: {
    target_role: { type: "string" },
    estimated_duration: { type: "string" },
    phases: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          title: { type: "string" },
          duration: { type: "string" },
          description: { type: "string" },
          skills: STRING_ARRAY,
          actionItems: STRING_ARRAY,
        },
        required: ["id", "title", "duration", "description", "skills", "actionItems"],
      },
      maxItems: 6,
      minItems: 1,
    },
    weekly_breakdown: {
      type: "array",
      items: {
        type: "object",
        properties: {
          phase_id: { type: "integer" },
          week: { type: "integer" },
          focus: { type: "string" },
          tasks: STRING_ARRAY,
        },
        required: ["phase_id", "week", "focus", "tasks"],
      },
      maxItems: 12,
      minItems: 1,
    },
    skills_to_learn: { type: "array", items: { type: "string" }, maxItems: 12 },
    mini_projects: { type: "array", items: { type: "string" }, maxItems: 6 },
    resources: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          url: { type: "string" },
          type: { type: "string", enum: ["article", "course", "docs", "video", "book"] },
        },
        required: ["title"],
      },
      maxItems: 8,
    },
  },
  required: [
    "target_role",
    "estimated_duration",
    "phases",
    "weekly_breakdown",
    "skills_to_learn",
    "mini_projects",
  ],
};

// ── Resume analyzer (AI contextual pass) ─────────────────────────────────────
export const ANALYZER_JSON_SCHEMA: JsonSchemaObject = {
  type: "object",
  properties: {
    issues: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          category: { type: "string", enum: ["wording", "impact", "content"] },
          severity: { type: "string", enum: ["critical", "warning", "info"] },
          title: { type: "string" },
          problematicText: { type: "string" },
          whyItMatters: { type: "string" },
          suggestedImprovement: { type: "string" },
          canAIFix: { type: "boolean" },
        },
        required: ["id", "category", "severity", "title", "whyItMatters", "canAIFix"],
      },
    },
    overallTone: { type: "string" },
    strengthsIdentified: STRING_ARRAY,
  },
  required: ["issues"],
};

// ── Suggest skills ───────────────────────────────────────────────────────────
export const SKILLS_JSON_SCHEMA: JsonSchemaObject = {
  type: "object",
  properties: {
    suggested_skills: STRING_ARRAY,
  },
  required: ["suggested_skills"],
};

// ── Enhance summary ──────────────────────────────────────────────────────────
export const SUMMARY_JSON_SCHEMA: JsonSchemaObject = {
  type: "object",
  properties: {
    enhanced_summary: { type: "string" },
  },
  required: ["enhanced_summary"],
};
