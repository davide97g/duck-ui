import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * DuckGlyph — the duck mark, built from three primitives: a circle, a
 * rounded bar and a dot. Reused by the spinner and by button loading states.
 */
function DuckGlyph({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      className={cn("size-full", className)}
      {...props}
    >
      <path
        d="M24 15.4 L35.4 17.3 Q39.4 18 39.4 19.9 Q39.4 21.8 35.4 22.5 L24 24.4 Z"
        fill="oklch(0.82 0.16 62)"
      />
      <circle cx="16.5" cy="20" r="11.5" fill="currentColor" />
      <circle cx="20.2" cy="15.6" r="1.9" className="fill-card" />
    </svg>
  );
}

const spinnerSizes = {
  sm: "size-5",
  default: "size-8",
  lg: "size-12",
} as const;

/**
 * DuckSpinner — a duck paddling on water. The rings are the wake.
 */
function DuckSpinner({
  className,
  size = "default",
  label = "Loading",
  ...props
}: React.ComponentProps<"span"> & {
  size?: keyof typeof spinnerSizes;
  label?: string;
}) {
  return (
    <span
      data-slot="duck-spinner"
      role="status"
      aria-live="polite"
      className={cn(
        "relative inline-grid place-items-center",
        spinnerSizes[size],
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className="absolute size-full rounded-full border-2 border-primary/50 [animation:duck-ripple_1.6s_ease-out_infinite]"
      />
      <span
        aria-hidden
        className="absolute size-full rounded-full border-2 border-primary/40 [animation:duck-ripple_1.6s_ease-out_0.8s_infinite]"
      />
      <DuckGlyph className="relative text-primary [animation:duck-paddle_0.9s_ease-in-out_infinite]" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export { DuckSpinner, DuckGlyph };
