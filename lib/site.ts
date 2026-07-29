export const site = {
  name: "duck/ui",
  domain: "duckui.dev",
  url: "https://duckui.dev",
  tagline: "Sticker energy on shadcn rails",
  description:
    "A dark-first design system with holographic sticker energy. Installs through the shadcn CLI under the @duck namespace, so your editor and your AI assistant already know how to add it.",
  author: {
    name: "dacoder",
    url: "https://dacoder.it",
    youtube: "https://www.youtube.com/@davideghi",
  },
  repo: "https://github.com/dacoder/duck-ui",
  registryUrl: "https://duckui.dev/r/{name}.json",
  install: "npx shadcn add @duck/theme",
} as const;

export const mainNav = [
  { href: "/docs", label: "Docs" },
  { href: "/docs/components/quack-button", label: "Components" },
  { href: "/create", label: "Theme editor" },
  { href: "/docs/ai", label: "For AI" },
] as const;
