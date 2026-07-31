import type { Metadata } from "next";

import { site } from "@/lib/site";
import { CodeBlock } from "@/components/docs/code-block";
import { DocSection, DocShell, Prose } from "@/components/docs/doc-shell";
import { InstallTabs } from "@/components/docs/install-tabs";
import { JsonLd, howToSchema } from "@/components/seo/structured-data";

/**
 * The same four steps the page renders, restated as a procedure. Only the steps
 * that are actually required are listed — fonts and the manual fallback are on
 * the page but are not part of the path, and a HowTo that includes optional
 * detours describes a longer job than this one is.
 */
const installSteps = [
  {
    anchor: "requirements",
    name: "Check the requirements",
    text: "Use React 19 with Tailwind CSS v4 in a project already initialised with shadcn, so components.json and lib/utils.ts exist. Wire dark mode to a .dark class on the html element.",
  },
  {
    anchor: "registry",
    name: "Add the registry",
    text: `Add "@duck": "${site.registryUrl}" to the registries block of components.json. That one key teaches the shadcn CLI the @duck namespace.`,
  },
  {
    anchor: "theme",
    name: "Install the theme",
    text: `Run ${site.install} before adding any component. It writes the light and dark token sets, the duck extras, the utility classes and the keyframes into globals.css, and existing shadcn components change appearance immediately.`,
  },
  {
    anchor: "components",
    name: "Add components",
    text: "Run npx shadcn add @duck/quack-button, or any other item, to copy a single file into components/ui/. Registry dependencies resolve on their own.",
  },
] as const;

export const metadata: Metadata = {
  title: "Installation",
  description:
    "Add the @duck registry to components.json, install the theme, then pull in the components you want.",
  alternates: { canonical: "/docs/installation" },
};

const componentsJson = `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": { "css": "app/globals.css", "baseColor": "neutral", "cssVariables": true },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks",
    "utils": "@/lib/utils"
  },
  "registries": {
    "@duck": "${site.registryUrl}"
  }
}`;

const fonts = `import { Bricolage_Grotesque } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
})

// then, in globals.css @theme inline:
//   --font-display: var(--font-bricolage), sans-serif;
//   --font-sans: var(--font-geist-sans), system-ui, sans-serif;
//   --font-mono: var(--font-geist-mono), ui-monospace, monospace;`;

export default function InstallationPage() {
  return (
    <DocShell
      title="Installation"
      description="Three steps: point the CLI at the registry, install the theme, add components. The theme comes first because everything else assumes its tokens."
      pathname="/docs/installation"
      toc={[
        { id: "requirements", label: "Requirements" },
        { id: "registry", label: "Add the registry" },
        { id: "theme", label: "Install the theme" },
        { id: "components", label: "Add components" },
        { id: "fonts", label: "Fonts" },
        { id: "manual", label: "Manual install" },
      ]}
    >
      <JsonLd
        data={howToSchema({
          name: `Install ${site.name} in a shadcn project`,
          description:
            "Point the shadcn CLI at the @duck registry, install the theme, then add components.",
          path: "/docs/installation",
          steps: installSteps,
        })}
      />

      <DocSection id="requirements" title="Requirements">
        <Prose>
          <ul>
            <li>React 19 with Tailwind CSS v4.</li>
            <li>
              A project already initialised with shadcn (<code>
                npx shadcn@latest init
              </code>
              ), so <code>components.json</code> and <code>lib/utils.ts</code>{" "}
              exist.
            </li>
            <li>
              Dark mode wired to a <code>.dark</code> class on{" "}
              <code>&lt;html&gt;</code>. next-themes is the usual way.
            </li>
            <li>
              A root <code>tsconfig.json</code> that actually declares{" "}
              <code>compilerOptions.paths</code> for <code>@/*</code>. Vite&apos;s
              React template ships a root config holding only{" "}
              <code>references</code>, and the CLI reads no <code>paths</code>{" "}
              from it — so <code>add</code> writes into a literal{" "}
              <code>./@/components/ui/</code> directory instead of yours.
            </li>
          </ul>
        </Prose>
      </DocSection>

      <DocSection
        id="registry"
        title="Add the registry"
        description="One key in components.json teaches the CLI the @duck namespace."
      >
        <CodeBlock code={componentsJson} lang="json" filename="components.json" />
      </DocSection>

      <DocSection
        id="theme"
        title="Install the theme"
        description="This writes the token contract and the holo utilities into your stylesheet. Do it before adding any component."
      >
        <InstallTabs args="add @duck/theme" />
        <Prose>
          <p>
            The theme touches only <code>globals.css</code>. It adds the light
            and dark token sets, the duck extras (<code>--holo</code>,{" "}
            <code>--foil</code>, <code>--glow</code>,{" "}
            <code>--sticker-border</code>), the utility classes and the
            keyframes. Existing shadcn components change appearance
            immediately.
          </p>
        </Prose>
      </DocSection>

      <DocSection
        id="components"
        title="Add components"
        description="Each one is a single file. Dependencies are resolved for you."
      >
        <InstallTabs args="add @duck/quack-button @duck/sticker-card @duck/holo-avatar" />
        <Prose>
          <p>
            Files land in <code>components/ui/</code> and hooks in{" "}
            <code>hooks/</code>, following the aliases in your{" "}
            <code>components.json</code>. One item also brings an asset:{" "}
            <code>@duck/duck-spinner</code> writes{" "}
            <code>public/duck.svg</code> to your project root, so the loading
            mark is same-origin and survives an <code>img-src &apos;self&apos;</code>{" "}
            policy. If an older install left it at{" "}
            <code>src/public/duck.svg</code>, move it up — no dev server serves
            it from there, and the spinner renders as two empty rings.
          </p>
          <p>
            duck/ui is additive, so there is no dialog, dropdown, table or
            tooltip here — add the standard shadcn/ui ones and the theme styles
            them on sight. Tooltips stay out on purpose: a hover-only hint reaches
            neither touch nor the keyboard, so advertise shortcuts inline with{" "}
            <code>@duck/sticker-kbd</code> and keep shadcn&apos;s{" "}
            <code>tooltip</code> for labels with nowhere else to go.
          </p>
        </Prose>
      </DocSection>

      <DocSection
        id="fonts"
        title="Fonts"
        description="Optional, but the system was drawn with these. Bricolage Grotesque for display, Geist for text and code."
      >
        <CodeBlock code={fonts} lang="tsx" filename="app/layout.tsx" />
      </DocSection>

      <DocSection
        id="manual"
        title="Manual install"
        description="No CLI, no problem. Every item is plain JSON at a stable URL."
      >
        <CodeBlock
          lang="bash"
          code={`curl ${site.url}/r/quack-button.json`}
        />
        <Prose>
          <p>
            The response contains the file contents, the npm dependencies and
            the registry dependencies. Copy the source into{" "}
            <code>components/ui/</code>, install the listed packages, and make
            sure the theme is in place first.
          </p>
        </Prose>
      </DocSection>
    </DocShell>
  );
}
