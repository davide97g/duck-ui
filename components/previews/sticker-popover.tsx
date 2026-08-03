"use client";

import { Mail, Share2, Users } from "lucide-react";

import { CopyButton } from "@/components/ui/copy-button";
import { GlowInput } from "@/components/ui/glow-input";
import { HudLabel } from "@/components/ui/hud-label";
import { QuackButton } from "@/components/ui/quack-button";
import {
  StickerPopover,
  StickerPopoverClose,
  StickerPopoverContent,
  StickerPopoverRoot,
  StickerPopoverTrigger,
} from "@/components/ui/sticker-popover";

const SHARE_LINK = "duck.ui/p/main-pond";

export default function StickerPopoverDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {/* A share menu: the parts, because each action dismisses the panel. The
          actions are buttons reached with Tab, not menu items reached with the
          arrow keys — a popover does not pretend to be a menu. */}
      <StickerPopoverRoot>
        <StickerPopoverTrigger asChild>
          <QuackButton variant="outline">
            <Share2 />
            Share
          </QuackButton>
        </StickerPopoverTrigger>

        <StickerPopoverContent className="flex flex-col gap-3">
          <HudLabel>Share pond</HudLabel>

          <div className="flex flex-col gap-1">
            <StickerPopoverClose asChild>
              <QuackButton variant="ghost" size="sm" className="justify-start">
                <Users />
                Invite people
              </QuackButton>
            </StickerPopoverClose>
            <StickerPopoverClose asChild>
              <QuackButton variant="ghost" size="sm" className="justify-start">
                <Mail />
                Send by email
              </QuackButton>
            </StickerPopoverClose>
          </div>

          {/* The row is the frame, so the field goes bare rather than stacking
              a second 3px edge inside the panel's own. */}
          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/40 px-2.5 py-1.5">
            <GlowInput
              frame={false}
              readOnly
              value={SHARE_LINK}
              aria-label="Share link"
              className="h-7 text-xs"
            />
            <CopyButton
              value={SHARE_LINK}
              label="Copy share link"
              className="size-7"
            />
          </div>
        </StickerPopoverContent>
      </StickerPopoverRoot>

      {/* One trigger, one panel: the all-in-one form. */}
      <StickerPopover
        side="bottom"
        align="start"
        content={
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium">Aligned to the start edge</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Where the panel is wider than the control that opened it, centring
              it leaves the trigger floating in the middle of nothing.
            </p>
          </div>
        }
      >
        <QuackButton variant="ghost">Placement</QuackButton>
      </StickerPopover>
    </div>
  );
}
