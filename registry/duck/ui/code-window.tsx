import * as React from "react";

import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/ui/copy-button";

/**
 * CodeWindow — a code block in a window frame. Built for tutorial content:
 * a filename, an optional copy control and optional line numbers.
 *
 * Pass plain text as children, or pre-highlighted markup through `html`
 * (for example from Shiki) when the page renders on the server.
 */
function CodeWindow({
  className,
  title,
  children,
  html,
  holo = false,
  copyValue,
  lineNumbers = false,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  title?: string;
  children?: React.ReactNode;
  html?: string;
  holo?: boolean;
  /** Show a copy control that writes this string to the clipboard. */
  copyValue?: string;
  lineNumbers?: boolean;
}) {
  return (
    <div
      data-slot="code-window"
      className={cn(
        "overflow-hidden rounded-xl bg-card",
        holo ? "holo-border" : "border-2 border-border",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2 border-b-2 border-border px-4 py-2.5">
        <span className="size-3 rounded-full bg-[oklch(0.65_0.2_25)]" />
        <span className="size-3 rounded-full bg-[oklch(0.82_0.16_75)]" />
        <span className="size-3 rounded-full bg-[oklch(0.78_0.14_160)]" />
        {title && (
          <span className="ml-2 truncate font-mono text-xs text-muted-foreground">
            {title}
          </span>
        )}
        {copyValue && (
          <CopyButton
            value={copyValue}
            className="ml-auto size-7 border-transparent bg-transparent"
          />
        )}
      </div>
      <div
        className={cn(
          "overflow-x-auto font-mono text-sm leading-relaxed",
          lineNumbers &&
            "[counter-reset:line] [&_.line]:before:mr-4 [&_.line]:before:inline-block [&_.line]:before:w-4 [&_.line]:before:text-right [&_.line]:before:text-muted-foreground/60 [&_.line]:before:[content:counter(line)] [&_.line]:before:[counter-increment:line]"
        )}
      >
        {html ? (
          <div
            className="[&_pre]:overflow-x-auto [&_pre]:!bg-transparent [&_pre]:p-4"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <pre className="p-4">{children}</pre>
        )}
      </div>
    </div>
  );
}

export { CodeWindow };
