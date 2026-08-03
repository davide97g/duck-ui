"use client";

import * as React from "react";

import { StickerDrop } from "@/components/ui/sticker-drop";
import { GlowFieldset } from "@/components/ui/glow-input";
import { QuackButton } from "@/components/ui/quack-button";

export default function StickerDropDemo() {
  // Controlled, which is what makes the reset below possible: clearing the
  // array clears the sheet, with no key bump and no remount.
  const [files, setFiles] = React.useState<File[]>([]);

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <GlowFieldset legend="Artwork" helper="These end up on the sticker sheet.">
        <StickerDrop
          multiple
          accept="image/png,image/jpeg,.svg"
          maxSize={2 * 1024 * 1024}
          label="Drop artwork here"
          hint="PNG, JPEG or SVG, up to 2 MB each"
          files={files}
          onFilesChange={setFiles}
        />
      </GlowFieldset>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">
          {files.length === 0
            ? "Nothing on the sheet yet"
            : `${files.length} file${files.length === 1 ? "" : "s"} held by the form`}
        </span>
        <QuackButton
          variant="outline"
          size="sm"
          disabled={files.length === 0}
          onClick={() => setFiles([])}
        >
          Reset
        </QuackButton>
      </div>
    </div>
  );
}
