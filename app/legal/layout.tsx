import * as React from "react";
import Link from "next/link";

import { legalNav, legal } from "@/lib/site";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
      <nav
        aria-label="Legal"
        className="mb-10 flex flex-wrap items-center gap-2"
      >
        {legalNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg border-2 border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
        <p className="ml-auto font-mono text-xs text-muted-foreground">
          Last updated {legal.lastUpdated}
        </p>
      </nav>
      {children}
    </div>
  );
}
