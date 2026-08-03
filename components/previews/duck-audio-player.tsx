"use client";

import { DuckAudioPlayer } from "@/components/ui/duck-audio-player";

/**
 * A real audio file with no binary in the repo: 15 seconds of 8-bit 8 kHz mono
 * PCM, built here and handed over as a data: URI. The docs need something with
 * a genuine duration, a buffered range and an `ended` event — a fake src would
 * only exercise the error path — and shipping a .wav into public/ for one
 * preview page is worse than 120 kB of sine wave generated at import.
 *
 * It is a quiet 220 Hz tone, faded at both ends, at about a fifth of full scale:
 * loud enough to prove the tap works, soft enough to survive a misclick.
 */
function tone(seconds = 15, rate = 8000, hz = 220) {
  const samples = seconds * rate;
  const bytes = new Uint8Array(44 + samples);
  const view = new DataView(bytes.buffer);
  const ascii = (at: number, text: string) => {
    for (let i = 0; i < text.length; i += 1) {
      view.setUint8(at + i, text.charCodeAt(i));
    }
  };

  ascii(0, "RIFF");
  view.setUint32(4, 36 + samples, true);
  ascii(8, "WAVEfmt ");
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, rate, true);
  view.setUint32(28, rate, true); // bytes per second, = rate at 8-bit mono
  view.setUint16(32, 1, true); // block align
  view.setUint16(34, 8, true); // bits per sample
  ascii(36, "data");
  view.setUint32(40, samples, true);

  for (let i = 0; i < samples; i += 1) {
    const t = i / rate;
    const fade = Math.min(1, t * 2, (seconds - t) * 2);
    // 8-bit PCM is unsigned: 128 is silence.
    bytes[44 + i] = 128 + Math.round(Math.sin(t * hz * 2 * Math.PI) * 26 * fade);
  }

  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return `data:audio/wav;base64,${btoa(binary)}`;
}

const TONE = tone();

export default function DuckAudioPlayerDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <DuckAudioPlayer src={TONE} title="Pond at dawn — field recording" />

      {/* Compact, inside the list row it exists for: the row draws the frame,
          the player is one line of transport across it. */}
      <div className="sticker flex flex-col gap-3 rounded-2xl border-border bg-card p-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="truncate font-display text-sm font-bold tracking-tight">
            Voice note
          </p>
          <span className="shrink-0 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
            14 Mar
          </span>
        </div>
        <DuckAudioPlayer compact src={TONE} title="Voice note, 14 March" />
      </div>
    </div>
  );
}
