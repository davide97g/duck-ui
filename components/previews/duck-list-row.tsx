import { ArrowUpRight } from "lucide-react";

import { DuckListRow } from "@/components/ui/duck-list-row";

const entries = [
  {
    index: "01",
    title: "A registry css block outranks Tailwind",
    description: "Specificity, order, and a lime accent that quietly vanished.",
    meta: "8 min",
  },
  {
    index: "02",
    title: "The vibe belongs in a token",
    description: "Why a font-size in a cva variant cannot be themed at all.",
    meta: "11 min",
  },
  {
    index: "03",
    title: "Thirty dependencies, deleted",
    description: "What a hand-rolled site keeps once the primitives arrive.",
    meta: "6 min",
  },
];

export default function DuckListRowDemo() {
  return (
    <div className="w-full max-w-xl text-left">
      {entries.map((entry) => (
        // asChild: one anchor per row, one focus stop, no nested links.
        <DuckListRow
          key={entry.index}
          asChild
          index={entry.index}
          title={entry.title}
          description={entry.description}
          meta={entry.meta}
          trailing={<ArrowUpRight className="size-4" />}
        >
          <a href="#duck-list-row" />
        </DuckListRow>
      ))}
    </div>
  );
}
