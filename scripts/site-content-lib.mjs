export function stripFrontmatter(source) {
  return source
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "")
    .trimStart();
}

export function splitTitle(source, fallback) {
  const normalized = source.trimStart();
  const match = normalized.match(/^# (.+?)\r?\n/);
  if (!match) return { title: fallback, body: normalized.trim() };
  return {
    title: match[1].trim(),
    body: normalized.slice(match[0].length).trim(),
  };
}

export function renderPracticeDocument({ metadata, collection, label, invocation, title, body }) {
  const frontmatter = [
    "---",
    ...Object.entries({
      id: metadata.name,
      title,
      slug: `/${metadata.name}`,
      sidebar_label: title,
      description: metadata.description,
    }).map(([key, value]) => `${key}: ${JSON.stringify(value)}`),
    "---",
  ].join("\n");

  return [
    frontmatter,
    'import PracticeHeader from "@site/src/components/PracticeHeader";',
    "",
    `<PracticeHeader name={${JSON.stringify(metadata.name)}} collection={${JSON.stringify(collection.name)}} collectionPath={${JSON.stringify(`/${collection.id}`)}} category={${JSON.stringify(label)}} invocation={${JSON.stringify(invocation)}} description={${JSON.stringify(metadata.description)}} />`,
    "",
    body,
    "",
  ].join("\n");
}
