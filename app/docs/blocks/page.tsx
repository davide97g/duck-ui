import type { Metadata } from "next";
import Link from "next/link";

import { blocks } from "@/lib/registry-docs";
import { DocSection, DocShell, Prose } from "@/components/docs/doc-shell";
import { HoloBadge } from "@/components/ui/holo-badge";

export const metadata: Metadata = {
  title: "Blocks",
  description: `The ${blocks.length} duck/ui blocks: whole sections composed from the components, installed by the same shadcn CLI under the @duck namespace.`,
  alternates: { canonical: "/docs/blocks" },
};

export default function BlocksIndexPage() {
  return (
    <DocShell
      title="Blocks"
      description="Whole sections rather than single controls. A block composes the components, lands in components/blocks/ and is meant to be cut apart."
      pathname="/docs/blocks"
      toc={[{ id: "all", label: "All blocks" }]}
    >
      <Prose>
        <p>
          A block installs like anything else — <code>npx shadcn add @duck/duck-hero</code>{" "}
          — and pulls in every component it renders. The file is a starting
          point with real defaults, not a configurable widget: open it, delete
          the half you do not need, and keep the rest.
        </p>
      </Prose>

      <DocSection id="all" title="All blocks">
        <ul className="grid gap-3 sm:grid-cols-2">
          {blocks.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/docs/blocks/${item.slug}`}
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
    </DocShell>
  );
}
