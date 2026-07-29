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
 * The same markup, twice. Nothing in the demo changes between the two states
 * except which CSS variables are in scope, which is exactly what installing
 * the theme does to a project.
 */
export function ThemeProof() {
  const [theme, setTheme] = React.useState("duck");
  const neutral = theme === "neutral";

  return (
    <div className="flex flex-col gap-6">
      <DuckTabs value={theme} onValueChange={setTheme} className="items-start">
        <DuckTabsList>
          <DuckTabsTrigger value="neutral">Before</DuckTabsTrigger>
          <DuckTabsTrigger value="duck">After @duck/theme</DuckTabsTrigger>
        </DuckTabsList>
      </DuckTabs>

      <div
        className={cn(
          "rounded-2xl border-2 border-border bg-background p-6 transition-colors duration-500 sm:p-8",
          neutral && "theme-neutral"
        )}
      >
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <StickerCard className="justify-between">
            <StickerCardHeader>
              <div className="flex items-center justify-between gap-3">
                <StickerCardTitle>Pond access</StickerCardTitle>
                <HoloBadge variant={neutral ? "outline" : "primary"}>
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
                    ring={neutral ? "none" : "primary"}
                    {...person}
                  />
                ))}
              </HoloAvatarGroup>
            </StickerCardContent>
            <StickerCardFooter className="gap-3">
              <QuackButton size="sm" ripple={!neutral}>
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
                idle={neutral ? "none" : "sheen"}
                ripple={!neutral}
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
