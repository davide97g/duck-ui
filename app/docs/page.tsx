import type { Metadata } from "next";
import Link from "next/link";

import { components } from "@/lib/registry-docs";
import { site } from "@/lib/site";
import { DocSection, DocShell, Prose } from "@/components/docs/doc-shell";
import { CodeBlock } from "@/components/docs/code-block";
import { HoloButton } from "@/components/ui/holo-button";

export const metadata: Metadata = {
  title: "Introduction",
  description:
    "What duck/ui is, what it is not, and the four rules the system runs on.",
};

const rules = [
  {
    title: "One holo per viewport",
    body: "The iridescent finish marks the single most important element on screen. A second one halves the value of the first.",
  },
  {
    title: "Lime is the meal, holo is the seasoning",
    body: "Default actions are solid duck lime. Reserve the gradient for the one thing you want remembered.",
  },
  {
    title: "Dark is designed first",
    body: "The dark palette is the reference. Light is derived from it and tested separately, not inverted.",
  },
  {
    title: "Semantic tokens only",
    body: "Components reference bg-primary and text-muted-foreground, never a raw color. Retuning the theme retunes the whole system.",
  },
];

export default function DocsIntroPage() {
  return (
    <DocShell
      title="duck/ui"
      description="A dark-first component registry with holographic accents and thick sticker borders. It rides on shadcn distribution, so the CLI, the MCP server and your editor already know what to do with it."
      pathname="/docs"
      toc={[
        { id: "what-it-is", label: "What it is" },
        { id: "rules", label: "The four rules" },
        { id: "whats-inside", label: "What ships" },
        { id: "next", label: "Where to go next" },
      ]}
    >
      <DocSection id="what-it-is" title="What it is">
        <Prose>
          <p>
            duck/ui is a <strong>registry</strong>, not a package. Nothing is
            imported from node_modules. The CLI copies source files into your
            project and from that moment the code is yours to edit, delete or
            rewrite.
          </p>
          <p>
            It is built on the shadcn registry schema, which means three things
            work without any code on our side: the <code>shadcn</code> CLI can
            install from it, the shadcn MCP server can browse it, and any
            assistant that reads <code>llms.txt</code> can follow its rules.
          </p>
          <p>
            The theme implements the full shadcn CSS variable contract. Install
            it and every shadcn component already in your project is restyled,
            with no markup changes.
          </p>
        </Prose>
        <CodeBlock
          lang="bash"
          code={`# add the registry namespace, then the theme
${site.install}`}
        />
      </DocSection>

      <DocSection
        id="rules"
        title="The four rules"
        description="These are enforced in the docs, in the skill, and in code review. They are what keeps a playful system from becoming a loud one."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {rules.map((rule) => (
            <div
              key={rule.title}
              className="flex flex-col gap-2 rounded-xl border-2 border-border bg-card p-5"
            >
              <h3 className="font-display font-bold tracking-tight">
                {rule.title}
              </h3>
              <p className="text-sm text-muted-foreground">{rule.body}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="whats-inside" title="What ships">
        <Prose>
          <p>
            One theme and {components.length} components. The theme is the part
            that matters most: it covers backgrounds, surfaces, borders, rings,
            charts and the duck extras that the components build on.
          </p>
          <p>
            The components are the pieces shadcn does not have. Anything
            standard, a dialog, a dropdown, a table, comes from shadcn itself
            and picks up the duck styling for free.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="next" title="Where to go next">
        <div className="flex flex-wrap gap-3">
          <HoloButton asChild variant="primary">
            <Link href="/docs/installation">Install it</Link>
          </HoloButton>
          <HoloButton asChild variant="outline">
            <Link href="/docs/theming">Read the token contract</Link>
          </HoloButton>
          <HoloButton asChild variant="ghost">
            <Link href="/docs/ai">Set up the AI surface</Link>
          </HoloButton>
        </div>
      </DocSection>
    </DocShell>
  );
}
