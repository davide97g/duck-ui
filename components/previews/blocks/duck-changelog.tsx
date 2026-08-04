import { DuckChangelog } from "@/components/blocks/duck-changelog";

/** The registry's own releases, which is what this block was built to render. */
export default function DuckChangelogDemo() {
  return (
    <DuckChangelog
      className="px-0 py-0 lg:py-0"
      idPrefix="demo-"
      headingLevel="h3"
      releases={[
        {
          version: "0.4.0",
          date: "2026-08-03",
          title: "The instrument panel",
          tags: ["feat"],
          highlights: [
            "@duck/glow-select and @duck/glow-color, so a rail needs no raw inputs.",
            "xs, icon-xs and icon-sm — the 28px scale a control rail runs on.",
            "curve=\"log\" on DuckSlider, with the arrow keys fixed to match.",
          ],
        },
        {
          version: "0.3.0",
          date: "2026-07-28",
          title: "The application layer",
          tags: ["feat", "docs"],
          highlights: [
            "A viewport, a command palette and an audio player.",
            "A print layer that re-asserts the light palette on paper.",
          ],
        },
        {
          version: "0.2.0",
          date: "2026-07-14",
          title: "Theme reaches the components",
          tags: ["feat"],
          highlights: ["Noir, to prove the tokens are not the duck."],
        },
      ]}
    />
  );
}
