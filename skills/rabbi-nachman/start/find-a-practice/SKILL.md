---
name: find-a-practice
metadata:
  collection: "rabbi-nachman"
description: "Route a stuck, heavy, unclear, or creatively blocked moment to the smallest fitting Nekudah practice. Use only when the user explicitly asks which practice or flow to use."
disable-model-invocation: true
---

# Find A Practice

Choose one practice that fits the real constraint. Do not turn the catalog into a personality test.

## Route by signal

| Signal in the user's situation | Primary practice |
| --- | --- |
| A task has stalled, failed repeatedly, or feels spoiled | begin-again |
| An aspiration is meaningful but vague | longing-to-plan |
| The user wants an off-chat structured pause | hitbodedut-brief |
| Failure or criticism has hidden all evidence of progress | nekudah-tovah |
| The plan is heavier than the outcome | simple-path |
| Fear or avoidance is blocking a necessary move | narrow-bridge |
| The work is joyless and energy is collapsing | simchah-check |
| A completed attempt needs learning without blame | good-point-retro |
| Direct explanation is not opening new options | story-seed |

## Decide

1. Name the dominant constraint in one sentence using the user's own language.
2. Pick exactly one primary practice.
3. Add one secondary practice only when it clearly follows the first.
4. Explain the choice in no more than three sentences.
5. Check whether the chosen skill is available in the current skill catalog.
6. Give a ready-to-use invocation. If the skill is unavailable, give the exact install command instead.

## Output

Return:

- **What seems stuck:** one factual sentence.
- **Use:** the skill name and why it fits.
- **Try:** a one-sentence prompt beginning with Use $skill-name.
- **Install first:** when needed, `npx skills@latest add YitziG/great-rabbis-skills --skill skill-name`.
- **Then, if needed:** an optional second skill, or omit this line.

This router recommends; it does not execute another practice. Never assume that sibling skills were installed with it.

Do not route urgent safety, medical, legal, financial, halakhic, or pastoral decisions into a reflective practice as though it were expert care.
