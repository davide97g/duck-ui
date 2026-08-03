"use client";

import { DuckTimeline, DuckTimelineItem } from "@/components/ui/duck-timeline";

export default function DuckTimelineDemo() {
  return (
    <DuckTimeline className="w-full max-w-md text-left">
      <DuckTimelineItem when="2026 — 04" title="Noir ships" active>
        A second theme proves the tokens reach the components.
      </DuckTimelineItem>
      <DuckTimelineItem when="2026 — 02" title="Media layer">
        Sliders, volume, media cards. Thirty runtime dependencies retired.
      </DuckTimelineItem>
      <DuckTimelineItem when="2025 — 11" title="The pond opens">
        Theme, buttons, cards, and a registry the CLI can read.
      </DuckTimelineItem>
    </DuckTimeline>
  );
}
