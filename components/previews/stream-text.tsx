"use client";

import { StreamText } from "@/components/ui/stream-text";

export default function StreamTextDemo() {
  return (
    <div className="w-full max-w-md text-sm leading-relaxed">
      <StreamText text="Installed @duck/theme, then quack-button and sticker-card. The files are in components/ui and they are yours to edit." />
    </div>
  );
}
