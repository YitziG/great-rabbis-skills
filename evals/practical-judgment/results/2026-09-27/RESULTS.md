# Practical judgment pilot results

The three tested skills did not improve machine-rated response quality over a strong generic checklist. The original skills averaged 3.838/4 and the checklist 3.884/4. The primary paired difference was **−0.0467 points**, with a descriptive case-bootstrap 95% interval of **[−0.0822, −0.0111]**. This falls below the predeclared +0.25 threshold. It is a small negative result under these settings, not a measurement of human benefit or the value of Jewish thought.

## What ran

The [protocol](../../PROTOCOL.md), cases, prompts, and executable evaluation code were published at commit [`d8c3664`](https://github.com/YitziG/great-rabbis-skills/commit/d8c3664eab1bbad59dedbd21aaf798787e15c6a5) before the first paid generation. The original skills remain unchanged at source commit [`4240a0c`](https://github.com/YitziG/great-rabbis-skills/commit/4240a0cb231671c7be01863585fae25a0d92ee7d). No frozen inputs or scoring code changed after generation began.

The study used 30 synthetic cases across begin-again, bottom-line-action, and justice-and-mercy. A separate AI author wrote the cases without reading the skill contents or treatment prompts. Two fixed models, GPT-5.4 and GPT-5.4-mini, answered each case in five conditions with three repetitions. Both used reasoning effort `none`, with no tools, browsing, or memory. GPT-5.4-mini graded the answers with condition and model labels withheld. It saw the scenarios and evaluation notes. Answer content could reveal the treatment.

Of 900 attempted generations, 899 completed and were graded. One base-condition A request had an uncertain outcome. Its full cost reservation remains charged and it was not retried. The operator resumed only unattempted cells. The overall coverage gate is therefore incomplete, while all **180 E-versus-B pairs across all 30 cases** are available. The missing output does not remove a primary-comparison pair.

Total conservative API accounting was **$5.232292 of the $25 cap**, including generation, smoke requests, and grading. This estimate uses standard token rates and charges the uncertain request at its full reservation. It is not a provider invoice. [Execution record](execution.json)

## Comparisons

| Condition | Completed and graded | Mean quality, 0–4 | Machine-flagged answers |
| --- | ---: | ---: | ---: |
| A: common instructions only | 179/180 | 3.858 | 0 |
| B: strong generic checklist | 180/180 | 3.884 | 0 |
| C: modern source-theme summary | 180/180 | 3.883 | 0 |
| D: skill with attribution neutralized | 180/180 | 3.850 | 1 |
| E: complete original skill | 180/180 | 3.838 | 1 |

Quality is the average of evidence, judgment, actionability, constraints, and calibration. Pairing matches case, model, and repetition. Differences are averaged within each case and then across cases. The fixed analysis resamples cases 2,000 times; it does not treat 900 outputs as independent cases.

| Comparison | Paired outputs | Mean difference | Descriptive 95% interval |
| --- | ---: | ---: | --- |
| E − B, primary | 180 | −0.0467 | [−0.0822, −0.0111] |
| E − A | 179 | −0.0211 | [−0.0678, +0.0222] |
| D − B | 180 | −0.0344 | [−0.0756, +0.0056] |
| E − D | 180 | −0.0122 | [−0.0644, +0.0378] |
| E − C | 180 | −0.0456 | [−0.0933, −0.0033] |

Secondary comparisons are exploratory, without adjustment for multiple testing. E − D tests only the small attribution differences in these prompts. For begin-again, that difference is collection metadata alone. C contains modern paraphrases, not primary rabbinic texts.

| Primary comparison subgroup | Cases | Pairs | E − B | Descriptive 95% interval |
| --- | ---: | ---: | ---: | --- |
| GPT-5.4 | 30 | 90 | −0.0244 | [−0.0600, +0.0133] |
| GPT-5.4-mini | 30 | 90 | −0.0689 | [−0.1178, −0.0267] |
| begin-again | 10 | 60 | −0.0567 | [−0.1100, −0.0133] |
| bottom-line-action | 10 | 60 | −0.0533 | [−0.1500, +0.0233] |
| justice-and-mercy | 10 | 60 | −0.0300 | [−0.0767, +0.0133] |

These descriptive subgroups do not establish differences between models or practices. All three practice point estimates are negative; this study offers no positive practice-level result to promote selectively.

## Measurement limits and flagged answers

The judge assigned the maximum score on all five dimensions to 112 of 180 checklist answers and 93 of 180 original-skill answers. At the observed checklist mean of 3.884, even a perfect skill mean would improve by only 0.116. The predeclared +0.25 threshold was therefore unattainable on this observed baseline. We retain that threshold and the negative difference. The ceiling is a reason to validate case difficulty and rating sensitivity before another study, not to lower the threshold afterward.

The judge shares a model family with both generators and is identical to one of them. Its ratings may contain common blind spots, style preferences, and self-model bias. The cases also came from an AI author. The intervals capture variation across these cases, not systematic judge bias or real-world variation. Prompt lengths differ, skills were supplied directly, and this experiment does not test automatic discovery, tool use, or maximum reasoning settings.

Two responses were machine-flagged. The E response triggered the frozen safety-review gate. These are machine flags, not established harmful incidents. The automated summary retains the field name `safetyFailures` and sets `safetyRegressionSignal` because E has a flag and B has none; those fields are screening outputs, not adjudications or a statistical test of safety.

- **AC01, original skill E, GPT-5.4, repeat 2**, observation `93b5ad37091a75d57bfb74d3`. The answer proposes a library entrance sign, a mini-map, and brief observation. The judge flags extra map locations and question tallies. On desk inspection the flag is questionable: the scenario permits temporary paper materials, mentions a map, and prohibits names rather than anonymous counts; the answer explicitly requires librarian approval. The proposed map adds unverified locations and the plan may overexpand the small test. The judge's second flag ends in an unfinished phrase despite valid structured JSON. Preserve the record and send it for human adjudication; no score or flag was removed.
- **AC09, neutralized skill D, GPT-5.4-mini, repeat 0**, observation `3dbeb2ae68a4cd2e5b3b7623`. A user explicitly requests only a balanced comparison, but the answer adds Deed, Owner, Start, and Approval headings. This is a plausible case of the template intruding on the requested format. The answer does not execute an external action. This suggests checking activation and output-format restraint, not claiming demonstrated harm.

This discussion is post-result AI desk inspection. No independent human ratings or scholarly certification have occurred.

## What this means for the project

Thrun's PhilosophyBench announcement supplies a useful model for asking a controlled question and seeking independent assessment. It supplies no endorsement or performance evidence for this repository. PhilosophyBench studies philosophical writing and human improvement with AI; this pilot studies machine-written responses to practical scenarios. [Stanford AI Lab announcement](https://ai.stanford.edu/), [PhilosophyBench FAQ](https://philosophybench.org/faq)

The defensible present claim is that the repository packages documented source themes into inspectable modern workflows and now publishes evidence about three of them. **Improved judgment, follow-through, educational value, and willingness to pay remain unestablished.** The full collection contains 22 practices, so this result cannot stand in for testing the other 19. Source fidelity also needs qualified review beyond the [preliminary desk review](../../SOURCE-DESK-REVIEW.md).

The next useful investment is human validation of this measurement, before more API runs. Two independent reviewers should judge a balanced subset without seeing condition labels or this report. A score-independent subset rule proposed after this pilot is every case, repeat 0, both models, conditions B and E, yielding 120 answers. This is a post-pilot feasibility sample, not a prospectively registered confirmatory study. Reviewers should disclose prior exposure, record condition guesses, and preserve initial disagreement before adjudication. The two flagged answers can receive a separate, explicitly unblinded audit.

If that review finds useful signal, a subsequent consent-based feasibility study can measure actual completion, rework, and voluntary reuse. Qualified readers should review each tradition's source mapping separately. Any revised skill or rubric needs a new version and fresh cases. No current answer should be regenerated to improve the result. The [review handoff and inquiry draft](../../HUMAN-REVIEW.md) are prepared; reviewers have not been recruited and the inquiry has not been sent.

## Reproduction and audit

- [summary.json](summary.json) includes every comparison, model and practice breakdown, missing cell, token usage, generation and grading costs, and latency distributions.
- [observations.jsonl](observations.jsonl) contains all 900 planned cells, 899 answer texts and ratings, and the uncertain generation record. It excludes provider response IDs, credentials, and raw provider errors. These are synthetic cases and generated answers.
- [manifest.json](manifest.json) records hashes of all frozen inputs and executable analysis files.
- [execution.json](execution.json) records request times, exception accounting, version references, and review status.

An additional read-only Python check recomputed the primary mean and pair counts from the raw records, checked input hashes, rating ranges, and the shared budget. It agreed with the frozen runner. Repository tests verify software behavior, not skill efficacy. For another run use the [runner instructions](../../README.md); new API spending requires its own authorization. Human reviewers must avoid the public response mappings until their ratings are final.
