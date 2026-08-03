import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * DuckStatGrid — the hairline grid: one border colour showing through a 1px
 * gap, with the cells painted on top.
 *
 * `gap-px` on a --border background is the whole trick. It beats a border per
 * cell because there is no doubling on shared edges, nothing to reset on the
 * first or last column, and the rules stay exactly one device pixel at any
 * radius or zoom. It is four lines of CSS and every site rebuilds it, which is
 * the argument for shipping it.
 *
 * The cells are --background rather than --card on purpose: the grid reads as
 * the canvas divided up, not as a row of floating panels. Pass bg-card on a
 * cell if a panel is what you want.
 */

const columns = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

function DuckStatGrid({
  className,
  cols = 3,
  bordered = true,
  children,
  ...props
}: React.ComponentProps<"dl"> & {
  cols?: keyof typeof columns;
  /** Draw the outer edge as well as the inner rules. */
  bordered?: boolean;
}) {
  return (
    <dl
      data-slot="duck-stat-grid"
      className={cn(
        "grid grid-cols-1 gap-px overflow-hidden bg-border",
        columns[cols],
        bordered && "sticker rounded-xl border-border",
        className
      )}
      {...props}
    >
      {children}
    </dl>
  );
}

function DuckStat({
  className,
  label,
  value,
  hint,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  label: React.ReactNode;
  value: React.ReactNode;
  /** A line under the value: a delta, a unit, a date. */
  hint?: React.ReactNode;
  /** Anything extra — a sparkline, a badge — under the hint. */
  children?: React.ReactNode;
}) {
  return (
    <div
      data-slot="duck-stat"
      className={cn(
        "flex flex-col gap-1.5 bg-background p-5",
        "transition-colors duration-300 ease-[var(--ease-duck)] hover:bg-muted/40",
        className
      )}
      {...props}
    >
      {/* dt before dd, and the label first in the DOM, because that is the
          reading order a screen reader announces. Visually the value leads. */}
      <dt className="hud hud-sm">{label}</dt>
      <dd className="flex flex-col gap-1">
        <span className="font-display text-2xl leading-none font-bold tabular-nums">
          {value}
        </span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
        {children}
      </dd>
    </div>
  );
}

export { DuckStatGrid, DuckStat };
