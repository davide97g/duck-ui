import { blocks, components } from "@/lib/registry-docs";
import { site } from "@/lib/site";

/**
 * The questions people actually ask before adopting a registry, answered in the
 * shape an answer engine can lift: the claim first, the qualifier after, no
 * pronoun that only resolves against the previous sentence. Every entry is
 * rendered as visible text on the landing page and emitted as FAQPage JSON-LD
 * from the same component, so the two can never drift.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export const faq: readonly FaqItem[] = [
  {
    question: "What is duck/ui?",
    answer: `duck/ui is a dark-first component registry for shadcn/ui, distributed under the @duck namespace. It ships ${components.length} React components, ${blocks.length} blocks, one theme and one hook, all installed by the standard shadcn CLI. The look is holographic accents and thick sticker borders on a near-black canvas.`,
  },
  {
    question: "How do I install duck/ui?",
    answer: `Add "@duck": "${site.url}/r/{name}.json" to the registries block of components.json, then run ${site.install}. Install the theme before any component, because every component assumes its tokens exist. After that, npx shadcn add @duck/quack-button pulls single components and resolves their dependencies on its own.`,
  },
  {
    question: "Does duck/ui replace shadcn/ui?",
    answer:
      "No. duck/ui is additive and rides shadcn's distribution rails. @duck/theme ships the full shadcn CSS variable contract, so the shadcn components already in a project inherit the new tokens without any markup change. For a dialog, a dropdown or a table, use standard shadcn — the theme already styles it.",
  },
  {
    question: "Is duck/ui free?",
    answer:
      "Yes. duck/ui is MIT licensed and free for commercial use. The CLI copies the source files into your repository, so there is no package to install and no runtime dependency to remove later. Once a file lands in components/ui/, it is yours to edit.",
  },
  {
    question: "What are the requirements for duck/ui?",
    answer:
      "duck/ui targets React 19, Tailwind CSS v4 and a project already configured for shadcn/ui with a components.json. It is built and tested against Next.js 15 with the App Router, but nothing in the components is Next-specific. Node 20 or newer is required to run the CLI.",
  },
  {
    question: "Can an AI assistant install duck/ui?",
    answer: `Yes. The registry is static JSON at a stable URL, so any tool that speaks shadcn can reach it. Assistants have three entry points: ${site.domain}/llms.txt as a plain-text index, the shadcn MCP server for search and install from chat, and the duck/ui skill installed with "skills add dacoder/duck-ui".`,
  },
  {
    question: "How do I customize the duck/ui theme?",
    answer: `Open the theme editor at ${site.domain}/create, retune hue, chroma, radius, glow and border width on live components, then export the CSS or share the preset link. Because every component references semantic tokens such as bg-primary and text-muted-foreground rather than raw colors, retuning the theme retunes all of them at once.`,
  },
  {
    question: "How is duck/ui different from other shadcn registries?",
    answer:
      "duck/ui is theme-first rather than component-first. Most registries hand you individual effects with no shared token contract, so mixing them fragments the design. Here one install restyles what you already built, dark mode is designed first and light is derived from it, and the usage rules — one holo element per viewport, lime for every default action — are published so the output stays coherent.",
  },
] as const;
