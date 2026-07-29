"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DuckTabs,
  DuckTabsContent,
  DuckTabsList,
  DuckTabsTrigger,
} from "@/components/ui/duck-tabs";

/**
 * PreviewShell — the frame every example sits in. Preview and source are the
 * same thing seen two ways, so they share one tab strip. Replay remounts the
 * example, which is the only way to watch an entrance animation twice.
 */
export function PreviewShell({
  preview,
  code,
  align = "center",
  replay = false,
}: {
  preview: React.ReactNode;
  code: React.ReactNode;
  align?: "center" | "start" | "stretch";
  replay?: boolean;
}) {
  const [nonce, setNonce] = React.useState(0);

  return (
    <DuckTabs defaultValue="preview" className="gap-3">
      <div className="flex items-center justify-between gap-3">
        <DuckTabsList>
          <DuckTabsTrigger value="preview">Preview</DuckTabsTrigger>
          <DuckTabsTrigger value="code">Code</DuckTabsTrigger>
        </DuckTabsList>
        {replay && (
          <button
            type="button"
            onClick={() => setNonce((value) => value + 1)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            <RotateCcw className="size-3" />
            Replay
          </button>
        )}
      </div>

      <DuckTabsContent value="preview">
        <div
          key={nonce}
          className={cn(
            "kiss-cut flex min-h-64 flex-wrap gap-4 rounded-xl border-2 border-border p-8",
            align === "center" && "items-center justify-center",
            align === "start" && "items-start justify-start",
            align === "stretch" && "flex-col items-stretch"
          )}
        >
          {preview}
        </div>
      </DuckTabsContent>

      <DuckTabsContent value="code">{code}</DuckTabsContent>
    </DuckTabs>
  );
}
