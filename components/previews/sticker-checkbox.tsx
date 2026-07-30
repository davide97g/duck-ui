"use client";

import * as React from "react";

import { StickerCheckbox } from "@/components/ui/sticker-checkbox";
import { GlowFieldset } from "@/components/ui/glow-input";

const SCOPES = ["Read issues", "Write issues", "Manage releases"];

export default function StickerCheckboxDemo() {
  const [granted, setGranted] = React.useState([true, false, false]);
  const all = granted.every(Boolean);
  const some = granted.some(Boolean);

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <StickerCheckbox
        checked={all}
        indeterminate={some && !all}
        onChange={(event) => setGranted(granted.map(() => event.target.checked))}
      >
        All scopes
      </StickerCheckbox>

      <GlowFieldset legend="Repository access" className="pl-8">
        {SCOPES.map((scope, index) => (
          <StickerCheckbox
            key={scope}
            checked={granted[index]}
            onChange={(event) =>
              setGranted(
                granted.map((value, i) =>
                  i === index ? event.target.checked : value
                )
              )
            }
          >
            {scope}
          </StickerCheckbox>
        ))}
        <StickerCheckbox disabled>Delete repository (owner only)</StickerCheckbox>
      </GlowFieldset>
    </div>
  );
}
