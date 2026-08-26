# Use Docusaurus with parallel collection maps

The site uses Docusaurus because the library needs a content-first static site, React-level control for collection maps, and a credible path to search and Hebrew/RTL support without splitting installable skills from their documentation.

The public front door routes visitors among rabbinic collections. Each collection then uses its own situation-led map because the thinkers organize attention differently; forcing one taxonomy across all collections would imply a false equivalence. Diataxis still supplies the shared reader-oriented documentation modes.

Collection definitions live in `site-content/collections.json`. Practice pages and the public manifest are generated from canonical `SKILL.md` files so the website cannot become a second operational source of truth.
