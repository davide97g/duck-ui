"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { EmptyPond } from "@/components/ui/empty-pond";
import { StickerCarousel } from "@/components/ui/sticker-carousel";
import { StickerMediaCard } from "@/components/ui/sticker-media-card";
import { StickerSkeleton } from "@/components/ui/sticker-skeleton";

/**
 * DuckMediaShelf — the wall a library is: rows of artwork, one array in.
 *
 * StickerCarousel owns the track and the arrows, StickerMediaCard owns the tile.
 * What a media app writes by hand around them, every time, is this:
 *
 * **One tile width for the whole wall.** A row that sizes its slides with a
 * `basis` per breakpoint drifts from the row under it the first time someone
 * edits one of them. The width is a CSS variable on the shelf, so every tile in
 * every row is the same object, and a row can still override it for a wide
 * backdrop strip.
 *
 * **A loading state that does not move the page.** Skeleton tiles take the same
 * width and the same aspect as the real ones and are staggered off the shared
 * wave, so the artwork replaces the placeholder in place. Loading is `aria-busy`
 * on the row rather than a spinner, because the row is already the right shape.
 *
 * **Empty, twice.** A library with nothing in it is an EmptyPond; a *row* with
 * nothing in it is one line of muted text, and rendering the big empty state per
 * row would put four ducks on one screen. Both cases are here so neither one is
 * an application decision.
 *
 * `render` is the router escape hatch: return the framework's own link element
 * and it becomes the tile through `asChild`, so the frame is cloned *into* the
 * anchor rather than nested beside it.
 */
export interface DuckMediaShelfItem {
  id: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  src?: string;
  /** Falls back to the title when it is a string, for a missing poster. */
  alt?: string;
  href?: string;
  /** 0 to 100 — the resume bar along the bottom edge of the artwork. */
  progress?: number;
  /** Centred on hover and focus: a play badge, a duration chip. */
  overlay?: React.ReactNode;
}

export interface DuckMediaShelfRow {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Heading-row content: a "See all" link, a filter. */
  actions?: React.ReactNode;
  items: DuckMediaShelfItem[];
  /** Overrides the shelf ratio for this row — 16/9 for a backdrop strip. */
  aspect?: DuckMediaShelfProps["aspect"];
  /** Overrides the shelf tile width for this row. */
  tileWidth?: number;
  /** This row is still loading. Draws placeholders in the tiles' own shape. */
  loading?: boolean;
  /** Shown in place of the track when the row has no items. */
  emptyHint?: React.ReactNode;
}

export interface DuckMediaShelfProps
  extends Omit<React.ComponentProps<"div">, "children" | "title"> {
  rows: DuckMediaShelfRow[];
  /** Tile ratio for every row that does not override it. */
  aspect?: "2/3" | "16/9" | "1/1" | number;
  /** Tile width in px. One number for the whole wall — that is the point. */
  tileWidth?: number;
  /** Placeholder tiles per loading row. Match the page size you fetch. */
  skeletonCount?: number;
  /** Shown when every row is empty and nothing is loading. */
  empty?: React.ReactNode;
  /**
   * Return the framework's link element for an item — `<Link href={…} />` with
   * no children. The tile is cloned into it, so client navigation costs one prop
   * rather than a wrapper around every poster.
   */
  render?: (item: DuckMediaShelfItem) => React.ReactElement;
}

function DuckMediaShelf({
  className,
  rows,
  aspect = "2/3",
  tileWidth = 168,
  skeletonCount = 6,
  empty,
  render,
  ...props
}: DuckMediaShelfProps) {
  const loading = rows.some((row) => row.loading);
  const hasItems = rows.some((row) => row.items.length > 0);

  if (!hasItems && !loading) {
    return (
      <div data-slot="duck-media-shelf" className={cn("w-full", className)} {...props}>
        {empty ?? (
          <EmptyPond
            title="Nothing in the library yet"
            hint="Add a source and the shelves fill themselves."
          />
        )}
      </div>
    );
  }

  return (
    <div
      data-slot="duck-media-shelf"
      className={cn("flex w-full flex-col gap-10", className)}
      {...props}
    >
      {rows.map((row, index) => {
        const width = row.tileWidth ?? tileWidth;
        const ratio = row.aspect ?? aspect;
        const key = typeof row.title === "string" ? row.title : `row-${index}`;

        return (
          <StickerCarousel
            key={key}
            title={row.title}
            description={row.description}
            actions={row.actions}
            label={typeof row.title === "string" ? row.title : undefined}
            // The row is the shape it will be once loaded, so "busy" is the
            // honest state — not a spinner where the artwork is about to go.
            aria-busy={row.loading || undefined}
            style={{ "--shelf-tile": `${width}px` } as React.CSSProperties}
            data-slot="duck-media-shelf-row"
          >
            {row.loading
              ? Array.from({ length: skeletonCount }, (_, tile) => (
                  <div key={tile} className="w-[var(--shelf-tile)] shrink-0">
                    <StickerSkeleton
                      // Not shape="poster": the ratio is a runtime value here,
                      // and it has to be the tile's, or the page jumps when the
                      // artwork lands.
                      style={{ aspectRatio: String(ratio) }}
                      className="h-auto w-full rounded-2xl"
                      delay={tile * 80}
                    />
                    <StickerSkeleton
                      shape="line"
                      delay={tile * 80}
                      className="mt-2 h-3 w-3/4"
                    />
                  </div>
                ))
              : row.items.length === 0
                ? [
                    <p
                      key="empty"
                      className="py-6 text-sm text-muted-foreground"
                    >
                      {row.emptyHint ?? "Nothing here yet."}
                    </p>,
                  ]
                : row.items.map((item) => (
                    <StickerMediaCard
                      key={item.id}
                      {...(render ? { asChild: true } : { href: item.href })}
                      src={item.src}
                      alt={
                        item.alt ??
                        (typeof item.title === "string" ? item.title : "")
                      }
                      aspect={ratio}
                      title={item.title}
                      subtitle={item.subtitle}
                      progress={item.progress}
                      overlay={item.overlay}
                      className="w-[var(--shelf-tile)] shrink-0"
                    >
                      {render?.(item)}
                    </StickerMediaCard>
                  ))}
          </StickerCarousel>
        );
      })}
    </div>
  );
}

export { DuckMediaShelf };
