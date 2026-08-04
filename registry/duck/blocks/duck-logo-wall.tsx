import * as React from "react";

import { cn } from "@/lib/utils";
import { DuckMarquee } from "@/components/ui/duck-marquee";
import { HudLabel } from "@/components/ui/hud-label";

/**
 * DuckLogoWall — the proof strip: who ships this, who funds it, what it runs on.
 *
 * Two things make this a component rather than a row of images.
 *
 * The first is height. Brand assets arrive at whatever aspect ratio their
 * designer chose, so a flex row of them renders a wide wordmark twice the
 * optical weight of a square mark beside it. Every logo here is sized by height
 * alone — `object-contain`, width auto — which is the only rule that makes a
 * mixed set read as one line.
 *
 * The second is tone. A near-black canvas kills most brand colours, and eight
 * competing ones kill the section. `tone="mono"` flattens them to the
 * foreground and lifts each on hover, so the wall is texture until a reader
 * looks at it. Full colour is available and should be a decision, not a default.
 *
 * A logo with no asset falls back to its name set as a wordmark, because a wall
 * of six logos and two gaps is worse than a wall of eight things.
 */
export interface DuckLogoWallItem {
  /** Also the alt text and the wordmark fallback. Always required. */
  name: string;
  /** Image source. Omit for `node`, or for the wordmark fallback. */
  src?: string;
  /** An inline SVG or a framework Image, when a src will not do. */
  node?: React.ReactNode;
  href?: string;
}

export interface DuckLogoWallProps
  extends Omit<React.ComponentProps<"section">, "title"> {
  /** Small line above the wall. Set in HUD type, so keep it short. */
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  logos: DuckLogoWallItem[];
  /** A running strip, or a static grid that holds still. */
  variant?: "grid" | "marquee";
  /** Logo height in px. One number for the whole set — that is the point. */
  logoHeight?: number;
  /** mono flattens brand colours to the foreground and lifts them on hover. */
  tone?: "mono" | "colour";
  /** Seconds for one marquee pass. Ignored by the grid. */
  duration?: number;
  /** Under the wall: a case-study link, a count, a caveat. */
  footer?: React.ReactNode;
}

function DuckLogoWall({
  className,
  eyebrow,
  title,
  logos,
  variant = "grid",
  logoHeight = 28,
  tone = "mono",
  duration = 32,
  footer,
  ...props
}: DuckLogoWallProps) {
  const mono = tone === "mono";

  const logo = (item: DuckLogoWallItem) => {
    const art = item.node ?? (
      item.src ? (
        // Plain img, so the block carries no framework dependency. Swap it for
        // next/image at the call site through `node` if the project wants to.
        <img
          src={item.src}
          alt={item.name}
          style={{ height: logoHeight }}
          className="w-auto max-w-[180px] object-contain"
        />
      ) : (
        <span className="font-display text-lg font-bold tracking-tight whitespace-nowrap">
          {item.name}
        </span>
      )
    );

    // Height lives on the wrapper too, so a node and a wordmark sit on the same
    // baseline as an img that got the inline style.
    const framed = (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center",
          mono &&
            "text-foreground opacity-55 grayscale transition-[opacity,filter] duration-300 ease-[var(--ease-duck)] hover:opacity-100 hover:grayscale-0"
        )}
        style={{ height: logoHeight }}
      >
        {art}
      </span>
    );

    return item.href ? (
      <a
        key={item.name}
        href={item.href}
        // The link is the logo, so the name is the accessible name whether the
        // art is an img with alt text or an inline svg with none.
        aria-label={item.name}
        className="rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none"
      >
        {framed}
      </a>
    ) : (
      <React.Fragment key={item.name}>{framed}</React.Fragment>
    );
  };

  return (
    <section
      data-slot="duck-logo-wall"
      className={cn(
        "@container mx-auto w-full max-w-[1400px] px-4 py-14 sm:px-6 lg:py-20",
        className
      )}
      {...props}
    >
      {(eyebrow || title) && (
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          {eyebrow && <HudLabel>{eyebrow}</HudLabel>}
          {title && (
            <p className="max-w-xl text-pretty text-muted-foreground">{title}</p>
          )}
        </div>
      )}

      {variant === "marquee" ? (
        // The marquee owns the duplicate track and hides it from assistive tech,
        // so the list semantics belong to the items and not to this wrapper.
        <DuckMarquee duration={duration} gap="3.5rem">
          {logos.map(logo)}
        </DuckMarquee>
      ) : (
        <ul
          data-slot="duck-logo-wall-grid"
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 @2xl:gap-x-14"
        >
          {logos.map((item) => (
            <li key={item.name} className="flex items-center">
              {logo(item)}
            </li>
          ))}
        </ul>
      )}

      {footer && (
        <p className="mt-8 text-center text-sm text-muted-foreground">{footer}</p>
      )}
    </section>
  );
}

export { DuckLogoWall };
