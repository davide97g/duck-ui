"use client";

import * as React from "react";
import {
  Command,
  FileText,
  Gauge,
  Plus,
  Send,
  Settings,
  Trash2,
  Users,
} from "lucide-react";

import {
  DuckCommand,
  type DuckCommandGroupData,
} from "@/components/ui/duck-command";
import { QuackButton } from "@/components/ui/quack-button";
import { StickerKbd } from "@/components/ui/sticker-kbd";

const GROUPS: DuckCommandGroupData[] = [
  {
    heading: "Navigation",
    items: [
      { label: "Overview", icon: <Gauge />, keywords: ["dashboard", "home"] },
      { label: "Ponds", icon: <FileText />, hint: "All 12 ponds" },
      { label: "Ducks", icon: <Users />, keywords: ["members", "team"] },
      { label: "Settings", icon: <Settings />, shortcut: ["⌘", ","] },
    ],
  },
  {
    heading: "Actions",
    items: [
      { label: "New pond", icon: <Plus />, shortcut: ["⌘", "N"] },
      { label: "Invite a duck", icon: <Send />, hint: "Sends an email" },
      {
        label: "Delete pond",
        icon: <Trash2 />,
        hint: "Ask an owner",
        disabled: true,
      },
    ],
  },
];

export default function DuckCommandDemo() {
  const [open, setOpen] = React.useState(false);
  const [ran, setRan] = React.useState<string | null>(null);

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-6">
      <QuackButton variant="outline" onClick={() => setOpen(true)}>
        <Command />
        Open palette
      </QuackButton>

      <DuckCommand
        open={open}
        onOpenChange={setOpen}
        items={GROUPS}
        onSelect={setRan}
        footer={
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <StickerKbd watch="ArrowUp">↑</StickerKbd>
            <StickerKbd watch="ArrowDown">↓</StickerKbd>
            to move
            <StickerKbd watch="Enter">⏎</StickerKbd>
            to run
            <StickerKbd watch="Escape">esc</StickerKbd>
            to close
          </div>
        }
      />

      <p className="text-sm text-muted-foreground">
        {ran ? (
          <>
            Ran <span className="text-foreground">{ran}</span>.
          </>
        ) : (
          <>
            Nothing run yet. Press <StickerKbd watch="k" meta>⌘K</StickerKbd>{" "}
            anywhere on this page.
          </>
        )}
      </p>
    </div>
  );
}
