"use client";

import * as React from "react";

import {
  StickerProgress,
  StickerProgressTrack,
} from "@/components/ui/sticker-progress";

export default function StickerProgressDemo() {
  const [value, setValue] = React.useState(28);

  React.useEffect(() => {
    const id = window.setInterval(
      () => setValue((current) => (current >= 100 ? 0 : current + 4)),
      600
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <StickerProgress value={value} label="Uploading artwork" showValue />
      <StickerProgress label="Cutting the sheet" />

      {/* The bare track, square at the corners, along the foot of a poster. */}
      <div className="sticker relative aspect-[2/3] w-28 overflow-hidden rounded-2xl bg-secondary">
        <StickerProgressTrack
          size="sm"
          value={62}
          label="Watched"
          className="absolute inset-x-0 bottom-0 rounded-none"
        />
      </div>
    </div>
  );
}
