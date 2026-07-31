"use client";

import * as React from "react";

import { DuckVolume } from "@/components/ui/duck-volume";
import { GlowFieldset } from "@/components/ui/glow-input";

export default function DuckVolumeDemo() {
  const [volume, setVolume] = React.useState(0.6);
  const [muted, setMuted] = React.useState(false);

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      {/* Player bar: one icon wide until someone reaches for the level. */}
      <div className="sticker flex items-center justify-between rounded-2xl border-border bg-card px-3 py-2">
        <DuckVolume
          volume={volume}
          muted={muted}
          onVolumeChange={setVolume}
          onMutedChange={setMuted}
        />
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {muted || volume === 0 ? "silent" : `${Math.round(volume * 100)}%`}
        </span>
      </div>

      {/* Nothing to collapse for in a settings panel, so it stays open. */}
      <GlowFieldset legend="Playback" helper="Drag to 0 and the icon agrees.">
        <DuckVolume defaultVolume={0.25} collapsible={false} />
      </GlowFieldset>
    </div>
  );
}
