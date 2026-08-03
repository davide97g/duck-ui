import * as React from "react";

import { cn } from "@/lib/utils";
import { DuckMark } from "@/components/ui/duck-mark";

/**
 * DuckThinking — the wake without the duck going anywhere.
 *
 * A spinner says "wait". This says "something is working the water": the mark
 * paddles in place while two rings spread out from it. It is the same idea as
 * DuckSpinner, sized and worded for a conversation rather than a button, and
 * it reuses the same two keyframes rather than inventing new ones.
 *
 * The duck is the default drawing, not the component. This is the wait state
 * for anything with a conversation in it, and almost nothing with a
 * conversation in it is about a duck — so `mark` swaps the drawing the way
 * EmptyPond's `art` does, and the ripples, the geometry and the live region
 * stay where they are.
 */
export interface DuckThinkingProps extends React.ComponentProps<"div"> {
  /** Read out to screen readers and, unless hidden, shown beside the duck. */
  label?: string;
  showLabel?: boolean;
  /**
   * What paddles at the centre of the ripples. Rendered as given, inside a 2rem
   * frame that is already aria-hidden, so a replacement sizes itself and opts
   * into the paddle if it wants it.
   */
  mark?: React.ReactNode;
}

function DuckThinking({
  className,
  label = "Thinking",
  showLabel = true,
  mark = (
    <DuckMark className="relative size-6 [animation:duck-paddle_0.9s_ease-in-out_infinite]" />
  ),
  ...props
}: DuckThinkingProps) {
  return (
    <div
      data-slot="duck-thinking"
      role="status"
      aria-live="polite"
      className={cn("inline-flex items-center gap-3", className)}
      {...props}
    >
      <span aria-hidden className="relative grid size-8 place-items-center">
        <span className="absolute size-7 rounded-full border-2 border-primary/30 [animation:duck-ripple_2.2s_ease-out_infinite]" />
        <span className="absolute size-7 rounded-full border-2 border-primary/30 [animation:duck-ripple_2.2s_ease-out_1.1s_infinite]" />
        {mark}
      </span>
      {/* One or the other. Rendering both would announce it twice. */}
      {showLabel ? (
        <span className="text-sm text-muted-foreground">{label}</span>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </div>
  );
}

export { DuckThinking };
