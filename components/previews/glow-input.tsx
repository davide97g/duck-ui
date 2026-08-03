import { Search } from "lucide-react";

import {
  GlowField,
  GlowFieldset,
  GlowInput,
} from "@/components/ui/glow-input";

export default function GlowInputDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <GlowField
        label="Workspace name"
        helper="Shows up in the sidebar and on every invite."
        required
      >
        <GlowInput placeholder="Pond Studio" defaultValue="Pond Studio" />
      </GlowField>
      <GlowField
        label="Billing email"
        error="That address is already tied to another workspace."
      >
        <GlowInput
          type="email"
          placeholder="you@studio.dev"
          defaultValue="mira.okonkwo@pondstudio.dev"
        />
      </GlowField>
      <GlowFieldset
        legend="Invoice address"
        helper="Both lines print on the receipt."
      >
        <GlowInput placeholder="Street" defaultValue="14 Reedbank Way" />
        <GlowInput placeholder="City" defaultValue="Padua" />
      </GlowFieldset>

      {/* frame={false} inside a surface that is already the frame: one edge,
          one focus glow, and the parent owns both. */}
      <div className="sticker flex items-center gap-2 rounded-xl border-border bg-card px-3 py-2 transition-[border-color,box-shadow] duration-200 ease-[var(--ease-duck)] focus-within:border-ring focus-within:duck-glow-primary">
        <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        <GlowInput
          frame={false}
          className="h-7"
          aria-label="Search the workspace"
          placeholder="Search everything"
        />
      </div>
    </div>
  );
}
