"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { useQuackToast } from "@/components/ui/quack-toast";

/**
 * The install command, as the primary call to action. Clicking anywhere on
 * the pill copies it, because that is the only thing anyone wants to do with
 * a command on a landing page.
 */
export function InstallCommand({
  command,
  className,
  size = "default",
}: {
  command: string;
  className?: string;
  size?: "default" | "sm";
}) {
  const { toast } = useQuackToast();
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      // The closest thing this site has to a conversion: someone leaving with
      // the command. The registry JSON is static, so the install itself is only
      // visible in server logs.
      track("install-copy", { command });
      toast({ title: "Command copied", variant: "success", duration: 2200 });
    } catch {
      toast({
        title: "Could not reach the clipboard",
        description: "Select the command and copy it manually.",
        variant: "error",
      });
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${command}`}
      className={cn(
        "group/install sheen inline-flex cursor-pointer items-center gap-3 rounded-xl border-2 border-border bg-card font-mono",
        "transition-[border-color,box-shadow,transform] duration-300 ease-[var(--ease-duck)]",
        "hover:border-primary/60 hover:duck-glow-primary active:scale-[0.99]",
        size === "sm" ? "h-10 px-3 text-xs" : "h-12 px-4 text-sm",
        className
      )}
    >
      <span className="text-primary select-none">$</span>
      <span className="truncate text-foreground">{command}</span>
      <span className="ml-1 grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors group-hover/install:text-primary">
        {copied ? (
          <Check
            className="size-3.5 [animation:duck-pop_0.35s_var(--ease-squash)]"
            strokeWidth={3}
          />
        ) : (
          <Copy className="size-3.5" />
        )}
      </span>
    </button>
  );
}
