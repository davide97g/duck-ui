"use client";

import * as React from "react";
import { Menu, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { DuckMark } from "@/components/ui/duck-mark";
import { HoloAvatar } from "@/components/ui/holo-avatar";
import { HoloBadge } from "@/components/ui/holo-badge";
import {
  StickerCard,
  StickerCardHeader,
  StickerCardTitle,
} from "@/components/ui/sticker-card";
import { StickerKbd } from "@/components/ui/sticker-kbd";
import { StickerProgress } from "@/components/ui/sticker-progress";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

/**
 * DuckDashboard — the application shell: sidebar, top bar, optional stat row,
 * and your page under it as `children`.
 *
 * Chrome carries no holo. The one iridescent element belongs to whatever the
 * page is actually about, and the shell is on screen the whole session — an
 * animated border in the furniture would never stop moving.
 *
 * ThemeSwitcher needs a next-themes provider above this component. Drop the
 * `themeSwitcher` prop if the app has no theme toggle.
 */
export interface DuckDashboardNavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  active?: boolean;
  /** Trailing chip: a count, "new", "beta". */
  badge?: string;
  onSelect?: () => void;
}

export interface DuckDashboardStat {
  label: string;
  value: React.ReactNode;
  /** Small line under the value: a delta, a period, a target. */
  hint?: string;
  /** 0 to 100. Draws a progress bar under the value. */
  progress?: number;
}

export interface DuckDashboardProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  /** Sidebar identity. Defaults to the duck mark plus `brandLabel`. */
  brand?: React.ReactNode;
  brandLabel?: string;
  nav: DuckDashboardNavItem[];
  /** Second nav group, pinned to the bottom of the sidebar. */
  footerNav?: DuckDashboardNavItem[];
  /** Page title in the top bar. */
  title?: React.ReactNode;
  user?: { name: string; src?: string; fallback?: string };
  /** Renders the search control. Fires on click and on the command key. */
  onSearch?: () => void;
  searchLabel?: string;
  stats?: DuckDashboardStat[];
  /** Extra top-bar controls, left of the theme switcher. */
  actions?: React.ReactNode;
  themeSwitcher?: boolean;
  children?: React.ReactNode;
}

function NavList({
  items,
  onNavigate,
}: {
  items: DuckDashboardNavItem[];
  onNavigate: () => void;
}) {
  return (
    <ul className="flex flex-col gap-1">
      {items.map((item) => (
        <li key={item.label}>
          <a
            href={item.href ?? "#"}
            aria-current={item.active ? "page" : undefined}
            onClick={() => {
              item.onSelect?.();
              onNavigate();
            }}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium",
              "transition-colors duration-200 ease-[var(--ease-duck)]",
              "[&_svg]:size-4 [&_svg]:shrink-0",
              item.active
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {item.icon}
            <span className="truncate">{item.label}</span>
            {item.badge && (
              <HoloBadge variant="muted" className="ml-auto">
                {item.badge}
              </HoloBadge>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}

function DuckDashboard({
  className,
  brand,
  brandLabel = "duck/ui",
  nav,
  footerNav,
  title,
  user,
  onSearch,
  searchLabel = "Search",
  stats,
  actions,
  themeSwitcher = true,
  children,
  ...props
}: DuckDashboardProps) {
  const [open, setOpen] = React.useState(false);
  const closeNav = React.useCallback(() => setOpen(false), []);

  // The search control advertises the command key, so it has to honour it.
  React.useEffect(() => {
    if (!onSearch) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "k") return;
      if (!event.metaKey && !event.ctrlKey) return;
      event.preventDefault();
      onSearch();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onSearch]);

  return (
    <div
      data-slot="duck-dashboard"
      className={cn(
        // Named container: the shell adapts to its own width, so it survives
        // being embedded in a page that is not the whole window.
        "@container/shell flex min-h-svh w-full bg-background text-foreground",
        className
      )}
      {...props}
    >
      {/* Scrim for the drawer, which is what the sidebar is under 36rem. */}
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeNav}
          className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm @xl/shell:hidden"
        />
      )}

      <aside
        data-slot="duck-dashboard-sidebar"
        data-open={open || undefined}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col gap-6 border-r border-border bg-card p-4",
          "-translate-x-full transition-transform duration-300 ease-[var(--ease-duck)]",
          "data-[open]:translate-x-0",
          "@xl/shell:sticky @xl/shell:top-0 @xl/shell:h-svh @xl/shell:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 font-display font-extrabold tracking-tight">
            {brand ?? (
              <>
                <DuckMark className="size-6 text-primary" />
                {brandLabel}
              </>
            )}
          </span>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={closeNav}
            className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground @xl/shell:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav aria-label="Main" className="flex-1">
          <NavList items={nav} onNavigate={closeNav} />
        </nav>

        {footerNav && footerNav.length > 0 && (
          <nav aria-label="Secondary" className="border-t border-border pt-4">
            <NavList items={footerNav} onNavigate={closeNav} />
          </nav>
        )}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          data-slot="duck-dashboard-header"
          className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur @xl/shell:px-6"
        >
          <button
            type="button"
            aria-label="Open navigation"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground @xl/shell:hidden"
          >
            <Menu className="size-5" />
          </button>

          {title && (
            <h1 className="truncate font-display text-lg font-bold tracking-tight">
              {title}
            </h1>
          )}

          <div className="ml-auto flex items-center gap-2.5">
            {onSearch && (
              <button
                type="button"
                onClick={onSearch}
                className={cn(
                  "flex items-center gap-2 rounded-lg border border-border px-2.5 py-1.5",
                  "text-sm text-muted-foreground transition-colors duration-200",
                  "hover:border-primary/50 hover:text-foreground"
                )}
              >
                <Search className="size-4" />
                <span className="hidden @3xl/shell:inline">{searchLabel}</span>
                <StickerKbd watch="k" meta className="hidden @3xl/shell:inline-flex">
                  ⌘K
                </StickerKbd>
              </button>
            )}
            {actions}
            {themeSwitcher && <ThemeSwitcher />}
            {user && (
              <HoloAvatar
                src={user.src}
                alt={user.name}
                fallback={user.fallback}
                size="sm"
                ring="primary"
              />
            )}
          </div>
        </header>

        <main
          data-slot="duck-dashboard-main"
          className="@container/main flex flex-1 flex-col gap-6 p-4 @xl/shell:p-6"
        >
          {stats && stats.length > 0 && (
            <div className="grid gap-4 @xs/main:grid-cols-2 @3xl/main:grid-cols-4">
              {stats.map((stat) => (
                <StickerCard key={stat.label} className="gap-3 p-5">
                  <StickerCardHeader>
                    <StickerCardTitle className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      {stat.label}
                    </StickerCardTitle>
                  </StickerCardHeader>
                  <p className="font-display text-3xl font-extrabold tracking-tight tabular-nums">
                    {stat.value}
                  </p>
                  {stat.progress !== undefined && (
                    <StickerProgress value={stat.progress} />
                  )}
                  {stat.hint && (
                    <p className="text-xs text-muted-foreground">{stat.hint}</p>
                  )}
                </StickerCard>
              ))}
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}

export { DuckDashboard };
