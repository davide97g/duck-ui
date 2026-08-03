import { site } from "@/lib/site";
import { blocks, components } from "@/lib/registry-docs";

/**
 * One entry per registry people evaluate duck/ui against. Centralised on
 * purpose: the index page, the individual comparison pages, the sitemap and
 * llms.txt all read this array, so a correction lands everywhere at once.
 *
 * Two rules for anything written here. State the other project's strengths in
 * its own terms — a reader who is comparing will open both tabs, and a page
 * that shades the competitor loses them at the first check. And keep claims to
 * what is publicly documented: positioning and shape, never a component count
 * that goes stale a week after it is written.
 */
export interface Comparison {
  slug: string;
  /** Display name, used in headings: "duck/ui vs {name}". */
  name: string;
  url: string;
  /** The shelf they sit on, in their own framing. */
  category: string;
  /** Neutral one-liner. Reads as fair if they read it. */
  summary: string;
  /** The answer-first paragraph. Lifted verbatim by answer engines, so it has to stand alone. */
  shortAnswer: string;
  /** Their genuine strengths. If this list is weak, the page is not credible. */
  strengths: string[];
  /** Side-by-side rows. `them` must be defensible, not a strawman. */
  axes: { axis: string; them: string; duck: string }[];
  /** Who should pick them. Written to actually send those people away. */
  pickThem: string;
  /** Who should pick duck/ui. */
  pickDuck: string;
  /** Whether the two can coexist in one project, and what breaks if they do. */
  together: string;
  faq: { question: string; answer: string }[];
}

/** Stated on every comparison page, because a comparison without a date is a claim without a scope. */
export const comparisonsVerified = "2026-07-31";

export const comparisons: readonly Comparison[] = [
  {
    slug: "shadcn-ui",
    name: "shadcn/ui",
    url: "https://ui.shadcn.com",
    category: "The base layer every registry installs into",
    summary:
      "The original copy-paste component collection and the CLI, schema and MCP server that every third-party registry rides on.",
    shortAnswer:
      "duck/ui is not an alternative to shadcn/ui — it is a registry that installs into it. shadcn/ui gives you correct, accessible, deliberately neutral components; duck/ui gives those components an opinion by shipping a token set, plus signature components shadcn does not include. If you already run shadcn/ui, adding duck/ui is one line in components.json and one install.",
    strengths: [
      "The accessibility and correctness baseline the whole ecosystem builds on.",
      "Neutral by design, which is exactly right when you have your own brand tokens.",
      "The CLI, the registry schema and the MCP server — all of which duck/ui uses rather than replaces.",
      "The largest primitive coverage: dialog, dropdown, table, form, everything duck/ui deliberately does not ship.",
    ],
    axes: [
      {
        axis: "What it gives you",
        them: "Accessible primitives with neutral styling",
        duck: "A token set with an opinion, plus components shadcn does not ship",
      },
      {
        axis: "Colour direction",
        them: "Light-first; dark is derived from it",
        duck: "Dark designed first; light derived and checked separately",
      },
      {
        axis: "Relationship",
        them: "The base layer",
        duck: "Additive on top — install both",
      },
      {
        axis: "Install path",
        them: "npx shadcn add button",
        duck: "npx shadcn add @duck/theme — same CLI, @duck namespace",
      },
    ],
    pickThem:
      "Use shadcn/ui on its own when you already have a brand token set, or when the design is someone else's job and neutral is the correct starting point.",
    pickDuck:
      "Add duck/ui when the neutral default is the problem — when the app works but looks like a demo, and you want a stated aesthetic without giving up shadcn's primitives.",
    together:
      "They are meant to run together. @duck/theme implements the full shadcn CSS-variable contract, so the shadcn components already in the project pick up the new tokens with no markup change. Keep using standard shadcn for dialog, dropdown and table — the theme styles them too.",
    faq: [
      {
        question: "Do I need shadcn/ui installed before duck/ui?",
        answer:
          "Yes. duck/ui expects a project already initialised with shadcn, so components.json and lib/utils.ts exist. The @duck registry is added as a second namespace in that same components.json.",
      },
      {
        question: "Will duck/ui break my existing shadcn components?",
        answer:
          "No markup changes and no files are overwritten. @duck/theme writes tokens into globals.css, so existing components change appearance but not behaviour. Reverting is reverting one file.",
      },
    ],
  },
  {
    slug: "magic-ui",
    name: "Magic UI",
    url: "https://magicui.design",
    category: "Animated component registry",
    summary:
      "A large free registry of animated React components — marquees, animated beams, bento grids, text effects — built on React, Tailwind and Motion.",
    shortAnswer:
      "Magic UI is a catalogue of animation effects; duck/ui is a theme with components attached. Magic UI is the better pick when you need a specific motion effect for a marketing page and the rest of your design is already settled. duck/ui is the better pick when the problem is that nothing on the page has a shared look, because the install starts with a token set that restyles what you already built.",
    strengths: [
      "Far more animation effects than duck/ui ships, and more arriving.",
      "Effects are genuinely well made — the animated beam and text effects in particular.",
      "MIT and copy-paste, so nothing is locked behind a package.",
      "Built for landing pages, where a single striking effect earns its keep.",
    ],
    axes: [
      {
        axis: "Unit of value",
        them: "The individual effect",
        duck: "The token set, then the components",
      },
      {
        axis: "Effect on existing pages",
        them: "None until you place a component",
        duck: "Immediate — the theme restyles shadcn components already in the project",
      },
      {
        axis: "Motion budget",
        them: "Per component; up to you to ration",
        duck: "Published rule: one idle animation and one holo element per viewport",
      },
      {
        axis: "Runtime cost",
        them: "Motion (framer-motion) at runtime for most effects",
        duck: "CSS keyframes shipped by the theme; no motion dependency from the registry",
      },
      {
        axis: "Coverage",
        them: "Broad animation catalogue",
        duck: `${components.length} components, ${blocks.length} blocks, one theme — additive to shadcn`,
      },
    ],
    pickThem:
      "Pick Magic UI when you need a specific effect — an animated beam between two nodes, a marquee, a particular text reveal — and you are not trying to change how the rest of the app looks.",
    pickDuck:
      "Pick duck/ui when the whole surface needs to look like one system, dark first, and you would rather install a token contract than assemble a page out of unrelated effects.",
    together:
      "They coexist. Both are copy-paste under the shadcn CLI, so a Magic UI effect dropped into a duck/ui project keeps working — but it will not inherit the duck tokens unless you point its colours at bg-primary and friends. Budget the motion: one idle animation per viewport is the duck rule, and a marquee plus a holo element already spends it.",
    faq: [
      {
        question: "Can I use Magic UI and duck/ui in the same project?",
        answer:
          "Yes. Both install through the shadcn CLI and copy files into your repository, so there is no package conflict. Rewrite the Magic UI component's hardcoded colours to semantic tokens if you want it to follow the duck theme.",
      },
      {
        question: "Is duck/ui a Magic UI alternative?",
        answer:
          "Only partly. Magic UI is an animation catalogue and duck/ui is a theme-first registry, so they answer different questions. If you came looking for a specific effect, Magic UI probably has it; if you came because your app looks generic, the theme is the thing that fixes that.",
      },
    ],
  },
  {
    slug: "aceternity-ui",
    name: "Aceternity UI",
    url: "https://ui.aceternity.com",
    category: "Visual-effects component collection",
    summary:
      "The boldest visual effects on the shelf — 3D cards, spotlights, glowing beams, magnetic buttons, particle backgrounds — aimed at landing pages that need to look expensive.",
    shortAnswer:
      "Aceternity UI goes further than duck/ui on spectacle and duck/ui goes further on consistency. Aceternity is built for a hero section that has to stop someone scrolling; duck/ui is built so a whole application — hero, dashboard, settings page — reads as one system. If you need one showstopping section, Aceternity. If you need forty screens that match, duck/ui.",
    strengths: [
      "Effects nothing else on this list attempts: 3D cards, spotlight and particle work.",
      "Excellent for a launch page or portfolio where impact matters more than restraint.",
      "Copy-paste, so you own and can gut any effect you take.",
      "A visual bar that pushed the whole ecosystem forward.",
    ],
    axes: [
      {
        axis: "Design intent",
        them: "Maximum impact per section",
        duck: "One system across every screen",
      },
      {
        axis: "Where it fits",
        them: "Landing pages, portfolios, launch moments",
        duck: "Product surfaces as well as landing pages",
      },
      {
        axis: "Restraint",
        them: "Yours to impose",
        duck: "Built in — holo is rationed to one element per viewport",
      },
      {
        axis: "Theme contract",
        them: "Per-component styling",
        duck: "Full shadcn variable contract plus duck extras",
      },
      {
        axis: "Tuning",
        them: "Edit the component",
        duck: `Editor at ${site.domain}/create; export CSS or share a preset link`,
      },
    ],
    pickThem:
      "Pick Aceternity UI when a single section carries the whole page and you want the effect that makes people screenshot it.",
    pickDuck:
      "Pick duck/ui when the same look has to survive across a dashboard, a settings page and an empty state — where a spotlight effect on every screen becomes noise.",
    together:
      "Reach for an Aceternity effect as the one holo-grade moment on a duck/ui page, and drop the duck holo element from that viewport. Two competing focal points cancel each other out, which is the whole reason duck/ui rations them.",
    faq: [
      {
        question: "Is duck/ui as visually bold as Aceternity UI?",
        answer:
          "Not at the level of a single section, and deliberately so. duck/ui rations its strongest finish — the holographic foil — to one element per viewport, because the system is meant to hold up across a whole application rather than one hero.",
      },
      {
        question: "Can I put an Aceternity component in a duck/ui project?",
        answer:
          "Yes. Both are copy-paste through the shadcn CLI. Repoint the component's colours at semantic tokens such as bg-primary and border-border so it follows the theme, and treat it as that viewport's single focal effect.",
      },
    ],
  },
  {
    slug: "origin-ui",
    name: "Origin UI",
    url: "https://originui.com",
    category: "Broad copy-paste component library",
    summary:
      "A large free collection covering the unglamorous surface area — forms, inputs, tables, application UI — as copy-paste Tailwind and shadcn components.",
    shortAnswer:
      "Origin UI optimises for coverage and duck/ui optimises for identity. Origin UI is the better answer when you need many variants of ordinary things — twelve input states, a dozen table headers — styled neutrally. duck/ui is the better answer when the ordinary things already exist and the problem is that they look like everyone else's.",
    strengths: [
      "Breadth: far more variants of everyday form and application UI than duck/ui ships.",
      "Neutral styling that drops into an existing design system without fighting it.",
      "Free and copy-paste, with no runtime dependency.",
      "Strong reference material for input and form states.",
    ],
    axes: [
      {
        axis: "Optimised for",
        them: "Coverage of everyday UI",
        duck: "A stated aesthetic across the whole surface",
      },
      {
        axis: "Styling stance",
        them: "Neutral, fits any system",
        duck: "Opinionated: dark-first, sticker borders, rationed holo",
      },
      {
        axis: "Restyles existing components",
        them: "No",
        duck: "Yes — the theme is the first install",
      },
      {
        axis: "Best paired with",
        them: "Your own brand tokens",
        duck: "Standard shadcn for primitives it skips",
      },
    ],
    pickThem:
      "Pick Origin UI when you need volume — many variants of inputs, tables and application chrome — and the visual direction is already decided elsewhere.",
    pickDuck:
      "Pick duck/ui when the visual direction is the missing piece, and one install that retunes every existing component is worth more than another twenty neutral variants.",
    together:
      "Good pairing. Take the Origin UI variant you need, swap its hardcoded colours for semantic tokens, and it inherits the duck theme like any shadcn component. duck/ui does not compete for that surface area — it is additive by design.",
    faq: [
      {
        question: "Does duck/ui cover forms and tables like Origin UI?",
        answer:
          "Not at the same breadth, on purpose. duck/ui ships styled inputs, switches, checkboxes, radio groups, sliders and OTP fields, then defers to standard shadcn for tables and complex forms — which @duck/theme already styles.",
      },
      {
        question: "Can Origin UI components use the duck theme?",
        answer:
          "Yes, once their colours reference semantic tokens rather than raw Tailwind palette classes. The theme implements the full shadcn variable contract, so anything written against that contract follows it automatically.",
      },
    ],
  },
  {
    slug: "kibo-ui",
    name: "Kibo UI",
    url: "https://www.kibo-ui.com",
    category: "Complex stateful component registry",
    summary:
      "A trusted shadcn registry shipping the components teams would otherwise build from scratch — Gantt charts, Kanban boards, a code editor, AI chat elements, colour pickers, file dropzones.",
    shortAnswer:
      "Kibo UI solves hard behaviour and duck/ui solves visual identity. They are not substitutes: a Kanban board is weeks of work you should not repeat, and a token set is a look you cannot get from a Kanban board. The realistic answer for a project that needs both is to install both, because both ride the same CLI.",
    strengths: [
      "Genuinely complex, stateful components — the expensive kind to build correctly.",
      "MIT, free, and a trusted shadcn registry with the same install path.",
      "AI chat elements and editor primitives that few others attempt.",
      "Saves weeks on exactly the components duck/ui has no intention of shipping.",
    ],
    axes: [
      {
        axis: "Problem solved",
        them: "Behaviour that is expensive to build",
        duck: "A look that is expensive to design",
      },
      {
        axis: "Component complexity",
        them: "High — Gantt, Kanban, editor, chat",
        duck: "Low to medium — controls, surfaces, feedback, five blocks",
      },
      {
        axis: "Visual stance",
        them: "Neutral, follows your shadcn tokens",
        duck: "Ships the tokens the rest follows",
      },
      {
        axis: "Overlap",
        them: "Almost none with duck/ui",
        duck: "Almost none with Kibo UI",
      },
    ],
    pickThem:
      "Pick Kibo UI when the requirement is a board, a chart, an editor or a chat surface. Nothing in duck/ui replaces those.",
    pickDuck:
      "Pick duck/ui when the requirement is that all of it — including the Kibo components — should look like it was designed by one person.",
    together:
      "The cleanest pairing on this list. Kibo components are written against the shadcn variable contract, which is the same contract @duck/theme implements, so they inherit the duck tokens with no edits. Install @duck/theme first, then add Kibo components as needed.",
    faq: [
      {
        question: "Do Kibo UI components work with the duck/ui theme?",
        answer:
          "Yes, and with no changes in the usual case. Kibo UI styles against shadcn's CSS variables and @duck/theme ships the full set of them, so installing the theme retunes Kibo components along with everything else.",
      },
      {
        question: "Does duck/ui have a Kanban board or a data table?",
        answer:
          "No. duck/ui is additive and stops at controls, surfaces, feedback and three composed blocks. For boards, editors and tables use Kibo UI or standard shadcn — the theme styles both.",
      },
    ],
  },
] as const;

export function getComparison(slug: string) {
  return comparisons.find((item) => item.slug === slug);
}
