"use client";

import * as React from "react";

import {
  DuckMediaSlider,
  formatTimecode,
} from "@/components/ui/duck-media-slider";
import { GlowFieldset } from "@/components/ui/glow-input";

const DURATION = 214;

export default function DuckMediaSliderDemo() {
  const [time, setTime] = React.useState(48);
  const [loaded, setLoaded] = React.useState(0.38);

  // Stands in for timeupdate. It keeps firing while you drag, which is exactly
  // the fight the component is built to win.
  React.useEffect(() => {
    const id = window.setInterval(() => {
      setTime((current) => (current >= DURATION ? 0 : current + 0.25));
      setLoaded((current) => Math.min(1, current + 0.003));
    }, 250);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      {/* Dense, along the bottom edge of a "video". */}
      <div className="sticker relative aspect-video overflow-hidden rounded-2xl border-border bg-[radial-gradient(circle_at_30%_25%,var(--secondary),var(--background))]">
        <div className="absolute inset-x-4 bottom-4 flex items-center gap-3">
          <DuckMediaSlider
            dense
            max={DURATION}
            step={0.5}
            value={time}
            buffered={loaded}
            preview={(value) => formatTimecode(value)}
            onSeek={setTime}
            aria-label="Seek"
          />
          <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
            {formatTimecode(time)}
          </span>
        </div>
      </div>

      {/* Settings size, with a still in the bubble instead of a timecode. */}
      <GlowFieldset
        legend="Scrub"
        helper="Drag it: the playhead keeps ticking underneath and is ignored until you let go."
      >
        <DuckMediaSlider
          max={DURATION}
          value={time}
          buffered={loaded}
          onSeek={setTime}
          preview={(value) => (
            <span className="flex w-20 flex-col gap-1">
              <span className="aspect-video rounded-sm bg-secondary" />
              <span className="text-center">{formatTimecode(value)}</span>
            </span>
          )}
          aria-label="Seek"
        />
      </GlowFieldset>
    </div>
  );
}
