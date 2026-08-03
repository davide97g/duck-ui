import type { Metadata } from "next";
import Link from "next/link";

import { CodeBlock } from "@/components/docs/code-block";
import { DocSection, DocShell, Prose } from "@/components/docs/doc-shell";
import { HoloButton } from "@/components/ui/holo-button";

export const metadata: Metadata = {
  title: "Theming",
  description:
    "The token contract, the duck extras, the utility classes, and how to retune the palette without touching a component.",
  alternates: { canonical: "/docs/theming" },
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
  {
    name: "--sheen",
    value: "color",
    role: "The sweep colour in .sheen. White on a duck surface, the accent on a themed one.",
  },
  {
    name: "--surface / --surface-raised",
    value: "color",
    role: "Third and fourth surface steps, for a theme that layers canvas over surface over raised.",
  },
  {
    name: "--glass / --glass-blur",
    value: "color / length",
    role: "Translucent panel fill and its backdrop blur. StickerCard glass reads both.",
  },
];

const controlTypography = [
  {
    name: "--font-button",
    value: "var(--font-sans)",
    role: "Family for every button label.",
  },
  { name: "--weight-button", value: "600", role: "Label weight." },
  { name: "--tracking-button", value: "normal", role: "Label tracking." },
  {
    name: "--case-button",
    value: "none",
    role: "text-transform. uppercase turns every CTA into HUD chrome.",
  },
  {
    name: "--text-button-sm / --text-button / --text-button-lg",
    value: "0.75 / 0.875 / 1rem",
    role: "One size per size variant, selected by the button's own data-size.",
  },
  {
    name: "--font-badge, --weight-badge, --tracking-badge, --case-badge, --text-badge",
    value: "same shape",
    role: "The badge's five.",
  },
];

const controlType = `/* Noir's whole CTA vocabulary. No markup changes, no per-call-site class. */
.theme-noir {
  --font-button: var(--font-mono);
  --weight-button: 500;
  --tracking-button: 0.16em;
  --case-button: uppercase;
  --text-button-sm: 0.6875rem;
  --text-button: 0.75rem;
  --text-button-lg: 0.75rem;
}

/* Variants are visible to CSS, so a rule can reach one of them. */
[data-slot="holo-button"][data-variant="outline"]:hover {
  background: color-mix(in oklab, var(--primary) 8%, transparent);
}`;

const commentTrap = `/* HoloButton's size variant */   /* <- do not do this */
.thing { color: var(--primary); }  /* silently swallowed */`;

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
  { name: ".grain", role: "Fixed film-grain overlay over the whole page." },
  {
    name: ".display-xl / -lg / -md",
    role: "Display scale on top of --font-display, so nobody invents a clamp().",
  },
  { name: ".balance", role: "text-wrap: balance, for headlines." },
];

const fontInstall = `npm i @fontsource-variable/bricolage-grotesque @fontsource-variable/geist`;

const fontWiring = `@import "@fontsource-variable/bricolage-grotesque";
@import "@fontsource-variable/geist";

/* The @theme block the theme installed already declares both tokens with a
   system fallback stack. Replace the two values with the real faces — spelled
   out, not var(--font-sans): under @theme inline a token is not emitted as a
   custom property, so a var() reference to a sibling token resolves to
   nothing. */
@theme inline {
  --font-sans: "Geist Variable", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Bricolage Grotesque Variable", "Geist Variable", sans-serif;
}`;

const darkOnly = `<html lang="en" class="dark">`;

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

function VariableTable({
  rows,
}: {
  rows: { name: string; value: string; role: string }[];
}) {
  return (
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
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-border last:border-0">
              <td className="px-4 py-3 font-mono text-xs text-primary">
                {row.name}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {row.value}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{row.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
        { id: "control-type", label: "Control typography" },
        { id: "type", label: "Type" },
        { id: "utilities", label: "Utilities" },
        { id: "writing-css", label: "Writing the CSS" },
        { id: "retune", label: "Retuning" },
        { id: "modes", label: "Light and dark" },
        { id: "dark-only", label: "Dark-only apps" },
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
        <VariableTable rows={extras} />
      </DocSection>

      <DocSection
        id="control-type"
        title="Control typography"
        description="A theme's label vocabulary lives in tokens, because a hardcoded text-sm font-semibold in a component is a Tailwind utility and no stylesheet can undo it."
      >
        <VariableTable rows={controlTypography} />
        <Prose>
          <p>
            The components read these through rules in <code>@layer base</code>{" "}
            at zero specificity, so a theme sets the vocabulary once and a single
            call site still overrides any part of it with a plain utility. Font
            size in particular belongs here rather than in the size variant:{" "}
            <code>lg: &quot;… text-base&quot;</code> is a utility, and a utility
            cannot be beaten from CSS at all — only by another utility on the
            same element, where <code>cn()</code> strips one of the pair.
          </p>
          <p>
            Every variant-bearing component also emits{" "}
            <code>data-variant</code> and <code>data-size</code> next to{" "}
            <code>data-slot</code>, which is what lets a rule reach one variant
            instead of one call site.
          </p>
        </Prose>
        <CodeBlock code={controlType} lang="css" filename="app/globals.css" />
      </DocSection>

      <DocSection
        id="type"
        title="Type"
        description="Two font tokens, both installed with a system fallback so nothing renders unstyled. The real pairing is one npm install away."
      >
        <Prose>
          <p>
            The theme declares <code>--font-sans</code> for body copy and{" "}
            <code>--font-display</code> for headings. Components reach for the
            second through the <code>font-display</code> utility —{" "}
            <code>StickerCardTitle</code>, <code>EmptyPond</code>,{" "}
            <code>VideoCard</code> and every block headline. In Tailwind v4 an
            undefined{" "}
            <code>font-*</code> token emits nothing at all, so the token has to
            exist or those strings quietly fall back to the body face.
          </p>
          <p>
            The pairing this design system was drawn with is{" "}
            <strong>Bricolage Grotesque</strong> for display — wide, slightly
            odd, the sticker voice — over <strong>Geist</strong> for everything
            else. Opt in:
          </p>
        </Prose>
        <CodeBlock code={fontInstall} lang="bash" />
        <CodeBlock code={fontWiring} lang="css" filename="app/globals.css" />
        <Prose>
          <p>
            On Next.js, <code>next/font</code> replaces the two imports: load
            the faces there and point the same tokens at the CSS variables it
            generates. That is what this site does.
          </p>
          <p>
            <strong>Your override is not permanent.</strong> Both tokens belong
            to <code>@duck/theme</code>, so any later{" "}
            <code>shadcn add @duck/theme</code> writes the system stack back
            over them — including when the theme comes along silently as another
            component&rsquo;s registry dependency. It is a two-line re-fix that
            reads like the fonts broke on their own, so leave a comment next to
            your override saying where it came from, or keep the pair in a file
            the CLI never writes to.
          </p>
        </Prose>
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
        id="writing-css"
        title="Writing the CSS"
        description="Two traps that cost a screenshot and a stack trace to find."
      >
        <Prose>
          <p>
            <strong>A class you ship outranks Tailwind&rsquo;s own utilities.</strong>{" "}
            A registry <code>css</code> block lands at the end of the utilities
            layer, and a plain class rule has the same specificity as a utility,
            so it wins on order. Declare anything a utility is expected to
            override — colour, radius, font size — inside{" "}
            <code>:where()</code>, which drops it to zero specificity. That is
            why the theme writes{" "}
            <code>:where(.hud) &#123; color: … &#125;</code> rather than{" "}
            <code>.hud &#123; color: … &#125;</code>:{" "}
            <code>class=&quot;hud text-primary&quot;</code> renders muted
            otherwise, with no error anywhere.
          </p>
          <p>
            The same order runs the other way at a call site.{" "}
            <code>.sticker</code> sets a real{" "}
            <code>border-width</code>, so{" "}
            <code>&lt;GlowInput className=&quot;border-0&quot; /&gt;</code> loses
            on order and the 3px edge stays — and the working incantation is six
            overrides long. That is why a component that might have to give up
            its frame or its mascot exposes a prop for it:{" "}
            <code>frame</code> on <code>GlowInput</code>,{" "}
            <code>art</code> on <code>EmptyPond</code>, <code>mark</code> on{" "}
            <code>DuckThinking</code> and <code>QuackBubble</code>. If you find
            yourself stacking negations against a duck utility, look for the prop
            first.
          </p>
          <p>
            <strong>
              Tailwind v4&rsquo;s parser treats an apostrophe inside a comment as
              a string delimiter.
            </strong>{" "}
            One in a CSS comment swallows everything up to the next one, and the
            only symptom is <code>Unterminated string</code> somewhere deep in a
            build trace.
          </p>
        </Prose>
        <CodeBlock code={commentTrap} lang="css" />
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

      <DocSection
        id="dark-only"
        title="Dark-only apps"
        description="If the app is never light, pin the class and skip the toggle."
      >
        <CodeBlock code={darkOnly} lang="html" filename="app/layout.tsx" />
        <Prose>
          <p>
            That is the whole recipe: no <code>next-themes</code>, no
            hydration flash, no toggle to style.
          </p>
          <p>
            Leave the <code>:root</code> block where it is. It is not a light
            theme you are carrying for nothing — it is the base declaration, and{" "}
            <code>.dark</code> is a diff on top of it. Only the values that
            actually change between modes are restated there, so{" "}
            <code>--holo</code>, <code>--foil</code>,{" "}
            <code>--sticker-border</code>, <code>--vinyl</code> and the pointer
            variables <code>--fx</code> / <code>--fy</code> / <code>--rx</code>{" "}
            / <code>--ry</code> exist on <code>:root</code> alone. Delete it and
            the foil dies, sticker borders lose their width and every tilt stops
            moving. Keeping it also means the day someone does want a toggle,
            light already works — and so does every stock shadcn component,
            which reads the same two blocks.
          </p>
        </Prose>
      </DocSection>
    </DocShell>
  );
}
