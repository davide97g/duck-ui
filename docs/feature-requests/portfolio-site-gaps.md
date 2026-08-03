# Feature request: what a themed content site needs that duck/ui does not have

**Source:** migrating [davideghiotto.it](https://davideghiotto.it) — a personal portfolio and
journal (React 18, Vite, Tailwind v4) — from hand-rolled CSS onto `@duck`. Every item below is
something the migration hit in practice, with the workaround it had to keep. Nothing is
hypothetical.

This is a different stress test from [media-app-gaps.md](./media-app-gaps.md). Cinema was
control-heavy and image-heavy on the stock duck theme. This site is **typography-heavy, surface-heavy
and on a completely different theme** — terminal noir: near-black canvas, one lime accent, hairline
1px borders, square corners, mono uppercase HUD chrome, GSAP scroll choreography, no idle
animations anywhere. It is the furthest a consumer can get from the sticker vocabulary while still
wanting the components, so it found every place where the vibe is welded to the code instead of
living in a token.

Outcome: the **primitive** layer migrated cleanly — buttons, badges, inputs, switch, dialog, toast,
empty state, HUD label. The **surface** and **layout** layers did not, and §2 is why. The site
dropped 30 runtime dependencies (47 → 17) and 76 kB of JS in the process, so the primitives are
earning their place.

**Order below is the order worth implementing.** §1 is bugs that break or silently corrupt real
installs; §2 is theming blockers; §3 is missing components; §4 is polish.

> **Status: closed.** Everything below is implemented — §2 as tokens plus `data-variant`,
> §3 as ten components and two blocks, §4 as four tokens and two props. Each item is annotated
> with what shipped. The two departures from the request are noted where they occur: the chart
> is dependency-free SVG rather than a recharts wrapper, and the tooltip landed with the
> hover-only warning kept in the docs rather than dropped.

---

## 1. Bugs — fix first

### 1.1 A registry `css` block outranks Tailwind's own utilities — P0

`registry.json`, any item with a `css` key. Found via `@duck/hud-label`, but it applies to every
item that ships a class.

shadcn appends a registry `css` block to the **end** of the consumer's `@layer utilities`. A plain
class rule declared there has specificity `(0,1,0)` — the same as a Tailwind utility — and it comes
later, so it wins.

`.hud` set `color: var(--muted-foreground)`. The site writes `class="hud text-primary"` in 26
places for section indices and live values. Every one of them rendered muted. No error, no warning,
no failed build — the lime accent just quietly stopped existing, and it took a screenshot to catch.

**Fix:** declare any *default* that a utility is expected to override at zero specificity.

```css
/* was */
.hud { font-family: var(--font-mono); …; color: var(--muted-foreground); }

/* now */
.hud        { font-family: var(--font-mono); … }   /* structural: keeps winning */
:where(.hud){ color: var(--muted-foreground); }    /* default: any text-* beats it */
```

Fixed for `hud-label` in this change. **Worth auditing every other `css` block for the same shape** —
any `color`, `background`, `border-radius` or `font-size` in a registry utility is a candidate.

**Also worth doing:** `shadcn add` merges registry `css` **by selector**. Adding `:where(.hud)`
upstream did not remove the consumer's existing `.hud { color }` — the reinstall left both, and the
old rule kept winning. Consumers on an older version of an item will not pick this class of fix up
automatically; it needs a release note.

### 1.2 Next-only eslint pragmas ship inside copied files — P1

`registry/duck/ui/{video-card,duck-spinner,holo-avatar,sticker-media-card}.tsx`

```tsx
// eslint-disable-next-line @next/next/no-img-element
<img … />
```

That comment is copied verbatim into the consumer's repo. In any project without
`eslint-config-next` — which is every Vite, Remix or plain-React consumer — ESLint fails:

> Definition for rule '@next/next/no-img-element' was not found

It is an **error**, not a warning, so it breaks `npm run lint` in CI on a fresh install. Cinema is
Vite too and will have the same four files.

**Fix:** silence the rule in duck-ui's own eslint config for `registry/**` and
`components/previews/**`, and keep the published source free of consumer-specific pragmas. Done in
this change.

**General rule worth adopting:** registry source is other people's code. It should contain nothing
that only makes sense inside this repo — no pragmas for rules we cannot know they have, no imports
from paths outside the declared alias set.

---

## 2. Theming blockers — the vibe is welded to the components

This is the substance of the report. `@duck/theme` promises "every existing shadcn component is
duck-styled with no markup changes". The inverse does not hold: a *different* theme cannot undo the
duck styling without markup changes, because the sticker vocabulary lives in hardcoded class names
rather than in tokens.

Two of these were fixed while migrating (2.1, 2.2). The rest are fixed now; each section ends
with what shipped.

### 2.1 `--radius` could not reach zero — fixed

`--radius-2xl: calc(var(--radius) + 10px)`. A theme asking for square corners still got a 10px
card. Every duck surface is `rounded-2xl`, so no `--radius` value produced a square UI.

Changed to ratios (`calc(var(--radius) * 1.833)`), which leaves the duck scale bit-identical at
`0.75rem` and lets `0.125rem` collapse the whole scale.

### 2.2 `--sticker-border` was honoured in one place out of six — fixed

`.sticker` read the token; `holo-border`, `holo-border-animated`, `holo-badge` outline,
`glow-input`, `duck-tabs`, `quack-toast`, `sticker-sheet` and `terminal` hardcoded `border-2`.

Also a latent duck-side inconsistency: `StickerCard` swaps between `holo-border` (2px) and `sticker
border-border` (3px) on one boolean prop, so the card's edge visibly thinned whenever `holo` was
set. All now read `var(--sticker-border)`.

### 2.3 Button label typography is not themeable — fixed

`holo-button.tsx`, `quack-button.tsx`

```ts
size: { default: "h-10 px-5 py-2", lg: "h-12 rounded-xl px-8 text-base" }
//                                                            ^^^^^^^^^
base: "… text-sm font-semibold …"
```

Terminal noir's CTA is `font-mono`, `uppercase`, `tracking-[0.16em]`, `text-xs`, weight 500. There
is no token that reaches any of it. The site had to keep a `.btn-hud` class and hang it on all 14
buttons:

```tsx
<HoloButton asChild variant="primary" size="lg" className="btn-hud text-xs font-medium">
```

Worse, only *part* of it can live in that class. `text-base` and `font-semibold` are Tailwind
utilities from the size variant, and the utilities layer beats the components layer — a `font-size`
in `.btn-hud` silently loses (same failure mode as 1.1). So size and weight have to travel in the
`className` string, where `cn()`'s tailwind-merge strips the variant's pair. Font family, tracking
and text-transform can stay in the class because nothing in the variant sets them.

That split is invisible and nobody will guess it.

**Fix, in preference order:**

1. A `--font-button` / `--tracking-button` / `--text-transform-button` token trio the base classes
   read, so a theme sets it once.
2. Failing that, an `appearance` variant (`"sans" | "mono"`) alongside `variant` and `size`.
3. At minimum, drop `text-base`/`text-sm` out of the variants and into a token, since those are the
   two that cannot be overridden from CSS at all.

**Shipped:** option 1, and option 3 with it. `--font-button`, `--weight-button`,
`--tracking-button`, `--case-button` and `--text-button` / `--text-button-sm` / `--text-button-lg`,
read by rules in `@layer base`; `text-sm`, `text-base` and `font-semibold` are gone from both
buttons' variants. Five badge equivalents do the same for `HoloBadge`.

One correction to the plan: those rules cannot use `:where()`. Preflight declares
`button { font: inherit }` in the same layer, and a `(0,0,1)` type selector beats `(0,0,0)` — every
button inherited 16px/400 from the body. Plain attribute selectors are `(0,1,0)`: above preflight,
still below every utility, which is the property that matters. Verified in a browser: default
14px/600, `sm` 12px, `lg` 16px, `className="text-xs font-normal"` still wins at 12px/400, and the
same button inside `.theme-noir` comes out mono uppercase 12px/500 at 0.16em.

### 2.4 `HoloBadge` hardcodes `rounded-full` and `text-xs font-semibold` — fixed

Same shape as 2.3. `rounded-full` is `9999px` and therefore immune to the radius scale, so a
square-cornered theme cannot get a square badge from any token. The site's five tag call sites read:

```tsx
<HoloBadge variant="outline"
  className="tag rounded-none text-[11px] font-normal text-muted-foreground">
```

Four of those five classes exist purely to undo the component's own base. `rounded-full` is right
for a *status pill* and wrong for a *tag*; that is a shape variant, not a theme override.

**Shipped:** `shape="pill" | "tag"` — pill stays `rounded-full`, tag follows the radius scale — plus
the badge token set, so all five of those undo classes go away.

### 2.5 Variants are invisible to CSS — fixed

No duck component emits `data-variant`. `data-slot="holo-button"` tells you it is a button but not
whether it is primary or outline, so a theme cannot say "outline buttons get a faint fill on hover"
in CSS — it has to be done per call site. The site needed a second class, `.btn-hud-ghost`, applied
by hand only to the outline ones.

**Fix:** emit `data-variant={variant}` and `data-size={size}` next to `data-slot`. One line per
component, and it makes every component themeable from the stylesheet.

**Shipped:** on `HoloButton`, `QuackButton`, `HoloBadge` (plus `data-shape`), `HoloAvatar`,
`HudLabel`, `DuckSwitch`, `StickerProgress`, `StickerCard` and `VideoCard`. The variant props now
carry their cva defaults at the destructure, so the attribute is present even when nothing was
passed. `data-size` also selects the font-size step in 2.3, which is what ties the two together.

### 2.6 `StickerCard` has no `asChild` — fixed

`StickerMediaCard` has it. `StickerCard` does not, and the two are otherwise the same idea. Ten of
the site's surfaces are whole-card links (`<a class="panel">`), which is not expressible:

```tsx
<StickerCard asChild><a href="…">…</a></StickerCard>   // does not compile
```

The site kept its `.panel` class for all ten. Add `asChild` for parity.

**Shipped:** `asChild` on `StickerCard`, using `Slottable` so the decorations land inside the
consumer's `<a>` rather than beside it. `ticks` and `glass` from §4 landed on the same component.

### 2.7 The mascot is not swappable in `QuackButton` — fixed

`QuackButton state="loading"` renders `DuckGlyph`, and `markSrc` accepts **an image URL only**.
A theme with no mascot has nowhere to put a plain spinner or a lucide icon, and the default
`/duck.svg` 404s in any project that did not install `duck-mark`.

The site wanted QuackButton's state machine for the OTP submit and used `HoloButton` + a manual
`<Loader2 className="animate-spin" />` instead.

**Fix:** let `markSrc` take `React.ReactNode`, or add a `loadingIndicator` prop. `EmptyPond` already
gets this right with its `art` prop — that is the pattern to copy.

**Shipped:** `loadingIndicator?: React.ReactNode`, which replaces the mark entirely. `markSrc` stays
a string for the case where an image is what you want.

---

## 3. Missing components

Listed by how much site code each would delete. Everything here stayed hand-rolled.

| # | Component | What the site has instead | Notes |
|---|---|---|---|
| 1 | **Prose / long-form** | `.post-body`, ~150 lines of CSS | 68ch measure, ruled blockquotes, mono uppercase table headers, tables scrolling in their own `overflow-x`. Any consumer with docs or a blog needs this, and `@tailwindcss/typography` does not match a duck or noir theme. Biggest single win available. |
| 2 | **Tooltip** | nothing — the site deleted its unused `TooltipProvider` | With `sticker-dialog` landed, this is the last overlay primitive missing. Radix Tooltip + sticker skin. |
| 3 | **Marquee** | `motion/Marquee.tsx`, GSAP, 79 lines | Seamless double-track loop whose timescale is driven by scroll velocity. `@keyframes duck-marquee` already exists in the theme with no component using it. |
| 4 | **Scroll-reveal primitives** | `motion/Reveal.tsx`, `motion/SplitReveal.tsx` | `components/site/reveal.tsx` already exists in this repo, unpublished. Publishing it — with a `prefers-reduced-motion` arm that sets the final state rather than skipping the animation — would cover most consumers. |
| 5 | **Timeline** | `PathSection`, spine + nodes + scrubbed draw | Vertical spine that draws itself on scroll, nodes that light on hover. |
| 6 | **Stat grid** | `gap-px` + `bg-border` + `bg-background` cells, in two sections | The hairline-grid trick: one border colour showing through a 1px gap. Trivial component, used constantly. |
| 7 | **List row** | `.micro-row`, 4 call sites | Leading rule that scales in, padding that shifts on hover. The row is the unit of a journal index, a project list, a changelog. |
| 8 | **Section marker** | `.section-marker` | Index, label, rule bleeding to transparent, dot that scales on section hover. |
| 9 | **Display type scale** | `.display-xl`, `.display-lg` | `--font-display` exists but there is no scale on top of it, so every consumer invents `clamp()` values. |
| 10 | **Nav / site header** | `Nav.tsx`, 183 lines | Anchor links, burger below `lg`, language toggle. `components/site/site-header.tsx` exists here, unpublished. |
| 11 | **Footer** | `Footer.tsx` | Same — `components/site/site-footer.tsx` is unpublished. |
| 12 | **Chart** | `RalChart.tsx`, recharts, 480 lines | The theme ships `--chart-1` … `--chart-5` and nothing renders them. Either publish a chart wrapper or drop the tokens. |
| 13 | **Scroll progress rail** | `ScrollRail.tsx` | |
| 14 | **Grain overlay** | `.grain` | duck-ui has `.grain` in its own `globals.css` but does not publish it in the theme item. One-line fix. |

**Shipped: all fourteen.** As registry items: `@duck/duck-prose`, `@duck/sticker-tooltip`,
`@duck/duck-marquee`, `@duck/duck-reveal`, `@duck/duck-timeline`, `@duck/duck-stat-grid`,
`@duck/duck-list-row`, `@duck/duck-section-marker`, `@duck/duck-scroll-rail`, `@duck/duck-chart`,
and two blocks, `@duck/duck-site-header` and `@duck/duck-site-footer`. Rows 9 and 14 belong to the
theme rather than to a component: `.display-xl` / `-lg` / `-md` and `.grain` now ship in the theme
item, the display classes declared through `:where()` so a page can still put `text-4xl` over them.

Two notes on how they differ from the request:

- **Chart (12).** Neither option in the report — the tokens are rendered, but by ~200 lines of SVG
  with no charting dependency, and the numbers are also emitted as a visually hidden table. It is a
  figure in a page, not a data product; the docs say to reach for recharts or visx when the chart
  *is* the product.
- **Tooltip (2).** The installation page used to say tooltips were out on purpose, because a
  hover-only hint reaches neither touch nor the keyboard. Radix answers the keyboard half, so the
  component shipped — but the warning stayed, moved onto the component page and reworded rather than
  deleted. It is for a label with nowhere else to live.
- **Reveal (4).** Published with the `prefers-reduced-motion` arm the report asked for: reduced
  motion renders the *final* state rather than skipping the animation, which is the bug that leaves
  a section invisible for good.

### 3.1 `VideoCard` cannot link out

Worth calling out separately because the component exists but does not fit. `VideoCard` always
mounts a YouTube iframe on click. The site's channel gallery deliberately **navigates** to YouTube
instead: it tracks the outbound click, drives channel subscriptions, and avoids embedding a
third-party player on a page with a strict consent banner.

There is no `href` mode, so the eight cards stayed hand-rolled. Add `href` (mutually exclusive with
the embed) and the component covers both.

**Shipped:** `href`, plus `target`, `rel` and `onClick`. In link mode the play glyph becomes an out
arrow and the rel is `noopener` without `noreferrer`, so the destination can still credit the visit.

---

## 4. Polish

- **`.sheen` is hardcoded white.** `oklch(1 0 0 / 0.16)`. The site's equivalent sweep is lime, so it
  kept its own `.card-scan`. One `--sheen` token fixes it.
- **Corner ticks.** The site's `.panel-ticks` — 8px brackets in the accent colour, fading in on
  hover — makes a plain rectangle read as an instrument. Would suit duck as a `ticks` prop on
  `StickerCard`.
- **`StickerCard` is opaque.** `bg-card`, no translucent variant. The site's panels are
  `bg-surface/72` with `backdrop-blur(12px)` over a WebGL backdrop; that is a common enough shape to
  deserve a prop.
- **Two surface steps, not three.** duck has `--card` and `--popover`. Noir needs canvas → surface →
  raised, and had to alias `--surface`/`--surface-raised` locally.
- **`sticker-sheet` cell labels are not HUD labels.** Correctly left as plain mono — they are
  lowercase component identifiers, and uppercasing them would print `QUACK-BUTTON` on a sheet meant
  to be scanned. Noted so nobody "fixes" it later.
- **CSS comments cannot contain apostrophes.** Not a duck bug, but it bit this migration hard and
  belongs in the docs: Tailwind v4's parser treats `'` as a string delimiter **inside comments**. A
  comment reading `HoloButton's size variant` silently swallowed the next rule, and the only symptom
  was `Unterminated string` deep in a Vite stack trace. Registry `css` blocks are JSON and safe, but
  any prose duck ships into a consumer's stylesheet should avoid the character.

**Shipped:** `--sheen`; `ticks` and `glass` props on `StickerCard`, the latter reading `--glass` and
`--glass-blur`; `--surface` / `--surface-raised` as a real third step. Two details worth recording:

- Those surface tokens are spelled out per theme block rather than aliased as `var(--card)`. A custom
  property is substituted where it is *declared*, so one alias in `:root` would hand the light card
  to `.dark` and to every scoped theme.
- The apostrophe trap is now in the theming docs, next to the `:where()` specificity trap, and every
  apostrophe has been taken out of this repo's own CSS comments.

---

## Appendix: what the noir theme proves

`@duck/theme-noir` is in this change as a second `registry:theme`, plus a `.theme-noir` scope in
`globals.css` and a third tab on the landing page's ThemeProof. Same markup, no sticker language
left: square corners, hairline edges, holo flattened to a single lime gradient, glow narrowed, easing
de-bounced.

It is worth keeping as a permanent test. Every item in §2 was found by trying to express it, and the
ones that were open were precisely the places where a component ignored the theme. If a future
component looks right in noir as well as in duck, its vibe is in its tokens where it belongs.

Noir now also carries the control-typography and surface tokens, so its CTA vocabulary — mono,
uppercase, 0.16em, weight 500, one size — is five declarations in a theme block instead of a class on
every button. That is the shape the next theme should be able to copy.
