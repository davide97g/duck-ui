"use client";

import * as React from "react";
import {
  FastForward,
  LoaderCircle,
  Pause,
  Play,
  Rewind,
  RotateCcw,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DuckMediaSlider,
  formatTimecode,
} from "@/components/ui/duck-media-slider";
import { DuckVolume } from "@/components/ui/duck-volume";
import { QuackButton } from "@/components/ui/quack-button";

/**
 * DuckAudioPlayer — the two hard parts, finally wired to something.
 *
 * DuckMediaSlider and DuckVolume have been in the registry for a while and
 * nothing composed them, so a real app reached for `<audio controls>` — the one
 * element on a themed page that cannot be themed. This is that native bar
 * replaced: one <audio>, a QuackButton for transport, the seek bar, the tap.
 *
 * It is deliberately thin. The seek bar already owns the hard behaviour — while
 * a drag is in flight it is the sole author of its value, so `timeupdate` firing
 * four times a second cannot pull the thumb back under the finger holding it.
 * That means this component can let timeupdate run straight into state and only
 * touch `currentTime` once, on commit. Nothing here re-derives the position
 * during a drag, and nothing needs to.
 *
 * The other decision worth stating: `duration` is `null` until the element
 * knows, and stays `null` for anything that has no finite length. NaN before
 * metadata and Infinity on a live stream are the same fact — there is no bar to
 * draw — and neither may reach the slider, where they would make `max`
 * meaningless and pin the fill at one end.
 */

function clamp(value: number, lower: number, upper: number) {
  return Math.min(Math.max(value, lower), upper);
}

export interface DuckAudioPlayerProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  src: string;
  /**
   * Shown in the default layout, and folded into the accessible name of the
   * transport and the seek bar. A string rather than a node for exactly that
   * reason: "Pause" on a page with four players says nothing.
   */
  title?: string;
  /** One row: play, timecode, seek, volume. No frame — see the note below. */
  compact?: boolean;
  defaultVolume?: number;
  defaultMuted?: boolean;
  loop?: boolean;
  /** Metadata by default, so the duration is known before the first play. */
  preload?: "none" | "metadata" | "auto";
  /** Seconds the skip buttons move. Default layout only. */
  skip?: number;
}

function DuckAudioPlayer({
  className,
  src,
  title,
  compact = false,
  defaultVolume = 0.7,
  defaultMuted = false,
  loop = false,
  preload = "metadata",
  skip = 15,
  ...props
}: DuckAudioPlayerProps) {
  const audio = React.useRef<HTMLAudioElement>(null);

  const [playing, setPlaying] = React.useState(false);
  const [ended, setEnded] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [duration, setDuration] = React.useState<number | null>(null);
  const [buffered, setBuffered] = React.useState(0);
  const [ready, setReady] = React.useState(false);
  const [waiting, setWaiting] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  /** Position of a drag in flight. Feeds the read-out, never the element. */
  const [scrub, setScrub] = React.useState<number | null>(null);

  const [volume, setVolume] = React.useState(defaultVolume);
  const [muted, setMuted] = React.useState(defaultMuted);

  // volume and muted are properties, not attributes: React will not set them
  // from JSX, and an effect is also what re-applies the level after the src
  // changes and the element reloads.
  React.useEffect(() => {
    const el = audio.current;
    if (!el) return;
    el.volume = clamp(volume, 0, 1);
    el.muted = muted;
  }, [muted, volume]);

  React.useEffect(() => {
    const el = audio.current;
    if (!el) return;

    const readDuration = () => {
      setDuration(
        Number.isFinite(el.duration) && el.duration > 0 ? el.duration : null
      );
    };

    const readBuffered = () => {
      const ranges = el.buffered;
      const total = el.duration;
      if (!ranges.length || !Number.isFinite(total) || total <= 0) {
        setBuffered(0);
        return;
      }
      // buffered is a list, not a block: seeking into fresh territory starts
      // another range and leaves a hole behind. The slider draws one fill from
      // zero, so the only honest number is the end of the range the playhead is
      // actually inside — 0 if it is inside none of them.
      let fraction = 0;
      for (let i = 0; i < ranges.length; i += 1) {
        if (
          el.currentTime >= ranges.start(i) &&
          el.currentTime <= ranges.end(i)
        ) {
          fraction = ranges.end(i) / total;
          break;
        }
      }
      setBuffered(fraction);
    };

    const syncTime = () => {
      // Safe to run during a drag: the slider ignores an incoming value until
      // commit, and the read-out prefers the scrub position over this one.
      setTime(el.currentTime);
      readBuffered();
    };

    const listeners: Record<string, () => void> = {
      loadedmetadata: () => {
        readDuration();
        readBuffered();
      },
      // A stream can announce its length late, and a VBR file can revise it.
      durationchange: readDuration,
      timeupdate: syncTime,
      seeked: syncTime,
      progress: readBuffered,
      play: () => {
        setPlaying(true);
        setEnded(false);
      },
      pause: () => setPlaying(false),
      // Reaching the end fires `pause` and then `ended`, so `playing` is
      // already false by here. `ended` is what turns the transport into a
      // replay button.
      ended: () => {
        setPlaying(false);
        setEnded(true);
      },
      waiting: () => setWaiting(true),
      canplay: () => {
        setWaiting(false);
        setReady(true);
        setFailed(false);
      },
      playing: () => setWaiting(false),
      error: () => {
        setFailed(true);
        setWaiting(false);
        setPlaying(false);
      },
      // Changing src runs the media load algorithm, which empties the element.
      // That is the reset — no separate effect on src is needed.
      emptied: () => {
        setReady(false);
        setFailed(false);
        setEnded(false);
        setDuration(null);
        setBuffered(0);
        setTime(0);
      },
    };

    for (const [event, handler] of Object.entries(listeners)) {
      el.addEventListener(event, handler);
    }

    // An element can arrive already loaded — a cached file, a remount, a src
    // React set before this effect ran — and then none of the above fires
    // again. One read after wiring covers it.
    readDuration();
    readBuffered();
    setTime(el.currentTime);
    setPlaying(!el.paused);
    // HAVE_FUTURE_DATA: enough to start, which is what `canplay` means.
    setReady(el.readyState >= 3);

    return () => {
      for (const [event, handler] of Object.entries(listeners)) {
        el.removeEventListener(event, handler);
      }
    };
  }, []);

  const seekable = duration !== null && !failed;

  const toggle = () => {
    const el = audio.current;
    if (!el) return;
    if (el.paused) {
      // A rejected play() is the autoplay policy or a lost gesture, not a
      // broken file. No `play` event fires, so `playing` is already correct and
      // there is nothing to paint — swallowing it beats an unhandled rejection.
      void el.play().catch(() => {});
      return;
    }
    el.pause();
  };

  const nudge = (delta: number) => {
    const el = audio.current;
    if (!el || duration === null) return;
    el.currentTime = clamp(el.currentTime + delta, 0, duration);
    setTime(el.currentTime);
  };

  const commitSeek = (next: number) => {
    const el = audio.current;
    setScrub(null);
    if (!el || duration === null) return;
    el.currentTime = clamp(next, 0, duration);
    setTime(el.currentTime);
    setEnded(false);
  };

  const state = failed ? "error" : waiting && !ready ? "loading" : "idle";

  // Loading is claimed only before the element is playable at all, where the
  // button genuinely has nothing to do — QuackButton disables itself while
  // busy, and taking Pause away from someone waiting out a mid-track stall
  // would be worse than saying nothing. A stall after that shows in the status
  // line and in a buffered waterline that stops moving.
  const status = failed
    ? "Unavailable"
    : waiting
      ? "Buffering"
      : ready && duration === null
        ? "Live"
        : null;

  // A page of these needs "Pause Voice note, 14 March", not four buttons all
  // called Pause. No punctuation between them: a dash is read out as a word.
  const named = title ? ` ${title}` : "";
  const transportLabel = ended
    ? `Replay${named}`
    : playing
      ? `Pause${named}`
      : `Play${named}`;

  const readout = (
    <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
      <span className="text-foreground">{formatTimecode(scrub ?? time)}</span>
      {" / "}
      {duration === null ? "--:--" : formatTimecode(duration)}
    </span>
  );

  const transport = (
    <QuackButton
      type="button"
      variant={compact ? "ghost" : "primary"}
      size="icon"
      state={state}
      disabled={failed}
      // The default loading mark is an image this item does not ship, so the
      // indicator is a lucide glyph. Reduced motion keeps the glyph, drops the
      // spin, and the status line still says what is happening.
      loadingIndicator={
        <LoaderCircle className="animate-spin motion-reduce:animate-none" />
      }
      aria-label={transportLabel}
      onClick={toggle}
      className={cn("shrink-0", compact && "size-9")}
    >
      {/* QuackButton draws its own indicator once state leaves idle, and a
          second glyph beside it in a 40px box is only clipped. */}
      {state !== "idle" ? null : ended ? (
        <RotateCcw />
      ) : playing ? (
        <Pause className="fill-current" />
      ) : (
        <Play className="translate-x-px fill-current" />
      )}
    </QuackButton>
  );

  const seek = (
    <DuckMediaSlider
      // Dense in a row: 4px of line at rest with the duck arriving on hover or
      // focus, because compact is meant to sit inside someone else's list row
      // and a full-height thumb there is the loudest thing on the screen.
      dense={compact}
      min={0}
      max={duration ?? 0}
      step={1}
      value={Math.min(time, duration ?? 0)}
      buffered={buffered}
      // Nothing to seek to on a stream, or on a file that failed. The track
      // stays visible so the row does not change shape.
      disabled={!seekable}
      aria-label={`Seek${named || " audio"}`}
      preview={(value) => formatTimecode(value)}
      onScrub={setScrub}
      onSeek={commitSeek}
      // Only compact needs to fight for room: in the default layout the bar is
      // a block on its own line and already full width.
      className={cn(compact && "min-w-0 flex-1")}
    />
  );

  const tap = (
    <DuckVolume
      volume={volume}
      muted={muted}
      onVolumeChange={setVolume}
      onMutedChange={setMuted}
      className="shrink-0"
    />
  );

  // The live region is mounted whether or not it has anything to say: a
  // role="status" that appears at the same moment as its text is frequently not
  // announced at all. The visible copy below is aria-hidden so a stall is not
  // read out twice.
  const live = (
    <span role="status" className="sr-only">
      {status}
    </span>
  );

  return (
    <div
      data-slot="duck-audio-player"
      data-compact={compact || undefined}
      data-playing={playing || undefined}
      data-state={state}
      className={cn(
        "flex w-full",
        compact
          ? // No frame and no colour of its own: compact inherits whatever it
            // was dropped into. Two sticker edges nested inside one another
            // read as a mistake rather than as a player.
            "items-center gap-3"
          : "sticker flex-col gap-3 rounded-2xl border-border bg-card p-4 text-card-foreground",
        className
      )}
      {...props}
    >
      {live}

      {compact ? (
        <>
          {transport}
          {readout}
          {seek}
          {tap}
        </>
      ) : (
        <>
          {(title || status) && (
            <div className="flex items-baseline gap-3">
              {title && (
                <p className="min-w-0 truncate font-display text-sm font-bold tracking-tight">
                  {title}
                </p>
              )}
              {status && (
                <span
                  aria-hidden
                  className={cn(
                    "ms-auto shrink-0 font-mono text-[10px] tracking-[0.2em] uppercase",
                    failed ? "text-destructive" : "text-muted-foreground"
                  )}
                >
                  {status}
                </span>
              )}
            </div>
          )}

          {seek}

          <div className="flex items-center gap-1">
            <QuackButton
              type="button"
              variant="ghost"
              size="icon"
              disabled={!seekable}
              aria-label={`Back ${skip} seconds${named}`}
              onClick={() => nudge(-skip)}
              className="size-9 shrink-0"
            >
              <Rewind />
            </QuackButton>
            {transport}
            <QuackButton
              type="button"
              variant="ghost"
              size="icon"
              disabled={!seekable}
              aria-label={`Forward ${skip} seconds${named}`}
              onClick={() => nudge(skip)}
              className="size-9 shrink-0"
            >
              <FastForward />
            </QuackButton>
            <span className="ps-1">{readout}</span>
            <span className="ms-auto">{tap}</span>
          </div>
        </>
      )}

      {/* No `controls`: the browser's own bar is the thing this component
          exists to replace, and without it the element has no box and no tab
          stop, so there is nothing duplicated for a keyboard or a screen
          reader to walk through. */}
      <audio ref={audio} src={src} loop={loop} preload={preload} />
    </div>
  );
}

export { DuckAudioPlayer };
