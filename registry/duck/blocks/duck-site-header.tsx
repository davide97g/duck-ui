"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { HoloButton } from "@/components/ui/holo-button";

/**
 * DuckSiteHeader — the top of a content site: identity, a handful of anchors, a
 * burger below lg, and whatever controls the site keeps up there.
 *
 * Links are plain anchors so the block works in any framework. Pass a router
 * link through `render` when you want client navigation:
 *
 *   render={(item, className) => <Link href={item.href} className={className}>{item.label}</Link>}
 *
 * The drawer is real: Escape closes it, the toggle owns aria-expanded and
 * aria-controls, and the panel is a second <nav> rather than the same one
 * re-laid-out, because a menu that only exists at one width should not leave a
 * hidden tab stop at the other.
 */

export interface DuckSiteHeaderItem {
  label: string;
  href: string;
  /** Marks the current section. The block does not guess from the URL. */
  active?: boolean;
  /** Opens in a new tab, with rel handled. */
  external?: boolean;
}

export interface DuckSiteHeaderProps extends React.ComponentProps<"header"> {
  /** Wordmark, logo, or the site name as text. */
  brand: React.ReactNode;
  brandHref?: string;
  nav?: DuckSiteHeaderItem[];
  /** The one action on the right. */
  cta?: { label: string; href: string };
  /** Search, theme switcher, language toggle — anything left of the CTA. */
  actions?: React.ReactNode;
  /** Stick to the top of the viewport with a blurred backdrop. */
  sticky?: boolean;
  /** Swap the anchors for a framework link. */
  render?: (item: DuckSiteHeaderItem, className: string) => React.ReactNode;
}

function DuckSiteHeader({
  className,
  brand,
  brandHref = "/",
  nav = [],
  cta,
  actions,
  sticky = true,
  render,
  ...props
}: DuckSiteHeaderProps) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const link = (item: DuckSiteHeaderItem, classes: string) =>
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
    <header
      data-slot="duck-site-header"
      className={cn(
        "z-50 w-full border-b border-border/70",
        sticky && "sticky top-0 bg-background/80 backdrop-blur-xl",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-4 sm:px-6">
        <a
          href={brandHref}
          className="shrink-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {brand}
        </a>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <React.Fragment key={item.href}>
              {link(
                item,
                cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200",
                  item.active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )
              )}
            </React.Fragment>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {actions}
          {cta && (
            <HoloButton asChild variant="primary" size="sm" className="hidden sm:inline-flex">
              <a href={cta.href}>{cta.label}</a>
            </HoloButton>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="duck-site-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-9 cursor-pointer place-items-center rounded-lg border border-border text-muted-foreground lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="duck-site-nav"
          aria-label="Main"
          className="border-t border-border bg-background px-4 py-3 lg:hidden"
          onClick={() => setOpen(false)}
        >
          <ul className="flex flex-col">
            {nav.map((item) => (
              <li key={item.href}>
                {link(
                  item,
                  cn(
                    "block rounded-lg px-2 py-2.5 text-sm font-medium transition-colors",
                    item.active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )
                )}
              </li>
            ))}
            {cta && (
              <li className="pt-2 sm:hidden">
                <HoloButton asChild variant="primary" size="sm" className="w-full">
                  <a href={cta.href}>{cta.label}</a>
                </HoloButton>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}

export { DuckSiteHeader };
