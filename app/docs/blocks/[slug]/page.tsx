import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { blocks, getBlock } from "@/lib/registry-docs";
import { BlockPreview } from "@/components/docs/block-preview";
import { CodeBlock } from "@/components/docs/code-block";
import { DocSection, DocShell, Prose } from "@/components/docs/doc-shell";
import { InstallTabs } from "@/components/docs/install-tabs";
import { PropsTable } from "@/components/docs/props-table";
import { HoloBadge } from "@/components/ui/holo-badge";
import { blockPreviews } from "@/components/previews/blocks";

export function generateStaticParams() {
  return blocks.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getBlock(slug);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.summary,
    alternates: { canonical: `/docs/blocks/${slug}` },
    keywords: [
      `${doc.title} react block`,
      `shadcn ${slug}`,
      "tailwind section",
      "shadcn block",
    ],
    openGraph: {
      type: "article",
      url: `/docs/blocks/${slug}`,
      title: doc.title,
      description: doc.summary,
    },
  };
}

export default async function BlockPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getBlock(slug);
  if (!doc) notFound();

  const hasPreview = slug in blockPreviews;
  const usage = `import { ${doc.exports.join(", ")} } from "@/components/blocks/${slug}"`;

  const toc = [
    { id: "preview", label: "Preview" },
    { id: "installation", label: "Installation" },
    { id: "usage", label: "Usage" },
    { id: "props", label: "Props" },
    ...(doc.rules?.length ? [{ id: "rules", label: "Rules" }] : []),
  ];

  return (
    <DocShell
      title={doc.title}
      description={doc.summary}
      pathname={`/docs/blocks/${slug}`}
      toc={toc}
    >
      <div className="-mt-6 flex flex-wrap items-center gap-2">
        <HoloBadge variant="muted">Block</HoloBadge>
        <HoloBadge variant="outline">
          {doc.client ? "Client component" : "Server safe"}
        </HoloBadge>
        {doc.dependencies?.map((dependency) => (
          <HoloBadge key={dependency} variant="muted">
            {dependency}
          </HoloBadge>
        ))}
      </div>

      {hasPreview && (
        <DocSection id="preview" title="Preview">
          <BlockPreview
            name={slug as keyof typeof blockPreviews}
            replay={doc.client}
          />
        </DocSection>
      )}

      <DocSection
        id="installation"
        title="Installation"
        description="One command writes the section and every component it renders."
      >
        <InstallTabs args={`add @duck/${slug}`} />
        <Prose>
          <p>
            The block lands in <code>{doc.target}</code>. It builds on{" "}
            {doc.composes.map((dependency, index) => (
              <span key={dependency}>
                {index > 0 && (index === doc.composes.length - 1 ? " and " : ", ")}
                <Link href={`/docs/components/${dependency}`}>
                  <code>{dependency}</code>
                </Link>
              </span>
            ))}
            , which the CLI installs alongside it. Already installed items are
            skipped.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock code={usage} lang="tsx" />
        <Prose>
          <p>
            A block is a starting point, not a widget. The props exist so the
            example renders with real content — once the file is in your
            project, hard-code what never changes and delete the rest.
          </p>
        </Prose>
      </DocSection>

      <DocSection
        id="props"
        title="Props"
        description="Everything not listed here is forwarded to the root element."
      >
        <PropsTable props={doc.props} />
      </DocSection>

      {doc.rules && doc.rules.length > 0 && (
        <DocSection
          id="rules"
          title="Rules"
          description="What keeps this section from turning into noise."
        >
          <Prose>
            <ul>
              {doc.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </Prose>
        </DocSection>
      )}
    </DocShell>
  );
}
