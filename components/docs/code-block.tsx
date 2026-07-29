import * as React from "react";

import { cn } from "@/lib/utils";
import { highlight, type CodeLanguage } from "@/lib/highlight";
import { CopyButton } from "@/components/ui/copy-button";

/**
 * CodeBlock — server-highlighted code with a copy control. Both Shiki themes
 * are emitted, so switching the site theme does not re-highlight anything.
 */
export async function CodeBlock({
  code,
  lang = "tsx",
  filename,
  className,
  copy = true,
}: {
  code: string;
  lang?: CodeLanguage;
  filename?: string;
  className?: string;
  copy?: boolean;
}) {
  const html = await highlight(code, lang);

  return (
    <figure
      className={cn(
        "group/code relative overflow-hidden rounded-xl border-2 border-border bg-card",
        className
      )}
    >
      {filename && (
        <figcaption className="flex items-center gap-2 border-b border-border px-4 py-2 font-mono text-xs text-muted-foreground">
          {filename}
        </figcaption>
      )}
      <div
        className="overflow-x-auto text-[13px] leading-relaxed [&_pre]:!bg-transparent [&_pre]:p-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {copy && (
        <CopyButton
          value={code.trim()}
          className="absolute top-2 right-2 opacity-0 transition-opacity duration-200 group-hover/code:opacity-100 focus-visible:opacity-100"
        />
      )}
    </figure>
  );
}
