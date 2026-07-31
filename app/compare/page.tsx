import type { Metadata } from "next";
import Link from "next/link";

import { comparisons, comparisonsVerified } from "@/lib/comparisons";
import { site } from "@/lib/site";
import { DocSection, DocShell, Prose } from "@/components/docs/doc-shell";
import { JsonLd, itemListSchema } from "@/components/seo/structured-data";
import { HoloBadge } from "@/components/ui/holo-badge";
import { HoloButton } from "@/components/ui/holo-button";
import { InstallCommand } from "@/components/site/install-command";

export const metadata: Metadata = {
  title: "duck/ui vs other shadcn registries",
  description:
    "How duck/ui compares to shadcn/ui, Magic UI, Aceternity UI, Origin UI and Kibo UI — what each one is actually for, and when to pick something else.",
  alternates: { canonical: "/compare" },
};

export default function ComparePage() {
  return (
    <DocShell
      title="duck/ui vs other shadcn registries"
      description="Most of these are not substitutes for each other. This page says what each one is for, including the cases where duck/ui is the wrong answer."
      pathname="/compare"
      toc={[
        { id: "short-answer", label: "Short answer" },
        { id: "registries", label: "The registries" },
        { id: "not-for", label: "When not to pick duck/ui" },
        { id: "install", label: "Install" },
      ]}
    >
      <JsonLd
        data={itemListSchema({
          name: "duck/ui compared to other shadcn registries",
          description:
            "Comparisons between duck/ui and the other registries people evaluate alongside it.",
          path: "/compare",
          items: comparisons.map((item) => ({
            name: `duck/ui vs ${item.name}`,
            description: item.summary,
            path: `/compare/${item.slug}`,
          })),
        })}
      />

      <DocSection id="short-answer" title="Short answer">
        <Prose>
          <p>
            <strong>
              duck/ui is a theme-first shadcn registry: the first install is a
              token set that restyles the shadcn components already in your
              project, and the components that follow are the ones shadcn does
              not ship.
            </strong>{" "}
            Most other registries are component-first — a catalogue of effects
            or of coverage — which makes them complements rather than
            competitors. The honest comparison is not &ldquo;which registry
            wins&rdquo; but &ldquo;which problem do you have&rdquo;: a look that
            reads generic, an effect you are missing, or behaviour that is
            expensive to build.
          </p>
          <p>
            Everything on this page is compared against publicly documented
            positioning as of {comparisonsVerified}. Counts and feature lists
            move fast in this ecosystem — check the other project before you
            decide.
          </p>
        </Prose>
      </DocSection>

      <DocSection
        id="registries"
        title="The registries"
        description="One page each, with the case for picking the other one stated first."
      >
        <ul className="grid gap-3 sm:grid-cols-2">
          {comparisons.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/compare/${item.slug}`}
                className="group flex h-full flex-col gap-2 rounded-xl border-2 border-border p-4 transition-colors hover:border-primary/50"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-display font-bold group-hover:text-primary">
                    duck/ui vs {item.name}
                  </span>
                  <HoloBadge variant="muted">compare</HoloBadge>
                </span>
                <span className="text-sm text-pretty text-muted-foreground">
                  {item.summary}
                </span>
                <span className="mt-auto pt-1 font-mono text-xs text-muted-foreground">
                  {item.category}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection
        id="not-for"
        title="When not to pick duck/ui"
        description="Three cases where the answer is genuinely something else."
      >
        <Prose>
          <ul>
            <li>
              <strong>You already have brand tokens.</strong> The value here is
              the opinion. If a design team already decided the colours, plain
              shadcn/ui plus your own token file is less work and less to
              unpick.
            </li>
            <li>
              <strong>You need a board, a chart or an editor.</strong> duck/ui
              stops at controls, surfaces, feedback and three blocks. Kibo UI
              and standard shadcn cover that ground and the theme styles both.
            </li>
            <li>
              <strong>Light mode is the product.</strong> duck/ui is designed
              dark first and light is derived from it. It works, but a
              light-first product is not what the system was drawn for.
            </li>
          </ul>
        </Prose>
      </DocSection>

      <DocSection
        id="install"
        title="Install"
        description="One line in components.json, then the theme."
      >
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <InstallCommand command={site.install} />
          <HoloButton asChild variant="outline">
            <Link href="/docs/installation">Read the install guide</Link>
          </HoloButton>
        </div>
      </DocSection>
    </DocShell>
  );
}
