import type { Metadata } from "next";

import { site } from "@/lib/site";
import { CodeBlock } from "@/components/docs/code-block";
import { DocSection, DocShell, Prose } from "@/components/docs/doc-shell";
import { InstallTabs } from "@/components/docs/install-tabs";

export const metadata: Metadata = {
  title: "Installation",
  description:
    "Add the @duck registry to components.json, install the theme, then pull in the components you want.",
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
            <code>components.json</code>.
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
