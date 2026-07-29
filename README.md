<p align="center">
  <img src="public/duck.png" alt="duck/ui" width="120" />
</p>

<h1 align="center">duck/ui</h1>

<p align="center">
  A dark-first component registry with holographic accents and thick sticker borders.<br />
  Rides on shadcn distribution, so the CLI, the MCP server and your editor already know what to do with it.
</p>

<p align="center">
  <a href="https://duckui.dev">duckui.dev</a> ·
  <a href="https://duckui.dev/docs">Docs</a> ·
  <a href="https://duckui.dev/create">Theme editor</a> ·
  <a href="https://duckui.dev/llms.txt">llms.txt</a>
</p>

---

**Open code. AI ready. Quack.**

17 components, one theme and one hook, all installed by the standard shadcn CLI under the `@duck`
namespace. Nothing is wrapped, nothing is hidden behind a package — the files land in your repo and
they are yours to edit.

## Install (in your project)

```jsonc
// components.json
{ "registries": { "@duck": "https://duckui.dev/r/{name}.json" } }
```

```bash
npx shadcn@latest add @duck/theme        # always first — restyles every shadcn component
npx shadcn@latest add @duck/quack-button @duck/holo-avatar @duck/sticker-card
```

`@duck/theme` ships the light and dark token sets, the utility classes and the keyframes; every
component assumes it is there. Registry dependencies resolve on their own — `@duck/quack-button`
pulls `@duck/duck-spinner` and `@duck/use-holo-pointer` without being asked.

Working with an AI assistant? Point it at [`/llms.txt`](https://duckui.dev/llms.txt), or install the
skill: `skills add dacoder/duck-ui`.

## Components

| Group | Components |
|---|---|
| Actions | `quack-button`, `holo-button`, `copy-button` |
| Surfaces | `sticker-card`, `code-window`, `terminal`, `sticker-sheet`, `video-card` |
| Display | `holo-avatar`, `holo-badge`, `announcement`, `duck-spinner`, `holo-separator` |
| Inputs | `glow-input` |
| Navigation | `duck-tabs`, `theme-switcher` |
| Feedback | `quack-toast` |
| Foundation | `theme`, `use-holo-pointer` |

duck/ui is additive. For a dialog, a dropdown or a table, use standard shadcn/ui — the theme already
styles it.

## Design rules

1. **One holo element per viewport.** It is the seasoning, not the meal.
2. **Duck lime (`--primary`) carries every default action.** Holo is reserved for the one thing that matters most.
3. **One idle animation per viewport.** Reactive motion — press, ripple, state change — has no budget, because the user caused it.
4. **Dark is designed first.** Light is derived and checked separately.
5. **Semantic tokens only.** No raw hex or oklch inside component code.
6. **Sticker language.** Thick borders (3px), radius at or above `0.75rem`, soft glows over hard shadows.

## Develop (this repo)

```bash
pnpm install
pnpm dev              # site on localhost:3000
pnpm registry:build   # rebuild public/r/*.json from registry.json
pnpm build            # production build
```

Requires Node 20+ and pnpm. Run `pnpm registry:build` after touching anything under `registry/` —
the served JSON embeds the component source.

## Layout

| Path | What |
|---|---|
| `app/` | duckui.dev: landing, docs, theme editor, `llms.txt` routes |
| `registry.json` | Registry index: shadcn schema, `@duck` namespace, dependencies |
| `registry/duck/ui/` | The 17 components. Source of truth. |
| `registry/duck/hooks/` | `use-holo-pointer` |
| `components/previews/` | One live example per component, rendered *and* printed on its docs page |
| `components/site/`, `components/docs/` | The site itself — not part of the registry |
| `lib/registry-docs.ts` | Component metadata driving docs, search, sidebar and `llms.txt` |
| `public/r/` | Built registry JSON, served statically |
| `public/duck.png`, `app/icon.png` | The mark, and the favicon derived from it |
| `skill/duck-ui/SKILL.md` | Skill for skills.sh (`skills add dacoder/duck-ui`) |
| `docs/PLAN.md` | Product plan and roadmap |

## How it fits together

**One copy of every file.** Registry sources live in `registry/duck/`, but they import from
`@/components/ui/*` and `@/hooks/*` exactly as a consumer's project would. `tsconfig.json` maps those
aliases back into `registry/duck/`, so the same file serves both the site and the CLI. Nothing is
duplicated, nothing is rewritten at build time.

**Zero-JS components where possible.** Motion lives in CSS keyframes shipped by the theme. `motion`
is a site dependency, not a registry one.

**Pointer effects run outside React.** `useHoloPointer` writes `--fx`, `--fy`, `--rx`, `--ry`,
`--mx`, `--my` inside a single animation frame, so foil, tilt and magnetism never trigger a render.

**Snippets cannot drift.** Every docs example reads its own source file at build time and highlights
it with Shiki.

**llms.txt is generated.** `/llms.txt` and `/llms-full.txt` are route handlers built from
`lib/registry-docs.ts` — the same source the docs pages use.

## Deploy

Vercel: `pnpm registry:build && pnpm build`, then point `duckui.dev` at it. The registry is static
JSON under `/r/`, so consuming it needs no server.

---

MIT licensed. Built by [dacoder](https://dacoder.it) — the build is documented on
[YouTube](https://www.youtube.com/@davideghi).
