# CLAUDE.md — 12-rule template

These rules apply to every task in this project unless explicitly overridden.
Bias: caution over speed on non-trivial work. Use judgment on trivial tasks.

## Rule 1 — Think Before Coding
State assumptions explicitly. If uncertain, ask rather than guess.
Present multiple interpretations when ambiguity exists.
Push back when a simpler approach exists.
Stop when confused. Name what's unclear.

## Rule 2 — Simplicity First
Minimum code that solves the problem. Nothing speculative.
No features beyond what was asked. No abstractions for single-use code.
Test: would a senior engineer say this is overcomplicated? If yes, simplify.

## Rule 3 — Surgical Changes
Touch only what you must. Clean up only your own mess.
Don't "improve" adjacent code, comments, or formatting.
Don't refactor what isn't broken. Match existing style.

## Rule 4 — Goal-Driven Execution
Define success criteria. Loop until verified.
Don't follow steps. Define success and iterate.
Strong success criteria let you loop independently.

## Rule 5 — Use the model only for judgment calls
Use me for: classification, drafting, summarization, extraction.
Do NOT use me for: routing, retries, deterministic transforms.
If code can answer, code answers.

## Rule 6 — Token budgets are not advisory
Per-task: 4,000 tokens. Per-session: 30,000 tokens.
If approaching budget, summarize and start fresh.
Surface the breach. Do not silently overrun.

## Rule 7 — Surface conflicts, don't average them
If two patterns contradict, pick one (more recent / more tested).
Explain why. Flag the other for cleanup.
Don't blend conflicting patterns.

## Rule 8 — Read before you write
Before adding code, read exports, immediate callers, shared utilities.
"Looks orthogonal" is dangerous. If unsure why code is structured a way, ask.

## Rule 9 — Tests verify intent, not just behavior
Tests must encode WHY behavior matters, not just WHAT it does.
A test that can't fail when business logic changes is wrong.

## Rule 10 — Checkpoint after every significant step
Summarize what was done, what's verified, what's left.
Don't continue from a state you can't describe back.
If you lose track, stop and restate.

## Rule 11 — Match the codebase's conventions, even if you disagree
Conformance > taste inside the codebase.
If you genuinely think a convention is harmful, surface it. Don't fork silently.

## Rule 12 — Fail loud
"Completed" is wrong if anything was skipped silently.
"Tests pass" is wrong if any were skipped.
Default to surfacing uncertainty, not hiding it.

## Rule 13 — Atomic Design (mandatory for all UI work)

This project follows Brad Frost's Atomic Design methodology.
Source: https://atomicdesign.bradfrost.com/chapter-2/

### The five stages — what each layer means

| Layer | What it is | Examples in this project |
|-------|-----------|--------------------------|
| **Atoms** | Smallest functional UI elements. Cannot be broken down further without losing meaning. Stateless or near-stateless. | `StatusBadge`, `InlineAlert`, `PageHeader` |
| **Molecules** | Simple groups of atoms bonded together with a single clear purpose (single responsibility principle). | `StatCard`, `RangePicker`, `SearchInput`, `SortSelect` |
| **Organisms** | Relatively complex sections composed of molecules and/or atoms. Form a distinct, reusable section of the interface. | `UsersTable`, `ChartsGrid`, `ChatSidebar`, `ProviderCards` |
| **Templates** | Page-level layout shells that place organisms/molecules into a layout and define content structure — no real data. | Layout wrappers, skeleton screens |
| **Pages** | Specific instances of templates with real content wired in. The Next.js `page.tsx` files are pages. They orchestrate data-fetching and pass props down — they do not contain UI markup beyond wiring. |

### Folder conventions

```
components/
  atoms/          ← pure display, no business logic, no data fetching
  molecules/      ← composed of atoms, single clear responsibility
  organisms/
    <feature>/    ← grouped by domain (users/, analytics/, providers/…)
  templates/      ← layout shells (optional, add only when needed)
  ui/             ← shadcn primitives — DO NOT modify these
  admin/
    charts/       ← existing chart components — keep as-is
```

### Hard rules — never break these

1. **Layer boundaries are one-directional.** Atoms know nothing about molecules. Molecules know nothing about organisms. Lower layers never import from higher layers.
2. **Pages (`page.tsx`) are ≤ 70 lines.** If a page exceeds 70 lines, extract an organism. No exceptions.
3. **`ui/` is off-limits.** Never modify shadcn primitives. Wrap them in atoms or molecules if you need custom behaviour.
4. **No business logic in atoms or molecules.** Data fetching, API calls, and stateful hooks belong in organisms or pages.
5. **One responsibility per component.** If a component does two unrelated things, split it.
6. **Name by role, not by location.** `UsersTable` not `PageTable`. Names must make sense when imported anywhere.
7. **Co-located route components (`SomeThing.tsx` inside a route folder) must be moved to the correct layer under `components/` before adding new features.**
8. **Atomic design is not a linear process.** Design atoms and pages concurrently — validate that atoms compose correctly at the page level before finalising them.