import { Maximize2, Minus, Plus, RotateCw, Share2 } from "lucide-react";

import { HudChip } from "@/components/ui/hud-chip";
import { HudLabel } from "@/components/ui/hud-label";

export default function HudChipDemo() {
  return (
    <div className="flex w-full max-w-md flex-col items-start gap-7 text-left">
      {/* active paints the current read; aria-current says so. The component
          does not add it, because the same highlight means aria-pressed on a
          filter and aria-selected in a tablist. */}
      <nav className="flex flex-wrap items-center gap-2">
        <HudChip asChild active aria-current="page">
          <a href="#hud-chip">graph</a>
        </HudChip>
        <HudChip asChild>
          <a href="#hud-chip">saved</a>
        </HudChip>
        <HudChip asChild>
          <a href="#hud-chip">admin</a>
        </HudChip>
      </nav>

      <div className="flex w-full items-center justify-between gap-4">
        <HudLabel>viewport</HudLabel>
        {/* Icon-only, so each chip needs a name of its own. */}
        <div className="flex items-center gap-1">
          <HudChip size="sm" variant="ghost" aria-label="Zoom out">
            <Minus />
          </HudChip>
          <HudChip size="sm" variant="ghost" aria-label="Zoom in">
            <Plus />
          </HudChip>
          <HudChip size="sm" variant="ghost" aria-label="Fit to view">
            <Maximize2 />
          </HudChip>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <HudChip variant="ghost">
          <RotateCw />
          retry
        </HudChip>
        <HudChip variant="primary">
          <Share2 />
          share
        </HudChip>
        <HudChip disabled>export</HudChip>
      </div>
    </div>
  );
}
