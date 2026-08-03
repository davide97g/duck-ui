import type { Metadata } from "next";

import { CodeBlock } from "@/components/docs/code-block";
import { DocSection, DocShell, Prose } from "@/components/docs/doc-shell";

export const metadata: Metadata = {
  title: "Motion",
  description:
    "The animation vocabulary: idle loops, transitions, composed transforms, and how reduced motion is handled.",
  alternates: { canonical: "/docs/motion" },
};

const keyframes = [
  { name: "duck-idle", role: "Breathes once every five seconds. Resting controls." },
  { name: "duck-sheen", role: "Light passes over a filled surface on a slow loop." },
  { name: "duck-float", role: "Bobs like something on water." },
  { name: "holo-shift", role: "Drifts the iridescent gradient." },
  { name: "duck-squash", role: "Press feedback with overshoot." },
  { name: "duck-pop", role: "An element arriving, with a little overshoot." },
  { name: "duck-ripple", role: "Expanding ring from a press point." },
  { name: "duck-paddle", role: "The duck glyph paddling, used while loading." },
  { name: "duck-caret", role: "Terminal cursor blink." },
  { name: "duck-rise", role: "Entrance from below. Toasts, tab panels." },
  { name: "duck-marquee", role: "Continuous horizontal travel." },
  { name: "duck-shimmer", role: "Skeleton placeholder sweep." },
  { name: "duck-dialog-in", role: "Dialog arriving, centring translate carried through." },
  { name: "duck-drawer-in", role: "Panel sliding from whichever edge anchors it." },
];

const streamEdge = `/* @duck/theme */
@utility duck-stream-edge {
  mask-image: linear-gradient(to bottom, #000 calc(100% - 1.4em), transparent);
}

/* The last line of a growing block eases in instead of popping. */
<div className="duck-prose duck-stream-edge">{answer}</div>`;

const composed = `/* Hover lift, pointer magnetism and press squash all want the
   transform property. Composing them from variables means they
   add up instead of overwriting each other. */
.quack {
  transform:
    translate(var(--mx, 0px), calc(var(--my, 0px) + var(--lift, 0px)))
    scale(var(--press, 1));
  transition: transform 300ms var(--ease-duck);
}
.quack:hover  { --lift: -2px; }
.quack:active { --press: 0.96; transition-duration: 75ms; }`;

const pointer = `"use client"

import { useHoloPointer } from "@/hooks/use-holo-pointer"

export function FoilCard() {
  // Writes --fx, --fy, --rx, --ry straight onto the node inside a rAF.
  // React never re-renders while the pointer moves.
  const ref = useHoloPointer<HTMLDivElement>({ tilt: 10, magnet: 6 })

  return <div ref={ref} className="foil tilt size-48 rounded-2xl" />
}`;

const reduced = `@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
  .tilt { transform: none !important; }
}`;

export default function MotionPage() {
  return (
    <DocShell
      title="Motion"
      description="Animation in duck/ui is either idle or reactive. Idle motion tells you a surface is alive. Reactive motion answers something the user did. Nothing moves for decoration."
      pathname="/docs/motion"
      toc={[
        { id: "two-kinds", label: "Two kinds" },
        { id: "vocabulary", label: "Vocabulary" },
        { id: "streaming", label: "Streaming edge" },
        { id: "composed", label: "Composed transforms" },
        { id: "pointer", label: "Pointer tracking" },
        { id: "reduced", label: "Reduced motion" },
      ]}
    >
      <DocSection id="two-kinds" title="Two kinds">
        <Prose>
          <p>
            <strong>Idle</strong> animation runs while nothing is happening: a
            button breathing, a sheen crossing a pill, a sticker floating. It
            has one job, to signal that a control is live, so the budget is one
            idle element per viewport. Two competing loops read as a rendering
            bug.
          </p>
          <p>
            <strong>Reactive</strong> animation answers an action: a press
            squash, a ripple from the exact pointer coordinate, a check mark
            popping in when a request resolves. There is no budget for these
            because each one is caused by the user.
          </p>
          <p>
            Durations sit between 150ms and 400ms. Entrances use{" "}
            <code>--ease-duck</code>, presses use <code>--ease-squash</code>,
            which overshoots slightly and settles.
          </p>
        </Prose>
      </DocSection>

      <DocSection
        id="vocabulary"
        title="Vocabulary"
        description="Keyframes installed by the theme. Reference them from any component."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {keyframes.map((frame) => (
            <div
              key={frame.name}
              className="flex flex-col gap-1 rounded-lg border border-border px-4 py-3"
            >
              <code className="font-mono text-xs text-primary">{frame.name}</code>
              <span className="text-sm text-muted-foreground">{frame.role}</span>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection
        id="streaming"
        title="Streaming edge"
        description="Tokens arriving from a model are motion too, and the growing edge is where it shows."
      >
        <CodeBlock code={streamEdge} lang="css" />
        <Prose>
          <p>
            <code>StreamText</code> animates the arrival of characters.{" "}
            <code>duck-stream-edge</code> softens the arrival of{" "}
            <em>lines</em>: it masks the bottom 1.4em of a block into
            transparency, so a paragraph that is still being written fades out
            at the waterline rather than snapping a full line into place. Put it
            on whatever holds the text, usually the prose wrapper, and take it
            off once the response is complete.
          </p>
          <p>
            The mask stop is <code>#000</code>, which is an alpha value and not
            a colour, so the utility needs no token and works on any surface in
            either mode. Under reduced motion the theme switches it off
            completely — a permanently faded last line is not a reduced
            animation, it is missing text.
          </p>
        </Prose>
      </DocSection>

      <DocSection
        id="composed"
        title="Composed transforms"
        description="The trick that lets several effects share one property without fighting."
      >
        <CodeBlock code={composed} lang="css" />
      </DocSection>

      <DocSection
        id="pointer"
        title="Pointer tracking"
        description="Foil, tilt and magnetism all read the same four variables, written by one hook."
      >
        <CodeBlock code={pointer} lang="tsx" />
        <Prose>
          <p>
            The hook measures the element once on pointer enter, then writes
            values inside a single animation frame. Nothing is stored in React
            state, so a page can carry many foil surfaces without a render
            storm.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="reduced" title="Reduced motion">
        <Prose>
          <p>
            The theme collapses every animation and transition when the system
            asks for reduced motion, and disables tilt outright. Components
            that would otherwise animate content into place check the media
            query themselves: the terminal, for example, prints its whole
            transcript at once instead of typing it.
          </p>
        </Prose>
        <CodeBlock code={reduced} lang="css" filename="app/globals.css" />
      </DocSection>
    </DocShell>
  );
}
