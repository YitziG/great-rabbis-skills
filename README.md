# Great Rabbis Skills

**Source-grounded practices for work, judgment, and renewal.**

What might great rabbinic thinkers have encoded if the agent-skill format had been available to them?

This repository offers one careful, imaginative answer. It translates characteristic themes associated with Rabbi Nachman of Breslov, the Lubavitcher Rebbe, and Rav Kook into small workflows with concrete outputs. The skills are original modern syntheses—not recovered teachings, simulated personalities, or claims to rabbinic authority.

[Explore the website](https://great-rabbis-skills.vercel.app) · [Read the source policy](SOURCES.md) · [See how the project works](site-docs/explanation/practices-not-teachings.md)

## Install

List every available skill:

    npx skills@latest add YitziG/great-rabbis-skills --list

Install interactively:

    npx skills@latest add YitziG/great-rabbis-skills

Choose individual practices:

    npx skills@latest add YitziG/great-rabbis-skills --skill begin-again --skill bottom-line-action --skill fourfold-song

Install globally for Codex:

    npx skills@latest add YitziG/great-rabbis-skills -g -a codex

For local Claude Code plugin use, clone the repository and launch Claude from its root:

    claude --plugin-dir .

## The three collections

### Rabbi Nachman of Breslov

Find the living point and begin again. These practices work with renewal, concrete good points, courage, simplicity, private reflection, and story.

| Skill | Invocation | What it does |
| --- | --- | --- |
| [find-a-practice](skills/rabbi-nachman/start/find-a-practice/SKILL.md) | Explicit | Routes the moment to the smallest fitting practice. |
| [begin-again](skills/rabbi-nachman/start/begin-again/SKILL.md) | Automatic or explicit | Restarts stalled work without erasing what it taught. |
| [longing-to-plan](skills/rabbi-nachman/start/longing-to-plan/SKILL.md) | Automatic or explicit | Turns aspiration into outcome, boundary, and next action. |
| [hitbodedut-brief](skills/rabbi-nachman/steady/hitbodedut-brief/SKILL.md) | Explicit | Guides an off-chat reflection without asking for the answers. |
| [nekudah-tovah](skills/rabbi-nachman/steady/nekudah-tovah/SKILL.md) | Automatic or explicit | Finds concrete good points before choosing a plan. |
| [simple-path](skills/rabbi-nachman/steady/simple-path/SKILL.md) | Automatic or explicit | Simplifies a plan while preserving what must remain true. |
| [narrow-bridge](skills/rabbi-nachman/restore/narrow-bridge/SKILL.md) | Automatic or explicit within its stated boundary | Chooses a reversible brave step with stop conditions. |
| [simchah-check](skills/rabbi-nachman/restore/simchah-check/SKILL.md) | Explicit | Adds one honest source of ease, energy, or play. |
| [good-point-retro](skills/rabbi-nachman/restore/good-point-retro/SKILL.md) | Automatic or explicit | Runs a blameless retrospective oriented toward renewal. |
| [story-seed](skills/rabbi-nachman/communicate/story-seed/SKILL.md) | Explicit | Creates a labeled original parable, then extracts options. |

### The Lubavitcher Rebbe

Find the mission here, then bring it into action. These practices work with situated responsibility, concrete deeds, person-by-person outreach, capability building, and constructive use of technology.

| Skill | Invocation | What it does |
| --- | --- | --- |
| [mission-from-here](skills/lubavitcher-rebbe/orient/mission-from-here/SKILL.md) | Automatic or explicit | Finds the useful responsibility uniquely reachable from here. |
| [bottom-line-action](skills/lubavitcher-rebbe/act/bottom-line-action/SKILL.md) | Automatic or explicit | Turns a worthy idea into one owned, observable deed. |
| [one-more-good-deed](skills/lubavitcher-rebbe/act/one-more-good-deed/SKILL.md) | Automatic or explicit | Replaces all-or-nothing improvement with one complete addition. |
| [reach-the-one](skills/lubavitcher-rebbe/reach/reach-the-one/SKILL.md) | Automatic or explicit | Designs outreach around one person's benefit and agency. |
| [make-a-lamplighter](skills/lubavitcher-rebbe/multiply/make-a-lamplighter/SKILL.md) | Automatic or explicit | Turns expert help into transferable capability. |
| [use-the-medium](skills/lubavitcher-rebbe/multiply/use-the-medium/SKILL.md) | Automatic or explicit | Adapts constructive work to technology without losing its substance. |

### Rav Kook

Return to the source, widen the frame, and create. These practices work with authenticity, multiple scales of belonging, integration, principled balance, root renewal, and imagination.

| Skill | Invocation | What it does |
| --- | --- | --- |
| [return-to-self](skills/rav-kook/listen/return-to-self/SKILL.md) | Explicit | Separates authentic direction from borrowed pressure. |
| [fourfold-song](skills/rav-kook/listen/fourfold-song/SKILL.md) | Automatic or explicit | Hears a decision across self, community, humanity, and world. |
| [whole-from-parts](skills/rav-kook/integrate/whole-from-parts/SKILL.md) | Automatic or explicit | Recovers valid concerns and builds a wider frame. |
| [justice-and-mercy](skills/rav-kook/integrate/justice-and-mercy/SKILL.md) | Automatic or explicit | Holds a fair standard together with humane context. |
| [root-cause-return](skills/rav-kook/renew/root-cause-return/SKILL.md) | Automatic or explicit | Repairs recurring failure by restoring a healthy source condition. |
| [responsible-imagination](skills/rav-kook/create/responsible-imagination/SKILL.md) | Explicit | Gives a creative possibility an ethical, practical form. |

## The quality standard

Every skill must:

- Solve a recurring situation rather than decorate a favorite quotation.
- Produce an observable artifact: a decision frame, action, handoff, repair, or experiment.
- Preserve the user's agency, privacy, consent, and existing safety constraints.
- Name its activation boundary precisely enough for responsible automatic use.
- Distinguish a documented source theme from the repository author's modern workflow design.
- Avoid invented quotations, Hebrew, translations, source locations, and claims of spiritual authority.

## What this is not

- Not a persona for Rabbi Nachman, the Rebbe, Rav Kook, or any other religious figure.
- Not a source of halakhic rulings, pastoral care, therapy, medical advice, or crisis support.
- Not a substitute for learning their work in context with qualified teachers and reliable editions.
- Not a claim that these figures would endorse these particular workflows, technologies, or applications.
- Not permission to convert spiritual language into pressure, surveillance, unsolicited outreach, or unapproved action.

## Sources and authorship

[SOURCES.md](SOURCES.md) maps each collection to the themes and texts that informed it. It deliberately paraphrases rather than quoting. A direct quotation requires a verified primary work, section, edition, translator, exact wording, and contextual reason to include it.

The repository structure was inspired by [Matt Pocock's skills collection](https://github.com/mattpocock/skills): direct installation, small composable skills, and clear invocation rules. The workflow steps, explanatory prose, source boundaries, and visual system in this repository are original.

## Develop the website

The Docusaurus site has one shared front door and a parallel microsite for each rabbinic collection. Published practice pages are generated from the canonical `SKILL.md` files; do not edit `.generated/` directly.

    npm ci
    npm run dev

Validate skills, metadata, source maps, tests, and the production build:

    npm run validate

## Contributing and security

Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a practice. Please report security issues through [GitHub private vulnerability reporting](https://github.com/YitziG/great-rabbis-skills/security/advisories/new), not through a public issue.

Released under the [MIT License](LICENSE), which covers this repository's original code and prose. Linked third-party texts and translations remain under their own terms. Rabbinic names are used descriptively; no affiliation, endorsement, or authorization is claimed.
