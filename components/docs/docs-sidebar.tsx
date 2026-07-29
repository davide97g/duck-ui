"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { sidebarGroups } from "@/lib/doc-routes";

export function DocsSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation" className={cn("text-sm", className)}>
      <ul className="flex flex-col gap-7">
        {sidebarGroups.map((group) => (
          <li key={group.title}>
            <h2 className="mb-2 font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
              {group.title}
            </h2>
            <ul className="flex flex-col border-l border-border">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "-ml-px block border-l-2 py-1.5 pl-3 transition-colors duration-200",
                        active
                          ? "border-primary font-semibold text-foreground"
                          : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                      )}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
