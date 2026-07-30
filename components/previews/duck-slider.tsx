"use client";

import * as React from "react";

import { DuckSlider } from "@/components/ui/duck-slider";
import { GlowFieldset } from "@/components/ui/glow-input";

const DENSITY = ["Compact", "Cosy", "Roomy"];

export default function DuckSliderDemo() {
  const [glow, setGlow] = React.useState(35);

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
    </div>
  );
}
