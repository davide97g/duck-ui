"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { DuckSwitch } from "@/components/ui/duck-switch";
import { HoloBadge } from "@/components/ui/holo-badge";
import { HoloButton } from "@/components/ui/holo-button";
import {
  StickerCard,
  StickerCardContent,
  StickerCardDescription,
  StickerCardFooter,
  StickerCardHeader,
  StickerCardTitle,
} from "@/components/ui/sticker-card";

/**
 * DuckPricing — a tier grid with a monthly / yearly switch.
 *
 * The featured tier is the viewport's one holo element, so its button stays
 * lime: an iridescent border around an iridescent button reads as a rendering
 * bug, not as emphasis. Mark exactly one tier `featured`.
 *
 * A price can be a number (formatted with the currency and a period suffix) or
 * a string, which is printed as given — "Free", "Talk to us", "€0".
 */
export interface DuckPricingTier {
  name: string;
  description?: string;
  /** Number gets "$29 /mo". String is printed verbatim. */
  monthly: number | string;
  /** Per-month price when billed yearly. Omit to reuse `monthly`. */
  yearly?: number | string;
  features: string[];
  action?: { label: string; href?: string };
  /** The one tier that carries holo. */
  featured?: boolean;
  /** Chip in the card header, for example "Most popular". */
  badge?: string;
}

export interface DuckPricingProps
  extends Omit<React.ComponentProps<"section">, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  tiers: DuckPricingTier[];
  currency?: string;
  /** Show the billing switch. Defaults to on when any tier prices a year. */
  billingSwitch?: boolean;
  /** Line under the switch, for example "2 months free". */
  yearlyNote?: string;
  /** Controlled billing period. Omit to let the block own it. */
  yearly?: boolean;
  onYearlyChange?: (yearly: boolean) => void;
}

function formatPrice(price: number | string, currency: string) {
  return typeof price === "number" ? `${currency}${price}` : price;
}

function DuckPricing({
  className,
  title,
  description,
  tiers,
  currency = "$",
  billingSwitch,
  yearlyNote,
  yearly,
  onYearlyChange,
  ...props
}: DuckPricingProps) {
  const [internalYearly, setInternalYearly] = React.useState(false);
  const isYearly = yearly ?? internalYearly;

  const hasYearly = tiers.some((tier) => tier.yearly !== undefined);
  const showSwitch = billingSwitch ?? hasYearly;

  const handleChange = (next: boolean) => {
    if (yearly === undefined) setInternalYearly(next);
    onYearlyChange?.(next);
  };

  return (
    <section
      data-slot="duck-pricing"
      className={cn(
        // Container queries, not viewport ones: the grid reflows on the width
        // the section was given, not on the size of the window.
        "@container mx-auto w-full max-w-[1400px] px-4 py-20 sm:px-6 lg:py-28",
        className
      )}
      {...props}
    >
      {(title || description || showSwitch) && (
        <div className="mb-12 flex flex-col items-center gap-5 text-center">
          {title && (
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="max-w-xl text-pretty text-muted-foreground">
              {description}
            </p>
          )}
          {showSwitch && (
            <div className="flex flex-col items-center gap-1.5">
              <DuckSwitch
                checked={isYearly}
                onChange={(event) => handleChange(event.currentTarget.checked)}
              >
                Billed yearly
              </DuckSwitch>
              {yearlyNote && (
                <span className="text-xs text-muted-foreground">{yearlyNote}</span>
              )}
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          "grid gap-6",
          tiers.length === 2 && "@md:grid-cols-2",
          tiers.length === 3 && "@md:grid-cols-2 @3xl:grid-cols-3",
          tiers.length >= 4 && "@md:grid-cols-2 @5xl:grid-cols-4"
        )}
      >
        {tiers.map((tier) => {
          const price = isYearly ? (tier.yearly ?? tier.monthly) : tier.monthly;
          const numeric = typeof price === "number";

          return (
            <StickerCard
              key={tier.name}
              holo={tier.featured}
              className={cn("gap-6", tier.featured && "duck-glow")}
            >
              <StickerCardHeader className="gap-3">
                <div className="flex items-center justify-between gap-2">
                  <StickerCardTitle>{tier.name}</StickerCardTitle>
                  {tier.badge && (
                    <HoloBadge variant={tier.featured ? "primary" : "muted"}>
                      {tier.badge}
                    </HoloBadge>
                  )}
                </div>
                {tier.description && (
                  <StickerCardDescription>{tier.description}</StickerCardDescription>
                )}
              </StickerCardHeader>

              <StickerCardContent className="flex flex-col gap-6">
                <p className="flex items-baseline gap-1.5">
                  <span
                    className={cn(
                      "font-display font-extrabold tracking-tight text-balance",
                      // A quoted price is a number and reads as one. A phrase
                      // like "Talk to us" at 4xl just wraps into a wall.
                      numeric ? "text-4xl tabular-nums" : "text-2xl"
                    )}
                  >
                    {formatPrice(price, currency)}
                  </span>
                  {numeric && (
                    <span className="text-sm text-muted-foreground">
                      {isYearly ? "/mo, billed yearly" : "/mo"}
                    </span>
                  )}
                </p>

                <ul className="flex flex-col gap-2.5 text-sm">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check
                        aria-hidden
                        className="mt-0.5 size-4 shrink-0 text-primary"
                      />
                      <span className="text-pretty text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </StickerCardContent>

              {tier.action && (
                <StickerCardFooter className="mt-auto">
                  <HoloButton
                    asChild
                    variant={tier.featured ? "primary" : "outline"}
                    className="w-full"
                  >
                    <a href={tier.action.href ?? "#"}>{tier.action.label}</a>
                  </HoloButton>
                </StickerCardFooter>
              )}
            </StickerCard>
          );
        })}
      </div>
    </section>
  );
}

export { DuckPricing };
