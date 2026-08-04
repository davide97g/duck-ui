"use client";

import * as React from "react";
import { Check, RotateCcw, TriangleAlert, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { QuackButton } from "@/components/ui/quack-button";
import { StickerDrop } from "@/components/ui/sticker-drop";
import { StickerProgressTrack } from "@/components/ui/sticker-progress";

/**
 * DuckUpload — the queue behind the drop zone.
 *
 * StickerDrop is the intake: it reads the files, enforces `accept` and `maxSize`,
 * announces what it rejected and keeps a sheet of what it took. What it is not is
 * an uploader, and the gap between "the browser has the file" and "the server has
 * the file" is where every project writes the same two hundred lines.
 *
 * This block owns the queue and nothing else. `onUpload` does the network — the
 * registry has no opinion about your endpoint — and receives an `onProgress`
 * callback and an `AbortSignal`, which are the two things a transport has to be
 * handed rather than asked for. The block owns: a concurrency limit so twelve
 * files do not open twelve sockets, per-file status, retry that reuses the same
 * File object, cancel that actually aborts, and one announcement per file rather
 * than one per progress event.
 *
 * The drop zone is kept controlled at `files={[]}` on purpose. Its sheet and this
 * queue would otherwise show the same file twice, with two different remove
 * buttons and only one of them attached to an upload. The zone hands over, the
 * queue is the record.
 *
 * Progress is a `StickerProgressTrack` per row, not a bar with a percentage in a
 * live region: a value that moves sixty times a file is chrome, and the thing worth
 * announcing is "done" or "failed".
 */
export type DuckUploadStatus =
  | "queued"
  | "uploading"
  | "done"
  | "error"
  | "canceled";

export interface DuckUploadItem {
  id: string;
  file: File;
  status: DuckUploadStatus;
  /** 0 to 100. Indeterminate until the transport reports something. */
  progress?: number;
  error?: string;
}

export interface DuckUploadProps
  extends Omit<React.ComponentProps<"div">, "children" | "onProgress"> {
  /**
   * Send one file. Report progress if the transport can, honour the signal if it
   * can, and reject to mark the row failed with the message.
   */
  onUpload?: (
    file: File,
    context: { onProgress: (percent: number) => void; signal: AbortSignal }
  ) => Promise<unknown>;
  /** Fires whenever the queue changes: a fresh list, every time. */
  onQueueChange?: (items: DuckUploadItem[]) => void;
  /** Fires once, when nothing is left queued or uploading. */
  onSettled?: (items: DuckUploadItem[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  /** Files in flight at once. Twelve files should not open twelve sockets. */
  concurrency?: number;
  label?: string;
  hint?: string;
  /** Drop the finished rows automatically, once each one has been seen. */
  clearDoneAfter?: number;
}

const statusLabel: Record<DuckUploadStatus, string> = {
  queued: "Queued",
  uploading: "Uploading",
  done: "Uploaded",
  error: "Failed",
  canceled: "Canceled",
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function DuckUpload({
  className,
  onUpload,
  onQueueChange,
  onSettled,
  accept,
  multiple = true,
  maxSize,
  concurrency = 3,
  label = "Drop files here",
  hint,
  clearDoneAfter,
  ...props
}: DuckUploadProps) {
  const [items, setItems] = React.useState<DuckUploadItem[]>([]);
  const controllers = React.useRef(new Map<string, AbortController>());
  /* Which rows have had their transport started. An effect that runs twice — in
     development it always does — must not upload the same file twice. */
  const started = React.useRef(new Set<string>());
  const seed = React.useRef(0);
  const [announcement, setAnnouncement] = React.useState("");
  /* Was the queue busy last render? onSettled fires on the edge, not on every
     render that happens to find nothing running. */
  const wasBusy = React.useRef(false);

  const patch = React.useCallback(
    (id: string, change: Partial<DuckUploadItem>) => {
      setItems((current) =>
        current.map((item) => (item.id === id ? { ...item, ...change } : item))
      );
    },
    []
  );

  React.useEffect(() => {
    onQueueChange?.(items);
    const busy = items.some(
      (item) => item.status === "queued" || item.status === "uploading"
    );
    if (wasBusy.current && !busy) onSettled?.(items);
    wasBusy.current = busy;
  }, [items, onQueueChange, onSettled]);

  /* The pump. Starts as many queued rows as the limit allows, once each. */
  React.useEffect(() => {
    if (!onUpload) return;
    const inFlight = items.filter((item) => item.status === "uploading").length;
    const room = Math.max(0, concurrency - inFlight);
    const next = items
      .filter((item) => item.status === "queued" && !started.current.has(item.id))
      .slice(0, room);

    for (const item of next) {
      started.current.add(item.id);
      const controller = new AbortController();
      controllers.current.set(item.id, controller);
      patch(item.id, { status: "uploading", progress: 0 });

      onUpload(item.file, {
        onProgress: (percent) =>
          patch(item.id, {
            progress: Math.max(0, Math.min(100, Math.round(percent))),
          }),
        signal: controller.signal,
      })
        .then(() => {
          patch(item.id, { status: "done", progress: 100 });
          setAnnouncement(`${item.file.name} uploaded`);
        })
        .catch((cause: unknown) => {
          // An abort is a decision, not a failure, and it already has a row.
          if (controller.signal.aborted) return;
          patch(item.id, {
            status: "error",
            error:
              cause instanceof Error ? cause.message : "Upload failed",
          });
          setAnnouncement(`${item.file.name} failed`);
        })
        .finally(() => {
          controllers.current.delete(item.id);
        });
    }
  }, [items, concurrency, onUpload, patch]);

  React.useEffect(() => {
    if (!clearDoneAfter) return;
    const done = items.some((item) => item.status === "done");
    if (!done) return;
    const timer = setTimeout(() => {
      setItems((current) => current.filter((item) => item.status !== "done"));
    }, clearDoneAfter);
    return () => clearTimeout(timer);
  }, [items, clearDoneAfter]);

  // Abort whatever is still open when the component goes away, so a navigation
  // does not leave requests running against a dead callback.
  React.useEffect(
    () => () => {
      controllers.current.forEach((controller) => controller.abort());
    },
    []
  );

  const add = (files: File[]) => {
    if (files.length === 0) return;
    setItems((current) => [
      ...current,
      ...files.map((file) => {
        seed.current += 1;
        return {
          // Name and size collide across folders; a counter cannot.
          id: `${seed.current}-${file.name}`,
          file,
          status: "queued" as const,
        };
      }),
    ]);
  };

  const cancel = (item: DuckUploadItem) => {
    controllers.current.get(item.id)?.abort();
    controllers.current.delete(item.id);
    patch(item.id, { status: "canceled" });
  };

  const retry = (item: DuckUploadItem) => {
    started.current.delete(item.id);
    patch(item.id, { status: "queued", progress: undefined, error: undefined });
  };

  const remove = (item: DuckUploadItem) => {
    controllers.current.get(item.id)?.abort();
    controllers.current.delete(item.id);
    started.current.delete(item.id);
    setItems((current) => current.filter((row) => row.id !== item.id));
  };

  const failed = items.filter((item) => item.status === "error").length;

  return (
    <div
      data-slot="duck-upload"
      className={cn("flex w-full flex-col gap-4", className)}
      {...props}
    >
      <StickerDrop
        accept={accept}
        multiple={multiple}
        maxSize={maxSize}
        label={label}
        hint={hint}
        // Handed over deliberately: the zone reads files, the queue keeps them.
        files={[]}
        onFilesChange={add}
      />

      {/* One line per outcome, not one per progress event. */}
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {items.length > 0 && (
        <ul data-slot="duck-upload-queue" className="flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              data-status={item.status}
              className="sticker flex items-center gap-3 rounded-xl border-border bg-card px-3 py-2.5"
            >
              <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="flex items-baseline gap-2">
                  <span className="truncate text-sm font-medium">
                    {item.file.name}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
                    {formatSize(item.file.size)}
                  </span>
                </span>

                {item.status === "uploading" || item.status === "queued" ? (
                  <StickerProgressTrack
                    size="sm"
                    // Indeterminate until the transport reports: a bar sitting at
                    // 0% looks like a stall, which is a different thing.
                    value={item.status === "uploading" ? item.progress : undefined}
                    label={`${statusLabel[item.status]} ${item.file.name}`}
                  />
                ) : (
                  <span
                    className={cn(
                      "flex items-center gap-1.5 text-xs",
                      item.status === "error"
                        ? "text-destructive"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.status === "done" && <Check className="size-3.5" />}
                    {item.status === "error" && (
                      <TriangleAlert className="size-3.5" />
                    )}
                    {item.error ?? statusLabel[item.status]}
                  </span>
                )}
              </span>

              <span className="flex shrink-0 items-center gap-1">
                {(item.status === "error" || item.status === "canceled") && (
                  <QuackButton
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    ripple={false}
                    aria-label={`Retry ${item.file.name}`}
                    onClick={() => retry(item)}
                  >
                    <RotateCcw />
                  </QuackButton>
                )}
                <QuackButton
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  ripple={false}
                  aria-label={
                    item.status === "uploading"
                      ? `Cancel ${item.file.name}`
                      : `Remove ${item.file.name}`
                  }
                  onClick={() =>
                    item.status === "uploading" ? cancel(item) : remove(item)
                  }
                >
                  <X />
                </QuackButton>
              </span>
            </li>
          ))}
        </ul>
      )}

      {failed > 0 && (
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            {failed} of {items.length} failed.
          </span>
          <QuackButton
            type="button"
            variant="outline"
            size="xs"
            ripple={false}
            onClick={() =>
              items
                .filter((item) => item.status === "error")
                .forEach((item) => retry(item))
            }
          >
            Retry all
          </QuackButton>
        </div>
      )}
    </div>
  );
}

export { DuckUpload };
