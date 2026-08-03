"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * DuckReveal / DuckSplitReveal — content arrives as the reader gets to it.
 *
 * The reduced-motion arm is the point. The lazy version of this component
 * skips the animation by never running it, which leaves the element at its
 * initial state — invisible, shifted, and permanently so if the browser also
 * disabled transitions. Here reduced motion renders the *final* state
 * immediately: no movement, all content.
 *
 * `once` defaults to true because a section that re-animates every time it
 * scrolls back into view is a section nobody can re-read.
 */

const EASE_DUCK = [0.16, 1, 0.3, 1] as const;

export interface DuckRevealProps
  extends Omit<React.ComponentProps<typeof motion.div>, "initial" | "whileInView" | "variants"> {
  /** Seconds before it starts, for staggering siblings by hand. */
  delay?: number;
  /** Seconds the move takes. */
  duration?: number;
  /** Distance travelled, in px. Negative comes from the other side. */
  distance?: number;
  /** "up" and "down" translate; "in" is opacity only. */
  direction?: "up" | "down" | "left" | "right" | "in";
  /** Replay every time it enters the viewport. */
  repeat?: boolean;
}

const offsetFor = (direction: DuckRevealProps["direction"], distance: number) => {
  switch (direction) {
    case "down":
      return { y: -distance };
    case "left":
      return { x: distance };
    case "right":
      return { x: -distance };
    case "in":
      return {};
    default:
      return { y: distance };
  }
};

function DuckReveal({
  className,
  delay = 0,
  duration = 0.65,
  distance = 22,
  direction = "up",
  repeat = false,
  children,
  ...props
}: DuckRevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      data-slot="duck-reveal"
      className={cn(className)}
      initial={reduce ? false : { opacity: 0, ...offsetFor(direction, distance) }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      // A margin at the bottom means a section starts moving slightly before it
      // is fully in view, which is what makes it feel like it was already there.
      viewport={{ once: !repeat, amount: 0.1, margin: "0px 0px -8% 0px" }}
      transition={{ duration, delay, ease: EASE_DUCK }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

const splitVariants: Variants = {
  hidden: {},
  shown: {},
};

export interface DuckSplitRevealProps extends React.ComponentProps<typeof motion.span> {
  /** The line. A string, because it has to be split. */
  text: string;
  /** Reveal one word at a time or one character at a time. */
  by?: "word" | "char";
  /** Seconds between two pieces. */
  stagger?: number;
  delay?: number;
  repeat?: boolean;
}

/**
 * A headline that assembles itself. Only for a headline: a paragraph split into
 * words is 200 animated elements and a line-break that lands in a new place on
 * every reflow.
 */
function DuckSplitReveal({
  className,
  text,
  by = "word",
  stagger = 0.045,
  delay = 0,
  repeat = false,
  ...props
}: DuckSplitRevealProps) {
  const reduce = useReducedMotion();
  const pieces = by === "char" ? Array.from(text) : text.split(" ");

  if (reduce) {
    return (
      <span data-slot="duck-split-reveal" className={cn(className)}>
        {text}
      </span>
    );
  }

  return (
    <motion.span
      data-slot="duck-split-reveal"
      className={cn("inline-block", className)}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: !repeat, amount: 0.4 }}
      variants={splitVariants}
      transition={{ delayChildren: delay, staggerChildren: stagger }}
      // The pieces are decoration; the sentence is the accessible name.
      aria-label={text}
      {...props}
    >
      {pieces.map((piece, index) => (
        <React.Fragment key={`${piece}-${index}`}>
          <motion.span
            aria-hidden
            className="inline-block"
            variants={{
              hidden: { opacity: 0, y: "0.5em" },
              shown: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.55, ease: EASE_DUCK }}
          >
            {piece}
          </motion.span>
          {/* The space belongs between two pieces, not inside one: a trailing
              space in an inline-block collapses and the words run together. */}
          {by === "word" && index < pieces.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </motion.span>
  );
}

export { DuckReveal, DuckSplitReveal };
