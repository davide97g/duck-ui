import * as React from "react";

import { DocsSidebar } from "@/components/docs/docs-sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
      <div className="flex gap-10 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto py-12 pr-4">
            <DocsSidebar />
          </div>
        </aside>

        <div className="min-w-0 flex-1 py-12">
          <details className="mb-8 rounded-xl border-2 border-border bg-card p-4 lg:hidden">
            <summary className="cursor-pointer text-sm font-semibold">
              Browse the docs
            </summary>
            <div className="pt-4">
              <DocsSidebar />
            </div>
          </details>
          {children}
        </div>
      </div>
    </div>
  );
}
