"use client";

import * as React from "react";

import {
  DuckViewport,
  DuckViewportControls,
  type DuckViewportHandle,
} from "@/components/ui/duck-viewport";
import { HudLabel } from "@/components/ui/hud-label";

/** A knowledge graph small enough to read, big enough to need panning. */
const nodes = [
  { id: "core", x: 240, y: 150, r: 26, tone: 1, label: "registry" },
  { id: "theme", x: 96, y: 78, r: 18, tone: 2, label: "theme" },
  { id: "motion", x: 132, y: 246, r: 16, tone: 3, label: "motion" },
  { id: "docs", x: 386, y: 88, r: 17, tone: 4, label: "docs" },
  { id: "skill", x: 402, y: 232, r: 15, tone: 5, label: "skill" },
  { id: "tokens", x: 60, y: 168, r: 11, tone: 2, label: "tokens" },
  { id: "llms", x: 322, y: 30, r: 10, tone: 4, label: "llms.txt" },
];

const edges = [
  ["core", "theme"],
  ["core", "motion"],
  ["core", "docs"],
  ["core", "skill"],
  ["theme", "tokens"],
  ["docs", "llms"],
  ["docs", "skill"],
];

const at = (id: string) => nodes.find((node) => node.id === id)!;

export default function DuckViewportDemo() {
  const viewport = React.useRef<DuckViewportHandle>(null);
  const [scale, setScale] = React.useState(1);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      {/* The frame belongs to the wrapper: the viewport itself is chromeless. */}
      <div className="sticker relative h-80 overflow-hidden rounded-2xl border-border bg-[radial-gradient(circle_at_50%_40%,var(--secondary),var(--background))]">
        <DuckViewport
          ref={viewport}
          min={0.4}
          max={8}
          className="h-full w-full"
          aria-label="Knowledge graph. Drag to pan, scroll to zoom, arrow keys to move."
          onTransformChange={(transform) => setScale(transform.scale)}
        >
          <svg
            width={480}
            height={320}
            viewBox="0 0 480 320"
            aria-hidden
            className="block"
          >
            {edges.map(([from, to]) => {
              const a = at(from);
              const b = at(to);
              return (
                <line
                  key={`${from}-${to}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="var(--border)"
                  strokeWidth={1.5}
                />
              );
            })}
            {nodes.map((node) => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.r}
                  fill={`var(--chart-${node.tone})`}
                  stroke="var(--vinyl)"
                  strokeWidth={2}
                />
                <text
                  x={node.x}
                  y={node.y + node.r + 14}
                  textAnchor="middle"
                  fill="var(--muted-foreground)"
                  className="font-mono text-[9px] tracking-[0.18em] uppercase"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </DuckViewport>

        {/* Both siblings of the viewport, so neither pans away with the graph. */}
        <HudLabel
          tone="primary"
          size="sm"
          className="absolute top-3 left-4 tabular-nums"
        >
          {Math.round(scale * 100)}%
        </HudLabel>
        <DuckViewportControls
          viewport={viewport}
          className="absolute right-3 bottom-3"
        />
      </div>

      <p className="text-sm text-muted-foreground">
        Scroll over a node and it stays under the pointer. Drag past the edge and
        the pan keeps following. Focus the graph for arrows, <code>+</code>,{" "}
        <code>-</code> and <code>0</code>.
      </p>
    </div>
  );
}
