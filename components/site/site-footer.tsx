import Link from "next/link";

import { legalNav, site } from "@/lib/site";
import { components } from "@/lib/registry-docs";
import { DuckMark } from "@/components/brand/duck-mark";

const columns = [
  {
    title: "Docs",
    links: [
      { href: "/docs", label: "Introduction" },
      { href: "/docs/installation", label: "Installation" },
      { href: "/docs/theming", label: "Theming" },
      { href: "/docs/motion", label: "Motion" },
    ],
  },
  {
    title: "Components",
    links: components
      .slice(0, 5)
      .map((item) => ({ href: `/docs/components/${item.slug}`, label: item.title })),
  },
  {
    title: "Build",
    links: [
      { href: "/create", label: "Theme editor" },
      { href: "/docs/ai", label: "For AI assistants" },
      { href: "/compare", label: "Compare registries" },
      { href: "/r/registry.json", label: "Registry index" },
      { href: "/llms.txt", label: "llms.txt" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-4">
            <DuckMark className="size-11" />
            <p className="max-w-xs text-sm text-muted-foreground">
              {site.tagline}. Open code, installed by the shadcn CLI, readable
              by your assistant.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <h2 className="font-display text-sm font-bold">{column.title}</h2>
              <ul className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            Built by{" "}
            <a
              href={site.author.url}
              className="text-foreground underline underline-offset-4"
            >
              {site.author.name}
            </a>
            . The build is documented on{" "}
            <a
              href={site.author.youtube}
              className="text-foreground underline underline-offset-4"
            >
              YouTube
            </a>
            .
          </p>
          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center gap-x-4 gap-y-1"
          >
            {legalNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`${site.repo}/blob/main/LICENSE`}
              rel="noopener noreferrer"
              target="_blank"
              className="font-mono text-xs transition-colors hover:text-foreground"
            >
              {site.license} licensed
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
