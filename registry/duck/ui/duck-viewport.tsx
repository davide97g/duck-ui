"use client";

import * as React from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";

import { DuckButtonGroup } from "@/components/ui/duck-button-group";
import { QuackButton } from "@/components/ui/quack-button";
import { cn } from "@/lib/utils";

/**
 * DuckViewport — the pan and zoom surface, and nothing else.
 *
 * Two SVG canvases in one application hand-rolled the same fifty lines twice:
 * a cursor-anchored wheel zoom, a clamp, a pointer drag, and — the part that is
 * quietly wrong in most attempts — a wheel listener registered by hand purely
 * so that it can preventDefault(). React's onWheel is delegated and passive, so
 * preventDefault() inside it does nothing whatsoever and the page scrolls out
 * from under the zoom. That one listener is the reason this file exists.
 *
 * It is a viewport, not a graph renderer: it neither knows nor cares what it
 * holds. A knowledge graph, an image lightbox, a zoomable diagram, the canvas
 * of an editor — one interaction, served by translating a single child element.
 * Anything that needs to know about nodes and edges stays in the application.
 *
 * The transform is written straight to element.style. A pan therefore costs no
 * React renders at all, where sixty pointermoves a second through setState
 * would re-render the entire canvas sixty times in order to move it — which is
 * how these surfaces end up feeling cheap. No React state is involved.
 * onTransformChange still fires for anyone who wants a read-out, throttled to
 * one call per frame so a consumer that does re-render is not flooded.
 *
 * DuckViewportControls takes the ref rather than reading a context, and that is
 * a deliberate choice: the cluster is a sibling of the viewport, never a child,
 * because a child would sit inside the transform and pan away with the content.
 * A context only reaches downward, so it could not cross that gap without a
 * third provider component wrapped around both. One `viewport={ref}` is less.
 */

export interface DuckViewportTransform {
  /** Translation in CSS pixels, applied before the scale. */
  x: number;
  y: number;
  scale: number;
}

export interface DuckViewportHandle {
  /** A copy of the live transform. Cheap — read it as often as you like. */
  getTransform: () => DuckViewportTransform;
  /** One `zoomStep` about the centre of the viewport. */
  zoomIn: () => void;
  zoomOut: () => void;
  /** Absolute scale, clamped, anchored at a point in viewport coordinates. */
  zoomTo: (scale: number, anchor?: { x: number; y: number }) => void;
  panBy: (dx: number, dy: number) => void;
  /** Back to `initial`. */
  reset: () => void;
}

interface Gesture {
  transform: DuckViewportTransform;
  /** Pointer, or midpoint of two pointers, in viewport coordinates. */
  x: number;
  y: number;
  /** Distance between two pointers; 0 while only one is down. */
  distance: number;
}

function clamp(value: number, lower: number, upper: number) {
  return Math.min(Math.max(value, lower), upper);
}

/**
 * The theme's blanket reduced-motion rule already flattens transition-duration,
 * but a component should not need a global to be correct, and a 0.001ms
 * transition still fires its events. Read the query per call rather than once,
 * so a viewport that is already mounted honours the setting being changed.
 */
function snaps() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export interface DuckViewportProps
  extends Omit<React.ComponentProps<"div">, "ref"> {
  /** Smallest and largest scale. Everything clamps to this range. */
  min?: number;
  max?: number;
  /** Starting transform, read once on mount. Uncontrolled, like defaultValue. */
  initial?: Partial<DuckViewportTransform>;
  /** Multiplier for zoomIn, zoomOut and the +/- keys. */
  zoomStep?: number;
  /** Pixels an arrow key moves the view. Shift multiplies it by three. */
  panStep?: number;
  /** Turn the wheel handler off where the page needs to scroll through. */
  wheelZoom?: boolean;
  /** Fires at most once per frame, after the DOM has already moved. */
  onTransformChange?: (transform: DuckViewportTransform) => void;
  ref?: React.Ref<DuckViewportHandle>;
}

function DuckViewport({
  className,
  children,
  min = 0.25,
  max = 4,
  initial,
  zoomStep = 1.25,
  panStep = 48,
  wheelZoom = true,
  onTransformChange,
  ref,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onKeyDown,
  ...props
}: DuckViewportProps) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const paneRef = React.useRef<HTMLDivElement>(null);

  // useRef keeps only the first render's value, which is exactly the "read once
  // on mount" semantics `initial` is documented to have.
  const start = React.useRef<DuckViewportTransform>({
    x: initial?.x ?? 0,
    y: initial?.y ?? 0,
    scale: clamp(initial?.scale ?? 1, min, max),
  });
  const transform = React.useRef<DuckViewportTransform>({ ...start.current });

  const pointers = React.useRef(new Map<number, { x: number; y: number }>());
  const gesture = React.useRef<Gesture | null>(null);
  /**
   * The host's box, cached when a drag begins. It cannot move while a captured
   * pointer is dragging inside it, and re-reading it after every transform
   * write would force a layout on every single move.
   */
  const box = React.useRef<DOMRect | null>(null);
  const frame = React.useRef(0);

  /**
   * Handlers live for the lifetime of the element — the wheel listener in
   * particular is registered once — so options they need are read from here
   * rather than closed over.
   */
  const settings = React.useRef({
    min,
    max,
    zoomStep,
    panStep,
    wheelZoom,
    onTransformChange,
  });
  React.useEffect(() => {
    settings.current = {
      min,
      max,
      zoomStep,
      panStep,
      wheelZoom,
      onTransformChange,
    };
  });

  const paint = React.useCallback((ease: boolean) => {
    const pane = paneRef.current;
    if (!pane) return;
    // The transition is set per write rather than sitting in the class list: a
    // drag has to land under the pointer, so only the button and key paths ease.
    pane.style.transition =
      ease && !snaps() ? "transform 0.2s var(--ease-duck)" : "none";
    const { x, y, scale } = transform.current;
    pane.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  }, []);

  const write = React.useCallback(
    (next: DuckViewportTransform, ease = false) => {
      transform.current = next;
      paint(ease);
      // The DOM is already current; only the callback waits, and only for one
      // frame, so a 120Hz stream of moves cannot outrun a consumer's render.
      if (frame.current) return;
      frame.current = window.requestAnimationFrame(() => {
        frame.current = 0;
        settings.current.onTransformChange?.({ ...transform.current });
      });
    },
    [paint]
  );

  // Put `initial` on screen without announcing a change nobody asked about.
  React.useEffect(() => {
    paint(false);
    return () => window.cancelAnimationFrame(frame.current);
  }, [paint]);

  const centre = React.useCallback(() => {
    const rect = hostRef.current?.getBoundingClientRect();
    return { x: (rect?.width ?? 0) / 2, y: (rect?.height ?? 0) / 2 };
  }, []);

  /**
   * The whole point of the component: the content under `anchor` stays under
   * `anchor`. With p = c·s + t, holding c fixed gives t' = p − (p − t)·k, and k
   * is the ratio actually applied after the clamp rather than the one asked
   * for — otherwise the content slides sideways at both limits.
   *
   * No getScreenCTM().inverse() and no DOMPoint: a point relative to the host's
   * box plus that line of algebra does the same work for any child element, not
   * only for an <svg>.
   */
  const zoomAt = React.useCallback(
    (factor: number, anchor: { x: number; y: number }, ease: boolean) => {
      const current = transform.current;
      const scale = clamp(
        current.scale * factor,
        settings.current.min,
        settings.current.max
      );
      const k = scale / current.scale;
      write(
        {
          scale,
          x: anchor.x - (anchor.x - current.x) * k,
          y: anchor.y - (anchor.y - current.y) * k,
        },
        ease
      );
    },
    [write]
  );

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    /**
     * This is the listener the report asked a registry to solve once. React
     * attaches onWheel at the root as a passive listener, so preventDefault()
     * inside a React handler is ignored — silently, apart from a console
     * warning in Chrome — and the page scrolls, or macOS runs its swipe-back
     * gesture, while you are trying to zoom. A cancellable wheel event can only
     * be had from addEventListener with `passive: false`, by hand, with the
     * matching removeEventListener on the way out.
     */
    const handleWheel = (event: WheelEvent) => {
      if (!settings.current.wheelZoom) return;
      event.preventDefault();
      const rect = host.getBoundingClientRect();
      // Firefox reports lines; nobody much reports pages. Normalise both.
      const unit =
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? rect.height : 1;
      // Exponential, so a notch up and a notch down cancel exactly. A trackpad
      // pinch arrives as a wheel with ctrlKey and a far finer delta, so it
      // needs a coarser coefficient to feel like the same gesture.
      const factor = Math.exp(
        -event.deltaY * unit * (event.ctrlKey ? 0.01 : 0.0025)
      );
      zoomAt(
        factor,
        { x: event.clientX - rect.left, y: event.clientY - rect.top },
        false
      );
    };

    host.addEventListener("wheel", handleWheel, { passive: false });
    return () => host.removeEventListener("wheel", handleWheel);
  }, [zoomAt]);

  const point = React.useCallback((event: React.PointerEvent) => {
    const rect = box.current;
    return {
      x: event.clientX - (rect?.left ?? 0),
      y: event.clientY - (rect?.top ?? 0),
    };
  }, []);

  /** Midpoint and spread of whatever is currently down. */
  const geometry = React.useCallback((): Omit<Gesture, "transform"> => {
    const [a, b] = [...pointers.current.values()];
    if (!a) return { x: 0, y: 0, distance: 0 };
    if (!b) return { x: a.x, y: a.y, distance: 0 };
    return {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
      distance: Math.hypot(a.x - b.x, a.y - b.y),
    };
  }, []);

  /**
   * Snapshot the transform against the current pointer geometry. Called on
   * every pointer down and up, because going from one finger to two — or back —
   * changes the reference point, and not re-basing makes the content jump.
   */
  const rebase = React.useCallback(() => {
    gesture.current = pointers.current.size
      ? { transform: { ...transform.current }, ...geometry() }
      : null;
  }, [geometry]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerDown?.(event);
    // Left drag and middle drag pan; anything else belongs to the browser.
    if (event.button !== 0 && event.button !== 1) return;
    // A control inside the content keeps its own click.
    if (
      event.target instanceof Element &&
      event.target.closest("a, button, input, select, textarea, [data-no-pan]")
    ) {
      return;
    }
    const host = hostRef.current;
    if (!host) return;
    // Middle button only: this is what stops Windows' autoscroll. Doing it for
    // the left button as well would cost the element its click focus.
    if (event.button === 1) {
      event.preventDefault();
      host.focus();
    }
    if (!pointers.current.size) box.current = host.getBoundingClientRect();
    // Capture, so a drag that leaves the viewport — or the window — keeps
    // sending its moves here and still ends with a pointerup on this element.
    host.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, point(event));
    rebase();
    // Cursor state as an attribute, because a re-render to swap a cursor would
    // undo the entire reason the transform is imperative.
    host.setAttribute("data-panning", "");
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, point(event));
    const base = gesture.current;
    if (!base) return;
    const now = geometry();

    if (pointers.current.size > 1 && base.distance > 0) {
      // Two fingers: a pinch about the moving midpoint, recomputed from the
      // snapshot on every move so that rounding cannot accumulate into drift.
      const scale = clamp(
        base.transform.scale * (now.distance / base.distance),
        settings.current.min,
        settings.current.max
      );
      const k = scale / base.transform.scale;
      write({
        scale,
        x: now.x - (base.x - base.transform.x) * k,
        y: now.y - (base.y - base.transform.y) * k,
      });
      return;
    }

    write({
      ...base.transform,
      x: base.transform.x + (now.x - base.x),
      y: base.transform.y + (now.y - base.y),
    });
  };

  const endPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const host = hostRef.current;
    if (!pointers.current.delete(event.pointerId)) return;
    if (host?.hasPointerCapture(event.pointerId)) {
      host.releasePointerCapture(event.pointerId);
    }
    rebase();
    if (host && !pointers.current.size) host.removeAttribute("data-panning");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey) return;
    const { panStep: step, zoomStep: factor } = settings.current;
    const distance = event.shiftKey ? step * 3 : step;
    const current = transform.current;

    switch (event.key) {
      // Arrows move the view, not the content, which is the direction a
      // scrollbar would go. Never eased: key repeat would fight a transition.
      case "ArrowLeft":
        write({ ...current, x: current.x + distance });
        break;
      case "ArrowRight":
        write({ ...current, x: current.x - distance });
        break;
      case "ArrowUp":
        write({ ...current, y: current.y + distance });
        break;
      case "ArrowDown":
        write({ ...current, y: current.y - distance });
        break;
      case "+":
      case "=":
        zoomAt(factor, centre(), true);
        break;
      case "-":
      case "_":
        zoomAt(1 / factor, centre(), true);
        break;
      case "0":
        write({ ...start.current }, true);
        break;
      default:
        return;
    }
    // Only reached for a key this handled, so the page keeps its own keys.
    event.preventDefault();
  };

  React.useImperativeHandle(
    ref,
    () => ({
      getTransform: () => ({ ...transform.current }),
      zoomIn: () => zoomAt(settings.current.zoomStep, centre(), true),
      zoomOut: () => zoomAt(1 / settings.current.zoomStep, centre(), true),
      zoomTo: (scale, anchor) =>
        zoomAt(scale / transform.current.scale, anchor ?? centre(), true),
      panBy: (dx, dy) =>
        write(
          {
            ...transform.current,
            x: transform.current.x + dx,
            y: transform.current.y + dy,
          },
          true
        ),
      reset: () => write({ ...start.current }, true),
    }),
    [centre, write, zoomAt]
  );

  return (
    <div
      ref={hostRef}
      data-slot="duck-viewport"
      tabIndex={0}
      // A group, so the accessible name a consumer gives it is announced. The
      // keys are the reason it is focusable at all: a pan surface that only
      // answers to a mouse is not finished.
      role="group"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        endPointer(event);
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event);
        endPointer(event);
      }}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative overflow-hidden outline-none select-none",
        // touch-action: none because the pane is transformed rather than
        // scrolled — there is no native pan to inherit here, and leaving it on
        // would let the browser swallow the second pointer of a pinch.
        "touch-none",
        "cursor-grab data-[panning]:cursor-grabbing",
        // No border, no background: it frames somebody else's canvas. Put the
        // sticker edge on the wrapper when the viewport wants a frame.
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
      {...props}
    >
      <div
        ref={paneRef}
        data-slot="duck-viewport-pane"
        className="h-full w-full origin-top-left will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}

export interface DuckViewportControlsProps
  extends React.ComponentProps<"div"> {
  /** The ref you passed to DuckViewport. */
  viewport: React.RefObject<DuckViewportHandle | null>;
  orientation?: "vertical" | "horizontal";
  zoomInLabel?: string;
  zoomOutLabel?: string;
  resetLabel?: string;
}

/**
 * The +/−/reset cluster: a DuckButtonGroup, joined, in toolbar mode. Three
 * buttons doing one job is exactly what the group is for, and the toolbar
 * semantics matter more here than anywhere — a canvas already owns the arrow
 * keys, so the controls beside it should cost one tab stop rather than three.
 *
 * The buttons deliberately do not disable themselves at the scale limits.
 * Knowing when to would mean subscribing to the transform, which would put the
 * pan back into React and undo the point of the component; clamping already
 * makes the press a no-op.
 */
function DuckViewportControls({
  className,
  viewport,
  orientation = "vertical",
  zoomInLabel = "Zoom in",
  zoomOutLabel = "Zoom out",
  resetLabel = "Reset view",
  "aria-label": label = "View controls",
  ...props
}: DuckViewportControlsProps) {
  return (
    <DuckButtonGroup
      data-slot="duck-viewport-controls"
      orientation={orientation}
      toolbar
      aria-label={label}
      className={className}
      {...props}
    >
      <QuackButton
        type="button"
        variant="outline"
        size="icon"
        aria-label={zoomInLabel}
        onClick={() => viewport.current?.zoomIn()}
      >
        <Plus />
      </QuackButton>
      <QuackButton
        type="button"
        variant="outline"
        size="icon"
        aria-label={zoomOutLabel}
        onClick={() => viewport.current?.zoomOut()}
      >
        <Minus />
      </QuackButton>
      <QuackButton
        type="button"
        variant="outline"
        size="icon"
        aria-label={resetLabel}
        onClick={() => viewport.current?.reset()}
      >
        <RotateCcw />
      </QuackButton>
    </DuckButtonGroup>
  );
}

export { DuckViewport, DuckViewportControls };
