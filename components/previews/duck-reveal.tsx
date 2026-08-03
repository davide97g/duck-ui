"use client";

import { DuckReveal, DuckSplitReveal } from "@/components/ui/duck-reveal";
import {
  StickerCard,
  StickerCardDescription,
  StickerCardTitle,
} from "@/components/ui/sticker-card";

export default function DuckRevealDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-6 text-left">
      <h3 className="display-md">
        <DuckSplitReveal text="One word at a time, then the section." />
      </h3>

      {/* Staggered by hand: three siblings, three delays. */}
      <div className="grid gap-3 sm:grid-cols-3">
        {["Read", "Then", "Arrive"].map((label, index) => (
          <DuckReveal key={label} delay={index * 0.08} repeat>
            <StickerCard className="gap-1 p-4">
              <StickerCardTitle className="text-base">{label}</StickerCardTitle>
              <StickerCardDescription className="text-xs">
                delay {index * 80}ms
              </StickerCardDescription>
            </StickerCard>
          </DuckReveal>
        ))}
      </div>

      <DuckReveal direction="in" repeat>
        <p className="text-sm text-muted-foreground">
          Under reduced motion this paragraph is simply here — final state, no
          movement, nothing left invisible.
        </p>
      </DuckReveal>
    </div>
  );
}
