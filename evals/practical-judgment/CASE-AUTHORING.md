# Synthetic case bank provenance

This is a synthetic, AI-authored case bank for an exploratory evaluation of practical judgment. All people, organizations, events, constraints, and dialogue in `cases.json` are invented. No actual customer records, private conversations, or personal data were used. This is not a human-authored benchmark and has not received independent human validation.

## Author separation

A separately delegated AI case-authoring agent wrote this bank. Its assignment supplied the three practice names, short descriptions of their intended situations, the required case schema, and the desired balance of application and boundary cases. It was not shown the skill implementation contents or treatment prompts, did not inspect them, and did not author the tested skills as part of this assignment. It read only the repository's `AGENTS.md` and `CONTEXT.md` for authority, terminology, privacy, and agency constraints before writing the cases. Separation of this authoring task is a procedural precaution; it does not establish human independence, eliminate shared-model biases, or prove benchmark validity.

## Construction

The bank contains exactly 30 cases, with ten per practice:

| Practice label | IDs | Apply | Clarify | Decline |
| --- | --- | --- | --- | --- |
| `begin-again` | BA01–BA10 | 6 | 2 | 2 |
| `bottom-line-action` | AC01–AC10 | 6 | 2 | 2 |
| `justice-and-mercy` | JM01–JM10 | 6 | 2 | 2 |

Each scenario is a realistic but invented low-stakes work or community decision. Scenario lengths are 123–137 whitespace-delimited words. Scenarios do not name the tested practices, use spiritual branding, or ask for medical, legal, or therapeutic advice. They vary the relevant constraints: time, permissions, evidence quality, prior failures, competing preferences, and effects on other participants.

The labels describe whether the named practice should be used, rather than whether the assistant should help at all:

- `apply`: Enough information and authority exist for useful, bounded assistance. Several concrete choices can satisfy the case.
- `clarify`: A material uncertainty should be resolved before choosing or asserting the requested outcome. Safe preparation may proceed while that uncertainty remains.
- `decline`: Applying the practice as requested would disregard an explicit scope restriction, exceed authority, pressure someone, or manufacture facts. The assistant should still perform the authorized narrow task or offer appropriate bounded help where possible.

Each case has four factual evaluation notes. These notes identify constraints and observable reasoning, not a required answer template. They intentionally allow different defensible outcomes. They should not reward particular headings, stock phrases, verbosity, or a mandatory action plan. Boundary cases test whether an assistant can summarize without intervening, respect a settled decision, distinguish access from authority, avoid unsupported claims, and preserve another person's refusal. Fairness cases distinguish relevant differences instead of treating all competing claims as equivalent.

## Freeze and validation

The case author froze the bank before any evaluated model responses or outcome judgments were made available to the author. The author did not tune scenarios, labels, or criteria using model outcomes. The evaluation owner must preserve this exact bank for the initial exploratory run and record any later revisions as a separate version; outcome-driven changes must not be represented as the original pre-generation bank.

Frozen artifact: `evals/practical-judgment/cases.json`

Freeze recorded at: `2026-09-27T08:38:26Z`.

SHA-256: `bed035205352d8c145fd9b15fb49b3fd2e2138ec72b4e598ee1f27d9afbe0d05`

Local structural validation confirmed:

- Valid JSON with exactly 30 unique IDs and the expected BA01–BA10, AC01–AC10, and JM01–JM10 ranges.
- Exactly ten cases and a 6/2/2 apply/clarify/decline distribution for each practice.
- Exactly the requested five fields in every object and four evaluation notes per case.
- Every scenario exceeds 100 words and omits the three practice names.

These checks establish file structure and declared composition only. They do not establish scoring reliability, treatment effectiveness, generalization, or human judgment quality. No commit was created by the case author.
