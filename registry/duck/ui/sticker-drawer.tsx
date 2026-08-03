"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * StickerDrawer — the sticker slid in from the edge.
 *
 * StickerDialog is centred and capped at max-w-lg, which is right for a
 * decision and wrong for a panel. The first real application built on duck had
 * three edge-anchored surfaces — a wiki page, a conversation history, and a
 * full-bleed map on mobile — and all three fell back to the stock shadcn
 * `sheet`, because forcing the dialog into a panel means fighting its centring
 * translate. The fallback was correct about the mechanics and lost the whole
 * vocabulary: no die-cut edge, no glow, nothing that read as duck. Three
 * surfaces out of seven visibly off-system is why this file exists.
 *
 * Not a `side` prop on StickerDialog. A dialog is a centred box that rises into
 * place; a drawer is an edge that slides. Merged, every geometry class in both
 * becomes conditional and the common case pays for the rare one. They share the
 * base instead: the same Radix Dialog, the same frosted scrim, the same close
 * button.
 *
 * Radix Dialog underneath, so the focus trap, the scroll lock, Escape,
 * `aria-modal` and the labelled title are real rather than approximated. None
 * of that is hand-rolled here and none of it should be — the sheet the app fell
 * back to was already a genuine upgrade over its own `motion.aside` for exactly
 * that reason.
 *
 * The die-cut edge is on one side only: the side facing the content. An outer
 * corner rounded against the viewport edge shows the page through the gap, so
 * the radius is on the inner corners and `size="full"` drops it entirely.
 *
 * On top and bottom the size preset is a ceiling rather than a fixed height. A
 * sheet holding three rows should be three rows tall; only `full` commits to
 * the viewport. On left and right there is nothing to hug, so the preset is the
 * width.
 *
 * The item ships two keyframes (`duck-drawer-in` / `duck-drawer-out`) and one
 * utility, `.holo-edge` — the iridescent finish for whichever sides already
 * carry a border width, because `.holo-border` sets the width itself on all
 * four and a drawer only wants one.
 */

const StickerDrawer = DialogPrimitive.Root;
const StickerDrawerTrigger = DialogPrimitive.Trigger;
const StickerDrawerClose = DialogPrimitive.Close;
const StickerDrawerPortal = DialogPrimitive.Portal;

/**
 * A copy of StickerDialog's scrim rather than an import of it: a project that
 * only needs a drawer should not have to install a dialog to get one, and the
 * two are the same three declarations.
 */
function StickerDrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="sticker-drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-[oklch(0_0_0/0.65)] backdrop-blur-sm",
        "data-[state=open]:[animation:duck-fade-in_0.2s_var(--ease-duck)]",
        "data-[state=closed]:[animation:duck-fade-out_0.18s_var(--ease-duck)]",
        className
      )}
      {...props}
    />
  );
}

const stickerDrawerVariants = cva(
  [
    "fixed z-50 flex flex-col overflow-hidden bg-card text-card-foreground",
    // The slide is one pair of keyframes reading --drawer-x / --drawer-y, which
    // the side variant sets. Four sides would otherwise be eight keyframes.
    "data-[state=open]:[animation:duck-drawer-in_0.32s_var(--ease-duck)]",
    // Radix keeps the node mounted until the exit ends, so the panel leaves the
    // way it arrived instead of being cut. Under prefers-reduced-motion the
    // theme collapses both durations, so it appears and disappears in place —
    // no frozen half-slide, because there is no half.
    "data-[state=closed]:[animation:duck-drawer-out_0.2s_var(--ease-duck)]",
  ],
  {
    variants: {
      side: {
        // Only the facing side gets a width. Tailwind's preflight already sets
        // `border: 0 solid` on everything, so the other three stay absent
        // rather than needing to be reset.
        right:
          "inset-y-0 right-0 [--drawer-x:100%] [border-left-width:var(--sticker-border)]",
        left: "inset-y-0 left-0 [--drawer-x:-100%] [border-right-width:var(--sticker-border)]",
        top: "inset-x-0 top-0 [--drawer-y:-100%] [border-bottom-width:var(--sticker-border)]",
        bottom:
          "inset-x-0 bottom-0 [--drawer-y:100%] [border-top-width:var(--sticker-border)]",
      },
      // The extent depends on the axis, so it lives in the compounds below.
      size: {
        sm: "",
        default: "",
        lg: "",
        full: "",
      },
    },
    compoundVariants: [
      { side: ["left", "right"], size: "sm", class: "w-full max-w-xs" },
      { side: ["left", "right"], size: "default", class: "w-full max-w-sm" },
      { side: ["left", "right"], size: "lg", class: "w-full max-w-lg" },
      { side: ["left", "right"], size: "full", class: "w-full max-w-none" },
      { side: ["top", "bottom"], size: "sm", class: "max-h-[35svh]" },
      { side: ["top", "bottom"], size: "default", class: "max-h-[50svh]" },
      { side: ["top", "bottom"], size: "lg", class: "max-h-[80svh]" },
      { side: ["top", "bottom"], size: "full", class: "h-svh" },
    ],
    defaultVariants: {
      side: "right",
      size: "default",
    },
  }
);

type StickerDrawerSide = NonNullable<
  VariantProps<typeof stickerDrawerVariants>["side"]
>;
type StickerDrawerSize = NonNullable<
  VariantProps<typeof stickerDrawerVariants>["size"]
>;

/** Radius on the inner corners only — the two that face the content. */
const INNER_RADIUS: Record<StickerDrawerSide, string> = {
  right: "rounded-l-2xl",
  left: "rounded-r-2xl",
  top: "rounded-b-2xl",
  bottom: "rounded-t-2xl",
};

export interface StickerDrawerContentProps
  extends React.ComponentProps<typeof DialogPrimitive.Content> {
  /** Edge the panel is anchored to. */
  side?: StickerDrawerSide;
  /** Width on left and right; a ceiling on the height on top and bottom. */
  size?: StickerDrawerSize;
  /** Iridescent edge instead of the solid die-cut one. */
  holo?: boolean;
  /**
   * Hide the built-in close button. Only for a panel whose own actions are the
   * sole way out — Escape and the scrim still dismiss unless you intercept
   * those as well.
   */
  hideClose?: boolean;
  /** Accessible name for the close button. */
  closeLabel?: string;
}

function StickerDrawerContent({
  className,
  children,
  side = "right",
  size = "default",
  holo = false,
  hideClose = false,
  closeLabel = "Close",
  ...props
}: StickerDrawerContentProps) {
  return (
    <StickerDrawerPortal>
      <StickerDrawerOverlay />
      <DialogPrimitive.Content
        data-slot="sticker-drawer-content"
        data-side={side}
        className={cn(
          stickerDrawerVariants({ side, size }),
          holo ? "holo-edge duck-glow" : "border-border duck-glow-primary",
          // A full-bleed panel has no inner corner left to round.
          size === "full" ? "rounded-none" : INNER_RADIUS[side],
          className
        )}
        {...props}
      >
        {children}

        {!hideClose && (
          <DialogPrimitive.Close
            data-slot="sticker-drawer-close"
            aria-label={closeLabel}
            className={cn(
              "absolute top-4 right-4 grid size-8 cursor-pointer place-items-center rounded-md",
              "text-muted-foreground transition-colors duration-200 ease-[var(--ease-duck)]",
              "hover:bg-secondary hover:text-foreground",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <X className="size-4" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </StickerDrawerPortal>
  );
}

function StickerDrawerHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sticker-drawer-header"
      // pr-14 clears the close button's gutter, the same 56px the dialog
      // reserves with p-6 plus pr-8.
      className={cn("flex flex-col gap-1.5 p-6 pr-14 pb-4", className)}
      {...props}
    />
  );
}

function StickerDrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="sticker-drawer-title"
      className={cn(
        "font-display text-lg leading-none font-bold tracking-tight",
        className
      )}
      {...props}
    />
  );
}

function StickerDrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="sticker-drawer-description"
      className={cn("text-sm leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

/**
 * The scrolling middle. A dialog can leave this to the document, but a drawer
 * is as tall as the viewport, so the overflow has to belong to an element the
 * header and footer sit outside of.
 */
function StickerDrawerBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sticker-drawer-body"
      // min-h-0 is what lets a flex child shrink below its content and scroll;
      // without it the panel grows and the footer leaves the viewport.
      className={cn("min-h-0 flex-1 overflow-y-auto px-6", className)}
      {...props}
    />
  );
}

function StickerDrawerFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sticker-drawer-footer"
      className={cn(
        "flex flex-col-reverse gap-2 p-6 pt-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

export {
  StickerDrawer,
  StickerDrawerTrigger,
  StickerDrawerClose,
  StickerDrawerPortal,
  StickerDrawerOverlay,
  StickerDrawerContent,
  StickerDrawerHeader,
  StickerDrawerTitle,
  StickerDrawerDescription,
  StickerDrawerBody,
  StickerDrawerFooter,
  stickerDrawerVariants,
};
