# Feature request: what a knowledge app needs that duck/ui does not have

**Source:** rebranding [Channeling](https://github.com/davide97g) — a personal knowledge base with
an agentic chat over it (React 19, Vite, Tailwind v4, AI SDK v7) — from a hand-rolled token set onto
`@duck`. Every item below is something the rebrand hit in practice, with the workaround it had to
keep. Nothing is hypothetical.

This is a third stress test, and a different one again. [media-app-gaps.md](./media-app-gaps.md) was
control-heavy and image-heavy. [portfolio-site-gaps.md](./portfolio-site-gaps.md) was
typography-heavy on a completely different theme. This is an **application**: seven full-screen
surfaces, two pan-and-zoom SVG canvases, an admin CRUD screen, a token-by-token streaming
transcript, and a PDF export. It sits on the stock duck theme and wants the sticker vocabulary, so it
found none of the theming blockers §2 of the portfolio report already fixed — what it found instead
is where the registry **stops at the edge of an app**: no drawer, no popover, no viewport, no print,
and four places where the mascot or the frame is welded into the component rather than passed in.

Outcome: the migration went further than either previous one. The primitive layer, the surface layer
and the long-form layer all landed as-is; `@duck/theme` alone restyled all seven screens from one
install. What did not land is listed below. The app deleted its entire private palette (9 Tailwind
colour utilities across ~470 call sites), ~180 lines of hand-written prose and chip CSS, and 750
lines of vendored animation primitives, and gained a focus trap and scroll lock on three drawers it
had been faking.

**Order below is the order worth implementing.** §1 is coupling that forces a consumer to edit the
component file or remount it to work around; §2 is the missing components; §3 is the theme layer;
§4 is polish and doc drift.

---

## 1. Coupling — fix first

Not bugs. Each of these works exactly as written; each one also has no seam, so the only way past it
is to edit the installed file (which the CLI will overwrite on the next `add`) or to remount the
component.

### 1.1 The mascot is welded into `DuckThinking` and `QuackBubble` — P0

`registry/duck/ui/duck-thinking.tsx:37`, `registry/duck/ui/quack-bubble.tsx:49`

`DuckSpinner` gets this exactly right, and says so in a comment:

```ts
// registry/duck/ui/duck-spinner.tsx:15
const DUCK_MARK_SRC = "/duck.svg";
// "Point `src` at your own image to brand the spinner, or edit this constant
//  once to swap it everywhere"
```

Its two neighbours do not. `DuckThinking` renders `<DuckMark …/>` with no prop to swap it;
`QuackBubble` renders `<DuckMark className="size-5" />` the same way. So the *loading and messaging
vocabulary of the design system is unusable by any product that is not about a duck* — which is every
consumer. `EmptyPond` already shows the right shape (`art?: React.ReactNode`, defaulted to the
drawing); it is only the default that is mascot-bound there, not the API.

Channeling drew its own orbital mark, then had to reach into the installed files: it repointed
`DUCK_MARK_SRC` at `/mark.svg` (invited, fine), rewrote the `duck-mark` import in `quack-bubble.tsx`
to its own `BrandMark`, and deleted `duck-mark.tsx`. Two of those three edits get clobbered by the
next `shadcn add`.

**Proposed:** `mark?: React.ReactNode` on `DuckThinking` and `QuackBubble`, defaulting to
`<DuckMark />`. Two lines each. It makes the whole family brand-neutral without changing a single
default.

```tsx
<QuackBubble from="assistant" mark={<BrandMark className="size-5" />}>…</QuackBubble>
<DuckThinking label="Tuning in…" mark={<BrandMark />} />
```

### 1.2 `GlowInput` cannot give up its frame — P1

`registry/duck/ui/glow-input.tsx:5-12`

`fieldBase` opens with `"sticker w-full …"`, so every input carries a `--sticker-border` edge and a
`focus-visible:duck-glow-primary`. That is right for a form field. It is wrong for a field **inside**
a surface that is already the frame — a chat composer, a search box in a toolbar, an inline
edit cell in a list row. Channeling has all three.

Turning the frame off is not a one-liner, and the obvious attempt fails:

```tsx
// does NOT remove the border: .sticker is declared in the registry's
// @layer utilities block, which shadcn appends AFTER Tailwind's own
// utilities, so .sticker beats border-0 at equal specificity.
<GlowInput className="border-0 bg-transparent shadow-none" />
```

What actually works is `border-0 bg-transparent shadow-none ring-0 focus-visible:border-0
focus-visible:ring-0` — six overrides, repeated per call site. Channeling keeps an `INLINE_INPUT`
constant in two files for it. (This is the same layer-order hazard §1.1 of the portfolio report
raised for `.hud`; it bites again here, which suggests it is worth a general note in the theming
docs rather than a per-component fix.)

**Proposed:** `frame?: boolean` (default `true`) — or `variant: "field" | "bare"` — on `GlowInput`
and `GlowTextarea`. `bare` drops `.sticker`, the background and the focus glow, and keeps the type,
the caret, the placeholder and the selection colours. Nested inside a focused parent, the parent
should carry the glow.

### 1.3 `StickerDrop` is uncontrolled with no way to reset — P1

`registry/duck/ui/sticker-drop.tsx:58`

```tsx
const [files, setFiles] = React.useState<File[]>([]);
```

The file list is internal state and there is no `files` prop and no imperative handle, so after a
successful submit the consumer has no way to clear it. The dropzone keeps showing a file the form no
longer holds.

Channeling's workaround is to remount it:

```tsx
const [dropKey, setDropKey] = useState(0);
function reset() { …; setDropKey((k) => k + 1); }   // clears StickerDrop
<StickerDrop key={dropKey} onFilesChange={(f) => setFile(f[0] ?? null)} />
```

That works, but a `key` bump to clear a form field is the kind of thing a reviewer stops on.

**Proposed:** either a controlled `files?: File[]` prop (with `onFilesChange` already in place, this
is the smaller change) or a `ref` exposing `clear()`. Controlled is preferable — every other input in
the registry is controllable.

### 1.4 `HudLabel`'s dot is always lime, and there is no accent tone — P2

`registry/duck/ui/hud-label.tsx:38-42` and `:97`

Two small things in one component:

- `tone` is `muted | foreground | primary`. Channeling's chrome reads teal for "live / system" against
  lime for "action" — duck's own `--accent-foreground` — so several call sites override with
  `className="text-accent-foreground"`. An `accent` tone would cover it and the token already exists.
- `dot` is hard-coded `bg-primary duck-glow-primary`. An error state needs a red dot, which currently
  means reaching into the child: `[&>span]:bg-destructive [&>span]:shadow-none`. A child selector in
  application code is a smell that a prop is missing.

**Proposed:** add `accent` to `tone`; have the dot inherit the label's tone (`bg-current` plus the
glow only for `primary`), or add `dotTone`.

---

## 2. Missing components

### 2.1 `DuckViewport` — a pan/zoom container — P1

Channeling has two SVG canvases (a 600-node knowledge graph and a per-answer retrieval walk) and both
hand-roll the same mechanics: `getScreenCTM().inverse()` + `DOMPoint` for cursor-anchored wheel zoom,
a clamp, pointer-drag panning, and — the part that is easy to get wrong — a **non-passive** wheel
listener registered through `addEventListener` purely so it can `preventDefault()`. React's `onWheel`
is passive and silently cannot.

A graph *renderer* is out of scope for a design system. A viewport is not: it is the same interaction
as an image lightbox, a zoomable diagram or a canvas editor, and the listener detail is exactly what a
registry should have solved once.

```tsx
<DuckViewport min={0.4} max={8} onTransformChange={(t) => …}>
  <svg>…</svg>
</DuckViewport>
<DuckViewportControls />   // the +/-/reset cluster, see 2.7
```

Writes the transform imperatively so a pan costs zero re-renders, exposes
`zoomIn`/`zoomOut`/`reset` on a ref, and snaps rather than eases under
`prefers-reduced-motion`.

### 2.2 `StickerDrawer` — an edge-anchored dialog — P0

`registry/duck/ui/sticker-dialog.tsx:77`

```tsx
"fixed top-1/2 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2",
```

`StickerDialog` is centred, and `max-w-lg`. Three of channeling's surfaces are edge-anchored panels —
a wiki page drawer, a conversation history drawer, and a full-bleed retrieval map on mobile — so all
three fell back to stock shadcn `sheet`. That was a genuine upgrade over the `motion.aside` they
replaced, because Radix brought the focus trap, the scroll lock and Escape handling the hand-rolled
version never had. But the result has no sticker language: no 3px edge, no `duck-glow`, no
`duck-dialog-in` rise. Three of seven surfaces visibly off-system is the largest single gap in this
report.

Forcing `StickerDialogContent` into a full-bleed panel means overriding the centring translate
(`inset-0 h-full max-w-none translate-x-0 translate-y-0 rounded-none`), which is fiddly enough that
it is not the answer.

```tsx
<StickerDrawer open={open} onOpenChange={setOpen}>
  <StickerDrawerContent side="right" size="lg" holo>…</StickerDrawerContent>
</StickerDrawer>
```

Same Radix Dialog base as `StickerDialog`, `side: left | right | top | bottom`, `size` presets, the
die-cut edge on the side that faces the content, and the frosted scrim `StickerDialog` already has.
A `size="full"` variant on `StickerDialog` would be worth having regardless.

### 2.3 `StickerPopover` — P1

The published rule — "for anything duck/ui does not ship, use standard shadcn; the theme already
styles it" — holds for colour, radius and type. It does not hold for the *edge*: a shadcn
`DropdownMenuContent` opening two pixels from a `StickerCard` visibly lacks the 3px border and the
glow. Menus and popovers are the most common surface in an application after the card, so being
theme-only there is a real seam. Channeling has two (a share menu, the mobile nav).

**Proposed:** `StickerPopover` on Radix Popover, and either a `sticker` prop or a documented
`className` recipe for shadcn's `DropdownMenuContent` / `SelectContent` so the two can match.

### 2.4 `HudChip` — the interactive HUD label — P1

The most-repeated control in the app: nav, row actions, tabs, retry, share trigger, esc, zoom. Before
the rebrand it was five copy-pasted class strings under four different names.

`HudLabel` is the mono/uppercase/wide-tracked instrument label, but it is not interactive.
`QuackButton`'s typography comes from `--font-button` / `--tracking-button` / `--case-button`, which
are the **sans** button vocabulary — correct for a CTA, wrong for machine-output chrome. So the
workaround is a `QuackButton variant="outline" size="sm"` wearing `.hud`, wrapped locally:

```tsx
// the local primitive every consumer of this shape will end up writing
export function Chip({ active, ...props }: QuackButtonProps & { active?: boolean }) {
  return <QuackButton variant="outline" size="sm"
    className={cn("hud hud-sm h-9 gap-1.5 px-2.5 text-muted-foreground hover:text-primary",
      active && "border-primary/60 text-primary")} {...props} />;
}
```

**Proposed:** `HudChip` with `variant: outline | ghost | primary`, `active` for the current-route
read, and an icon slot. Or — cheaper, since the token plumbing exists — a
`typography?: "button" | "hud"` prop on `QuackButton`.

### 2.5 `HudCode` — the inline citation chip — P1

This is channeling's single most-used atom. Every `[[wikilink]]` and `@ HH:MM:SS` in an answer is
promoted to inline `code`, and the whole point of the styling is that a citation reads as
*verifiable data* and is clickable.

`DuckProse` styles inline code as a neutral `--muted` chip. `HoloBadge` is a pill for status.
`HudLabel` is a block label. None of them is "a monospace token inside a sentence".

The override was clean, and for a reason worth keeping: because every `DuckProse` rule is `:where()`
and therefore zero-specificity, one plain class beats it without `!important`.

```css
.channeling-answer :not(pre) > code {
  color: var(--primary);
  background: color-mix(in oklab, var(--primary) 10%, transparent);
  border: 1px solid color-mix(in oklab, var(--primary) 22%, transparent);
  border-radius: var(--radius-sm);
  padding: 0.08em 0.4em;
  white-space: nowrap;
}
```

**Proposed:** `HudCode` (inline, mono, `--primary` tint, optional `interactive` for the
button-in-prose case), plus a "restyling prose internals" recipe in the `DuckProse` docs — the
`:where()` decision is a feature and should be advertised.

### 2.6 `DuckAudioPlayer` — P2

`DuckMediaSlider` (with `buffered`, `preview`, `onScrub`/`onSeek` and `formatTimecode`) and
`DuckVolume` are the two hard parts, and nothing composes them. Channeling's saved-items screen
falls back to a native `<audio controls>` — the one element on the page that ignores the theme
completely.

**Proposed:** `DuckAudioPlayer` with `src`, `title`, `compact`, wiring `DuckMediaSlider` +
`DuckVolume` + a play/pause `QuackButton` to one `<audio>` element.

### 2.7 `DuckButtonGroup` / toolbar — P2

Three `QuackButton size="icon"` stacked as a zoom cluster need shared geometry and, ideally, a joined
edge. Channeling keeps a local `ZOOM_BUTTON` class string. This is the grouping
`StickerToggleGroup` already does, minus the selection semantics.

**Proposed:** `orientation`, and a `joined` option that collapses shared borders.

### 2.8 `GlowSearch`, and a command palette — P2

Three surfaces have a bare search `GlowInput`: no leading icon, no clear affordance, no `⌘K`, no
results popover. A search field differs from a text field enough to deserve its own component, and an
application-shaped registry arguably wants a palette too — `duck-dashboard` already takes an
`onSearch` prop with nothing to render into it.

**Proposed:** `GlowSearch` (leading icon, clear button, `⌘K` `StickerKbd`, debounced `onSearch`) and
`DuckCommand` on the same primitives.

### 2.9 A header for `DuckListRow` — P3

`DuckListRow` fits an admin row well, but there is no header: no column labels, no sort affordance,
and no shared column widths between header and rows. Channeling's two admin screens align columns by
hand with `w-32 sm:w-40` repeated per row.

**Proposed:** `DuckListHeader` plus a `columns` contract the header and rows share — or an explicit
docs note that `DuckListRow` is for label-less feeds and that a table is the right answer for
tabular data.

---

## 3. Theme layer

### 3.1 Ship a print layer with `@duck/theme` — P1

duck/ui is screen-only: no `@media print` rules anywhere, and `DuckProse` has no print variant. Any
product that exports a PDF re-invents a light palette by hand — channeling's was twelve literal
hexes before the rebrand.

The fix is worth stealing rather than the problem being worked around. Inside `@media print`,
re-assert duck's **light** token values on `:root, .dark` — necessary because `.dark` is on `<html>`
and otherwise wins everywhere — then paint from `var(--*)`:

```css
@media print {
  :root, .dark {
    --background: oklch(1 0 0);
    --foreground: oklch(0.18 0.012 285);
    --card: oklch(0.985 0.004 285);
    --muted: oklch(0.955 0.005 285);
    --muted-foreground: oklch(0.48 0.012 285);
    --border: oklch(0.895 0.006 285);
    --primary: oklch(0.62 0.14 115);     /* the light --ring: 3:1 on paper */
    --accent-foreground: oklch(0.25 0.05 220);
  }
  html, body { background: var(--background) !important; color: var(--foreground) !important; }
}
```

The printed page is then duck light mode and cannot drift from the theme. Worth pairing with
`:where(.duck-prose)` print rules: `background: none`, hairlines instead of glows,
`break-inside: avoid` on figures and reference lists.

### 3.2 A streaming-edge mask utility — P2

`StreamText` types text out (a demo affordance) and takes `streaming` + `active` for real tokens, but
there is no equivalent of fading the **growing bottom edge** of a block of prose, so freshly-arrived
text pops in instead of easing. Every LLM product needs this and it is three lines:

```css
@utility duck-stream-edge {
  mask-image: linear-gradient(to bottom, #000 calc(100% - 1.4em), transparent);
}
```

`#000` there is an alpha stop, not a colour, so it is token-free. Needs a
`prefers-reduced-motion` reset alongside it.

---

## 4. Polish and doc drift

- **`StickerProgressTrack` inside a link or button** already documents that you must pass
  `aria-hidden`, or the `aria-valuenow` gets read into the parent's accessible name. That note
  prevented a real bug in channeling's rank bars. It deserves promoting from a prop-table aside to a
  rule in the accessibility section.
- **`SKILL.md`'s component table is missing six items:** `duck-list-row`, `duck-section-marker`,
  `duck-scroll-rail`, `duck-chart`, `duck-site-header`, `duck-site-footer`. An assistant working from
  the skill alone will not know they exist.
- **The README still says "32 components"** (the registry has 49 UI items + 5 blocks) and still states
  that tooltips are deliberately absent, though `@duck/sticker-tooltip` ships and
  `app/docs/installation/page.tsx` already has the corrected wording. `registry.json`,
  `lib/registry-docs.ts` and `/llms-full.txt` are the trustworthy inventories.
- **`@duck/quack-button` and `@duck/quack-toast` pull in `duck-spinner`, which writes
  `public/duck.svg` into the consumer's repo root.** Expected once you know, surprising the first
  time — worth one line in the installation docs, since it is the only item that ships an asset.

---

## What worked without a workaround

Most of the surface area, and worth recording as the counterweight to the list above:

- `@duck/theme` restyled all seven screens from one install, before a single component was touched.
- `QuackButton`'s `state` machine replaced four separate hand-rolled busy/pending flags, and brought
  `aria-busy` with it.
- `GlowField` replaced hand-wired `htmlFor` / `aria-describedby` / `aria-invalid` / `role="alert"`.
- `DuckProse` deleted ~100 lines of answer-prose CSS and styles markup `react-markdown` emits with no
  classes at all.
- `StickerSkeleton`'s shared wave replaced six independently-blinking `animate-pulse` bars.
- `StickerToggleGroup` turned three tab buttons into one tab stop with arrow-key navigation.
- `DuckSectionMarker`, `HudLabel` and `HoloBadge` between them removed every ad-hoc
  `text-[0.62rem] uppercase tracking-[0.16em]` string in the app — there were dozens, in six sizes.
- `--chart-1..5` gave both SVG canvases a categorical palette, replacing eight literal hexes of which
  two existed nowhere else in the codebase. The retrieval map had five node types sharing four
  colours; the chart tokens fixed that as a side effect.
- The `--sticker-border` / `--radius` / `.duck-glow` vocabulary was coherent enough to replace a
  private one (7px corner-notch `clip-path` plus hard offset shadows) outright, across seven screens,
  without a single "keep the old look here" exception.
