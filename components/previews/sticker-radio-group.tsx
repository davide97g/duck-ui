"use client";

import * as React from "react";

import {
  StickerRadio,
  StickerRadioGroup,
} from "@/components/ui/sticker-radio-group";
import { GlowFieldset } from "@/components/ui/glow-input";

export default function StickerRadioGroupDemo() {
  const [plan, setPlan] = React.useState("duckling");

  return (
    <div className="w-full max-w-sm">
      <GlowFieldset legend="Plan" helper="Change it any time. Prices exclude VAT.">
        <StickerRadioGroup value={plan} onValueChange={setPlan}>
          <StickerRadio value="duckling" description="1 seat, 3 projects">
            Duckling — free
          </StickerRadio>
          <StickerRadio value="mallard" description="5 seats, unlimited projects">
            Mallard — €12/month
          </StickerRadio>
          <StickerRadio value="flock" description="Talk to us about volume">
            Flock — custom
          </StickerRadio>
        </StickerRadioGroup>
      </GlowFieldset>
    </div>
  );
}
