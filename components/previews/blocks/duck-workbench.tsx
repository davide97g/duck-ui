"use client";

import * as React from "react";
import { Hand, MousePointer2, Square, Type } from "lucide-react";

import { DuckWorkbench } from "@/components/blocks/duck-workbench";
import { DuckSlider } from "@/components/ui/duck-slider";
import { GlowColor } from "@/components/ui/glow-color";
import { GlowSelect, GlowSelectItem } from "@/components/ui/glow-select";
import { HudLabel } from "@/components/ui/hud-label";

/** A sticker on a canvas, and the rail that changes it. */
export default function DuckWorkbenchDemo() {
  const [tool, setTool] = React.useState("select");
  const [fill, setFill] = React.useState("#c6f24e");
  const [size, setSize] = React.useState(96);
  const [radius, setRadius] = React.useState(28);
  const [font, setFont] = React.useState("display");

  const tools = [
    { icon: <MousePointer2 />, label: "Select", value: "select" },
    { icon: <Hand />, label: "Pan", value: "pan" },
    { icon: <Square />, label: "Rectangle", value: "rect" },
    { icon: <Type />, label: "Text", value: "text" },
  ];

  return (
    <DuckWorkbench
      className="h-[520px] rounded-2xl border border-border"
      title="sticker.duck"
      status={`1 shape selected · ${size}×${size}`}
      viewportProps={{ initial: { scale: 1 }, min: 0.4, max: 3 }}
      tools={tools.map((item) => ({
        icon: item.icon,
        label: item.label,
        active: tool === item.value,
        onSelect: () => setTool(item.value),
      }))}
      inspector={
        <>
          <HudLabel asChild>
            <h3>shape</h3>
          </HudLabel>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium">Fill</span>
            <GlowColor size="sm" value={fill} onValueChange={setFill} aria-label="Fill" />
          </div>
          <DuckSlider
            label="Size"
            min={16}
            max={480}
            step={1}
            curve="log"
            value={size}
            onValueChange={setSize}
            showValue
            valuePosition="row"
            formatValue={(value) => `${Math.round(value)}px`}
          />
          <DuckSlider
            label="Radius"
            min={0}
            max={120}
            step={1}
            value={radius}
            onValueChange={setRadius}
            showValue
            valuePosition="row"
            formatValue={(value) => `${value}px`}
          />

          <HudLabel asChild>
            <h3 className="mt-2">text</h3>
          </HudLabel>
          <GlowSelect
            size="sm"
            value={font}
            onValueChange={setFont}
            aria-label="Typeface"
          >
            <GlowSelectItem value="display">Display</GlowSelectItem>
            <GlowSelectItem value="sans">Sans</GlowSelectItem>
            <GlowSelectItem value="mono">Mono</GlowSelectItem>
          </GlowSelect>
        </>
      }
    >
      <div
        className="sticker grid place-items-center border-border font-display font-extrabold text-background"
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          background: fill,
          fontSize: Math.max(12, size / 5),
        }}
      >
        duck
      </div>
    </DuckWorkbench>
  );
}
