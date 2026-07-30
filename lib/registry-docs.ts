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
        type: '"sm" | "default" | "lg" | "icon"',
        default: '"default"',
        description: "Control height and padding.",
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
          "Image URL for the mark shown while loading. Defaults to the official duck/ui logo.",
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
        description: "Render the child element instead of a button, for links.",
      },
    ],
    rules: [
      "One idle animation per screen. Two competing loops read as a broken page.",
      "Keep the label stable between idle and loading unless the wait is long enough to explain.",
      "State is controlled. Reset it to idle yourself once the work finishes.",
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
        name: "onCopied",
        type: "(value: string) => void",
        description: "Fires after the clipboard write resolves.",
      },
    ],
  },
  {
    slug: "sticker-card",
    title: "Sticker Card",
    summary:
      "The die-cut sticker: thick border, generous radius, soft glow. Optional iridescent ring, pointer tilt and a corner that peels off the backing.",
    category: "Surfaces",
    client: true,
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
    ],
    rules: [
      "Peel and tilt together is a lot. Pick one per card.",
      "In a grid of cards, at most one carries holo.",
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
    registryDependencies: ["@duck/theme"],
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
      { name: "holo", type: "boolean", default: "false", description: "Iridescent frame." },
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
    dependencies: ["class-variance-authority"],
    registryDependencies: ["@duck/theme"],
    exports: ["HoloBadge", "holoBadgeVariants"],
    props: [
      {
        name: "variant",
        type: '"holo" | "primary" | "outline" | "muted" | "success" | "danger"',
        default: '"holo"',
        description: "Pick by meaning, not by contrast.",
      },
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
      "The duck/ui logo paddling on water, with the wake as expanding rings. Point src at any image URL to spin your own mark instead.",
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
          "Mark image. Any remote URL, /public path or data URI. Defaults to the official duck/ui logo, served from the registry origin.",
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
      "The mark loads over the network, so a custom src needs to be reachable from the browser and allowed by your img-src Content-Security-Policy.",
      "To rebrand every loading state at once — spinner, QuackButton, QuackToast — edit DUCK_MARK_SRC in duck-spinner.tsx rather than passing src at each call site.",
    ],
  },
  {
    slug: "holo-separator",
    title: "Holo Separator",
    summary:
      "A hairline that fades in from the edges. With a label it becomes a section break.",
    category: "Display",
    registryDependencies: ["@duck/theme"],
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
    exports: ["GlowInput", "GlowTextarea", "GlowField", "GlowFieldset"],
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
    ],
    rules: [
      "Never use the placeholder as the label. GlowField exists so you do not have to.",
      "GlowField wraps one control. For anything plural — a radio group, a range, an OTP strip, a dropzone — use GlowFieldset, which emits a real fieldset and legend.",
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
        description: "Print the formatted value above the track, in tabular figures.",
      },
    ],
    rules: [
      "No holo variant, on purpose. Settings pages have six sliders and the viewport has one holo budget.",
      "Single value. A two-thumb range is a different control — do not fake it with two of these.",
      "Pass formatValue whenever the number is not self-explanatory.",
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
        name: "onFilesChange",
        type: "(files: File[]) => void",
        description: "Called with the full list every time it changes.",
      },
      { name: "label / hint", type: "string", description: "Zone copy. The hint is where the accepted types and size limit belong." },
    ],
    rules: [
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
        type: "line | title | circle | card",
        default: "line",
        description: "The cut. Override the size with a className when none of them fit.",
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
    ],
  },
  {
    slug: "sticker-progress",
    title: "Sticker Progress",
    summary:
      "The peel: solid vinyl behind the edge, cut-line dashes ahead of it.",
    category: "Feedback",
    registryDependencies: ["@duck/theme"],
    exports: ["StickerProgress"],
    props: [
      {
        name: "value",
        type: "number",
        description: "0 to max. Omit it entirely for the indeterminate sweep.",
      },
      { name: "max", type: "number", default: "100", description: "Upper bound." },
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
    ],
  },
  {
    slug: "empty-pond",
    title: "Empty Pond",
    summary:
      "Still water: one duck at rest and ripples that are the emptiness rather than decoration on it.",
    category: "Feedback",
    registryDependencies: ["@duck/theme", "@duck/duck-mark"],
    exports: ["EmptyPond"],
    props: [
      { name: "title", type: "string", description: "What is not here. Required." },
      { name: "hint", type: "string", description: "One line on what to do about it." },
      { name: "action", type: "ReactNode", description: "The way out — usually a button." },
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
    ],
    rules: [
      "All of the motion is reactive, so it costs nothing against the one-idle-animation rule. Use as many as the page needs.",
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
    ],
    rules: [
      "Say what is happening, not that something is. \"Reading the registry\" beats \"Loading\".",
      "The ripples are this view's idle animation while it is on screen.",
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
    ],
    rules: [
      "No CSS triangle tail. A drawn tail cannot survive a 3px sticker edge, and a clip-path notch would cut the edge open — the squared corner does the pointing.",
      "Only the assistant carries the mark. One voice in the conversation is a character; the other is a person.",
      "Compose it with StreamText for the message and DuckThinking for the wait.",
    ],
  },
];

export function getComponent(slug: string) {
  return components.find((item) => item.slug === slug);
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
