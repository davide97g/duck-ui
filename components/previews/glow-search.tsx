"use client";

import * as React from "react";

import { GlowSearch } from "@/components/ui/glow-search";
import { HudLabel } from "@/components/ui/hud-label";

const PONDS = [
  "Reedbank Way",
  "Mallard Flats",
  "Heron Cut",
  "Teal Basin",
  "Coot Hollow",
  "Widgeon Reach",
];

export default function GlowSearchDemo() {
  // What the field says, updated on every keystroke.
  const [typed, setTyped] = React.useState("");
  // What the list is filtered by, updated once the typing stops. The gap between
  // the two labels below is the debounce.
  const [query, setQuery] = React.useState("");

  const matches = PONDS.filter((pond) =>
    pond.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <GlowSearch
        kbd="⌘K"
        placeholder="Search ponds"
        debounce={400}
        onChange={(event) => setTyped(event.target.value)}
        onSearch={setQuery}
      />

      <div className="flex items-center justify-between gap-3">
        <HudLabel size="sm" tracking="tight">
          typed {typed || "—"}
        </HudLabel>
        <HudLabel size="sm" tracking="tight" tone="primary" dot>
          filtered {query || "—"}
        </HudLabel>
      </div>

      <ul className="flex flex-col gap-1">
        {matches.map((pond) => (
          <li
            key={pond}
            className="rounded-md px-2 py-1.5 text-sm text-foreground odd:bg-card"
          >
            {pond}
          </li>
        ))}
        {matches.length === 0 && (
          <li className="px-2 py-1.5 text-sm text-muted-foreground">
            No pond by that name.
          </li>
        )}
      </ul>
    </div>
  );
}
