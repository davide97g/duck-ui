import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * StickerProgress — the peel. Progress is a sticker coming off its backing
 * left to right: what is done is solid vinyl, what is left is cut-line dashes,
 * and the boundary between them is the peel edge.
 *
 * Lime only. A progress bar is on screen for the entire wait, so it is the
 * worst possible place to spend the viewport's one holo element.
 */
export interface StickerProgressProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** 0 to max. Omit for indeterminate. */
  value?: number;
  max?: number;
  label?: string;
  /** Print the percentage next to the label, in tabular figures. */
  showValue?: boolean;
}

function StickerProgress({
  className,
  value,
  max = 100,
  label,
  showValue = false,
  ...props
}: StickerProgressProps) {
  const indeterminate = value === undefined;
  const percent = indeterminate
    ? 0
    : Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      data-slot="sticker-progress"
      className={cn("flex w-full flex-col gap-1.5", className)}
      {...props}
    >
      {(label || showValue) && (
        <div className="flex items-baseline justify-between gap-3 text-xs">
          {label && <span className="font-medium">{label}</span>}
          {showValue && !indeterminate && (
            <span className="font-mono tabular-nums text-muted-foreground">
              {Math.round(percent)}%
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-label={label ?? "Progress"}
        aria-busy={indeterminate || undefined}
        aria-valuemin={indeterminate ? undefined : 0}
        aria-valuemax={indeterminate ? undefined : max}
        aria-valuenow={indeterminate ? undefined : value}
        className={cn(
          "relative h-3 w-full overflow-hidden rounded-full",
          // The backing the sticker has not left yet.
          "cut-line bg-transparent",
          indeterminate &&
            "border-primary/40 bg-[linear-gradient(105deg,transparent_38%,var(--primary)_50%,transparent_62%)] bg-[length:280%_100%] [animation:duck-shimmer_1.4s_ease-in-out_infinite]"
        )}
      >
        {!indeterminate && (
          <div
            style={{ width: `${percent}%` }}
            className="relative h-full rounded-full bg-primary transition-[width] duration-500 ease-[var(--ease-duck)]"
          >
            {/* The peel edge: vinyl catches the light where it lifts. */}
            <span
              aria-hidden
              className="absolute inset-y-0 right-0 w-[3px] rounded-full bg-vinyl opacity-70"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export { StickerProgress };
