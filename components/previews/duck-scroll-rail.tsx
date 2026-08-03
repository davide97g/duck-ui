"use client";

import { DuckScrollRail } from "@/components/ui/duck-scroll-rail";

export default function DuckScrollRailDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-3 text-left">
      {/* The rail is fixed in real use. Here it is pinned to the box instead,
          so the preview does not paint a line across the whole docs page — the
          progress it reads is still this page being scrolled. */}
      <div className="relative overflow-hidden rounded-xl border-2 border-border bg-card p-6">
        <DuckScrollRail className="absolute" thickness={3} />
        <p className="text-sm text-muted-foreground">
          Scroll this page. The lime hairline along the top of this box is the
          rail, reading window progress.
        </p>
      </div>
      <p className="hud hud-sm">
        In your app: drop it once in the layout, no props.
      </p>
    </div>
  );
}
