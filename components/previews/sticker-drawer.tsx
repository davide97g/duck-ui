"use client";

import { DuckSwitch } from "@/components/ui/duck-switch";
import { HudLabel } from "@/components/ui/hud-label";
import { QuackButton } from "@/components/ui/quack-button";
import {
  StickerDrawer,
  StickerDrawerBody,
  StickerDrawerClose,
  StickerDrawerContent,
  StickerDrawerDescription,
  StickerDrawerFooter,
  StickerDrawerHeader,
  StickerDrawerTitle,
  StickerDrawerTrigger,
} from "@/components/ui/sticker-drawer";

export default function StickerDrawerDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <StickerDrawer>
        <StickerDrawerTrigger asChild>
          <QuackButton variant="outline">Open pond notes</QuackButton>
        </StickerDrawerTrigger>

        <StickerDrawerContent side="right">
          <StickerDrawerHeader>
            <StickerDrawerTitle>Dabbling ducks</StickerDrawerTitle>
            <StickerDrawerDescription>
              Filed under Main pond. Last edited this morning.
            </StickerDrawerDescription>
          </StickerDrawerHeader>

          <StickerDrawerBody className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
            <HudLabel dot>Draft</HudLabel>
            <p>
              Dabblers feed at the surface and tip forward to reach the weed
              underneath, which is why they need shallow water and why they turn
              up in flooded fields the week after heavy rain.
            </p>
            <p>
              They take off straight from the water with no run-up. Diving ducks
              cannot, which is the quickest way to tell the two apart at
              distance.
            </p>
            <p>
              Mallards on the pond are almost certainly resident. Wigeon and teal
              are passing through and will be gone by April.
            </p>
            <p>
              Ringed birds are recorded in the log at the hide. Nothing new since
              the pair of shoveler in February.
            </p>
          </StickerDrawerBody>

          <StickerDrawerFooter>
            <StickerDrawerClose asChild>
              <QuackButton variant="ghost">Close</QuackButton>
            </StickerDrawerClose>
            <QuackButton>Edit note</QuackButton>
          </StickerDrawerFooter>
        </StickerDrawerContent>
      </StickerDrawer>

      <StickerDrawer>
        <StickerDrawerTrigger asChild>
          <QuackButton variant="ghost">Filters</QuackButton>
        </StickerDrawerTrigger>

        <StickerDrawerContent side="bottom" size="sm">
          <StickerDrawerHeader>
            <StickerDrawerTitle>Filters</StickerDrawerTitle>
            <StickerDrawerDescription>
              Applies to every pond in the county.
            </StickerDrawerDescription>
          </StickerDrawerHeader>

          <StickerDrawerBody className="flex flex-col gap-3">
            <DuckSwitch defaultChecked>Resident species only</DuckSwitch>
            <DuckSwitch>Include unringed sightings</DuckSwitch>
          </StickerDrawerBody>

          <StickerDrawerFooter>
            <StickerDrawerClose asChild>
              <QuackButton variant="ghost">Cancel</QuackButton>
            </StickerDrawerClose>
            <StickerDrawerClose asChild>
              <QuackButton>Apply</QuackButton>
            </StickerDrawerClose>
          </StickerDrawerFooter>
        </StickerDrawerContent>
      </StickerDrawer>
    </div>
  );
}
