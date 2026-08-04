"use client";

import { DuckListView } from "@/components/blocks/duck-list-view";
import { HudChip } from "@/components/ui/hud-chip";

const COLUMNS = [
  { key: "name", label: "Component", width: "minmax(0, 1.4fr)", sortable: true },
  { key: "category", label: "Category", width: "8rem", sortable: true },
  { key: "installs", label: "Installs", width: "6rem", sortable: true },
  { key: "state", label: "State", width: "7rem" },
];

const DATA = [
  { name: "quack-button", category: "Actions", installs: 1284, state: "stable" },
  { name: "glow-select", category: "Inputs", installs: 312, state: "new" },
  { name: "glow-color", category: "Inputs", installs: 208, state: "new" },
  { name: "sticker-card", category: "Surfaces", installs: 1102, state: "stable" },
  { name: "duck-viewport", category: "Surfaces", installs: 96, state: "beta" },
  { name: "hud-code", category: "Display", installs: 441, state: "stable" },
];

export default function DuckListViewDemo() {
  return (
    <DuckListView
      title="Registry items"
      columns={COLUMNS}
      searchPlaceholder="Filter components…"
      rows={DATA.map((item) => ({
        id: item.name,
        title: item.name,
        href: "#",
        values: item,
        cells: [
          <span key="category" className="text-sm text-muted-foreground">
            {item.category}
          </span>,
          <span key="installs" className="text-sm tabular-nums">
            {item.installs.toLocaleString("en-US")}
          </span>,
          <HudChip
            key="state"
            size="xs"
            variant={item.state === "stable" ? "outline" : "primary"}
            frame={false}
          >
            {item.state}
          </HudChip>,
        ],
      }))}
    />
  );
}
