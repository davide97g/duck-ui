"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/ui/copy-button";
import { HoloAvatar, HoloAvatarGroup } from "@/components/ui/holo-avatar";
import { HoloBadge } from "@/components/ui/holo-badge";
import { GlowField, GlowInput } from "@/components/ui/glow-input";
import { QuackButton } from "@/components/ui/quack-button";
import {
  StickerCard,
  StickerCardContent,
  StickerCardDescription,
  StickerCardFooter,
  StickerCardHeader,
  StickerCardTitle,
} from "@/components/ui/sticker-card";

interface Preset {
  hue: number;
  chroma: number;
  lightness: number;
  radius: number;
  glow: number;
  border: number;
}

const DEFAULTS: Preset = {
  hue: 115,
  chroma: 17,
  lightness: 85,
  radius: 75,
  glow: 35,
  border: 3,
};

const ORDER = ["hue", "chroma", "lightness", "radius", "glow", "border"] as const;

function encode(preset: Preset) {
  return ORDER.map((key) => preset[key]).join("-");
}

function decode(code: string | null): Preset | null {
  if (!code) return null;
  const parts = code.split("-").map(Number);
  if (parts.length !== ORDER.length || parts.some(Number.isNaN)) return null;
  return ORDER.reduce(
    (accumulator, key, index) => ({ ...accumulator, [key]: parts[index] }),
    {} as Preset
  );
}

function buildVars(preset: Preset) {
  const l = preset.lightness / 100;
  const c = preset.chroma / 100;
  const primary = `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${preset.hue})`;
  const onPrimary =
    l >= 0.68
      ? `oklch(0.24 ${Math.min(c * 0.45, 0.08).toFixed(3)} ${preset.hue})`
      : "oklch(0.98 0 0)";

  return {
    "--primary": primary,
    "--primary-foreground": onPrimary,
    "--ring": primary,
    "--glow-primary": `0 0 32px oklch(${l.toFixed(3)} ${c.toFixed(3)} ${
      preset.hue
    } / ${(preset.glow / 100).toFixed(2)})`,
    "--radius": `${(preset.radius / 100).toFixed(2)}rem`,
    "--sticker-border": `${preset.border}px`,
  } as React.CSSProperties;
}

function buildCss(preset: Preset) {
  const vars = buildVars(preset) as Record<string, string>;
  const body = Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");
  return `/* duck/ui preset ${encode(preset)} */\n.dark {\n${body}\n}`;
}

const sliders = [
  { key: "hue", label: "Hue", min: 0, max: 360, step: 1, unit: "deg" },
  { key: "chroma", label: "Chroma", min: 0, max: 30, step: 1, unit: "%" },
  { key: "lightness", label: "Lightness", min: 40, max: 96, step: 1, unit: "%" },
  { key: "radius", label: "Radius", min: 0, max: 200, step: 5, unit: "/100rem" },
  { key: "glow", label: "Glow", min: 0, max: 80, step: 1, unit: "%" },
  { key: "border", label: "Sticker border", min: 1, max: 6, step: 1, unit: "px" },
] as const;

export function ThemeEditor() {
  const [preset, setPreset] = React.useState<Preset>(DEFAULTS);

  React.useEffect(() => {
    const fromUrl = decode(
      new URLSearchParams(window.location.search).get("c")
    );
    if (fromUrl) setPreset(fromUrl);
  }, []);

  React.useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("c", encode(preset));
    window.history.replaceState(null, "", url);
  }, [preset]);

  const css = buildCss(preset);
  const shareUrl =
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}/create?c=${encode(preset)}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[19rem_minmax(0,1fr)]">
      <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
        <div className="flex flex-col gap-5 rounded-2xl border-2 border-border bg-card p-5">
          {sliders.map((slider) => (
            <div key={slider.key} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <label
                  htmlFor={`slider-${slider.key}`}
                  className="text-sm font-medium"
                >
                  {slider.label}
                </label>
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {preset[slider.key]}
                  {slider.unit}
                </span>
              </div>
              <input
                id={`slider-${slider.key}`}
                type="range"
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={preset[slider.key]}
                onChange={(event) =>
                  setPreset((current) => ({
                    ...current,
                    [slider.key]: Number(event.target.value),
                  }))
                }
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
              />
            </div>
          ))}

          <div className="flex gap-2">
            <QuackButton
              size="sm"
              variant="outline"
              onClick={() => setPreset(DEFAULTS)}
              className="flex-1"
            >
              Reset
            </QuackButton>
            <CopyButton value={shareUrl} label="Copy share link" />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border-2 border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <span className="font-mono text-xs text-muted-foreground">
              globals.css
            </span>
            <CopyButton value={css} className="size-7 border-transparent bg-transparent" />
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
            {css}
          </pre>
        </div>
      </div>

      <div
        style={buildVars(preset)}
        className={cn(
          "flex flex-col gap-6 rounded-2xl border-2 border-border bg-background p-6 sm:p-8"
        )}
      >
        <div className="flex flex-wrap items-center gap-3">
          <QuackButton idle="sheen">Primary action</QuackButton>
          <QuackButton variant="outline">Outline</QuackButton>
          <QuackButton variant="ghost">Ghost</QuackButton>
          <HoloBadge variant="primary">badge</HoloBadge>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <StickerCard peel>
            <StickerCardHeader>
              <StickerCardTitle>Weekly digest</StickerCardTitle>
              <StickerCardDescription>
                Four releases went out since Monday.
              </StickerCardDescription>
            </StickerCardHeader>
            <StickerCardContent>
              <HoloAvatarGroup max={3}>
                <HoloAvatar size="sm" ring="primary" fallback="GB" alt="Giulia Bassani" />
                <HoloAvatar size="sm" ring="none" fallback="MK" alt="Miro Kovač" />
                <HoloAvatar size="sm" ring="none" fallback="AT" alt="Ade Turay" />
                <HoloAvatar size="sm" ring="none" fallback="RS" alt="Rún Sigurðsson" />
              </HoloAvatarGroup>
            </StickerCardContent>
            <StickerCardFooter>
              <QuackButton size="sm">Open</QuackButton>
            </StickerCardFooter>
          </StickerCard>

          <StickerCard>
            <StickerCardHeader>
              <StickerCardTitle>Invite a teammate</StickerCardTitle>
              <StickerCardDescription>
                They get read access to the registry immediately.
              </StickerCardDescription>
            </StickerCardHeader>
            <StickerCardContent className="flex flex-col gap-4">
              <GlowField label="Work email" helper="We only use it for the invite.">
                <GlowInput type="email" placeholder="name@studio.com" />
              </GlowField>
              <QuackButton className="w-full">Send invite</QuackButton>
            </StickerCardContent>
          </StickerCard>
        </div>
      </div>
    </div>
  );
}
