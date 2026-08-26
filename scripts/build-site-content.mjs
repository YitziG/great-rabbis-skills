import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseYamlObject } from "./validation-lib.mjs";
import {
  renderPracticeDocument,
  splitTitle,
  stripFrontmatter,
} from "./site-content-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const generatedRoot = path.join(root, ".generated");
const projectRoot = path.join(generatedRoot, "project");
const summaryPath = path.join(root, "site-content", "practice-summaries.json");
const collectionsPath = path.join(root, "site-content", "collections.json");

function frontmatter(values) {
  return [
    "---",
    ...Object.entries(values).map(([key, value]) => `${key}: ${JSON.stringify(value)}`),
    "---",
  ].join("\n");
}

await rm(generatedRoot, { recursive: true, force: true });
await mkdir(projectRoot, { recursive: true });

const summaries = JSON.parse(await readFile(summaryPath, "utf8"));
const collections = JSON.parse(await readFile(collectionsPath, "utf8"));
const manifest = [];

for (const collection of collections) {
  const collectionRoot = path.join(generatedRoot, "collections", collection.id);
  await mkdir(collectionRoot, { recursive: true });

  for (const [stageIndex, stage] of collection.stages.entries()) {
    const sourceCategory = path.join(root, "skills", collection.id, stage.id);
    const outputCategory = path.join(collectionRoot, stage.id);
    await mkdir(outputCategory, { recursive: true });
    await writeFile(
      path.join(outputCategory, "_category_.json"),
      `${JSON.stringify({ label: stage.name, position: stageIndex + 1, collapsed: false }, null, 2)}\n`,
    );

    const entries = await readdir(sourceCategory, { withFileTypes: true });
    for (const entry of entries.filter((item) => item.isDirectory())) {
      const sourcePath = path.join(sourceCategory, entry.name, "SKILL.md");
      const source = await readFile(sourcePath, "utf8");
      const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
      if (!match) throw new Error(`${sourcePath}: missing frontmatter`);
      const parsed = parseYamlObject(match[1], `${sourcePath} frontmatter`);
      if (parsed.errors.length || !parsed.value) {
        throw new Error(parsed.errors.join("\n"));
      }

      const metadata = parsed.value;
      if (metadata.metadata?.collection !== collection.id) {
        throw new Error(`${sourcePath}: metadata.collection must be ${collection.id}`);
      }
      const { title, body } = splitTitle(stripFrontmatter(source), metadata.name);
      const invocation = metadata["disable-model-invocation"]
        ? "Explicit"
        : "Automatic or explicit";
      const curated = summaries[metadata.name];
      if (!curated) {
        throw new Error(`${summaryPath}: missing summary for ${metadata.name}`);
      }
      if (typeof curated.summary !== "string" || !curated.summary.trim()) {
        throw new Error(`${summaryPath}: ${metadata.name} needs a non-empty summary`);
      }
      if (!Number.isInteger(curated.order) || curated.order < 1) {
        throw new Error(`${summaryPath}: ${metadata.name} needs a positive integer order`);
      }

      const document = renderPracticeDocument({
        metadata,
        collection,
        label: stage.name,
        invocation,
        title,
        body,
      });
      await writeFile(path.join(outputCategory, `${metadata.name}.mdx`), document);
      manifest.push({
        name: metadata.name,
        title,
        collection: collection.id,
        collectionName: collection.name,
        category: stage.id,
        categoryLabel: stage.name,
        description: metadata.description,
        summary: curated.summary,
        order: curated.order,
        invocation,
      });
    }
  }
}

const skillNames = new Set(manifest.map((practice) => practice.name));
const extraSummaries = Object.keys(summaries).filter((name) => !skillNames.has(name));
if (extraSummaries.length) {
  throw new Error(`${summaryPath}: summaries without skills: ${extraSummaries.join(", ")}`);
}
await writeFile(
  path.join(generatedRoot, "practice-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

for (const [sourceName, outputName, slug, fallbackTitle] of [
  ["CONTEXT.md", "glossary.md", "/glossary", "Shared Language"],
  ["SOURCES.md", "sources.md", "/sources", "Source Notes"],
]) {
  const source = await readFile(path.join(root, sourceName), "utf8");
  const { title, body } = splitTitle(source, fallbackTitle);
  await writeFile(
    path.join(projectRoot, outputName),
    `${frontmatter({ title, slug })}\n\n${body}\n`,
  );
}

console.log(`Generated ${manifest.length} practice pages across ${collections.length} collections.`);
