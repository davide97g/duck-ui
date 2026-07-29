/**
 * One source of truth for every public URL the site emits.
 *
 * The origin is read from NEXT_PUBLIC_SITE_URL at build time so a domain move
 * is one environment variable rather than a find-and-replace. It must be a
 * full absolute origin with no trailing slash — metadataBase, the sitemap, the
 * registry URL and llms.txt all concatenate onto it.
 */
const DEFAULT_URL = "https://duckui.davideghiotto.it";

function resolveUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return DEFAULT_URL;
  return raw.replace(/\/+$/, "");
}

const url = resolveUrl();

export const site = {
  name: "duck/ui",
  domain: new URL(url).host,
  url,
  tagline: "Sticker energy on shadcn rails",
  description:
    "A dark-first design system with holographic sticker energy. Installs through the shadcn CLI under the @duck namespace, so your editor and your AI assistant already know how to add it.",
  author: {
    name: "dacoder",
    url: "https://dacoder.it",
    youtube: "https://www.youtube.com/@davideghi",
  },
  repo: "https://github.com/davide97g/duck-ui",
  registryUrl: `${url}/r/{name}.json`,
  install: "npx shadcn add @duck/theme",
  license: "MIT",
} as const;

/**
 * Identity behind the legal pages. The controller is a private individual, so
 * there is no VAT number or registered address to publish. contactEmail is the
 * published channel for GDPR data-subject requests.
 */
export const legal = {
  controllerName: "Davide Ghiotto",
  contactEmail: "ghiotto.davidenko@gmail.com",
  jurisdiction: "Italy",
  /** Shown as "Last updated" on every legal page. Bump when you edit them. */
  lastUpdated: "2026-07-29",
} as const;

export const mainNav = [
  { href: "/docs", label: "Docs" },
  { href: "/docs/components", label: "Components" },
  { href: "/create", label: "Theme editor" },
  { href: "/docs/ai", label: "For AI" },
] as const;

export const legalNav = [
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/cookies", label: "Cookies" },
] as const;
