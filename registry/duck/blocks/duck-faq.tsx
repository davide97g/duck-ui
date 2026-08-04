import * as React from "react";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { StickerCard } from "@/components/ui/sticker-card";

/**
 * DuckFaq — the questions people ask before they install, and the FAQPage
 * JSON-LD that lets an answer engine quote them.
 *
 * The markup and the schema read the same array, which is the whole reason this
 * is a component and not a heading with divs under it: an FAQ section and its
 * structured data drift the moment they are two lists, and a `FAQPage` that
 * describes questions the page no longer asks is worse than none.
 *
 * `collapsible` uses native `<details>`, so the answers are in the DOM whether
 * the panel is open or not — a crawler reads them, ⌘F finds them, and the
 * section works with JavaScript off. This block ships no client code of its own
 * for exactly that reason.
 *
 * An answer can be a node, for a link or a `<code>` in the prose. JSON-LD needs
 * a string, so a node answer wants `answerText` beside it; without one the item
 * is left out of the schema rather than serialised as "[object Object]".
 */
export interface DuckFaqItem {
  question: string;
  answer: React.ReactNode;
  /** Plain-text answer for the JSON-LD, when `answer` is not a string. */
  answerText?: string;
}

export interface DuckFaqProps
  extends Omit<React.ComponentProps<"section">, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  items: DuckFaqItem[];
  /** One column reads as a list, two as a wall. Two suits eight or more. */
  columns?: 1 | 2;
  /** Answers behind a native disclosure. Still in the DOM, still crawlable. */
  collapsible?: boolean;
  /** With `collapsible`, the index that starts open. */
  defaultOpen?: number;
  /** Emit the FAQPage JSON-LD. Turn it off if the page already has one. */
  jsonLd?: boolean;
  /**
   * Absolute URL of the page carrying the schema. Google wants one `FAQPage`
   * per URL, and the `@id` is what keeps two sections from claiming the same.
   */
  url?: string;
  /** Under the grid: a support link, a mail-to, a "still stuck?" line. */
  footer?: React.ReactNode;
}

/**
 * The one thing worth getting right in the schema: `acceptedAnswer` is plain
 * text, so an answer written as a node has to say what it means in words.
 */
function faqSchema(items: DuckFaqItem[], url?: string) {
  const answerable = items.flatMap((item) => {
    const text = item.answerText ?? (typeof item.answer === "string" ? item.answer : null);
    return text
      ? [
          {
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text },
          },
        ]
      : [];
  });

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(url ? { "@id": `${url}#faq` } : {}),
    mainEntity: answerable,
  };
}

function DuckFaq({
  className,
  title,
  description,
  items,
  columns = 2,
  collapsible = false,
  defaultOpen,
  jsonLd = true,
  url,
  footer,
  ...props
}: DuckFaqProps) {
  const schema = jsonLd ? faqSchema(items, url) : null;

  return (
    <section
      data-slot="duck-faq"
      className={cn(
        "@container mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 lg:py-28",
        className
      )}
      {...props}
    >
      {/* Emitted from the component, from the same array as the markup. */}
      {schema && schema.mainEntity.length > 0 && (
        <script
          type="application/ld+json"
          // The content is this component's own object, not user HTML: no tag
          // can close the script, and JSON.stringify escapes what remains.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      )}

      {(title || description) && (
        <div className="mb-10 flex max-w-2xl flex-col gap-4">
          {title && (
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-pretty text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      <div
        data-slot="duck-faq-grid"
        className={cn("grid gap-4", columns === 2 && "@3xl:grid-cols-2")}
      >
        {items.map((item, index) =>
          collapsible ? (
            <StickerCard
              key={item.question}
              asChild
              className="gap-0 p-0 [&[open]>summary>svg]:rotate-45"
            >
              <details open={index === defaultOpen}>
                {/* A summary is the disclosure's own button. Nothing else in
                    here is focusable, so the section needs no key handling. */}
                <summary
                  className={cn(
                    "flex cursor-pointer list-none items-start justify-between gap-4 rounded-2xl p-6",
                    "font-display text-lg font-bold tracking-tight text-balance",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none",
                    "[&::-webkit-details-marker]:hidden"
                  )}
                >
                  {item.question}
                  <Plus
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-[var(--ease-duck)]"
                  />
                </summary>
                <div className="px-6 pb-6 text-sm text-pretty text-muted-foreground">
                  {item.answer}
                </div>
              </details>
            </StickerCard>
          ) : (
            <StickerCard key={item.question} className="h-full gap-3">
              <h3 className="font-display text-lg font-bold tracking-tight text-balance">
                {item.question}
              </h3>
              <div className="text-sm text-pretty text-muted-foreground">
                {item.answer}
              </div>
            </StickerCard>
          )
        )}
      </div>

      {footer && (
        <div className="mt-10 text-sm text-muted-foreground">{footer}</div>
      )}
    </section>
  );
}

export { DuckFaq, faqSchema };
