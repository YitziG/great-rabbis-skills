import { parseDocument } from "yaml";

export function parseYamlObject(source, label) {
  const document = parseDocument(source, { uniqueKeys: true });
  const errors = document.errors.map(
    (issue) => label + ": invalid YAML: " + issue.message.split("\n")[0],
  );

  if (errors.length > 0) {
    return { errors, value: null };
  }

  const value = document.toJS();
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    errors.push(label + ": YAML root must be a mapping.");
    return { errors, value: null };
  }

  return { errors, value };
}

export function validateSkillSource(source, directoryName, label) {
  const errors = [];
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);

  if (!match) {
    return {
      errors: [label + ": missing YAML frontmatter."],
      metadata: null,
    };
  }

  const parsed = parseYamlObject(match[1], label + " frontmatter");
  errors.push(...parsed.errors);
  if (!parsed.value) {
    return { errors, metadata: null };
  }

  const metadata = parsed.value;
  const name = metadata.name;
  const description = metadata.description;
  const allowedKeys = new Set([
    "name",
    "description",
    "license",
    "compatibility",
    "metadata",
    "allowed-tools",
    "disable-model-invocation",
  ]);

  for (const key of Object.keys(metadata)) {
    if (!allowedKeys.has(key)) {
      errors.push(label + ": unsupported frontmatter key " + key + ".");
    }
  }

  if (typeof name !== "string") {
    errors.push(label + ": name must be a string.");
  } else {
    if (name.length < 1 || name.length > 64) {
      errors.push(label + ": name must contain 1-64 characters.");
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
      errors.push(
        label +
          ": name must use lowercase letters, numbers, and single internal hyphens.",
      );
    }
    if (name !== directoryName) {
      errors.push(label + ": name must match its directory.");
    }
  }

  if (typeof description !== "string" || description.trim().length === 0) {
    errors.push(label + ": description must be a non-empty string.");
  } else if (description.length > 1024) {
    errors.push(label + ": description must not exceed 1024 characters.");
  }

  if (
    metadata["disable-model-invocation"] !== undefined &&
    typeof metadata["disable-model-invocation"] !== "boolean"
  ) {
    errors.push(label + ": disable-model-invocation must be a boolean.");
  }

  if (
    metadata.compatibility !== undefined &&
    (typeof metadata.compatibility !== "string" ||
      metadata.compatibility.length > 500)
  ) {
    errors.push(
      label + ": compatibility must be a string of at most 500 characters.",
    );
  }

  if (
    metadata.license !== undefined &&
    typeof metadata.license !== "string"
  ) {
    errors.push(label + ": license must be a string.");
  }

  if (
    metadata["allowed-tools"] !== undefined &&
    typeof metadata["allowed-tools"] !== "string"
  ) {
    errors.push(label + ": allowed-tools must be a space-delimited string.");
  }

  if (metadata.metadata !== undefined) {
    if (
      !metadata.metadata ||
      typeof metadata.metadata !== "object" ||
      Array.isArray(metadata.metadata)
    ) {
      errors.push(label + ": metadata must be a string-to-string mapping.");
    } else if (
      Object.values(metadata.metadata).some(
        (value) => typeof value !== "string",
      )
    ) {
      errors.push(label + ": metadata values must be strings.");
    }
  }

  if (source.includes("[TODO")) {
    errors.push(label + ": contains unfinished TODO text.");
  }

  return { errors, metadata };
}

export function validateOpenAiSource(source, skillName, skillMetadata, label) {
  const parsed = parseYamlObject(source, label);
  const errors = [...parsed.errors];
  if (!parsed.value) {
    return errors;
  }

  const metadata = parsed.value;
  const skillInterface = metadata.interface;
  const policy = metadata.policy;

  if (!skillInterface || typeof skillInterface !== "object") {
    errors.push(label + ": interface must be a mapping.");
  } else {
    if (
      typeof skillInterface.display_name !== "string" ||
      skillInterface.display_name.trim().length === 0
    ) {
      errors.push(label + ": interface.display_name is required.");
    }

    if (
      typeof skillInterface.short_description !== "string" ||
      skillInterface.short_description.length < 25 ||
      skillInterface.short_description.length > 64
    ) {
      errors.push(
        label + ": interface.short_description must contain 25-64 characters.",
      );
    }

    const promptPattern = new RegExp(
      "\\$" + skillName + "(?![a-z0-9-])",
    );
    if (
      typeof skillInterface.default_prompt !== "string" ||
      !promptPattern.test(skillInterface.default_prompt)
    ) {
      errors.push(
        label + ": interface.default_prompt must explicitly mention $" + skillName + ".",
      );
    }

    if (
      skillInterface.brand_color !== undefined &&
      (typeof skillInterface.brand_color !== "string" ||
        !/^#[0-9A-Fa-f]{6}$/.test(skillInterface.brand_color))
    ) {
      errors.push(label + ": interface.brand_color must be a six-digit hex color.");
    }
  }

  if (
    !policy ||
    typeof policy !== "object" ||
    typeof policy.allow_implicit_invocation !== "boolean"
  ) {
    errors.push(
      label + ": policy.allow_implicit_invocation must be a boolean.",
    );
    return errors;
  }

  const claudeExplicit =
    skillMetadata?.["disable-model-invocation"] === true;
  const openAiExplicit = policy.allow_implicit_invocation === false;

  if (claudeExplicit !== openAiExplicit) {
    errors.push(
      label +
        ": Claude and OpenAI invocation policies disagree for " +
        skillName +
        ".",
    );
  }

  return errors;
}
