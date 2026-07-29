import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlock } from "@/components/docs/code-block";
import { DocSection, DocShell, Prose } from "@/components/docs/doc-shell";
import { HoloButton } from "@/components/ui/holo-button";

export const metadata: Metadata = {
  title: "Theming",
  description:
    "The token contract, the duck extras, the utility classes, and how to retune the palette without touching a component.",
};

const surfaceTokens = [
  { name: "background", role: "Page canvas", swatch: "bg-background" },
  { name: "foreground", role: "Body text", swatch: "bg-foreground" },
  { name: "card", role: "Raised surfaces", swatch: "bg-card" },
  { name: "popover", role: "Overlays", swatch: "bg-popover" },
  { name: "muted", role: "Quiet fills", swatch: "bg-muted" },
  { name: "border", role: "Hairlines and sticker borders", swatch: "bg-border" },
];

const accentTokens = [
  { name: "primary", role: "Duck lime, every default action", swatch: "bg-primary" },
  { name: "secondary", role: "Low emphasis fills", swatch: "bg-secondary" },
  { name: "accent", role: "Cool highlight", swatch: "bg-accent" },
  { name: "destructive", role: "Danger", swatch: "bg-destructive" },
  { name: "ring", role: "Focus rings", swatch: "bg-ring" },
];

const extras = [
  {
    name: "--holo",
    value: "linear-gradient",
    role: "The signature gradient. Used for borders and text.",
  },
  {
    name: "--foil",
    value: "conic-gradient",
    role: "Full-spectrum foil for surfaces that track the pointer.",
  },
  { name: "--glow", value: "box-shadow", role: "Soft cyan outer glow." },
  {
    name: "--glow-primary",
    value: "box-shadow",
    role: "Soft lime outer glow, used on primary hover.",
  },
  {
    name: "--sticker-border",
    value: "3px",
    role: "Border width for the sticker look.",
  },
];

const utilities = [
  { name: ".holo-border", role: "Iridescent border on any element." },
  { name: ".holo-border-animated", role: "The same border, drifting." },
  { name: ".holo-text", role: "Iridescent text fill." },
  { name: ".foil", role: "Pointer-reactive foil surface." },
  { name: ".sheen", role: "Light sweeping across on hover." },
  { name: ".tilt", role: "3D lean driven by --rx and --ry." },
  { name: ".duck-glow / .duck-glow-primary", role: "Soft outer glows." },
  { name: ".sticker", role: "Border width from --sticker-border." },
  { name: ".kiss-cut", role: "Sticker sheet backing paper." },
];

const retune = `/* Every duck lime value comes from one hue. Move it and the
   whole system follows, including glows and focus rings. */
.dark {
  --primary: oklch(0.85 0.17 265);          /* lime becomes violet */
  --primary-foreground: oklch(0.24 0.07 265);
  --ring: oklch(0.85 0.17 265);
  --glow-primary: 0 0 32px oklch(0.85 0.17 265 / 0.35);
}`;

function TokenRows({
  tokens,
}: {
  tokens: { name: string; role: string; swatch: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border-2 border-border">
      {tokens.map((token) => (
        <div
          key={token.name}
          className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-0"
        >
          <span
            aria-hidden
            className={`size-7 shrink-0 rounded-md border border-border ${token.swatch}`}
          />
          <code className="font-mono text-xs text-primary">--{token.name}</code>
          <span className="text-sm text-muted-foreground">{token.role}</span>
        </div>
      ))}
    </div>
  );
}

export default function ThemingPage() {
  return (
    <DocShell
      title="Theming"
      description="duck/ui implements the whole shadcn variable contract and adds five of its own. Components never reference a color directly, so retuning the tokens retunes everything."
      pathname="/docs/theming"
      toc={[
        { id: "surfaces", label: "Surfaces" },
        { id: "accents", label: "Accents" },
        { id: "extras", label: "Duck extras" },
        { id: "utilities", label: "Utilities" },
        { id: "retune", label: "Retuning" },
        { id: "modes", label: "Light and dark" },
      ]}
    >
      <DocSection id="surfaces" title="Surfaces">
        <Prose>
          <p>
            Every value is OKLCH. Lightness is the first number, so a palette
            can be brightened or dimmed without hue drift, which is the whole
            reason the system uses it.
          </p>
        </Prose>
        <TokenRows tokens={surfaceTokens} />
      </DocSection>

      <DocSection id="accents" title="Accents">
        <TokenRows tokens={accentTokens} />
      </DocSection>

      <DocSection
        id="extras"
        title="Duck extras"
        description="Five variables shadcn does not define. Components rely on them, so a theme that omits them will render flat."
      >
        <div className="overflow-x-auto rounded-xl border-2 border-border">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th scope="col" className="px-4 py-3 font-semibold">
                  Variable
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Kind
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {extras.map((extra) => (
                <tr key={extra.name} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-primary">
                    {extra.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {extra.value}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{extra.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection
        id="utilities"
        title="Utilities"
        description="Class names the theme installs. Components use them, and so can you."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {utilities.map((utility) => (
            <div
              key={utility.name}
              className="flex flex-col gap-1 rounded-lg border border-border px-4 py-3"
            >
              <code className="font-mono text-xs text-primary">
                {utility.name}
              </code>
              <span className="text-sm text-muted-foreground">
                {utility.role}
              </span>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection
        id="retune"
        title="Retuning the palette"
        description="Change the hue in one place. Components have no opinion about which color primary is."
      >
        <CodeBlock code={retune} lang="css" filename="app/globals.css" />
        <div>
          <HoloButton asChild variant="primary">
            <Link href="/create">Do it visually in the theme editor</Link>
          </HoloButton>
        </div>
      </DocSection>

      <DocSection id="modes" title="Light and dark">
        <Prose>
          <p>
            Dark values live under <code>.dark</code> and light values under{" "}
            <code>:root</code>. The dark set is the reference: it was drawn
            first, and the light set was tuned against it rather than
            calculated from it.
          </p>
          <p>
            Both sets are checked for WCAG AA contrast on body text and on
            every interactive state. If you retune, check both. A hue that
            works on near-black often fails on white.
          </p>
        </Prose>
      </DocSection>
    </DocShell>
  );
}
