"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * StickerRadioGroup — one strip of kiss-cut cells, and only the chosen sticker
 * has been peeled off the backing. Selected takes the solid vinyl edge, the
 * lime glow and a filled dot; the rest stay as cut-line dashes on the sheet.
 * Border style carries the state as well as colour, so the choice survives
 * greyscale and forced colours.
 *
 * The options are real radios sharing a name, which is what makes arrow keys,
 * roving tab order and "first option is tabbable when nothing is selected"
 * work — all three are browser behaviour, not code worth rewriting.
 *
 * Wrap it in a GlowFieldset. A group of radios needs a group name, and a
 * <legend> is the only thing that reliably gives it one.
 */

interface RadioGroupContext {
  name: string;
  value?: string;
  onSelect: (value: string) => void;
  controlled: boolean;
}

const StickerRadioContext = React.createContext<RadioGroupContext | null>(null);

function StickerRadioGroup({
  className,
  name,
  value,
  defaultValue,
  onValueChange,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "onChange"> & {
  /** Shared radio name. Generated when omitted. */
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) {
  const generatedName = React.useId();
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const controlled = value !== undefined;

  const onSelect = React.useCallback(
    (next: string) => {
      if (!controlled) setUncontrolled(next);
      onValueChange?.(next);
    },
    [controlled, onValueChange]
  );

  const context = React.useMemo<RadioGroupContext>(
    () => ({
      name: name ?? generatedName,
      value: controlled ? value : uncontrolled,
      onSelect,
      controlled,
    }),
    [name, generatedName, controlled, value, uncontrolled, onSelect]
  );

  return (
    <StickerRadioContext.Provider value={context}>
      <div
        data-slot="sticker-radio-group"
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        {children}
      </div>
    </StickerRadioContext.Provider>
  );
}

function StickerRadio({
  className,
  value,
  children,
  description,
  onChange,
  ...props
}: Omit<React.ComponentProps<"input">, "type" | "value"> & {
  value: string;
  /** Second line, for when the label alone does not explain the choice. */
  description?: string;
}) {
  const context = React.useContext(StickerRadioContext);
  if (!context) {
    throw new Error("StickerRadio must be used inside <StickerRadioGroup>");
  }

  return (
    <label
      data-slot="sticker-radio"
      className={cn(
        "group/radio relative flex cursor-pointer items-start gap-3 rounded-xl p-3 text-sm select-none",
        "sticker border-dashed border-cut bg-transparent",
        "transition-[border-color,box-shadow,background-color] duration-200 ease-[var(--ease-duck)]",
        "hover:border-primary/50",
        "has-[:checked]:border-solid has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:checked]:duck-glow-primary",
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
        "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[:disabled]:hover:border-cut",
        className
      )}
    >
      <input
        type="radio"
        className="peer sr-only"
        name={context.name}
        value={value}
        checked={context.controlled ? context.value === value : undefined}
        defaultChecked={
          context.controlled ? undefined : context.value === value || undefined
        }
        onChange={(event) => {
          onChange?.(event);
          if (event.currentTarget.checked) context.onSelect(value);
        }}
        {...props}
      />
      <span
        aria-hidden
        className={cn(
          "sticker mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border-border",
          // The dot is nested, so peer-* cannot reach it. The ring claims the
          // state and passes it down as a variable.
          "transition-colors duration-200 peer-checked:border-primary peer-checked:[--dot:1]"
        )}
      >
        <span className="size-2 scale-[var(--dot,0)] rounded-full bg-primary transition-transform duration-200 ease-[var(--ease-squash)]" />
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="font-medium">{children}</span>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </span>
    </label>
  );
}

export { StickerRadioGroup, StickerRadio };
