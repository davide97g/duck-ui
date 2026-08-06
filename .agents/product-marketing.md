# Product Marketing Context

**Document version:** v1
**Last updated:** 2026-08-06

> Drafted from the repo (README, `app/page.tsx`, `lib/site.ts`, `docs/PLAN.md`, `skill/duck-ui/SKILL.md`).
> Sections marked **[assumption]** are inferred, not confirmed — correct them.

## Product Overview
**One-liner:** A dark-first shadcn component registry with holographic accents and thick sticker borders.

**What it does:** Ships 61 components, 17 blocks, two themes and one hook through the standard shadcn CLI under the `@duck` namespace. `@duck/theme` restyles every shadcn component a project already has — the rest is additive. Source files land in the consumer's repo; nothing is wrapped in a package or hidden behind a runtime dependency.

**Product category:** shadcn registry / third-party component registry. Adjacent shelves buyers browse: "shadcn component library", "React UI kit", "Tailwind design system", "shadcn theme".

**Product type:** Open-source developer tool (MIT). Docs site + registry JSON + theme editor.

**Business model:** Free, MIT, no monetization on the registry itself. Value accrues to the author's audience: the dacoder YouTube channel and personal brand. Registry is the artifact the content is built around ("grown in public through the YouTube channel" — `docs/PLAN.md`).

## Target Audience
**Target companies:** Not company-gated. Solo devs, indie hackers, small product teams, agencies shipping React/Next.js apps. Anyone already running Tailwind v4 + shadcn.

**Decision-makers:** The developer is the buyer. No procurement, no approval. A frontend/full-stack dev picks the registry inside an afternoon.

**Primary use case:** "My shadcn app looks like every other shadcn app." They want a distinct visual identity without abandoning shadcn's distribution or rewriting components.

**Jobs to be done:**
- Make a default shadcn project look intentional in one command.
- Get signature components (holo avatar, quack button, sticker sheet, terminal) shadcn doesn't ship.
- Hand an AI assistant a registry it can install from correctly, without hallucinating props.

**Use cases:**
- Restyle an existing shadcn app: install `@duck/theme`, existing components inherit the tokens, markup unchanged.
- Green-field side project / hackathon build that needs personality on day one.
- Landing page assembled from blocks (`duck-hero`, `duck-pricing`, `duck-faq`, `duck-cta-band`), or a whole application shell (`duck-dashboard`, `duck-workbench`, `duck-list-view`, `duck-chat-thread`).
- Agent-driven build: assistant reads `llms.txt` or the shadcn MCP server, installs and composes without a human reading docs.

## Personas
| Persona | Cares about | Challenge | Value we promise |
|---|---|---|---|
| Indie / solo dev (primary) | Shipping fast, looking good, owning the code | No designer; defaults look generic | One install, distinct look, files are yours |
| Frontend dev on a small team | Not fighting the design system, no lock-in | Inherited shadcn setup they can't rip out | Additive — theme restyles, nothing breaks |
| AI coding assistant (real consumer) | Stable JSON, explicit rules, no ambiguity | Registries that are undocumented or dynamic | Static registry, `llms.txt`, `SKILL.md`, MCP |
| Content viewer (YouTube) | Learning how this gets built | Tutorials that skip the hard parts | The repo is the tutorial, in public |

## Problems & Pain Points
**Core problem:** shadcn gives you correctness and accessibility but no opinion. Every shadcn app converges on the same neutral look, and escaping it usually means either hand-theming dozens of variables or adopting a heavier library that takes ownership of your components back.

**Why alternatives fall short:**
- Plain shadcn: neutral by design, light-first, so dark mode is derived and often flat.
- Component libraries (HeroUI, Park UI, Mantine): you install a package; upgrades and overrides are theirs, not yours.
- Copy-paste galleries (Aceternity, Magic UI): visually loud but disconnected pieces — no token contract, no theme that unifies them.
- Theme generators (tweakcn and similar): produce variables, not components. You still have nothing new to render.
- Rolling your own: weeks of token work, and the AI tooling story you get from shadcn for free has to be rebuilt.

**What it costs them:** Days of theming for a look that still reads templated; an app that is indistinguishable from every other shadcn app in a launch feed.

**Emotional tension:** "It works, but it looks like a demo." Embarrassment at shipping something generic; fear that adopting a themed library means lock-in they'll regret.

## Competitive Landscape
**Direct:** Other shadcn registries — Magic UI, Aceternity UI, Origin UI, Kibo UI, Skiper UI, 21st.dev. Mostly effect showcases: individual flashy components with no shared theme contract, so mixing them fragments the design. **[assumption — verify current positioning before publishing comparison pages]**

**Secondary:** Packaged React UI libraries — HeroUI, Park UI, Mantine, Chakra. They own the components; you override at the edges and fight upgrades.

**Indirect:** Staying on stock shadcn plus a theme generator (tweakcn), or hand-rolling tokens. Free and familiar; produces variables, not a system.

## Differentiation
**Key differentiators:**
- **Theme-first, not component-first.** One install retunes shadcn components already in the project. Others give you parts; duck/ui gives you the token contract plus parts.
- **Dark designed first, light derived.** Inverse of nearly every system on this shelf.
- **A real aesthetic with rules.** Holo is rationed to one element per viewport; lime carries default actions. Constraints are published, so output stays coherent instead of loud.
- **Machine-consumable by construction.** Static registry JSON, `llms.txt` + `llms-full.txt`, explicit AI-crawler allowlist, JSON-LD graph, a published skill (`skills add dacoder/duck-ui`), works with the shadcn MCP server.
- **Live theme editor** at `/create` — retune hue, chroma, radius, glow, border width on live components, export CSS or share a preset link.
- **Zero runtime footprint.** Motion in CSS keyframes shipped by the theme; `motion` is a site dependency, not a registry one.
- **Truly additive.** For a dialog, dropdown or table, use standard shadcn — the theme already styles it. No parity race, no migration.

**How we do it differently:** Ride shadcn's distribution instead of competing with it. Zero CLI code, zero MCP code, zero package. The differentiation is the theme, the signature components, the editor and the docs — everything else is inherited.

**Why that's better:** Adoption cost is one command and one revertible file diff. There is no dependency to remove if it doesn't work out.

**Why customers choose us:** They want a vibe, not another neutral. The install is smaller than the decision.

## Objections
| Objection | Response |
|---|---|
| "Another registry — will it still exist in a year?" | The files are copied into your repo under MIT. If the project stops, nothing you shipped stops. There is no runtime dependency to strand. |
| "Too opinionated / too loud for a serious product." | The theme is tunable at `/create` — drop chroma and glow, keep the structure. The holo accent is one element per viewport by rule, not a default. |
| "It doesn't have the components I need." | It is additive on purpose. Standard shadcn covers dialog, dropdown, table — and `@duck/theme` already styles them. |
| "Will it fight my existing shadcn setup?" | The theme ships the full shadcn variable contract plus duck extras. Same markup, different tokens in scope. |
| "One-person project." | Open repo, MIT, static registry served from a stable URL; built in public on the channel. |

**Anti-persona:** Teams under a corporate brand system with fixed tokens; enterprise buyers who need SLAs, support contracts or design-system governance; anyone wanting a batteries-included component set that covers every primitive.

## Switching Dynamics
**Push:** Their app looks like the shadcn default and they know it. Manual theming stalled.

**Pull:** One command visibly changes everything; the theme editor lets them see their own version before committing.

**Habit:** Already invested in shadcn's components and CLI muscle memory — which is why riding those rails matters more than any feature.

**Anxiety:** Lock-in, abandonment, "will this break my existing components." All three are answered by the same fact: it copies files and ships tokens, it does not take ownership.

## Customer Language
**How they describe the problem:** **[assumption — replace with verbatim from GitHub issues, YouTube comments, Discord/X replies]**
- "my app looks like every other shadcn app"
- "I need something with personality but I don't want another UI library"
- "I'm not a designer"

**How they describe us:** **[assumption — no collected verbatim yet]**
- "the sticker one"
- "dark shadcn theme that actually looks designed"

**Words to use:** registry, theme, tokens, install, own the code, additive, dark-first, sticker, holo, quack, open code, AI ready.

**Words to avoid:** library (implies a package), framework, wrapper, dependency, enterprise, solution, revolutionary, seamless.

**Glossary:**
| Term | Meaning |
|---|---|
| Registry | Static JSON the shadcn CLI reads to copy files into a project |
| `@duck` namespace | Registry alias configured in `components.json` |
| Holo | Iridescent gradient finish; one element per viewport |
| Duck lime | `--primary`; carries every default action |
| Sticker language | 3px borders, radius ≥ `0.75rem`, soft glows over hard shadows |
| Block | Whole composed section (`duck-hero`, `duck-pricing`, `duck-dashboard`) |
| `llms.txt` | Plain-text index of the system for AI assistants |

## Brand Voice
**Tone:** Playful but technically exact. Jokes in the naming (quack, pond, waddle), never in the API.

**Style:** Direct, short sentences, second person. Docs written the way the channel talks. Claims are stated then demonstrated — the site is the proof, not the pitch. Never markets at the reader.

**Personality:** Playful, opinionated, precise, open, unserious-about-itself / serious-about-the-code.

## Proof Points
**Metrics:** 61 components, 17 blocks, 2 themes, 1 hook. One command to install. Zero runtime dependencies from the registry. **[assumption — GitHub stars, installs and site traffic not yet tracked; see Goals]**

**Customers:** None public yet.

**Testimonials:** None yet. **First priority for proof: collect them.**

**Value themes:**
| Theme | Proof |
|---|---|
| One install restyles everything | Theme-proof section on the landing page: identical markup, two token sets |
| You own the code | Files land in `components/ui/`, MIT, no package |
| AI-ready by construction | `llms.txt`, `llms-full.txt`, shadcn MCP, `skills add dacoder/duck-ui`, JSON-LD graph, AI crawlers explicitly allowed |
| Tunable, not take-it-or-leave-it | `/create` editor exports CSS and shareable preset links |
| Additive, not a migration | Standard shadcn components inherit the theme untouched |

## Goals
**Business goal:** Adoption of the registry as the distribution surface for the dacoder brand — installs, GitHub stars, and inbound to the YouTube channel.

**Conversion action:** Primary — `npx shadcn add @duck/theme` (measured as registry JSON fetches from `/r/*.json`). Secondary — GitHub star; theme exported or preset link shared from `/create`.

**Current metrics:** Unknown. No analytics on the site today, so installs, referrers and AI-assistant traffic are all unmeasured. **[assumption — confirm; this is the first gap to close]**

## Changelog
*Newest first. One line per revision: what changed and why.*
- v1 (2026-07-31) — Initial context, auto-drafted from the repo. Competitive landscape, customer verbatim and proof points flagged as assumptions pending real data.
