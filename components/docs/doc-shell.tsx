import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { getPager } from "@/lib/doc-routes";

export interface TocItem {
  id: string;
  label: string;
}

/**
 * DocShell — one page frame for every doc: title block, content column, on
 * this page rail, and the pager that keeps the reader moving.
 */
export function DocShell({
  title,
  description,
  pathname,
  toc,
  children,
}: {
  title: string;
  description: string;
  pathname: string;
  toc?: TocItem[];
  children: React.ReactNode;
}) {
  const { previous, next } = getPager(pathname);

  return (
    <div className="flex gap-10">
      <article className="min-w-0 flex-1 pb-16">
        <header className="mb-10 flex flex-col gap-3">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-balance">
            {title}
          </h1>
          <p className="max-w-2xl text-lg text-pretty text-muted-foreground">
            {description}
          </p>
        </header>

        <div className="flex flex-col gap-12">{children}</div>

        {(previous || next) && (
          <nav
            aria-label="Pagination"
            className="mt-16 grid gap-3 border-t border-border pt-6 sm:grid-cols-2"
          >
            {previous ? (
              <Link
                href={previous.href}
                className="group flex flex-col gap-1 rounded-xl border-2 border-border p-4 transition-colors hover:border-primary/50"
              >
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-0.5" />
                  Previous
                </span>
                <span className="font-semibold">{previous.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                href={next.href}
                className="group flex flex-col items-end gap-1 rounded-xl border-2 border-border p-4 text-right transition-colors hover:border-primary/50 sm:col-start-2"
              >
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  Next
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="font-semibold">{next.title}</span>
              </Link>
            )}
          </nav>
        )}
      </article>

      {toc && toc.length > 0 && (
        <aside className="hidden w-52 shrink-0 xl:block">
          <div className="sticky top-24">
            <h2 className="mb-3 font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
              On this page
            </h2>
            <ul className="flex flex-col gap-2 border-l border-border">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="-ml-px block border-l-2 border-transparent pl-3 text-sm text-muted-foreground transition-colors hover:border-border hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </div>
  );
}

/** A titled block inside a doc page, linkable from the rail. */
export function DocSection({
  id,
  title,
  description,
  children,
  className,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <h2 className="font-display text-2xl font-bold tracking-tight">
        <a href={`#${id}`} className="hover:text-primary">
          {title}
        </a>
      </h2>
      {description && (
        <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
      )}
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </section>
  );
}

/** Long-form copy inside a doc section. */
export function Prose({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "max-w-2xl text-pretty text-muted-foreground",
        "[&_a]:font-medium [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4",
        "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-foreground",
        "[&_li]:mb-1.5 [&_p]:mb-4 [&_p:last-child]:mb-0",
        "[&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        className
      )}
      {...props}
    />
  );
}
