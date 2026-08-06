# duck/ui — Product Plan

A duck-branded design system built on shadcn's distribution rails. Theme-first V1, grown in public through the YouTube channel.

Name settled: **duck/ui**, namespace `@duck`, live at [duckui.davideghiotto.it](https://duckui.davideghiotto.it). The rejected alternatives were `quackui`, `dacoder/ui` and `papera`.

**Sections 1–3, 6, 7 and 9 are the original strategy and still hold. Sections 4, 5, 8 and 10 were rewritten on 2026-08-06 to describe what shipped** — the plan is a year-one record now as much as a plan, and a stale one is worse than none. Per-release detail lives in [`docs/releases/`](releases/); what four real applications asked for, and got, is in [`docs/feature-requests/`](feature-requests/).

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

**Shipped as a single Next.js app, not a monorepo.** The workspaces-and-turborepo plan above was dropped in Phase 0: one deployable, one `tsconfig`, one `pnpm install`, and the registry sources live beside the site that documents them. `pnpm-workspace.yaml` stays for the lockfile settings, with no packages under it.

```
duck-ui/
├── app/                      # the site: landing, docs, /create, /compare, /legal
│   ├── docs/                 # installation, theming, components, blocks, motion, ai
│   ├── create/               # theme editor
│   ├── llms.txt/route.ts     # generated from lib/registry-docs.ts at request time
│   └── llms-full.txt/route.ts
├── registry/duck/            # source of truth for what ships
│   ├── ui/                   # 61 components
│   ├── blocks/               # 17 blocks
│   └── hooks/use-holo-pointer.ts
├── components/               # site-only: previews, docs chrome, brand, seo
├── lib/registry-docs.ts      # prop tables and prose, feeds docs pages and llms-full
├── skill/duck-ui/SKILL.md    # the skills.sh skill
├── scripts/                  # check-registry-sync, sync-registry-homepage
├── registry.json             # hand-maintained manifest, 81 items
└── public/r/                 # shadcn build output, served statically
```

Both themes are **inline in `registry.json`** rather than files — `cssVars` for the three token blocks and a `css` object of 24 rules. That is what lets `npx shadcn add @duck/theme` merge tokens into a project's existing stylesheet instead of overwriting it.

Pipeline: `pnpm build` runs `check:registry` → `sync-registry-homepage` → `shadcn build` → `next build`. The first script is the one that matters day to day: it asserts that `registry.json`, `lib/registry-docs.ts`, the previews, the previews barrel, the README tables and `SKILL.md` all name the same set of items, because nothing else links those six places. The second rewrites `registry.json`'s `homepage` from `NEXT_PUBLIC_SITE_URL` so the published JSON never claims a domain the site left.

Users add to `components.json`:

```json
{ "registries": { "@duck": "https://duckui.davideghiotto.it/r/{name}.json" } }
```

Stack: Next.js 15 (`output: "standalone"`), React 19, Tailwind v4, Radix for the six components that need a primitive, TypeScript. Deployed by Docker to Dokploy at `duckui.davideghiotto.it`. Docs are TSX pages over `lib/registry-docs.ts`, not MDX — the prop tables had to be one typed source that the docs pages, `/llms-full.txt` and the sync check could all read.

---

## 5. V1 scope — planned, and what actually shipped

V1 was theme-first and deliberately small: two themes, ten components, three blocks. All of it shipped, and then six releases kept going. **State as of 2026-08-06: 81 registry items — 61 components, 17 blocks, 2 themes, 1 hook.**

**Themes**: `@duck/theme` (dark flagship, light derived) shipped as planned, and `@duck/theme-noir` came later as the proof that the token contract holds — the same variables with the sticker vocabulary dialled to zero, dark in both modes, and not one component's markup changed. The theme also carries the utility classes, the keyframes and a print layer, which the plan did not anticipate.

**Components**: the ten above all exist, except that `theme-switcher` toggles light / dark / system rather than dark / light / holo — holo is an accent inside a theme, not a mode a reader picks. The other fifty-one came from four migration reports (`docs/feature-requests/`), each one an app built on the registry that recorded what it had to hand-write instead. That is where the inputs, the media controls, the HUD family, `duck-viewport`, `duck-command` and `duck-chart` came from. All four reports are now closed.

**Blocks**: three planned, seventeen shipped. The last twelve landed in one release ([the block layer](releases/2026-08-04-the-block-layer.md)) once the ratio became the problem — sixty-one components of which the blocks only ever composed eleven, so every consuming app was writing the joins by hand.

**Docs**: `/docs/installation`, `/docs/theming`, `/docs/components` (+ a page per item), `/docs/blocks`, `/docs/motion`, `/docs/ai`. Plus what the plan did not list: `/compare` and five comparison pages, `/legal` (terms, privacy, cookies), and structured data across all of it.

**/create editor**: shipped as scoped. Six sliders — hue, chroma, lightness, radius, glow, sticker border — driving live components, with the generated `.dark` token block to copy and a share link. The preset code is the six values joined by hyphens and carried in `?c=`, which is the plan's `--preset [CODE]` mechanic without a server or a code registry behind it. `decode()` re-applies the slider bounds, because that parameter is the only untrusted input on the site.

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

Phases 0 to 2 are done. Phase 3 shipped its product half and none of its distribution half — the editor exists, the launch has not happened, and that is the whole of what is left.

**Phase 0 — Foundation. Done.** Name, domain and deploy at `duckui.davideghiotto.it`. Flat Next.js app instead of the monorepo. No waitlist — the site shipped with the components on it, which is a better teaser than a form.

**Phase 1 — Theme + registry. Done.** Both themes, the build pipeline, the sync check, docs, `llms.txt` and `llms-full.txt`.

**Phase 2 — AI surface. Done.** `/docs/ai` covers the MCP path, the skill is written and published, and the registry grew to 61 components and 17 blocks against four real applications.

**Phase 3 — Launch. Editor done, distribution not started.** What is actually blocking, in order:

1. **Screenshots** — 5–8 at 1920×1080. Needed by Product Hunt, Peerlist and every gallery.
2. **A 60–90s demo video.** The theme editor is the obvious cut. The channel is where it lives.
3. **Stand up Umami.** `lib/analytics.ts` and the three events ship already; the instance and the two build arguments do not exist, so today a submission cannot be attributed.
4. **A 1024×1024 logo export.** Everything else in the asset set is done.
5. **Tier 0 submissions** — shadcn Registry Index and Directory, registry.directory, the awesome-shadcn lists, GitHub topics and repo metadata, verify the skills.sh listing. Free, and the highest-leverage listings that exist for this product.
6. **Tier 1 as one coordinated launch**, anchored on the video.

Full target list and the copy for each surface: [`docs/marketing/distribution.md`](marketing/distribution.md).

**Later**: use-case pages (`/for/...`), paid pro blocks, Figma kit, community registry submissions, a dedicated MCP server. None of these are gating anything.

---

## 9. Risks

- **shadcn schema churn** — you're downstream of their registry spec; pin CLI versions, watch changelog. Mitigation: the spec is now stable and versioned.
- **"Another shadcn theme" dismissal** — mitigation: signature components + /create + video-native docs are real differentiation; the theme alone isn't the product.
- **Scope creep toward full parity** — resist restyling all 60 components; the theme covers them automatically. Only hand-build what's *signature*.
- **Naming/trademark** — checked and accepted. The minor `duckui` projects on npm and GitHub do not collide with a registry that publishes no package; the namespace is `@duck` and the domain is owned.

---

## 10. Immediate next actions

The product is ahead of its distribution by a wide margin. Nothing on this list is a component.

1. Shoot 5–8 screenshots at 1920×1080 — landing, a docs page, the theme editor, two or three blocks in place.
2. Cut the 60–90s demo video. Publish it on the channel; the launch is the video.
3. Stand up Umami and set the two build arguments, so the launch is measurable rather than felt.
4. Export the 1024×1024 logo.
5. Submit Tier 0 in full — it is free, it takes an afternoon, and the shadcn Registry Index is the single highest-leverage listing available.
6. Then Tier 1, as one coordinated day.
