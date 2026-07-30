"use client";

import * as React from "react";

import { DuckSwitch } from "@/components/ui/duck-switch";
import { GlowFieldset } from "@/components/ui/glow-input";

export default function DuckSwitchDemo() {
  const [shipping, setShipping] = React.useState(true);

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <GlowFieldset
        legend="Notifications"
        helper="Applies to this workspace only."
      >
        <DuckSwitch
          checked={shipping}
          onChange={(event) => setShipping(event.target.checked)}
        >
          Email me when a build ships
        </DuckSwitch>
        <DuckSwitch defaultChecked={false}>Weekly digest</DuckSwitch>
        <DuckSwitch size="sm" defaultChecked>
          Play a sound
        </DuckSwitch>
        <DuckSwitch disabled>Slack alerts (connect Slack first)</DuckSwitch>
      </GlowFieldset>
    </div>
  );
}
