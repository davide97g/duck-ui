"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * StreamText — text arriving a piece at a time, ending in the Terminal's caret.
 *
 * Two modes, and the difference matters. Give it `text` and it types the string
 * out itself, which is a demo. Give it `streaming` and it just renders whatever
 * you pass and keeps the caret lit, which is what a real token stream needs —
 * the model sets the pace, not a timer.
 *
 * Deliberately unprefixed, like Terminal, whose typing behaviour it shares.
 * Under reduced motion the whole string is there immediately: someone who has
 * asked for less movement should not be made to wait for a typewriter.
 */
export interface StreamTextProps
  extends Omit<React.ComponentProps<"span">, "children"> {
  /** The full string, revealed at `speed`. Ignored when `streaming` is set. */
  text?: string;
  /** Already-streaming content. Render it and keep the caret while it grows. */
  streaming?: string;
  /** True while more tokens are coming. Drives the caret in streaming mode. */
  active?: boolean;
  /** Milliseconds per character in `text` mode. */
  speed?: number;
  onDone?: () => void;
}

function StreamText({
  className,
  text,
  streaming,
  active,
  speed = 18,
  onDone,
  ...props
}: StreamTextProps) {
  const driven = streaming !== undefined;
  const [typed, setTyped] = React.useState("");

  React.useEffect(() => {
    if (driven || !text) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(text);
      onDone?.();
      return;
    }

    setTyped("");
    let index = 0;
    const id = window.setInterval(() => {
      index += 1;
      setTyped(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(id);
        onDone?.();
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [driven, text, speed, onDone]);

  const body = driven ? streaming : typed;
  const caret = driven ? active : typed.length < (text?.length ?? 0);

  return (
    <span
      data-slot="stream-text"
      // The text is the payload, so announce additions rather than re-reading
      // the whole message every token.
      aria-live="polite"
      aria-atomic={false}
      className={cn("inline", className)}
      {...props}
    >
      {body}
      {caret && (
        <span
          aria-hidden
          className="ml-0.5 inline-block h-[1em] w-px translate-y-[0.15em] bg-primary [animation:duck-caret_1s_step-end_infinite]"
        />
      )}
    </span>
  );
}

export { StreamText };
