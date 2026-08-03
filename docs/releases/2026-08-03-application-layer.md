# The application layer

**3 August 2026.** Ten new UI items, six new props, a print layer and a mask utility.

duck/ui had a primitive layer, a surface layer and a long-form layer, and it stopped at the edge of an
application. There was no drawer, no popover, no pan-and-zoom container, no command palette, no header
for a list of rows, and nothing at all for paper — so an app built on it fell back to stock shadcn on
three of its seven surfaces and invented a light palette by hand for its PDF export. This release is
that gap, closed. It comes out of
[knowledge-app-gaps.md](../feature-requests/knowledge-app-gaps.md), the third rebrand stress test and
the first that was an application rather than a site.

Nothing here is breaking. Every changed component renders its defaults exactly as before, with one
exception noted below.

## New components

**Panels and overlays.** `@duck/sticker-drawer` is the edge-anchored dialog: the same Radix Dialog base
as `StickerDialog`, so the focus trap, the scroll lock and Escape are real, with `side`, a `size` that
is a width on left and right and a ceiling on the height on top and bottom, the die-cut edge on the
side facing the content, and a `StickerDrawerBody` for the scrolling middle. `@duck/sticker-popover` is
Radix Popover with the 3px edge, and it exports `STICKER_SURFACE` — the class recipe that gives a stock
`DropdownMenuContent` or `SelectContent` the same edge. It is the string the component itself wears, so
the recipe cannot drift from it. A popover is not a menu, and the file says so: for a real menu, use
shadcn's `DropdownMenu` and paste the constant.

**The canvas.** `@duck/duck-viewport` is pan and zoom for somebody else's content — an SVG graph, an
image lightbox, a zoomable diagram. The transform is written straight to `element.style`, so a pan
costs no renders; the wheel listener is registered by hand as non-passive, because React's `onWheel` is
delegated and passive and `preventDefault()` inside it does nothing. `DuckViewportControls` takes the
viewport's ref and draws the +/−/reset cluster. `@duck/duck-button-group` is the geometry underneath
it: `joined` by default, with the shared edges collapsed into one overlap rather than a border trim,
and a `toolbar` mode that swaps three tab stops for one plus arrow keys.

**The HUD vocabulary, now interactive.** `@duck/hud-chip` is the control `HudLabel` was not: mono,
uppercase and tracked, from the `.hud` utility rather than the `--*-button` tokens, with
`variant: outline | ghost | primary`, `size`, `active` and `asChild`. `@duck/hud-code` is the inline
citation chip — a monospace token in the middle of a sentence, tinted through `bg-primary/10` and
`border-primary/25` so a theme that moves `--primary` moves every citation with it.

**Search.** `@duck/glow-search` is the field: leading icon, clear button, an optional keycap hint, and
a debounced `onSearch` that Enter, Escape and the clear button all flush. `@duck/duck-command` is the
palette behind the shortcut that field hints at — `StickerDialog` plus a filtered listbox, on the
combobox pattern, with no cmdk. `duck-dashboard` has taken an `onSearch` prop since it shipped with
nothing to render into it; wire the two together and pass `shortcut={false}`, since that block already
binds Mod+K.

**Lists and media.** `@duck/duck-list-header` gives `DuckListRow` the column labels and the sort
control it never had. `DuckList` writes the track list once as `--duck-list-cols` and the header and
every row read it, so a column width is never pasted onto a row again. `@duck/duck-audio-player` wires
one `<audio>` element to the two hard parts that already shipped, `DuckMediaSlider` and `DuckVolume`,
plus a `QuackButton` transport.

## Changed APIs

All additive, and all optional. Every default renders as it did before, with one exception.

- `mark` on `DuckThinking` and `QuackBubble`, defaulting to `<DuckMark />`. The loading and messaging
  vocabulary is brand-neutral now.
- `frame` on `GlowInput` and `GlowTextarea`, default `true`. `frame={false}` drops the sticker edge,
  the padding and the focus glow for a field inside a surface that is already the frame.
- `files` on `StickerDrop`. Pass it and the zone stops keeping its own list, so clearing a form after a
  submit no longer means bumping a `key`.
- `size` on `StickerDialogContent`: `sm | default | lg | full`. `full` is a full-screen panel — it
  drops the centring translate and fades rather than rising.
- `cells` on `DuckListRow`, which switches it onto the shared column contract. Feed rows are unchanged.
- `accent` on `HudLabel`'s `tone`, and `dotTone` for the dot.

**The exception is `HudLabel`'s dot.** It used to be lime and glowing whatever the label's colour; it
now takes the label's own colour and only glows on `tone="primary"`. `<HudLabel dot>` inherits
`tone="muted"`, so a bare `dot` that was lime is now `--muted-foreground` and flat. That was the
request, and it is still a visible change: pass `dotTone="primary"` to keep the old dot.

## The theme reaches paper

`@duck/theme` gained an `@media print` layer. It re-asserts duck's own light token values on
`:root, .dark` — both, because `.dark` sits on `<html>` and would otherwise win everywhere below it —
so a printed page is duck light mode and cannot drift from the theme. Nothing is painted from a
literal. `--glow` goes to `none` and `--sticker-border` to `1px`, which turns every halo in the system
into a hairline through the tokens rather than through a print rule per component, and `--primary`
prints as the light `--ring`, because lime is 2.1:1 on white and prints as a pale smear. The
holographic finishes lose their gradients, `.holo-text` gets its fill back, and `.duck-prose` avoids
breaking figures, tables, code and list items across pages.

`@duck/theme-noir` carries a print block of its own. It is deliberately dark in both modes and its
tokens are declared after the base theme, so without one it would have printed a black page. Any
future theme that overrides the palette needs the same.

`duck-stream-edge` is the other half of the theme work: a mask that fades the growing bottom edge of a
block of streaming text, so freshly arrived lines ease in rather than pop. The stop is `#000`, an alpha
value rather than a colour, so the utility is token-free and works on any surface in either mode. Under
`prefers-reduced-motion` it switches off entirely — a permanently faded last line is not a reduced
animation, it is missing text.

## Registry

Before this release: 49 UI items and 5 blocks. After: **59 UI items and 5 blocks**, 67 items in total.
`scripts/check-registry-sync.mjs` is the check; `registry.json`, `lib/registry-docs.ts` and
`/llms-full.txt` are the inventories worth trusting.

## What a hand-managed install needs to know

If the CLI manages your `components.json` and your `globals.css`, skip this. If either is hand-managed,
three things arrived:

- **One new package dependency: `@radix-ui/react-popover`**, for `@duck/sticker-popover`. Nothing else
  in this release adds a package.
- **`@duck/sticker-drawer` ships CSS**: one utility, `.holo-edge` — the iridescent finish for whichever
  sides already carry a border width, since `.holo-border` sets the width itself on all four — and two
  keyframes, `duck-drawer-in` and `duck-drawer-out`, which translate by `--drawer-x` / `--drawer-y` so
  one pair covers all four sides.
- **`@duck/theme` ships the `@utility duck-stream-edge` block and the `@media print` layer**, and
  `@duck/theme-noir` ships its own print block.

## Upgrading

Nothing breaks, and there is no migration to run. Three things are not automatic:

Re-add `@duck/theme` (and `@duck/theme-noir`, if you use it) to pick up the print layer and the mask
utility. Neither is a component, so no `add` for anything in this release will pull them in for you,
and a consumer on an old theme install will keep printing a dark page.

If you hand-edited the installed `quack-bubble.tsx` to swap the mark — repointing the `duck-mark`
import at your own component, which was the only way to do it — delete that edit and pass `mark`
instead. Same for `duck-thinking.tsx`. The next `shadcn add` was going to overwrite both anyway; that
is the whole reason the props exist.

If you already bind Mod+K yourself — including through `duck-dashboard`'s `onSearch`, which binds it
for you — pass `shortcut={false}`. Two handlers on one keystroke is the only way to get this wrong.

Finally, check any bare `<HudLabel dot>` you have. See the note above.
