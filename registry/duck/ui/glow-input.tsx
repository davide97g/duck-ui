import * as React from "react";

import { cn } from "@/lib/utils";

const fieldBase = [
  "w-full min-w-0 rounded-lg border-2 border-input bg-transparent text-sm",
  "transition-[border-color,box-shadow] duration-200 ease-[var(--ease-duck)] outline-none",
  "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
  "focus-visible:border-ring focus-visible:duck-glow-primary",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-destructive aria-invalid:focus-visible:shadow-[0_0_24px_oklch(0.65_0.2_25/0.3)]",
];

/** GlowInput — text input that glows in duck lime on focus. */
function GlowInput({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="glow-input"
      className={cn(fieldBase, "h-10 px-3 py-2", className)}
      {...props}
    />
  );
}

/** GlowTextarea — the same focus treatment for multi-line input. */
function GlowTextarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="glow-textarea"
      className={cn(fieldBase, "min-h-20 px-3 py-2 leading-relaxed", className)}
      {...props}
    />
  );
}

/**
 * GlowField — label above, control in the middle, helper or error below.
 * Wires up htmlFor, aria-describedby and aria-invalid so the control stays
 * accessible without extra work at the call site.
 */
function GlowField({
  className,
  label,
  helper,
  error,
  required,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  label: string;
  helper?: string;
  error?: string;
  required?: boolean;
  children: React.ReactElement<{
    id?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
    required?: boolean;
  }>;
}) {
  const generated = React.useId();
  const controlId = children.props.id ?? generated;
  const messageId = `${controlId}-message`;
  const message = error ?? helper;

  return (
    <div
      data-slot="glow-field"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      <label
        htmlFor={controlId}
        className="text-sm font-medium text-foreground"
      >
        {label}
        {required && (
          <span className="ml-1 text-destructive" aria-hidden>
            *
          </span>
        )}
      </label>
      {React.cloneElement(children, {
        id: controlId,
        required,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": message ? messageId : undefined,
      })}
      {message && (
        <p
          id={messageId}
          role={error ? "alert" : undefined}
          className={cn(
            "text-xs",
            error ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export { GlowInput, GlowTextarea, GlowField };
