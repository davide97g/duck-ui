"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";

import { GlowColor } from "@/components/ui/glow-color";
import { GlowField } from "@/components/ui/glow-input";
import { HudLabel } from "@/components/ui/hud-label";
import { QuackButton } from "@/components/ui/quack-button";

const DEFAULTS = { fill: "#c6f24e", stroke: "#0b0b0d" };

export default function GlowColorDemo() {
  const [fill, setFill] = React.useState(DEFAULTS.fill);
  const [stroke, setStroke] = React.useState(DEFAULTS.stroke);
  const [copied, setCopied] = React.useState<string | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  /* The clipboard write belongs on onPick: a colour lifted off a reference is a
     colour you are about to paste somewhere. On onValueChange it would fire on
     every frame of a swatch drag. */
  const copyPick = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(null), 1600);
    } catch {
      // A refused clipboard is not worth a broken swatch. The colour is set.
    }
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <GlowField
        label="Brand colour"
        helper={
          copied
            ? `Copied ${copied.toUpperCase()} to the clipboard.`
            : "Used for the accent and the glow. A picked colour is copied too."
        }
      >
        <GlowColor
          value={fill}
          onValueChange={setFill}
          onPick={copyPick}
          showValue
        />
      </GlowField>

      {/* The rail row every design tool has twenty of: label, swatch,
          eyedropper, reset. The reset is the app's — it knows the default. */}
      <div className="sticker flex flex-col gap-3 rounded-xl border-border bg-card p-3">
        <HudLabel>fill</HudLabel>
        {(
          [
            ["Shape", fill, setFill, DEFAULTS.fill],
            ["Outline", stroke, setStroke, DEFAULTS.stroke],
          ] as const
        ).map(([label, value, set, fallback]) => (
          <div key={label} className="flex items-center justify-between gap-2">
            <span className="truncate text-xs font-medium">{label}</span>
            <div className="flex shrink-0 items-center gap-1">
              <GlowColor
                size="sm"
                value={value}
                onValueChange={set}
                aria-label={`${label} colour`}
              />
              <QuackButton
                variant="ghost"
                size="icon-xs"
                ripple={false}
                aria-label={`Reset ${label.toLowerCase()} colour`}
                disabled={value === fallback}
                onClick={() => set(fallback)}
              >
                <RotateCcw />
              </QuackButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
