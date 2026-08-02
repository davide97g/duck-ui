"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import {
  DuckTabs,
  DuckTabsList,
  DuckTabsTrigger,
} from "@/components/ui/duck-tabs";
import { HoloAvatar, HoloAvatarGroup } from "@/components/ui/holo-avatar";
import { HoloBadge } from "@/components/ui/holo-badge";
import { GlowField, GlowInput } from "@/components/ui/glow-input";
import { QuackButton } from "@/components/ui/quack-button";
import {
  StickerCard,
  StickerCardContent,
  StickerCardDescription,
  StickerCardFooter,
  StickerCardHeader,
  StickerCardTitle,
} from "@/components/ui/sticker-card";

const people = [
  { fallback: "GB", alt: "Giulia Bassani" },
  { fallback: "MK", alt: "Miro Kovač" },
  { fallback: "AT", alt: "Ade Turay" },
  { fallback: "RS", alt: "Rún Sigurðsson" },
];

/**
 * The same markup, three times. Nothing in the demo changes between the states
 * except which CSS variables are in scope, which is exactly what installing a
 * theme does to a project. Noir is the honest stress test: it collapses the
 * radius scale, drops the sticker edge to a hairline and flattens the holo
 * gradient, and every component still composes.
 */
export function ThemeProof() {
  const [theme, setTheme] = React.useState("duck");
  const neutral = theme === "neutral";
  // Noir is the far end of the range: same markup, no sticker language left.
  // Both alternates are "not duck", so the demo's own decorations follow
  // `plain` rather than `neutral`.
  const noir = theme === "noir";
  const plain = neutral || noir;

  return (
    <div className="flex flex-col gap-6">
      <DuckTabs value={theme} onValueChange={setTheme} className="items-start">
        <DuckTabsList>
          <DuckTabsTrigger value="neutral">Before</DuckTabsTrigger>
          <DuckTabsTrigger value="duck">After @duck/theme</DuckTabsTrigger>
          <DuckTabsTrigger value="noir">@duck/theme-noir</DuckTabsTrigger>
        </DuckTabsList>
      </DuckTabs>

      <div
        className={cn(
          "sticker rounded-2xl border-border bg-background p-6 transition-colors duration-500 sm:p-8",
          neutral && "theme-neutral",
          noir && "theme-noir"
        )}
      >
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <StickerCard className="justify-between">
            <StickerCardHeader>
              <div className="flex items-center justify-between gap-3">
                <StickerCardTitle>Pond access</StickerCardTitle>
                <HoloBadge variant={plain ? "outline" : "primary"}>
                  4 seats
                </HoloBadge>
              </div>
              <StickerCardDescription>
                Everyone on the team can install components without asking.
              </StickerCardDescription>
            </StickerCardHeader>
            <StickerCardContent>
              <HoloAvatarGroup>
                {people.map((person) => (
                  <HoloAvatar
                    key={person.fallback}
                    size="sm"
                    ring={plain ? "none" : "primary"}
                    {...person}
                  />
                ))}
              </HoloAvatarGroup>
            </StickerCardContent>
            <StickerCardFooter className="gap-3">
              <QuackButton size="sm" ripple={!plain}>
                Invite
              </QuackButton>
              <QuackButton size="sm" variant="ghost">
                Manage
              </QuackButton>
            </StickerCardFooter>
          </StickerCard>

          <StickerCard>
            <StickerCardHeader>
              <StickerCardTitle>Add a registry</StickerCardTitle>
              <StickerCardDescription>
                Point the CLI at any namespace you trust.
              </StickerCardDescription>
            </StickerCardHeader>
            <StickerCardContent className="flex flex-col gap-4">
              <GlowField
                label="Registry URL"
                helper="The CLI reads one JSON file per component."
              >
                <GlowInput
                  defaultValue={site.registryUrl}
                  spellCheck={false}
                />
              </GlowField>
              <QuackButton
                className="w-full"
                idle={plain ? "none" : "sheen"}
                ripple={!plain}
              >
                Save registry
              </QuackButton>
            </StickerCardContent>
          </StickerCard>
        </div>
      </div>
    </div>
  );
}
