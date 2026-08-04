"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { DuckList, type DuckListColumn, type DuckListSort } from "@/components/ui/duck-list-header";
import { DuckListRow } from "@/components/ui/duck-list-row";
import { EmptyPond } from "@/components/ui/empty-pond";
import { GlowSearch } from "@/components/ui/glow-search";
import { QuackButton } from "@/components/ui/quack-button";
import { StickerSkeleton } from "@/components/ui/sticker-skeleton";

/**
 * DuckListView — the admin list: a search field, column labels, sortable rows,
 * and the four states the data can actually be in.
 *
 * DuckList already writes the column tracks once and DuckListRow already reads
 * them. What every application then writes around them is the state machine, and
 * it gets one case wrong nearly every time.
 *
 * **Empty is two different screens.** "Nothing here yet" is an invitation and
 * wants an action; "nothing matched hedgehog" is a dead end and wants the query
 * cleared. Conflating them is how a list with 400 rows tells someone to create
 * their first one. Both live here: `empty` for the first, and a built-in
 * no-matches state that offers the way out.
 *
 * **The count is announced once, not per keystroke.** GlowSearch debounces
 * `onSearch`, so the block filters on the debounced query and puts the live
 * region on the count. Typing six characters is one announcement — "12 of 48
 * shown" — instead of six.
 *
 * **Sorting is in memory only when the data is.** Give `rows` and no
 * `onSortChange` and the block sorts them itself, comparing `values[key]` so a
 * `<HudChip>` in a cell never gets compared as JSX. Pass `onSortChange` — or
 * `onSearch` — and the block hands the interaction over and renders exactly the
 * rows it was given, which is what a paged endpoint needs.
 *
 * **The loading rows keep the column contract.** Skeletons inside the same
 * `DuckList`, so the header does not jump when the data lands.
 */
export interface DuckListViewRow {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  /** Ordinal. A string, so "01" stays "01". */
  index?: React.ReactNode;
  /** One node per column after the first, in the header's order. */
  cells?: React.ReactNode[];
  /**
   * Sortable and searchable values, keyed by column. Cells are nodes and cannot
   * be compared or matched; this is the row as data.
   */
  values?: Record<string, string | number>;
  href?: string;
  trailing?: React.ReactNode;
}

export interface DuckListViewProps
  extends Omit<React.ComponentProps<"div">, "children" | "title"> {
  columns: DuckListColumn[];
  rows: DuckListViewRow[];
  title?: React.ReactNode;
  /** Beside the search field: a filter, a "New" button, an export menu. */
  actions?: React.ReactNode;
  /** Drop the field for a list that is filtered from somewhere else. */
  search?: boolean;
  searchPlaceholder?: string;
  /** Take the query yourself. Doing so also stops the in-memory filter. */
  onSearch?: (query: string) => void;
  sort?: DuckListSort;
  /** Take sorting yourself. Doing so also stops the in-memory sort. */
  onSortChange?: (sort: DuckListSort) => void;
  loading?: boolean;
  skeletonRows?: number;
  /** Shown when there are no rows at all. Give it an action. */
  empty?: React.ReactNode;
  /** Shown when a query matched nothing. The block offers to clear it. */
  noMatchesTitle?: string;
  /** Print "12 of 48 shown" above the list. */
  showCount?: boolean;
  /** Return the framework's link element for a row — `<Link href={…} />`. */
  render?: (row: DuckListViewRow) => React.ReactElement;
}

/** Numbers numerically, everything else by locale. */
function compare(a: string | number | undefined, b: string | number | undefined) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a ?? "").localeCompare(String(b ?? ""));
}

function DuckListView({
  className,
  columns,
  rows,
  title,
  actions,
  search = true,
  searchPlaceholder = "Filter…",
  onSearch,
  sort,
  onSortChange,
  loading = false,
  skeletonRows = 6,
  empty,
  noMatchesTitle = "Nothing matched",
  showCount = true,
  render,
  ...props
}: DuckListViewProps) {
  /**
   * Two states for one field, on purpose. `typed` is what the field shows and has
   * to update on every keystroke; `query` is the debounced value everything else
   * reads. Filtering off `typed` would filter six times for six characters, and
   * driving the field off `query` would make it lag behind the caret.
   */
  const [typed, setTyped] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [internalSort, setInternalSort] = React.useState<DuckListSort | undefined>();
  const managed = { search: Boolean(onSearch), sort: Boolean(onSortChange) };
  const activeSort = sort ?? (managed.sort ? undefined : internalSort);

  const visible = React.useMemo(() => {
    let result = rows;

    if (!managed.search && query) {
      const needle = query.toLowerCase();
      result = result.filter((row) => {
        const haystack = [
          typeof row.title === "string" ? row.title : "",
          typeof row.description === "string" ? row.description : "",
          ...Object.values(row.values ?? {}).map(String),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(needle);
      });
    }

    if (!managed.sort && activeSort) {
      // Copied before sorting: rows is the caller's array, and sorting it in
      // place would reorder their state behind their back.
      result = [...result].sort((a, b) => {
        const direction = activeSort.direction === "ascending" ? 1 : -1;
        return (
          compare(a.values?.[activeSort.key], b.values?.[activeSort.key]) *
          direction
        );
      });
    }

    return result;
  }, [rows, query, activeSort, managed.search, managed.sort]);

  const onSortChangeInternal = (next: DuckListSort) => {
    if (onSortChange) onSortChange(next);
    else setInternalSort(next);
  };

  const searching = query.length > 0;

  return (
    <div
      data-slot="duck-list-view"
      className={cn("@container/list flex w-full flex-col gap-4", className)}
      {...props}
    >
      {(title || search || actions) && (
        <div className="flex flex-col gap-3 @2xl/list:flex-row @2xl/list:items-center">
          {title && (
            <h2 className="font-display text-xl font-bold tracking-tight">
              {title}
            </h2>
          )}
          <div className="flex flex-1 items-center gap-2 @2xl/list:justify-end">
            {search && (
              <GlowSearch
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                value={typed}
                onChange={(event) => setTyped(event.currentTarget.value)}
                // The debounced channel, so a keystroke is not a filter pass and
                // the count below announces once.
                onSearch={(value) => {
                  setQuery(value);
                  onSearch?.(value);
                }}
                className="w-full @2xl/list:max-w-xs"
              />
            )}
            {actions}
          </div>
        </div>
      )}

      {showCount && !loading && (
        <p
          // Polite, on the count rather than on the list: one announcement per
          // settled query, not one per row that survived it.
          aria-live="polite"
          className="text-xs text-muted-foreground"
        >
          {visible.length === rows.length
            ? `${rows.length} ${rows.length === 1 ? "item" : "items"}`
            : `${visible.length} of ${rows.length} shown`}
        </p>
      )}

      {rows.length === 0 && !loading ? (
        (empty ?? (
          <EmptyPond
            title="Nothing here yet"
            hint="What lands here will be listed, newest first."
          />
        ))
      ) : (
        <DuckList
          columns={columns}
          sort={activeSort}
          onSortChange={onSortChangeInternal}
        >
          {loading
            ? Array.from({ length: skeletonRows }, (_, row) => (
                <div
                  key={row}
                  // Inside the same DuckList, so the tracks are the real ones and
                  // the header does not move when the data arrives.
                  className="grid items-center gap-4 border-b border-border py-4 pl-3"
                  style={{ gridTemplateColumns: "var(--duck-list-cols)" }}
                >
                  {columns.map((column, cell) => (
                    <StickerSkeleton
                      key={column.key}
                      shape="line"
                      delay={row * 60 + cell * 20}
                      className={cell === 0 ? "h-4 w-2/3" : "h-3 w-1/2"}
                    />
                  ))}
                </div>
              ))
            : visible.length === 0
              ? [
                  <EmptyPond
                    key="no-matches"
                    compact
                    title={noMatchesTitle}
                    hint={
                      searching
                        ? `No row matches “${query}”.`
                        : "No row matches the current filter."
                    }
                    // A dead end needs the way out, which is the difference
                    // between this state and the empty one above it.
                    action={
                      searching ? (
                        <QuackButton
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setTyped("");
                            setQuery("");
                            onSearch?.("");
                          }}
                        >
                          Clear filter
                        </QuackButton>
                      ) : undefined
                    }
                    className="py-10"
                  />,
                ]
              : visible.map((row) => {
                  const link = render?.(row);
                  const asChild = Boolean(link ?? row.href);

                  return (
                    <DuckListRow
                      key={row.id}
                      index={row.index}
                      title={row.title}
                      description={row.description}
                      meta={row.meta}
                      cells={row.cells}
                      trailing={row.trailing}
                      asChild={asChild}
                    >
                      {link ?? (row.href ? <a href={row.href} /> : undefined)}
                    </DuckListRow>
                  );
                })}
        </DuckList>
      )}
    </div>
  );
}

export { DuckListView };
