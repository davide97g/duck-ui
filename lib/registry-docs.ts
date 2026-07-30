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
      "Text input, textarea and a field wrapper that wires up label, helper text and errors so the control stays accessible.",
    category: "Inputs",
    registryDependencies: ["@duck/theme"],
    exports: ["GlowInput", "GlowTextarea", "GlowField"],
    props: [
      { name: "label", type: "string", description: "On GlowField: visible label above the control." },
      { name: "helper", type: "string", description: "On GlowField: persistent hint below the control." },
      {
        name: "error",
        type: "string",
        description: "On GlowField: replaces the helper, sets aria-invalid and role=alert.",
      },
      {
        name: "required",
        type: "boolean",
        default: "false",
        description: "On GlowField: marks the control and adds the asterisk.",
      },
    ],
    rules: ["Never use the placeholder as the label. GlowField exists so you do not have to."],
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
