/**
 * One description of every registry item, used by the docs pages, the
 * command menu, the sidebar and the generated llms.txt. Change it here and
 * every surface follows.
 */

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface ComponentDoc {
  slug: string;
  title: string;
  summary: string;
  category: Category;
  /** npm packages the item pulls in. */
  dependencies?: string[];
  /** Other registry items it needs. */
  registryDependencies?: string[];
  exports: string[];
  props: PropDoc[];
  /** Usage rules worth stating on the page. */
  rules?: string[];
  client?: boolean;
}

export type Category =
  | "Actions"
  | "Surfaces"
  | "Display"
  | "Inputs"
  | "Navigation"
  | "Feedback";

export const categoryOrder: Category[] = [
  "Actions",
  "Surfaces",
  "Display",
  "Inputs",
  "Navigation",
  "Feedback",
];

export const components: ComponentDoc[] = [
  {
    slug: "quack-button",
    title: "Quack Button",
    summary:
      "A button with a full motion cycle: an idle animation while it waits, magnetic pull, a squash on press, and animated loading, success and error states.",
    category: "Actions",
    client: true,
    dependencies: ["class-variance-authority", "@radix-ui/react-slot", "lucide-react"],
    registryDependencies: ["@duck/theme", "@duck/duck-spinner", "@duck/use-holo-pointer"],
    exports: ["QuackButton", "quackButtonVariants"],
    props: [
      {
        name: "variant",
        type: '"primary" | "holo" | "outline" | "ghost" | "danger"',
        default: '"primary"',
        description: "Visual weight. Use holo for at most one button per screen.",
      },
      {
        name: "size",
        type: '"xs" | "sm" | "default" | "lg" | "icon-xs" | "icon-sm" | "icon"',
        default: '"default"',
        description:
          "Control height and padding. xs, icon-xs and icon-sm are the instrument scale a control rail runs on — 28px and 32px, with the radius stepped down to rounded-md and the icon to 14px, because rounded-lg on a small square reads as a circle with corners. For an exact 24px control take icon-xs and add size-6.",
      },
      {
        name: "idle",
        type: '"none" | "breathe" | "sheen" | "pulse" | "float"',
        default: '"none"',
        description:
          "Animation played while the button rests. One idle button per screen keeps the page calm.",
      },
      {
        name: "magnetic",
        type: "number",
        default: "0",
        description: "Maximum pull toward the pointer in px. 0 turns magnetism off.",
      },
      {
        name: "ripple",
        type: "boolean",
        default: "true",
        description: "Water ripple from the exact press point.",
      },
      {
        name: "state",
        type: '"idle" | "loading" | "success" | "error"',
        default: '"idle"',
        description:
          "Drives the transition. Loading also sets aria-busy and disables the button.",
      },
      {
        name: "markSrc",
        type: "string",
        default: "DUCK_MARK_SRC",
        description:
          "Image URL for the mark shown while loading. Defaults to /duck.svg, the mark duck-spinner brings with it.",
      },
      {
        name: "loadingIndicator",
        type: "React.ReactNode",
        description:
          "Replaces the mark entirely while loading — a lucide spinner, a themed glyph, or nothing. For themes with no mascot.",
      },
      {
        name: "loadingLabel",
        type: "string",
        description: "Replaces the label while loading.",
      },
      {
        name: "successLabel",
        type: "string",
        description: "Replaces the label on success.",
      },
      {
        name: "errorLabel",
        type: "string",
        description: "Replaces the label on error.",
      },
      {
        name: "asChild",
        type: "boolean",
        default: "false",
        description:
          "Render the child element instead of a button, for router links. Slot gets the child on its own, so the state icon, the pulse ring and the label swap do not apply.",
      },
    ],
    rules: [
      "One idle animation per screen. Two competing loops read as a broken page.",
      "Keep the label stable between idle and loading unless the wait is long enough to explain.",
      "State is controlled. Reset it to idle yourself once the work finishes.",
      "asChild is for navigation. It renders the child alone — no state icon, no pulse ring, no label swap — so keep state on a real button.",
    ],
  },
  {
    slug: "holo-button",
    title: "Holo Button",
    summary:
      "The signature CTA: an animated iridescent border on a plain button. No motion states, no pointer tracking, nothing to wire up.",
    category: "Actions",
    dependencies: ["class-variance-authority", "@radix-ui/react-slot"],
    registryDependencies: ["@duck/theme"],
    exports: ["HoloButton", "holoButtonVariants"],
    props: [
      {
        name: "variant",
        type: '"holo" | "primary" | "outline" | "ghost"',
        default: '"holo"',
        description: "holo is the iridescent border. primary is solid duck lime.",
      },
      {
        name: "size",
        type: '"sm" | "default" | "lg" | "icon"',
        default: '"default"',
        description: "Control height and padding.",
      },
      {
        name: "asChild",
        type: "boolean",
        default: "false",
        description: "Render the child element instead of a button, for links.",
      },
    ],
    rules: [
      "Reach for holo-button when you want the look and nothing else. Reach for quack-button when the button has work to report.",
      "Label typography is a theme decision, not a call-site one: family, weight, tracking, case and size come from --font-button, --weight-button, --tracking-button, --case-button and --text-button / --text-button-sm / --text-button-lg. Set them once and every button follows; a utility on one button still overrides them.",
      "The button emits data-variant and data-size, so a theme can reach a single variant from CSS — button[data-variant=\"outline\"]:hover — instead of hanging a class on every outline button.",
    ],
  },
  {
    slug: "copy-button",
    title: "Copy Button",
    summary:
      "Copies a string to the clipboard and confirms it. The check pops in, then the button returns to rest.",
    category: "Actions",
    client: true,
    dependencies: ["lucide-react"],
    registryDependencies: ["@duck/theme"],
    exports: ["CopyButton"],
    props: [
      { name: "value", type: "string", description: "The string written to the clipboard." },
      { name: "label", type: "string", default: '"Copy"', description: "Accessible label at rest." },
      {
        name: "copiedLabel",
        type: "string",
        default: '"Copied"',
        description: "Accessible label after a successful copy.",
      },
      {
        name: "errorLabel",
        type: "string",
        default: '"Copy failed"',
        description:
          "Announced, and shown on the icon, when the write is refused — plain HTTP, an embedded browser, a denied prompt.",
      },
      {
        name: "onCopied",
        type: "(value: string) => void",
        description: "Fires after the clipboard write resolves.",
      },
      {
        name: "onError",
        type: "(error: unknown) => void",
        description:
          "Fires with the rejection. The button can say the write failed; only the caller knows whether the answer is \"select the text and copy it manually\" or a toast.",
      },
    ],
    rules: [
      "It never claims a success it did not get. A refused write shows the cross, announces errorLabel and calls onError — the old behaviour was to swallow the rejection silently, which left a control that appears to do nothing.",
      "Clipboard access needs a secure context. Over plain HTTP, and in some embedded browsers, there is no clipboard to write to and no amount of retrying will produce one.",
    ],
  },
  {
    slug: "hud-chip",
    title: "Hud Chip",
    summary:
      "The interactive HUD label: nav items, row actions, a zoom cluster, retry, esc. HudLabel's instrument typography with a real button underneath.",
    category: "Actions",
    dependencies: ["class-variance-authority", "@radix-ui/react-slot"],
    registryDependencies: ["@duck/theme", "@duck/hud-label"],
    exports: ["HudChip", "hudChipVariants"],
    props: [
      {
        name: "variant",
        type: '"outline" | "ghost" | "primary"',
        default: '"outline"',
        description:
          "outline is the default chrome read. ghost is for a row dense enough that borders would be noise. primary is the one chip in a group that commits something.",
      },
      {
        name: "size",
        type: '"xs" | "sm" | "default"',
        default: '"default"',
        description:
          "24px, 28px or 36px. xs and sm drop the type to 10px and the icons to 12px with it — xs is the chip that fits a 32px list row.",
      },
      {
        name: "frame",
        type: "boolean",
        default: "true",
        description:
          "The die-cut edge on variant=outline. Off for a row action inside a surface that already has one.",
      },
      {
        name: "active",
        type: "boolean",
        default: "false",
        description:
          "Paints the current read and emits data-active. Visual only — pair it with aria-current, aria-pressed or aria-selected yourself.",
      },
      {
        name: "asChild",
        type: "boolean",
        default: "false",
        description:
          "Render the child element instead of a button: a next/link Link for a nav item. type and disabled are withheld, because neither applies to an anchor.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description:
          "Two or three words, plus any lucide icon — icons size themselves. An icon-only chip needs an aria-label.",
      },
    ],
    rules: [
      "Typography comes from the .hud utility that @duck/hud-label ships, not from classes in this file. Install that item or the chip renders as plain sans — and nothing here redeclares .hud, so the chip and a HudLabel beside it cannot drift apart.",
      'active is a paint job. A nav chip wants aria-current="page", a filter wants aria-pressed, a chip in a tablist wants aria-selected and the roving keyboard behaviour that goes with it — the same highlight means all three, so the component does not guess. Without one of them the state is invisible to a screen reader.',
      "It is a real button: Enter and Space fire it, disabled takes it out of the tab order. Under asChild it cannot be disabled, because an anchor cannot — remove the href instead.",
      "Chrome, not a call to action. Machine output — zoom, retry, esc, a route name — is a chip; anything with a sentence for a label, or that is the point of the screen, is a QuackButton.",
      "For a set of chips where exactly one is chosen, StickerToggleGroup already has the radiogroup semantics and the arrow keys. Reach for a row of HudChips when the items navigate rather than select.",
    ],
  },
  {
    slug: "sticker-card",
    title: "Sticker Card",
    summary:
      "The die-cut sticker: thick border, generous radius, soft glow. Optional iridescent ring, pointer tilt, corner ticks, a translucent surface and a corner that peels off the backing.",
    category: "Surfaces",
    client: true,
    dependencies: ["@radix-ui/react-slot"],
    registryDependencies: ["@duck/theme", "@duck/use-holo-pointer"],
    exports: [
      "StickerCard",
      "StickerCardHeader",
      "StickerCardTitle",
      "StickerCardDescription",
      "StickerCardContent",
      "StickerCardFooter",
    ],
    props: [
      {
        name: "holo",
        type: "boolean",
        default: "false",
        description: "Swap the solid border for the iridescent ring.",
      },
      {
        name: "tilt",
        type: "boolean",
        default: "false",
        description: "The card leans toward the pointer.",
      },
      {
        name: "peel",
        type: "boolean",
        default: "false",
        description: "A corner lifts off the backing on hover.",
      },
      {
        name: "ticks",
        type: "boolean",
        default: "false",
        description:
          "Four corner brackets in the accent colour, fading in on hover. Turns a rectangle into an instrument.",
      },
      {
        name: "glass",
        type: "boolean",
        default: "false",
        description:
          "Translucent surface — --glass over a --glass-blur backdrop filter — for panels sitting on artwork or a canvas.",
      },
      {
        name: "frame",
        type: "boolean",
        default: "true",
        description:
          "Draw the die-cut edge. Off for a card inside a card, or a panel whose container is already the frame — the fill, the radius and the padding stay, and holo has no border box left to paint its gradient into.",
      },
      {
        name: "asChild",
        type: "boolean",
        default: "false",
        description:
          "Render the child element instead of a div, for a whole-card link. Ticks and peel land inside the child.",
      },
    ],
    rules: [
      "Peel and tilt together is a lot. Pick one per card.",
      "In a grid of cards, at most one carries holo.",
      "glass needs something behind it. Over a flat canvas it only costs a compositing layer.",
    ],
  },
  {
    slug: "sticker-media-card",
    title: "Sticker Media Card",
    summary:
      "The poster, not the sleeve. Artwork fills the die-cut frame edge to edge, the caption sits outside it on the backing, and the whole tile is one focusable link.",
    category: "Surfaces",
    client: true,
    dependencies: ["@radix-ui/react-slot"],
    registryDependencies: ["@duck/theme", "@duck/sticker-progress"],
    exports: ["StickerMediaCard"],
    props: [
      { name: "src", type: "string", description: "Artwork URL. Loads lazily." },
      {
        name: "alt",
        type: "string",
        default: '""',
        description:
          "Alternative text. Used as the link name only when there is no title, since the caption would otherwise say it twice.",
      },
      {
        name: "aspect",
        type: '"2/3" | "16/9" | "1/1" | number',
        default: '"2/3"',
        description: "Frame ratio. A number is width / height.",
      },
      { name: "title", type: "React.ReactNode", description: "First line of the caption, below the frame." },
      {
        name: "subtitle",
        type: "React.ReactNode",
        description: 'Second caption line, for a year and a runtime: "2016 · 1h 35m".',
      },
      { name: "href", type: "string", description: "Where the tile goes. Inherited from the anchor." },
      {
        name: "asChild",
        type: "boolean",
        default: "false",
        description:
          "Render a router Link as the tile. Pass exactly one element child and no children of its own.",
      },
      {
        name: "overlay",
        type: "React.ReactNode",
        description:
          "Centred decoration that fades in with a scrim on hover and focus — a play badge. Takes no pointer events.",
      },
      {
        name: "progress",
        type: "number",
        description:
          "0 to 100. Draws StickerProgressTrack at size=\"sm\" along the bottom edge of the artwork, aria-hidden so its value stays out of the link's name.",
      },
      {
        name: "fallback",
        type: "string",
        description:
          "Text drawn on a gradient when src is missing or the image fails. Defaults to alt.",
      },
    ],
    rules: [
      "The tile is one link, so nothing inside it may be interactive. A play button in the frame doubles every tab stop in the grid and hides the real target.",
      "progress is a readout, not a scrubber. Seeking belongs to the player, not the poster. It is also aria-hidden — how far in belongs in the tile's own name, not in a nested progressbar.",
      "One aspect per shelf. Mixed ratios in the same row break the grid before they add anything.",
      "Give it href or asChild — a tile with neither is a box nobody can reach.",
    ],
  },
  {
    slug: "sticker-carousel",
    title: "Sticker Carousel",
    summary:
      "A strip of stickers peeled off the roll sideways. Native scroll-snap does the scrolling; the arrows grey out at each end, the fade paints only the side that is hiding something, and neither appears while the strip fits.",
    category: "Navigation",
    client: true,
    dependencies: ["lucide-react"],
    registryDependencies: ["@duck/theme"],
    exports: ["StickerCarousel"],
    props: [
      { name: "title", type: "React.ReactNode", description: "Heading above the track." },
      { name: "description", type: "React.ReactNode", description: "Line under the heading." },
      {
        name: "actions",
        type: "React.ReactNode",
        description: 'Extra content in the heading row, for example a "See all" link.',
      },
      {
        name: "label",
        type: "string",
        description:
          "Accessible name for the track. Falls back to title when that is a string.",
      },
      {
        name: "controls",
        type: '"edge" | "header" | "none"',
        default: '"edge"',
        description:
          "Arrows floating over the track edges, in the heading row, or not at all.",
      },
      {
        name: "gap",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        description: "Space between slides, 8px through 24px.",
      },
      {
        name: "peek",
        type: "boolean",
        default: "false",
        description:
          "Pad the track so slides peek in from the edge instead of touching it. Scroll padding moves with it, so snapping still lands flush.",
      },
      {
        name: "page",
        type: "number",
        default: "0.85",
        description:
          "Share of the visible width one arrow press or key travels. Under 1 so a partly seen slide stays on screen as the anchor.",
      },
      {
        name: "fade",
        type: "boolean",
        default: "true",
        description: "Fade the edge that still has content behind it.",
      },
    ],
    rules: [
      "Direct children are the slides. The track pins them to shrink-0 and snap-start, so all a slide has to bring is a width.",
      "Arrow state comes from the scroll position, not from a slide index: a scroll listener plus a ResizeObserver on the track and every slide, so late-loading artwork cannot leave a dead arrow behind.",
      "Nothing here is arrow-only. The track is focusable, arrows and PageUp/PageDown page it, Home and End go to the ends — which is also why tabIndex has to stay on it.",
      "The fade is a mask on the track, so it works on any surface. It would also eat the track's own focus ring, so the ring is drawn on the viewport around it.",
      "RTL is read from the computed direction and scrollLeft is treated as negative-going, per the current spec. Legacy WebKit, where RTL started at scrollWidth, is not handled.",
    ],
  },
  {
    slug: "code-window",
    title: "Code Window",
    summary:
      "A code block in a window frame, with a filename, an optional copy control and optional line numbers. Accepts plain text or pre-highlighted markup.",
    category: "Surfaces",
    registryDependencies: ["@duck/theme", "@duck/copy-button"],
    exports: ["CodeWindow"],
    props: [
      { name: "title", type: "string", description: "Filename shown in the window bar." },
      {
        name: "html",
        type: "string",
        description:
          "Pre-highlighted markup, for example from Shiki. Takes precedence over children.",
      },
      {
        name: "copyValue",
        type: "string",
        description: "Shows a copy control that writes this string.",
      },
      {
        name: "lineNumbers",
        type: "boolean",
        default: "false",
        description: "Number each line. Needs markup that wraps lines in .line.",
      },
      {
        name: "holo",
        type: "boolean",
        default: "false",
        description: "Iridescent frame instead of the solid border.",
      },
    ],
  },
  {
    slug: "code-snippet",
    title: "Code Snippet",
    summary:
      "A code block that highlights itself, wears one of six color schemes and exports itself as a PNG. Local highlighter, so there is no async theme load and no flash of unstyled code.",
    category: "Surfaces",
    client: true,
    dependencies: ["lucide-react"],
    registryDependencies: ["@duck/theme", "@duck/copy-button"],
    exports: ["CodeSnippet", "codeSnippetSchemes"],
    props: [
      { name: "code", type: "string", description: "The source to render. Required." },
      {
        name: "lang",
        type: '"auto" | "tsx" | "ts" | "jsx" | "js" | "json" | "jsonc" | "css" | "html" | "bash" | "python" | "sql" | "yaml" | "diff" | "text"',
        default: '"auto"',
        description:
          "Grammar to color with. Auto reads the extension in title first, the shape of the code second.",
      },
      {
        name: "title",
        type: "string",
        description: "Filename in the header bar. Also names the exported PNG.",
      },
      {
        name: "scheme",
        type: '"duck" | "pond" | "sunset" | "neon" | "paper" | "mono"',
        default: '"duck"',
        description:
          "Syntax palette. Each one carries a light and a dark set, picked by the page theme.",
      },
      {
        name: "frame",
        type: '"sticker" | "holo" | "plain"',
        default: '"sticker"',
        description: "Border treatment: 3px sticker edge, iridescent, or a hairline.",
      },
      {
        name: "chrome",
        type: '"dots" | "plain" | "none"',
        default: '"dots"',
        description:
          "Header bar: traffic lights, bar without them, or no bar — where the controls float in on hover instead.",
      },
      { name: "lineNumbers", type: "boolean", default: "true", description: "Number the gutter." },
      {
        name: "startLine",
        type: "number",
        default: "1",
        description: "First line number, for excerpts that begin mid-file.",
      },
      {
        name: "highlight",
        type: "string | number[]",
        description: 'Lines washed with the accent color: "3,7-9" or [3, 7, 8, 9].',
      },
      {
        name: "wrap",
        type: "boolean",
        default: "false",
        description: "Wrap long lines instead of scrolling them.",
      },
      {
        name: "maxLines",
        type: "number",
        description: "Collapse to this many lines behind a show-all control.",
      },
      {
        name: "languageBadge",
        type: "boolean",
        default: "true",
        description: "Show the language in the header bar.",
      },
      {
        name: "copyable",
        type: "boolean",
        default: "true",
        description: "Copy control for the code itself.",
      },
      {
        name: "onCopied",
        type: "(value: string) => void",
        description: "Fires after the code reaches the clipboard.",
      },
      {
        name: "onCopyError",
        type: "(error: unknown) => void",
        description:
          "The clipboard refused — plain HTTP, an embedded browser, a denied prompt. The block already tells the reader to select the code instead; this is for a page that wants to say more.",
      },
      {
        name: "exportable",
        type: "boolean",
        default: "true",
        description:
          "PNG controls: download, plus copy-to-clipboard where the browser allows an image write.",
      },
      {
        name: "schemePicker",
        type: "boolean",
        default: "false",
        description: "Let the reader switch scheme. The scheme prop stays the starting point.",
      },
      {
        name: "wrapToggle",
        type: "boolean",
        default: "false",
        description: "Let the reader turn wrapping on and off.",
      },
      {
        name: "exportScale",
        type: "number",
        default: "2",
        description: "Pixel density of the PNG, clamped to 1–4.",
      },
      {
        name: "exportBackdrop",
        type: '"holo" | "scheme" | "none"',
        default: '"holo"',
        description:
          "What sits behind the card in the PNG: a gradient cut from the scheme, a flat wash, or nothing.",
      },
      {
        name: "watermark",
        type: "string",
        description: "Small credit painted into the PNG only, never on screen.",
      },
      {
        name: "fileName",
        type: "string",
        description: "Override the download name. Defaults to a slug of title.",
      },
    ],
    rules: [
      "The PNG is always the whole snippet at full width. Collapsing and wrapping are reading aids on screen, not part of the export.",
      "Syntax colors are the one place duck/ui uses raw values instead of semantic tokens — a syntax palette is data, the same way a Shiki theme is. Everything around the code stays on the theme.",
      "The highlighter is a scanner, not a parser. It covers the languages listed under lang convincingly; for an MDX pipeline or an exotic grammar, highlight with Shiki on the server and hand the markup to code-window instead.",
      "One holo element per viewport still applies: frame=\"holo\" competes with every other iridescent thing on the page.",
      "The clipboard image control only appears where the browser can write an image (not Firefox). Download works everywhere.",
    ],
  },
  {
    slug: "terminal",
    title: "Terminal",
    summary:
      "A command line that types itself. It waits until it scrolls into view, so the demo is never already over by the time it is seen.",
    category: "Surfaces",
    client: true,
    registryDependencies: ["@duck/theme"],
    exports: ["Terminal"],
    props: [
      {
        name: "lines",
        type: "{ prompt?: string; text: string; output?: string }[]",
        description: "Commands to type, each with optional output printed underneath.",
      },
      { name: "title", type: "string", default: '"bash"', description: "Window bar label." },
      { name: "prompt", type: "string", default: '"$"', description: "Default prompt character." },
      { name: "speed", type: "number", default: "34", description: "Milliseconds per character." },
      {
        name: "loop",
        type: "boolean",
        default: "false",
        description: "Replay from the top after a pause.",
      },
      { name: "holo", type: "boolean", default: "false", description: "Iridescent frame." },
    ],
    rules: [
      "Under prefers-reduced-motion the whole transcript renders at once.",
      "Keep transcripts under six lines. A terminal that types for a minute is a video, not a component.",
    ],
  },
  {
    slug: "sticker-sheet",
    title: "Sticker Sheet",
    summary:
      "Backing paper with kiss-cut lines. Lays out a set of components the way a vinyl sheet lays out stickers.",
    category: "Surfaces",
    registryDependencies: ["@duck/theme", "@duck/hud-label"],
    exports: ["StickerSheet", "StickerSheetCell"],
    props: [
      { name: "label", type: "string", description: "Small caption printed in the sheet margin." },
      {
        name: "span",
        type: "1 | 2 | 3",
        default: "1",
        description: "On StickerSheetCell: cell width in grid columns at lg and up.",
      },
    ],
  },
  {
    slug: "sticker-dialog",
    title: "Sticker Dialog",
    summary:
      "The sticker lifted off the page. Radix Dialog underneath, so the focus trap, scroll lock and aria wiring are real; duck supplies the frosted scrim and the rise into place. Width presets up to a full-bleed full.",
    category: "Surfaces",
    client: true,
    dependencies: ["@radix-ui/react-dialog", "lucide-react"],
    registryDependencies: ["@duck/theme"],
    exports: [
      "StickerDialog",
      "StickerDialogTrigger",
      "StickerDialogClose",
      "StickerDialogPortal",
      "StickerDialogOverlay",
      "StickerDialogContent",
      "StickerDialogHeader",
      "StickerDialogTitle",
      "StickerDialogDescription",
      "StickerDialogFooter",
    ],
    props: [
      {
        name: "size",
        type: '"sm" | "default" | "lg" | "full"',
        default: '"default"',
        description:
          "On StickerDialogContent: the width cap. full is a full-bleed panel — inset-0, no centring translate, and it scrolls itself.",
      },
      {
        name: "holo",
        type: "boolean",
        default: "false",
        description: "On StickerDialogContent: iridescent ring instead of the die-cut edge.",
      },
      {
        name: "hideClose",
        type: "boolean",
        default: "false",
        description:
          "Drop the built-in close button. Escape and the overlay still dismiss unless you intercept them too.",
      },
      {
        name: "closeLabel",
        type: "string",
        default: '"Close"',
        description: "Accessible name for the close button.",
      },
    ],
    rules: [
      "Always render a StickerDialogTitle. Radix warns without one, and a modal with no accessible name is announced as nothing.",
      "hideClose is for a blocking decision only — a dialog the user cannot leave except through your own buttons.",
      "No idle animation inside a dialog. It already interrupted the page; it does not also get to fidget.",
      'size="full" is a full-screen dialog, not a panel. Anchor a panel to an edge with StickerDrawer rather than pushing full around with class overrides.',
    ],
  },
  {
    slug: "sticker-drawer",
    title: "Sticker Drawer",
    summary:
      "The sticker slid in from the edge. Same Radix Dialog base as StickerDialog, anchored to any of the four sides, with the die-cut edge on the side that faces the content.",
    category: "Surfaces",
    client: true,
    dependencies: ["class-variance-authority", "@radix-ui/react-dialog", "lucide-react"],
    registryDependencies: ["@duck/theme"],
    exports: [
      "StickerDrawer",
      "StickerDrawerTrigger",
      "StickerDrawerClose",
      "StickerDrawerPortal",
      "StickerDrawerOverlay",
      "StickerDrawerContent",
      "StickerDrawerHeader",
      "StickerDrawerTitle",
      "StickerDrawerDescription",
      "StickerDrawerBody",
      "StickerDrawerFooter",
      "stickerDrawerVariants",
    ],
    props: [
      {
        name: "side",
        type: '"left" | "right" | "top" | "bottom"',
        default: '"right"',
        description:
          "On StickerDrawerContent: the edge it is anchored to. The die-cut edge, the inner radius and the slide all follow it.",
      },
      {
        name: "size",
        type: '"sm" | "default" | "lg" | "full"',
        default: '"default"',
        description:
          "Width on left and right; a ceiling on the height on top and bottom, so a short sheet stays short. full fills the axis and drops the radius.",
      },
      {
        name: "holo",
        type: "boolean",
        default: "false",
        description: "Iridescent edge instead of the solid die-cut one.",
      },
      {
        name: "hideClose",
        type: "boolean",
        default: "false",
        description:
          "Drop the built-in close button. Escape and the scrim still dismiss unless you intercept them too.",
      },
      {
        name: "closeLabel",
        type: "string",
        default: '"Close"',
        description: "Accessible name for the close button.",
      },
      {
        name: "open / onOpenChange",
        type: "boolean / (open: boolean) => void",
        description:
          "On StickerDrawer. Radix Dialog props — a drawer opened from a list row is almost always controlled.",
      },
    ],
    rules: [
      "Always render a StickerDrawerTitle. Radix warns without one, and a modal with no accessible name is announced as nothing.",
      "Put the scrolling content in StickerDrawerBody. The panel is as tall as the viewport, so the overflow has to belong to an element the header and footer sit outside of.",
      "The edge is on the side facing the content, and there is no radius against the viewport edge. Do not add one back — a rounded outer corner shows the page through the gap.",
      "Use a drawer for a place, a dialog for a decision. If the panel exists to ask one question, StickerDialog is the smaller thing.",
      "Under reduced motion the theme collapses both animation durations, so the panel appears in place. Do not swap the keyframes for a transition to get that; it is already handled.",
    ],
  },
  {
    slug: "sticker-popover",
    title: "Sticker Popover",
    summary:
      "A panel anchored to its trigger, on Radix Popover, with the die-cut edge and the glow. Exports STICKER_SURFACE so a stock shadcn menu can wear the same edge.",
    category: "Surfaces",
    client: true,
    dependencies: ["@radix-ui/react-popover"],
    registryDependencies: ["@duck/theme"],
    exports: [
      "StickerPopover",
      "StickerPopoverRoot",
      "StickerPopoverTrigger",
      "StickerPopoverContent",
      "StickerPopoverClose",
      "StickerPopoverAnchor",
      "STICKER_SURFACE",
    ],
    props: [
      {
        name: "content",
        type: "React.ReactNode",
        description:
          "The panel. Anything too big for a tooltip that does not warrant a dialog.",
      },
      {
        name: "side",
        type: '"top" | "right" | "bottom" | "left"',
        default: '"bottom"',
        description: "Preferred side. Radix flips it when there is no room.",
      },
      {
        name: "align",
        type: '"start" | "center" | "end"',
        default: '"center"',
        description:
          "Alignment along that side. Use start when the panel is wider than its trigger.",
      },
      {
        name: "sideOffset",
        type: "number",
        default: "10",
        description: "Pixels between trigger and panel. Room for the arrow.",
      },
      {
        name: "arrow",
        type: "boolean",
        default: "true",
        description: "Draw the pointer back at the trigger.",
      },
      {
        name: "holo",
        type: "boolean",
        default: "false",
        description: "Iridescent ring instead of the solid die-cut edge.",
      },
      {
        name: "contentClassName",
        type: "string",
        description: "Sizing for the panel, which is w-72 and p-4 until told otherwise.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description:
          "The control that opens it. Rendered as the trigger, so it must forward props.",
      },
    ],
    rules: [
      "A popover is not a menu: no roving focus, no typeahead, no menuitem roles. Every control inside is its own tab stop. For exclusive choices use StickerToggleGroup; for a real menu use shadcn DropdownMenu.",
      'To make a stock shadcn overlay match the edge, append the exported recipe: `className={cn(STICKER_SURFACE, "p-1")}` on DropdownMenuContent, SelectContent or PopoverContent. It carries radius, fill, the 3px border and the glow, and nothing geometric — padding and width stay with the component being restyled.',
      "STICKER_SURFACE is what StickerPopoverContent itself wears, so the documented recipe cannot drift from the component.",
      "The all-in-one StickerPopover is a trigger and a panel. Compose the parts when the panel needs its own close button, an anchor that is not the trigger, or a controlled open.",
      "The panel rises into place on the top and bottom sides and only fades on the left and right; both directions end at the resting state, so reduced motion shows the panel in place rather than frozen mid-arrival.",
    ],
  },
  {
    slug: "video-card",
    title: "Video Card",
    summary:
      "A YouTube card that stays cheap until it is wanted. The player only mounts on click, so a page full of these costs nothing on load.",
    category: "Surfaces",
    client: true,
    dependencies: ["lucide-react"],
    registryDependencies: ["@duck/theme"],
    exports: ["VideoCard"],
    props: [
      { name: "videoId", type: "string", description: "The part of the URL after v=." },
      { name: "title", type: "string", description: "Card heading and iframe title." },
      { name: "channel", type: "string", description: "Line under the title." },
      { name: "duration", type: "string", description: 'Runtime label, for example "12:04".' },
      { name: "thumbnail", type: "string", description: "Override the default YouTube poster." },
      {
        name: "href",
        type: "string",
        description:
          "Navigate here instead of mounting the player. The play glyph becomes an out arrow.",
      },
      {
        name: "target",
        type: "string",
        default: '"_blank"',
        description: "Link target in href mode.",
      },
      {
        name: "rel",
        type: "string",
        default: '"noopener"',
        description:
          "Link rel in href mode. noopener without noreferrer, so the destination can still credit the visit.",
      },
      {
        name: "onClick",
        type: "React.MouseEventHandler",
        description:
          "Fires on the play button, or on the link in href mode. Call preventDefault to keep the player from mounting.",
      },
      { name: "holo", type: "boolean", default: "false", description: "Iridescent frame." },
    ],
    rules: [
      "Use href when the click belongs to YouTube — an outbound click to track, a subscription to credit, a consent banner that forbids a third-party player. Use the embed when the video belongs to the page.",
    ],
  },
  {
    slug: "holo-avatar",
    title: "Holo Avatar",
    summary:
      "A die-cut avatar sticker. The foil ring picks up the pointer the way a real holographic sticker picks up a light source.",
    category: "Display",
    client: true,
    dependencies: ["class-variance-authority"],
    registryDependencies: ["@duck/theme", "@duck/use-holo-pointer"],
    exports: ["HoloAvatar", "HoloAvatarGroup", "avatarVariants"],
    props: [
      { name: "src", type: "string", description: "Image URL." },
      { name: "alt", type: "string", default: '""', description: "Alternative text for the image." },
      {
        name: "fallback",
        type: "string",
        description: "Initials shown when the image is missing or fails.",
      },
      {
        name: "size",
        type: '"xs" | "sm" | "default" | "lg" | "xl"',
        default: '"default"',
        description: "28px through 96px.",
      },
      {
        name: "shape",
        type: '"circle" | "sticker"',
        default: '"circle"',
        description: "sticker is a squircle with a slight tilt.",
      },
      {
        name: "ring",
        type: '"foil" | "holo" | "primary" | "none"',
        default: '"foil"',
        description: "foil tracks the pointer. holo is the static gradient.",
      },
      {
        name: "status",
        type: '"online" | "away" | "offline"',
        description: "Dot in the lower corner, announced to screen readers.",
      },
      {
        name: "max",
        type: "number",
        description: "On HoloAvatarGroup: how many avatars to show before a +N chip.",
      },
    ],
    rules: [
      "In a list of people, use ring=\"none\" and give the foil to the one avatar that matters.",
    ],
  },
  {
    slug: "holo-badge",
    title: "Holo Badge",
    summary: "A pill for status, counts and short labels.",
    category: "Display",
    dependencies: ["class-variance-authority", "@radix-ui/react-slot"],
    registryDependencies: ["@duck/theme"],
    exports: ["HoloBadge", "holoBadgeVariants"],
    props: [
      {
        name: "variant",
        type: '"holo" | "primary" | "outline" | "muted" | "success" | "danger"',
        default: '"holo"',
        description: "Pick by meaning, not by contrast.",
      },
      {
        name: "shape",
        type: '"pill" | "tag" | "block"',
        default: '"pill"',
        description:
          "pill is fully round, for a status or a count. tag follows the radius scale, so it squares off with the rest of the theme. block is the rail-wide status strip: full width, centred, its own line.",
      },
      {
        name: "asChild",
        type: "boolean",
        default: "false",
        description:
          "Render the child element instead of a span, for a badge that is semantically a heading, a <dd> or a link.",
      },
    ],
    rules: [
      "A status is a pill. A tag is a tag: rounded-full is 9999px and ignores --radius, so a square-cornered theme needs shape=\"tag\" rather than a rounded-none on every call site.",
      "A badge that fills its rail is shape=\"block\", not a tag plus w-full justify-center. Same decision as pill against tag, and it was being rewritten at every call site.",
      "Typography comes from --font-badge, --weight-badge, --tracking-badge, --case-badge and --text-badge. The badge also emits data-variant and data-shape for CSS that needs to reach one of them.",
    ],
  },
  {
    slug: "hud-label",
    title: "Hud Label",
    summary:
      "The instrument-panel label: tiny, mono, uppercase, tracked wide enough to read as machine output rather than prose.",
    category: "Display",
    dependencies: ["class-variance-authority", "@radix-ui/react-slot"],
    registryDependencies: ["@duck/theme"],
    exports: ["HudLabel", "hudLabelVariants"],
    props: [
      {
        name: "tone",
        type: '"muted" | "foreground" | "primary" | "accent"',
        default: '"muted"',
        description:
          "Use primary for a live value, a section index or a status, and accent where the chrome is the system talking about itself.",
      },
      {
        name: "size",
        type: '"sm" | "default"',
        default: '"default"',
        description: "10px or 11px. Nothing larger — past that it stops reading as chrome.",
      },
      {
        name: "tracking",
        type: '"default" | "tight"',
        default: '"default"',
        description:
          "0.3em, or 0.18em for labels boxed inside a control where the width would push the layout around.",
      },
      {
        name: "dot",
        type: "boolean",
        default: "false",
        description:
          "Status square before the text, in the label's own colour. Decorative — keep the state in the label's own words too.",
      },
      {
        name: "dotTone",
        type: '"muted" | "foreground" | "primary" | "accent" | "destructive"',
        description:
          "Colour the dot against the text — a red dot on a muted row. Without it the dot follows the tone.",
      },
      {
        name: "asChild",
        type: "boolean",
        default: "false",
        description:
          "Render the child element instead of a span. A section heading in a control rail is a HUD label and is also an h3; this is how it can be both.",
      },
    ],
    rules: [
      "Label, not sentence. Two or three words; the tracking makes anything longer unreadable.",
      "Three ways in, and they are not interchangeable: the component when the label is the element, asChild when the element already exists and has semantics worth keeping, the .hud utility when the label is a property of something you are not otherwise touching — a <dt>, a <figcaption>, a table header. hudLabelVariants() on a heading was the old answer to the middle case; asChild is the one that cannot drift.",
      "The uppercase is a text-transform, so pass normal-case content and let the component shout.",
      "Only primary glows. Use dotTone rather than a [&>span] selector at the call site — a child selector in application code is a missing prop.",
    ],
  },
  {
    slug: "hud-code",
    title: "Hud Code",
    summary:
      "The inline citation chip: a monospace token inside a sentence, tinted with --primary so it reads as verifiable data rather than as a snippet of source.",
    category: "Display",
    dependencies: ["@radix-ui/react-slot"],
    registryDependencies: ["@duck/theme"],
    exports: ["HudCode"],
    props: [
      {
        name: "interactive",
        type: "boolean",
        default: "false",
        description:
          "Render a button instead of a code element, for a citation that runs a handler. Ignored under asChild — the child is already the control.",
      },
      {
        name: "asChild",
        type: "boolean",
        default: "false",
        description:
          "Render the child element: an anchor or a next/link Link, for a citation that has a URL.",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "The button form only. An anchor cannot be disabled.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description:
          "The token: a wikilink, a timecode, a record id. It is nowrap, so keep it short enough not to overhang the measure.",
      },
    ],
    rules: [
      "A citation and a code span are different things. DuckProse's neutral --muted chip is right for a snippet of source; this is for the token the reader is meant to be able to verify, which is why it is the primary colour and not grey.",
      "Restyling prose internals: every DuckProse rule is wrapped in :where() and therefore has zero specificity, so one plain class on the element beats all of it with no !important anywhere. Map the tag once and render your own component — with react-markdown that is `components={{ code: ({ children }) => <HudCode>{children}</HudCode> }}`, or `<HudCode asChild><a href={hrefFor(children)}>{children}</a></HudCode>` when the citation resolves to a URL.",
      "It cannot move the line it sits in, and that is load-bearing: 0.875em with the leading collapsed keeps its box under the paragraph's strut, and padding and border on an inline box never enter the line box at all. The hover state is fill and border only — transform does not apply to inline boxes, and going inline-block to allow one would put the padding back into the line.",
      "Inline only. A block of source is a pre, which DuckProse already styles; a HudCode around one would tint the whole block primary.",
      'The interactive forms drop the code element rather than nesting one inside the control: a nested code would be caught by DuckProse\'s own code rule and need three utilities to undo, and "button, tape at 12:04" is a more useful announcement than a wrapper most screen readers never mention. If the token really is source, leave it non-interactive.',
    ],
  },
  {
    slug: "announcement",
    title: "Announcement",
    summary:
      "A pill banner for one piece of news. A light sweeps across it on a slow loop so it reads as live without demanding attention.",
    category: "Display",
    dependencies: ["lucide-react"],
    registryDependencies: ["@duck/theme"],
    exports: ["Announcement"],
    props: [
      { name: "tag", type: "string", description: 'Short label in the leading chip, for example "new".' },
      { name: "href", type: "string", description: "Turns the banner into a link." },
      {
        name: "arrow",
        type: "boolean",
        default: "href ? true : false",
        description: "Trailing arrow that slides on hover.",
      },
    ],
  },
  {
    slug: "duck-spinner",
    title: "Duck Spinner",
    summary:
      "The duck/ui logo paddling on water, with the wake as expanding rings. The mark is served from your own public folder; point src at any image URL to spin something else.",
    category: "Display",
    registryDependencies: ["@duck/theme"],
    exports: ["DuckSpinner", "DuckGlyph", "DUCK_MARK_SRC"],
    props: [
      { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "20px, 32px or 48px." },
      {
        name: "src",
        type: "string",
        default: "DUCK_MARK_SRC",
        description:
          "Mark image. Any remote URL, /public path or data URI. Defaults to /duck.svg — the duck/ui mark the item ships into your own public folder.",
      },
      {
        name: "motion",
        type: '"paddle" | "spin"',
        default: '"paddle"',
        description: "paddle rocks the mark side to side, spin rotates it a full turn.",
      },
      {
        name: "label",
        type: "string",
        default: '"Loading"',
        description: "Screen-reader text. The spinner is a live region.",
      },
    ],
    rules: [
      "The default mark is same-origin, so the loading path survives offline use and an img-src 'self' policy. A custom src has to be reachable from the browser and allowed by your CSP.",
      "To rebrand every loading state at once — spinner, QuackButton, QuackToast — edit DUCK_MARK_SRC in duck-spinner.tsx rather than passing src at each call site.",
    ],
  },
  {
    slug: "holo-separator",
    title: "Holo Separator",
    summary:
      "A hairline that fades in from the edges. With a label it becomes a section break.",
    category: "Display",
    registryDependencies: ["@duck/theme", "@duck/hud-label"],
    exports: ["HoloSeparator"],
    props: [
      { name: "label", type: "string", description: "Centered caption between two rules." },
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "Vertical stretches to the height of its flex parent.",
      },
      { name: "holo", type: "boolean", default: "false", description: "Iridescent rule." },
    ],
  },
  {
    slug: "glow-input",
    title: "Glow Input",
    summary:
      "Text input, textarea and two field wrappers that wire up label, helper text and errors so the control stays accessible.",
    category: "Inputs",
    registryDependencies: ["@duck/theme"],
    exports: [
      "GlowInput",
      "GlowTextarea",
      "GlowField",
      "GlowFieldset",
      "GLOW_FIELD_BASE",
      "GLOW_FIELD_FRAME",
      "GLOW_FIELD_BARE",
    ],
    props: [
      { name: "label", type: "string", description: "On GlowField: visible label above the control." },
      {
        name: "legend",
        type: "string",
        description: "On GlowFieldset: names the whole group. Keep it short — it is read before every control inside.",
      },
      { name: "helper", type: "string", description: "Persistent hint below the control or group." },
      {
        name: "error",
        type: "string",
        description: "Replaces the helper, sets aria-invalid and role=alert.",
      },
      {
        name: "required",
        type: "boolean",
        default: "false",
        description: "Marks the control or group and adds the asterisk.",
      },
      {
        name: "frame",
        type: "boolean",
        default: "true",
        description:
          "On GlowInput and GlowTextarea: the sticker edge, the padding and the lime focus glow. Turn it off inside a surface that is already the frame — a composer, a toolbar search, an inline edit cell.",
      },
    ],
    rules: [
      "Never use the placeholder as the label. GlowField exists so you do not have to.",
      "GlowField wraps one control. For anything plural — a radio group, a range, an OTP strip, a dropzone — use GlowFieldset, which emits a real fieldset and legend.",
      "The reason is mechanical: GlowField clones its single child to inject the id, so the child has to be one element that accepts one. A label beside a slider, or any pair, gives <label htmlFor> nothing to point at — that is GlowFieldset's legend.",
      "frame={false} rather than border-0 at the call site: .sticker is declared in the theme's utilities layer, which lands after Tailwind's, so a border utility loses on order and the 3px edge stays.",
      "A frameless field keeps the type, the caret, the placeholder and the selection colours, and shows aria-invalid in the text instead of a border it no longer has. Give the parent the focus-within glow.",
      "The three class strings are exported for the same reason StickerPopover exports STICKER_SURFACE: a control that has to read as this field — GlowSelect's trigger, GlowColor's swatch, an editor's own composer — imports the recipe rather than copying it. A copy drifts the first time this file changes.",
    ],
  },
  {
    slug: "glow-search",
    title: "Glow Search",
    summary:
      "A search field rather than a text field: leading icon, a clear button, a ⌘K hint and a debounced onSearch.",
    category: "Inputs",
    client: true,
    dependencies: ["lucide-react"],
    registryDependencies: ["@duck/theme", "@duck/glow-input", "@duck/sticker-kbd"],
    exports: ["GlowSearch"],
    props: [
      {
        name: "value",
        type: "string",
        description: "Controlled query. Pair with onChange, as with any input.",
      },
      {
        name: "defaultValue",
        type: "string",
        default: '""',
        description: "Uncontrolled starting query.",
      },
      {
        name: "onSearch",
        type: "(value: string) => void",
        description:
          "The debounced query, after the typing stops. Hang the fetch or the filter off this one; onChange still fires per keystroke.",
      },
      {
        name: "debounce",
        type: "number",
        default: "250",
        description: "Milliseconds of quiet before onSearch fires. 0 fires on every keystroke.",
      },
      {
        name: "kbd",
        type: "ReactNode",
        description:
          'Keycap hint drawn in a StickerKbd while the field is empty — "⌘K", "/". A hint, not a binding: nothing global is registered here.',
      },
      {
        name: "placeholder",
        type: "string",
        default: '"Search"',
        description: "Also the fallback accessible name when nothing else names the field.",
      },
      {
        name: "clearLabel",
        type: "string",
        default: '"Clear search"',
        description: "Accessible name of the clear button.",
      },
      {
        name: "className",
        type: "string",
        description: "Styles the frame. Every other prop lands on the field.",
      },
      {
        name: "inputClassName",
        type: "string",
        description:
          "Styles the field inside the frame, for the rare case the type has to move.",
      },
    ],
    rules: [
      "onChange fires on every keystroke, onSearch once the typing stops. Put the query on onSearch — that is the whole reason the component exists.",
      "Typing debounces; Enter, Escape and the clear button flush. All three are decisions rather than keystrokes on the way to one, and Enter fires even if the timer already ran.",
      "Escape clears only when there is a value. On an empty field the key goes through to the dialog or palette above, so a search box inside one is never a trap.",
      "The ⌘K hint is a hint. This component registers no global listener — bind the shortcut where the palette lives, and print the key the platform actually uses (⌘ on Apple, Ctrl elsewhere, decided at runtime).",
      "The frame is on the wrapper and the field inside it is a frame={false} GlowInput, so the icon, the field and the clear button share one 3px edge and one focus glow. Do not nest it in another bordered box.",
      'Native type="search" for the searchbox role and the search return key on mobile; the WebKit cancel button is suppressed because the component draws its own clear.',
      'If this is the page\'s primary search, wrap it in a <search> element or a form with role="search". The component does not claim a landmark on its own — a filter box in a toolbar is not the site search.',
      "The clear button clears by dispatching a real input event, so a controlled consumer needs nothing beyond the onChange it already has, and focus goes back to the field.",
    ],
  },
  {
    slug: "glow-select",
    title: "Glow Select",
    summary:
      "The select the field family was missing: GlowInput's trigger, StickerPopover's menu, Radix Select's behaviour.",
    category: "Inputs",
    client: true,
    dependencies: ["@radix-ui/react-select", "lucide-react"],
    registryDependencies: [
      "@duck/theme",
      "@duck/glow-input",
      "@duck/sticker-popover",
      "@duck/hud-label",
    ],
    exports: [
      "GlowSelect",
      "GlowSelectRoot",
      "GlowSelectTrigger",
      "GlowSelectValue",
      "GlowSelectContent",
      "GlowSelectItem",
      "GlowSelectGroup",
      "GlowSelectLabel",
      "GlowSelectSeparator",
    ],
    props: [
      {
        name: "value",
        type: "string",
        description: "Controlled selection. Pair with onValueChange.",
      },
      {
        name: "defaultValue",
        type: "string",
        description: "Uncontrolled starting selection.",
      },
      {
        name: "onValueChange",
        type: "(value: string) => void",
        description: "Fires with the chosen item's value.",
      },
      {
        name: "placeholder",
        type: "string",
        description:
          "Shown until something is chosen, in the placeholder colour — the value is text the user did not type.",
      },
      {
        name: "size",
        type: '"sm" | "default"',
        default: '"default"',
        description:
          "sm is the 32px rail size, beside a slider row or an icon button.",
      },
      {
        name: "frame",
        type: "boolean",
        default: "true",
        description:
          "The sticker edge and the focus glow on the trigger. Off for a select that is a row action rather than a field.",
      },
      {
        name: "chevron",
        type: "boolean",
        default: "true",
        description: "Draw the chevron. Off for a trigger that is an icon and nothing else.",
      },
      {
        name: "contentClassName",
        type: "string",
        description:
          "Sizing for the menu. It matches the trigger's width until told otherwise; className styles the trigger.",
      },
    ],
    rules: [
      "The trigger wears GlowInput's exported class strings and the menu wears StickerPopover's exported STICKER_SURFACE. Both are imports, not copies, so a select next to a field cannot drift from it — which is what every hand-rolled local select eventually does.",
      "This is the one place duck breaks its own rule 7. A stock shadcn select beside a GlowInput reads as a different design system: 1px against the 3px die-cut edge, --radius-md against rounded-lg, no lime glow, and a menu made of other material.",
      "Radix rather than a native <select>, unlike DuckSwitch and DuckSlider: the option list of a native select is drawn by the OS and cannot take the die-cut edge, which is half of what this component is for. The hidden native select underneath still submits in a plain form.",
      "The open trigger keeps the glow through data-[state=open], because a pointer that opened the menu got focus but not focus-visible — without it the frame goes cold while its own menu is up.",
      "Inside GlowField, pass nothing extra: the id, aria-describedby and aria-invalid it clones onto its child land on the trigger.",
    ],
  },
  {
    slug: "glow-color",
    title: "Glow Color",
    summary:
      "A colour swatch that is a duck field rather than an OS widget, with the eyedropper beside it where the browser has one.",
    category: "Inputs",
    client: true,
    dependencies: ["lucide-react"],
    registryDependencies: ["@duck/theme", "@duck/glow-input"],
    exports: ["GlowColor", "normalizeHex"],
    props: [
      {
        name: "value",
        type: "string",
        description:
          "Controlled colour as #rrggbb. Shorthand and an alpha pair are accepted and normalised.",
      },
      {
        name: "defaultValue",
        type: "string",
        default: '"#000000"',
        description: "Uncontrolled starting colour.",
      },
      {
        name: "onValueChange",
        type: "(hex: string) => void",
        description:
          "The colour, always as #rrggbb. Fires for the swatch and for an eyedropper pick — wire this one.",
      },
      {
        name: "onPick",
        type: "(hex: string) => void",
        description:
          "Fires only for an eyedropper pick, after onValueChange. The clipboard write a hand-rolled eyedropper always had goes here — on onValueChange it would fire on every frame of a swatch drag.",
      },
      {
        name: "size",
        type: '"sm" | "default"',
        default: '"default"',
        description: "32px or 40px swatch. sm is the rail size.",
      },
      {
        name: "eyedropper",
        type: "boolean",
        default: "true",
        description:
          "Offer the screen picker where the browser has one. Chromium only, so the control appears after mount rather than on the server.",
      },
      {
        name: "showValue",
        type: "boolean",
        default: "false",
        description: "Print the hex beside the swatch in tabular mono.",
      },
      {
        name: "frame",
        type: "boolean",
        default: "true",
        description: "The sticker edge and the lime focus glow around the swatch.",
      },
      {
        name: "swatchClassName",
        type: "string",
        description: "Styles the swatch. className styles the row it sits in.",
      },
    ],
    rules: [
      "A picked colour has no DOM event behind it, so it reports through onValueChange. onChange stays the swatch's own native event, for a form that reads the input directly.",
      "A pick also reports through onPick, which the swatch never fires. That is the difference the value stream cannot carry: a pick is one deliberate act, a swatch change is a frame of a drag. Copy, undo boundaries and history entries belong on onPick.",
      "Values are normalised to #rrggbb before they reach the input, because input[type=color] accepts nothing else and renders anything else as black — which is how a #fff default becomes a black swatch with no error anywhere.",
      "There is no alpha channel. An eighth and ninth hex digit are dropped rather than half-honoured; if opacity matters, keep it in a separate control.",
      "The eyedropper is Chromium-only and the component says so by rendering it from a mounted effect. Do not gate it on a user agent string, and do not assume it is there.",
      "A rejected pick — Escape, a dismissed picker — is not an error and does not change the value.",
    ],
  },
  {
    slug: "duck-tabs",
    title: "Duck Tabs",
    summary:
      "Tabs with an indicator that slides between triggers. Arrows move, Home and End jump to the ends.",
    category: "Navigation",
    client: true,
    registryDependencies: ["@duck/theme"],
    exports: ["DuckTabs", "DuckTabsList", "DuckTabsTrigger", "DuckTabsContent"],
    props: [
      { name: "defaultValue", type: "string", description: "Uncontrolled starting tab." },
      { name: "value", type: "string", description: "Controlled active tab." },
      { name: "onValueChange", type: "(value: string) => void", description: "Fires on every change." },
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description:
          "vertical puts the list beside the panel: the indicator becomes a bar down the left edge, Up and Down move, and aria-orientation says so. The section rail a settings dialog wants at ≥640px.",
      },
      {
        name: "frame",
        type: "boolean",
        default: "true",
        description:
          "On DuckTabsList: the die-cut edge around the list. Off for a rail inside a panel that is already the frame.",
      },
    ],
    rules: [
      "The indicator is measured, not animated between fixed positions, so a label that changes width mid-life still lands right. It re-measures on the active value, on the children, and on a resize.",
      "A vertical rail drops the filled pill: covering labels of different lengths means sizing to the longest one, which is a block of colour rather than a marker. The active label carries the accent instead.",
    ],
  },
  {
    slug: "theme-switcher",
    title: "Theme Switcher",
    summary:
      "A three-way segmented control. The lime pill slides to the active option so the change reads as movement.",
    category: "Navigation",
    client: true,
    dependencies: ["next-themes", "lucide-react"],
    registryDependencies: ["@duck/theme"],
    exports: ["ThemeSwitcher"],
    props: [],
    rules: ["Needs a next-themes ThemeProvider above it with attribute=\"class\"."],
  },
  {
    slug: "quack-toast",
    title: "Quack Toast",
    summary:
      "Transient messages that slide in from the corner. The queue is capped so a burst of events never buries the page.",
    category: "Feedback",
    client: true,
    dependencies: ["lucide-react"],
    registryDependencies: ["@duck/theme", "@duck/duck-spinner"],
    exports: ["QuackToastProvider", "useQuackToast"],
    props: [
      {
        name: "max",
        type: "number",
        default: "3",
        description: "On QuackToastProvider: most toasts on screen at once.",
      },
      {
        name: "toast",
        type: "(options: ToastOptions) => void",
        description:
          "From useQuackToast. Takes title, description, variant, duration and markSrc — the image URL used by the quack variant's mark.",
      },
      { name: "quack", type: "() => void", description: "From useQuackToast. It quacks." },
      { name: "dismiss", type: "(id: number) => void", description: "From useQuackToast." },
    ],
    rules: [
      "Toasts never steal focus. Anything the user must act on belongs inline, not in a toast.",
    ],
  },
  {
    slug: "duck-switch",
    title: "Duck Switch",
    summary:
      "The duck entering the water: the track floods lime and one ripple spreads from the entry point.",
    category: "Inputs",
    client: true,
    registryDependencies: ["@duck/theme"],
    exports: ["DuckSwitch"],
    props: [
      {
        name: "size",
        type: "sm | default",
        default: "default",
        description: "Track size. Both keep a tap target of at least 24px.",
      },
      {
        name: "children",
        type: "ReactNode",
        description: "Visible label, rendered inside the <label>. Without one, pass an aria-label.",
      },
      {
        name: "checked / defaultChecked / onChange",
        type: "native",
        description: "It is an <input type=\"checkbox\">, so controlled and uncontrolled both work and it submits with the form.",
      },
    ],
    rules: [
      "The off state is drawn by the 3px border, never by the fill — a muted fill on a card is about 1.2:1 and disappears.",
      "Knob travel is longer than the knob is wide, so the state survives without colour.",
      "Space toggles natively. Enter is wired up too, per the ARIA switch pattern.",
    ],
  },
  {
    slug: "sticker-checkbox",
    title: "Sticker Checkbox",
    summary:
      "A kiss-cut square you apply: the tick lands from oversize with a squash and the box takes its vinyl edge in the same beat.",
    category: "Inputs",
    client: true,
    dependencies: ["lucide-react"],
    registryDependencies: ["@duck/theme"],
    exports: ["StickerCheckbox"],
    props: [
      {
        name: "indeterminate",
        type: "boolean",
        default: "false",
        description:
          "Partial selection. Assigned as a DOM property after render, because the attribute does nothing.",
      },
      {
        name: "children",
        type: "ReactNode",
        description: "Visible label. Without one, pass an aria-label.",
      },
      {
        name: "checked / defaultChecked / onChange",
        type: "native",
        description: "It is an <input type=\"checkbox\">, so it submits with the form.",
      },
    ],
    rules: [
      "The box draws at 20px and the tap target at 24px, so the die-cut look does not cost you WCAG 2.5.8.",
      "Inside a StickerCard with peel, the card clips its overflow — check the focus ring is not cropped.",
    ],
  },
  {
    slug: "sticker-radio-group",
    title: "Sticker Radio Group",
    summary:
      "A strip of kiss-cut cells where only the chosen sticker has been peeled off the backing.",
    category: "Inputs",
    client: true,
    registryDependencies: ["@duck/theme"],
    exports: ["StickerRadioGroup", "StickerRadio"],
    props: [
      {
        name: "name",
        type: "string",
        description: "On the group: shared radio name. Generated when omitted.",
      },
      {
        name: "value / defaultValue / onValueChange",
        type: "string",
        description: "On the group: controlled or uncontrolled selection.",
      },
      { name: "value", type: "string", description: "On StickerRadio: the option's value. Required." },
      {
        name: "description",
        type: "string",
        description: "On StickerRadio: second line, for when the label alone does not explain the choice.",
      },
    ],
    rules: [
      "Wrap it in a GlowFieldset. A radio group needs a group name and a legend is the only thing that reliably supplies one.",
      "Selection changes the border style, not only its colour, so the choice survives greyscale and forced colours.",
      "Arrow keys, roving tab order and the tabbable-when-empty rule are native radio behaviour. Do not reimplement them.",
    ],
  },
  {
    slug: "sticker-toggle-group",
    title: "Sticker Toggle Group",
    summary:
      "A segmented control cut from one strip of vinyl: the border belongs to the whole set and only the chosen panel takes the lime fill.",
    category: "Inputs",
    client: true,
    registryDependencies: ["@duck/theme"],
    exports: ["StickerToggleGroup", "StickerToggleGroupItem"],
    props: [
      {
        name: "type",
        type: '"single" | "multiple"',
        default: '"single"',
        description:
          "Single is a choice among options and renders a radiogroup of radios, so the reader announces \"2 of 4\". Multiple is a set of independent switches and renders a toolbar of aria-pressed buttons.",
      },
      {
        name: "value / defaultValue / onValueChange",
        type: "string | string[]",
        description:
          "Controlled or uncontrolled. A string in single mode, an array in multiple — the props are typed per mode, so onValueChange={setSort} still infers.",
      },
      {
        name: "size",
        type: '"sm" | "default"',
        default: '"default"',
        description: "Panel height and text size. sm is for a control bar above a grid.",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description:
          "On the group: disables every panel. Items take their own disabled too, and arrow keys skip both.",
      },
      {
        name: "value",
        type: "string",
        description: "On StickerToggleGroupItem: the panel's value. Required.",
      },
    ],
    rules: [
      "Give the group an aria-label. A radiogroup or a toolbar with no name is announced as an unnamed container, and the panels alone do not say what they sort.",
      "Single select never empties: clicking the chosen panel keeps it, exactly as a radio does. If \"none\" is a real answer, give it a panel.",
      "One tab stop for the whole set — arrows move inside it, Home and End jump to the ends, and both wrap. A toolbar of four costs one Tab, not four.",
      "Not a replacement for DuckTabs. Use this when the choice reorders or filters what is already on screen, tabs when it swaps the panel underneath.",
    ],
  },
  {
    slug: "duck-slider",
    title: "Duck Slider",
    summary:
      "The waterline: the filled track is water, the thumb floats on it, and letting go leaves a wake.",
    category: "Inputs",
    client: true,
    registryDependencies: ["@duck/theme"],
    exports: ["DuckSlider"],
    props: [
      {
        name: "value / defaultValue",
        type: "number",
        default: "0",
        description: "Controlled or uncontrolled. min, max and step pass straight through.",
      },
      {
        name: "formatValue",
        type: "(value: number) => string",
        description:
          "Feeds aria-valuetext. Without it a screen reader reads a bare integer, which is useless for anything but a percentage.",
      },
      {
        name: "showValue",
        type: "boolean",
        default: "false",
        description: "Print the formatted value, in tabular figures.",
      },
      {
        name: "valuePosition",
        type: '"above" | "row"',
        default: '"above"',
        description:
          "Where that value goes. row puts it at the end of the label row, right-aligned, so a dragging slider never reflows the row it sits in and forty of them stay a fixed height.",
      },
      {
        name: "label",
        type: "ReactNode",
        description:
          "The control's name, rendered as a real <label> tied to the input. Pass it and the label, the readout and action share one row.",
      },
      {
        name: "action",
        type: "ReactNode",
        description:
          "Trailing affordance on the label row — a reset button, a lock, a menu. Nothing is wired: it is your element.",
      },
      {
        name: "curve",
        type: '"linear" | "log"',
        default: '"linear"',
        description:
          "log maps position to value geometrically, for a font size running 12→400 or a scale running 0.05→8 where the useful half of a linear range is the first 15% of the track. Needs min > 0, and falls back to linear without one.",
      },
      {
        name: "onValueChange",
        type: "(value: number) => void",
        description:
          "The value, already mapped. This is the channel to wire on a log slider — the input's own valueAsNumber is a track position there.",
      },
    ],
    rules: [
      "No holo variant, on purpose. Settings pages have six sliders and the viewport has one holo budget.",
      "Single value. A two-thumb range is a different control — do not fake it with two of these.",
      "Pass formatValue whenever the number is not self-explanatory.",
      "On curve=\"log\" the component owns the mapping, so min, max and step stay honest: the input's min/max describe the track (0…1000 positions), step stays the grain of the value you receive, and aria-valuetext reports the real number rather than the position. Read the value from onValueChange, not from the event.",
      "A log slider still quantises to step, so the bottom of a wide range repeats values — 12px at two dozen adjacent positions on a 12→400 track. That is inherent to the mapping. What the component does about it is make one arrow press worth one step: it walks on in the direction of travel until the value actually changes, because a key that quantises back to the value you already had reads as broken.",
      "label makes the slider a labelled control on its own. Inside a GlowFieldset, leave it off and let the legend name the group — two names is worse than one.",
    ],
  },
  {
    slug: "duck-media-slider",
    title: "Duck Media Slider",
    summary:
      "The waterline along the edge of a film: a dimmer fill for what has loaded, a readout that runs ahead of the thumb, and a 4px dense line that only grows a duck when you reach for it.",
    category: "Inputs",
    client: true,
    registryDependencies: ["@duck/theme"],
    exports: ["DuckMediaSlider", "formatTimecode"],
    props: [
      {
        name: "value / defaultValue",
        type: "number",
        default: "0",
        description:
          "Playhead, in the same unit as min and max — seconds, normally. Ignored while a drag is in flight.",
      },
      {
        name: "buffered",
        type: "number",
        default: "0",
        description:
          "How much has loaded, as a fraction of the whole track from 0 to 1 — not a value in min..max, so buffered.end(buffered.length - 1) / duration drops straight in.",
      },
      {
        name: "preview",
        type: "(value: number) => ReactNode",
        description:
          "Readout that follows the pointer, and the keyboard, before commit. It returns a node, so a thumbnail fits where a timecode would go.",
      },
      {
        name: "dense",
        type: "boolean",
        default: "false",
        description:
          "4px track with the thumb on hover and focus only, for the bottom edge of a video. The default stays settings-panel sized.",
      },
      {
        name: "onScrub",
        type: "(value: number) => void",
        description:
          "Every step of a drag or key repeat, while the drag is still in flight. For a timecode readout, not for seeking.",
      },
      {
        name: "onSeek",
        type: "(value: number) => void",
        description:
          "Once, on pointer-up, key-up or blur. This is the one that moves the playhead.",
      },
      {
        name: "formatValue",
        type: "(value: number) => string",
        default: "formatTimecode",
        description:
          "Feeds aria-valuetext. Defaults to m:ss, because a bare number of seconds tells a listener nothing.",
      },
      {
        name: "min / max / step / disabled",
        type: "native",
        description:
          "It is an <input type=\"range\">, so arrows, Home/End, PageUp/PageDown, touch dragging and RTL are the browser's job.",
      },
    ],
    rules: [
      "While a drag is in flight the component owns the value and ignores the value prop. That is the point: a <video> fires timeupdate four times a second and would drag the thumb back under your finger.",
      "Wire onSeek to video.currentTime and onScrub to your readout. Seeking on every scrub step stalls the element.",
      "buffered is a 0–1 fraction of the track, never a time. Media with holes in it: pass the range holding the playhead.",
      "Dense is for an overlay on a picture. In a settings panel use the default size, where the thumb is always visible.",
    ],
  },
  {
    slug: "duck-volume",
    title: "Duck Volume",
    summary:
      "The tap: a mute toggle with the water hidden behind it, opening sideways when the pointer or the focus ring arrives.",
    category: "Inputs",
    client: true,
    dependencies: ["lucide-react"],
    registryDependencies: [
      "@duck/theme",
      "@duck/duck-media-slider",
      "@duck/quack-button",
    ],
    exports: ["DuckVolume"],
    props: [
      {
        name: "volume / defaultVolume",
        type: "number",
        default: "0.7",
        description: "0 to 1, matching video.volume. Controlled or uncontrolled.",
      },
      {
        name: "muted / defaultMuted",
        type: "boolean",
        default: "false",
        description:
          "Matching video.muted, and independent of volume on purpose — either one alone makes silence.",
      },
      {
        name: "onVolumeChange",
        type: "(volume: number) => void",
        description:
          "Fires live as the slider moves. Volume has no timeupdate to fight, so there is nothing to defer.",
      },
      {
        name: "onMutedChange",
        type: "(muted: boolean) => void",
        description:
          "Fires from the toggle, and from dragging the level back up out of silence.",
      },
      {
        name: "collapsible",
        type: "boolean",
        default: "true",
        description:
          "Off, the slider stays open. For a settings panel, where nothing is tight.",
      },
    ],
    rules: [
      "Silence is muted || volume === 0. Read one of the two and you get a speaker icon over a silent film.",
      "Unmuting a slider that sits at 0 restores the last audible level, otherwise the icon changes and nothing else does.",
      "Dragging to 0 does not flip video.muted. It is already silent, and inventing that state confuses the element you are driving.",
      "Collapsed is zero width, never hidden: the slider stays in the tab order and focus-within is what opens it.",
    ],
  },
  {
    slug: "duck-audio-player",
    title: "Duck Audio Player",
    summary:
      "The native audio bar, replaced: one <audio> element with the seek bar, the tap and a QuackButton transport wired to it, in a full card or a single compact row.",
    category: "Inputs",
    client: true,
    dependencies: ["lucide-react"],
    registryDependencies: [
      "@duck/theme",
      "@duck/duck-media-slider",
      "@duck/duck-volume",
      "@duck/quack-button",
    ],
    exports: ["DuckAudioPlayer"],
    props: [
      {
        name: "src",
        type: "string",
        description:
          "The audio. Changing it runs the element's load algorithm, which empties it — position, duration and buffered range all reset themselves from the events, with no remount needed.",
      },
      {
        name: "title",
        type: "string",
        description:
          "Shown in the default layout, and folded into the accessible name of every control. A string, not a node, for exactly that reason: four players on a page must not all have a button called Pause.",
      },
      {
        name: "compact",
        type: "boolean",
        default: "false",
        description:
          "One row — play, timecode, seek, volume — with the dense 4px seek line and no frame of its own, for a list row that already has one. The default layout is a sticker card with the title, the skip pair and a full-width bar.",
      },
      {
        name: "defaultVolume / defaultMuted",
        type: "number / boolean",
        default: "0.7 / false",
        description:
          "Starting level, applied to the element in an effect because volume and muted are properties rather than attributes. DuckVolume owns them from then on.",
      },
      {
        name: "skip",
        type: "number",
        default: "15",
        description:
          "Seconds the back and forward buttons move. Default layout only, and disabled whenever the media is not seekable.",
      },
      {
        name: "loop / preload",
        type: "native",
        default: 'false / "metadata"',
        description:
          "Passed straight to the element. Metadata by default so the duration is known before the first play and the bar does not appear from nowhere.",
      },
    ],
    rules: [
      "duration is null until the element knows, and stays null for anything with no finite length. NaN before metadata and Infinity on a live stream are the same fact — there is no bar to draw — so the slider is disabled, the read-out says --:-- and the status line says Live.",
      "buffered is read from the range holding the playhead, not from the last range. A seek into fresh territory starts a new range and leaves a hole, and the slider draws one fill from zero.",
      "The seek bar owns its value while you drag it, so timeupdate runs straight into state and currentTime is written once, on commit. Do not add a second source of position.",
      "The loading read on the transport only claims the first load, before the element is playable at all. QuackButton disables itself while busy, and taking Pause away from someone waiting out a mid-track stall would be worse than saying nothing.",
      "No controls on the element, so it has no box and no tab stop: one set of controls, nothing duplicated for a keyboard or a screen reader.",
      "Compact draws no frame. It is meant to sit inside a row that has one, and two sticker edges nested inside one another read as a mistake.",
    ],
  },
  {
    slug: "sticker-otp",
    title: "Sticker OTP",
    summary:
      "A die-cut strip of code cells. Digits land with a pop and the strip glows as one object when the code completes.",
    category: "Inputs",
    client: true,
    registryDependencies: ["@duck/theme"],
    exports: ["StickerOtp"],
    props: [
      { name: "length", type: "number", default: "6", description: "Number of cells." },
      {
        name: "value / defaultValue / onValueChange",
        type: "string",
        description: "Digits only. Anything else is stripped as it arrives.",
      },
      {
        name: "onComplete",
        type: "(value: string) => void",
        description: "Fires once the last cell fills.",
      },
    ],
    rules: [
      "One input, not one per cell. Six inputs break paste, break password managers, and announce \"edit blank, one of six\".",
      "autoComplete=\"one-time-code\" is what triggers iOS SMS autofill. Without it this is worse than a plain text input on a phone.",
      "Errors go in the field, not in a toast. If you auto-submit on the last digit, still render a submit button.",
    ],
  },
  {
    slug: "sticker-drop",
    title: "Sticker Drop",
    summary:
      "The backing paper itself: dragging lights the cut lines and each accepted file lands as its own sticker.",
    category: "Inputs",
    client: true,
    dependencies: ["lucide-react"],
    registryDependencies: ["@duck/theme"],
    exports: ["StickerDrop"],
    props: [
      { name: "accept", type: "string", description: "Same syntax as the native input. Extensions, MIME types and image/* all work." },
      { name: "multiple", type: "boolean", default: "false", description: "Keep more than one file." },
      { name: "maxSize", type: "number", description: "Largest file allowed, in bytes. Rejections say which file and why." },
      {
        name: "files",
        type: "File[]",
        description:
          "The list, held by you. Pass it and the zone draws yours instead of keeping its own — passing [] empties the sheet.",
      },
      {
        name: "onFilesChange",
        type: "(files: File[]) => void",
        description: "Called with the full list every time it changes. Intent, not notification, once files is set.",
      },
      { name: "label / hint", type: "string", description: "Zone copy. The hint is where the accepted types and size limit belong." },
    ],
    rules: [
      "Control it whenever a submit can clear the form. Without files there is nothing to clear and remounting on a changed key is the only way out.",
      "The file input is clipped, never display:none — a hidden input cannot take focus and the zone stops being keyboard operable.",
      "Dragging is not the only way in. The picker is the single-pointer alternative WCAG 2.5.7 asks for, so say so in the label.",
      "The drag-active edge is lime, not a brighter --cut. Cut lines on the sheet are about 1.8:1 and cannot carry a status.",
    ],
  },
  {
    slug: "duck-mark",
    title: "Duck Mark",
    summary:
      "The mascot as flat vector, for the sizes the photographic logo cannot take.",
    category: "Display",
    registryDependencies: ["@duck/theme"],
    exports: ["DuckMark"],
    props: [
      {
        name: "pose",
        type: "rest | swim",
        default: "rest",
        description: "swim adds two lines of water under the duck.",
      },
    ],
    rules: [
      "Use DuckGlyph, not this, at 16-24px — the photographic mark is tuned for that size and carries the brand.",
      "Use this anywhere above about 48px, where the photographic mark's transparent halo starts to show.",
      "The body is currentColor. Set the colour with a text-* class.",
    ],
  },
  {
    slug: "sticker-skeleton",
    title: "Sticker Skeleton",
    summary:
      "The un-inked sticker: die-cut and already on the sheet, the art just has not printed yet.",
    category: "Feedback",
    registryDependencies: ["@duck/theme"],
    exports: ["StickerSkeleton", "StickerSkeletonText"],
    props: [
      {
        name: "shape",
        type: "line | title | circle | card | poster | video",
        default: "line",
        description:
          "The cut. poster and video take their height from the ratio, so artwork needs no geometry at the call site; override the size with a className when none of them fit.",
      },
      {
        name: "delay",
        type: "number",
        default: "0",
        description: "Milliseconds into the shared wave. Later items sweep later.",
      },
      {
        name: "lines",
        type: "number",
        default: "3",
        description: "On StickerSkeletonText: how many lines, staggered 90ms apart, last one short.",
      },
    ],
    rules: [
      "Stagger the delays. Twelve skeletons each running their own shimmer reads as twelve things loading, not one page arriving.",
      "Show a skeleton once a wait passes about 300ms. Below that it is a flash, not feedback.",
      "Use poster and video for artwork rather than card plus an aspect override — the shape carries the ratio and no height, so there is nothing to cancel.",
    ],
  },
  {
    slug: "sticker-progress",
    title: "Sticker Progress",
    summary:
      "The peel: solid vinyl behind the edge, cut-line dashes ahead of it.",
    category: "Feedback",
    registryDependencies: ["@duck/theme"],
    exports: ["StickerProgress", "StickerProgressTrack"],
    props: [
      {
        name: "value",
        type: "number",
        description: "0 to max. Omit it entirely for the indeterminate sweep.",
      },
      { name: "max", type: "number", default: "100", description: "Upper bound." },
      {
        name: "size",
        type: "sm | default",
        default: "default",
        description:
          "sm is the 4px overlay track — no dashes, nothing to put a label row on. default is the 12px cut-line bar.",
      },
      {
        name: "className",
        type: "string",
        description:
          "On StickerProgressTrack: reaches the bar itself, so the radius and the height are yours to overwrite.",
      },
      { name: "label", type: "string", description: "Also becomes the accessible name." },
      {
        name: "showValue",
        type: "boolean",
        default: "false",
        description: "Print the percentage beside the label, in tabular figures.",
      },
    ],
    rules: [
      "No holo variant. A progress bar is on screen for the whole wait, so it is the worst place to spend the viewport's one holo element.",
      "Give it a real value as soon as you have one. Indeterminate is for genuinely unknown length, not for laziness.",
      "StickerProgressTrack is the bar alone — no flex wrapper, no label row, the full ARIA set — for laying along the bottom edge of artwork. Composite components use it instead of redrawing the peel.",
      "Inside a link or a button, pass aria-hidden. The default aria-label=\"Progress\" is right standalone and wrong nested: a live progressbar inside an interactive element gets its aria-valuenow read into that element's accessible name.",
      "At sm the cut line goes. A 1.5px dash top and bottom leaves 1px of a 4px track, so the dashes become a smudge and a dim solid backing is the honest reading.",
    ],
  },
  {
    slug: "empty-pond",
    title: "Empty Pond",
    summary:
      "Still water: one duck at rest — or any drawing you pass — and ripples that are the emptiness rather than decoration on it.",
    category: "Feedback",
    registryDependencies: ["@duck/theme", "@duck/duck-mark"],
    exports: ["EmptyPond"],
    props: [
      { name: "title", type: "string", description: "What is not here. Required." },
      { name: "hint", type: "string", description: "One line on what to do about it." },
      { name: "action", type: "ReactNode", description: "The way out — usually a button." },
      {
        name: "art",
        type: "ReactNode",
        default: '<DuckMark pose="swim" />',
        description:
          "The drawing inside the ripples. Rendered as given, in a 6rem frame that is already aria-hidden, so a replacement sizes itself — the mascot is 4rem — and opts into the float if it wants it.",
      },
      {
        name: "compact",
        type: "boolean",
        default: "false",
        description: "Drop the mascot and the ripples, for empty states inside small panels.",
      },
    ],
    rules: [
      "An empty screen is an invitation. Give it an action, or say why there is nothing to do.",
      "The float is the viewport's one idle animation while this is on screen. Do not put a second one beside it.",
      "This is the only place the mascot goes large. Everywhere else it is a 16px glyph.",
      "The duck is the default drawing, not a requirement. Pass art when a duck is off-domain — a film library, a bank — and keep the frame, the ripples and the copy hierarchy.",
    ],
  },
  {
    slug: "sticker-kbd",
    title: "Sticker Kbd",
    summary:
      "A keycap with a hard bottom lip that compresses to nothing when the key goes down.",
    category: "Display",
    client: true,
    registryDependencies: ["@duck/theme"],
    exports: ["StickerKbd"],
    props: [
      {
        name: "watch",
        type: "string",
        description:
          "A KeyboardEvent.key to listen for, case-insensitive. The cap presses while that key is held anywhere on the page.",
      },
      {
        name: "meta",
        type: "boolean",
        default: "false",
        description: "Also require the platform command key — Meta on Apple, Control elsewhere.",
      },
      {
        name: "frame",
        type: "boolean",
        default: "true",
        description:
          "The die-cut edge and the lip. Off prints the cap flat — for a keycap inside a tooltip or a menu row, where a third border is noise; a pressed flat cap recolours instead of dropping.",
      },
    ],
    rules: [
      "All of the motion is reactive, so it costs nothing against the one-idle-animation rule. Use as many as the page needs.",
      "watch is teaching, not decoration: a dock or a palette that prints its own keyboard map presses the cap under the user's finger, which is where they are already looking.",
      "Print the key the user actually has to press. ⌘ on Apple, Ctrl elsewhere — decide at runtime, do not guess in the markup.",
    ],
  },
  {
    slug: "duck-thinking",
    title: "Duck Thinking",
    summary:
      "The wake without the duck going anywhere: the mark paddles in place while two rings spread out.",
    category: "Feedback",
    registryDependencies: ["@duck/theme", "@duck/duck-mark"],
    exports: ["DuckThinking"],
    props: [
      {
        name: "label",
        type: "string",
        default: "Thinking",
        description: "Announced politely, and shown unless showLabel is false.",
      },
      {
        name: "showLabel",
        type: "boolean",
        default: "true",
        description: "Hide the text and keep it for screen readers only — for use inside a bubble.",
      },
      {
        name: "mark",
        type: "ReactNode",
        default: "<DuckMark />",
        description:
          "What paddles at the centre of the ripples. Rendered as given, in a 2rem frame that is already aria-hidden, so a replacement sizes itself and opts into the paddle if it wants it.",
      },
    ],
    rules: [
      "Say what is happening, not that something is. \"Reading the registry\" beats \"Loading\".",
      "The ripples are this view's idle animation while it is on screen.",
      "The duck is the default, not the component. Pass mark to wait in your own brand and keep the ripples, the geometry and the live region.",
    ],
  },
  {
    slug: "stream-text",
    title: "Stream Text",
    summary:
      "Text arriving a piece at a time, ending in the Terminal's caret.",
    category: "Display",
    client: true,
    registryDependencies: ["@duck/theme"],
    exports: ["StreamText"],
    props: [
      {
        name: "text",
        type: "string",
        description: "Typed out at speed. This is the demo mode — a timer, not a stream.",
      },
      {
        name: "streaming",
        type: "string",
        description:
          "Already-streaming content. Rendered as given, so the model sets the pace. This is the real mode.",
      },
      { name: "active", type: "boolean", description: "True while more tokens are coming. Keeps the caret lit in streaming mode." },
      { name: "speed", type: "number", default: "18", description: "Milliseconds per character, in text mode only." },
      { name: "onDone", type: "() => void", description: "Fires when the typed string finishes." },
    ],
    rules: [
      "Use streaming for real output. Re-typing text you already have wastes the user's time to look busy.",
      "Under reduced motion the whole string appears at once. Someone who asked for less movement should not be made to wait for a typewriter.",
    ],
  },
  {
    slug: "quack-bubble",
    title: "Quack Bubble",
    summary:
      "A message that has a voice: the assistant carries the mark, the user gets plain lime vinyl.",
    category: "Surfaces",
    registryDependencies: ["@duck/theme", "@duck/duck-mark"],
    exports: ["QuackBubble"],
    props: [
      {
        name: "from",
        type: "assistant | user",
        default: "assistant",
        description: "Which side speaks. Assistant gets the mark and the sticker edge.",
      },
      { name: "meta", type: "string", description: "Timestamp, model name, \"edited\" — whatever belongs under the message." },
      {
        name: "mark",
        type: "ReactNode",
        default: '<DuckMark className="size-5" />',
        description:
          "The assistant's face, in a 2rem well that is already aria-hidden. Rendered as given, so a replacement sizes itself — the mascot is 1.25rem.",
      },
    ],
    rules: [
      "No CSS triangle tail. A drawn tail cannot survive a 3px sticker edge, and a clip-path notch would cut the edge open — the squared corner does the pointing.",
      "Only the assistant carries the mark. One voice in the conversation is a character; the other is a person.",
      "Which character is your call. Pass mark and the duck steps aside — a transcript is the last place a design system should insist on its mascot.",
      "Compose it with StreamText for the message and DuckThinking for the wait.",
    ],
  },
  {
    slug: "duck-prose",
    title: "Duck Prose",
    summary:
      "The long-form surface. Styles markup it has never seen — bare headings, paragraphs, quotes, tables — from the theme tokens, at a measure that stays readable.",
    category: "Display",
    registryDependencies: ["@duck/theme"],
    exports: ["DuckProse"],
    props: [
      {
        name: "measure",
        type: '"default" | "wide" | "full"',
        default: '"default"',
        description:
          "68ch, 76ch, or no limit. 68 is where a line stops being pleasant to read; full is for a table-heavy page.",
      },
      {
        name: "as",
        type: '"div" | "article" | "section" | "main"',
        default: '"div"',
        description: "The element. A post is an article, not a div inside one.",
      },
    ],
    rules: [
      "Every rule ships inside :where(), so it is zero specificity: a utility on any element inside prose wins. That is deliberate — a prose wrapper that cannot be overridden is a cage.",
      "Tables are the one thing prose cannot fix from outside: a wide table has to scroll in a box of its own, and CSS cannot add that box. Wrap it in .duck-prose-scroll — in MDX, map `table` once.",
      "@tailwindcss/typography is not used and not needed here. It ships its own scale, greys and blockquote, none of which are a theme's.",
    ],
  },
  {
    slug: "sticker-tooltip",
    title: "Sticker Tooltip",
    summary:
      "A hover and focus label on Radix Tooltip, with the die-cut edge and a 120ms arrival.",
    category: "Feedback",
    client: true,
    dependencies: ["@radix-ui/react-tooltip"],
    registryDependencies: ["@duck/theme"],
    exports: [
      "StickerTooltip",
      "StickerTooltipProvider",
      "StickerTooltipRoot",
      "StickerTooltipTrigger",
      "StickerTooltipContent",
    ],
    props: [
      { name: "content", type: "React.ReactNode", description: "The label. A few words." },
      {
        name: "side",
        type: '"top" | "right" | "bottom" | "left"',
        default: '"top"',
        description: "Preferred side. Radix flips it when there is no room.",
      },
      { name: "align", type: '"start" | "center" | "end"', default: '"center"', description: "Alignment along that side." },
      { name: "arrow", type: "boolean", default: "true", description: "Draw the pointer." },
      { name: "delay", type: "number", default: "250", description: "Milliseconds of hover before it opens." },
      {
        name: "wrapDisabled",
        type: "boolean",
        default: "true",
        description:
          "Wrap a disabled child in a focusable span so the label still opens. Off when the extra element breaks a layout.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "The control being labelled. Rendered as the trigger, so it must forward props.",
      },
    ],
    rules: [
      "A tooltip is hover-only chrome: no touch, gone as soon as the pointer leaves. Use it for a label with nowhere else to live — an icon-only control, a truncated value — and never for information the task needs.",
      "For a keyboard shortcut, print it inline with StickerKbd instead. Every user can see that one.",
      "The all-in-one StickerTooltip brings its own provider. Compose the parts when a group of controls should share one delay.",
      "A disabled control takes no pointer events and no focus, so Radix has nothing to open from — and \"why can\u2019t I press Save?\" is the case a tooltip exists for. Pass a disabled or aria-disabled child and the trigger becomes a tabIndex={0} span around it. Composing the parts yourself means writing that wrapper yourself.",
    ],
  },
  {
    slug: "duck-marquee",
    title: "Duck Marquee",
    summary:
      "A strip that runs: logos, tags, a ticker of shipped things. Seamless loop, pause on hover, edges fading out.",
    category: "Display",
    client: true,
    registryDependencies: ["@duck/theme"],
    exports: ["DuckMarquee"],
    props: [
      { name: "duration", type: "number", default: "28", description: "Seconds for one full pass." },
      { name: "reverse", type: "boolean", default: "false", description: "Run the other way." },
      { name: "gap", type: "string", default: '"2rem"', description: "Space between items, any CSS length." },
      { name: "pauseOnHover", type: "boolean", default: "true", description: "Stop while the pointer is on it." },
      { name: "fade", type: "boolean", default: "true", description: "Mask the two edges into the background." },
    ],
    rules: [
      "The children are rendered twice and the duplicate is aria-hidden. A screen reader that reads the strip twice has been handed the same list twice.",
      "Under reduced motion the animation stops and the strip becomes a plain horizontal scroller. A frozen marquee that clips half its content is worse than no marquee.",
      "It is decoration. Nothing that only exists inside a moving strip is discoverable.",
    ],
  },
  {
    slug: "duck-reveal",
    title: "Duck Reveal",
    summary:
      "Sections arrive as the reader gets to them, and headlines assemble a word at a time.",
    category: "Display",
    client: true,
    dependencies: ["motion"],
    registryDependencies: ["@duck/theme"],
    exports: ["DuckReveal", "DuckSplitReveal"],
    props: [
      { name: "delay", type: "number", default: "0", description: "Seconds before it starts, for staggering siblings." },
      { name: "duration", type: "number", default: "0.65", description: "Seconds the move takes." },
      { name: "distance", type: "number", default: "22", description: "Distance travelled, in px." },
      {
        name: "direction",
        type: '"up" | "down" | "left" | "right" | "in"',
        default: '"up"',
        description: "Which way it comes from. in is opacity only.",
      },
      { name: "repeat", type: "boolean", default: "false", description: "Replay on every entry instead of once." },
      { name: "text", type: "string", description: "On DuckSplitReveal: the line to split. A string, because it has to be split." },
      { name: "by", type: '"word" | "char"', default: '"word"', description: "On DuckSplitReveal: piece size." },
      { name: "stagger", type: "number", default: "0.045", description: "On DuckSplitReveal: seconds between two pieces." },
    ],
    rules: [
      "Reduced motion renders the final state, not no state. Skipping the animation without setting the end leaves the element invisible for good — that is the bug this component exists to avoid.",
      "SplitReveal is for a headline. A paragraph split into words is 200 animated elements and a line break that lands somewhere new on every reflow.",
      "The split pieces are aria-hidden and the whole line is the accessible name, so a screen reader reads a sentence rather than a list of words.",
    ],
  },
  {
    slug: "duck-timeline",
    title: "Duck Timeline",
    summary:
      "A vertical spine that draws itself on scroll, with a node per entry that lights on hover.",
    category: "Display",
    client: true,
    dependencies: ["motion"],
    registryDependencies: ["@duck/theme", "@duck/hud-label"],
    exports: ["DuckTimeline", "DuckTimelineItem"],
    props: [
      { name: "when", type: "React.ReactNode", description: "On an item: the date, version or milestone it is pinned to." },
      { name: "title", type: "React.ReactNode", description: "On an item: the headline." },
      { name: "active", type: "boolean", default: "false", description: "On an item: keep the node lit. For the current entry." },
    ],
    rules: [
      "Progress is measured across the list rather than the window, so the line completes at the last node instead of a screen later.",
      "Under reduced motion the lime line is drawn in full. A spine that never fills reads as a broken component.",
      "The spine is decorative — the list element already carries the order.",
    ],
  },
  {
    slug: "duck-stat-grid",
    title: "Duck Stat Grid",
    summary:
      "The hairline grid: one border colour showing through a 1px gap, with the cells painted on top.",
    category: "Display",
    registryDependencies: ["@duck/theme", "@duck/hud-label"],
    exports: ["DuckStatGrid", "DuckStat"],
    props: [
      { name: "cols", type: "2 | 3 | 4", default: "3", description: "Columns above the sm breakpoint. Always one below it." },
      { name: "bordered", type: "boolean", default: "true", description: "Draw the outer edge as well as the inner rules." },
      { name: "label", type: "React.ReactNode", description: "On a stat: the HUD label. Read before the value." },
      { name: "value", type: "React.ReactNode", description: "On a stat: the number. Tabular figures." },
      { name: "hint", type: "React.ReactNode", description: "On a stat: a delta, a unit, a date." },
    ],
    rules: [
      "gap-px over a --border background beats a border per cell: no doubling on shared edges, nothing to reset on the first column, and exactly one device pixel at any zoom.",
      "Cells are --background rather than --card on purpose — the grid reads as the canvas divided up, not as a row of floating panels. Pass bg-card on a cell if a panel is what you want.",
      "It is a definition list, so the label is announced before the value even though the value leads visually.",
    ],
  },
  {
    slug: "duck-list-header",
    title: "Duck List Header",
    summary:
      "Column labels over a stack of list rows, with a sort control and a column contract the header and the rows share.",
    category: "Navigation",
    dependencies: ["lucide-react"],
    registryDependencies: ["@duck/theme", "@duck/hud-label", "@duck/duck-list-row"],
    exports: ["DuckList", "DuckListHeader"],
    props: [
      {
        name: "columns",
        type: "{ key: string; label: React.ReactNode; width?: string; sortable?: boolean }[]",
        description:
          "The contract. key matches sort.key, width is any grid track that sizes without content (1fr, 8rem, 15%) and defaults to an even share, sortable draws the label as a button.",
      },
      {
        name: "sort",
        type: '{ key: string; direction: "ascending" | "descending" }',
        description: "Which column the rows are ordered by. Controlled — sort your own data.",
      },
      {
        name: "onSortChange",
        type: "(sort: DuckListSort) => void",
        description:
          "The column clicked and the direction it wants next: ascending on a new column, flipped on the current one.",
      },
      {
        name: "header",
        type: "boolean",
        default: "true",
        description:
          "On DuckList: set false for a column-aligned list that wants no labels over it.",
      },
    ],
    rules: [
      "DuckList writes the track list once as --duck-list-cols and every DuckListRow with cells reads it. A width class on a row is the bug this component exists to remove.",
      "Tracks have to size without looking at content: 1fr, rem, %, minmax(). auto and max-content resolve per row, so the columns stop lining up — which is the whole point of the property.",
      "A custom property rather than subgrid: subgrid needs every row to be a direct child of the grid, so it breaks the moment a row is wrapped in an <li>, a motion.div or a virtualiser. An inherited property survives any depth of nesting.",
      'This is not a table. A sortable, column-aligned list is still a list: no role="table", no role="columnheader", and so no aria-sort, which is only defined on a columnheader. Half a table role is worse than plain divs, and the rows are usually anchors — role="row" on an <a> costs you the link.',
      "Anything that needs row selection, resizable columns or a caption is a real <table>. Use shadcn's; the duck theme already styles it.",
      'Sort direction is in the sort button\'s accessible name in words — "last seen, sorted descending" — because a chevron is not an announcement.',
      "Alignment is deliberately not part of the contract. A right-aligned numeric column would need the same class on the header cell and on every row cell, which is the copying the contract exists to stop. If you need it, you need a table.",
    ],
  },
  {
    slug: "duck-list-row",
    title: "Duck List Row",
    summary:
      "The unit of a journal index, a project list, a changelog: ordinal, title, meta, and a rule that grows in on hover.",
    category: "Navigation",
    registryDependencies: ["@duck/theme", "@duck/hud-label"],
    exports: ["DuckListRow"],
    props: [
      { name: "index", type: "React.ReactNode", description: 'Ordinal in the list. A string, so "01" keeps its zero.' },
      { name: "title", type: "React.ReactNode", description: "The headline." },
      { name: "description", type: "React.ReactNode", description: "A line under the title." },
      { name: "meta", type: "React.ReactNode", description: "Date, tag, reading time — the quiet half of the row." },
      { name: "trailing", type: "React.ReactNode", description: "Right edge: a chevron, a value, a badge." },
      {
        name: "cells",
        type: "React.ReactNode[]",
        description:
          "One node per column after the first, in header order. The first column is always the index / title / description block, so a three-column header takes two cells. Passing this puts the row on the shared --duck-list-cols contract.",
      },
      {
        name: "asChild",
        type: "boolean",
        default: "false",
        description:
          "Render the child element as the row, for a whole-row link. The row supplies its own content, so the child is written bare: <a href=\"…\" />.",
      },
    ],
    rules: [
      "A row that is a link should be one anchor. Not an anchor around the title with a card around that — one focus stop, one hover target.",
      "The leading rule is a scaleY transform rather than a width, so the hover costs a composited property and nothing on the main thread.",
      "With cells the row is a grid on the track list DuckList writes, so no row carries a width of its own. Without a DuckList above it, it falls back to an even split weighted towards the title.",
      "A column row does not shift right on hover the way a feed row does: columns that jump out of line with their header read as a bug rather than as a response. It still grows the leading rule, and reserves the gutter for it permanently.",
    ],
  },
  {
    slug: "duck-section-marker",
    title: "Duck Section Marker",
    summary:
      "The label at the top of a section: index, name, and a rule that bleeds out to nothing.",
    category: "Display",
    registryDependencies: ["@duck/theme", "@duck/hud-label"],
    exports: ["DuckSectionMarker"],
    props: [
      { name: "index", type: "React.ReactNode", description: 'Section ordinal. A string, so "03" keeps its zero.' },
      { name: "align", type: '"left" | "center"', default: '"left"', description: "Which side the rule runs to." },
    ],
    rules: [
      "A rule with an end is a divider between two things. A rule that dissolves is an annotation on the one below it — that is the whole detail.",
      "The dot answers to the section, not to itself: put group/section on the section for it to wake up on hover.",
    ],
  },
  {
    slug: "duck-scroll-rail",
    title: "Duck Scroll Rail",
    summary: "How far down the page you are, as one lime hairline.",
    category: "Navigation",
    client: true,
    dependencies: ["motion"],
    registryDependencies: ["@duck/theme"],
    exports: ["DuckScrollRail"],
    props: [
      { name: "side", type: '"top" | "right"', default: '"top"', description: "Along the top of the viewport, or up its trailing edge." },
      { name: "thickness", type: "number", default: "2", description: "Rail thickness in px." },
    ],
    rules: [
      "It is aria-hidden. Scroll position is not information a screen reader is missing.",
      "It does not hide under reduced motion: it is a readout, not an animation. It moves because the page moved.",
      "Transform-only, so it costs nothing per frame even though it updates on every scroll event.",
    ],
  },
  {
    slug: "duck-chart",
    title: "Duck Chart",
    summary:
      "Bars, lines and areas drawn straight into SVG from the chart tokens. No charting dependency.",
    category: "Display",
    client: true,
    registryDependencies: ["@duck/theme", "@duck/hud-label"],
    exports: ["DuckChart"],
    props: [
      { name: "labels", type: "string[]", description: "One per x position. Length sets the number of columns." },
      {
        name: "series",
        type: "{ name: string; values: number[]; color?: string }[]",
        description: "Colours default to --chart-1 through --chart-5 by position.",
      },
      { name: "type", type: '"bar" | "line" | "area"', default: '"bar"', description: "Shape." },
      { name: "title", type: "string", description: "What the figure is. Used for the table caption." },
      { name: "height", type: "number", default: "220", description: "Plot height in px. Width is always fluid." },
      { name: "max", type: "number", description: "Fix the top of the scale. Defaults to the largest value, padded." },
      { name: "grid", type: "boolean", default: "true", description: "Horizontal rules behind the plot." },
      { name: "xAxis", type: "boolean", default: "true", description: "Print the x labels." },
      { name: "legend", type: "boolean", description: "Series names above the plot. On by default past one series." },
      { name: "format", type: "(value: number) => string", description: "Number formatter for the table." },
    ],
    rules: [
      "The same numbers are emitted as a visually hidden table and the SVG is aria-hidden. A chart nobody can read is a picture of data.",
      "This is not a charting library: no zoom, no brush, no pointer tooltip, no time axis. Reach for recharts or visx when the chart is the product; use this when the chart is a figure in a page.",
      "The theme has shipped --chart-1 through --chart-5 since the first release. This is what renders them.",
    ],
  },
  {
    slug: "duck-button-group",
    title: "Duck Button Group",
    summary:
      "Shared geometry for a cluster of buttons that act: one seam instead of two borders, outer corners on the ends only, and a choice between three tab stops and one.",
    category: "Actions",
    client: true,
    dependencies: ["class-variance-authority"],
    registryDependencies: ["@duck/theme"],
    exports: ["DuckButtonGroup", "duckButtonGroupVariants"],
    props: [
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description:
          "Which way the cluster runs. It also picks the seam edge, which corners the ends keep, and — for a toolbar — which two arrow keys move focus.",
      },
      {
        name: "joined",
        type: "boolean",
        default: "true",
        description:
          "Collapse the shared edges so the cluster reads as one control with dividers. False leaves each child its own border and a gap-2 between them; override the gap with a gap-* class.",
      },
      {
        name: "toolbar",
        type: "boolean",
        default: "false",
        description:
          'role="toolbar" plus a roving tabindex: one tab stop for the whole cluster, arrows inside it, Home and End to the ends, both wrapping. Off, it is a role="group" and every button keeps its own stop.',
      },
      {
        name: "aria-label / aria-labelledby",
        type: "string",
        description:
          "One of the two is required by the types. A group or a toolbar with no name is announced as an unnamed container.",
      },
      {
        name: "className",
        type: "string",
        description:
          "Merged over the group. A rounded-* class here changes the cluster's outer corners — the end children inherit the group's radius rather than carrying their own.",
      },
    ],
    rules: [
      "Joined is for buttons doing one job — zoom in, zoom out, reset. Unjoined is for separate actions that merely travel together; a fused Save and Delete reads as one control and invites the wrong press.",
      'role="group" is the default because three buttons are expected to cost three Tabs. Set toolbar when the cluster is the screen\'s controls rather than part of a form: an icon-only canvas cluster, or anything past about four buttons.',
      'No size prop. Children carry their own size — QuackButton size="icon" for a canvas cluster — and the group only shares geometry.',
      "Style the group, not the children. The [&>*] rules reach a plain button or an anchor exactly as they reach a QuackButton, so nothing has to be a duck component to sit in here.",
      "Never put overflow-hidden on the group. The overlap means a middle child's focus ring is already sitting over its neighbour; clipping it is the bug this component exists to avoid.",
      "A toolbar button that disables itself while focused takes the focus with it. Clamp the action instead — arrows skip disabled items, so a permanently disabled one is fine and a self-disabling one is not.",
    ],
  },
  {
    slug: "duck-viewport",
    title: "Duck Viewport",
    summary:
      "A pan and zoom container: the point under the pointer stays under the pointer, a drag that leaves the element keeps following, and the transform goes straight to the DOM so a pan costs no renders.",
    category: "Surfaces",
    client: true,
    dependencies: ["lucide-react"],
    registryDependencies: ["@duck/theme", "@duck/quack-button", "@duck/duck-button-group"],
    exports: ["DuckViewport", "DuckViewportControls"],
    props: [
      {
        name: "min / max",
        type: "number",
        default: "0.25 / 4",
        description:
          "Scale limits. Every path clamps to them — wheel, pinch, keys and the ref alike.",
      },
      {
        name: "initial",
        type: "Partial<{ x: number; y: number; scale: number }>",
        default: "{ x: 0, y: 0, scale: 1 }",
        description:
          "Starting transform, read once on mount, and where reset goes back to. Uncontrolled, like defaultValue — changing it later does nothing.",
      },
      {
        name: "zoomStep",
        type: "number",
        default: "1.25",
        description:
          "Multiplier for zoomIn, zoomOut and the + / - keys. The wheel is continuous and does not use it.",
      },
      {
        name: "panStep",
        type: "number",
        default: "48",
        description: "Pixels an arrow key moves the view. Shift multiplies it by three.",
      },
      {
        name: "wheelZoom",
        type: "boolean",
        default: "true",
        description:
          "Turn the wheel handler off where the page needs to scroll through the viewport. Drag, pinch and the keys still work.",
      },
      {
        name: "onTransformChange",
        type: "(transform: { x: number; y: number; scale: number }) => void",
        description:
          "Fires at most once per frame, after the DOM has already moved. For a zoom read-out or a persisted view — not for driving the transform.",
      },
      {
        name: "ref",
        type: "Ref<DuckViewportHandle>",
        description:
          "getTransform, zoomIn, zoomOut, zoomTo(scale, anchor?), panBy(dx, dy), reset. Programmatic moves ease; under prefers-reduced-motion they snap.",
      },
      {
        name: "viewport",
        type: "RefObject<DuckViewportHandle | null>",
        description:
          "DuckViewportControls only. The ref you gave the viewport. The cluster is a sibling, so it is passed rather than found.",
      },
      {
        name: "orientation",
        type: '"vertical" | "horizontal"',
        default: '"vertical"',
        description: "DuckViewportControls only. Stacking direction of the three buttons.",
      },
      {
        name: "zoomInLabel / zoomOutLabel / resetLabel",
        type: "string",
        default: '"Zoom in" / "Zoom out" / "Reset view"',
        description:
          "DuckViewportControls only. The buttons are icon-only, so these are their accessible names.",
      },
      {
        name: "aria-label",
        type: "string",
        default: '"View controls"',
        description:
          "DuckViewportControls only. It renders a DuckButtonGroup toolbar, and a toolbar needs a name.",
      },
    ],
    rules: [
      "It is a viewport, not a graph renderer. It never looks at its children: a knowledge graph, an image lightbox, a zoomable diagram and the canvas of an editor are all the same interaction, and everything that knows about nodes and edges stays in the application.",
      "The wheel listener is registered through addEventListener with passive: false. React's onWheel is delegated and passive, so preventDefault() inside it is ignored and the page scrolls, or macOS runs its swipe-back, while you zoom. Never replace it with an onWheel prop.",
      "No React state holds the transform. Read it with getTransform, or take onTransformChange, but do not try to drive the viewport from props — a pan writes element.style sixty times a second on purpose.",
      "Give the host a height and an aria-label. It is focusable, and arrows, + / - and 0 are the whole keyboard story.",
      "Chromeless by design: no border, no background. Put the sticker edge on the wrapper, and absolutely position DuckViewportControls inside that wrapper so it does not pan away with the content.",
      "The cluster is a DuckButtonGroup toolbar: one tab stop, arrows inside it. A canvas already owns the arrow keys, so its controls should not also cost three Tabs.",
      "The cluster's buttons never disable at the limits. Knowing when to would mean subscribing to the transform, which puts the pan back into React; clamping already makes the press a no-op.",
    ],
  },
  {
    slug: "duck-command",
    title: "Duck Command",
    summary:
      "The ⌘K palette on StickerDialog and a filtered listbox — no cmdk. The input keeps focus while the arrow keys move aria-activedescendant through the results, so a keystroke is never spent getting back to the field.",
    category: "Navigation",
    client: true,
    dependencies: ["lucide-react"],
    registryDependencies: [
      "@duck/theme",
      "@duck/sticker-dialog",
      "@duck/glow-input",
      "@duck/hud-label",
      "@duck/sticker-kbd",
    ],
    exports: ["DuckCommand", "DuckCommandGroup", "DuckCommandItem", "DuckCommandEmpty"],
    props: [
      {
        name: "items",
        type: "(DuckCommandItemData | DuckCommandGroupData)[]",
        description:
          "The rows. An item is { value?, label, hint?, keywords?, icon?, shortcut?, disabled?, onSelect? }; a group is { heading?, items }. Mix them — consecutive bare items collect into one unheaded group.",
      },
      {
        name: "open",
        type: "boolean",
        description: "Controlled. Leave it off and the palette runs on its own state.",
      },
      {
        name: "defaultOpen",
        type: "boolean",
        default: "false",
        description: "Uncontrolled start.",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description:
          "Fires on the shortcut, on Escape, on the scrim and after a selection.",
      },
      {
        name: "onSelect",
        type: "(value: string, item: DuckCommandItemData) => void",
        description: "Runs after the item's own onSelect. value falls back to the label.",
      },
      {
        name: "recent",
        type: "DuckCommandItemData[]",
        description:
          "Shown instead of everything while the query is empty. Anything typed searches items.",
      },
      {
        name: "recentLabel",
        type: "string",
        default: '"Recent"',
        description: "Heading over recent.",
      },
      {
        name: "placeholder",
        type: "string",
        default: '"Type a command or search…"',
        description: "Input placeholder.",
      },
      {
        name: "label",
        type: "string",
        default: '"Command palette"',
        description:
          "Names the dialog, the combobox and the listbox. Not drawn — the input is the only label a palette needs.",
      },
      {
        name: "description",
        type: "string",
        description: "Replaces the default sr-only sentence describing the keys.",
      },
      {
        name: "emptyMessage",
        type: "React.ReactNode",
        default: '"Nothing matches that."',
        description: "Body of DuckCommandEmpty.",
      },
      {
        name: "shortcut",
        type: "boolean | string",
        default: "true",
        description:
          'The global binding. true is Mod+K; a string is a key spec, either "mod+<key>" or a bare "<key>"; false binds nothing. Same keystroke closes what it opened.',
      },
      {
        name: "filter",
        type: "(item: DuckCommandItemData, query: string) => boolean",
        description:
          "Replace the match. The query arrives trimmed and lower-cased. The default is substring across label, hint and keywords, then subsequence across the label.",
      },
      {
        name: "closeOnSelect",
        type: "boolean",
        default: "true",
        description: "Turn off for a palette that stays open while it toggles things.",
      },
      {
        name: "footer",
        type: "React.ReactNode",
        description: "A strip under the list, for key hints or a result count.",
      },
      {
        name: "holo",
        type: "boolean",
        default: "false",
        description:
          "Iridescent ring instead of the die-cut edge. Forwarded to StickerDialogContent.",
      },
      {
        name: "heading",
        type: "string",
        description:
          "On DuckCommandGroup: the group's label, in .hud typography. Omit for a run of rows with no heading.",
      },
      {
        name: "active",
        type: "boolean",
        default: "false",
        description:
          "On DuckCommandItem: this row is the activedescendant. Highlight and lime rail, not focus — focus stays in the input.",
      },
    ],
    rules: [
      'items is the API. Composed children are not accepted, because filtering children means a mount-order registry that watches the DOM to know which rows survived and whether "no results" is true — cmdk\'s whole architecture, and the thing this item exists to avoid. Palette rows come from a route table or a fetch anyway.',
      "DuckCommandGroup, DuckCommandItem and DuckCommandEmpty are the pieces DuckCommand renders. Use them directly only if you are rebuilding the body, and then you own the filtering and the keyboard.",
      "DuckDashboard's onSearch already binds Mod+K. Wire the palette to it and pass shortcut={false}, or drop onSearch and let the palette own the key — two handlers on one keystroke is the mistake to avoid here.",
      'A bare-key shortcut (shortcut="/") is ignored while focus is in an input, textarea, select or contenteditable. The Mod+K form is taken everywhere, because ⌘K types no character.',
      'Rows are role="option" divs, never buttons. A focusable row would put Tab into the results instead of out of the dialog.',
      "Matches are filtered in place and never re-ranked. A palette whose rows rearrange between keystrokes has to be re-read on every keystroke. Order the array the way you want it read, and put synonyms in keywords.",
      "Home and End move the active row rather than the caret. The query is a few characters; the list is the point.",
      'A row\'s shortcut caps are aria-hidden — "command sign, K" read after every row is noise. If the keys matter to a screen reader, put them in hint.',
      "The panel stays vertically centred. duck-dialog-in carries the centring translate through every frame, so moving top without rewriting those keyframes throws the palette across the viewport on arrival.",
    ],
  },
];

export function getComponent(slug: string) {
  return components.find((item) => item.slug === slug);
}

/**
 * Blocks are whole sections rather than single controls: they compose the
 * components above and land in components/blocks/ instead of components/ui/.
 * They are starting points — the CLI copies them in and you cut them apart.
 */
export interface BlockDoc {
  slug: string;
  title: string;
  summary: string;
  /** Where the CLI writes the file. */
  target: string;
  dependencies?: string[];
  registryDependencies?: string[];
  /** duck/ui items the block renders, for the "built from" line. */
  composes: string[];
  exports: string[];
  props: PropDoc[];
  rules?: string[];
  client?: boolean;
}

export const blocks: BlockDoc[] = [
  {
    slug: "duck-hero",
    title: "Duck Hero",
    summary:
      "The landing section: announcement pill, display headline, two actions, and a terminal that types itself beside them.",
    target: "components/blocks/duck-hero.tsx",
    registryDependencies: [
      "@duck/theme",
      "@duck/announcement",
      "@duck/holo-button",
      "@duck/terminal",
    ],
    composes: ["announcement", "holo-button", "terminal"],
    exports: ["DuckHero"],
    props: [
      {
        name: "eyebrow",
        type: "{ text: string; tag?: string; href?: string }",
        description: "The pill above the headline. With an href it grows an arrow.",
      },
      {
        name: "title",
        type: "React.ReactNode",
        description: "The headline. One line beats two — it is set at 7xl on desktop.",
      },
      { name: "description", type: "React.ReactNode", description: "Subhead under the headline." },
      {
        name: "primaryAction",
        type: "{ label: string; href: string }",
        description: "Rendered as the holo button. This is the page's one holo element.",
      },
      {
        name: "secondaryAction",
        type: "{ label: string; href: string }",
        description: "Rendered as an outline button next to the primary one.",
      },
      {
        name: "terminal",
        type: "TerminalLine[]",
        description: "Transcript for the right column. Omit it and the hero goes single-column.",
      },
      {
        name: "aside",
        type: "React.ReactNode",
        description: "Replaces the terminal: a screenshot, an illustration, a live demo.",
      },
      {
        name: "proof",
        type: "React.ReactNode",
        description: "Slot under the actions for stats, logos or an avatar row.",
      },
    ],
    rules: [
      "The primary action is the holo. Nothing else in the first viewport gets it.",
      "The terminal is one idle animation. Adding a second loop beside it breaks the budget for the whole page.",
      "Actions are plain anchors so the block stays framework-agnostic. Swap them for your router's Link once it is in your project.",
    ],
  },
  {
    slug: "duck-pricing",
    title: "Duck Pricing",
    summary:
      "A tier grid with a monthly / yearly switch. One tier carries the holo ring; the rest stay quiet.",
    target: "components/blocks/duck-pricing.tsx",
    client: true,
    dependencies: ["lucide-react"],
    registryDependencies: [
      "@duck/theme",
      "@duck/duck-switch",
      "@duck/holo-badge",
      "@duck/holo-button",
      "@duck/sticker-card",
    ],
    composes: ["sticker-card", "holo-button", "holo-badge", "duck-switch"],
    exports: ["DuckPricing"],
    props: [
      { name: "title", type: "React.ReactNode", description: "Section heading." },
      { name: "description", type: "React.ReactNode", description: "Line under the heading." },
      {
        name: "tiers",
        type: "DuckPricingTier[]",
        description:
          "name, description, monthly, yearly, features, action, featured, badge. A price can be a number, formatted with the currency, or a string printed as given.",
      },
      { name: "currency", type: "string", default: '"$"', description: "Prefix for numeric prices." },
      {
        name: "billingSwitch",
        type: "boolean",
        default: "any tier prices a year",
        description: "Show the monthly / yearly switch.",
      },
      {
        name: "yearlyNote",
        type: "string",
        description: 'Small line under the switch, for example "2 months free".',
      },
      {
        name: "yearly",
        type: "boolean",
        description: "Controlled billing period. Omit to let the block own the state.",
      },
      {
        name: "onYearlyChange",
        type: "(yearly: boolean) => void",
        description: "Fires on every switch change, controlled or not.",
      },
    ],
    rules: [
      "Exactly one tier is featured. Two holo rings side by side cancel each other out.",
      "The featured tier's button stays lime. An iridescent button inside an iridescent border reads as a rendering bug.",
      "A yearly price is per month, billed yearly — that is what the label says. Pass the annual total and the row lies.",
    ],
  },
  {
    slug: "duck-dashboard",
    title: "Duck Dashboard",
    summary:
      "The application shell: sidebar that becomes a drawer, sticky top bar with search and theme control, an optional stat row, and your page as children.",
    target: "components/blocks/duck-dashboard.tsx",
    client: true,
    dependencies: ["lucide-react", "next-themes"],
    registryDependencies: [
      "@duck/theme",
      "@duck/duck-mark",
      "@duck/holo-avatar",
      "@duck/holo-badge",
      "@duck/sticker-card",
      "@duck/sticker-kbd",
      "@duck/sticker-progress",
      "@duck/theme-switcher",
    ],
    composes: [
      "duck-mark",
      "holo-avatar",
      "holo-badge",
      "sticker-card",
      "sticker-kbd",
      "sticker-progress",
      "theme-switcher",
    ],
    exports: ["DuckDashboard"],
    props: [
      {
        name: "nav",
        type: "DuckDashboardNavItem[]",
        description: "label, href, icon, active, badge, onSelect. Selecting one closes the mobile drawer.",
      },
      {
        name: "footerNav",
        type: "DuckDashboardNavItem[]",
        description: "Second group pinned to the bottom of the sidebar: settings, help, sign out.",
      },
      { name: "title", type: "React.ReactNode", description: "Page title in the top bar." },
      {
        name: "brand",
        type: "React.ReactNode",
        default: "duck mark + brandLabel",
        description: "Sidebar identity.",
      },
      { name: "brandLabel", type: "string", default: '"duck/ui"', description: "Text next to the default mark." },
      {
        name: "user",
        type: "{ name: string; src?: string; fallback?: string }",
        description: "Avatar at the right of the top bar.",
      },
      {
        name: "onSearch",
        type: "() => void",
        description:
          "Renders the search control and binds the command key. Without it, no search button and no key handler.",
      },
      { name: "searchLabel", type: "string", default: '"Search"', description: "Label inside the search control." },
      {
        name: "stats",
        type: "DuckDashboardStat[]",
        description: "label, value, hint, progress. Rendered as a card row above the children.",
      },
      { name: "actions", type: "React.ReactNode", description: "Extra top-bar controls, left of the theme switcher." },
      {
        name: "themeSwitcher",
        type: "boolean",
        default: "true",
        description: "Show the theme control. Turn it off in apps with a single theme.",
      },
      { name: "children", type: "React.ReactNode", description: "The page, under the stat row." },
    ],
    rules: [
      "No holo in the chrome. The shell is on screen for the whole session; the one iridescent element belongs to the page inside it.",
      "The theme switcher needs a next-themes provider above the shell. Pass themeSwitcher={false} if the app has none.",
      "The shell measures itself, not the window: the sidebar is a drawer under 36rem of shell width and sticky above it, so an embedded shell behaves like a narrow one. Keep the nav to one screen — it does not scroll independently.",
    ],
  },
  {
    slug: "duck-site-header",
    title: "Duck Site Header",
    summary:
      "The top of a content site: identity, a handful of anchors, one action, and a real drawer below lg.",
    target: "components/blocks/duck-site-header.tsx",
    dependencies: ["lucide-react"],
    registryDependencies: ["@duck/theme", "@duck/holo-button"],
    composes: ["holo-button"],
    exports: ["DuckSiteHeader"],
    props: [
      { name: "brand", type: "React.ReactNode", description: "Wordmark, logo, or the site name as text." },
      { name: "brandHref", type: "string", default: '"/"', description: "Where the brand links." },
      {
        name: "nav",
        type: "DuckSiteHeaderItem[]",
        description: "label, href, active, external. The block does not guess the current section from the URL.",
      },
      { name: "cta", type: "{ label: string; href: string }", description: "The one action on the right." },
      { name: "actions", type: "React.ReactNode", description: "Search, theme switcher, language toggle — anything left of the CTA." },
      { name: "sticky", type: "boolean", default: "true", description: "Stick to the top with a blurred backdrop." },
      {
        name: "render",
        type: "(item, className) => React.ReactNode",
        description: "Swap the plain anchors for a framework link, so client navigation works.",
      },
    ],
    rules: [
      "Links are anchors by default so the block works in any framework. Pass render for next/link or your router equivalent.",
      "The drawer is a second nav rather than the same one re-laid-out: a menu that only exists at one width should not leave a hidden tab stop at the other.",
      "Escape closes it, and the toggle owns aria-expanded and aria-controls. Active state is yours to pass — the block has no router.",
    ],
  },
  {
    slug: "duck-site-footer",
    title: "Duck Site Footer",
    summary:
      "The bottom of a content site: identity and one sentence, link columns, a hairline, the small print.",
    target: "components/blocks/duck-site-footer.tsx",
    registryDependencies: ["@duck/theme"],
    composes: [],
    exports: ["DuckSiteFooter"],
    props: [
      { name: "brand", type: "React.ReactNode", description: "Mark, wordmark or site name." },
      { name: "description", type: "React.ReactNode", description: "One sentence. Not a mission statement." },
      {
        name: "columns",
        type: "DuckSiteFooterColumn[]",
        description: "title plus links of label, href, external. Each column renders as its own navigation landmark.",
      },
      { name: "note", type: "React.ReactNode", description: "Bottom left: copyright, credit, a build note." },
      { name: "legal", type: "DuckSiteFooterLink[]", description: "Bottom right: privacy, terms, licence." },
      {
        name: "headingLevel",
        type: '"h2" | "h3" | "p"',
        default: '"h2"',
        description: "Column heading element. Drop it to p if the page already spends its heading levels.",
      },
      { name: "render", type: "(link, className) => React.ReactNode", description: "Framework link, as on the header." },
    ],
    rules: [
      "Each column is a nav named by its own heading, because a footer is a navigation landmark and that is what a screen reader lands in it looking for.",
      "Three or four columns. A footer with nine is a sitemap, and a sitemap belongs on its own page.",
    ],
  },
];

export function getBlock(slug: string) {
  return blocks.find((item) => item.slug === slug);
}

export const componentsByCategory = categoryOrder
  .map((category) => ({
    category,
    items: components.filter((item) => item.category === category),
  }))
  .filter((group) => group.items.length > 0);

export interface GuideDoc {
  href: string;
  title: string;
  summary: string;
}

export const guides: { title: string; items: GuideDoc[] }[] = [
  {
    title: "Getting started",
    items: [
      {
        href: "/docs",
        title: "Introduction",
        summary: "What duck/ui is, what it is not, and the four rules it runs on.",
      },
      {
        href: "/docs/installation",
        title: "Installation",
        summary: "Add the @duck registry to components.json and install the theme.",
      },
      {
        href: "/docs/theming",
        title: "Theming",
        summary: "The token contract, the duck extras, and how to retune the palette.",
      },
      {
        href: "/docs/motion",
        title: "Motion",
        summary: "The animation vocabulary: idle loops, transitions, and reduced motion.",
      },
    ],
  },
  {
    title: "AI surface",
    items: [
      {
        href: "/docs/ai",
        title: "For AI assistants",
        summary: "llms.txt, the shadcn MCP server, and the duck/ui skill.",
      },
    ],
  },
];
