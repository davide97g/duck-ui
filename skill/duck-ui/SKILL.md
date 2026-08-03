---
name: duck-ui
description: Deep knowledge of duck/ui, the dark-first holographic design system distributed as a shadcn registry. Use when installing, composing or customizing @duck components, applying the duck theme, or when a project's components.json contains the @duck registry.
---

# duck/ui

duck/ui is a shadcn-compatible registry by dacoder. Dark-first canvas, duck-lime primary, holographic accents used sparingly, thick sticker borders. Everything installs through the standard shadcn CLI under the `@duck` namespace.

## Setup detection

A project uses duck/ui if `components.json` contains:

```json
{ "registries": { "@duck": "https://duckui.davideghiotto.it/r/{name}.json" } }
```

If that block is missing and the user asks for duck/ui, add it first.

## Install order

1. `npx shadcn@latest add @duck/theme` — always first. It ships the light and dark token sets, the duck extras, the utility classes and the keyframes. Components assume all of it exists.
2. Then any component: `npx shadcn@latest add @duck/quack-button @duck/sticker-card @duck/holo-avatar`

Registry dependencies resolve automatically. `@duck/quack-button` pulls `@duck/duck-spinner` and `@duck/use-holo-pointer` without being asked.

## Design rules, enforce these

1. **One holo element per viewport.** The iridescent finish marks the single most important thing on screen: one CTA, one featured card, or one hero mark. Never several. A second holo element halves the value of the first.
2. **Lime is the meal, holo is the seasoning.** Default actions use `variant="primary"` (duck lime). Reserve `variant="holo"` and `ring="foil"` for the one element that matters most.
3. **One idle animation per viewport.** `idle="breathe" | "sheen" | "pulse" | "float"` is for a resting control that needs to look live. Reactive motion (press, ripple, state change) has no budget because the user caused it.
4. **Dark is the default.** `<html class="dark">`. Light mode exists and is tested, but the dark palette is the reference.
5. **Semantic tokens only.** `bg-primary`, `text-muted-foreground`, `border-border`. Never a raw hex or oklch inside component code.
6. **Sticker language.** Thick borders (`--sticker-border`, 3px), radius at or above `0.75rem`, soft glows (`.duck-glow`) instead of hard drop shadows.
7. **Compose with shadcn.** duck/ui is additive. For a dialog, a dropdown, a table or anything else it does not ship, use standard shadcn/ui. The theme already styles it.
8. **The code is theirs.** Components are copied into the project. Edit the file in place rather than wrapping it in another component.

## Component reference

All imports are `@/components/ui/<name>`, the hook is `@/hooks/use-holo-pointer`.

| Component | Key props |
|---|---|
| `QuackButton` | `variant: primary \| holo \| outline \| ghost \| danger`, `size: sm \| default \| lg \| icon`, `idle: none \| breathe \| sheen \| pulse \| float`, `magnetic: number`, `ripple: boolean`, `state: idle \| loading \| success \| error`, `loadingLabel`, `successLabel`, `errorLabel`, `asChild` |
| `HoloButton` | `variant: holo \| primary \| outline \| ghost`, `size`, `asChild` |
| `CopyButton` | `value`, `label`, `copiedLabel`, `onCopied` |
| `DuckButtonGroup` | `orientation: horizontal \| vertical`, `joined` (default `true`), `toolbar`, and a required `aria-label` or `aria-labelledby`. Joined collapses the shared edges into one `--sticker-border` seam and keeps the outer radius on the end children; `toolbar` swaps `role="group"` for `role="toolbar"` with one tab stop and arrow keys. Takes any child — `QuackButton size="icon"`, a plain `button`, an `a` |
| `HudChip` | `variant: outline \| ghost \| primary`, `size: sm \| default`, `active`, `asChild`, plus native button props. The interactive `HudLabel`: mono, uppercase, tracked, from the `.hud` utility rather than the `--*-button` tokens, so it reads as machine output and not as a CTA. `active` is visual and emits `data-active` — add `aria-current` / `aria-pressed` / `aria-selected` at the call site, since the same highlight means all three. Needs `@duck/hud-label` for `.hud` |
| `StickerCard` (+ `Header`, `Title`, `Description`, `Content`, `Footer`) | `holo`, `tilt`, `peel` |
| `StickerMediaCard` | `src`, `alt`, `fallback`, `aspect: 2/3 \| 16/9 \| 1/1 \| number`, `title`, `subtitle`, `href` or `asChild`, `overlay`, `progress`. Artwork-first tile: image edge to edge, caption outside the frame, the whole tile one focusable link, and the progress bar `aria-hidden` so its value stays out of the link name |
| `StickerCarousel` | `title`, `description`, `actions`, `label`, `controls: edge \| header \| none`, `gap: sm \| default \| lg`, `peek`, `page`, `fade`. Scroll-snap strip; arrows disable at each end and vanish when the content fits |
| `CodeWindow` | `title`, `html`, `copyValue`, `lineNumbers`, `holo` |
| `CodeSnippet` | `code`, `lang: auto \| tsx \| ts \| jsx \| js \| json \| jsonc \| css \| html \| bash \| python \| sql \| yaml \| diff \| text`, `title`, `scheme: duck \| pond \| sunset \| neon \| paper \| mono`, `frame: sticker \| holo \| plain`, `chrome: dots \| plain \| none`, `lineNumbers`, `startLine`, `highlight: "3,7-9" \| number[]`, `wrap`, `maxLines`, `copyable`, `exportable`, `schemePicker`, `wrapToggle`, `exportScale`, `exportBackdrop: holo \| scheme \| none`, `watermark`, `fileName`. Highlights itself and exports a PNG — no Shiki, no async theme load |
| `Terminal` | `lines: { prompt?, text, output? }[]`, `title`, `prompt`, `speed`, `loop`, `holo` |
| `StickerSheet` / `StickerSheetCell` | `label`; cell also takes `span: 1 \| 2 \| 3` |
| `StickerDialog` (+ `Trigger`, `Content`, `Header`, `Title`, `Description`, `Footer`, `Close`) | content takes `size: sm \| default \| lg \| full`, `holo`, `hideClose`, `closeLabel`. Radix Dialog underneath, so the focus trap, scroll lock and Escape are real. Always render a `StickerDialogTitle`; `size="full"` is a full-screen dialog, and an edge-anchored panel is `StickerDrawer` instead |
| `StickerDrawer` (+ `Trigger`, `Content`, `Header`, `Title`, `Description`, `Body`, `Footer`, `Close`) | content takes `side: left \| right \| top \| bottom`, `size: sm \| default \| lg \| full`, `holo`, `hideClose`, `closeLabel`. Same Radix base as the dialog; the die-cut edge sits on the side facing the content and the panel slides from the edge it is anchored to. `size` is the width on left and right and a ceiling on the height on top and bottom. Scrolling content goes in `StickerDrawerBody` |
| `StickerPopover` (+ `Root`, `Trigger`, `Content`, `Close`, `Anchor`) | `content`, `side: top \| right \| bottom \| left`, `align: start \| center \| end`, `sideOffset`, `arrow`, `holo`, `contentClassName`. Radix Popover with the 3px edge; not a menu (no roving focus, no typeahead) — for that use shadcn `DropdownMenu` with `className={cn(STICKER_SURFACE, "p-1")}`, the recipe this item exports |
| `VideoCard` | `videoId`, `title`, `channel`, `duration`, `thumbnail`, `holo` |
| `DuckViewport` / `DuckViewportControls` | viewport takes `min`, `max`, `initial`, `zoomStep`, `panStep`, `wheelZoom`, `onTransformChange`, and a ref exposing `getTransform`, `zoomIn`, `zoomOut`, `zoomTo`, `panBy`, `reset`; controls take `viewport` (that ref), `orientation`, `zoomInLabel`, `zoomOutLabel`, `resetLabel`, `aria-label`. Pan/zoom container, cursor-anchored: the wheel listener is non-passive by hand because React's `onWheel` cannot `preventDefault`, and the transform is written to `element.style` so a pan costs no renders. The controls are a `DuckButtonGroup` toolbar — one tab stop beside a canvas that already owns the arrow keys |
| `HoloAvatar` / `HoloAvatarGroup` | `src`, `alt`, `fallback`, `size: xs \| sm \| default \| lg \| xl`, `shape: circle \| sticker`, `ring: foil \| holo \| primary \| none`, `status: online \| away \| offline`; group takes `max` |
| `HoloBadge` | `variant: holo \| primary \| outline \| muted \| success \| danger` |
| `HudLabel` | `tone: muted \| foreground \| primary \| accent`, `size: sm \| default`, `tracking: default \| tight`, `dot`, `dotTone: muted \| foreground \| primary \| accent \| destructive`. The dot takes the label's colour and only `primary` glows; use `dotTone` for a red dot on a muted row, never a `[&>span]` selector. Also ships a `.hud` utility for labels that are an attribute of an existing element |
| `HudCode` | `interactive`, `asChild`, `disabled`, plus native button props. Inline citation chip: mono, `nowrap`, `--primary` tinted through `bg-primary/10` and `border-primary/25`, `--radius-sm`. Renders `<code>`; `interactive` makes it a button and `asChild` takes a link. 0.875em with collapsed leading, and inline padding never enters the line box, so it cannot change a paragraph's leading. Beats `DuckProse`'s own `code` rule with one class, because every prose rule is `:where()` and therefore zero specificity |
| `Announcement` | `tag`, `href`, `arrow` |
| `DuckSpinner` | `size: sm \| default \| lg`, `motion: paddle \| spin`, `src` (any image URL, defaults to `/duck.svg`, which the item ships into your project-root `public/`), `label`; also exports `DuckGlyph` and `DUCK_MARK_SRC` |
| `HoloSeparator` | `label`, `orientation`, `holo` |
| `DuckMark` | `pose: rest \| swim`. Flat vector, inherits currentColor. Use above ~48px; below that use `DuckGlyph` |
| `StickerKbd` | `watch` (a KeyboardEvent.key), `meta` |
| `StickerSkeleton` / `StickerSkeletonText` | `shape: line \| title \| circle \| card \| poster \| video`, `delay`; text takes `lines`. `poster` and `video` carry their own ratio, so artwork needs no geometry at the call site |
| `StickerProgress` / `StickerProgressTrack` | `value` (omit for indeterminate), `max`, `label`, `showValue`, `size: sm \| default`. `StickerProgressTrack` is the bar alone — no wrapper, no label row — for laying along the bottom edge of artwork. Nested inside a link or button, pass `aria-hidden`: a live progressbar there gets its `aria-valuenow` read into that element's accessible name |
| `EmptyPond` | `title`, `hint`, `action`, `art`, `compact` |
| `GlowInput` / `GlowTextarea` / `GlowField` / `GlowFieldset` | `GlowField` takes `label`, `helper`, `error`, `required` and wraps one control; `GlowFieldset` takes `legend` instead of `label` and wraps a group, because `GlowField` clones a single child to inject the id and a pair has nothing to clone. The two controls take `frame` (default `true`) — pass `frame={false}` inside a surface that is already the frame, since `.sticker` lands after Tailwind's utilities and `border-0` at the call site cannot beat it |
| `DuckSwitch` | `size: sm \| default`, `children` as the label, plus native `checked` / `defaultChecked` / `onChange` |
| `StickerCheckbox` | `indeterminate`, `children` as the label, plus native checkbox props |
| `StickerRadioGroup` / `StickerRadio` | group takes `name`, `value`, `defaultValue`, `onValueChange`; radio takes `value` (required) and `description` |
| `StickerToggleGroup` / `StickerToggleGroupItem` | group takes `type: single \| multiple`, `value`, `defaultValue`, `onValueChange`, `size: sm \| default`, `disabled`; item takes `value` (required). Single select is a radiogroup, multiple is a toolbar of `aria-pressed` buttons; one tab stop, arrow keys inside |
| `DuckSlider` | `value`, `defaultValue`, `min`, `max`, `step`, `formatValue`, `showValue`. Single value, no range |
| `DuckMediaSlider` | `value`, `defaultValue`, `buffered` (0–1 fraction of the track), `preview: (value) => ReactNode`, `dense`, `onScrub` (live), `onSeek` (commit), `formatValue`. Seek bar: holds the value while dragging so `timeupdate` cannot fight the thumb; also exports `formatTimecode` |
| `DuckVolume` | `volume`, `defaultVolume`, `muted`, `defaultMuted`, `onVolumeChange`, `onMutedChange`, `collapsible`. Mute toggle plus a slider that collapses when idle; volume 0 reads as silence without flipping `muted` |
| `DuckAudioPlayer` | `src`, `title`, `compact`, `defaultVolume`, `defaultMuted`, `skip` (default 15s, default layout only), plus native `loop` / `preload`. Wires one `<audio>` to `DuckMediaSlider` + `DuckVolume` + a `QuackButton` transport; `duration` stays `null` for a stream so the bar is disabled rather than pinned, `buffered` comes from the range holding the playhead, and `compact` is one frameless row for a list |
| `StickerOtp` | `length`, `value`, `defaultValue`, `onValueChange`, `onComplete` |
| `StickerDrop` | `accept`, `multiple`, `maxSize`, `files`, `onFilesChange`, `label`, `hint`. Pass `files` whenever a submit can clear the form: it makes the zone controlled, so `setFiles([])` empties the sheet with no remount |
| `DuckTabs` (+ `List`, `Trigger`, `Content`) | `value`, `defaultValue`, `onValueChange` |
| `ThemeSwitcher` | none, needs a next-themes provider |
| `QuackToastProvider` / `useQuackToast` | provider takes `max`; hook returns `toast`, `quack`, `dismiss` |
| `DuckThinking` | `label`, `showLabel`, `mark` (defaults to `DuckMark`; pass your own and the ripples stay) |
| `StreamText` | `text` (types it out — demo), `streaming` + `active` (real tokens), `speed`, `onDone` |
| `QuackBubble` | `from: assistant \| user`, `meta`, `mark` (the assistant's face, defaults to `DuckMark`) |
| `useHoloPointer` | `tilt`, `magnet`, `reset`, `disabled`; returns a ref |

## Blocks

Whole sections rather than single controls. Same CLI, but the file lands in `components/blocks/<name>.tsx` and pulls in every component it renders. They are starting points: install, then edit the file down. Do not wrap them.

| Block | Import | Key props |
|---|---|---|
| `DuckHero` | `@/components/blocks/duck-hero` | `eyebrow: { text, tag?, href? }`, `title`, `description`, `primaryAction: { label, href }`, `secondaryAction`, `terminal: TerminalLine[]`, `aside` (replaces the terminal), `proof` |
| `DuckPricing` | `@/components/blocks/duck-pricing` | `title`, `description`, `tiers: { name, description?, monthly, yearly?, features, action?, featured?, badge? }[]`, `currency`, `billingSwitch`, `yearlyNote`, `yearly` + `onYearlyChange` for controlled billing |
| `DuckDashboard` | `@/components/blocks/duck-dashboard` | `nav`, `footerNav`, `title`, `brand` / `brandLabel`, `user: { name, src?, fallback? }`, `onSearch` + `searchLabel`, `stats: { label, value, hint?, progress? }[]`, `actions`, `themeSwitcher`, `children` |

Rules that come with them:

- `DuckHero` spends the page's holo budget on `primaryAction`. Nothing else in the first viewport is holo.
- `DuckPricing` takes exactly one `featured` tier, and that tier's button stays lime — the holo is the card ring.
- A yearly price is the per-month figure billed yearly, not the annual total.
- `DuckDashboard` keeps holo out of the chrome; the page inside it spends the budget. Its theme switcher needs a next-themes provider, or pass `themeSwitcher={false}`.
- Actions are plain `<a>` so the blocks stay framework-agnostic. Swap in the project's router link once the file is theirs.

## Tokens

Full shadcn contract, plus:

- `--holo` linear gradient, for borders and text
- `--foil` conic gradient, for surfaces that track the pointer
- `--glow` and `--glow-primary` soft box shadows
- `--sticker-border` border width for the sticker look
- `--vinyl` the white die-cut edge, white in both modes
- `--sheet`, `--sheet-line`, `--cut` sticker sheet backing
- `--fx`, `--fy`, `--rx`, `--ry` pointer position, written by `useHoloPointer`

Utility classes: `.holo-border`, `.holo-border-animated`, `.holo-text`, `.foil`, `.sheen`, `.tilt`, `.duck-glow`, `.duck-glow-primary`, `.duck-stream-edge`, `.sticker`, `.holo-edge`, `.kiss-cut`, `.cut-line`.

`.duck-stream-edge` masks the bottom 1.4em of a block into transparency, for the growing edge of streaming text. The mask stop is an alpha value, not a colour, so it needs no token and works on any surface; it is switched off under `prefers-reduced-motion`, because a permanently faded last line is missing text rather than reduced motion.

**Print.** `@duck/theme` ships an `@media print` layer that re-asserts duck's light token values on `:root, .dark` — necessary because `.dark` sits on `<html>` and would otherwise win — then turns the glows off and the 3px sticker edge into a hairline. Print styling is therefore a token question, not a per-component one: a PDF export needs no hand-written palette, and `.duck-prose` already avoids breaking figures, tables and code across pages. `@duck/theme-noir` carries its own print block, since it is dark in both modes and is declared after the base theme.

Keyframes: `holo-shift`, `duck-idle`, `duck-sheen`, `duck-squash`, `duck-pop`, `duck-ripple`, `duck-paddle`, `duck-float`, `duck-caret`, `duck-rise`, `duck-marquee`, `duck-shimmer`, `duck-waddle`, `duck-fade-in`, `duck-fade-out`, `duck-dialog-in`, `duck-dialog-out`, `duck-drawer-in`, `duck-drawer-out`.

## Composition patterns

**A pricing grid.** All cards plain, one card `holo`. Every CTA stays lime — a holo button inside a holo ring reads as a rendering bug. That ring is the single holo element, so no other holo may appear in the same viewport. `@duck/duck-pricing` ships this already built.

**A form.** Always `GlowField` around `GlowInput`, never a placeholder as the label. Submit with `QuackButton` driven by `state`, resetting to `idle` when the request settles. Errors go in the field, not in a toast.

**A people list.** `ring="none"` on every avatar. If one person must stand out, give exactly that one `ring="foil"`.

**A hero.** One holo or foil element total. If the hero mark carries the foil, the CTA is lime.

## Accessibility expectations

- Every animation collapses under `prefers-reduced-motion`; the theme handles it globally and the Terminal prints its transcript at once.
- `QuackButton` sets `aria-busy` and disables itself while loading.
- `GlowField` wires `htmlFor`, `aria-describedby`, `aria-invalid` and `role="alert"` on errors.
- Toasts never take focus and announce politely.
- `DuckTabs` implements the tabs keyboard pattern: arrows, Home, End.

## Docs

- Site: https://duckui.davideghiotto.it
- Index for assistants: https://duckui.davideghiotto.it/llms.txt, full version at https://duckui.davideghiotto.it/llms-full.txt
- Theme editor: https://duckui.davideghiotto.it/create
