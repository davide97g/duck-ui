# duck/ui

A dark-first component registry with holographic accents and thick sticker borders. It rides on shadcn distribution, so the CLI, the MCP server and your editor already know what to do with it.

**Open code. AI ready. Quack.**

## Quick start (consumers)

```jsonc
// components.json
{ "registries": { "@duck": "https://duckui.dev/r/{name}.json" } }
```

```bash
npx shadcn@latest add @duck/theme        # always first, restyles every shadcn component
npx shadcn@latest add @duck/quack-button @duck/holo-avatar @duck/sticker-card
```

## Quick start (this repo)

```bash
pnpm install
pnpm dev              # site on localhost:3000
pnpm registry:build   # rebuild public/r/*.json from registry.json
pnpm build            # production build
```

## What is here

| Path | What |
|---|---|
| `app/` | duckui.dev: landing, docs, theme editor, llms.txt routes |
| `registry.json` | Registry index, shadcn schema, `@duck` namespace |
| `registry/duck/ui/` | The 17 components. Source of truth. |
| `registry/duck/hooks/` | `use-holo-pointer` |
| `components/previews/` | One live example per component, rendered and printed on its docs page |
| `lib/registry-docs.ts` | Component metadata that drives docs, search, sidebar and llms.txt |
| `public/r/` | Built registry JSON, served statically |
| `skill/duck-ui/SKILL.md` | Skill for skills.sh (`skills add dacoder/duck-ui`) |
| `docs/PLAN.md` | Product plan and roadmap |

## Components

**Actions** quack-button, holo-button, copy-button
**Surfaces** sticker-card, code-window, terminal, sticker-sheet, video-card
**Display** holo-avatar, holo-badge, announcement, duck-spinner, holo-separator
**Inputs** glow-input
**Navigation** duck-tabs, theme-switcher
**Feedback** quack-toast

## Design rules

1. One holo element per viewport. It is the seasoning, not the meal.
2. Duck lime (`--primary`) carries every default action.
3. One idle animation per viewport. Reactive motion has no budget.
4. Dark is designed first, light is derived and checked separately.
5. Semantic tokens only. No raw colors in component code.

## How the aliases work

Registry sources live in `registry/duck/`, but the files import from `@/components/ui/*` and `@/hooks/*` exactly as a consumer's project would. `tsconfig.json` maps those aliases back into `registry/duck/`, so one copy of each file serves both the site and the CLI. Nothing is duplicated and nothing needs rewriting at build time.

## Architecture notes

- **Zero-JS components where possible.** Motion lives in CSS keyframes shipped by the theme. `motion` is used on the site, not in the registry.
- **Pointer effects run outside React.** `useHoloPointer` writes `--fx`, `--fy`, `--rx`, `--ry`, `--mx`, `--my` inside one animation frame, so foil, tilt and magnetism never trigger a render.
- **Code snippets cannot drift.** Every docs example reads its own source file at build time and highlights it with Shiki.
- **llms.txt is generated.** `app/llms.txt` and `app/llms-full.txt` are route handlers built from `lib/registry-docs.ts`, the same source the docs pages use.

## Deploy

Vercel: `pnpm registry:build && pnpm build`. Point `duckui.dev` at it. The registry is static JSON under `/r/`, so no server is required to consume it.

---

Built by [dacoder](https://dacoder.it). The build is documented on [YouTube](https://www.youtube.com/@davideghi).
