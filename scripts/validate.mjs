import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import {
  parseYamlObject,
  validateOpenAiSource,
  validateSkillSource,
} from "./validation-lib.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const skillsRoot = join(root, "skills");
const errors = [];
const skillFiles = [];
let collections = [];

try {
  collections = JSON.parse(
    readFileSync(join(root, "site-content", "collections.json"), "utf8"),
  );
} catch (error) {
  errors.push("site-content/collections.json: invalid JSON: " + error.message);
}

const collectionById = new Map(
  Array.isArray(collections)
    ? collections.map((collection) => [collection.id, collection])
    : [],
);

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(path);
    } else if (entry.name === "SKILL.md") {
      skillFiles.push(path);
    }
  }
}

if (existsSync(skillsRoot)) {
  walk(skillsRoot);
} else {
  errors.push("Missing skills directory.");
}

if (skillFiles.length === 0) {
  errors.push("No SKILL.md files found.");
}

let plugin = null;
try {
  plugin = JSON.parse(
    readFileSync(join(root, ".claude-plugin", "plugin.json"), "utf8"),
  );
} catch (error) {
  errors.push(".claude-plugin/plugin.json: invalid JSON: " + error.message);
}

const pluginSkills = Array.isArray(plugin?.skills) ? plugin.skills : [];
if (plugin && !Array.isArray(plugin.skills)) {
  errors.push(".claude-plugin/plugin.json: skills must be an array.");
}
if (new Set(pluginSkills).size !== pluginSkills.length) {
  errors.push(".claude-plugin/plugin.json: skill paths must be unique.");
}

const names = new Set();
const expectedPluginPaths = new Set();
const readme = readFileSync(join(root, "README.md"), "utf8");

for (const file of skillFiles.sort()) {
  const path = relative(root, file);
  const pathParts = path.split(/[\\/]/);
  const collectionId = pathParts[1];
  const stageId = pathParts[2];
  const content = readFileSync(file, "utf8");
  const result = validateSkillSource(content, basename(dirname(file)), path);
  errors.push(...result.errors);

  const name = result.metadata?.name;
  if (typeof name !== "string") {
    continue;
  }

  if (names.has(name)) {
    errors.push(path + ": duplicate skill name " + name + ".");
  }
  names.add(name);

  const collection = collectionById.get(collectionId);
  if (!collection) {
    errors.push(path + ": unknown collection directory " + collectionId + ".");
  } else if (!collection.stages?.some((stage) => stage.id === stageId)) {
    errors.push(path + ": unknown stage " + stageId + " for " + collectionId + ".");
  }
  if (result.metadata?.metadata?.collection !== collectionId) {
    errors.push(path + ": metadata.collection must match " + collectionId + ".");
  }

  const openAiPath = join(dirname(file), "agents", "openai.yaml");
  if (!existsSync(openAiPath)) {
    errors.push(path + ": missing agents/openai.yaml.");
  } else {
    const openAiLabel = relative(root, openAiPath);
    errors.push(
      ...validateOpenAiSource(
        readFileSync(openAiPath, "utf8"),
        name,
        result.metadata,
        openAiLabel,
      ),
    );
  }

  if (!readme.includes("[" + name + "]")) {
    errors.push("README.md: missing catalog entry for " + name + ".");
  }

  const pluginPath =
    "./" + relative(root, dirname(file)).split("\\").join("/");
  expectedPluginPaths.add(pluginPath);
  if (!pluginSkills.includes(pluginPath)) {
    errors.push(".claude-plugin/plugin.json: missing " + pluginPath + ".");
  }
}

for (const collection of collections) {
  const count = skillFiles.filter((file) =>
    relative(skillsRoot, file).split(/[\\/]/)[0] === collection.id
  ).length;
  if (count < 4) {
    errors.push(`site-content/collections.json: ${collection.id} needs at least four skills.`);
  }
}

for (const pluginPath of pluginSkills) {
  if (typeof pluginPath !== "string") {
    errors.push(".claude-plugin/plugin.json: every skill path must be a string.");
  } else if (!expectedPluginPaths.has(pluginPath)) {
    errors.push(".claude-plugin/plugin.json: unknown skill path " + pluginPath + ".");
  }
}

for (const match of readme.matchAll(/\]\(([^)]+)\)/g)) {
  const target = match[1];
  if (target.startsWith("http://") || target.startsWith("https://")) {
    continue;
  }
  const localPath = target.split("#")[0].split("?")[0];
  if (localPath && !existsSync(join(root, localPath))) {
    errors.push("README.md: broken local link " + target + ".");
  }
}

const workflowPath = join(root, ".github", "workflows", "validate.yml");
const workflowResult = parseYamlObject(
  readFileSync(workflowPath, "utf8"),
  relative(root, workflowPath),
);
errors.push(...workflowResult.errors);

if (errors.length > 0) {
  console.error("Validation failed:");
  for (const error of errors) {
    console.error("- " + error);
  }
  process.exit(1);
}

console.log("Validated " + skillFiles.length + " skills.");
