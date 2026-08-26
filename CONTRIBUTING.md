# Contributing

Keep additions small, useful, source-honest, and characteristic of the collection they join.

1. Start with a recurring moment that needs a practice, not with a favorite quotation.
2. Define one observable outcome.
3. Write a discriminating description that says when the skill should activate.
4. Make the sequence short enough to hold in working memory.
5. Add a boundary for privacy, authority, or high-stakes use when relevant.
6. Identify the collection in `metadata.collection`; do not duplicate a generic workflow to fill a catalog.
7. Update the catalog, source map, and `site-content/collections.json` only when their public maps change.
8. Run `npm run validate` and the bundled skill validator for every new skill.

Do not add invented teachings, unlabeled imitations, hagiographic filler, culture-war content, or a new dependency when plain instructions are sufficient.

For a new rabbinic collection, open a proposal first. It must name a distinctive operating logic, reliable starting sources, at least four non-overlapping skill situations, likely attribution traps, and the public value not already covered by an existing collection.

Validation covers both the skill library and the generated documentation site. Practice pages come from `SKILL.md`; never edit `.generated/` directly. Human-facing tutorials, how-to guides, and explanations live under `site-docs/`.
