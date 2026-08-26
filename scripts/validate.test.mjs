import assert from "node:assert/strict";
import test from "node:test";
import {
  validateOpenAiSource,
  validateSkillSource,
} from "./validation-lib.mjs";

function skillSource(name, description, extra = []) {
  return [
    "---",
    "name: " + name,
    ...description,
    ...extra,
    "---",
    "# Test",
    "",
    "Useful instructions.",
  ].join("\n");
}

test("accepts valid unquoted and folded descriptions", () => {
  const source = skillSource("valid-skill", [
    "description: >-",
    "  Does one useful thing.",
    "  Use when the matching situation appears.",
  ]);
  const result = validateSkillSource(
    source,
    "valid-skill",
    "valid-skill/SKILL.md",
  );
  assert.deepEqual(result.errors, []);
});

test("rejects malformed YAML", () => {
  const source = skillSource("valid-skill", ["description: [not closed"]);
  const result = validateSkillSource(
    source,
    "valid-skill",
    "valid-skill/SKILL.md",
  );
  assert.ok(result.errors.some((error) => error.includes("invalid YAML")));
});

test("rejects names outside the Agent Skills specification", () => {
  const invalidNames = [
    "-leading",
    "trailing-",
    "two--hyphens",
    "Uppercase",
    "a".repeat(65),
  ];

  for (const name of invalidNames) {
    const source = skillSource(name, [
      "description: A valid description for an invalid skill name.",
    ]);
    const result = validateSkillSource(source, name, name + "/SKILL.md");
    assert.ok(result.errors.some((error) => error.includes("name")));
  }
});

test("rejects descriptions over 1024 characters", () => {
  const source = skillSource("valid-skill", [
    "description: " + "a".repeat(1025),
  ]);
  const result = validateSkillSource(
    source,
    "valid-skill",
    "valid-skill/SKILL.md",
  );
  assert.ok(result.errors.some((error) => error.includes("1024")));
});

test("rejects unsupported frontmatter keys", () => {
  const source = skillSource(
    "valid-skill",
    ["description: A valid description for this skill."],
    ["disable-model-invocation: true", "invented-policy: true"],
  );
  const result = validateSkillSource(
    source,
    "valid-skill",
    "valid-skill/SKILL.md",
  );
  assert.ok(result.errors.some((error) => error.includes("invented-policy")));
});

test("validates optional frontmatter field types", () => {
  const source = skillSource(
    "valid-skill",
    ["description: A valid description for this skill."],
    [
      "license:",
      "  - MIT",
      "metadata: not-a-mapping",
      "allowed-tools:",
      "  - Read",
    ],
  );
  const result = validateSkillSource(
    source,
    "valid-skill",
    "valid-skill/SKILL.md",
  );
  assert.ok(result.errors.some((error) => error.includes("license")));
  assert.ok(result.errors.some((error) => error.includes("metadata")));
  assert.ok(result.errors.some((error) => error.includes("allowed-tools")));
});

test("permits ordinary prose about TODO comments", () => {
  const source =
    skillSource("valid-skill", [
      "description: A valid description for this skill.",
    ]) + "\nExplain how to review TODO comments.";
  const result = validateSkillSource(
    source,
    "valid-skill",
    "valid-skill/SKILL.md",
  );
  assert.deepEqual(result.errors, []);
});

test("requires Claude and OpenAI explicit-only policies to agree", () => {
  const skillMetadata = {
    name: "valid-skill",
    description: "A useful description.",
    "disable-model-invocation": true,
  };
  const matching = [
    "interface:",
    '  display_name: "Valid Skill"',
    '  short_description: "A sufficiently long description"',
    '  default_prompt: "Use $valid-skill for this request."',
    "policy:",
    "  allow_implicit_invocation: false",
  ].join("\n");
  const mismatched = matching.replace(
    "allow_implicit_invocation: false",
    "allow_implicit_invocation: true",
  );

  assert.deepEqual(
    validateOpenAiSource(
      matching,
      "valid-skill",
      skillMetadata,
      "openai.yaml",
    ),
    [],
  );
  assert.ok(
    validateOpenAiSource(
      mismatched,
      "valid-skill",
      skillMetadata,
      "openai.yaml",
    ).some((error) => error.includes("disagree")),
  );
});

test("rejects malformed OpenAI metadata", () => {
  const errors = validateOpenAiSource(
    "interface: [not closed",
    "valid-skill",
    { name: "valid-skill", description: "A useful description." },
    "openai.yaml",
  );
  assert.ok(errors.some((error) => error.includes("invalid YAML")));
});

test("requires a complete skill token in the default prompt", () => {
  const source = [
    "interface:",
    '  display_name: "Valid Skill"',
    '  short_description: "A sufficiently long description"',
    '  default_prompt: "Use $valid-skill-extra for this request."',
    "policy:",
    "  allow_implicit_invocation: true",
  ].join("\n");
  const errors = validateOpenAiSource(
    source,
    "valid-skill",
    { name: "valid-skill", description: "A useful description." },
    "openai.yaml",
  );
  assert.ok(errors.some((error) => error.includes("$valid-skill")));
});
