import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * DuckList / DuckListHeader — column labels over a stack of DuckListRows, and
 * the sort control that belongs to them.
 *
 * This exists to delete the `w-32 sm:w-40` that gets pasted onto every row of
 * an admin list, and drifts on the row somebody edited last. DuckList writes
 * the track list once as `--duck-list-cols`; the header and every row with
 * `cells` read it. One place to change a column width, and the header can
 * never disagree with the rows.
 *
 * A custom property rather than subgrid, which is the other correct answer:
 * subgrid needs every row to be a direct child of the grid, so it breaks the
 * moment a row is wrapped in an <li>, a motion.div or a virtualiser. An
 * inherited property survives any depth of nesting, and it survives a
 * className override on either side. The price is that tracks must size
 * without looking at content — `1fr`, `8rem`, `15%`, `minmax()`. `auto` and
 * `max-content` resolve per row, so they would land back at columns that do
 * not line up.
 *
 * DuckList takes the column definitions and renders the header itself, rather
 * than asking for the same array twice. If the header has to live somewhere
 * else — sticky above a scroll container — use DuckListHeader directly and
 * pass it the same array.
 *
 * No role="table" / role="row" / role="columnheader" anywhere, and so no
 * `aria-sort` either: `aria-sort` is only defined on a columnheader, a
 * columnheader needs a row inside a table, and a table's structure has to hold
 * for every descendant. It cannot here — rows arrive as a separate component,
 * they are usually anchors (`asChild`), and role="row" on an <a> costs you the
 * link. Half a table role is worse than none, so this is plain divs, and the
 * sort direction is in the button's accessible name in words instead. If you
 * need real table semantics — row selection, resizable columns, a caption —
 * you want a <table>, not this.
 */

export type DuckListSortDirection = "ascending" | "descending";

export interface DuckListSort {
  key: string;
  direction: DuckListSortDirection;
}

export interface DuckListColumn {
  /** Identifies the column to `sort` and `onSortChange`. Also the React key. */
  key: string;
  label: React.ReactNode;
  /**
   * The grid track for this column. Anything that sizes without content:
   * `1fr`, `8rem`, `15%`, `minmax(0, 12rem)`. Not `auto` or `max-content` —
   * those resolve per row and the columns stop lining up. Defaults to an even
   * share of the width.
   */
  width?: string;
  /** Draw the label as a sort button. Needs `onSortChange` to do anything. */
  sortable?: boolean;
}

/**
 * The header and the rows both fall back to their own even split when no
 * DuckList wrapper is above them, so a header on its own still looks right.
 */
function trackList(columns: DuckListColumn[]) {
  return columns.map((column) => column.width ?? "minmax(0, 1fr)").join(" ");
}

export interface DuckListProps extends React.ComponentProps<"div"> {
  columns: DuckListColumn[];
  /** Which column the rows are ordered by. Controlled — sort your own data. */
  sort?: DuckListSort;
  onSortChange?: (sort: DuckListSort) => void;
  /** Set false for a column-aligned list that wants no labels over it. */
  header?: boolean;
}

function DuckList({
  className,
  columns,
  sort,
  onSortChange,
  header = true,
  style,
  children,
  ...props
}: DuckListProps) {
  return (
    <div
      data-slot="duck-list"
      className={cn("w-full", className)}
      style={
        {
          "--duck-list-cols": trackList(columns),
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {header && (
        <DuckListHeader
          columns={columns}
          sort={sort}
          onSortChange={onSortChange}
        />
      )}
      {children}
    </div>
  );
}

export interface DuckListHeaderProps extends React.ComponentProps<"div"> {
  columns: DuckListColumn[];
  sort?: DuckListSort;
  onSortChange?: (sort: DuckListSort) => void;
}

function DuckListHeader({
  className,
  columns,
  sort,
  onSortChange,
  style,
  ...props
}: DuckListHeaderProps) {
  return (
    <div
      data-slot="duck-list-header"
      className={cn(
        // pl-3 is the gutter a column row keeps for its leading rule. Without
        // it here the labels sit 0.75rem left of the cells they name.
        "grid items-end gap-4 border-b border-border pb-2 pl-3",
        className
      )}
      style={{
        gridTemplateColumns: `var(--duck-list-cols, ${trackList(columns)})`,
        ...style,
      }}
      {...props}
    >
      {columns.map((column) => {
        const direction = sort?.key === column.key ? sort.direction : undefined;

        if (!column.sortable) {
          return (
            <div key={column.key} className="hud hud-sm min-w-0 truncate">
              {column.label}
            </div>
          );
        }

        const Chevron = direction === "ascending" ? ChevronUp : ChevronDown;

        return (
          <button
            key={column.key}
            type="button"
            data-slot="duck-list-header-sort"
            data-sort={direction}
            className={cn(
              "hud hud-sm group/sort flex min-w-0 cursor-pointer items-center gap-1.5 rounded-sm text-left",
              "transition-colors duration-300 ease-[var(--ease-duck)]",
              "hover:text-foreground data-[sort]:text-primary",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            )}
            // First click on a column sorts it ascending; clicking the column
            // that is already sorted flips it. Nothing here holds state — the
            // list that owns the data owns the order.
            onClick={() =>
              onSortChange?.({
                key: column.key,
                direction:
                  direction === "ascending" ? "descending" : "ascending",
              })
            }
          >
            <span className="truncate">{column.label}</span>
            {/* The direction in words. The chevron is decoration: a screen
                reader gets "last seen, sorted descending" from the name. */}
            <span className="sr-only">
              {direction ? `, sorted ${direction}` : ", sortable"}
            </span>
            <Chevron
              aria-hidden
              className={cn(
                "size-3 shrink-0 transition-opacity duration-300",
                // An unsorted column keeps its affordance but not its clutter.
                direction
                  ? "opacity-100"
                  : "opacity-0 group-hover/sort:opacity-50 group-focus-visible/sort:opacity-50"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

export { DuckList, DuckListHeader };
