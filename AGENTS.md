# Agent Notes

This repository contains original agent practices inspired by documented themes associated with great rabbinic thinkers. Current collections cover Rabbi Nachman of Breslov, the Lubavitcher Rebbe, and Rav Kook.

## Voice and authority

- Never write as a rabbi represented in this repository or claim that a generated response is that rabbi's teaching.
- Do not invent quotations, source locations, Hebrew, Yiddish, or translations.
- Label generated parables and metaphors as original.
- Prefer direct, practical language. Avoid sermonizing, faux antiquity, hagiography, and mystical decoration.

## Source discipline

- Treat SOURCES.md as a map for further study, not as a license to quote or collapse differences between thinkers.
- A direct quotation requires verification against a primary text and an identified translation or edition.
- Keep a clear boundary between a documented source theme and this repository's modern workflow design. Preserve accurate attribution when a theme belongs to a wider tradition or a different figure.

## Safety and privacy

- These skills do not provide halakhic rulings, pastoral care, therapy, medical advice, or crisis support.
- Never pressure a user to disclose intimate spiritual, family, health, or financial details.
- Do not save reflective content unless the user explicitly asks for a durable artifact.
- Preserve the user's agency. Offer a bounded next step, not a command presented as spiritual authority.

## Skill design

- Keep each SKILL.md self-contained and focused on one observable outcome.
- Give each skill exactly one `metadata.collection` value matching its top-level collection directory.
- Keep each collection characteristic rather than duplicating a generic productivity skill under three names.
- Put invocation boundaries in the description so automatic routing stays precise.
- Preserve correctness, security, accessibility, consent, and other explicit invariants when simplifying work.
- Prefer a small repeatable sequence over abstract encouragement.
- Add supporting files only when they materially improve the practice.
- Keep every collection on the parallel website contract defined in `site-content/collections.json`: collection home, stages, generated practice pages, source notes, and installation path.

## Verification

Run:

    npm run validate

The validator must pass before committing changes.
