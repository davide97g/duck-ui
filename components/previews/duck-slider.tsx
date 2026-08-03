"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";

import { DuckSlider } from "@/components/ui/duck-slider";
import { GlowFieldset } from "@/components/ui/glow-input";
import { QuackButton } from "@/components/ui/quack-button";

const DENSITY = ["Compact", "Cosy", "Roomy"];

export default function DuckSliderDemo() {
  const [glow, setGlow] = React.useState(35);
  const [fontSize, setFontSize] = React.useState(72);

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <GlowFieldset legend="Glow" helper="How far the lime bleeds past the edge.">
        <DuckSlider
          value={glow}
          onChange={(event) => setGlow(event.target.valueAsNumber)}
          showValue
          formatValue={(value) => `${value}%`}
        />
      </GlowFieldset>

      <GlowFieldset legend="Row density">
        <DuckSlider
          defaultValue={1}
          min={0}
          max={2}
          step={1}
          showValue
          formatValue={(value) => DENSITY[value]}
        />
      </GlowFieldset>

      {/* The control-rail shape: the label names the input, the readout sits on
          its row so dragging never reflows it, and the reset is the app's.
          curve="log" gives the 12–400 range a usable track — half of it would
          otherwise live in the first 15%. */}
      <DuckSlider
        label="Font size"
        curve="log"
        min={12}
        max={400}
        step={1}
        value={fontSize}
        onValueChange={setFontSize}
        showValue
        valuePosition="row"
        formatValue={(value) => `${value}px`}
        action={
          <QuackButton
            variant="ghost"
            size="icon-xs"
            ripple={false}
            aria-label="Reset font size"
            disabled={fontSize === 72}
            onClick={() => setFontSize(72)}
          >
            <RotateCcw />
          </QuackButton>
        }
      />
    </div>
  );
}
