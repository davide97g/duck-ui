"use client";

import * as React from "react";
import { Layers } from "lucide-react";

import { GlowField } from "@/components/ui/glow-input";
import {
  GlowSelect,
  GlowSelectContent,
  GlowSelectGroup,
  GlowSelectItem,
  GlowSelectLabel,
  GlowSelectRoot,
  GlowSelectSeparator,
  GlowSelectTrigger,
  GlowSelectValue,
} from "@/components/ui/glow-select";
import { HudLabel } from "@/components/ui/hud-label";

export default function GlowSelectDemo() {
  const [blend, setBlend] = React.useState("normal");

  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      {/* GlowField clones the id, aria-describedby and aria-invalid onto the
          trigger, so a select is wrapped exactly like an input. */}
      <GlowField label="Canvas format" helper="Sets the export size.">
        <GlowSelect defaultValue="yt" placeholder="Pick a format">
          <GlowSelectItem value="yt">YouTube thumbnail · 1280×720</GlowSelectItem>
          <GlowSelectItem value="square">Square · 1080×1080</GlowSelectItem>
          <GlowSelectItem value="story">Story · 1080×1920</GlowSelectItem>
          <GlowSelectItem value="wide" disabled>
            Ultrawide · needs Pro
          </GlowSelectItem>
        </GlowSelect>
      </GlowField>

      <GlowField
        label="Typeface"
        error="That family is not licensed for this workspace."
      >
        <GlowSelect defaultValue="bricolage">
          <GlowSelectItem value="bricolage">Bricolage Grotesque</GlowSelectItem>
          <GlowSelectItem value="geist">Geist</GlowSelectItem>
        </GlowSelect>
      </GlowField>

      {/* The rail case: a 32px select on a label row, beside the readout it
          belongs to. Composed rather than all-in-one, for the group headings. */}
      <div className="sticker flex flex-col gap-2 rounded-xl border-border bg-card p-3">
        <HudLabel dot dotTone="primary">
          layer
        </HudLabel>
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 truncate text-xs font-medium">
            <Layers className="size-3.5 shrink-0 text-muted-foreground" />
            Title block
          </span>
          <GlowSelectRoot value={blend} onValueChange={setBlend}>
            <GlowSelectTrigger size="sm" className="w-32">
              <GlowSelectValue />
            </GlowSelectTrigger>
            <GlowSelectContent align="end">
              <GlowSelectGroup>
                <GlowSelectLabel>normal</GlowSelectLabel>
                <GlowSelectItem value="normal">Normal</GlowSelectItem>
              </GlowSelectGroup>
              <GlowSelectSeparator />
              <GlowSelectGroup>
                <GlowSelectLabel>lighten</GlowSelectLabel>
                <GlowSelectItem value="screen">Screen</GlowSelectItem>
                <GlowSelectItem value="lighten">Lighten</GlowSelectItem>
              </GlowSelectGroup>
              <GlowSelectSeparator />
              <GlowSelectGroup>
                <GlowSelectLabel>darken</GlowSelectLabel>
                <GlowSelectItem value="multiply">Multiply</GlowSelectItem>
                <GlowSelectItem value="overlay">Overlay</GlowSelectItem>
              </GlowSelectGroup>
            </GlowSelectContent>
          </GlowSelectRoot>
        </div>
      </div>
    </div>
  );
}
