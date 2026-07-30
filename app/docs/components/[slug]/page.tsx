import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { components, getComponent } from "@/lib/registry-docs";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocSection, DocShell, Prose } from "@/components/docs/doc-shell";
import { InstallTabs } from "@/components/docs/install-tabs";
import { PropsTable } from "@/components/docs/props-table";
import { HoloBadge } from "@/components/ui/holo-badge";
import { previews } from "@/components/previews";

export function generateStaticParams() {
  return components.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getComponent(slug);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.summary,
    alternates: { canonical: `/docs/components/${slug}` },
    keywords: [
      `${doc.title} react component`,
      `shadcn ${slug}`,
      doc.category.toLowerCase(),
      "tailwind component",
    ],
    openGraph: {
      type: "article",
      url: `/docs/components/${slug}`,
      title: doc.title,
      description: doc.summary,
    },
  };
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getComponent(slug);
  if (!doc) notFound();

  const hasPreview = slug in previews;
  const importable = doc.exports.filter(
    (name) =>
      !name.endsWith("Variants") &&
      name !== "DuckGlyph" &&
      // Constants (SCREAMING_CASE) are documented in Props, not imported for
      // the common case.
      name !== name.toUpperCase()
  );
  const usage = `import { ${importable.join(", ")} } from "@/components/ui/${slug}"`;

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
      pathname={`/docs/components/${slug}`}
      toc={toc}
    >
      <div className="-mt-6 flex flex-wrap items-center gap-2">
        <HoloBadge variant="muted">{doc.category}</HoloBadge>
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
          <ComponentPreview
            name={slug as keyof typeof previews}
            replay={doc.client}
          />
        </DocSection>
      )}

      <DocSection
        id="installation"
        title="Installation"
        description="The CLI writes the source into your project and pulls in whatever it depends on."
      >
        <InstallTabs args={`add @duck/${slug}`} />
        {doc.registryDependencies && (
          <Prose>
            <p>
              Pulls in{" "}
              {doc.registryDependencies.map((dependency, index) => (
                <span key={dependency}>
                  {index > 0 && ", "}
                  <code>{dependency}</code>
                </span>
              ))}
              . Already installed items are skipped.
            </p>
          </Prose>
        )}
      </DocSection>

      <DocSection id="usage" title="Usage">
        <CodeBlock code={usage} lang="tsx" />
        <Prose>
          <p>
            The file lands in <code>components/ui/{slug}.tsx</code> and belongs
            to you from that point on. Edit it in place rather than wrapping it.
          </p>
        </Prose>
      </DocSection>

      <DocSection
        id="props"
        title="Props"
        description="Everything not listed here is forwarded to the underlying element."
      >
        <PropsTable props={doc.props} />
      </DocSection>

      {doc.rules && doc.rules.length > 0 && (
        <DocSection
          id="rules"
          title="Rules"
          description="What keeps this component from turning into noise."
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
