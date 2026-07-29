"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { components, guides } from "@/lib/registry-docs";

interface Entry {
  href: string;
  title: string;
  summary: string;
  group: string;
}

const entries: Entry[] = [
  ...guides.flatMap((section) =>
    section.items.map((item) => ({ ...item, group: section.title }))
  ),
  ...components.map((item) => ({
    href: `/docs/components/${item.slug}`,
    title: item.title,
    summary: item.summary,
    group: "Components",
  })),
];

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setActive(0);
      return;
    }
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = "";
    };
  }, [open]);

  const needle = query.trim().toLowerCase();
  const results = needle
    ? entries.filter(
        (entry) =>
          entry.title.toLowerCase().includes(needle) ||
          entry.summary.toLowerCase().includes(needle)
      )
    : entries;

  function go(entry: Entry) {
    setOpen(false);
    router.push(entry.href);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % Math.max(results.length, 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(
        (index) => (index - 1 + results.length) % Math.max(results.length, 1)
      );
    }
    if (event.key === "Enter" && results[active]) {
      event.preventDefault();
      go(results[active]);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-border bg-card/60 px-2.5 text-sm text-muted-foreground",
          "transition-colors duration-200 hover:border-primary/50 hover:text-foreground"
        )}
      >
        <Search className="size-3.5" />
        <span className="hidden sm:inline">Search docs</span>
        <kbd className="ml-2 hidden rounded border border-border px-1.5 py-0.5 font-mono text-[10px] sm:inline">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-100 flex items-start justify-center bg-[oklch(0_0_0/0.6)] p-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search documentation"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={onKeyDown}
            className="w-full max-w-xl overflow-hidden rounded-2xl border-2 border-border bg-popover shadow-2xl [animation:duck-rise_0.2s_var(--ease-duck)]"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                placeholder="Search components and guides"
                aria-label="Search components and guides"
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-2">
              {results.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                  Nothing matches “{query}”. Try a component name.
                </p>
              )}
              {results.map((entry, index) => (
                <button
                  key={entry.href}
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onClick={() => go(entry)}
                  className={cn(
                    "flex w-full cursor-pointer flex-col gap-0.5 rounded-lg px-3 py-2 text-left transition-colors",
                    index === active ? "bg-secondary" : "hover:bg-secondary/60"
                  )}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    {entry.title}
                    <span className="font-mono text-[10px] font-normal text-muted-foreground">
                      {entry.group}
                    </span>
                  </span>
                  <span className="line-clamp-1 text-xs text-muted-foreground">
                    {entry.summary}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
