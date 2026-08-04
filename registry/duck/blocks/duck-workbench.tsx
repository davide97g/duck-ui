"use client";

import * as React from "react";
import { PanelRight, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { DuckButtonGroup } from "@/components/ui/duck-button-group";
import {
  DuckViewport,
  DuckViewportControls,
  type DuckViewportHandle,
  type DuckViewportProps,
} from "@/components/ui/duck-viewport";
import { HudLabel } from "@/components/ui/hud-label";
import { QuackButton } from "@/components/ui/quack-button";

/**
 * DuckWorkbench — the shape a design tool is: a tool rail, a canvas, an
 * inspector, and a status strip that says what the canvas is doing.
 *
 * The registry had every part of this and never the assembly. The parts are the
 * easy half; what a hand-written editor shell gets wrong is the three joins.
 *
 * **The controls are a sibling of the viewport, never a child.** A child sits
 * inside the transform and pans away with the content, which is why
 * DuckViewportControls takes the ref instead of reading a context. The overlay
 * here is positioned against the canvas frame for the same reason.
 *
 * **The zoom read-out does not re-render.** DuckViewport writes its transform
 * straight to element.style so that a pan costs no React renders; piping
 * `onTransformChange` into `setState` to print "140%" hands all of that back and
 * re-renders the canvas sixty times a second in order to update two glyphs. The
 * read-out is a ref whose textContent is written in the callback. It is also
 * `aria-live="off"` — a percentage that changes on every frame of a wheel gesture
 * is not an announcement, it is a denial of service on a screen reader.
 *
 * **The rails are chrome, so they carry no holo.** The shell is on screen for the
 * whole session; an animated iridescent border in the furniture would never stop
 * moving. Spend the budget inside the canvas, on the thing being made.
 *
 * The inspector is a slot rather than a schema. Its rows are the application's
 * own — a select, a colour field, four log sliders — and the instrument scale
 * they need (`size="sm"`, `size="icon-xs"`) is a size on those components, not a
 * shape this block can guess.
 */
export interface DuckWorkbenchTool {
  /** Icon element. The rail is icon-only, so `label` carries the name. */
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface DuckWorkbenchProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  title?: React.ReactNode;
  /** Left edge, icon-only, one tab stop for the whole rail. */
  tools?: DuckWorkbenchTool[];
  /** Top bar, right side: save, export, share, a theme switcher. */
  actions?: React.ReactNode;
  /** Right rail. The application's own rows, on the instrument scale. */
  inspector?: React.ReactNode;
  inspectorLabel?: string;
  inspectorWidth?: number;
  /** Bottom strip, left side: selection, dimensions, a hint. */
  status?: React.ReactNode;
  /** Dot grid that pans and scales with the content, because it is the paper. */
  grid?: boolean;
  /** Passed through to DuckViewport: min, max, initial, zoomStep, wheelZoom. */
  viewportProps?: Pick<
    DuckViewportProps,
    "min" | "max" | "initial" | "zoomStep" | "panStep" | "wheelZoom"
  >;
  /** Take the handle to drive the canvas from the application's own controls. */
  viewportRef?: React.RefObject<DuckViewportHandle | null>;
  /** The artwork. It is what gets translated and scaled. */
  children?: React.ReactNode;
}

function DuckWorkbench({
  className,
  title,
  tools,
  actions,
  inspector,
  inspectorLabel = "Inspector",
  inspectorWidth = 288,
  status,
  grid = true,
  viewportProps,
  viewportRef,
  children,
  ...props
}: DuckWorkbenchProps) {
  const internalRef = React.useRef<DuckViewportHandle | null>(null);
  const viewport = viewportRef ?? internalRef;
  const readout = React.useRef<HTMLSpanElement>(null);
  const [inspectorOpen, setInspectorOpen] = React.useState(false);
  // The first paint has to agree with the viewport's own starting scale, or the
  // strip says 100% until the reader touches the canvas.
  const startZoom = Math.round((viewportProps?.initial?.scale ?? 1) * 100);

  /* Written, not rendered. See the note above the component. */
  const printZoom = React.useCallback((scale: number) => {
    if (readout.current) {
      readout.current.textContent = `${Math.round(scale * 100)}%`;
    }
  }, []);

  return (
    <div
      data-slot="duck-workbench"
      className={cn(
        // Named container: the shell reflows on its own width, so it survives
        // being embedded in a page that is not the whole window.
        "@container/bench flex h-svh w-full flex-col overflow-hidden bg-background text-foreground",
        className
      )}
      {...props}
    >
      <header
        data-slot="duck-workbench-bar"
        className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-3"
      >
        {title && (
          <h1 className="truncate font-display text-sm font-bold tracking-tight">
            {title}
          </h1>
        )}
        <div className="ml-auto flex items-center gap-2">
          {actions}
          {inspector && (
            <QuackButton
              type="button"
              variant="ghost"
              size="icon-sm"
              ripple={false}
              aria-label={`${inspectorOpen ? "Hide" : "Show"} ${inspectorLabel.toLowerCase()}`}
              aria-expanded={inspectorOpen}
              onClick={() => setInspectorOpen((open) => !open)}
              // The rail is permanent once there is room for it, so the toggle
              // only exists at the widths where it is an overlay.
              className="@3xl/bench:hidden"
            >
              <PanelRight />
            </QuackButton>
          )}
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {tools && tools.length > 0 && (
          <DuckButtonGroup
            data-slot="duck-workbench-tools"
            orientation="vertical"
            joined={false}
            toolbar
            aria-label="Tools"
            className="shrink-0 gap-1 border-r border-border p-1.5"
          >
            {tools.map((tool) => (
              <QuackButton
                key={tool.label}
                type="button"
                // A tool is a state, not an action: aria-pressed is the whole
                // difference between "draw" and "drawing".
                aria-pressed={tool.active}
                aria-label={tool.label}
                title={tool.label}
                disabled={tool.disabled}
                variant={tool.active ? "primary" : "ghost"}
                size="icon-sm"
                ripple={false}
                onClick={tool.onSelect}
              >
                {tool.icon}
              </QuackButton>
            ))}
          </DuckButtonGroup>
        )}

        <main
          data-slot="duck-workbench-canvas"
          className="relative min-w-0 flex-1 overflow-hidden bg-muted/25"
        >
          <DuckViewport
            ref={viewport}
            {...viewportProps}
            onTransformChange={(transform) => printZoom(transform.scale)}
            className="size-full"
          >
            {/* One child, and it is what moves. The grid lives inside it so the
                paper pans and scales with the artwork instead of sliding under
                it — a grid pinned to the frame reads as a background photo of a
                grid the moment anything moves. */}
            <div className="relative">
              {grid && (
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute top-1/2 left-1/2 size-[4000px] -translate-x-1/2 -translate-y-1/2",
                    "[background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px]"
                  )}
                />
              )}
              {children}
            </div>
          </DuckViewport>

          <DuckViewportControls
            viewport={viewport}
            className="absolute right-3 bottom-3 z-10"
          />
        </main>

        {inspector && (
          <>
            {/* Scrim for the overlay case. Permanent rails need none. */}
            {inspectorOpen && (
              <button
                type="button"
                aria-label={`Close ${inspectorLabel.toLowerCase()}`}
                onClick={() => setInspectorOpen(false)}
                className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm @3xl/bench:hidden"
              />
            )}
            <aside
              data-slot="duck-workbench-inspector"
              data-open={inspectorOpen || undefined}
              aria-label={inspectorLabel}
              style={{ width: inspectorWidth }}
              className={cn(
                "fixed inset-y-0 right-0 z-50 flex max-w-[85vw] shrink-0 flex-col border-l border-border bg-card",
                "translate-x-full transition-transform duration-300 ease-[var(--ease-duck)]",
                "data-[open]:translate-x-0",
                "@3xl/bench:static @3xl/bench:max-w-none @3xl/bench:translate-x-0"
              )}
            >
              <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-border px-3">
                <HudLabel>{inspectorLabel}</HudLabel>
                <QuackButton
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  ripple={false}
                  aria-label={`Close ${inspectorLabel.toLowerCase()}`}
                  onClick={() => setInspectorOpen(false)}
                  className="@3xl/bench:hidden"
                >
                  <X />
                </QuackButton>
              </div>
              {/* The rail scrolls, the canvas never does. */}
              <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-3">
                {inspector}
              </div>
            </aside>
          </>
        )}
      </div>

      <footer
        data-slot="duck-workbench-status"
        className="flex h-8 shrink-0 items-center gap-3 border-t border-border px-3"
      >
        <div className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
          {status}
        </div>
        <HudLabel size="sm" tone="foreground" asChild>
          {/* aria-live off on purpose: a value that changes every frame of a
              wheel gesture is noise, not an announcement. */}
          <span ref={readout} aria-live="off" className="tabular-nums">
            {`${startZoom}%`}
          </span>
        </HudLabel>
      </footer>
    </div>
  );
}

export { DuckWorkbench };
