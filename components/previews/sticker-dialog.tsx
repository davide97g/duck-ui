"use client";

import { GlowField, GlowInput } from "@/components/ui/glow-input";
import { HudLabel } from "@/components/ui/hud-label";
import { QuackButton } from "@/components/ui/quack-button";
import {
  StickerDialog,
  StickerDialogClose,
  StickerDialogContent,
  StickerDialogDescription,
  StickerDialogFooter,
  StickerDialogHeader,
  StickerDialogTitle,
  StickerDialogTrigger,
} from "@/components/ui/sticker-dialog";

export default function StickerDialogDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <StickerDialog>
        <StickerDialogTrigger asChild>
          <QuackButton variant="outline">Rename pond</QuackButton>
        </StickerDialogTrigger>

        <StickerDialogContent>
          <StickerDialogHeader>
            <StickerDialogTitle>Rename pond</StickerDialogTitle>
            <StickerDialogDescription>
              Everyone with access sees the new name immediately. Links keep
              working.
            </StickerDialogDescription>
          </StickerDialogHeader>

          <GlowField label="Pond name" helper="Two to thirty characters.">
            <GlowInput defaultValue="Main pond" spellCheck={false} />
          </GlowField>

          <StickerDialogFooter>
            <StickerDialogClose asChild>
              <QuackButton variant="ghost">Cancel</QuackButton>
            </StickerDialogClose>
            <StickerDialogClose asChild>
              <QuackButton>Save</QuackButton>
            </StickerDialogClose>
          </StickerDialogFooter>
        </StickerDialogContent>
      </StickerDialog>

      <StickerDialog>
        <StickerDialogTrigger asChild>
          <QuackButton variant="ghost">Open the map</QuackButton>
        </StickerDialogTrigger>

        {/* size="full" is the full-bleed panel: no centring translate, no width
            cap, and it scrolls itself. */}
        <StickerDialogContent size="full">
          <StickerDialogHeader>
            <StickerDialogTitle>Pond map</StickerDialogTitle>
            <StickerDialogDescription>
              Every hide, feeder and ringing station on the reserve.
            </StickerDialogDescription>
          </StickerDialogHeader>

          <div className="grid flex-1 place-items-center rounded-xl border border-dashed border-border">
            <HudLabel>Canvas</HudLabel>
          </div>

          <StickerDialogFooter>
            <StickerDialogClose asChild>
              <QuackButton variant="ghost">Done</QuackButton>
            </StickerDialogClose>
          </StickerDialogFooter>
        </StickerDialogContent>
      </StickerDialog>
    </div>
  );
}
