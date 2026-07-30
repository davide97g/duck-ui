import * as React from "react";

import { cn } from "@/lib/utils";
import { DuckMark } from "@/components/ui/duck-mark";

/**
 * QuackBubble — a message that has a voice, which is the first time in this
 * registry that the Quack prefix has been literally true.
 *
 * The assistant speaks from the pond side: its bubble carries the mark and a
 * squared corner on the side it speaks from — the corner the die did not round
 * off. No CSS triangle tail: a tail drawn with borders cannot survive a 3px
 * sticker edge, and a clip-path notch would cut the edge open.
 *
 * The user's bubble is plain lime vinyl with no mark. One voice in the
 * conversation is a character; the other is a person.
 */
export interface QuackBubbleProps extends React.ComponentProps<"div"> {
  from?: "assistant" | "user";
  /** Timestamp, model name, "edited" — whatever belongs under the message. */
  meta?: string;
}

function QuackBubble({
  className,
  from = "assistant",
  meta,
  children,
  ...props
}: QuackBubbleProps) {
  const assistant = from === "assistant";

  return (
    <div
      data-slot="quack-bubble"
      data-from={from}
      className={cn(
        "flex w-full gap-3",
        assistant ? "justify-start" : "justify-end",
        className
      )}
      {...props}
    >
      {assistant && (
        <span
          aria-hidden
          className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-secondary"
        >
          <DuckMark className="size-5" />
        </span>
      )}

      <div className="flex max-w-[38rem] min-w-0 flex-col gap-1">
        <div
          className={cn(
            "relative rounded-2xl px-4 py-2.5 text-sm",
            // The squared corner points back at the speaker.
            assistant
              ? "sticker border-border rounded-tl-md bg-card text-card-foreground"
              : "rounded-br-md bg-primary text-primary-foreground"
          )}
        >
          {children}
        </div>
        {meta && (
          <span
            className={cn(
              "font-mono text-[11px] text-muted-foreground",
              assistant ? "text-left" : "text-right"
            )}
          >
            {meta}
          </span>
        )}
      </div>
    </div>
  );
}

export { QuackBubble };
