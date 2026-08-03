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

> **Status: closed.** §1 shipped as six props across five components, §2 as ten registry items, §3
> as a print layer and a mask utility, §4 as a docs pass — two of its four bullets turned out to be
> true already when this report was filed. Each item below is annotated with what shipped. The
> departures are recorded where they occur; the ones worth reading first are `StickerDrawer` gaining
> a body part nobody asked for, `HudChip` being its own control rather than the cheaper prop on
> `QuackButton`, `DuckCommand` accepting data and not children, and the print layer needing a second
> block for `theme-noir` that this report did not consider.
>
> Two things to know before reading further. `GlowSearch` shipped without the results popover §2.8
> asked for — results are `DuckCommand`'s job — and one existing default changed its rendering:
> `HudLabel`'s dot. See §1.4.
>
> Released as [docs/releases/2026-08-03-application-layer.md](../releases/2026-08-03-application-layer.md).

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

**Shipped:** exactly that — `mark?: React.ReactNode` on both, defaulting to the drawing, rendered
default unchanged. One detail the sketch above hides: the mark is rendered as given, so
`DuckThinking`'s default carries its own `[animation:duck-paddle…]` and a replacement opts into the
paddle rather than inheriting it. Both wells are already `aria-hidden`, so a replacement needs no
labelling. `DuckSpinner`'s `DUCK_MARK_SRC` is untouched — it was already the invited seam.

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

**Shipped:** `frame`, not the variant, and the split is in the source: `fieldBase` now holds what is
the field — type scale, caret, placeholder, selection, disabled — and `fieldFrame` holds what is the
object. Both components emit `data-frame="sticker" | "bare"`, so a theme can reach the two cases
separately. `frame={true}` is byte-for-byte the old class list.

Two departures from the paragraph above. The padding goes with the frame: `px-3 py-2` is drawn by
`fieldFrame`, because an inline field has to line up with whatever it sits beside rather than
inside its own inset. And there is no border left to redden, so `aria-invalid` moves into the text
and the caret (`aria-invalid:text-destructive aria-invalid:caret-destructive`) — a frameless field
still has to read as wrong.

The layer-order note this section asked for is in the theming docs, next to the `.hud` case that
raises the same hazard from the other direction, with the general rule attached: a duck utility you
find yourself stacking negations against probably has a prop.

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

**Shipped:** the controlled `files?: File[]`. Pass it and the zone keeps no list of its own, so
`onFilesChange` becomes intent rather than a notification and `[]` empties the sheet. Uncontrolled
behaviour is untouched. The live announcement fires either way — controlled or not, the files were
read — and the focus recovery after a removal still runs on the next frame, so it queries the new
list in both modes.

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

**Shipped:** all three — `accent` on `tone`, `bg-current` with the glow only on `primary`, and
`dotTone` for the case where the dot is meant to disagree with the text. `dotTone` also accepts
`destructive`, which is not a `tone`: the red dot on a muted row is the case that prompted the prop
and it has no matching text colour.

This is the one place in the report where an existing default changes what it draws. `<HudLabel dot>`
inherits `tone="muted"`, so its dot was lime and glowing and is now `--muted-foreground` and flat.
That is the fix working as asked, not a regression, but it is a visible change: pass
`dotTone="primary"` to keep the old dot.

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

**Shipped**, with the controls, in one commit — see 2.7, which is where `DuckViewportControls`
actually lives now. `min` (0.25), `max` (4), `initial`, `zoomStep` (1.25), `panStep` (48),
`wheelZoom` and `onTransformChange`, throttled to a frame. The ref carries six methods rather than
three: `getTransform`, `zoomIn`, `zoomOut`, `zoomTo`, `panBy`, `reset`. Pointer capture keeps a drag
that leaves the element, two pointers pinch about their moving midpoint, and the keyboard is real —
arrows pan, `+`/`-` zoom, `0` resets. No React state is involved at all.

Two departures from the sketch. Cursor-anchored zoom is arithmetic rather than
`getScreenCTM().inverse()`: `t' = p − (p − t)·k`, taken after the clamp, so the child can be any
element and not only an `<svg>`. And `<DuckViewportControls />` takes `viewport={ref}` — it is
always a sibling of the viewport, never a child, because a child would sit inside the transform and
pan away with the content, and a context only reaches downward. The buttons also do not disable
themselves at the scale limits: knowing when to would mean subscribing to the transform, which is
the one thing this component exists not to do, and clamping already makes the press a no-op.

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

**Shipped:** `@duck/sticker-drawer`, on the same Radix Dialog base, with the four sides and
`size: sm | default | lg | full`. `StickerDialogContent` gained `size` on the same scale, where
`full` drops the centring translate for `inset-0`, owns its own scrolling and fades rather than
rising — `duck-dialog-in` carries that translate through every frame, so a full-bleed panel would
otherwise be thrown across the viewport. Default dialog output is unchanged.

Four things the request did not say:

- **`StickerDrawerBody` is a part, and it is not optional.** The panel is as tall as the viewport, so
  the overflow has to belong to an element the header and the footer sit outside of. Scrolling
  content goes there or the footer leaves the screen.
- **`size` is a ceiling, not a height, on top and bottom** — `max-h-[35svh]`, `[50svh]`, `[80svh]`.
  A filter sheet holding two rows should be two rows tall; only `full` commits to `h-svh`. On left
  and right there is nothing to hug, so the preset is the width (`max-w-xs`, `-sm`, `-lg`).
- **`size="full"` drops the inner radius as well.** The radius is on the two corners facing the
  content and there is none against the viewport edge, because a rounded outer corner there shows the
  page through the gap. Full-bleed has no inner corner left to round.
- **One new utility and one keyframe pair.** `.holo-edge` is the iridescent finish for whichever
  sides already carry a width, because `.holo-border` sets the width itself on all four, which is
  right for a card and wrong for a panel with one edge. `duck-drawer-in` / `duck-drawer-out`
  translate by `--drawer-x` / `--drawer-y`, which the side variant writes — two keyframes rather than
  eight. All three ship with the item, not with `@duck/theme`.

The scrim is a copy of the dialog's three declarations rather than an import of it: a project that
only wants a drawer should not have to install a dialog to get one.

### 2.3 `StickerPopover` — P1

The published rule — "for anything duck/ui does not ship, use standard shadcn; the theme already
styles it" — holds for colour, radius and type. It does not hold for the *edge*: a shadcn
`DropdownMenuContent` opening two pixels from a `StickerCard` visibly lacks the 3px border and the
glow. Menus and popovers are the most common surface in an application after the card, so being
theme-only there is a real seam. Channeling has two (a share menu, the mobile nav).

**Proposed:** `StickerPopover` on Radix Popover, and either a `sticker` prop or a documented
`className` recipe for shadcn's `DropdownMenuContent` / `SelectContent` so the two can match.

**Shipped:** both halves, and the second one as code rather than as prose. `STICKER_SURFACE` is an
exported constant — radius, fill, the 3px edge and the glow, no geometry, so padding and width stay
with whatever is being restyled — and it is the string `StickerPopoverContent` itself wears. A recipe
printed only in the docs drifts from the component the first time either changes; this one cannot.
`cn(STICKER_SURFACE, "p-1")` on a stock `DropdownMenuContent` is the whole migration.

The file also says out loud what a popover is not: no roving focus, no typeahead, no `menuitem`
roles. For a real menu, shadcn's `DropdownMenu` plus the constant is still the answer.

One departure: the arrival is `duck-rise` on the top and bottom sides and a plain fade on left and
right. The theme has no horizontal-slide keyframe, and a panel rising beside a trigger reads as
belonging to something else on the page. `holo` panels are also card-coloured rather than
popover-coloured, because `.holo-border` fills its padding box with `--card`.

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

**Shipped:** the first option. `HudChip` with `variant: outline | ghost | primary`,
`size: sm | default`, `active` and `asChild`. `QuackButton` gained no `typography` prop, and the
cheaper route was the wrong one: a chip that inherits the ripple, the magnet and the idle cycle only
to suppress all three is more code than the chip is, and the chip needs different padding and
different colours as well as different type.

Its typography is the `.hud` utility that `@duck/hud-label` already ships, never a second copy — so a
chip and a label in the same row cannot drift apart, which was the original complaint.

Two departures. `active` paints the current read and emits `data-active` but claims **no ARIA**: the
same highlight means `aria-current="page"` on a nav link, `aria-pressed` on a filter and
`aria-selected` in a tablist, so a component that guessed would be wrong two times in three. The call
site owns the semantics, and the docs say which to use when. And there is no icon slot — icons are
children, because a slot needs a second slot the first time somebody wants a trailing chevron, and
lucide children already size themselves here the way they do in every other duck control.

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

**Shipped:** both. The hand-written CSS above is reproduced through tokens — `bg-primary/10` and
`border-primary/25` compile to the same `color-mix(in oklab, …)` expressions — so a theme that moves
`--primary` moves every citation with it.

The departure is what the interactive forms render. `interactive` and `asChild` **replace** the
`<code>` element rather than wrapping one: a nested `<code>` inside the control would be caught by
`DuckProse`'s own `code` rule and need three utilities to undo, and "button, tape at 12:04" is a more
useful announcement than a wrapper most screen readers do not mention anyway. Non-interactive it is a
real `<code>`.

It also cannot change the leading of the paragraph it sits in, which is why the hover state is fill
and border only: `transform` does not apply to an inline box, and going `inline-block` to allow one
would let the padding into the line box.

The `:where()` recipe is now in `HudCode`'s own rules rather than in the prose docs, since that is
where somebody arrives asking the question, with the `react-markdown` one-liner beside it.

### 2.6 `DuckAudioPlayer` — P2

`DuckMediaSlider` (with `buffered`, `preview`, `onScrub`/`onSeek` and `formatTimecode`) and
`DuckVolume` are the two hard parts, and nothing composes them. Channeling's saved-items screen
falls back to a native `<audio controls>` — the one element on the page that ignores the theme
completely.

**Proposed:** `DuckAudioPlayer` with `src`, `title`, `compact`, wiring `DuckMediaSlider` +
`DuckVolume` + a play/pause `QuackButton` to one `<audio>` element.

**Shipped:** exactly that, plus `defaultVolume` (0.7), `defaultMuted`, `loop`, `preload`
(`"metadata"`, so the duration is known before the first play) and `skip` (15s, default layout only).
The `<audio>` carries no `controls`, so there is no second set of buttons and no duplicate tab stop.

The parts of a media element that are easy to get wrong come from its own events rather than being
guessed at. `duration` is `null` until the element knows and stays `null` for anything with no finite
length — `NaN` before metadata and `Infinity` on a live stream are the same fact, that there is no bar
to draw — so the slider is disabled, the read-out shows `--:--` and the status line says Live.
`buffered` is the end of the range holding the playhead rather than the last range, because a seek
into fresh territory starts a new one and leaves a hole. The drag trap `DuckMediaSlider` already
solves is respected: `onScrub` feeds only the read-out and `onSeek` is the single writer of
`currentTime`.

Two judgement calls. The loading state is claimed **only for the first unplayable load**, not for
every `waiting`: `QuackButton` disables itself while busy, and taking Pause away from someone waiting
out a mid-track stall is worse than saying nothing, so a later stall surfaces in the status line and
in a buffered waterline that stops moving. And `compact` draws **no frame at all** rather than merely
tightening the padding — it exists to sit in a list row that already has a sticker edge, and two of
those nested reads as a mistake.

### 2.7 `DuckButtonGroup` / toolbar — P2

Three `QuackButton size="icon"` stacked as a zoom cluster need shared geometry and, ideally, a joined
edge. Channeling keeps a local `ZOOM_BUTTON` class string. This is the grouping
`StickerToggleGroup` already does, minus the selection semantics.

**Proposed:** `orientation`, and a `joined` option that collapses shared borders.

**Shipped:** `@duck/duck-button-group`, and this section is where §2.1 ended up — `DuckViewportControls`
is one of these in `toolbar` mode, so the two arrived in the same commit and the zoom cluster is not a
component of its own.

Three departures. `joined` is **on by default**, because unjoined this is a flex row with a gap and
nobody installs a component for that. The seam is an **overlap** — children after the first pull back
by `--sticker-border` — not a border trim, which would shift content by 3px and destroy any child
drawing its edge as a background; the focus ring is raised above the neighbour it overlaps, since a
clipped ring is the bug the component exists to avoid, and the outer radius comes by inheritance, so
one `rounded-*` on the group resizes the whole cluster. And there is a third prop the request did not
ask for: `toolbar` swaps `role="group"` and three tab stops for `role="toolbar"`, one tab stop and
arrow keys on the axis it advertises. That is what a canvas needs — it already owns the arrow keys, so
its controls should cost one Tab — and an accessible name is required by the types either way, because
an unnamed toolbar of icon buttons is announced as a container of nothing.

### 2.8 `GlowSearch`, and a command palette — P2

Three surfaces have a bare search `GlowInput`: no leading icon, no clear affordance, no `⌘K`, no
results popover. A search field differs from a text field enough to deserve its own component, and an
application-shaped registry arguably wants a palette too — `duck-dashboard` already takes an
`onSearch` prop with nothing to render into it.

**Proposed:** `GlowSearch` (leading icon, clear button, `⌘K` `StickerKbd`, debounced `onSearch`) and
`DuckCommand` on the same primitives.

**Shipped:** both, as two items. `GlowSearch` puts the frame on the wrapper and a `frame={false}`
`GlowInput` inside it — §1.2's seam used for the case it was added for — so the icon, the field and
the clear button live inside one 3px edge under one `focus-within` glow. Typing debounces
(`debounce`, 250ms); Enter, Escape and the clear button flush, because all three are decisions
rather than keystrokes on the way to one. Escape clears only when there is a value, so an empty
search box inside a dialog is never a trap. The clear button dispatches a real input event, so a
controlled consumer needs nothing beyond the `onChange` it already has.

Three departures worth recording:

- **No results popover.** This is the one affordance in the list above that did not ship. Results
  belong to `DuckCommand`, and a field that owns a results panel owns a second focus model with it.
- **The keycap is a `kbd` prop with no default**, drawn only while the field is empty and
  `aria-hidden`. It is a hint: no global listener lives in the field, and announcing a binding it
  does not have would be a lie.
- **`DuckCommand` accepts only the `items` array — composed children are not accepted at all.**
  Filtering children means a mount-order DOM registry to know which rows survived, which headings are
  now empty and whether "no results" is true, which is precisely cmdk's architecture; and palette rows
  come from a route table, a schema or a fetch rather than from JSX. There is no cmdk either, on the
  same judgement `DuckChart` made about recharts: a copy-in registry item should not drag an
  architecture in behind it.

`DuckCommand` is `StickerDialog` plus a filtered listbox, and the interaction that had to be right is
the combobox one: the input keeps focus at all times while the arrows move `aria-activedescendant`
through `role="option"` rows, so a keystroke is never spent getting back to the field and Tab still
leaves the dialog rather than walking the results. Matches are filtered in place and never re-ranked,
because a list that rearranges between keystrokes has to be re-read on every keystroke.

`duck-dashboard`'s `onSearch` now has something to open. It already binds Mod+K itself, so wire the
two together with `shortcut={false}` — two handlers on one keystroke is the only mistake available
here.

### 2.9 A header for `DuckListRow` — P3

`DuckListRow` fits an admin row well, but there is no header: no column labels, no sort affordance,
and no shared column widths between header and rows. Channeling's two admin screens align columns by
hand with `w-32 sm:w-40` repeated per row.

**Proposed:** `DuckListHeader` plus a `columns` contract the header and rows share — or an explicit
docs note that `DuckListRow` is for label-less feeds and that a table is the right answer for
tabular data.

**Shipped:** the first option, and the second one kept rather than dropped. `DuckList` takes the
column definitions once and renders the header itself — asking for the same array twice is how a
header and its rows drift apart — and `DuckListHeader` is exported for the case where the header has
to live somewhere else, such as sticky above a scroll container. The contract is `--duck-list-cols`,
a `grid-template-columns` value written on the wrapper and read by the header and by every
`DuckListRow` with `cells`. Feed rows are untouched.

Subgrid is the obvious choice and is the wrong one: it needs rows to be direct grid children, so it
dies the moment a row is wrapped in an `<li>`, a `motion.div` or a virtualiser, while an inherited
property survives any nesting. The price is stated in the type — tracks must size without content, so
`1fr`, `rem`, `%` and `minmax()` work and `auto` does not.

Three departures:

- **No table roles, and therefore no `aria-sort`**, which the proposal implied. `aria-sort` is only
  defined on a `columnheader`, which needs a row inside a table, whose owned-element structure this
  cannot guarantee — rows arrive as a separate component, they are usually anchors, and `role="row"`
  on an `<a>` costs you the link. Half a table role is worse than plain divs. The sort affordance is a
  real button per sortable column with the direction in its accessible name in words: "last seen,
  sorted descending".
- **The report's second option is kept as a rule.** A sortable, column-aligned list is still a list;
  row selection, resizable columns or a caption mean a real `<table>`. That sentence is in the
  component's rules, not deleted because the component shipped.
- **A column row does not shift right on hover.** Columns jumping out of line with their header read
  as a bug rather than as a response, so it reserves the 0.75rem gutter permanently and still grows
  the leading rule. The header reserves the same gutter, or the labels sit left of the cells they
  name.

`meta` also moves inside the first cell in column mode, under the description: in a tabular row,
anything that is not a column is a note about the item.

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

**Shipped**, in `@duck/theme`, in the shape written above and with three additions.

The hairlines are done through tokens rather than through a print rule per component: `--glow` and
`--glow-primary` go to `none` and `--sticker-border` to `1px`, so every halo in the system becomes a
hairline at once and a new component inherits the behaviour without being told. The token block is
wider than the eight above — `--card-foreground`, `--popover`, `--secondary`, `--destructive`,
`--input`, `--ring`, `--sheet`, `--sheet-line`, `--cut` and `--vinyl` are all re-asserted, because a
half-converted palette prints worse than an unconverted one.

The holographic finishes needed rules of their own: `.holo-border`, `.holo-border-animated`, `.foil`
and `.sheen` are gradients on a surface, which print as a muddy rectangle, and `.holo-text` has no
fill at all, so on paper it is invisible ink. Those four lose their background and `.holo-text` gets
`-webkit-text-fill-color` back.

**The addition this report did not consider is `theme-noir`.** It is deliberately dark in both modes
and its tokens are declared *after* the base theme, so the block above cannot reach it: a noir install
would have printed a black page. It has a second block of its own, kept in sync with the `theme-noir`
item, and prints as ink while keeping its hairlines and its square corners. Any future theme that
overrides the base palette needs the same treatment, which is the general lesson.

The prose rules landed as asked: `background: none` on `pre`, `code`, `blockquote` and `mark`,
`break-inside: avoid` on figures, blockquotes, code, tables and list items, and `break-after: avoid`
on `h2`–`h4` so no page breaks directly after a heading. All still `:where()`, so a print-only
utility at the call site still wins.

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

**Shipped** verbatim, in `@duck/theme`, with the reset — and the reset is a full `mask-image: none`
rather than a shortened fade, because a permanently faded last line is not a reduced animation, it is
missing text. It is documented on the motion page beside `StreamText`, which is where somebody looking
for it will be: `StreamText` animates the arrival of characters and this softens the arrival of lines.

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

**Shipped**, though two of the four were already true when this report was filed and the other two
belong to the docs pass alongside this series rather than to the component commits.

- **The `StickerProgressTrack` note was already a rule**, not a prop-table aside: "Inside a link or a
  button, pass `aria-hidden`…" has been in that component's rules list — the *Rules* section of its
  page — since the media series. Nothing to promote. Worth recording that the report read it from the
  prop table, which is where it also appears, and that both copies are correct.
- **The `SKILL.md` table.** `DuckListRow` went in with §2.9's entry; `DuckSectionMarker`,
  `DuckScrollRail`, `DuckChart`, `DuckSiteHeader` and `DuckSiteFooter` went in with the docs pass. The
  table also gained an entry per new item in §2, and the token section gained `.holo-edge`,
  `.duck-stream-edge`, the four dialog and drawer keyframes and a paragraph on the print layer.
- **The README count.** Removed rather than corrected, in the docs pass. The number had been wrong
  twice, so the README now points at the generated inventories — `registry.json` and `/llms-full.txt`,
  which cannot drift — instead of restating a count by hand. Its component table was short by rather
  more than this report knew, and the tooltip sentence went with the number. For the record, the
  registry is 59 UI items and 5 blocks, which is what `scripts/check-registry-sync.mjs` reports.
- **The `public/duck.svg` line was already in the installation page**, again since the media series.
  The docs pass extended it rather than adding it: it now says the asset arrives because `quack-button`
  and `quack-toast` depend on the spinner, and points at `src`, `markSrc` and `loadingIndicator` for a
  project that wants no mascot at all.

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

---

## What this one taught the theme

The noir theme earned its keep again, and from an angle nobody had aimed at it. The print layer looked
like a base-theme problem right up to the moment it printed a black page under `.theme-noir`, because
a theme that overrides the palette is declared *after* the block re-asserting it. That is now a rule
rather than a bug: a scoped theme owns its own print block, and the next one will be told so before it
ships rather than after.

The rest of §1 says the same thing in a smaller way. Every one of those four items was a place where a
utility was correct and had no off switch, and in all four the fix was a prop rather than a rewrite. If
a consumer is stacking negations against a duck utility, the component is missing an argument — that
sentence is in the theming docs now, which is the only durable place for it.
