"use client";

import { StickerKbd } from "@/components/ui/sticker-kbd";

export default function StickerKbdDemo() {
  return (
    <div className="flex flex-col items-center gap-5 text-sm">
      <p className="flex items-center gap-2 text-muted-foreground">
        Press
        <StickerKbd watch="k" meta>
          ⌘K
        </StickerKbd>
        to search
      </p>
      <p className="flex items-center gap-2 text-muted-foreground">
        <StickerKbd watch="Shift">Shift</StickerKbd>
        <span className="text-xs">+</span>
        <StickerKbd watch="?">?</StickerKbd>
        for shortcuts
      </p>
      <p className="flex items-center gap-2 text-muted-foreground">
        <StickerKbd watch="Escape">Esc</StickerKbd>
        closes anything
      </p>
    </div>
  );
}
