"use client";

import * as React from "react";

import { StickerOtp } from "@/components/ui/sticker-otp";
import { GlowFieldset } from "@/components/ui/glow-input";

export default function StickerOtpDemo() {
  const [code, setCode] = React.useState("42");

  return (
    <div className="w-full max-w-sm">
      <GlowFieldset
        legend="Verification code"
        helper="Six digits, sent to the number ending 04."
      >
        <StickerOtp
          value={code}
          onValueChange={setCode}
          aria-label="Verification code"
        />
      </GlowFieldset>
    </div>
  );
}
