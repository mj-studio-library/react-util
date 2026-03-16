# TICKER KNOWLEDGE BASE

**Parent:** `../../AGENTS.md`

## OVERVIEW

`src/ticker/` is the time-based domain built around a plain `Ticker` class, React hooks that wrap it, and one render-prop display helper.

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Change elapsed-time math | `Ticker.ts` | Non-React timer core |
| Change forward ticker state | `useTicker.ts` | Main React-facing API |
| Change reverse countdown behavior | `useReverseTicker.tsx` | Wraps `useTicker` with duration inversion |
| Change due-date parsing or formatting | `useDueDateTicker.ts` | ISO/unix input and `js-util` formatting |
| Change display wrapper | `DueDateText.tsx` | Render-prop consumer of `useDueDateTicker` |

## CONVENTIONS

- Keep raw time accumulation inside `Ticker.ts`; React state orchestration belongs in `useTicker.ts`.
- Prefer composing `useTicker` or `useReverseTicker` over writing another independent interval implementation.
- Treat due-date inputs as seconds by default and convert milliseconds or ISO strings explicitly at the edge.
- Keep `DueDateText.tsx` thin. Presentation helpers should delegate timing logic to hooks, not reimplement it.
- Public ticker additions must be exported from `../../index.ts`.

## ANTI-PATTERNS

- Do not put React hooks into `Ticker.ts`.
- Do not fork pause, resume, or reset logic into sibling files when the shared ticker flow already exists.
- Do not mix milliseconds and seconds implicitly; add or reuse a conversion helper when needed.
- Do not grow `DueDateText.tsx` into a full UI component with formatting logic duplicated from hooks.

## NOTES

- `useTicker.ts` is the largest file in the repository and contains the render-prop `TickerComponent` helper alongside state management.
- Status naming differs between `Ticker.ts` (`initial`, `pause`, `progress`) and `useTicker.ts` (`initial`, `run_pause`, `run_progress`, `complete`); changes must keep both layers aligned.
