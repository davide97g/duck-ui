"use client";

import * as React from "react";

import { StickerProgress } from "@/components/ui/sticker-progress";

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
    </div>
  );
}
