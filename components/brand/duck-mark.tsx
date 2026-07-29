import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import duckLogo from "@/public/duck.png";

type DuckMarkProps = Omit<
  React.ComponentProps<typeof Image>,
  "src" | "alt" | "width" | "height"
> & {
  alt?: string;
};

/**
 * The duck/ui mark: the official glass duck, cut out of its backdrop so the
 * glow sits on whatever surface it lands on. Ships at 512px, drawn down.
 */
export function DuckMark({ className, alt = "duck/ui", ...props }: DuckMarkProps) {
  return (
    <Image
      src={duckLogo}
      alt={alt}
      sizes="128px"
      className={cn("size-8 shrink-0 select-none object-contain", className)}
      {...props}
    />
  );
}

export function DuckWordmark({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-display text-lg font-extrabold tracking-tight",
        className
      )}
      {...props}
    >
      <DuckMark className="size-7" alt="" aria-hidden priority />
      <span>
        duck<span className="text-primary">/</span>ui
      </span>
    </span>
  );
}
