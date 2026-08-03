"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * DuckChart — bars, lines and areas drawn straight into SVG.
 *
 * The theme has shipped --chart-1 through --chart-5 since the first release
 * with nothing rendering them, which left every consumer either inventing its
 * own palette or installing a 480 kB charting library to read five variables.
 * This is the smallest thing that closes that gap: no dependency, no runtime
 * layout measurement, no client-side theme plumbing. It draws one series or
 * five, and every colour comes from the tokens.
 *
 * It is deliberately not a charting library. There is no zoom, no brush, no
 * tooltip following the pointer, no time axis. Reach for recharts or visx when
 * the chart is the product; use this when the chart is a figure in a page.
 *
 * Accessibility is the reason this renders a <figure>: the SVG is aria-hidden
 * decoration and the same numbers are also emitted as a real table, visually
 * hidden. A chart nobody can read is a picture of data.
 */

export interface DuckChartSeries {
  name: string;
  values: number[];
  /** Any CSS colour. Defaults to --chart-1 … --chart-5 by position. */
  color?: string;
}

export interface DuckChartProps extends Omit<React.ComponentProps<"figure">, "children"> {
  /** One label per x position. Length sets the number of columns. */
  labels: string[];
  series: DuckChartSeries[];
  type?: "bar" | "line" | "area";
  /** What the figure is, for the table caption and the accessible name. */
  title?: string;
  /** Height of the plot in px. Width is always fluid. */
  height?: number;
  /** Fix the top of the scale. Defaults to the largest value, padded. */
  max?: number;
  /** Horizontal rules behind the plot. */
  grid?: boolean;
  /** Print the x labels under the plot. */
  xAxis?: boolean;
  /** Print the series names above the plot. */
  legend?: boolean;
  /** Number formatter for the table and the y labels. */
  format?: (value: number) => string;
}

/* The plot is drawn in its own coordinate space and stretched to the container.
   Stroke widths are therefore given in user units and corrected by
   vector-effect, which is what keeps a 1px line 1px at any width. */
const VIEW_W = 600;

function DuckChart({
  className,
  labels,
  series,
  type = "bar",
  title,
  height = 220,
  max,
  grid = true,
  xAxis = true,
  legend,
  format = (value) => String(value),
  ...props
}: DuckChartProps) {
  const columns = labels.length;
  const showLegend = legend ?? series.length > 1;

  const peak = Math.max(
    1,
    max ?? Math.max(...series.flatMap((one) => one.values.map((v) => v || 0)))
  );
  // A plot whose tallest bar touches the frame reads as clipped.
  const ceiling = max ?? peak * 1.08;

  const colorFor = (one: DuckChartSeries, index: number) =>
    one.color ?? `var(--chart-${(index % 5) + 1})`;

  const x = (index: number) =>
    columns <= 1 ? VIEW_W / 2 : (index / (columns - 1)) * VIEW_W;
  const y = (value: number) => height - (Math.max(0, value) / ceiling) * height;

  const pointsFor = (values: number[]) =>
    values.map((value, index) => `${x(index)},${y(value)}`).join(" ");

  /* Bars: each column gets an equal slot, each series an equal share of it. */
  const slot = VIEW_W / Math.max(1, columns);
  const barGap = slot * 0.28;
  const barWidth = (slot - barGap) / series.length;

  return (
    <figure
      data-slot="duck-chart"
      data-variant={type}
      className={cn("flex w-full flex-col gap-3", className)}
      {...props}
    >
      {showLegend && (
        <figcaption className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          {series.map((one, index) => (
            <span key={one.name} className="flex items-center gap-2">
              <span
                aria-hidden
                className="size-2 shrink-0"
                style={{ background: colorFor(one, index) }}
              />
              <span className="hud hud-sm">{one.name}</span>
            </span>
          ))}
        </figcaption>
      )}

      <svg
        aria-hidden
        viewBox={`0 0 ${VIEW_W} ${height}`}
        preserveAspectRatio="none"
        style={{ height }}
        className="w-full overflow-visible"
      >
        {grid &&
          [0, 0.25, 0.5, 0.75, 1].map((step) => (
            <line
              key={step}
              x1={0}
              x2={VIEW_W}
              y1={height * step}
              y2={height * step}
              stroke="var(--border)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}

        {type === "bar" &&
          series.map((one, seriesIndex) => (
            <g key={one.name} fill={colorFor(one, seriesIndex)}>
              {one.values.slice(0, columns).map((value, index) => {
                const top = y(value);
                return (
                  <rect
                    key={`${one.name}-${index}`}
                    x={index * slot + barGap / 2 + seriesIndex * barWidth}
                    y={top}
                    width={Math.max(1, barWidth)}
                    height={Math.max(0, height - top)}
                  />
                );
              })}
            </g>
          ))}

        {type !== "bar" &&
          series.map((one, seriesIndex) => {
            const stroke = colorFor(one, seriesIndex);
            const line = pointsFor(one.values.slice(0, columns));
            return (
              <g key={one.name}>
                {type === "area" && (
                  <polygon
                    points={`0,${height} ${line} ${VIEW_W},${height}`}
                    fill={stroke}
                    // The fill is the same colour at low opacity rather than a
                    // second token: an area is its line, shaded.
                    opacity={0.16}
                  />
                )}
                <polyline
                  points={line}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            );
          })}
      </svg>

      {xAxis && (
        <div
          aria-hidden
          className={cn(
            "grid gap-1",
            // Bars sit inside their slot, points sit on the column edge, so the
            // labels have to line up differently for the two shapes.
            type === "bar" ? "text-center" : "text-left"
          )}
          style={{ gridTemplateColumns: `repeat(${Math.max(1, columns)}, 1fr)` }}
        >
          {labels.map((label) => (
            <span key={label} className="hud hud-sm truncate">
              {label}
            </span>
          ))}
        </div>
      )}

      {/* The data, for anyone the SVG does not reach. */}
      <table className="sr-only">
        <caption>{title ?? "Chart data"}</caption>
        <thead>
          <tr>
            <th scope="col">Label</th>
            {series.map((one) => (
              <th key={one.name} scope="col">
                {one.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {labels.map((label, index) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              {series.map((one) => (
                <td key={one.name}>{format(one.values[index] ?? 0)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export { DuckChart };
