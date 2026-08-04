# The block layer

**4 August 2026.** Twelve new blocks, one new prop, and the end of the four migration reports.

61 UI items and 5 blocks. That ratio was the problem: the blocks imported eleven of those
sixty-one components, so fifty of them had shipped without ever being assembled into the shape they
were built for. `StickerOtp` had no sign-in card. `DuckViewport` — the whole point of the
knowledge-app release — had no editor around it. `QuackBubble`, `DuckThinking` and `StreamText`
shipped together and never appeared in the same file. The parts were the easy half; every app built
on this registry then wrote the joins by hand, and the joins are where the decisions live.

This release is those joins. Nothing here is breaking, nothing changes an existing component's
defaults, and one component gained a prop.

## The one component change

**`GlowColor` now reports a pick.** An eyedropper pick reported through `onValueChange`, the same
channel as the swatch, which is right for the *value* and leaves the *act* unobservable — and the
hand-rolled eyedroppers this component replaces also copied the picked hex to the clipboard, which is
a large part of why a design tool has one. A clipboard write on `onValueChange` would fire on every
frame of a swatch drag. `onPick` fires in addition, only for a screen pick, after `onValueChange`, so
a controlled parent has already re-rendered when the pick handler runs. The existing signature is
untouched. Beyond the clipboard, a pick is the one colour change that is a deliberate single act
rather than a drag, which makes it the natural undo boundary and history entry.

That closes [editor-app-gaps.md](../feature-requests/editor-app-gaps.md) §5.1 — the last open item
across all four migration reports.

## The application blocks

**`@duck/duck-workbench`** is the editor shell the instrument-panel release was built for: an
icon tool rail, a pan-and-zoom canvas, an inspector, a status strip. Three joins, all of them
decisions. The zoom controls are a *sibling* of the viewport, never a child, because a child sits
inside the transform and pans away with the content. The zoom read-out is written to the DOM rather
than rendered — `DuckViewport` writes its transform straight to `element.style` so a pan costs no
React renders, and piping `onTransformChange` into `setState` to print "140%" hands all of that back
— and it is `aria-live="off"`, since a percentage that changes on every frame of a wheel gesture is
not an announcement. The dot grid lives *inside* the transform because it is the paper; pinned to the
frame it reads as a background photo of a grid the moment anything moves.

**`@duck/duck-chat-thread`** joins the transcript, the wait state and the composer. It follows the
stream only while the reader is already at the bottom — always scrolling makes a thread unreadable
while it streams, never scrolling makes the reader chase it — so there is a jump button rather than a
timer that takes the scroll position back. The transcript is a polite `role="log"` and the streaming
bubble is `aria-live="off"` with `aria-busy`, because a live region around a token stream re-announces
the whole message on every token. The composer is one surface: the textarea takes `frame={false}` and
the row carries the edge and the focus glow, which is the case that prop exists for.

**`@duck/duck-list-view`** is the admin list and the four states its data can be in. The one worth
naming: empty and no-matches are different screens. "Nothing here yet" is an invitation and wants an
action; "nothing matched hedgehog" is a dead end and wants the query cleared. Conflating them is how a
list holding 400 rows tells someone to create their first one. It also keeps two states for one field
— what the reader typed drives the input, the debounced query drives everything else — and puts the
live region on the count, so typing a word is one announcement instead of six. Sorting compares
`values`, never cells, because comparing JSX sorts by nothing.

**`@duck/duck-settings-panel`** is the registry's first form block, and the interesting half is
labelling. A block cannot mint an id for a control it does not own, so a row *is* a `<label>` and the
association is implicit. A row whose control is plural cannot work that way — a label may only point
at one field — so `labelling="group"` makes the row a `role="group"` named by its own label. An id for
our own label is fine; an id for the caller's control is not.

**`@duck/duck-auth-card`** finally uses `StickerOtp`, which had shipped unused. Focus follows the
step, because swapping a form's contents leaves focus on a button that no longer exists;
`autoComplete="one-time-code"` is what makes iOS offer the SMS code, and it works precisely because
the strip is one real input under six cells. One verification fires per code, since a paste that
completes the strip and a press of the button are the same intent. Resend owns its cooldown.

**`@duck/duck-upload`** puts a queue behind `StickerDrop`. The block owns the queue and you own the
transport: `onUpload` is handed an `onProgress` callback and an `AbortSignal`, which are the two things
a transport has to be given rather than asked for. Concurrency is capped, retry reuses the same `File`,
cancel actually aborts, unmount aborts what is still open, and a row starts exactly once — an effect
that runs twice must not upload twice. An abort is a decision, not a failure, so the row says
*Canceled* and offers retry instead of turning red.

## The media blocks

**`@duck/duck-media-shelf`** builds rows of artwork from one array. One tile width for the whole wall,
published as a CSS variable, because a row that sizes slides with a `basis` per breakpoint drifts from
the row under it the first time someone edits one of them. Skeletons take the tile's own aspect ratio
rather than `shape="poster"` — the ratio is a runtime value here, and a placeholder in the wrong shape
jumps when the artwork lands. Two empty states: the pond for an empty library, one line of muted text
for an empty row, because the alternative is four ducks on one screen.

**`@duck/duck-player-bar`** docks the transport. The play button sits in a fixed middle grid column, so
it does not slide as the track title changes length. The elapsed read-out follows the drag rather than
the playhead, matching `DuckMediaSlider`'s own rule that the slider authors the value while a scrub is
in flight. Digits for the eye, words for the ear: the label shows `1:04`, `aria-valuetext` says "1
minute 4 seconds of 3 minutes 20 seconds". Play is an action, not a toggle — icon and label swap, never
`aria-pressed`. Shortcuts are opt-in and never fire from a text field.

## The marketing blocks

**`@duck/duck-faq`** renders the section and its `FAQPage` JSON-LD from one array, which is the reason
it is a component: an FAQ and its structured data drift the first time a question is reworded.
`collapsible` is native `<details>`, so the answers stay in the DOM open or closed, and the block ships
no client code.

**`@duck/duck-logo-wall`** sizes every logo by height alone — the one rule that makes a mixed set of
brand assets read as one line — and flattens brand colours to the foreground until a reader looks at
them. An item with no asset renders its name as a wordmark, which is the state a young registry's own
proof strip is actually in.

**`@duck/duck-cta-band`** closes a page. The holo budget is per viewport, not per page, so the band may
take the iridescent edge the hero already spent; what it may not do is put holo on the card *and* its
button, so a holo band flips its primary action to lime. `capture` is a plain `<form>` whose `action`
takes a URL or a server function, so it posts to an endpoint on Vite and to a server action on Next
without changing shape.

**`@duck/duck-changelog`** renders releases down the timeline spine. The anchor comes from the version,
slugified, never from `useId`, because the point of an entry is that someone can send
`/changelog#1-2-0` and land on it. Dates print in UTC: a formatter that follows the reader's zone
renders one string on the server and another in the browser, and that mismatch only appears for readers
a day away from you.

## Registry

Before this release: 61 UI items and 5 blocks, 69 items total. After: **61 UI items and 17 blocks**, 81
items in total. Blocks now compose 35 of the 61 UI items, up from 11.

`scripts/check-registry-sync.mjs` is still the check that `registry.json`, `lib/registry-docs.ts`, the
previews and the previews barrel agree.

## What a hand-managed install needs to know

No new package dependencies, and `@duck/theme` is unchanged. Every block resolves its own registry
dependencies through the CLI, so `npx shadcn add @duck/duck-workbench` pulls the viewport, the button
group, the HUD label and the button with it.

Two blocks lean on theme utilities that arrived earlier and are worth checking if your stylesheet is
hand-managed: `duck-chat-thread` uses `.duck-stream-edge`, and `duck-workbench` uses
`--ease-duck`. Both shipped with previous releases of `@duck/theme`.

## Upgrading

Nothing to migrate. `GlowColor` gains a prop and changes no behaviour: existing call sites keep
passing `onValueChange` and never see `onPick`.
