import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { comparisons, comparisonsVerified, getComparison } from "@/lib/comparisons";
import { site } from "@/lib/site";
import { DocSection, DocShell, Prose } from "@/components/docs/doc-shell";
import { JsonLd, faqSchema } from "@/components/seo/structured-data";
import { HoloButton } from "@/components/ui/holo-button";
import { InstallCommand } from "@/components/site/install-command";

export function generateStaticParams() {
  return comparisons.map((item) => ({ slug: item.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getComparison(slug);
  if (!item) return {};

  const title = `duck/ui vs ${item.name}`;
  return {
    title,
    description: `${item.summary} How ${item.name} and duck/ui differ, who each one is for, and whether they can be used together.`,
    alternates: { canonical: `/compare/${item.slug}` },
    openGraph: { title: `${title} | ${site.name}`, url: `/compare/${item.slug}` },
  };
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getComparison(slug);
  if (!item) notFound();

  return (
    <DocShell
      title={`duck/ui vs ${item.name}`}
      description={item.summary}
      pathname={`/compare/${item.slug}`}
      toc={[
        { id: "short-answer", label: "Short answer" },
        { id: "strengths", label: `What ${item.name} does well` },
        { id: "differences", label: "Where they differ" },
        { id: "choose", label: "Which to pick" },
        { id: "together", label: "Using both" },
        { id: "faq", label: "FAQ" },
      ]}
    >
      <JsonLd data={faqSchema(item.faq, `/compare/${item.slug}`)} />

      <DocSection id="short-answer" title="Short answer">
        <Prose>
          <p>
            <strong>{item.shortAnswer}</strong>
          </p>
          <p>
            <a href={item.url} rel="noopener noreferrer" target="_blank">
              {item.name}
            </a>{" "}
            is best described as: {item.category.toLowerCase()}. Compared
            against its publicly documented positioning as of{" "}
            {comparisonsVerified}.
          </p>
        </Prose>
      </DocSection>

      <DocSection
        id="strengths"
        title={`What ${item.name} does well`}
        description="Stated first, because a comparison that skips this is not worth reading."
      >
        <Prose>
          <ul>
            {item.strengths.map((strength) => (
              <li key={strength}>{strength}</li>
            ))}
          </ul>
        </Prose>
      </DocSection>

      <DocSection id="differences" title="Where they differ">
        <div className="overflow-x-auto rounded-xl border-2 border-border">
          <table className="w-full min-w-[34rem] border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-border bg-muted/40 text-left">
                <th scope="col" className="p-3 font-display font-bold">
                  &nbsp;
                </th>
                <th scope="col" className="p-3 font-display font-bold">
                  {item.name}
                </th>
                <th scope="col" className="p-3 font-display font-bold text-primary">
                  duck/ui
                </th>
              </tr>
            </thead>
            <tbody>
              {item.axes.map((row) => (
                <tr key={row.axis} className="border-b border-border last:border-b-0">
                  <th
                    scope="row"
                    className="p-3 text-left align-top font-medium text-foreground"
                  >
                    {row.axis}
                  </th>
                  <td className="p-3 align-top text-muted-foreground">
                    {row.them}
                  </td>
                  <td className="p-3 align-top text-muted-foreground">
                    {row.duck}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection id="choose" title="Which to pick">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-2xl border-2 border-border bg-card p-6">
            <h3 className="font-display text-lg font-bold tracking-tight">
              Pick {item.name}
            </h3>
            <p className="text-sm text-pretty text-muted-foreground">
              {item.pickThem}
            </p>
            <a
              href={item.url}
              rel="noopener noreferrer"
              target="_blank"
              className="mt-auto pt-1 text-sm font-medium underline underline-offset-4"
            >
              Visit {item.name}
            </a>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border-2 border-border bg-card p-6">
            <h3 className="font-display text-lg font-bold tracking-tight text-primary">
              Pick duck/ui
            </h3>
            <p className="text-sm text-pretty text-muted-foreground">
              {item.pickDuck}
            </p>
            <Link
              href="/docs/installation"
              className="mt-auto pt-1 text-sm font-medium underline underline-offset-4"
            >
              Read the install guide
            </Link>
          </div>
        </div>
      </DocSection>

      <DocSection id="together" title="Using both">
        <Prose>
          <p>{item.together}</p>
        </Prose>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <InstallCommand command={site.install} />
          <HoloButton asChild variant="outline">
            <Link href="/compare">See every comparison</Link>
          </HoloButton>
        </div>
      </DocSection>

      <DocSection id="faq" title="FAQ">
        <div className="grid gap-4 md:grid-cols-2">
          {item.faq.map((entry) => (
            <div
              key={entry.question}
              className="flex flex-col gap-3 rounded-2xl border-2 border-border bg-card p-6"
            >
              <h3 className="font-display text-base font-bold tracking-tight text-balance">
                {entry.question}
              </h3>
              <p className="text-sm text-pretty text-muted-foreground">
                {entry.answer}
              </p>
            </div>
          ))}
        </div>
      </DocSection>
    </DocShell>
  );
}
