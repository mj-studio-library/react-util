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
- `pnpm t` is the baseline verification step: `eslint src && tsc`.
- No automated test runner is configured in this checkout; typecheck and lint are the only package scripts used for verification.
- Build is Rollup-driven, not `tsc`-driven. `tsconfig.json` uses `noEmit`, while `rollup-plugin-typescript2` produces declarations and bundle output.
- Source layout stays flat inside each domain directory. There are no directory-local barrels or nested feature folders today.
- Browser-facing logic is kept inside hooks or small helpers, not spread across many components.
- DOM-dependent public APIs fail fast with a runtime error instead of silently degrading on the server.
- DOM-dependent public APIs use the `Dom` suffix in their exported names.

## ANTI-PATTERNS (THIS PROJECT)

- Do not add new public exports anywhere except root `index.ts`.
- Do not introduce `index.ts` barrels inside `src/hook`, `src/ticker`, `src/util`, or `src/component`.
- Do not assume `pnpm t` covers runtime behavior; there are no tests to catch behavioral regressions automatically.
- Do not accidentally publish `src/component/Condition.tsx` unless the public API change is intentional.
- Do not run `tool/publish.mjs` from a dirty worktree unless the release commit and push are intended.

## UNIQUE STYLES

- `src/ticker/` is the only real subdomain with its own stateful class plus hook and render helpers.
- `src/component/` is not a design-system layer; it mostly wraps hooks into minimal renderable helpers.
- Existing code mixes strict TypeScript config with a few legacy suppressions and casts in implementation details. Preserve behavior first; refactor only with intent.
- `build` still removes `esm/`, but current Rollup config only writes `dist/`.

## COMMANDS

```bash
pnpm t
pnpm build
pnpm release
```

## NOTES

- No `.github/workflows` directory exists in this checkout.
- `tool/publish.mjs` bumps the patch version, runs `pnpm run build`, commits `Release <version>`, publishes to npm, and pushes Git changes.
- The repository tracks IntelliJ project files under `.idea/`; avoid touching them unless the task is IDE-related.
