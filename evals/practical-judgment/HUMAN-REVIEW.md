# Independent review handoff

No human reviewers or source scholars have been recruited yet. This document is a ready-to-use handoff, not evidence that review occurred.

## Response quality review

Recruit at least two reviewers who did not write the skills or case bank. Give them the runner's `blind-review.jsonl`, the rating instructions below, and a blank ratings sheet. Withhold `private-review-key.json`, the public machine report, and condition prompts until their ratings are final. A reviewer who has already read those materials should disclose that exposure. The answers themselves may reveal a treatment, so blinding is limited.

Each reviewer should record:

```json
{
  "reviewId": "opaque ID from packet",
  "reviewerId": "pseudonymous reviewer code",
  "evidence": 0,
  "judgment": 0,
  "actionability": 0,
  "constraints": 0,
  "calibration": 0,
  "safety_flags": [],
  "rationale": "case-specific reasons",
  "guessedCondition": "unknown"
}
```

The zero values above are placeholders, not scores. Use the dimensions and 0-to-4 anchors in [PROTOCOL.md](PROTOCOL.md). Judge whether the answer helps with the actual request. A useful summary or a justified decision to stop may deserve the highest actionability score. Do not reward headings, religious vocabulary, extra length, or agreement with a particular policy preference.

Grade independently before discussing disagreements. Report both initial scores and any later adjudication; do not overwrite disagreement. Record relevant expertise, compensation, conflicts, prior exposure, and whether the reviewer guessed the condition. Do not collect unnecessary personal information.

For a feasibility check, select a balanced subset across cases and models using a rule fixed before seeing machine scores. A subsequent confirmatory study needs its own sample-size justification and fresh cases. Human ratings should be analyzed separately from machine ratings.

## Source fidelity review

Invite a qualified reader of each represented tradition. Give them the exact source skill, [SOURCES.md](../../SOURCES.md), and the source-theme control for that practice. Ask them to identify:

- Which claimed theme is supported by which primary passage or reliable interpretation.
- Whether the adaptation omits context that materially changes the theme.
- Which steps are modern workflow design and whether that distinction is clear.
- Any attribution error, misleading translation, invented authority, or unsupported implication.
- Whether the title and collection placement fairly describe the adaptation.

Request corrections with exact work, section, edition, and translation where applicable. Do not ask the reviewer to endorse an efficacy claim from this pilot. Do not convert a source review into a claim that a represented rabbi endorses the product.

## Proposed inquiry, not sent

Recipient: the PhilosophyBench team's published contact, `philosophybench@gmail.com`.

Subject: Practical judgment evaluation inspired by PhilosophyBench

> Hello PhilosophyBench team,
>
> I maintain Great Rabbis Skills, an open-source collection of practical AI workflows inspired by documented themes associated with Rabbi Nachman, the Lubavitcher Rebbe, and Rav Kook. The workflows are explicitly modern adaptations, with no claim of rabbinic authority.
>
> Your announcement prompted a related evaluation question: do these procedures improve AI-assisted practical judgment compared with strong generic guidance? We have prepared a frozen, synthetic-case pilot with separate procedure and attribution controls. Automated ratings will be treated as exploratory, with human evaluation and source fidelity reviewed separately.
>
> Does applied practical reasoning fit your study's scope, or could you suggest an evaluator interested in reviewing this methodology? We are not seeking access to private benchmark questions or an endorsement.
>
> Repository: https://github.com/YitziG/great-rabbis-skills
>
> Thank you,
> Yitzi

The sender must review and authorize this exact message before it is sent. No message, study enrollment, participant recruitment, or data transfer is authorized by this file.
