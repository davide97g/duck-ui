"use client";

import { Bell, Link2, Trash2 } from "lucide-react";

import {
  StickerTooltip,
  StickerTooltipContent,
  StickerTooltipProvider,
  StickerTooltipRoot,
  StickerTooltipTrigger,
} from "@/components/ui/sticker-tooltip";
import { QuackButton } from "@/components/ui/quack-button";

export default function StickerTooltipDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {/* One control: the all-in-one form brings its own provider. */}
      <StickerTooltip content="Copy link">
        <QuackButton variant="outline" size="icon" aria-label="Copy link">
          <Link2 />
        </QuackButton>
      </StickerTooltip>

      {/* A group sharing one delay: compose the parts. */}
      <StickerTooltipProvider delayDuration={150}>
        <StickerTooltipRoot>
          <StickerTooltipTrigger asChild>
            <QuackButton variant="outline" size="icon" aria-label="Notifications">
              <Bell />
            </QuackButton>
          </StickerTooltipTrigger>
          <StickerTooltipContent>Notifications</StickerTooltipContent>
        </StickerTooltipRoot>

        <StickerTooltipRoot>
          <StickerTooltipTrigger asChild>
            <QuackButton variant="outline" size="icon" aria-label="Delete">
              <Trash2 />
            </QuackButton>
          </StickerTooltipTrigger>
          <StickerTooltipContent side="bottom">
            Delete — no undo
          </StickerTooltipContent>
        </StickerTooltipRoot>
      </StickerTooltipProvider>
    </div>
  );
}
