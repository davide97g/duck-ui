"use client";

import * as React from "react";
import { Upload, X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * StickerDrop — the backing paper itself. The zone is the kiss-cut sheet,
 * dragging over it lights the cut lines, and every accepted file lands on the
 * sheet as its own sticker.
 *
 * A drop zone is not keyboard operable, so this one wraps a real file input
 * that is clipped rather than hidden — it still takes focus, still opens the
 * picker on Enter, and still satisfies WCAG 2.5.7 by giving dragging a
 * single-pointer alternative.
 */

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true;
  return accept.split(",").some((raw) => {
    const rule = raw.trim().toLowerCase();
    if (!rule) return false;
    if (rule.startsWith(".")) return file.name.toLowerCase().endsWith(rule);
    if (rule.endsWith("/*")) return file.type.startsWith(rule.slice(0, -1));
    return file.type.toLowerCase() === rule;
  });
}

export interface StickerDropProps
  extends Omit<React.ComponentProps<"div">, "onChange"> {
  accept?: string;
  multiple?: boolean;
  /** Largest file allowed, in bytes. */
  maxSize?: number;
  /** Called with the full list every time it changes. */
  onFilesChange?: (files: File[]) => void;
  label?: string;
  hint?: string;
}

function StickerDrop({
  className,
  accept,
  multiple = false,
  maxSize,
  onFilesChange,
  label = "Drop files here",
  hint,
  ...props
}: StickerDropProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [dragging, setDragging] = React.useState(false);
  const [announcement, setAnnouncement] = React.useState("");
  // dragenter and dragleave fire for every child the pointer crosses. Counting
  // them is the only way to know when the pointer has really left the zone.
  const depth = React.useRef(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const commit = React.useCallback(
    (incoming: FileList | null) => {
      if (!incoming?.length) return;
      const accepted: File[] = [];
      const rejected: string[] = [];

      for (const file of Array.from(incoming)) {
        if (!matchesAccept(file, accept)) {
          rejected.push(`${file.name} — type not allowed`);
        } else if (maxSize && file.size > maxSize) {
          rejected.push(`${file.name} — over ${formatSize(maxSize)}`);
        } else {
          accepted.push(file);
        }
      }

      const next = multiple ? [...files, ...accepted] : accepted.slice(0, 1);
      setFiles(next);
      onFilesChange?.(next);

      setAnnouncement(
        [
          accepted.length &&
            `${accepted.length} file${accepted.length === 1 ? "" : "s"} added`,
          rejected.length && `Rejected: ${rejected.join(", ")}`,
        ]
          .filter(Boolean)
          .join(". ")
      );
    },
    [accept, files, maxSize, multiple, onFilesChange]
  );

  const remove = React.useCallback(
    (index: number) => {
      const removed = files[index];
      const next = files.filter((_, i) => i !== index);
      setFiles(next);
      onFilesChange?.(next);
      setAnnouncement(`${removed.name} removed`);
      // Focus would otherwise fall to <body> and the keyboard user would
      // restart from the top of the page.
      requestAnimationFrame(() => {
        const buttons =
          listRef.current?.querySelectorAll<HTMLButtonElement>("button");
        (buttons?.[Math.min(index, (buttons?.length ?? 1) - 1)] ??
          inputRef.current)?.focus();
      });
    },
    [files, onFilesChange]
  );

  return (
    <div
      data-slot="sticker-drop"
      className={cn("flex w-full flex-col gap-3", className)}
      {...props}
    >
      <label
        data-dragging={dragging || undefined}
        onDragEnter={(event) => {
          event.preventDefault();
          depth.current += 1;
          setDragging(true);
        }}
        onDragOver={(event) => {
          // Without this the browser navigates away to the dropped file.
          event.preventDefault();
        }}
        onDragLeave={() => {
          depth.current -= 1;
          if (depth.current <= 0) {
            depth.current = 0;
            setDragging(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          depth.current = 0;
          setDragging(false);
          commit(event.dataTransfer.files);
        }}
        className={cn(
          "kiss-cut relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl px-6 py-10 text-center",
          // Dashed cut lines at sticker weight, so the drag state can switch
          // them to solid without shifting anything.
          "sticker border-dashed border-cut",
          "transition-[border-color,box-shadow] duration-200 ease-[var(--ease-duck)]",
          "hover:border-primary/60",
          // --cut on --sheet is about 1.8:1. Fine as decoration in a sheet,
          // not fine as the drag-active status indicator, so lime carries it.
          "data-[dragging]:border-solid data-[dragging]:border-primary data-[dragging]:duck-glow-primary",
          "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
          "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          // sr-only, never display:none — a hidden input cannot take focus.
          className="peer sr-only"
          onChange={(event) => {
            commit(event.currentTarget.files);
            event.currentTarget.value = "";
          }}
        />
        <Upload className="size-5 text-muted-foreground" aria-hidden />
        <span className="text-sm font-medium">
          {label}
          <span className="text-muted-foreground"> or choose files</span>
        </span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </label>

      {files.length > 0 && (
        <ul ref={listRef} className="flex flex-wrap gap-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className={cn(
                "flex items-center gap-2 rounded-lg py-1 pr-1 pl-3 text-xs",
                "sticker border-border bg-card",
                "[animation:duck-pop_0.3s_var(--ease-squash)]"
              )}
            >
              <span className="max-w-40 truncate font-medium">{file.name}</span>
              <span className="text-muted-foreground tabular-nums">
                {formatSize(file.size)}
              </span>
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label={`Remove ${file.name}`}
                className={cn(
                  "grid size-6 cursor-pointer place-items-center rounded-md text-muted-foreground",
                  "transition-colors hover:bg-secondary hover:text-foreground",
                  "outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <span aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </div>
  );
}

export { StickerDrop };
