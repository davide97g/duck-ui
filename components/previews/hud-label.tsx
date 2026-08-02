import { HudLabel } from "@/components/ui/hud-label";

export default function HudLabelDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex items-center gap-4">
        <HudLabel tone="primary">01</HudLabel>
        <HudLabel>the channel</HudLabel>
        <span className="h-px flex-1 bg-[linear-gradient(to_right,var(--border),transparent)]" />
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <HudLabel dot tone="foreground">
          live
        </HudLabel>
        <HudLabel size="sm">last build</HudLabel>
        <HudLabel size="sm" tracking="tight" tone="primary">
          2m ago
        </HudLabel>
      </div>
    </div>
  );
}
