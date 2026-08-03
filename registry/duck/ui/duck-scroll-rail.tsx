"use client";

import * as React from "react";
import { motion, useScroll, useSpring } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * DuckScrollRail — how far down the page you are, as one lime hairline.
 *
 * A progress bar for reading, so it is deliberately the quietest thing on the
 * screen: one pixel, no numbers, no label, `aria-hidden` because scroll
 * position is not information a screen reader is missing.
 *
 * Fixed and composited: transform-only, so it costs nothing per frame even
 * though it updates on every scroll event. The spring is there to keep a
 * trackpad fling from making the line stutter.
 *
 * The rail does not hide under reduced motion. It is a readout, not an
 * animation — it moves because the page moved.
 */
function DuckScrollRail({
  className,
  side = "top",
  thickness = 2,
  ...props
}: Omit<React.ComponentProps<typeof motion.div>, "style"> & {
  /** Along the top of the viewport, or up its trailing edge. */
  side?: "top" | "right";
  /** Rail thickness in px. */
  thickness?: number;
}) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 32,
    restDelta: 0.0005,
  });

  const vertical = side === "right";

  return (
    <motion.div
      aria-hidden
      data-slot="duck-scroll-rail"
      style={{
        ...(vertical
          ? { scaleY: progress, width: thickness }
          : { scaleX: progress, height: thickness }),
      }}
      className={cn(
        "pointer-events-none fixed z-50 bg-primary",
        vertical
          ? "top-0 right-0 h-full origin-top"
          : "top-0 left-0 w-full origin-left",
        className
      )}
      {...props}
    />
  );
}

export { DuckScrollRail };
