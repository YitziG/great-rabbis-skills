import assert from "node:assert/strict";
import test from "node:test";
import {
  renderPracticeDocument,
  splitTitle,
  stripFrontmatter,
} from "./site-content-lib.mjs";

test("extracts the source title after frontmatter and leading whitespace", () => {
  const source = [
    "---",
    "name: begin-again",
    "description: Begin again.",
    "---",
    "",
    "# Begin Again",
    "",
    "Keep the evidence.",
  ].join("\n");

  assert.deepEqual(splitTitle(stripFrontmatter(source), "begin-again"), {
    title: "Begin Again",
    body: "Keep the evidence.",
  });
});

test("serializes quoted and multiline metadata as valid JSX expressions", () => {
  const document = renderPracticeDocument({
    metadata: {
      name: "quoted-practice",
      description: 'Choose one "honest" step.\nThen return.',
    },
    collection: {
      name: "Test Collection",
      id: "test-collection",
    },
    label: "Start",
    invocation: "Explicit",
    title: "Quoted Practice",
    body: "Useful instructions.",
  });

  assert.match(document, /name=\{"quoted-practice"\}/);
  assert.match(document, /collection=\{"Test Collection"\}/);
  assert.match(document, /description=\{"Choose one \\"honest\\" step\.\\nThen return\."\}/);
  assert.doesNotMatch(document, /description="Choose one "honest"/);
});
