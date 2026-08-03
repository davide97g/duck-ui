"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * DuckTimeline — a vertical spine that draws itself as the reader goes down it,
 * with a node per entry.
 *
 * The spine is two lines stacked: a full-length one in --border, and a lime one
 * on top scaled from the top by scroll progress. Scaling beats animating height
 * because scaleY is composited, and this element is on screen for the whole
 * section.
 *
 * Progress is measured across the list, not the window: `offset` starts when
 * the top of the list reaches 80% of the viewport and finishes when its bottom
 * passes 60%, so the line is complete at the last node rather than a screen
 * later. The spring only smooths the scrubbing — it never runs on its own.
 *
 * Under reduced motion the lime line is simply drawn in full. A spine that
 * never fills reads as a broken component; a spine that is already filled
 * reads as a spine.
 */
function DuckTimeline({
  className,
  children,
  ...props
}: React.ComponentProps<"ol">) {
  const ref = React.useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"],
  });
  const drawn = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <ol
      ref={ref}
      data-slot="duck-timeline"
      className={cn("relative flex flex-col", className)}
      {...props}
    >
      {/* The spine sits under the nodes and is decorative: the list itself
          already carries the order. */}
      <span
        aria-hidden
        className="absolute top-2 bottom-2 left-[3px] w-px bg-border"
      />
      <motion.span
        aria-hidden
        className="absolute top-2 bottom-2 left-[3px] w-px origin-top bg-primary"
        style={{ scaleY: reduce ? 1 : drawn }}
      />
      {children}
    </ol>
  );
}

function DuckTimelineItem({
  className,
  when,
  title,
  children,
  active = false,
  ...props
}: React.ComponentProps<"li"> & {
  /** Date, version, milestone — whatever the entry is pinned to. */
  when?: React.ReactNode;
  title?: React.ReactNode;
  /** The node stays lit without a hover. For the current entry. */
  active?: boolean;
}) {
  return (
    <li
      data-slot="duck-timeline-item"
      data-active={active || undefined}
      className={cn("group/node relative flex flex-col gap-1 py-4 pl-8", className)}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-[1.4rem] left-0 size-[7px] shrink-0 rounded-full",
          "transition-[background-color,box-shadow,transform] duration-300 ease-[var(--ease-duck)]",
          active
            ? "bg-primary duck-glow-primary"
            : "bg-border group-hover/node:scale-125 group-hover/node:bg-primary"
        )}
      />
      {when !== undefined && <span className="hud hud-sm">{when}</span>}
      {title !== undefined && (
        <span className="font-display leading-snug font-semibold tracking-tight">
          {title}
        </span>
      )}
      {children && (
        <div className="text-sm text-muted-foreground">{children}</div>
      )}
    </li>
  );
}

export { DuckTimeline, DuckTimelineItem };
