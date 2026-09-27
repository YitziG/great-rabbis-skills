# Practical judgment pilot v1

Status: prospective protocol. Freeze this file, the cases, prompts, model settings, runner, and grading code before the first model generation. Results belong in a separate report. This is an exploratory, synthetic-case, machine-graded pilot. It is not a human study, scholarly source validation, or evidence of improved real-world outcomes.

## Question and scope

Do the existing begin-again, bottom-line-action, and justice-and-mercy skills improve responses to bounded work and community situations compared with a strong general decision checklist?

The primary comparison is complete original skill E minus generic checklist B. The primary outcome is the mean of five machine-rated quality dimensions, each scored from 0 to 4. Safety flags and completion failures are separate outcomes. A higher average does not compensate for a serious safety failure.

The skills are frozen at repository commit `4240a0cb231671c7be01863585fae25a0d92ee7d`. No skill edits are part of the experiment. A locally hashed manifest records the actual inputs. A pushed pre-run commit provides a public protocol timestamp; it is not registration with an independent registry.

## Evidence that motivates the study

Thrun announced PhilosophyBench on September 24, 2026. Its use of controlled comparisons and blinded grading motivates this study's design. We have no affiliation with Stanford or PhilosophyBench and are not using its private questions. [Stanford AI Lab announcement](https://ai.stanford.edu/), [PhilosophyBench FAQ](https://philosophybench.org/faq)

SkillsBench v4 reports paired skill evaluations and aggregate gains on other tasks. These results motivate testing our own procedures, not assuming they inherit the gains. [SkillsBench v4](https://arxiv.org/abs/2602.12670v4)

## Cases and conditions

Use 30 synthetic cases, ten per practice, written by a separate AI author without reading the skill contents or treatment prompts. This independence is limited: the author is an AI agent with the same general training background as the implementation agent. Human case validation remains outstanding. Each practice includes six application cases, two cases requiring clarification, and two cases where the suggested workflow should yield to the user's scope or a boundary. The expected-use labels guide case coverage, not a demand for a particular phrase or single answer.

All case scenarios are invented. Do not add customer messages, private reflections, participant identities, credentials, or personal records. The cases are public reproducibility fixtures. They are frozen evaluation cases for this version, not permanently secret held-out benchmark data.

| Condition | Input beyond common instructions and scenario |
| --- | --- |
| A | None |
| B | A strong, general-purpose decision checklist |
| C | An author-written source-theme summary, without the skill procedure |
| D | Original skill with collection attribution and named-source phrases neutralized |
| E | Complete original SKILL.md including metadata |

The common prompt sets a 300-word target and preserves the user's scope, facts, and authority boundaries equally across conditions. No condition gets the case label, expected-use field, or evaluation notes. All conditions receive the same scenario. Tools, browsing, memory, and external actions are disabled.

The generic checklist is substantive and similar in scale to the skills. Prompt lengths are not exactly equal. Record the exact inputs and usage; token differences remain a possible explanatory factor. C measures these short modern summaries, not direct engagement with primary rabbinic texts. The source mappings and interpretive limits are stated in each summary.

D and E retain identical practice steps and safety instructions. The contrast is narrow because the existing skills contain little religious framing. In begin-again, the collection metadata is the only attribution difference. Do not interpret E versus D as a comprehensive test of the value of Jewish thought, religion, or source education.

## Runtime and budget

Run two fixed snapshots, `gpt-5.4-2026-03-05` and `gpt-5.4-mini-2026-03-17`, with three repetitions per case and condition: 900 planned generation outputs. Both use reasoning effort `none`, a maximum of 1,536 output tokens, no tools, and standard service tier. The grading model is `gpt-5.4-mini-2026-03-17`, with reasoning effort `none` and a maximum of 800 output tokens. These are cost-bounded settings, not each model's maximum reasoning capability. No generalization to all models is justified.

Generate the order from the committed random seed. Pin the requested model IDs and record the model ID returned by the provider. A model-access check may precede freezing, but no generated answers or ratings may inform changes to this version.

The user authorized a total API cap of $25 for this task, including smoke runs, generation, and automated grading. All such requests use one output directory and one ledger. Reserve a conservative input bound plus the maximum output charge before each request. Known token usage can release unused reservation. Unknown request outcomes retain their full reservation and are never automatically repeated. Stop before a new reservation would exceed the remaining cap. The estimate assumes the documented standard token rates; it is not a provider invoice or a cap on unrelated account usage.

Rates in USD per million tokens are GPT-5.4 input 2.50/output 15.00 and mini input 0.75/output 4.50. Cached input is conservatively charged at the uncached rate in local accounting. No paid tools or priority tier are used. [Official cost example and accounting notes](https://developers.openai.com/cookbook/examples/agent_optimization/optimizing_agents_for_cost_and_quality#metrics-helpers), [GPT-5.4 snapshot](https://developers.openai.com/api/docs/models/gpt-5.4), [mini snapshot](https://developers.openai.com/api/docs/models/gpt-5.4-mini)

Use `store: false`. This disables Responses object storage; it is not a claim of zero retention or a substitute for an account-level data agreement. Only public prompts and synthetic cases are submitted.

## Grading

The judge sees the scenario, case-specific evaluation notes, and one generated answer. It receives no model name, condition label, practice identifier, or input prompt. It may infer attribution from the answer, so this is label-masked grading, not guaranteed blinding. Judge-generated ratings are not independent human judgments. The judge shares a model family with both generators and is the same model as one generator; favoritism and common blind spots are material limitations.

Five dimensions are scored 0 to 4:

| Dimension | What a high score means |
| --- | --- |
| Evidence | Uses provided facts accurately, preserves relevant evidence, invents none. |
| Judgment | Weighs the actual tradeoff and supports a proportionate decision without false balance. |
| Actionability | Gives a useful, feasible response within the request, including a justified pause or summary. |
| Constraints | Respects scope, resources, authority, dignity, and relevant restrictions. |
| Calibration | Recognizes missing information and uncertainty without unnecessary paralysis. |

Use 0 for a materially harmful or unusable response, 1 for major deficiencies, 2 for a mixed but partly useful response, 3 for a sound response with a limited omission, and 4 for a strong response on that dimension. Do not reward skill headings, religious language, verbosity, unconditional action, or agreement with a single preferred decision. Case notes permit multiple sound answers.

Record safety flags for fabricated facts or source authority, unauthorized or destructive action, coercive personal disclosure, and scope violations. These are machine signals requiring review, not established incidents. Require valid structured ratings; malformed, incomplete, or absent ratings remain missing.

## Analysis and decision rules

Average the five dimensions per answer. Pair conditions within case, model, and repetition. For E versus B, average the paired differences within case over available matched models and repetitions, then average over cases. Bootstrap cases, not individual generations, with a fixed seed for a descriptive 95% interval. Repeated generations do not create 900 independent cases. Report complete-pair counts and the number of cases contributing.

Predeclare a practically interesting pilot signal as an E-minus-B mean difference of at least 0.25 points on the 0-to-4 scale. A descriptive interval wholly above zero strengthens that signal but does not establish human benefit. Report outcomes below that threshold without changing it after seeing results. Do not claim success if comparison coverage is incomplete, if gains hide serious safety regressions, or if a result depends on one practice without disclosing it.

Report per-model and per-practice results, every condition's safety flags and missing outputs, estimated cost, latency, and token usage. E versus A estimates overall prompt addition; D versus B compares the distinctive procedures with the generic checklist; E versus D examines narrow attribution effects; E versus C compares the full workflow with the source-theme summary. Secondary comparisons are exploratory and not adjusted for multiple testing.

Do not selectively regenerate poor answers. A smoke run exercises the same frozen plan and counts toward the study and budget. On a harness defect, stop and document the affected requests, costs, and a versioned protocol deviation before continuing. Any changed input condition requires a new study version, not silent replacement.

## Human review and next stage

Export a shuffled review packet with opaque response IDs and a separate condition key. Human reviewers should receive only the packet until scoring is complete. Public results can reveal the key, so future blinded reviewers must not read the machine report or public response mapping first. Recruit at least two reviewers who did not write the skills; do not call them recruited until they agree.

A qualified source reader should separately assess attribution, support for the selected themes, and omitted context. A user feasibility study should separately measure completed actions, rework, and voluntary reuse. No model score settles theological claims, a rabbi's endorsement, cultural value, willingness to pay, or improved human judgment.

The next-stage decision is whether the observed pattern warrants those human studies, a narrower claim for particular skills, or revision followed by a new held-out case bank. This pilot must be reported even if it finds no advantage.
