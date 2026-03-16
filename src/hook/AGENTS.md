# HOOK KNOWLEDGE BASE

**Parent:** `../../AGENTS.md`

## OVERVIEW

`src/hook/` is the flat public hook surface for lifecycle, timer, browser-event, and stale-closure helpers.

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Mount or unmount lifecycle wrapper | `useMount.ts`, `useUnmount.ts` | Tiny `useEffect` wrappers |
| Skip first effect run | `useEffectWithoutFirst.ts` | Dependency-driven effect gate |
| Stable callback reference | `useStableCallback.ts` | Closure freshness helper |
| Interval or timeout cleanup helpers | `useIntervalCallback.ts`, `useTimeoutHandlers.ts` | Timer management entry points |
| Mount state introspection | `useLifecycle.ts` | Composes `useMount` and `useUnmount` |
| Browser unload handling | `useBeforeunload.ts` | Strict runtime guard plus window listener |

## CONVENTIONS

- Keep hooks flat as `use*.ts`; this directory currently has no subfolders and no local barrel.
- Reuse `useMount`, `useUnmount`, `useStableCallback`, and `useLifecycle` before adding another lifecycle helper with overlapping behavior.
- Hooks that touch browser APIs must validate the browser runtime explicitly and fail fast when it is unavailable.
- Timer and listener hooks must always clean up on unmount.
- Every hook here is part of the published API, so export wiring belongs in `../../index.ts`.
- DOM-only hooks use the `Dom` suffix in the exported hook name.

## ANTI-PATTERNS

- Do not move shared hook primitives into `src/component/`; components here are consumers, not the source of lifecycle logic.
- Do not duplicate stale-closure handling when `useStableCallback` already covers the case.
- Do not add new nested folders or `index.ts` files to group a small number of hooks.
- Do not add new hook-rule or TypeScript suppressions unless the compatibility constraint is unavoidable and documented in the code change.

## NOTES

- `useStableCallback.ts` and `useTimeoutHandlers.ts` are the most reusable building blocks for other domains.
- `useBeforeunload.ts` exports `useBeforeunloadDom` and throws immediately outside a browser runtime.
