"use client";

import { GlowField, GlowInput } from "@/components/ui/glow-input";
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
  );
}
