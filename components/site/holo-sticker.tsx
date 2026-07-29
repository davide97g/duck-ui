"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useHoloPointer } from "@/hooks/use-holo-pointer";
import { DuckMark } from "@/components/brand/duck-mark";

/**
 * The hero sticker. A die-cut vinyl duck: foil edge, white cut line, a corner
 * lifting off the backing, and a specular highlight that tracks the pointer
 * the way real holographic film does.
 */
export function HoloSticker({ className }: { className?: string }) {
  const ref = useHoloPointer<HTMLDivElement>({ tilt: 14 });

  return (
    <div
      className={cn(
        "[animation:duck-float_7s_ease-in-out_infinite]",
        className
      )}
    >
      <div
        ref={ref}
        className={cn(
          "group/sticker tilt data-[holo=active]:tilt-live relative aspect-square w-full max-w-[22rem]",
          "rotate-[-6deg] transition-[rotate] duration-500 ease-[var(--ease-duck)] hover:rotate-0"
        )}
      >
        {/* Foil edge */}
        <div className="foil size-full rounded-[28%] p-[7px] drop-shadow-[0_30px_60px_oklch(0_0_0/0.45)]">
          {/* White vinyl cut line */}
          <div className="size-full rounded-[26%] bg-vinyl p-[5px]">
            {/* Artwork */}
            <div className="relative grid size-full place-items-center overflow-hidden rounded-[24%] bg-[oklch(0.16_0.006_285)]">
              <div
                aria-hidden
                className="absolute inset-0 opacity-45 [background-image:radial-gradient(oklch(1_0_0/0.16)_1px,transparent_1px)] [background-size:14px_14px]"
              />
              <DuckMark className="relative size-[62%] drop-shadow-[0_10px_28px_oklch(0.72_0.19_55/0.45)]" />
              <span className="absolute bottom-[13%] font-display text-sm font-extrabold tracking-[0.3em] text-[oklch(1_0_0/0.55)] uppercase">
                duck/ui
              </span>

              {/* Specular highlight, driven by --fx / --fy */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/sticker:opacity-100"
                style={{
                  backgroundImage:
                    "radial-gradient(45% 45% at calc(var(--fx) * 1%) calc(var(--fy) * 1%), oklch(1 0 0 / 0.22), transparent 70%)",
                }}
              />
            </div>
          </div>
        </div>

        {/* The corner that lifts */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute right-0 bottom-0 size-20 origin-bottom-right scale-0 rounded-br-[26%]",
            "bg-[linear-gradient(315deg,var(--muted)_40%,var(--border)_50%,var(--background)_60%)]",
            "[clip-path:polygon(100%_0,100%_100%,0_100%)]",
            "shadow-[-10px_-10px_28px_oklch(0_0_0/0.35)]",
            "transition-transform duration-500 ease-[var(--ease-duck)]",
            "group-hover/sticker:scale-100"
          )}
        />
      </div>
    </div>
  );
}
