"use client";

import * as React from "react";

import {
  DuckTabs,
  DuckTabsContent,
  DuckTabsList,
  DuckTabsTrigger,
} from "@/components/ui/duck-tabs";
import { CopyButton } from "@/components/ui/copy-button";

const runners = {
  pnpm: (args: string) => `pnpm dlx shadcn@latest ${args}`,
  npm: (args: string) => `npx shadcn@latest ${args}`,
  yarn: (args: string) => `yarn dlx shadcn@latest ${args}`,
  bun: (args: string) => `bunx --bun shadcn@latest ${args}`,
} as const;

/**
 * InstallTabs — the same shadcn command in every package manager. The choice
 * is remembered for the session so the reader picks once.
 */
export function InstallTabs({ args }: { args: string }) {
  const [manager, setManager] = React.useState<keyof typeof runners>("pnpm");

  React.useEffect(() => {
    const saved = window.sessionStorage.getItem("duck-package-manager");
    if (saved && saved in runners) setManager(saved as keyof typeof runners);
  }, []);

  function pick(value: string) {
    setManager(value as keyof typeof runners);
    window.sessionStorage.setItem("duck-package-manager", value);
  }

  return (
    <DuckTabs value={manager} onValueChange={pick} className="gap-3">
      <DuckTabsList>
        {Object.keys(runners).map((key) => (
          <DuckTabsTrigger key={key} value={key}>
            {key}
          </DuckTabsTrigger>
        ))}
      </DuckTabsList>
      {Object.entries(runners).map(([key, build]) => (
        <DuckTabsContent key={key} value={key}>
          <div className="flex items-center gap-2 overflow-x-auto rounded-xl border-2 border-border bg-card px-4 py-3 font-mono text-sm">
            <span className="text-primary select-none">$</span>
            <code className="flex-1 whitespace-nowrap">{build(args)}</code>
            <CopyButton value={build(args)} className="shrink-0" />
          </div>
        </DuckTabsContent>
      ))}
    </DuckTabs>
  );
}
