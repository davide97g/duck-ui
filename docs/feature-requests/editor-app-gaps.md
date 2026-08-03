# Feature request: what a design editor needs that duck/ui does not have

**Source:** porting [Thumb Studio](https://github.com/davideghiotto) — a single-page canvas editor for
YouTube thumbnails and social graphics (React 19, Vite, Tailwind v4, a hand-rolled 1280×720 canvas
with drag/resize/rotate, two 288–320px control rails, five dialogs, an MCP surface) — from its own
warm "darkroom" token set onto `@duck`. Every item below is something the port hit in practice, with
the workaround it had to keep. Nothing here is hypothetical.

This is a fourth stress test and a different shape again.
[media-app-gaps.md](./media-app-gaps.md) was artwork-heavy,
[portfolio-site-gaps.md](./portfolio-site-gaps.md) typography-heavy,
[knowledge-app-gaps.md](./knowledge-app-gaps.md) an application of seven full-screen surfaces. This
one is a **tool**: two dense rails of controls either side of a stage, ~40 sliders, ~20 colour
pickers, 12 selects, 60-odd icon buttons at 24–28px, and a floating dock. The interesting part is
that it is a *quiet* UI by design — the canvas content is loud, so the chrome around it must not be.
Almost nothing here is about the sticker vocabulary being wrong; it is about the registry having no
**instrument-panel** size and two controls a design tool cannot do without.

Outcome: the port landed. `@duck/theme` plus 26 registry items replaced seven local shadcn primitives
(button, input, textarea, slider, switch, label, separator), ~120 lines of hand-written dock tooltip
and menu CSS, a hand-rolled ⌘K palette, a hand-rolled `role="tablist"`, and four hand-rolled modals
that had no focus trap and no scroll lock between them. `bun run check` and the production build are
green. What did not land is below.

**Order is the order worth implementing.** §1 is the two missing components that forced real
hand-written UI to stay; §2 is sizing and API gaps on components that otherwise fit; §3 is the theme
layer; §4 is smaller polish.

> **Status: §1–§4 closed, §5 open.** §1 shipped as two registry items, §2 as eight prop and size
> additions across nine components plus one theme utility, §3 as a token removal and two docs passes,
> §4 as one shape and two docs notes. Each item below is annotated with what shipped. **§5 was filed
> afterwards**, from adopting the release in the app this report came from — one item, and the only
> behaviour the adoption lost.
>
> Three departures worth reading before the detail. **`GlowSelect` is Radix, not a native
> `<select>`** — the option list of a native select is drawn by the OS and cannot take the die-cut
> edge, which is half of what the item exists for, so it costs one new package
> (`@radix-ui/react-select`). **§2.1 landed as three sizes rather than one**: `xs`, `icon-xs` and
> `icon-sm`, because a 28px square and a 28px pill are different boxes; an exact 24px control is
> `size="icon-xs"` plus `size-6`, which keeps the radius and the icon scale coming from the variant.
> **§2.4 landed as both halves and the utility is the interesting one** — `.sticker` now reads its
> width from `--sticker-width`, so `sticker-none` and `[--sticker-width:1px]` win from a call site
> *whatever the source order*, which is a stronger guarantee than the `@utility sticker-none` this
> report asked for. `frame` also arrived on the four components that were missing it.
>
> One correction to the report itself: the base theme never set `--font-mono` (§3.1). It set
> `--font-sans` and `--font-display`; `--font-mono` comes from `@duck/theme-noir`. Both halves are
> fixed anyway — the base theme now declares no typefaces at all.
>
> Released as [docs/releases/2026-08-03-the-instrument-panel.md](../releases/2026-08-03-the-instrument-panel.md).

---

## 1. Missing components

### 1.1 A select. `@duck/glow-select`

The registry has no select, and rule 7 ("compose with shadcn, the theme already styles it") does not
hold for this one: a stock shadcn select next to a `GlowInput` reads as a different design system —
1px border against the 3px die-cut edge, no lime focus glow, `--radius-md` against `rounded-lg`, and
a popover that is not `sticker-popover`'s.

This app has twelve of them (font, canvas format, background type, blend mode, shape kind, cap style,
four effect presets, campaign picker, MCP client picker), and they sit *inside* the same rail as the
glow fields, so the mismatch is visible in every screenshot.

**Workaround:** a local `select.tsx` — Radix Select with `glow-input`'s field vocabulary copied onto
the trigger and `sticker-popover`'s onto the menu, ~90 lines, plus a `frame` prop of its own (see
§2.4). It will drift from `glow-input` the first time that file changes.

**Ask:** `GlowSelect` / `GlowSelectItem` mirroring `GlowInput` exactly — same `frame` prop, same focus
glow, same `aria-invalid` treatment — with the menu drawn as `StickerPopoverContent`. A native
`<select>` underneath would be enough (`DuckSwitch` is a real checkbox, `DuckSlider` a real range, so
the precedent is there), but Radix is fine too; the point is that it ships with the field family.

**Shipped:** `@duck/glow-select`, on Radix rather than a native `<select>`. The precedent cited is
real but it breaks here: a native select's option list is drawn by the operating system, so it can
never wear the die-cut edge, and "the popover is not `sticker-popover`'s" was half the complaint. What
the item does instead is refuse to copy anything. `glow-input.tsx` now exports its three class strings
(`GLOW_FIELD_BASE`, `GLOW_FIELD_FRAME`, `GLOW_FIELD_BARE`) and the trigger imports them;
`STICKER_SURFACE` was already exported and the menu imports that. Neither recipe can drift from the
component it came from, which is the failure mode the workaround predicted for itself.

Also here because a rail asked for it: `size="sm"` (32px), `chevron={false}` for an icon-only
trigger, and the composed parts (`GlowSelectRoot` / `Trigger` / `Value` / `Content` / `Item` /
`Group` / `Label` / `Separator`) for a menu with headings. The open trigger keeps the glow through
`data-[state=open]`, because a pointer that opens a menu gets focus but not `focus-visible` — without
it the frame goes cold while its own menu is up. Inside `GlowField` nothing extra is needed: the
cloned `id`, `aria-describedby` and `aria-invalid` land on the trigger.

One new package for the whole registry: `@radix-ui/react-select`.

### 1.2 A colour field. `@duck/glow-color`

Twenty rows in this app are "label · swatch · eyedropper · reset". `input[type="color"]` is
unstyleable enough that every project ends up writing the same four rules
(`-webkit-appearance: none`, the swatch-wrapper padding, the inner radius, the border), and the
Chromium `EyeDropper` API next to it is another twenty lines that every design tool writes.

**Workaround:** the four rules live in the app's `styles.css`, and the eyedropper is a
`quackButtonVariants({ variant: "ghost", size: "icon" })` button with its own `async` handler.

**Ask:** `GlowColor` — a swatch that takes `value`/`onChange`, wears the sticker edge and the lime
focus glow, and optionally renders the eyedropper when `window.EyeDropper` exists. This is the one
control a design tool has more of than any other, and it is the last raw HTML input left in the app.

**Shipped:** `@duck/glow-color`, with the four rules inside the component as arbitrary variants and
the eyedropper rendered from a mounted effect rather than a `typeof window` check — a server render
that guessed would either flash a button Firefox cannot honour or hydrate a mismatch.

Three things the ask did not mention and the implementation had to decide. A picked colour arrives
with **no DOM event behind it**, so it reports through `onValueChange`, and `onChange` stays the
swatch's own native event; wire the former. Values are **normalised to `#rrggbb`** before they reach
the input, because that is the only form the control accepts and it renders anything else as black —
which is how a `#fff` default becomes a black swatch with no error anywhere. And there is **no alpha
channel**: an eighth and ninth hex digit are dropped rather than half-honoured.

The reset stayed at the call site. It is a default the component cannot know, and `size="sm"` plus
`QuackButton size="icon-xs"` is the row from the report, three elements wide.

---

## 2. Sizing and API gaps

### 2.1 There is no instrument-panel size

`QuackButton`'s smallest is `sm` (h-8, px-3) and `icon` is `size-10`. `HudChip`'s `sm` is h-7. A
control rail in an editor runs on **24–28px** icon buttons: a layer row is 32px tall and carries five
of them, the properties rail puts a 24px reset button beside a slider readout, and a stage overlay
toggle is 28px.

So essentially every icon call site in this port is
`<QuackButton variant="ghost" size="icon" className="size-6 rounded-md ...">` — 30-plus of them. The
override is not the problem; the problem is that `size-6` with `rounded-lg` from the variant needs
`rounded-md` too, and getting that pair right is now the app's job in 30 places.

**Ask:** `size="xs"` on `QuackButton` (size-7, rounded-md, `[&_svg]:size-3.5`) and on `HudChip`
(h-6). If a fourth size is unwelcome, `icon-sm` alone would cover most of it.

**Shipped:** three sizes on `QuackButton`, not one. The ask conflates two boxes — `size="xs"` is
described as `size-7`, which is a square, but `xs` in the existing scale is a height plus padding. So
`xs` is `h-7 px-2`, and the squares are `icon-xs` (28px) and `icon-sm` (32px), each with `rounded-md`
and a 14px icon, because `rounded-lg` on a small square reads as a circle with corners — which was the
actual complaint, not the height. `HudChip` gained `size="xs"` at `h-6` as asked.

An exact 24px control is `size="icon-xs"` plus `size-6`: one class instead of three, and the radius
and the icon scale still come from the variant. A fourth square size for 24px was rejected — the
instrument scale is 28 and 32; 24 is the exception a rail makes for itself.

The `@layer base` control-typography rule picked up the new sizes, so `xs`, `icon-xs` and `icon-sm`
read at `--text-button-sm` and a theme retunes them from the token it already has.

### 2.2 `DuckSlider` has no non-linear track

A font-size slider runs 12→400px and an image scale runs 0.05→8×. Linear, both are unusable: the
useful half of the range is the first 15% of the track. Every editor solves this with a logarithmic
mapping.

**Workaround:** `SliderRow` drives `DuckSlider` in integer positions `0…1000` and maps them
geometrically itself (`min * exp(p/1000 * ln(max/min))`), then quantises. The slider's own
`min`/`max`/`step` are therefore lies, and `formatValue` has to be overridden to report the real
value to a screen reader instead of "637".

**Ask:** `curve="log"` (or `scale: "linear" | "log"`) on `DuckSlider`, so the component owns the
mapping and `aria-valuetext` stays honest.

**Shipped:** `curve="linear" | "log"`. The component drives the input in 1000 track positions exactly
as the workaround did, but nothing lies any more: `min`/`max`/`step` keep their meaning at the API
(`step` is the grain of the value you receive, applied after the mapping), `aria-valuetext` always
carries the real number on a log track even without `formatValue`, and the value arrives through a new
`onValueChange`.

The one edge the workaround did not have to name: **`onChange` still fires and its `valueAsNumber` is
a track position**, because it is the input's own event and rewriting it would be a lie of a different
kind. Read `onValueChange`. A log track also needs `min > 0` — a logarithm has nowhere to put zero —
and falls back to linear with a dev-only warning rather than silently misplacing the thumb.

Quantising to `step` still repeats values at the bottom of a wide range — 12px at two dozen adjacent
positions on a 12→400 track, since one position is worth 0.04px down there. That is inherent to the
mapping, and it has one consequence the report could not have known because its own workaround kept the
*position* in state: an arrow key quantises back to the value the slider already had, the controlled
thumb snaps home, and the key looks broken. Each press now walks on in its direction of travel until the
value changes, so one press is one `step` across the whole range.

### 2.3 `DuckSlider`'s readout can only go above the track

`showValue` renders the formatted value above the track. A control rail wants it **on the label row**,
right-aligned, in tabular mono, next to a reset affordance — so a dragging slider never reflows the
row it sits in.

**Workaround:** `showValue` off, and the row draws its own `.readout` span plus the reset button.
Which means the component's nicest feature is unused in all 40 rows.

**Ask:** either `valuePosition="row"` with an optional `label` prop, or a documented
`SliderRow`-shaped composite (`DuckField` + slider) in the registry.

**Shipped:** the first option, plus the third thing the row actually contained. `label` renders a real
`<label>` tied to the input (generating an id when the call site has none), `valuePosition="row"` moves
the readout to the end of that row in tabular mono, and `action` takes the trailing affordance — the
reset button, a lock, a menu — because a row with a label and a readout and no room for the reset
would have sent the port straight back to hand-writing it.

A composite was not shipped. `SliderRow` would be `DuckSlider` plus a `GlowField` that cannot hold it
(`GlowField` clones a single child to inject the id, and a label-plus-slider pair has nothing to
clone) — three props on the control itself is less API and less indirection. Defaults are unchanged:
`showValue` with no `label` still prints above the track.

### 2.4 `.sticker` beating a call-site `border-0` bites outside `GlowInput` too

`glow-input.tsx` documents this precisely: `.sticker` is declared in the theme's `@layer utilities`,
so a `border-0` at the call site loses on order, which is why `frame` is a prop. The same problem
appears on any sticker-edged component used as a *row action* rather than a field — this port hit it
on its select trigger (a 28px icon picker inside a list row) and had to add the identical `frame`
prop to its own file.

**Ask:** one escape hatch, documented centrally, rather than the pattern being re-derived per
component: either a `@utility sticker-none` that can win, or `frame` as a shared convention on every
component that draws the edge (`StickerCard`, `HudChip`, `DuckTabsList`, `StickerKbd`, and whatever
`GlowSelect` becomes).

**Shipped:** both halves, and the utility is stronger than the one asked for. A `@utility
sticker-none` would *not* reliably win: `@utility` blocks are sorted into Tailwind's own utility
ordering, while `.sticker` is a raw rule at the end of the consumer's `@layer utilities`, so the
generated utility would lose the same argument `border-0` loses. So `.sticker` now reads

```css
.sticker      { border-width: var(--sticker-width, var(--sticker-border)) }
.sticker-none { --sticker-width: 0px }
```

A variable is immune to source order. `sticker-none` wins wherever it is written, and
`[--sticker-width:1px]` gets the hairline that a `border-0`-shaped escape hatch could never express.
`--sticker-width` is reset on every element in `@layer base`, because a custom property inherits and a
frameless card must not take the edge off the fields inside it. `.holo-border` and
`.holo-border-animated` read the same variable, so the two finishes stay one edge.

`frame` also arrived on all four: `StickerCard` (the fill, radius and padding stay; holo has no border
box left to paint a gradient into, so it is ignored), `HudChip`, `DuckTabsList` and `StickerKbd` (a
frameless cap has no edge for a lip to belong to, so it recolours on press instead of dropping). With
`GlowInput`, `GlowTextarea`, `GlowSelect` and `GlowColor` that is every component in the registry that
draws the edge. The convention is written down twice — design rule 9 in `SKILL.md`, and the theming
page's order-of-cascade section.

### 2.5 `DuckTabs` is horizontal only

The pill measures `offsetLeft`/`offsetWidth`, so a vertical tab rail slides the pill sideways across
the wrong axis. A settings dialog with a left-hand section rail — the standard shape at ≥640px — has
to either fake tabs or become a horizontal strip.

**Workaround:** the settings dialog changed layout. Its left rail is now a top strip, purely so it
could adopt `DuckTabs` and get the arrows/Home/End pattern it never had. That is a real improvement,
but it was the component choosing the layout.

**Ask:** `orientation="vertical"` — measure `offsetTop`/`offsetHeight`, swap the arrow keys, and let
the pill be a left-edge bar.

**Shipped:** exactly that. `orientation` lives on `DuckTabs` and reaches the list, the triggers and
the content through the context that was already there: the list measures `offsetTop`/`offsetHeight`
and emits `aria-orientation`, Up and Down move (Left and Right do nothing, which is what
`aria-orientation` has already promised a screen reader), the root becomes a row, and the panel takes
`flex-1 min-w-0` beside the rail rather than sitting under it.

The indicator is a 3px bar down the left edge, and the active trigger takes `text-primary` instead of
`text-primary-foreground` — a pill wide enough to cover a rail of varying-length labels has to be the
width of the longest one, at which point it is a block of colour rather than a marker. That is a
visible design decision the ask left open, so: horizontal keeps its filled pill, vertical does not
have one.

### 2.6 `HudLabel` has no `asChild`

Section headings in both rails are `<h3>` — mono, uppercase, wide tracking, i.e. exactly `HudLabel`.
`HudLabel` renders a `<span>` and takes no `asChild`, so the port uses
`cn(hudLabelVariants({ size: "sm", tracking: "tight" }), …)` on the heading instead. That works
(the variants are exported), but it means the two ways of getting a HUD label into a page can drift,
and `QuackButton`, `StickerCard`, `HudChip` and `HudCode` all have `asChild` already.

**Ask:** `asChild` on `HudLabel`. Same for `HoloBadge`, which has the same problem when a badge is
semantically a heading or a `<dd>`.

**Shipped:** both, and `HudLabel`'s needed `Slottable` — `dot` renders a second child, and Slot counts
children with `React.Children.only`, so the naive version throws exactly when the dot is on. The dot
keeps its place in front of the cloned children. `hudLabelVariants` and `holoBadgeVariants` stay
exported; the docs now say which of the three ways in to use when (component, `asChild`, `.hud`
utility) instead of leaving it to taste.

### 2.7 A tooltip on a disabled control never opens

`StickerTooltip` wraps the trigger, and a disabled `<button>` receives no pointer events, so the
label disappears exactly when the user most needs it — "why can't I press Save?" is the case a
tooltip exists for. This is Radix behaviour, not a duck bug, but the registry is where the answer
should live.

**Ask:** either document the wrapper pattern (a focusable span around the disabled control) or have
`StickerTooltip` apply it when it detects a disabled child.

**Shipped:** the second, with the first written down anyway. A child carrying `disabled` or
`aria-disabled` (the form a Slot-rendered anchor takes) becomes a `tabIndex={0}` `inline-flex` span
wrapping the control, and the span is what Radix uses as the trigger — so the label opens on hover and
on focus, and the keyboard user who cannot press the button can at least read why.
`wrapDisabled={false}` opts out. Composing the parts by hand still means writing the wrapper by hand,
and the docs say so.

### 2.8 `CopyButton` cannot report a refused write

Clipboard access is denied over plain HTTP and inside some embedded browsers. `CopyButton` correctly
does **not** claim success — it swallows the rejection and stays in its idle state — but the caller
cannot say anything either, so the user gets a button that appears to do nothing.

The panel this replaced told the user "Copy failed — select the text and copy it manually", and that
message is now gone from the app.

**Ask:** `onError?: (err: unknown) => void` alongside `onCopied`, and the same on `CodeSnippet`'s
copy affordance.

**Shipped:** `onError` and `errorLabel` on `CopyButton`, and `onCopied` / `onCopyError` on
`CodeSnippet`. One addition beyond the ask, because a callback alone leaves the default behaviour
exactly as broken as it was: a refused write now shows a cross in `--destructive` and announces
`errorLabel` ("Copy failed") in the live region the button already had. `CodeSnippet` sets its own
message — "Copy failed — select the code and copy it manually", which is the sentence this report says
went missing — and forwards the rejection. The image-copy path reports through the same channel; a
page that handles one refusal wants both.

---

## 3. Theme layer

### 3.1 `@duck/theme` overwrites the project's typefaces on every install

The theme's `cssVars.theme` block sets `--font-sans` and `--font-mono` to
`ui-sans-serif, system-ui` / `ui-monospace, …`. This project ships Geist and Geist Mono (imported in
`main.tsx`, and the mono face is load-bearing: every numeric readout in the chrome is tabular mono).
Installing the theme silently replaced both, and re-running the install will replace them again.

Nothing broke loudly — the app just rendered in the system face until someone noticed.

**Ask:** leave `--font-sans`/`--font-mono` out of the theme item and let `font-sans` fall through to
Tailwind's default, or name them `--font-duck-sans` and alias them. If they must be set, say so in
the theme's description so a project knows to re-declare its faces after `add @duck/theme`.

**Shipped:** the first option. `--font-sans` is gone from the theme item and `--font-display` now
defaults to `var(--font-sans)`, so a project that ships Geist gets Geist everywhere including the
display scale, and a reinstall cannot take it away. The theme's description says it declares no
typefaces.

The report is slightly off on the detail and it is worth recording: the **base theme never set
`--font-mono`**. It set `--font-sans` and `--font-display`. `--font-mono` comes from
`@duck/theme-noir`, which sets all three deliberately — Inter, Space Grotesk and JetBrains Mono are
that look. Those stay, and noir's description now warns that installing it replaces your faces.

### 3.2 The install preserves comments that the tokens no longer match

`shadcn add @duck/theme` rewrites the values inside `:root` / `.dark` but keeps whatever comments were
there, so this project's `--primary: oklch(0.85 0.17 115); /* Claude terracotta */` survived as a lie
about a lime token. Minor, but a generated block that keeps hand-written annotations will always drift
— worth a line in the docs telling people to treat that block as generated.

**Shipped:** that line, on the installation page's Fonts section, next to the typeface note it belongs
with — treat the token block as generated, and keep annotations of your own somewhere the generator
does not touch. It sits beside the existing warning that a reinstall merges `css` by selector and
leaves the old rule winning; the two failure modes are the same shape.

---

## 4. Polish

- **`HoloBadge` has no full-width shape.** A rail-wide status block ("Nothing flagged") uses
  `shape="tag"` plus `w-full justify-center`. A `block` shape would cover it.
- **`EmptyPond` is the right answer eight times in this app** (empty layer list, empty archive, empty
  gallery, no favourites, no search results, no tokens, no history, no layers in an imported project)
  and `compact` fits a 288px rail well. No change needed — recording it because it is the single
  highest-leverage item in the registry for a tool-shaped UI.
- **`StickerKbd`'s `watch` is the best small thing here.** The dock's tooltips print a keycap that
  depresses on the real keystroke, so the dock documents its own keyboard map while the user's finger
  is on the key. It replaced a bespoke `.dock-key` span. Worth a mention on the docs site — it reads
  as decoration and is actually teaching.
- **`DuckCommand` accepting data rather than children** made the ⌘K palette a 40-line component
  instead of a 100-line one, and `shortcut={false}` was exactly the prop needed for an app that
  already owns ⌘K. No change.
- **No drag-reorderable list.** The layer stack is hand-rolled pointer-event reordering (drop
  indicator, auto-scroll at the edges, multi-select block moves) and stays that way. `DuckListRow`
  has no grip or reorder affordance. Filing it for completeness, not as an expectation — it is a
  large component and every app wants it slightly differently.

**Shipped:** `shape="block"` on `HoloBadge` — full width, centred, `rounded-md`, and the two existing
shapes now carry their own `inline-flex w-fit` so the base class no longer forces a shape on all
three. The two "no change needed" notes were taken as docs work rather than ignored: `StickerKbd`'s
docs say what `watch` is *for* ("teaching, not decoration: a dock that prints its own keyboard map
presses the cap under the user's finger"), on the component page and in `SKILL.md`, and `EmptyPond`'s
eight uses needed nothing, which is the whole point of recording them.

**Not shipped:** the drag-reorderable list, as filed. It is a component, not a prop, and the report is
right that every app wants it differently — a grip on `DuckListRow` without the drop indicator, the
edge auto-scroll and the multi-select block move would be the decorative half of the feature. It stays
on the list for a report that needs it twice.

---

## 5. Filed after taking the release

Everything above was written from the port. This section is from the pass *after* it — replacing each
workaround in Thumb Studio with the thing that shipped. Adopting a component is where you find out
what it cannot do, because a hand-rolled control gets replaced whole: the twenty lines that go away
include the ones nobody had written down as a feature.

One item, and it is the only place in that pass where the app lost behaviour it had.

### 5.1 `GlowColor` cannot tell an eyedropper pick from a swatch change

The hand-rolled eyedropper this app deleted did two things: it set the colour, and it wrote the picked
hex to the clipboard. The second is a large part of why a design tool has an eyedropper at all — a
colour lifted off a reference frame is a colour you are about to paste into a brand doc, a stylesheet
or a message to a client. It cost one line beside the `await`.

`GlowColor` reports a pick through `onValueChange`, the same channel as the swatch, and the release
note is explicit that this is deliberate: "a picked colour has no DOM event behind it, so it reports
through `onValueChange`". That is the right call for the *value*. But it leaves the pick itself
unobservable — a call site sees one indistinguishable stream of hexes, and a `navigator.clipboard`
write on every one of them would fire on each frame of a swatch drag.

**Workaround:** none that keeps the component. `eyedropper={false}` plus the app's own button beside
the swatch gets the behaviour back and gives up the twenty lines the component exists to own — and
then the app maintains half of `GlowColor` again, which is §1.2's complaint with an extra step. Thumb
Studio has taken the loss instead: 20 colour rows now have an eyedropper that no longer copies.

**Ask:** `onPick?: (hex: string) => void`, fired *in addition to* `onValueChange` when the value came
from the screen picker. Additive, no change to the existing signature, and it is the one signal the
component holds that a caller cannot reconstruct. A second shape —
`onValueChange(hex, { source: "swatch" | "eyedropper" })` — carries the same information, but it
changes a callback that 20 call sites already pass and makes the common case read an argument it does
not care about.

The distinction earns its keep beyond the clipboard, too: a pick is the one colour change that is a
deliberate single act rather than a drag, which makes it the natural place for an undo boundary, a
history entry, or a "copied" confirmation.
