"use client";

import * as React from "react";
import { Play } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * VideoCard — a YouTube card that stays cheap until it is wanted. The
 * thumbnail is a plain image; the player iframe only mounts on click, so a
 * page full of these costs nothing on load.
 */
function VideoCard({
  className,
  videoId,
  title,
  channel,
  duration,
  thumbnail,
  holo = false,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  /** YouTube video id, the part after v=. */
  videoId: string;
  title: string;
  channel?: string;
  /** Runtime label, for example "12:04". */
  duration?: string;
  /** Override the default YouTube thumbnail. */
  thumbnail?: string;
  holo?: boolean;
}) {
  const [playing, setPlaying] = React.useState(false);
  const poster =
    thumbnail ?? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div
      data-slot="video-card"
      className={cn(
        "group/video overflow-hidden rounded-2xl bg-card text-card-foreground",
        "transition-[box-shadow,border-color] duration-300 ease-[var(--ease-duck)]",
        holo
          ? "holo-border hover:duck-glow"
          : "sticker border-border hover:border-primary/50 hover:duck-glow-primary",
        className
      )}
      {...props}
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${title}`}
            className="absolute inset-0 size-full cursor-pointer"
          >
            <img
              src={poster}
              alt=""
              loading="lazy"
              decoding="async"
              className="size-full object-cover transition-transform duration-500 ease-[var(--ease-duck)] group-hover/video:scale-105"
            />
            <span className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0_0_0/0.55),transparent_55%)]" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-14 place-items-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 ease-[var(--ease-squash)] group-hover/video:scale-110">
                <Play className="size-6 translate-x-0.5 fill-current" />
              </span>
            </span>
            {duration && (
              <span className="absolute right-2 bottom-2 rounded-md bg-[oklch(0_0_0/0.75)] px-1.5 py-0.5 font-mono text-xs text-white tabular-nums">
                {duration}
              </span>
            )}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1 p-4">
        <h3 className="font-display leading-snug font-bold tracking-tight">
          {title}
        </h3>
        {channel && (
          <p className="text-sm text-muted-foreground">{channel}</p>
        )}
      </div>
    </div>
  );
}

export { VideoCard };
