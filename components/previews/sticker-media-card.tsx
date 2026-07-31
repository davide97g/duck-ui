import { Play } from "lucide-react";

import { StickerMediaCard } from "@/components/ui/sticker-media-card";

const shelf = [
  { title: "Rubber Duck", subtitle: "2016 · 1h 35m", src: "/duck.png", progress: 62 },
  { title: "Pond Life", subtitle: "2019 · 1h 48m", src: "/duck.png" },
  // Deliberately missing, so the third tile shows the fallback.
  { title: "The Long Migration", subtitle: "2021 · 2h 04m", src: "/posters/missing.jpg" },
];

function PlayBadge() {
  return (
    <span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_2px_10px_oklch(0_0_0/0.4)]">
      <Play className="size-5 translate-x-0.5 fill-current" />
    </span>
  );
}

export default function StickerMediaCardDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        {shelf.map((item) => (
          <StickerMediaCard
            key={item.title}
            href="#"
            src={item.src}
            alt={item.title}
            title={item.title}
            subtitle={item.subtitle}
            fallback={item.title}
            progress={item.progress}
            overlay={<PlayBadge />}
          />
        ))}
      </div>

      <StickerMediaCard
        href="#"
        aspect="16/9"
        src="/duck.png"
        alt="Duckumentary"
        title="Duckumentary"
        subtitle="Season 2 · Episode 4"
        overlay={<PlayBadge />}
        className="max-w-sm"
      />
    </div>
  );
}
