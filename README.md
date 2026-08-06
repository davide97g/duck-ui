<p align="center">
  <img src="public/duck.png" alt="duck/ui" width="120" />
</p>

<h1 align="center">duck/ui</h1>

<p align="center">
  A dark-first component registry with holographic accents and thick sticker borders.<br />
  Rides on shadcn distribution, so the CLI, the MCP server and your editor already know what to do with it.
</p>

<p align="center">
  <a href="https://duckui.davideghiotto.it">duckui.davideghiotto.it</a> ·
  <a href="https://duckui.davideghiotto.it/docs">Docs</a> ·
  <a href="https://duckui.davideghiotto.it/create">Theme editor</a> ·
  <a href="https://duckui.davideghiotto.it/llms.txt">llms.txt</a>
</p>

---

**Open code. AI ready. Quack.**

Everything installs through the standard shadcn CLI under the `@duck` namespace: the components and
blocks listed below, two themes, one hook. Nothing is wrapped, nothing is hidden behind a package —
the files land in your repo and they are yours to edit.

## Install (in your project)

```jsonc
// components.json
{ "registries": { "@duck": "https://duckui.davideghiotto.it/r/{name}.json" } }
```

```bash
npx shadcn@latest add @duck/theme        # always first — restyles every shadcn component
npx shadcn@latest add @duck/quack-button @duck/holo-avatar @duck/sticker-card
```

`@duck/theme` ships the light and dark token sets, the utility classes, the keyframes and a print
layer; every component assumes it is there. `@duck/theme-noir` is the alternative — the same token
contract with the sticker vocabulary dialled to zero, dark in both modes — and it proves the point:
an identity swap touches no component markup. Registry dependencies resolve on their own —
`@duck/quack-button` pulls `@duck/duck-spinner` and `@duck/use-holo-pointer` without being asked.

Working with an AI assistant? Point it at [`/llms.txt`](https://duckui.davideghiotto.it/llms.txt), or install the
skill: `skills add dacoder/duck-ui`.

## Components

| Group | Components |
|---|---|
| Actions | `quack-button`, `holo-button`, `copy-button`, `hud-chip`, `duck-button-group` |
| Surfaces | `sticker-card`, `sticker-media-card`, `code-window`, `code-snippet`, `terminal`, `sticker-sheet`, `sticker-dialog`, `sticker-drawer`, `sticker-popover`, `video-card`, `quack-bubble`, `duck-viewport` |
| Display | `holo-avatar`, `holo-badge`, `hud-label`, `hud-code`, `announcement`, `duck-spinner`, `holo-separator`, `duck-mark`, `sticker-kbd`, `stream-text`, `duck-prose`, `duck-marquee`, `duck-reveal`, `duck-timeline`, `duck-stat-grid`, `duck-section-marker`, `duck-chart` |
| Inputs | `glow-input`, `glow-search`, `glow-select`, `glow-color`, `duck-switch`, `sticker-checkbox`, `sticker-radio-group`, `sticker-toggle-group`, `duck-slider`, `duck-media-slider`, `duck-volume`, `duck-audio-player`, `sticker-otp`, `sticker-drop` |
| Navigation | `sticker-carousel`, `duck-tabs`, `theme-switcher`, `duck-list-header`, `duck-list-row`, `duck-scroll-rail`, `duck-command` |
| Feedback | `quack-toast`, `sticker-skeleton`, `sticker-progress`, `empty-pond`, `duck-thinking`, `sticker-tooltip` |
| Foundation | `theme`, `theme-noir`, `use-holo-pointer` |

Both tables below are hand-written prose over a generated list — `pnpm check:registry` fails if a
registry item is missing from either one. `registry.json` and `/llms-full.txt` are generated outright.

## Blocks

Whole sections instead of single controls. Same CLI, but the file lands in `components/blocks/` and
pulls in every component it renders.

| Block | What |
|---|---|
| `duck-hero` | Announcement pill, display headline, two actions, self-typing terminal |
| `duck-pricing` | Tier grid with a monthly / yearly switch and one featured tier |
| `duck-dashboard` | App shell: sidebar drawer, sticky top bar, stat row, your page as children |
| `duck-site-header` | Content-site top bar: identity, anchors, one action, a real drawer below `lg` |
| `duck-site-footer` | Content-site bottom: identity and a sentence, link columns, a hairline, the small print |
| `duck-faq` | Questions and their `FAQPage` JSON-LD from one array, so markup and structured data cannot drift |
| `duck-logo-wall` | The proof strip, static or marquee. Every logo sized by height alone, brand colour flattened until hover |
| `duck-cta-band` | The closing ask: one headline, one button, an optional email row that is a plain `<form>` |
| `duck-workbench` | Editor shell: icon tool rail, pan-and-zoom canvas, inspector, status strip |
| `duck-chat-thread` | Transcript, wait state and composer as one surface. Follows the stream only from the bottom |
| `duck-media-shelf` | Rows of artwork from one array. One tile width for the whole wall, skeletons in the tiles' ratio |
| `duck-player-bar` | The docked transport: fixed middle column, read-out that follows the drag, opt-in shortcuts |
| `duck-list-view` | The admin list and the four states its data is in — including two different empty screens |
| `duck-settings-panel` | Label-beside-control rows, and a save bar that appears only when there is something to save |
| `duck-auth-card` | Sign in with a code: address first, digits second, focus following the step |
| `duck-upload` | The queue behind the drop zone. You own the transport; it is handed `onProgress` and an `AbortSignal` |
| `duck-changelog` | Releases down the timeline spine, each anchored on its version so it can be linked |

```bash
npx shadcn@latest add @duck/duck-hero
```

duck/ui is additive. There is no table, menu, select or combobox here — add the standard shadcn/ui
ones and the theme styles them on sight. The overlays duck does ship are the ones its edge changes:
`sticker-dialog`, `sticker-drawer`, `sticker-popover`, `sticker-tooltip` and `duck-command`. Colour,
radius and type carry over to a stock overlay on their own; the 3px edge does not, so paste
`STICKER_SURFACE` from `@duck/sticker-popover` onto a `DropdownMenuContent` or `SelectContent` that
opens next to a sticker surface.

A tooltip is still the weakest place to put anything: hover-only chrome, absent on touch, gone the
moment the pointer leaves. Use it for a label with nowhere else to live — an icon-only control, a
truncated value — and print shortcuts inline with `sticker-kbd`, where every user can see them.

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

Requires Node 20+ and pnpm. `pnpm build` runs `registry:build` first, so the served JSON always
matches the sources — run `pnpm registry:build` on its own after touching anything under `registry/`
if you want the change visible in `pnpm dev`.

### Environment

Copy `.env.example` to `.env.local`. Three variables matter:

| Variable | Default | Why |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://duckui.davideghiotto.it` | Absolute origin, no trailing slash. Drives `metadataBase`, canonical tags, `sitemap.xml`, `robots.txt`, `llms.txt` and the `@duck` registry URL shown throughout the docs. |
| `NEXT_PUBLIC_UMAMI_URL` | empty | Full URL of `script.js` on a self-hosted Umami instance. Empty means no analytics script is served. |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | empty | Website id from the Umami dashboard. Both are required before anything is loaded. |

The analytics pair also drives the wording of the privacy and cookie notices, so a build either runs
analytics and says so on `/legal`, or does neither. Setup lives in
[`docs/marketing/analytics.md`](docs/marketing/analytics.md).

They are read at **build** time, not runtime — `NEXT_PUBLIC_*` is inlined into the client bundle and the
prerendered HTML. Changing one means rebuilding, which is why the Dockerfile takes all three as build
args. Moving the site to another domain is one variable plus a rebuild; nothing else hardcodes an
origin.

## Layout

| Path | What |
|---|---|
| `app/` | duckui.davideghiotto.it: landing, docs, theme editor, `llms.txt` routes |
| `registry.json` | Registry index: shadcn schema, `@duck` namespace, dependencies |
| `registry/duck/ui/` | The components. Source of truth. |
| `registry/duck/blocks/` | The blocks: whole sections composed from the components |
| `registry/duck/hooks/` | `use-holo-pointer` |
| `components/previews/` | One live example per component (blocks under `previews/blocks/`), rendered *and* printed on its docs page |
| `components/site/`, `components/docs/` | The site itself — not part of the registry |
| `lib/registry-docs.ts` | Component metadata driving docs, search, sidebar and `llms.txt` |
| `public/r/` | Built registry JSON, served statically |
| `public/duck.png`, `app/icon.png` | The mark, and the favicon derived from it |
| `skill/duck-ui/SKILL.md` | Skill for skills.sh (`skills add dacoder/duck-ui`) |
| `app/legal/` | Terms, privacy and cookie notices, driven by `lib/site.ts` and `lib/analytics.ts` |
| `app/compare/` | duck/ui against the other shadcn registries, one page per entry in `lib/comparisons.ts` |
| `lib/faq.ts` | The FAQ, rendered on the landing page and emitted as `FAQPage` JSON-LD and into `llms.txt` |
| `components/seo/structured-data.tsx` | JSON-LD emitters: site graph, breadcrumbs, FAQ, HowTo, ItemList, per-page schema |
| `lib/analytics.ts` | Umami, or nothing. Both states are reflected in the privacy and cookie notices |
| `scripts/sync-registry-homepage.mjs` | Keeps `registry.json`'s `homepage` on `NEXT_PUBLIC_SITE_URL` |
| `Dockerfile` | Multi-stage standalone build used by Dokploy |
| `docs/PLAN.md` | Product plan and roadmap |
| `docs/marketing/` | Distribution plan and the analytics setup |
| `.agents/product-marketing.md` | Positioning and audience context the marketing skills read |

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

Every route prerenders to static HTML at build time, so there is no server-side rendering at
request time and no runtime dependency beyond serving files. The registry under `/r/` is plain JSON
with permissive CORS, so consuming it needs no server at all.

The repo ships a multi-stage `Dockerfile` built on `output: "standalone"`. The runner stage copies
only the traced server bundle, `public/` and `.next/static`, and runs as a non-root user.

```bash
docker build --build-arg NEXT_PUBLIC_SITE_URL=https://duckui.davideghiotto.it -t duck-ui .
docker run -p 3000:3000 duck-ui
```

**Dokploy.** Create an Application, point it at this repo, set Build Type to `Dockerfile`, and add
`NEXT_PUBLIC_SITE_URL` as a **build-time argument** — not only a runtime env var, or the default
origin gets baked into the HTML. Set the domain to `duckui.davideghiotto.it` with HTTPS and
Let's Encrypt, container port `3000`.

Static hosting works too: add `output: "export"` to `next.config.ts` and serve `out/`. That drops the
custom headers in `next.config.ts`, so CORS and caching for `/r/` would move to the CDN or reverse
proxy.

## Legal

`/legal/terms`, `/legal/privacy` and `/legal/cookies` are generated from `lib/site.ts` — the
controller name, contact address and the `lastUpdated` date all live in the `legal` export there.
Bump `lastUpdated` when you edit the copy.

The site sets **no cookies** and runs **no analytics**, which is why there is no consent banner. If
that ever changes, the privacy and cookie notices have to be rewritten before the change ships.

## Security headers

`next.config.ts` sets a CSP plus the usual hardening headers. One deliberate compromise is worth
knowing about before someone "fixes" it:

`script-src` includes `'unsafe-inline'`. Every page ships 28–42 inline scripts carrying the RSC
flight payload, so their content varies per page and per build. Hashes would therefore change on
every build and cannot live in a static header, and a nonce means reading `headers()` in a server
component — which opts all 39 routes into dynamic rendering and throws away the prerendering the
whole site depends on.

What the policy still enforces: no external script can load, no connection to another origin, no
framing, no `<base>` or form-action hijacking, no plugins. The only untrusted input on the site is
the `?c=` theme preset, and `theme-editor.tsx` parses it to range-clamped finite numbers, so there
is no place for injected markup to land.

Verified with a real browser against a production build — zero CSP violations across the landing
page, the theme editor mid-slider-drag, component pages, the command menu and a theme switch.

---

[MIT licensed](LICENSE). Built by [dacoder](https://dacoder.it) — the build is documented on
[YouTube](https://www.youtube.com/@davideghi).
