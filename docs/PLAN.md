# duck/ui — Product Plan

A duck-branded design system built on shadcn's distribution rails. Theme-first V1, grown in public through the YouTube channel.

Working name: **duck/ui** (namespace `@duck`). Alternatives if taken: `quackui`, `dacoder/ui`, `papera` (IT for rubber duck vibe). Domain candidates: `duck.dacoder.it` or `duckui.dev`.

---

## 1. Strategy: why "registry on shadcn rails" wins

You don't rebuild shadcn — you plug into it. shadcn's CLI, MCP server, and skills system are *registry-agnostic*: any third-party registry gets CLI installs, MCP access, and AI-assistant support for free once it serves the right JSON.

What shadcn provides for free:

- **CLI**: users run `npx shadcn add @duck/button` — zero CLI code to write
- **MCP**: `shadcn` MCP server can search/browse/install from your registry once configured in `components.json`
- **Skills**: the shadcn skill (`skills.sh`) already teaches AI assistants how to consume third-party registries
- **Schemas**: `registry.json` / `registry-item.json` are published JSON Schemas — you just conform
- **Distribution**: submit to the Registry Directory (`/docs/registry/registry-index`) to appear in the built-in CLI index

What you build (your moat):

1. A **distinctive theme** — nobody picks a second neutral shadcn; they pick a *vibe*
2. **Signature components** shadcn doesn't have
3. A **docs site + theme editor** that *is* the marketing
4. **Content flywheel**: the YouTube channel

---

## 2. Brand & aesthetic direction

From your channel and the Pinterest refs (ghost sticker: white mark, thick black outline, holographic rainbow glow ring, pure black background):

**Concept: "Holo Duck" — playful sticker energy on a serious dark canvas.**

- **Canvas**: near-black (`oklch(0.13 0 0)`), dark-first (light mode secondary — inverse of shadcn)
- **Signature accent**: iridescent/holographic gradient (violet → cyan → green, like the ghost's ring) used *sparingly*: focus rings, active states, primary CTA borders, brand marks
- **Duck yellow-orange** (from your avatar: `oklch(0.82 0.16 75)` ≈ amber) as the solid primary color
- **Sticker language**: slightly thick borders, generous radius (`0.75rem+`), soft outer glows instead of hard shadows
- **Typography**: a rounded-geometric display face for headings (Nunito Sans / Bricolage Grotesque), mono for code, clean sans for body
- **Voice**: your channel's tone — "Yooo!", playful, Italian-flavored English, meme-aware but technically sharp. Docs written like you talk in videos.

Theme tokens ship as CSS variables on top of shadcn's theming contract (`--background`, `--primary`, `--ring`, etc.) plus duck-specific extras: `--holo` (the gradient), `--glow`, `--sticker-border`.

**Micro-identity details**: duck favicon, a waddling duck loading spinner, `🦆` in CLI output via registry item descriptions, easter-egg "quack" toast.

---

## 3. Product surfaces (shadcn parity map)

| shadcn | duck/ui equivalent | How |
|---|---|---|
| ui.shadcn.com | duckui.dev — Next.js site, dark holo landing | Build |
| Components + docs | MDX docs, live previews, copy-paste + CLI tab | Build (Fumadocs or shadcn's docs template) |
| CLI | `npx shadcn add @duck/*` | Free (registry) |
| llms.txt | `duckui.dev/llms.txt` + `/llms-full.txt` | Build (generated from MDX at build time) |
| MCP | shadcn MCP + your registry config; later optional dedicated `duck-mcp` | Mostly free |
| Skills | `skills add dacoder/duck-ui` — SKILL.md teaching duck patterns, holo usage rules, theme tokens | Build (small) |
| /create theme editor | duckui.dev/create — token editor with live preview, export | Build (the big differentiator) |
| Registry Directory listing | Submit once live | Free |

---

## 4. Architecture

Monorepo (pnpm + turborepo):

```
duck-ui/
├── apps/
│   └── web/                  # duckui.dev — site, docs, /create editor
│       ├── app/(marketing)/  # landing
│       ├── app/docs/         # MDX docs
│       ├── app/create/       # theme editor
│       ├── public/r/         # built registry JSON (served statically)
│       └── scripts/build-llms.ts   # llms.txt generator
├── packages/
│   ├── registry/             # source of truth
│   │   ├── registry.json
│   │   ├── themes/           # duck-dark, duck-light, holo variants
│   │   ├── ui/               # restyled + signature components
│   │   ├── blocks/           # hero, pricing, dashboard shells
│   │   └── lib/              # cn, holo utilities
│   └── skill/                # SKILL.md + references for skills.sh
└── registry.json
```

Pipeline: components in `packages/registry` → `shadcn build` → static JSON in `apps/web/public/r/` → consumable by CLI/MCP. Users add to `components.json`:

```json
{ "registries": { "@duck": "https://duckui.dev/r/{name}.json" } }
```

Stack: Next.js 15, Tailwind v4, Radix (base library), TypeScript. Same as shadcn — least friction for the target audience.

---

## 5. V1 scope (theme-first)

**Theme**: `duck-dark` (flagship) + `duck-light`. Full shadcn CSS-variable contract so *every* existing shadcn component looks duck-styled the moment the theme is installed: `npx shadcn add @duck/theme`.

**~10 signature components** (things shadcn doesn't have, or radically restyled):

1. `holo-button` — CTA with animated iridescent border
2. `sticker-card` — thick border + glow, the ghost-sticker look
3. `holo-badge`
4. `glow-input` — holo focus ring
5. `duck-spinner` — waddling duck loader
6. `code-window` — macOS-style code block for tutorial content (perfect for your videos)
7. `video-card` — YouTube embed card with duration/views (dogfood on your own site)
8. `announcement` — pill banner with shimmer
9. `terminal` — animated typed CLI demo
10. `theme-switcher` — dark/light/holo toggle

**Blocks (3)**: hero, pricing, dashboard shell — all duck-themed.

**Docs**: install per framework, theming, each component, "for AI" page (llms.txt, MCP setup, skill install).

**/create editor (V1-lite)**: pick base hue / radius / glow intensity / holo on-off → live preview on real components → export as `globals.css` + `components.json` snippet + `npx shadcn add` command with a preset code (mirroring shadcn's `--preset [CODE]` mechanic: encode the config in a shareable short code, e.g. `duckui.dev/create?c=XYZ`).

---

## 6. AI surface details

- **llms.txt**: index of docs with one-line descriptions (mirror shadcn's format exactly — it's the de facto standard). Also `llms-full.txt` with full content. Generate from MDX frontmatter at build.
- **MCP**: document `shadcn` MCP setup with `@duck` namespace configured. That gives "add a duck sticker-card to my page" in Claude Code/Cursor day one. A dedicated MCP server only later, if you need duck-specific tools (e.g. `apply_duck_theme`, `generate_holo_palette`).
- **Skill**: publish to skills.sh. SKILL.md contents: when to use holo vs solid amber (rule: holo = one per viewport), token reference, component composition patterns, registry namespace usage. This is cheap to write and a great video topic.

---

## 7. Content flywheel (channel integration)

Each milestone = a video. The repo is the series:

1. "Sto costruendo il mio design system (come shadcn)" — announcement + brand reveal
2. Theme tokens + OKLCH deep dive
3. Building the holo-button (CSS gradient border tricks)
4. Your own shadcn registry in 20 minutes
5. llms.txt + MCP: components installable by AI
6. Writing the skill — teaching Claude your design system
7. Building /create — theme editor with export
8. Launch: Registry Directory submission + Product Hunt

Cross-links: dacoder.it → duckui.dev, docs footer → channel, `video-card` component embedding the relevant tutorial on each component's doc page (unique feature — no other design system does docs-as-video-companion).

---

## 8. Roadmap

**Phase 0 — Foundation (week 1-2)**: name/domain final, monorepo scaffold, theme tokens, landing page teaser + waitlist.

**Phase 1 — Theme + registry (week 3-5)**: duck-dark/light complete, registry build pipeline live, 5 components, docs skeleton, llms.txt.

**Phase 2 — AI surface (week 6-7)**: MCP docs, skill published, remaining components + blocks.

**Phase 3 — /create + launch (week 8-10)**: theme editor, preset codes, Registry Directory submission, launch video.

**Later**: paid pro blocks (shadcn-style monetization), Figma kit, community registry submissions, dedicated MCP server.

---

## 9. Risks

- **shadcn schema churn** — you're downstream of their registry spec; pin CLI versions, watch changelog. Mitigation: the spec is now stable and versioned.
- **"Another shadcn theme" dismissal** — mitigation: signature components + /create + video-native docs are real differentiation; the theme alone isn't the product.
- **Scope creep toward full parity** — resist restyling all 60 components; the theme covers them automatically. Only hand-build what's *signature*.
- **Naming/trademark** — check `duck ui` collisions on npm/GitHub before committing (there are minor `duckui` projects; verify).

---

## 10. Immediate next actions

1. Verify name availability (npm org, GitHub org, domain)
2. Scaffold monorepo + define the ~40 CSS variables of `duck-dark`
3. Build `sticker-card` + `holo-button` as proof-of-vibe
4. Landing page with the two components live on it
5. Record video #1
