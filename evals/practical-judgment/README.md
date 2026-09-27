# Practical judgment evaluation

This pilot compares three existing skills with strong alternatives. It is an exploratory test on invented cases with automated grading. Read [PROTOCOL.md](PROTOCOL.md) before interpreting a score. Human effectiveness and scholarly source fidelity require separate studies.

The public source skills are pinned by `sourceCommit` in [config.json](config.json). [cases.json](cases.json) contains public synthetic scenarios and evaluator notes. Generator requests include only the scenario, never those notes or the expected-use label. The [case-authoring record](CASE-AUTHORING.md) identifies how the cases were produced.

## Run

Use Node 22 or later. From the repository root:

```sh
npm ci
npm run validate
node scripts/evaluate.mjs plan --out /absolute/path/to/pilot-run
```

Inspect the manifest and plan before making paid calls. The remaining commands use `OPENAI_API_KEY` from the environment. Never put it in a prompt, command argument, report, or committed file.

```sh
node scripts/evaluate.mjs run --out /absolute/path/to/pilot-run --limit 10
node scripts/evaluate.mjs run --out /absolute/path/to/pilot-run
node scripts/evaluate.mjs grade --out /absolute/path/to/pilot-run
node scripts/evaluate.mjs export --out /absolute/path/to/pilot-run
node scripts/evaluate.mjs summarize --out /absolute/path/to/pilot-run
```

Use the same output directory for smoke, full generation, grading, and resume. A new directory is a new ledger and does not reset the authorized task budget. Never run a second paid directory under the same authorization. The runner is resume-safe within a directory and refuses input drift. Unknown outcomes remain charged at their reservation and are not retried automatically.

`plan`, `export`, `summarize`, and repository tests make no paid calls. Runtime output stays outside the repository and should be reviewed before selective publication. Never commit credentials, raw provider error bodies, or unrelated account information.

## What this can establish

The primary comparison is complete skill E versus generic checklist B. A positive machine-rated result is a reason to investigate, not proof that users make better decisions. A negative or null result must be published with the same care. The protocol also separates source-theme context and attribution from procedural content.

Keep the source skill files unchanged for this version. Improvements suggested by results belong in a later version with fresh cases. The code tests establish runner behavior, not skill efficacy.
