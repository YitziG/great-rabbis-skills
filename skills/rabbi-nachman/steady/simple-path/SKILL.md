---
name: simple-path
metadata:
  collection: "rabbi-nachman"
description: "Reduce an overengineered plan to the smallest coherent path while preserving explicit invariants. Use when coordination, abstraction, tooling, or optional scope has become heavier than the intended outcome."
---

# Simple Path

Simplicity is fewer moving parts around the same responsibility, not fewer responsibilities.

## Practice

1. **Name the outcome.** One sentence, observable from outside the plan.
2. **List the invariants.** Preserve correctness, security, privacy, accessibility, consent, durability, and explicit user requirements that actually apply.
3. **Inventory the machinery.** List components, handoffs, abstractions, dependencies, and optional features.
4. **Test each part.** Ask whether removing it breaks the outcome or an invariant now. A possible future use is not enough.
5. **Choose the smallest coherent path.** Keep one end-to-end route that produces evidence.
6. **Declare deferrals.** State what is intentionally postponed and the trigger for reconsidering it.
7. **Add a tripwire.** Identify the observation that would prove the simple path is insufficient.

## Output

Return:

- **Outcome**
- **Must remain true**
- **Keep**
- **Remove now**
- **Defer until**
- **Smallest coherent path**
- **Tripwire**

Do not simplify by hiding failure, weakening a safety boundary, shifting unpaid work to another person, or leaving an irreversible action without review.
