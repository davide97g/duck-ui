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
| `StickerCard` (+ `Header`, `Title`, `Description`, `Content`, `Footer`) | `holo`, `tilt`, `peel` |
| `CodeWindow` | `title`, `html`, `copyValue`, `lineNumbers`, `holo` |
| `Terminal` | `lines: { prompt?, text, output? }[]`, `title`, `prompt`, `speed`, `loop`, `holo` |
| `StickerSheet` / `StickerSheetCell` | `label`; cell also takes `span: 1 \| 2 \| 3` |
| `VideoCard` | `videoId`, `title`, `channel`, `duration`, `thumbnail`, `holo` |
| `HoloAvatar` / `HoloAvatarGroup` | `src`, `alt`, `fallback`, `size: xs \| sm \| default \| lg \| xl`, `shape: circle \| sticker`, `ring: foil \| holo \| primary \| none`, `status: online \| away \| offline`; group takes `max` |
| `HoloBadge` | `variant: holo \| primary \| outline \| muted \| success \| danger` |
| `Announcement` | `tag`, `href`, `arrow` |
| `DuckSpinner` | `size: sm \| default \| lg`, `motion: paddle \| spin`, `src` (any image URL, defaults to the duck/ui logo), `label`; also exports `DuckGlyph` and `DUCK_MARK_SRC` |
| `HoloSeparator` | `label`, `orientation`, `holo` |
| `DuckMark` | `pose: rest \| swim`. Flat vector, inherits currentColor. Use above ~48px; below that use `DuckGlyph` |
| `StickerKbd` | `watch` (a KeyboardEvent.key), `meta` |
| `StickerSkeleton` / `StickerSkeletonText` | `shape: line \| title \| circle \| card`, `delay`; text takes `lines` |
| `StickerProgress` | `value` (omit for indeterminate), `max`, `label`, `showValue` |
| `EmptyPond` | `title`, `hint`, `action`, `compact` |
| `GlowInput` / `GlowTextarea` / `GlowField` / `GlowFieldset` | `GlowField` takes `label`, `helper`, `error`, `required` and wraps one control; `GlowFieldset` takes `legend` instead of `label` and wraps a group |
| `DuckSwitch` | `size: sm \| default`, `children` as the label, plus native `checked` / `defaultChecked` / `onChange` |
| `StickerCheckbox` | `indeterminate`, `children` as the label, plus native checkbox props |
| `StickerRadioGroup` / `StickerRadio` | group takes `name`, `value`, `defaultValue`, `onValueChange`; radio takes `value` (required) and `description` |
| `DuckSlider` | `value`, `defaultValue`, `min`, `max`, `step`, `formatValue`, `showValue`. Single value, no range |
| `StickerOtp` | `length`, `value`, `defaultValue`, `onValueChange`, `onComplete` |
| `StickerDrop` | `accept`, `multiple`, `maxSize`, `onFilesChange`, `label`, `hint` |
| `DuckTabs` (+ `List`, `Trigger`, `Content`) | `value`, `defaultValue`, `onValueChange` |
| `ThemeSwitcher` | none, needs a next-themes provider |
| `QuackToastProvider` / `useQuackToast` | provider takes `max`; hook returns `toast`, `quack`, `dismiss` |
| `DuckThinking` | `label`, `showLabel` |
| `StreamText` | `text` (types it out — demo), `streaming` + `active` (real tokens), `speed`, `onDone` |
| `QuackBubble` | `from: assistant \| user`, `meta` |
| `useHoloPointer` | `tilt`, `magnet`, `reset`, `disabled`; returns a ref |

## Tokens

Full shadcn contract, plus:

- `--holo` linear gradient, for borders and text
- `--foil` conic gradient, for surfaces that track the pointer
- `--glow` and `--glow-primary` soft box shadows
- `--sticker-border` border width for the sticker look
- `--vinyl` the white die-cut edge, white in both modes
- `--sheet`, `--sheet-line`, `--cut` sticker sheet backing
- `--fx`, `--fy`, `--rx`, `--ry` pointer position, written by `useHoloPointer`

Utility classes: `.holo-border`, `.holo-border-animated`, `.holo-text`, `.foil`, `.sheen`, `.tilt`, `.duck-glow`, `.duck-glow-primary`, `.sticker`, `.kiss-cut`, `.cut-line`.

Keyframes: `holo-shift`, `duck-idle`, `duck-sheen`, `duck-squash`, `duck-pop`, `duck-ripple`, `duck-paddle`, `duck-float`, `duck-caret`, `duck-rise`, `duck-marquee`, `duck-shimmer`, `duck-waddle`.

## Composition patterns

**A pricing grid.** All cards plain, one card `holo`. Every CTA `variant="primary"` except the featured card, which gets `variant="holo"`. That is the single holo element, so no other holo may appear in the same viewport.

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
