"use client";

import * as React from "react";

import { DuckPlayerBar, clock } from "@/components/blocks/duck-player-bar";

const DURATION = 214;

/** A playhead driven by a timer, so the scrub-versus-playhead rule is visible. */
export default function DuckPlayerBarDemo() {
  const [playing, setPlaying] = React.useState(false);
  const [position, setPosition] = React.useState(41);
  const [muted, setMuted] = React.useState(false);
  const [volume, setVolume] = React.useState(0.7);

  React.useEffect(() => {
    if (!playing) return;
    const tick = setInterval(() => {
      setPosition((current) => (current + 1 > DURATION ? 0 : current + 1));
    }, 1000);
    return () => clearInterval(tick);
  }, [playing]);

  return (
    <DuckPlayerBar
      className="rounded-2xl border border-border"
      art={
        <span className="grid size-10 place-items-center rounded-lg bg-primary/15 font-display text-sm font-extrabold text-primary">
          D
        </span>
      }
      title="Sto costruendo il mio design system"
      subtitle="dacoder · episode 12"
      duration={DURATION}
      position={position}
      buffered={0.78}
      playing={playing}
      onPlayingChange={setPlaying}
      onSeek={setPosition}
      volume={volume}
      onVolumeChange={setVolume}
      muted={muted}
      onMutedChange={setMuted}
      preview={(seconds) => clock(seconds)}
    />
  );
}
