# Distribution: directories, launch, and where the links come from

Working doc. Positioning comes from [`.agents/product-marketing.md`](../../.agents/product-marketing.md) — edit that first if the pitch changes, this file second.

duck/ui is a free MIT developer tool, not a SaaS. Most of the generic directory playbook (G2, Capterra, AI tool aggregators, local business listings) is the wrong fit and gets rejected or ignored. The value is concentrated in the shadcn ecosystem surfaces, the developer launch surfaces, and the AI-agent surfaces — roughly 25 targets that matter instead of 300 that do not.

---

## Readiness

Directories are the *source* of link equity. They need destinations worth landing on. State as of 2026-08-06:

| Requirement | State |
|---|---|
| Publicly accessible, no wall | Done |
| Terms, privacy, cookies | Done — `/legal` |
| Single H1, sequential headings | Done across landing, docs and compare |
| `FAQPage` JSON-LD | Done — landing page and every comparison page |
| `SoftwareApplication` / `SoftwareSourceCode` / `WebSite` graph | Done — `components/seo/structured-data.tsx` |
| `HowTo` on install | Done — `/docs/installation` |
| `ItemList` on the component index | Done — `/docs/components` |
| Comparison pages | Done — `/compare` plus five `/compare/[slug]` pages |
| `llms.txt` + `llms-full.txt` | Done, now including FAQ and comparisons |
| AI crawlers explicitly allowed | Done — `app/robots.ts` |
| Logo: PNG, SVG, 1024 square, favicon | Done except the square — `public/duck.svg`, `public/duck.png` (512), favicon and apple icon. A 1024×1024 export is still missing |
| 5–8 real screenshots at 1920×1080 | **Missing.** Needed by Product Hunt, Peerlist, most galleries |
| 60–90s demo video | **Missing.** The channel is the natural place for it; a cut of the theme editor is the obvious take |
| Use-case pages (`/for/...`) | **Missing.** Lower priority than screenshots |
| Analytics + referrer tracking | Built, not running. `lib/analytics.ts` and the three events ship; the Umami instance and the two build arguments do not exist yet — see [analytics.md](analytics.md) |

**Hard blocks before Tier 1:** screenshots, demo video, and standing up Umami. Everything else can ship after.

---

## Tier 0 — Ecosystem surfaces

Highest value by a wide margin. These are the places where someone is already looking for exactly this, and the audience arrives pre-qualified. Do these first regardless of the rest of the plan.

| Target | URL | Why it matters | Status |
|---|---|---|---|
| shadcn Registry Index (official) | `ui.shadcn.com/docs/registry/getting-started` | Namespace submission. Once accepted, users add `@duck` by name instead of pasting a URL template. The single highest-leverage listing that exists for this product | Todo |
| shadcn Registry Directory | `ui.shadcn.com/docs/directory` | The official list of community registries, linked from the docs | Todo |
| registry.directory | `registry.directory` | The independent explorer for shadcn registries. Dedicated audience, all of it in-market | Todo |
| Awesome shadcn/ui — registries | `shadcn.io/awesome/registries` | Curated registry list with real traffic | Todo |
| awesome-shadcn-ui (GitHub) | `github.com/birobirobiro/awesome-shadcn-ui` | PR to the list. Dofollow from a high-star repo | Todo |
| skills.sh | `skills.sh` | `skills add dacoder/duck-ui` already exists — verify the listing renders, description reads well, and it links back to the docs | Verify |
| GitHub topics | repo settings | `shadcn`, `shadcn-ui`, `shadcn-registry`, `react-components`, `tailwindcss`, `design-system`, `ui-components`. Free discovery, thirty seconds of work | Todo |
| GitHub repo metadata | repo settings | Website field set to the site, description matching the one-liner, social preview image set | Todo |

## Tier 1 — Launch surfaces

One moment, coordinated. Do not spread these across weeks; they feed each other.

| Target | Notes |
|---|---|
| Product Hunt | The anchor. Needs the demo video and screenshots. Ship on a Tuesday–Thursday |
| Hacker News (Show HN) | Title states what it is, no adjectives. "Show HN: duck/ui — a dark-first shadcn component registry" |
| Peerlist Launchpad | Developer audience, low noise, real traffic |
| DevHunt | Developer-tool specific |
| Fazier | Launch aggregator, low effort |
| r/nextjs, r/reactjs, r/tailwindcss | Participate before posting. A registry post with a GIF of the theme editor is on-topic; a link drop is not |
| Indie Hackers | Build-in-public framing fits the channel angle |
| dev.to / Hashnode | A build writeup, not an announcement. "How the theme restyles components you already installed" |
| YouTube | The channel is the strongest owned surface. The launch video is the launch |

## Tier 2 — Galleries and open-source directories

Rolling, no deadline. Each is a dofollow link from a domain with real authority.

| Target | Fit |
|---|---|
| Tailkits | Tailwind-specific directory, exact fit |
| Tailwind Awesome | Tailwind components and templates |
| OpenAlternative | Open-source tool directory, MIT qualifies |
| AlternativeTo | List as an alternative to the other registries — points back at `/compare` |
| LibHunt | Open-source project index |
| Land-book / Godly / One Page Love | Site-design galleries. The landing page is the submission; a dark holographic site is what they collect |
| Awwwards / CSS Design Awards | Long shot, but the site is the product here |

## Tier 3 — AI and agent surfaces

The `llms.txt`, the skill and the MCP path are genuine differentiators, so these are a real fit rather than a stretch.

| Target | Fit |
|---|---|
| skills.sh (see Tier 0) | Already published, needs verification |
| Claude Code / Cursor / Copilot skill and rules collections | Community lists of agent skills — the duck/ui SKILL.md belongs on them |
| llms.txt directories | Several exist and index sites publishing the file. Low effort, and they are exactly the sites AI crawlers read |

**Not a fit — do not submit:** G2, Capterra, TrustRadius (B2B review sites needing 20+ customer reviews), AI tool aggregators like Futurepedia and TAAFT (duck/ui is not an AI tool), MCP registries (duck/ui is not an MCP server — it is consumed *through* one), no-code directories, press-release sites. Forcing a listing into the wrong category gets it rejected and burns the first-submission advantage.

---

## Positioning variants

Never paste the same description twice — duplicate copy across directories gets down-weighted, and each audience wants a different opening.

**Tagline (under 10 words)**
Sticker energy on shadcn rails.

**Short (60 chars)**
Dark-first shadcn registry with holographic sticker components.

**Ecosystem surfaces — lead with the install path**
> A shadcn component registry under the `@duck` namespace. One command installs a dark-first theme that restyles the shadcn components you already have, then 61 signature components, 17 blocks and a hook install the same way. Files land in your repo under MIT — no package, no runtime dependency.

**Launch surfaces — lead with the problem**
> Every shadcn app looks like every other shadcn app. duck/ui is a registry that fixes that with one install: a dark-first token set with holographic accents and thick sticker borders, plus the components shadcn doesn't ship. Tune it live in the theme editor, export the CSS, own every file.

**Developer galleries — lead with the technical stance**
> Dark designed first, light derived from it. Zero runtime JavaScript from the registry — motion is CSS keyframes shipped by the theme. Semantic tokens only, so retuning the theme retunes every component. React 19, Tailwind v4, installed by the standard shadcn CLI.

**AI and agent surfaces — lead with the machine path**
> A shadcn registry built to be consumed by assistants: static JSON at a stable URL, `llms.txt` and `llms-full.txt` with every prop table, an installable skill, and the shadcn MCP server as the install path. An agent can add a component correctly without a human reading the docs.

---

## Order of operations

1. Fix the hard blocks: screenshots, demo video, analytics.
2. Tier 0 in full. This is the week that matters, and it is mostly free.
3. Let Tier 0 index. Check what the compare pages pick up.
4. Tier 1 as one coordinated launch, anchored on the YouTube video.
5. Tier 2 and Tier 3 rolling, a few per week.

Track outcomes per listing — referral traffic and registry JSON fetches, not the fact of submission. A listing that sends nothing in ninety days is a listing to stop maintaining.
