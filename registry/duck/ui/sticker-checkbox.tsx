"use client";

import * as React from "react";
import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * StickerCheckbox — a kiss-cut square you apply rather than fill in.
 *
 * The tick does not fade in. It lands from oversize with a squash, and the box
 * takes its vinyl edge in the same beat, the way a sticker goes down under a
 * thumb. Unchecked, it is bare backing: the 3px cut edge and nothing else.
 *
 * A real checkbox underneath, so it submits with the form and label clicks,
 * Space, and indeterminate all behave the way the platform already promises.
 */
export interface StickerCheckboxProps
  extends Omit<React.ComponentProps<"input">, "type"> {
  /**
   * Partial selection — the parent of a half-ticked list. This is a DOM
   * property, not an attribute, so it has to be assigned after render.
   */
  indeterminate?: boolean;
  /** Visible label. Without one, pass an aria-label. */
  children?: React.ReactNode;
}

function StickerCheckbox({
  className,
  indeterminate = false,
  children,
  ref,
  ...props
}: StickerCheckboxProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  React.useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label
      data-slot="sticker-checkbox"
      className={cn(
        "inline-flex cursor-pointer items-start gap-3 py-0.5 text-sm select-none",
        "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
        className
      )}
    >
      <input
        ref={inputRef}
        type="checkbox"
        className="peer sr-only"
        aria-checked={indeterminate ? "mixed" : undefined}
        {...props}
      />
      <span
        aria-hidden
        className={cn(
          // Not the card radius: half of 20px is 10px, so --radius-md would
          // round this into a perfect circle and a checkbox would read as a radio.
          "relative grid size-5 shrink-0 place-items-center rounded-[6px]",
          // The die-cut box is 20px. The pseudo-element pushes the tap target
          // out to 24px without moving anything on screen (WCAG 2.5.8).
          "before:absolute before:-inset-[2px] before:content-['']",
          "sticker border-border text-primary-foreground",
          "transition-[background-color,border-color] duration-200 ease-[var(--ease-duck)]",
          "peer-checked:border-primary peer-checked:bg-primary peer-checked:[--tick:1]",
          "peer-checked:[animation:duck-squash_0.3s_var(--ease-squash)]",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
          indeterminate && "border-primary bg-primary [--tick:1]"
        )}
      >
        <span className="scale-[var(--tick,0)] transition-transform duration-200 ease-[var(--ease-squash)]">
          {indeterminate ? (
            <Minus className="size-3.5" strokeWidth={3.5} />
          ) : (
            <Check className="size-3.5" strokeWidth={3.5} />
          )}
        </span>
      </span>
      {children}
    </label>
  );
}

export { StickerCheckbox };
