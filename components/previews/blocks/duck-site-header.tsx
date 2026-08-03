import { DuckSiteHeader } from "@/components/blocks/duck-site-header";
import { DuckMark } from "@/components/ui/duck-mark";

export default function DuckSiteHeaderDemo() {
  return (
    <DuckSiteHeader
      // Not sticky in the preview: a sticky header inside a scrolling docs page
      // sticks to the page, not to the frame, and lands in the wrong place.
      sticky={false}
      className="rounded-xl border border-border"
      brand={
        <span className="flex items-center gap-2">
          <DuckMark className="size-7" />
          <span className="font-display font-bold">duck/ui</span>
        </span>
      }
      nav={[
        { label: "Work", href: "#work", active: true },
        { label: "Journal", href: "#journal" },
        { label: "About", href: "#about" },
        { label: "GitHub", href: "#github", external: true },
      ]}
      cta={{ label: "Hire me", href: "#contact" }}
    />
  );
}
