# The instrument panel

**3 August 2026.** Two new UI items, three button sizes, a logarithmic slider, vertical tabs, and one
variable that finally makes the sticker edge overridable.

duck/ui had a primitive layer, a surface layer, a long-form layer and an application layer, and it was
still missing the two controls a design tool cannot do without — a select and a colour field — and the
whole size below `sm`. A control rail runs on 24–28px icon buttons; the smallest button here was 32px
and its radius was wrong for a small square, so every call site in an editor wrote the same three-class
override. This release is that gap, closed. It comes out of
[editor-app-gaps.md](../feature-requests/editor-app-gaps.md), the fourth migration stress test and the
first from a *tool*: two dense rails either side of a canvas, ~40 sliders, ~20 colour pickers, 12
selects and 60-odd icon buttons.

Nothing here is breaking. Every changed component renders its defaults exactly as before, with one
exception noted below.

## New components

**The field family gets its select.** `@duck/glow-select` is the one place duck breaks its own rule 7.
A stock shadcn select beside a `GlowInput` reads as a different design system — 1px against the 3px
die-cut edge, `--radius-md` against `rounded-lg`, no lime glow, and a menu made of other material — and
selects live in exactly the column where that shows. It is Radix Select underneath, not a native
`<select>`: typeahead, roving highlight, collision-aware positioning and a hidden native select that
still submits, but mainly because a native select's option list is drawn by the OS and can never take
the edge. The important part is that it copies nothing. `glow-input.tsx` now exports its three class
strings and the trigger imports them; `StickerPopover` already exported `STICKER_SURFACE` and the menu
imports that. The local select every project writes drifts the first time `glow-input.tsx` changes;
this one cannot. `size="sm"` is the 32px rail size, `chevron={false}` is for an icon-only trigger, and
the composed parts take groups, headings and separators.

**And its colour field.** `@duck/glow-color` is the last raw HTML input a design tool has.
`input[type="color"]` needs the same four rules in every project — `appearance: none`, the swatch
wrapper's padding, the inner radius, the border it draws whatever you say — and the Chromium
`EyeDropper` beside it is another twenty lines. Both live in the component now. Three decisions worth
knowing: a picked colour has no DOM event behind it, so it reports through `onValueChange` and
`onChange` stays the swatch's own native event; values are normalised to `#rrggbb` before they reach
the input, because that is the only form it accepts and it renders anything else as black; and there is
no alpha channel, so an eighth and ninth hex digit are dropped rather than half-honoured. The
eyedropper is rendered from a mounted effect, so a server render never promises a button Firefox cannot
honour.

## The instrument scale

`QuackButton` gained `xs` (h-7), `icon-xs` (28px) and `icon-sm` (32px), each with `rounded-md` and a
14px icon. The height was never the hard part — the radius was: `rounded-lg` on a small square reads as
a circle with corners, so a `size="icon"` plus `size-6` at the call site needed a `rounded-md` with it,
thirty times over, and getting that pair right became the application's job. An exact 24px control is
`size="icon-xs"` plus `size-6`, and the radius and icon scale still come from the variant. `HudChip`
gained `size="xs"` at 24px for the chip that fits a 32px list row. The control-typography rule in
`@layer base` picked up the new sizes, so they read at `--text-button-sm` from the token a theme
already tunes.

## The slider learns two things a rail needs

**`curve="log"`.** A font size runs 12→400 and an image scale runs 0.05→8; linear, the useful half of
either lives in the first 15% of the track. Every editor writes the geometric mapping by hand, drives
the slider in fake integer positions, and then has to lie in `min`/`max`/`step` and patch the
screen-reader text back up. The component owns the mapping now: the track is uniform in log space,
`step` stays the grain of the value you receive, `aria-valuetext` carries the real number even without
`formatValue`, and the value arrives through a new `onValueChange`. `onChange` still fires and its
`valueAsNumber` is a track position — it is the input's own event, and rewriting it would be a lie of a
different kind. A log track needs `min > 0` and falls back to linear with a dev warning rather than
silently misplacing the thumb.

One thing the mapping forces, and it took a browser to notice: a position is worth less than a `step`
over most of a wide range — 0.04px at the bottom of 12→400 — so an arrow key used to quantise straight
back to the value the slider already had, and a controlled thumb snapped home. Each press now walks on
in its direction of travel until the value changes, so one press is one `step` everywhere, and Home,
End and both ends behave.

**The label row.** `label` renders a real `<label>` tied to the input, `valuePosition="row"` puts the
readout at the end of that row in tabular mono so a drag never reflows it, and `action` takes the
trailing affordance — the reset button, a lock, a menu. Forty sliders in a 288px rail stay a fixed
height. Defaults are unchanged: `showValue` with no `label` still prints above the track.

## Vertical tabs

`orientation="vertical"` on `DuckTabs` is a real axis change, not a rotation. The list measures
`offsetTop`/`offsetHeight` and emits `aria-orientation`, Up and Down move (Left and Right do nothing,
which is what `aria-orientation` has already promised a screen reader), the root becomes a row and the
panel takes the rest of it. The indicator stops being a filled pill: a pill wide enough to cover a rail
of varying-length labels has to be the width of the longest one, at which point it is a block of colour
rather than a marker — so vertical gets a 3px bar down the left edge and the active label carries the
accent itself. A settings dialog can keep its section rail instead of choosing its layout to suit the
component.

## One variable for the sticker edge

`.sticker` is declared at the end of the consumer's `@layer utilities`, so a `border-0` at the call
site loses on order at equal specificity and the 3px edge stays. That is why `frame` existed on
`GlowInput`, and it is why the pattern kept being re-derived per component. It reads from a variable
now:

```css
.sticker      { border-width: var(--sticker-width, var(--sticker-border)) }
.sticker-none { --sticker-width: 0px }
```

A variable is immune to source order, so `sticker-none` wins wherever it is written — and
`[--sticker-width:1px]` gets the hairline that a zero-or-nothing escape hatch could never express. It
is reset on every element in `@layer base`, because a custom property inherits and a frameless card
must not take the edge off the fields inside it. `.holo-border` and `.holo-border-animated` read the
same variable, so the two finishes stay one edge.

`frame` arrived on the four components that draw the edge and did not have it: `StickerCard`,
`HudChip`, `DuckTabsList` and `StickerKbd`. With the four field controls that is all of them, and the
convention is written down centrally — design rule 9 in `SKILL.md`, and the order-of-cascade section on
the theming page — rather than rediscovered per component.

## Changed APIs

All additive, and all optional.

- `size` on `QuackButton` gained `xs`, `icon-xs`, `icon-sm`; on `HudChip`, `xs`.
- `curve`, `label`, `valuePosition`, `action` and `onValueChange` on `DuckSlider`.
- `orientation` on `DuckTabs`; `frame` on `DuckTabsList`.
- `frame` on `StickerCard`, `HudChip` and `StickerKbd`.
- `asChild` on `HudLabel` and `HoloBadge`. A section heading in a control rail *is* a HUD label and is
  also an `<h3>`; this is how it can be both without pasting `hudLabelVariants()` onto the heading.
  `HudLabel`'s needed `Slottable`, because `dot` renders a second child and Slot counts children with
  `React.Children.only`.
- `shape="block"` on `HoloBadge`: the rail-wide status strip, full width and centred, instead of
  `shape="tag"` plus `w-full justify-center` at every call site.
- `wrapDisabled` on `StickerTooltip`, default `true`. A disabled `<button>` receives no pointer events
  and takes no focus, so the label used to vanish exactly when it was most wanted — "why can't I press
  Save?" is the case a tooltip exists for. A child carrying `disabled` or `aria-disabled` is now
  wrapped in a `tabIndex={0}` span, and that span is the trigger.
- `errorLabel` and `onError` on `CopyButton`; `onCopied` and `onCopyError` on `CodeSnippet`.
- `GLOW_FIELD_BASE`, `GLOW_FIELD_FRAME` and `GLOW_FIELD_BARE` exported from `@duck/glow-input`, for the
  same reason `STICKER_SURFACE` is exported: a control that has to read as the field imports the recipe
  instead of copying it.

**The exception is `CopyButton` on a refused write.** Clipboard access is denied over plain HTTP and
inside some embedded browsers. The button correctly never claimed success there, but it also said
nothing, so the user got a control that appears to do nothing at all. It now shows a cross in
`--destructive` for two seconds and announces `errorLabel` ("Copy failed") in the live region it
already had. `CodeSnippet` says more — "Copy failed — select the code and copy it manually" — because
the code is on the page and selectable.

## The theme stops claiming your typefaces

`@duck/theme` set `--font-sans`, so installing it silently replaced whatever the project had loaded.
Nothing broke loudly; the app just rendered in the system face until somebody noticed, and re-running
the install did it again. The theme now declares no typefaces at all: `--font-sans` and `--font-mono`
stay Tailwind's defaults and `--font-display` follows `--font-sans` until you point it at a display
face. `@duck/theme-noir` is the exception and always was — Inter, Space Grotesk and JetBrains Mono are
that look — so its description now says it replaces all three.

The installation page also says, next to that, what a generated block means: `shadcn add` rewrites the
values inside `:root` and `.dark` but keeps whatever comments were there, so a hand-written
`/* Claude terracotta */` outlives the colour it described. Keep annotations somewhere the generator
does not touch.

## Registry

Before this release: 59 UI items and 5 blocks. After: **61 UI items and 5 blocks**, 69 items in total.
`scripts/check-registry-sync.mjs` is the check; `registry.json`, `lib/registry-docs.ts` and
`/llms-full.txt` are the inventories worth trusting.

## What a hand-managed install needs to know

If the CLI manages your `components.json` and your `globals.css`, skip this. If either is hand-managed,
two things arrived:

- **One new package dependency: `@radix-ui/react-select`**, for `@duck/glow-select`. Nothing else in
  this release adds a package.
- **`@duck/theme` changed three rules and added two.** `.sticker`, `.holo-border` and
  `.holo-border-animated` read their width through `var(--sticker-width, var(--sticker-border))`; the
  new `.sticker-none` utility sets that variable to zero; and `* { --sticker-width: initial }` in
  `@layer base` stops it inheriting. Without them, `frame={false}` on `HudChip` and `DuckTabsList`
  silently does nothing — those two turn the edge off through `sticker-none` rather than by dropping a
  class.

## Upgrading

Nothing breaks, and there is no migration to run. Three things are not automatic:

Re-add `@duck/theme` to pick up `--sticker-width`, `.sticker-none` and the typeface removal. Adding a
component will not pull the theme in for you, and `frame={false}` on `HudChip` or `DuckTabsList` needs
the new utility to do anything.

Because `shadcn add` merges `css` by selector, a reinstall leaves your old `.sticker`, `.holo-border`
and `.holo-border-animated` rules in place alongside the new ones — and the old one still wins. Grep
your stylesheet for those three after upgrading and delete the duplicates. The same caveat as every
utility change in this registry.

If you were relying on duck to set `--font-sans`, declare it yourself. The practical difference is
small — Tailwind's default is a system stack too — but it is now your line, not ours, which is the
whole point.
