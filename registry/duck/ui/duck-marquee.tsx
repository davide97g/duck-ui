"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * DuckMarquee — a strip that runs. Logos, tags, a ticker of shipped things.
 *
 * One animated track holding the children twice, translated by exactly -50%:
 * at the end of the pass the second copy sits where the first one started, so
 * the reset is invisible. That is also why each copy carries a trailing gap of
 * its own — two groups of equal width make -50% land on a seam instead of half
 * a gap past it.
 *
 * The duplicate is aria-hidden. A screen reader that reads the strip twice has
 * been handed the same list twice for no reason.
 *
 * Under reduced motion the animation stops and the strip becomes a plain
 * horizontal scroller: a frozen marquee that clips half its content is worse
 * than no marquee.
 */
function DuckMarquee({
  className,
  children,
  duration = 28,
  reverse = false,
  gap = "2rem",
  pauseOnHover = true,
  fade = true,
  ...props
}: React.ComponentProps<"div"> & {
  /** Seconds for one full pass. */
  duration?: number;
  reverse?: boolean;
  /** Space between items, any CSS length. */
  gap?: string;
  pauseOnHover?: boolean;
  /** Fade the two edges into the background. */
  fade?: boolean;
}) {
  const group = (
    <div className="flex shrink-0 items-center gap-[var(--marquee-gap)] pr-[var(--marquee-gap)]">
      {children}
    </div>
  );

  return (
    <div
      data-slot="duck-marquee"
      style={
        {
          "--marquee-duration": `${duration}s`,
          "--marquee-gap": gap,
        } as React.CSSProperties
      }
      className={cn(
        "group/marquee relative w-full overflow-hidden",
        "motion-reduce:overflow-x-auto",
        fade &&
          "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className
      )}
      {...props}
    >
      <div
        data-slot="duck-marquee-track"
        className={cn(
          "flex w-max [animation:duck-marquee_var(--marquee-duration)_linear_infinite]",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover/marquee:[animation-play-state:paused]",
          "motion-reduce:animate-none"
        )}
      >
        {group}
        <div aria-hidden className="contents motion-reduce:hidden">
          {group}
        </div>
      </div>
    </div>
  );
}

export { DuckMarquee };
