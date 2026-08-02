# Feature request: what a media app needs that duck/ui does not have

**Source:** building [Cinema](https://github.com/davideghiotto) — a Jellyfin web client (React 19,
Vite, Tailwind v4) skinned entirely on `@duck`. Every item below is something the app hit in
practice, with the workaround it had to write instead. Nothing here is hypothetical.

A media library UI is a good stress test for this registry: it is a wall of artwork, a horizontal
carousel, a video player and four empty states — control-heavy, image-heavy, and almost no forms.
That is roughly the opposite of the marketing-page shape the blocks target, so it found the edges
fast.

**Order below is the order worth implementing.** §1 is three bugs that block or degrade real
installs; §2 is new components; §3 is smaller polish.

---

## 1. Bugs — fix first

### 1.1 `QuackButton asChild` throws on every use — P0

`registry/duck/ui/quack-button.tsx:185`

```tsx
<Comp ...>
  {asChild ? children : body}
  {idle === "pulse" && state === "idle" && (
    <span aria-hidden className="… duck-ripple …" />
  )}
</Comp>
```

With `asChild`, `Comp` is Radix `Slot`. Slot validates with `React.Children.count`, which does
**not** filter falsy children — so even at the default `idle="none"` the count is 2 and the render
throws:

> Slot failed to slot onto its children. Expected a single React element child or `Slottable`.

`asChild` is the only way to render a button as a router `<Link>`, so in any app with client-side
routing every CTA is dead. Cinema hit it on `<QuackButton asChild><Link>…</Link></QuackButton>` in
the hero, the item page, and both empty states.

**Fix:** when `asChild`, render `children` alone — the pulse ring is a decoration on the button's
own box and has no meaning once Slot is cloning someone else's element.

```tsx
{asChild ? (
  children
) : (
  <>
    {body}
    {idle === "pulse" && state === "idle" && <span aria-hidden … />}
  </>
)}
```

`HoloButton` is unaffected (it spreads children through props), which is why the bug is easy to
miss — the two buttons behave differently on the same prop.

**Also worth doing:** a preview that exercises `asChild`. `components/previews/quack-button.tsx`
renders plain buttons only, so the docs site never reproduced this.

### 1.2 `DUCK_MARK_SRC` hardcodes the hosted origin — P1

`registry/duck/ui/duck-spinner.tsx:12`

```ts
const DUCK_MARK_SRC = "https://duckui.davideghiotto.it/duck.png";
```

`DuckSpinner`, `QuackButton state="loading"` and `QuackToast variant="quack"` therefore all make a
cross-origin image request on the loading path. Two ways that breaks a consumer:

- **Offline / LAN apps.** Cinema talks to a Jellyfin box on the local network and is expected to
  work with no internet. The spinner is exactly the component that renders when things are slow.
- **Strict CSP.** Any `img-src 'self'` policy blocks the mark outright, so the spinner renders as
  two rings around nothing.

**Fix:** ship the PNG through the registry so it lands in the consumer's `public/`, and default to
the local path:

```jsonc
// registry.json, item "duck-spinner"
"files": [
  { "path": "registry/duck/ui/duck-spinner.tsx", "type": "registry:ui" },
  { "path": "public/duck.png", "target": "public/duck.png", "type": "registry:file" }
]
```

```ts
const DUCK_MARK_SRC = "/duck.png";
```

Consumers who want the CDN copy still pass `src`. Cinema patched this by hand and copied
`duck.png` into `public/`.

### 1.3 `@duck/theme` ships no `--font-display` — P1

Three components apply `font-display`:

- `registry/duck/ui/sticker-card.tsx:78` (`StickerCardTitle`)
- `registry/duck/ui/empty-pond.tsx:57`
- `registry/duck/ui/video-card.tsx:90`

But `registry.json`'s theme item has only `radius` under `cssVars.theme` — no `--font-display`, no
`--font-sans`. In Tailwind v4 an undefined `font-*` token emits nothing, so the class is silently
inert and every "display" string renders in the body face. The pairing does exist, it just lives
outside the registry, in the site: `app/globals.css:157`

```css
--font-display: var(--font-bricolage), var(--font-geist-sans), sans-serif;
```

So the docs site looks right and every consumer install looks slightly wrong — the worst failure
mode for a design system, because nothing errors.

**Fix:** declare both tokens in the theme item with a self-contained fallback stack, e.g.

```jsonc
"cssVars": {
  "theme": {
    "radius": "0.75rem",
    "font-sans": "ui-sans-serif, system-ui, sans-serif",
    "font-display": "ui-sans-serif, system-ui, sans-serif"
  }
}
```

…and name the two intended faces (Bricolage Grotesque + Geist) in the theme docs with the
one-liner for getting them, so a consumer opts into the real thing knowingly:

```bash
npm i @fontsource-variable/bricolage-grotesque @fontsource-variable/geist
```

Cinema did exactly that and overrode both tokens. It should not have had to discover the type
pairing by reading the site's source.

---

## 2. Components to create

### 2.1 `sticker-media-card` — the biggest gap

Nothing in the registry renders an artwork-first tile:

- `sticker-card` owns its padding and `bg-card`; a poster is edge-to-edge image with nothing around it
- `video-card` is a YouTube embed with a title block, not a library tile

So Cinema's `MediaCard` hand-writes the sticker language — `.sticker`, `rounded-2xl`,
`hover:border-primary`, `hover:duck-glow-primary`, `hover:-translate-y-1`,
`transition … ease-[var(--ease-duck)]`. That is ~15 lines of vocabulary copied out of the registry
into a consumer, which is the drift a registry exists to prevent. Any gallery, catalogue, portfolio
or shop grid needs the same thing.

Proposed:

```tsx
<StickerMediaCard
  src={posterUrl}
  alt={title}
  aspect="2/3"              // "2/3" | "16/9" | "1/1" | number
  title={title}
  subtitle="2016 · 1h 35m"
  href={`/item/${id}`}      // or asChild for a router Link
  overlay={<PlayBadge />}   // centred, fades in on hover
  progress={62}             // renders the thin bar (see 2.2) along the bottom edge
  fallback={title}          // when src is missing or 404s
/>
```

Behaviour worth building in: image scales ~1.06 on hover behind a clipped frame, card lifts, border
goes lime, `duck-glow-primary` appears, `loading="lazy"`, and the whole tile is one focusable link
with a visible focus ring.

### 2.2 `sticker-progress` — compact variant

`StickerProgress` renders a fixed `h-3` track inside a flex column with an optional label row. Two
problems for the "how much of this film is watched" case: 12px is far too heavy overlaid on a
160px-wide poster, and the label row cannot be removed via `className` because the height lives on
an inner element.

Proposed: `size="sm" | "default"` (2–4px track, no label row), or export the bare track as
`StickerProgressTrack` so composite components (2.1, 2.4) can use it without fighting the wrapper.

### 2.3 `sticker-toggle-group`

Library sort — A–Z / Newest / Release / Rating — is a segmented single-select. `duck-tabs` is for
tab panels, so the semantics are wrong. Cinema builds it from `QuackButton`s with
`variant={active ? 'primary' : 'ghost'}` plus hand-written `role="group"` and `aria-pressed`, which
gets the look but not roving focus or arrow-key navigation.

Proposed: a real toggle group (single and multiple), sticker border around the set, lime fill on the
selected item, roving tabindex, arrow keys.

### 2.4 `duck-media-slider`

`DuckSlider` is already a clear win here — Cinema replaced a hand-rolled `div[role="slider"]` seek
bar with it and got keyboard seeking, `Home`/`End`, `PageUp`/`PageDown` and touch dragging for free,
which is precisely the argument in the component's own doc comment. It is the right primitive.

What a seek bar needs on top:

- **Buffered fill.** A second, dimmer fill behind the played one, driven by `video.buffered`.
  Without it the user cannot tell "still loading" from "stalled".
- **Scrub preview.** A position readout that follows the pointer along the track before commit
  (timecode at minimum; a thumbnail slot ideally).
- **Dense variant.** The 18px thumb and `h-5` row are sized for a settings panel. Along the bottom
  edge of a video you want a ~4px track with the thumb appearing on hover/focus only.

Proposed: `<DuckMediaSlider buffered={0.42} preview={(v) => timecode(v)} dense />`, still a real
`<input type="range">` underneath.

Note for whoever builds it: the consumer also needs a drag-vs-`timeupdate` story. Cinema holds a
local `seeking` value while dragging and commits on pointer-up / key-up / blur, otherwise the
element's own `timeupdate` fights the thumb. That is fiddly enough that the component should own it.

### 2.5 `duck-volume`

A mute toggle plus a slider that stay in sync with `video.muted` / `video.volume`, collapsing when
idle. Assembled by hand in Cinema's `PlayerControls`. Small, but every media app writes the same
30 lines, and the "volume 0 means muted" edge is easy to get wrong.

### 2.6 `sticker-carousel`

Horizontal snap scroller with prev/next controls. Cinema's `MediaRow` implements a cut-down version
(`.no-scrollbar` + `scrollBy(clientWidth * 0.85)`) and is missing the parts that are annoying to
write: arrows disabled at each end, edge fade masks, keyboard paging, and not showing controls at
all when the content fits. Pairs directly with 2.1 and would carry the `duck-hero`/`duck-pricing`
family into a third block shape.

### 2.7 `sticker-skeleton` — media shapes

Shapes are `line | title | circle | card`. Loading a poster grid or a backdrop row means overriding
with `aspect-[2/3] h-auto` / `aspect-video h-auto` at every call site — which also means the
consumer has to remember to cancel the shape's built-in height. Proposed: `poster` and `video`
shapes, so geometry and the staggered shared wave both come from the component.

The shared-wave stagger via `delay` is genuinely good, by the way — it is the reason the loading
grid reads as one page arriving. Worth keeping front and centre in the docs.

---

## 3. Smaller notes

- **Tooltip policy.** There is no tooltip in the registry, so Cinema's player advertises its
  shortcuts as inline text (`K play  M mute  F full`) with `StickerKbd`. The README says to use
  standard shadcn for dialogs, dropdowns and tables — if tooltips fall in that bucket too, say so
  explicitly on the site, because "does duck/ui do tooltips" is the first question a control-heavy
  UI asks.
- **`EmptyPond` art slot.** The mascot is hardcoded. In a film app a large duck is off-domain, but
  the layout, the ripples and the copy hierarchy are all wanted. An `art` prop defaulting to
  `DuckMark` would let a consumer keep the component and swap the drawing.
- **Dark-only consumers.** The theme puts light on `:root` and dark on `.dark`, so a dark-only app
  pins `class="dark"` on `<html>` and then carries a full light token set it never uses. Either a
  documented recipe ("dark-only: do this, and here is why the light block stays") or a
  `@duck/theme-dark` variant.
- **`GlowField` vs `GlowFieldset`.** The single-child cloning of `GlowField` means a label + slider
  pair needs `GlowFieldset`. It is explained well in the source, but not visible from the component
  list — worth a line on the docs page for both.
- **shadcn CLI and split tsconfigs.** Not a duck/ui bug, but it will bite Vite consumers: with a
  `tsconfig.json` that only holds `references` (the Vite React template default), the CLI finds no
  `paths` and writes components into a literal `./@/components/ui/` directory. A one-line note in
  the install docs — "your root tsconfig needs `compilerOptions.paths` for `@/*`" — would save
  everyone the same confused minute.

---

---

## Round 2 — after the implementation

All of §1 and §2 landed and Cinema now runs on them: `StickerMediaCard` replaced the hand-rolled
tile (that file went from 88 lines to 54, and the sticker vocabulary is no longer copied into a
consumer), `StickerCarousel` replaced `MediaRow`'s scroller, `StickerToggleGroup` replaced the
fake segmented control, and `DuckMediaSlider dense` + `DuckVolume` replaced the seek bar and the
mute/level pair. Verified in a browser: `data-dense` gives a 4px track, the buffered waterline
renders at the right width off `video.buffered`, the scrub readout follows the pointer, the toggle
group exposes `radiogroup` + roving tabindex, and `DuckVolume` gets all three silence states right
including unmuted-at-zero.

Three things worth a follow-up.

### R2.1 `StickerMediaCard` progress bar poisons the tile's accessible name — FIXED

Shipped and deployed. Cinema reinstalled from the hosted registry and dropped its patch; poster
links now read `link "Carnival in Costa Rica 1947 · 5m"`. Original report below.

`registry/duck/ui/sticker-media-card.tsx`, the `StickerProgressTrack` at the bottom of the frame.

The component's own doc comment makes the right call — one link per tile, overlay takes no pointer
events, progress is "a readout, never a scrubber". But the readout is still a live
`role="progressbar"` **inside** the link, so its value is concatenated into the link's accessible
name. Every half-watched poster announced as:

> link "54.1842 Carnival in Costa Rica 1947 · 5m"

That `54.1842` is `aria-valuenow`. Same for the 100%-watched and 0% cases as soon as a value is
passed.

**Fix:** `aria-hidden` on the track inside the card. The caption already names the tile, and "how
far in" is not part of the link's name — if it should be announced at all it belongs in the name
itself (`aria-label="Kung Fu Panda 3, 54% watched"`), not as a nested widget. Patched locally that
way; marked `LOCAL FIX` in the file.

Worth a general rule in the docs too: `StickerProgressTrack` defaults to `aria-label="Progress"`,
which is correct standalone and wrong nested inside another interactive element. A line on the
component page — "inside a link or button, pass `aria-hidden`" — would cover the media card, the
carousel slide and anything else that wraps it.

### R2.2 `registry:file` targets land in `src/` on a Vite project — FIXED

`"target": "~/public/duck.svg"` is the right spelling: on reinstall the CLI wrote `public/duck.svg`
at the project root of a Vite app, and `/duck.svg` resolves. Original report below.

`duck-spinner`'s `{ "path": "public/duck.svg", "target": "public/duck.svg" }` is exactly right for
Next. On a Vite app with `aliases.components = "@/components"` the CLI resolved it against the
alias root and wrote **`src/public/duck.svg`**, which Vite does not serve — so `/duck.svg` 404s and
the spinner renders two rings around nothing. Had to move the file by hand.

Not necessarily duck/ui's bug (the CLI decides), but duck/ui is what ships the file, so it is the
one that gets the bug report. Either a note on the install page ("Vite users: move
`src/public/duck.svg` to `public/`") or `"target": "/public/duck.svg"` — a leading slash is how
shadcn spells "from the project root" — would close it. Worth testing which one the current CLI
honours before committing to the docs.

The switch from PNG to SVG was the right call, by the way, and the reason is worth keeping in the
comment where it is: the CLI inlines registry files as text, so a raster asset arrives corrupt.

### R2.3 `@duck/theme` resets `--font-display` on every install — DOCUMENTED, WORKING AS DESIGNED

The theme now ships `font-sans` and `font-display`, which fixes the silent-inert-class problem.
Consequence for a consumer who overrides them with real faces: any later
`shadcn add @duck/theme` — including as a resolved `registryDependencies` of some other component —
rewrites both back to the system stack. It is a two-line re-fix, but it is silent and it looks like
"the fonts randomly broke". Cinema now carries a comment next to the override saying exactly that.

Now written up at `/docs/theming#type`, which is the right resolution — the theme owning the tokens
is what makes them overridable at all. Cinema's `src/index.css` carries a comment pointing there.

### Also: the deploy is the gate — DONE

`duckui.davideghiotto.it/r/registry.json` now serves 42 items and both R2 fixes are in the served
JSON, so `bunx shadcn add @duck/<name>` works against the hosted URL. Cinema is installed from it
and no longer needs the local-file workaround.

## What worked without a note

Recording this because a gap list reads more negative than the experience was. Dropped in and
needed nothing: `HoloBadge` (the transcode indicator earns `variant="holo"` exactly once per
screen), `GlowInput` + `GlowField`, `StickerKbd` with `watch` (the keycap depressing on the real
keystroke is the kind of detail that sells a system), `HoloAvatar ring="foil"`, `HoloSeparator`,
`QuackToast`, `EmptyPond`, `DuckSpinner`, and `QuackButton`'s `state` machine — the sign-in button
going `idle → loading → error` with `errorLabel="Try again"` replaced a spinner, a disabled prop
and an error paragraph with one component.

The one-holo-per-viewport rule also turned out to be genuinely useful as a design constraint rather
than a style note: it decided, on every screen, which single action mattered — Play on the hero,
Resume on the detail page, sign-in on the login card.
