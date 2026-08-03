import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * DuckSiteFooter — the bottom of a content site: identity and a sentence, three
 * or four link columns, then one hairline and the small print.
 *
 * Every column is a real <nav> with its heading as the accessible name, because
 * a footer is a navigation landmark and a screen reader lands in it looking for
 * exactly that. The columns are h2 by default — override with `headingLevel` if
 * the page already spends h2 on its sections.
 *
 * Links are plain anchors; pass `render` for a framework link, as on
 * DuckSiteHeader.
 */

export interface DuckSiteFooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface DuckSiteFooterColumn {
  title: string;
  links: DuckSiteFooterLink[];
}

export interface DuckSiteFooterProps extends React.ComponentProps<"footer"> {
  /** Mark, wordmark or site name. */
  brand?: React.ReactNode;
  /** One sentence under the brand. Not a mission statement. */
  description?: React.ReactNode;
  columns?: DuckSiteFooterColumn[];
  /** Bottom-left: copyright, credit, a build note. */
  note?: React.ReactNode;
  /** Bottom-right: privacy, terms, licence. */
  legal?: DuckSiteFooterLink[];
  headingLevel?: "h2" | "h3" | "p";
  render?: (link: DuckSiteFooterLink, className: string) => React.ReactNode;
}

function DuckSiteFooter({
  className,
  brand,
  description,
  columns = [],
  note,
  legal = [],
  headingLevel: Heading = "h2",
  render,
  ...props
}: DuckSiteFooterProps) {
  const link = (item: DuckSiteFooterLink, classes: string) =>
    render?.(item, classes) ?? (
      <a
        href={item.href}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
        className={classes}
      >
        {item.label}
      </a>
    );

  return (
    <footer
      data-slot="duck-site-footer"
      className={cn("w-full border-t border-border", className)}
      {...props}
    >
      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6">
        <div
          className={cn(
            "grid gap-10",
            columns.length > 0 && "md:grid-cols-[1.4fr_repeat(auto-fit,minmax(8rem,1fr))]"
          )}
        >
          {(brand || description) && (
            <div className="flex flex-col gap-4">
              {brand}
              {description && (
                <p className="max-w-xs text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          )}

          {columns.map((column) => (
            <nav
              key={column.title}
              aria-label={column.title}
              className="flex flex-col gap-3"
            >
              <Heading className="font-display text-sm font-bold">
                {column.title}
              </Heading>
              <ul className="flex flex-col gap-2">
                {column.links.map((item) => (
                  <li key={`${column.title}-${item.href}`}>
                    {link(
                      item,
                      "text-sm text-muted-foreground transition-colors hover:text-foreground"
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {(note || legal.length > 0) && (
          <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            {note && <p>{note}</p>}
            {legal.length > 0 && (
              <nav
                aria-label="Legal"
                className="flex flex-wrap items-center gap-x-4 gap-y-1"
              >
                {legal.map((item) => (
                  <React.Fragment key={item.href}>
                    {link(item, "transition-colors hover:text-foreground")}
                  </React.Fragment>
                ))}
              </nav>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}

export { DuckSiteFooter };
