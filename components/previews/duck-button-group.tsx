"use client";

import * as React from "react";
import { Crosshair, Minus, Plus, Redo2, Trash2, Undo2 } from "lucide-react";

import { DuckButtonGroup } from "@/components/ui/duck-button-group";
import { QuackButton } from "@/components/ui/quack-button";

const STEPS = [25, 50, 75, 100, 150, 200, 400];

export default function DuckButtonGroupDemo() {
  const [step, setStep] = React.useState(3);
  const zoom = STEPS[step];

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-6">
      <div className="sticker relative flex h-44 w-full items-center justify-center rounded-xl border-border bg-card">
        <span className="hud">{zoom}%</span>

        {/* The report's case: a canvas cluster of icon buttons. Icon-only and
            it owns the corner, so it is a toolbar — one Tab in, arrows between
            the three. */}
        <DuckButtonGroup
          orientation="vertical"
          toolbar
          aria-label="Zoom"
          className="absolute right-4 bottom-4"
        >
          {/* Clamped rather than disabled at the ends: a toolbar button that
              disables itself under the user's finger takes the focus with it. */}
          <QuackButton
            variant="outline"
            size="icon"
            aria-label="Zoom in"
            onClick={() =>
              setStep((current) => Math.min(current + 1, STEPS.length - 1))
            }
          >
            <Plus />
          </QuackButton>
          <QuackButton
            variant="outline"
            size="icon"
            aria-label="Zoom out"
            onClick={() => setStep((current) => Math.max(current - 1, 0))}
          >
            <Minus />
          </QuackButton>
          <QuackButton
            variant="outline"
            size="icon"
            aria-label="Reset zoom"
            onClick={() => setStep(3)}
          >
            <Crosshair />
          </QuackButton>
        </DuckButtonGroup>
      </div>

      {/* Unjoined: three separate controls that happen to travel together, so
          they keep their own edges and only share the geometry. */}
      <DuckButtonGroup joined={false} toolbar aria-label="Canvas history">
        <QuackButton variant="outline">
          <Undo2 />
          Undo
        </QuackButton>
        <QuackButton variant="outline">
          <Redo2 />
          Redo
        </QuackButton>
        <QuackButton variant="outline" disabled>
          <Trash2 />
          Clear
        </QuackButton>
      </DuckButtonGroup>

      <p className="text-sm text-muted-foreground">
        Both clusters cost one Tab. Drop <code>toolbar</code> for a plain named
        group when the buttons sit inside a form and every one of them should
        have its own stop.
      </p>
    </div>
  );
}
