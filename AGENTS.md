# PROJECT KNOWLEDGE BASE

**Generated:** 2026-03-16 14:41:36 KST  
**Commit:** df671b4  
**Branch:** main

## OVERVIEW

`@mj-studio/react-util` is a React utility library that publishes a single CJS bundle from root `index.ts`. Public API wiring is manual at the repo root, while implementation is split across hooks, ticker helpers, thin components, and React-adjacent utilities under `src/`.

## STRUCTURE

```text
react-util/
|- index.ts                    # only public export surface
|- src/
|  |- hook/                    # public hook collection; see src/hook/AGENTS.md
|  |- ticker/                  # timer and due-date domain; see src/ticker/AGENTS.md
|  |- util/                    # React-adjacent helpers; see src/util/AGENTS.md
|  |- component/               # thin wrappers; Condition.tsx is not exported
|- tool/
|  |- publish.mjs              # patch bump + build + commit + publish + push
|- rollup.config.mjs           # Rollup build definition
|- tsconfig.json               # strict typecheck, noEmit
|- package.json                # scripts and published entry
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add or remove public exports | `index.ts` | Root barrel is the only published surface |
| Change reusable hooks | `src/hook/*.ts` | Flat public hook area |
| Change ticker behavior | `src/ticker/*.ts*` | Core timing domain |
| Change React helper utilities | `src/util/*.ts` | Context, clipboard, focus, search params, event bus |
| Change thin wrapper components | `src/component/*.tsx` | `Condition.tsx` is local-only unless exported |
| Change build output | `rollup.config.mjs` | Rollup emits `dist/` CJS bundle |
| Change release flow | `tool/publish.mjs` | Local script drives version bump and publish |

## CONVENTIONS

- Public API changes always go through root `index.ts`; exporting from a source file alone does not publish it.
- `pnpm run t` is the baseline verification step: lint, typecheck, then `vitest run`.
- Tests use Vitest with the `jsdom` environment and colocated `src/**/*.test.ts(x)` files.
- Build is Rollup-driven, not `tsc`-driven. `tsconfig.json` uses `noEmit`, while `rollup-plugin-typescript2` produces declarations and bundle output.
- Source layout stays flat inside each domain directory. There are no directory-local barrels or nested feature folders today.
- Browser-facing logic is kept inside hooks or small helpers, not spread across many components.
- DOM-dependent public APIs fail fast with a runtime error instead of silently degrading on the server.
- DOM-dependent public APIs use the `Dom` suffix in their exported names.

[GUIDE LIST]

### Manual Docs Sync

`README.md` and `llms.txt` are manually maintained documents in this project. They must stay aligned with `index.ts` exports and the real behavior in source files whenever an agent changes public code.

**Rules:**
- When a public API changes, update the source JSDoc, `README.md`, and `llms.txt` in the same task.
- Treat `index.ts` and the implementation files as the source of truth; documentation must match actual exports, signatures, and behavior.
- Do not introduce generator-only markers or automation-specific instructions into `README.md` or `llms.txt`.
- In `llms.txt`, `Good` examples should show realistic recommended usage, and `Bad` examples should show meaningful misuse or anti-patterns.
- Do not use fake `Bad` examples that only pass obviously invalid argument types unless that exact mistake is a real usage pitfall worth calling out.
- If a public API has no meaningful `Bad` practice worth documenting, prefer omitting `Bad` over inventing noise.

**Good:**
```ts
/**
 * Creates ticker state and imperative controls for elapsed time updates.
 *
 * @example
 * const { startTicker } = useTicker();
 *
 * useMount(() => {
 *   startTicker({ durationSec: 10 });
 * });
 */
```

```md
#### `blurFocusDom(): void`
Moves focus away from the currently focused element in a browser runtime.

#### `AppEvent`
Global in-memory event emitter instance for app-level events.

##### `AppEvent.emitEvent(type, payload?)`
Emits an event to every registered listener and returns whether any listener was called.
```

**Bad:**
```bash
git diff index.ts
# public API changed here, but README.md and llms.txt are left untouched
```

**When to apply:**
- When changing anything exported from root `index.ts`.
- When editing public JSDoc for hooks, ticker controls, DOM helpers, or event APIs such as `useTicker`, `Ticker.start`, `blurFocusDom`, or `AppEvent.emitEvent`.

[GUIDE LIST END]

## ANTI-PATTERNS (THIS PROJECT)

- Do not add new public exports anywhere except root `index.ts`.
- Do not introduce `index.ts` barrels inside `src/hook`, `src/ticker`, `src/util`, or `src/component`.
- Do not bypass `pnpm run t` after changing tested behavior or test setup.
- Do not accidentally publish `src/component/Condition.tsx` unless the public API change is intentional.
- Do not run `tool/publish.mjs` from a dirty worktree unless the release commit and push are intended.

## UNIQUE STYLES

- `src/ticker/` is the only real subdomain with its own stateful class plus hook and render helpers.
- `src/component/` is not a design-system layer; it mostly wraps hooks into minimal renderable helpers.
- Existing code mixes strict TypeScript config with a few legacy suppressions and casts in implementation details. Preserve behavior first; refactor only with intent.
- `build` still removes `esm/`, but current Rollup config only writes `dist/`.

## COMMANDS

```bash
pnpm run t
pnpm test
pnpm run test:run
pnpm run test:coverage
pnpm build
pnpm release
```

## NOTES

- No `.github/workflows` directory exists in this checkout.
- `tool/publish.mjs` bumps the patch version, runs `pnpm run build`, commits `Release <version>`, publishes to npm, and pushes Git changes.
- The repository tracks IntelliJ project files under `.idea/`; avoid touching them unless the task is IDE-related.
