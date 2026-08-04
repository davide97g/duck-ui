"use client";

import * as React from "react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";

import { cn } from "@/lib/utils";
import { DuckMediaSlider } from "@/components/ui/duck-media-slider";
import { DuckVolume } from "@/components/ui/duck-volume";
import { QuackButton } from "@/components/ui/quack-button";

/**
 * DuckPlayerBar — the docked transport: what is playing, the controls, the
 * waterline, the tap.
 *
 * The parts are DuckMediaSlider and DuckVolume, which already own the hard
 * interactions. Four things sit between them and a player bar, and every media
 * app writes all four.
 *
 * **The transport stays put.** Three grid columns with a fixed middle, not a flex
 * row: with `justify-between` the play button slides left and right as the track
 * title changes length, and the thing a reader aims at should not move between
 * songs.
 *
 * **The elapsed time follows the drag, not the playhead.** DuckMediaSlider is the
 * sole author of the value while a scrub is in flight — a `<video>` fires
 * timeupdate four times a second and would otherwise fight the thumb. The
 * read-out has to make the same choice, or the digits argue with the handle the
 * reader is holding. So `onScrub` parks a pending value and `onSeek` clears it.
 *
 * **Digits for the eye, words for the ear.** `1:04` is unreadable aloud, and
 * "sixty-four" is wrong. The label shows the clock and `aria-valuetext` gets
 * "1 minute 4 seconds of 3 minutes 20 seconds", which is what a listener needs
 * from a seek bar.
 *
 * **Play is an action, not a toggle.** One button whose icon and accessible name
 * swap, never `aria-pressed`: "Pause, pressed" describes nothing a listener can
 * act on, where "Pause" is the thing the button will do.
 *
 * Keyboard shortcuts are opt-in and ignore editable targets, the same rule
 * DuckCommand applies to a bare key. A player docked under a page must not eat
 * Space from the search field above it.
 */
/**
 * onVolumeChange and onSeek are both DOM media events, so the div's versions have
 * to go or the level and the seek would be typed as SyntheticEvent handlers —
 * the same trap DuckVolume documents.
 */
export interface DuckPlayerBarProps
  extends Omit<
    React.ComponentProps<"div">,
    "title" | "onSeek" | "onVolumeChange"
  > {
  /** Artwork, a mark, an equaliser — whatever identifies the track. */
  art?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Seconds. 0 is a legitimate duration for a live stream — pass undefined. */
  duration?: number;
  /** Playhead in seconds. */
  position?: number;
  /** Fraction of the whole track that has loaded, 0 to 1. */
  buffered?: number;
  playing?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  /** Fires once, on release. This is the one that seeks. */
  onSeek?: (seconds: number) => void;
  /** Every step of a drag, while it is still in flight. */
  onScrub?: (seconds: number) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  muted?: boolean;
  onMutedChange?: (muted: boolean) => void;
  /** Right of the volume: repeat, shuffle, a queue button, a cast icon. */
  actions?: React.ReactNode;
  /** Thumbnail or chapter name under the pointer, before commit. */
  preview?: (seconds: number) => React.ReactNode;
  /** Bind Space, ArrowLeft and ArrowRight globally. Off by default. */
  shortcuts?: boolean;
  /** Seconds an arrow key jumps when `shortcuts` is on. */
  seekStep?: number;
}

/** 1:04, and 1:02:03 only once there is an hour to show. */
function clock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const rest = whole % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return hours
    ? `${hours}:${pad(minutes)}:${pad(rest)}`
    : `${minutes}:${pad(rest)}`;
}

/** The same instant, for a listener. */
function spoken(seconds: number) {
  const whole = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(whole / 60);
  const rest = whole % 60;
  const parts = [];
  if (minutes) parts.push(`${minutes} minute${minutes === 1 ? "" : "s"}`);
  parts.push(`${rest} second${rest === 1 ? "" : "s"}`);
  return parts.join(" ");
}

/** A bare key belongs to whatever the user is typing in. */
function isEditable(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

function DuckPlayerBar({
  className,
  art,
  title,
  subtitle,
  duration,
  position = 0,
  buffered,
  playing = false,
  onPlayingChange,
  onSeek,
  onScrub,
  onPrevious,
  onNext,
  volume,
  onVolumeChange,
  muted,
  onMutedChange,
  actions,
  preview,
  shortcuts = false,
  seekStep = 10,
  ...props
}: DuckPlayerBarProps) {
  /* Non-null while a drag is in flight. The read-out reads this first. */
  const [pending, setPending] = React.useState<number | null>(null);
  const shown = pending ?? position;
  const seekable = duration !== undefined && duration > 0;

  React.useEffect(() => {
    if (!shortcuts) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditable(event.target) || event.metaKey || event.ctrlKey) return;
      if (event.key === " ") {
        event.preventDefault();
        onPlayingChange?.(!playing);
        return;
      }
      if (!seekable) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onSeek?.(Math.max(0, position - seekStep));
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        onSeek?.(Math.min(duration, position + seekStep));
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [
    shortcuts,
    playing,
    onPlayingChange,
    onSeek,
    position,
    duration,
    seekStep,
    seekable,
  ]);

  return (
    <div
      data-slot="duck-player-bar"
      // A region, so a screen reader can jump to the player from anywhere on the
      // page. It is furniture that outlives the page under it.
      role="region"
      aria-label="Player"
      className={cn(
        "@container/player flex w-full flex-col gap-1.5 border-t border-border bg-card/95 px-3 py-2 backdrop-blur",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <span className="w-10 shrink-0 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
          {clock(shown)}
        </span>
        <DuckMediaSlider
          dense
          min={0}
          max={seekable ? duration : 1}
          step={seekable ? 1 : 0.001}
          value={shown}
          buffered={buffered}
          preview={preview}
          disabled={!seekable}
          aria-label="Seek"
          formatValue={(seconds) =>
            seekable
              ? `${spoken(seconds)} of ${spoken(duration)}`
              : spoken(seconds)
          }
          onScrub={(seconds) => {
            setPending(seconds);
            onScrub?.(seconds);
          }}
          onSeek={(seconds) => {
            // Cleared here rather than in an effect: the parent's position prop
            // arrives a frame later, and the read-out must not flick back to the
            // old playhead in between.
            setPending(null);
            onSeek?.(seconds);
          }}
          className="flex-1"
        />
        <span className="w-10 shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
          {seekable ? clock(duration) : "live"}
        </span>
      </div>

      {/* Fixed middle column: the play button does not move when the title does. */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {art && <span className="shrink-0">{art}</span>}
          <span className="flex min-w-0 flex-col">
            {title && (
              <span className="truncate text-sm font-semibold">{title}</span>
            )}
            {subtitle && (
              <span className="truncate text-xs text-muted-foreground">
                {subtitle}
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {onPrevious && (
            <QuackButton
              type="button"
              variant="ghost"
              size="icon-sm"
              ripple={false}
              aria-label="Previous"
              onClick={onPrevious}
            >
              <SkipBack />
            </QuackButton>
          )}
          <QuackButton
            type="button"
            size="icon"
            ripple={false}
            // Name and icon swap; never aria-pressed. The label is what the
            // button will do, which is the only thing a listener can act on.
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => onPlayingChange?.(!playing)}
          >
            {playing ? <Pause /> : <Play />}
          </QuackButton>
          {onNext && (
            <QuackButton
              type="button"
              variant="ghost"
              size="icon-sm"
              ripple={false}
              aria-label="Next"
              onClick={onNext}
            >
              <SkipForward />
            </QuackButton>
          )}
        </div>

        <div className="flex items-center justify-end gap-1">
          <DuckVolume
            volume={volume}
            muted={muted}
            onVolumeChange={onVolumeChange}
            onMutedChange={onMutedChange}
          />
          {actions}
        </div>
      </div>
    </div>
  );
}

export { DuckPlayerBar, clock };
