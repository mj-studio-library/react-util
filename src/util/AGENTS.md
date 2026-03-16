# UTIL KNOWLEDGE BASE

**Parent:** `../../AGENTS.md`

## OVERVIEW

`src/util/` holds React-adjacent helpers that do not fit the hook or ticker domains: context creation, browser utilities, search params, and an app-level event bus.

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Context tuple factory | `createCtx.ts` | Returns fixed tuple contract |
| App-wide event bus | `AppEvent.ts` | Singleton emitter plus React listeners |
| Clipboard helpers | `clipboard.ts` | Browser clipboard access |
| Focus helpers | `focus.ts` | DOM focus cleanup |
| URL query parsing | `searchParams.ts` | Small utility, keep narrow |

## CONVENTIONS

- Keep utilities directly callable and narrowly scoped; most files here are intentionally small.
- Preserve the tuple order returned by `createCtx`; consumers depend on the exact contract.
- Extend the existing `AppEvent` singleton or its listener hooks instead of creating parallel event-bus patterns.
- Browser-facing helpers should keep side effects explicit and localized, and throw when required browser features are missing.
- Public utility additions still require export wiring in `../../index.ts`.
- DOM-only utilities use the `Dom` suffix in the exported function name.

## ANTI-PATTERNS

- Do not move hook-like stateful logic into this directory when it belongs in `src/hook/`.
- Do not casually change the exported names or tuple shape from `createCtx.ts`.
- Do not create per-feature copies of the event bus when the shared singleton is enough.
- Do not add abstraction layers around tiny helpers such as `focus.ts` or `searchParams.ts`.

## NOTES

- `AppEvent.ts` is the heaviest file here and is the only one mixing class logic with React hooks.
- `createCtx.ts` is marked `'use client'`, so keep server/client expectations in mind when changing it.
