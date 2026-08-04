import * as React from "react";

import { cn } from "@/lib/utils";
import { GlowInput } from "@/components/ui/glow-input";
import { HoloButton } from "@/components/ui/holo-button";
import { HudLabel } from "@/components/ui/hud-label";
import { StickerCard } from "@/components/ui/sticker-card";

/**
 * DuckCtaBand — the last thing on the page: one ask, one button, nothing else.
 *
 * The holo rule is per viewport, not per page, so a band at the bottom is
 * allowed the iridescent edge the hero already spent — by the time a reader gets
 * here the hero is long gone. What is not allowed is holo on the card *and* on
 * the button inside it: an iridescent border around an iridescent button reads
 * as a rendering bug, so `variant="holo"` forces the primary action to lime.
 * That is the same call DuckPricing makes for its featured tier.
 *
 * `capture` is the other half of a real CTA band, and it is a plain `<form>` —
 * no state, no client code. `action` takes a URL string or a server function, so
 * the block posts to an endpoint on a Vite project and to a server action on
 * Next without changing shape. An email row needs the input to be the label's
 * target and the button to say what it does; both are wired here, because the
 * hand-written version of this row is where the `aria-label` goes missing.
 */
export interface DuckCtaBandCapture {
  /** A URL, or a server function taking FormData. */
  action?: React.ComponentProps<"form">["action"];
  method?: "get" | "post";
  /** Field name the endpoint reads. */
  name?: string;
  type?: "email" | "text";
  placeholder?: string;
  /** Visually hidden, since the placeholder carries the visible hint. */
  label?: string;
  buttonLabel?: string;
}

export interface DuckCtaBandProps
  extends Omit<React.ComponentProps<"section">, "title"> {
  /** Small line above the headline. */
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  /** An email row instead of, or beside, the actions. */
  capture?: DuckCtaBandCapture;
  /** Under the actions: "no card", "unsubscribe in one click", a licence note. */
  note?: React.ReactNode;
  /** holo puts the iridescent ring on the band and keeps the button lime. */
  variant?: "holo" | "solid";
  /** Stacked and centred, or headline left and actions right. */
  align?: "center" | "split";
}

function DuckCtaBand({
  className,
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  capture,
  note,
  variant = "holo",
  align = "center",
  ...props
}: DuckCtaBandProps) {
  const holo = variant === "holo";
  const split = align === "split";

  const actions = (
    <div
      className={cn(
        "flex flex-col items-stretch gap-3 sm:flex-row sm:items-center",
        !split && "sm:justify-center"
      )}
    >
      {primaryAction && (
        <HoloButton
          asChild
          size="lg"
          // Lime inside a holo band, holo when the band is quiet: exactly one
          // iridescent element either way.
          variant={holo ? "primary" : "holo"}
        >
          <a href={primaryAction.href}>{primaryAction.label}</a>
        </HoloButton>
      )}
      {secondaryAction && (
        <HoloButton asChild size="lg" variant="outline">
          <a href={secondaryAction.href}>{secondaryAction.label}</a>
        </HoloButton>
      )}
    </div>
  );

  const form = capture && (
    <form
      data-slot="duck-cta-band-capture"
      action={capture.action}
      method={capture.method ?? "post"}
      className={cn(
        "flex w-full flex-col gap-3 sm:flex-row",
        !split && "sm:mx-auto sm:max-w-md"
      )}
    >
      {/* The label wraps the input rather than pointing at an id: two bands on
          one page would otherwise ship a duplicate id, and a block cannot mint a
          unique one without becoming a client component. */}
      <label className="sm:flex-1">
        <span className="sr-only">{capture.label ?? "Email address"}</span>
        <GlowInput
          name={capture.name ?? "email"}
          type={capture.type ?? "email"}
          autoComplete={capture.type === "text" ? undefined : "email"}
          required
          placeholder={capture.placeholder ?? "you@example.com"}
          className="w-full"
        />
      </label>
      <HoloButton type="submit" size="lg" variant={holo ? "primary" : "holo"}>
        {capture.buttonLabel ?? "Get updates"}
      </HoloButton>
    </form>
  );

  return (
    <section
      data-slot="duck-cta-band"
      className={cn(
        "@container mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 lg:py-24",
        className
      )}
      {...props}
    >
      <StickerCard
        holo={holo}
        data-align={align}
        className={cn(
          "gap-7 p-8 sm:p-12",
          split && "@3xl:flex-row @3xl:items-center @3xl:justify-between @3xl:gap-12"
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-4",
            split ? "@3xl:max-w-xl" : "items-center text-center"
          )}
        >
          {eyebrow && <HudLabel tone="primary">{eyebrow}</HudLabel>}
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="max-w-xl text-pretty text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <div
          className={cn(
            "flex flex-col gap-3",
            split ? "@3xl:shrink-0 @3xl:items-end" : "items-stretch"
          )}
        >
          {form}
          {(primaryAction || secondaryAction) && actions}
          {note && (
            <p
              className={cn(
                "text-xs text-muted-foreground",
                !split && "text-center"
              )}
            >
              {note}
            </p>
          )}
        </div>
      </StickerCard>
    </section>
  );
}

export { DuckCtaBand };
