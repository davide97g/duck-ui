import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * DuckListRow — the row is the unit of a journal index, a project list, a
 * changelog. One hairline, one leading rule that grows in on hover, and the
 * whole row is the link.
 *
 * The rule is a scaleX transform rather than a width, so the hover costs a
 * composited property and nothing on the main thread — and it grows from the
 * top because that is the edge the eye is already tracking down.
 *
 * `index` prints a HUD ordinal, which is what makes a list read as a catalogue
 * rather than as a stack of headings.
 *
 * `cells` turns the row into a column-aligned one for an admin list. The
 * tracks come from `--duck-list-cols`, which DuckList (from
 * `@duck/duck-list-header`) writes once on the wrapper, so the widths live in
 * one place instead of on every row. The row only reads the property, so it
 * still installs and works on its own. Two things change in that mode: the row
 * no longer shifts right on hover, because columns that jump out of line with
 * the header read as a bug rather than as a response; and `meta` moves inside
 * the first cell, under the description, because in a tabular row anything
 * that is not a column is a note about the item.
 */

const rowClasses = [
  "group/row relative border-b border-border py-4",
  "outline-none transition-[padding,background-color] duration-300 ease-[var(--ease-duck)]",
  "before:absolute before:top-1/2 before:left-0 before:h-[calc(100%-1.5rem)] before:w-px",
  "before:origin-top before:-translate-y-1/2 before:scale-y-0 before:bg-primary",
  "before:transition-transform before:duration-300 before:ease-[var(--ease-duck)]",
  "hover:before:scale-y-100 focus-visible:before:scale-y-100",
];

const feedClasses = [
  "flex items-start gap-4 pl-0",
  // The row shifts right by the width of its own rule, so the rule reads as
  // having pushed the content rather than landed on top of it.
  "hover:pl-4 focus-visible:pl-4",
];

// A column row cannot shift, so it reserves the gutter permanently instead —
// otherwise the rule would draw down the left edge of the first letter.
// DuckListHeader reserves the same 0.75rem so the labels stay over the cells.
const columnClasses = ["grid items-start gap-4 pl-3"];

export interface DuckListRowProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  /** Ordinal in the list. A string, so "01" stays "01". */
  index?: React.ReactNode;
  title?: React.ReactNode;
  /** A line under the title. */
  description?: React.ReactNode;
  /** Date, tag, reading time — the quiet half of the row. */
  meta?: React.ReactNode;
  /** Right edge: a chevron, a value, a badge. */
  trailing?: React.ReactNode;
  /**
   * One node per column after the first, in the order the header declares
   * them. The first column is always the index / title / description block, so
   * a three-column header takes two cells here. Passing this switches the row
   * onto the shared column contract.
   */
  cells?: React.ReactNode[];
  /**
   * Render the child element as the row, for a whole-row link. The row builds
   * its own content from index / title / description / meta / trailing, so the
   * child is written as a bare element: <a href="…" />.
   */
  asChild?: boolean;
}

function DuckListRow({
  className,
  index,
  title,
  description,
  meta,
  trailing,
  cells,
  asChild = false,
  style,
  children,
  ...props
}: DuckListRowProps) {
  const columns = cells !== undefined;

  const identity = (
    <>
      {index !== undefined && (
        <span className="hud hud-sm shrink-0 pt-1.5 tabular-nums">{index}</span>
      )}
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        {title !== undefined && (
          <span className="font-display leading-snug font-semibold tracking-tight">
            {title}
          </span>
        )}
        {description !== undefined && (
          <span className="text-sm text-muted-foreground">{description}</span>
        )}
        {columns && meta !== undefined && (
          <span className="hud hud-sm hud-tight pt-0.5">{meta}</span>
        )}
        {!asChild && children}
      </span>
    </>
  );

  const body = columns ? (
    <>
      {/* The first track is one flex line of its own, so index and title sit
          side by side inside a single column rather than eating two. */}
      <span className="flex min-w-0 items-start gap-4">{identity}</span>
      {cells.map((cell, position) => (
        <span
          key={position}
          className="min-w-0 pt-0.5 text-sm text-muted-foreground"
        >
          {cell}
        </span>
      ))}
      {trailing !== undefined && (
        <span className="flex shrink-0 items-center pt-1 text-muted-foreground transition-colors duration-300 group-hover/row:text-primary">
          {trailing}
        </span>
      )}
    </>
  ) : (
    <>
      {identity}
      {meta !== undefined && (
        <span className="hud hud-sm hud-tight shrink-0 pt-1.5">{meta}</span>
      )}
      {trailing !== undefined && (
        <span className="flex shrink-0 items-center pt-1 text-muted-foreground transition-colors duration-300 group-hover/row:text-primary">
          {trailing}
        </span>
      )}
    </>
  );

  // Without a DuckList above it the row still has to lay itself out, so it
  // falls back to an even split, weighted towards the title. `trailing` takes
  // a track of its own in column mode: declare a last column with an empty
  // label for it.
  const columnStyle: React.CSSProperties | undefined = columns
    ? {
        gridTemplateColumns: `var(--duck-list-cols, ${[
          "minmax(0, 2fr)",
          ...cells.map(() => "minmax(0, 1fr)"),
          ...(trailing !== undefined ? ["min-content"] : []),
        ].join(" ")})`,
        ...style,
      }
    : style;

  // Radix Slot appends its own children only where a <Slottable> sits among its
  // direct children, and the row needs its content interleaved between three
  // slots rather than appended at one point. So the clone is done here: the
  // child element becomes the row and the row supplies its children.
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<
      React.HTMLAttributes<HTMLElement>
    >;
    return React.cloneElement(
      child,
      {
        ...props,
        "data-slot": "duck-list-row",
        // Only when there is one: cloneElement treats an explicit undefined as
        // a value, and would wipe a style the child element brought with it.
        ...(columnStyle !== undefined ? { style: columnStyle } : null),
        className: cn(
          rowClasses,
          columns ? columnClasses : feedClasses,
          child.props.className,
          className
        ),
      } as React.HTMLAttributes<HTMLElement>,
      body
    );
  }

  return (
    <div
      data-slot="duck-list-row"
      className={cn(
        rowClasses,
        columns ? columnClasses : feedClasses,
        className
      )}
      style={columnStyle}
      {...props}
    >
      {body}
    </div>
  );
}

export { DuckListRow };
