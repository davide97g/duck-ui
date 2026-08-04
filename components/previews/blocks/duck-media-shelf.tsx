"use client";

import * as React from "react";
import { Play } from "lucide-react";

import { DuckMediaShelf } from "@/components/blocks/duck-media-shelf";

function PlayBadge() {
  return (
    <span className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_2px_10px_oklch(0_0_0/0.4)]">
      <Play className="size-4 translate-x-0.5 fill-current" />
    </span>
  );
}

const CONTINUE = [
  { id: "c1", title: "Rubber Duck", subtitle: "1h 35m left", src: "/duck.png", progress: 62 },
  { id: "c2", title: "Pond Life", subtitle: "24m left", src: "/duck.png", progress: 18 },
  { id: "c3", title: "The Long Migration", subtitle: "2h 04m", src: "/posters/missing.jpg" },
];

const NEW = Array.from({ length: 8 }, (_, index) => ({
  id: `n${index}`,
  title: `Duckumentary ${index + 1}`,
  subtitle: `S${index + 1} · E4`,
  src: "/duck.png",
}));

/** The second row starts loading, so the skeletons are visible on first paint. */
export default function DuckMediaShelfDemo() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DuckMediaShelf
      className="gap-8"
      rows={[
        {
          title: "Continue watching",
          items: CONTINUE.map((item) => ({ ...item, href: "#", overlay: <PlayBadge /> })),
        },
        {
          title: "New this week",
          description: "Loads once, then holds its place.",
          loading,
          items: NEW.map((item) => ({ ...item, href: "#", overlay: <PlayBadge /> })),
        },
        {
          title: "My list",
          items: [],
          emptyHint: "Nothing saved yet. The heart on a poster puts it here.",
        },
      ]}
    />
  );
}
