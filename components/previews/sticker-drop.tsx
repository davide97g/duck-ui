"use client";

import { StickerDrop } from "@/components/ui/sticker-drop";
import { GlowFieldset } from "@/components/ui/glow-input";

export default function StickerDropDemo() {
  return (
    <div className="w-full max-w-md">
      <GlowFieldset legend="Artwork" helper="These end up on the sticker sheet.">
        <StickerDrop
          multiple
          accept="image/png,image/jpeg,.svg"
          maxSize={2 * 1024 * 1024}
          label="Drop artwork here"
          hint="PNG, JPEG or SVG, up to 2 MB each"
        />
      </GlowFieldset>
    </div>
  );
}
