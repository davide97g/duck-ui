import type { Metadata } from "next";
import Link from "next/link";

import { components, componentsByCategory } from "@/lib/registry-docs";
import { DocSection, DocShell, Prose } from "@/components/docs/doc-shell";
import { JsonLd, itemListSchema } from "@/components/seo/structured-data";
import { HoloBadge } from "@/components/ui/holo-badge";

export const metadata: Metadata = {
  title: "Components",
  description: `All ${components.length} duck/ui components, grouped by category. Every one installs through the shadcn CLI under the @duck namespace.`,
  alternates: { canonical: "/docs/components" },
};

export default function ComponentsIndexPage() {
  return (
    <DocShell
      title="Components"
      description={`All ${components.length} components, grouped the way the sidebar groups them. Each one is a single file the CLI copies into your project.`}
      pathname="/docs/components"
      toc={componentsByCategory.map((group) => ({
        id: group.category.toLowerCase().replace(/\s+/g, "-"),
        label: group.category,
      }))}
    >
      <JsonLd
        data={itemListSchema({
          name: "duck/ui components",
          description: `All ${components.length} duck/ui components, each installable through the shadcn CLI under the @duck namespace.`,
          path: "/docs/components",
          items: components.map((item) => ({
            name: item.title,
            description: item.summary,
            path: `/docs/components/${item.slug}`,
          })),
        })}
      />

      <Prose>
        <p>
          Install the theme first — every component assumes its tokens exist —
          then add whatever you need. Nothing is wrapped in a package: the
          source lands in <code>components/ui/</code> and belongs to you.
        </p>
      </Prose>

      {componentsByCategory.map((group) => (
        <DocSection
          key={group.category}
          id={group.category.toLowerCase().replace(/\s+/g, "-")}
          title={group.category}
        >
          <ul className="grid gap-3 sm:grid-cols-2">
            {group.items.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/docs/components/${item.slug}`}
                  className="group flex h-full flex-col gap-2 rounded-xl border-2 border-border p-4 transition-colors hover:border-primary/50"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-display font-bold group-hover:text-primary">
                      {item.title}
                    </span>
                    <HoloBadge variant="muted">
                      {item.client ? "Client" : "Server"}
                    </HoloBadge>
                  </span>
                  <span className="text-sm text-pretty text-muted-foreground">
                    {item.summary}
                  </span>
                  <code className="mt-auto pt-1 font-mono text-xs text-muted-foreground">
                    @duck/{item.slug}
                  </code>
                </Link>
              </li>
            ))}
          </ul>
        </DocSection>
      ))}
    </DocShell>
  );
}
