"use client";

import { StickerCarousel } from "@/components/ui/sticker-carousel";

const titles = [
  { name: "Blue Heron", meta: "2024 · 1h 52m" },
  { name: "Pondwater", meta: "2023 · 2h 06m" },
  { name: "The Reeds", meta: "S2 · E4" },
  { name: "Migration", meta: "2021 · 1h 38m" },
  { name: "Duckling", meta: "S1 · E1" },
  { name: "Low Tide", meta: "2019 · 1h 44m" },
  { name: "Feathered", meta: "S3 · E11" },
  { name: "Quackdown", meta: "2025 · 2h 21m" },
];

export default function StickerCarouselDemo() {
  return (
    <StickerCarousel
      className="w-full max-w-xl"
      title="Continue watching"
      description="Arrows grey out at each end. The fade only shows where content is hiding."
      peek
    >
      {titles.map((title) => (
        <article
          key={title.name}
          className="sticker w-32 rounded-2xl border-border bg-card p-2"
        >
          <div className="mb-2 aspect-[2/3] rounded-xl bg-[linear-gradient(160deg,var(--muted),var(--background))]" />
          <p className="truncate text-sm font-semibold">{title.name}</p>
          <p className="truncate text-xs text-muted-foreground">{title.meta}</p>
        </article>
      ))}
    </StickerCarousel>
  );
}
