"use client";

import { DuckUpload } from "@/components/blocks/duck-upload";

/**
 * A fake transport: reports progress in steps, honours the signal, and fails
 * anything with "fail" in the name so the error row is reachable.
 */
function fakeUpload(
  file: File,
  { onProgress, signal }: { onProgress: (percent: number) => void; signal: AbortSignal }
) {
  return new Promise<void>((resolve, reject) => {
    let percent = 0;
    const tick = setInterval(() => {
      percent += 8;
      onProgress(percent);
      if (percent < 100) return;
      clearInterval(tick);
      if (file.name.toLowerCase().includes("fail")) {
        reject(new Error("The server refused this one."));
      } else {
        resolve();
      }
    }, 160);

    signal.addEventListener("abort", () => {
      clearInterval(tick);
      reject(signal.reason ?? new Error("Aborted"));
    });
  });
}

export default function DuckUploadDemo() {
  return (
    <DuckUpload
      className="max-w-lg"
      accept="image/*,.pdf"
      maxSize={8 * 1024 * 1024}
      hint="Images or PDF, up to 8 MB. A file named fail.png is rejected on purpose."
      concurrency={2}
      onUpload={fakeUpload}
    />
  );
}
