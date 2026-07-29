import Link from "next/link";

import { highlight } from "@/lib/highlight";
import { site } from "@/lib/site";
import { HoloSticker } from "@/components/site/holo-sticker";
import { InstallCommand } from "@/components/site/install-command";
import { Reveal } from "@/components/site/reveal";
import { ThemeProof } from "@/components/site/theme-proof";
import { Announcement } from "@/components/ui/announcement";
import { CodeWindow } from "@/components/ui/code-window";
import {
  DuckTabs,
  DuckTabsContent,
  DuckTabsList,
  DuckTabsTrigger,
} from "@/components/ui/duck-tabs";
import { DuckSpinner } from "@/components/ui/duck-spinner";
import { GlowInput } from "@/components/ui/glow-input";
import { HoloAvatar, HoloAvatarGroup } from "@/components/ui/holo-avatar";
import { HoloBadge } from "@/components/ui/holo-badge";
import { HoloButton } from "@/components/ui/holo-button";
import { QuackButton } from "@/components/ui/quack-button";
import { StickerSheet, StickerSheetCell } from "@/components/ui/sticker-sheet";
import { Terminal } from "@/components/ui/terminal";

const registryConfig = `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "registries": {
    "@duck": "${site.registryUrl}"
  }
}`;

const aiSurfaces = [
  {
    title: "CLI",
    body: "npx shadcn add @duck/quack-button pulls the source into your project. You own the file from that moment on.",
  },
  {
    title: "MCP",
    body: "The shadcn MCP server reads the same JSON, so an assistant can search the registry and install from chat.",
  },
  {
    title: "llms.txt",
    body: `One index at ${site.domain}/llms.txt states the components, the tokens and the rules the system expects.`,
  },
];

const rules = [
  {
    title: "One holo per viewport",
    body: "The iridescent finish marks the single most important thing on screen. Two of them cancel each other out.",
  },
  {
    title: "Lime is the meal",
    body: "Duck lime carries every default action. Holo is the seasoning you add at the end.",
  },
  {
    title: "Dark is the default",
    body: "The dark palette is designed first and light is derived from it, which is the opposite of most systems.",
  },
  {
    title: "Semantic tokens only",
    body: "Components reference bg-primary and text-muted-foreground. Retuning the theme retunes everything at once.",
  },
];

export default async function Home() {
  const configHtml = await highlight(registryConfig, "json");

  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-[1400px] items-center gap-12 px-4 pt-12 pb-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pt-20 lg:pb-28">
        <div className="flex flex-col items-start gap-7">
          <h1 className="font-display text-5xl leading-[0.95] font-extrabold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Stick it on anything.
          </h1>
          <p className="max-w-md text-lg text-pretty text-muted-foreground">
            A dark-first shadcn registry with holographic accents and thick
            sticker borders. One command installs the theme everywhere.
          </p>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <InstallCommand command={site.install} />
            <HoloButton asChild variant="outline" size="lg">
              <Link href="/docs/components/quack-button">
                Browse components
              </Link>
            </HoloButton>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <HoloSticker className="w-full max-w-[22rem]" />
        </div>
      </section>

      {/* Theme proof */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:py-28">
          <Reveal className="mb-10 max-w-2xl">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
              One install restyles what you already built.
            </h2>
            <p className="mt-4 text-muted-foreground">
              The theme ships the whole shadcn variable contract plus the duck
              extras. The markup below does not change between these two
              states. Only the tokens in scope do.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <ThemeProof />
          </Reveal>
        </div>
      </section>

      {/* The sheet */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:py-28">
          <Reveal className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                Everything comes on one sheet.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Seventeen components ship today. Eight of them are running in this
                sheet. Peel off the ones you need and leave the rest.
              </p>
            </div>
            <HoloButton asChild variant="outline">
              <Link href="/docs/components/quack-button">See all components</Link>
            </HoloButton>
          </Reveal>

          <Reveal delay={0.05}>
            <StickerSheet label="sheet 01">
              <StickerSheetCell label="quack-button">
                <QuackButton idle="sheen" magnetic={6}>
                  Ship it
                </QuackButton>
              </StickerSheetCell>

              <StickerSheetCell label="holo-avatar">
                <HoloAvatarGroup>
                  <HoloAvatar fallback="GB" alt="Giulia Bassani" ring="foil" />
                  <HoloAvatar fallback="MK" alt="Miro Kovač" ring="none" />
                  <HoloAvatar fallback="AT" alt="Ade Turay" ring="none" />
                </HoloAvatarGroup>
              </StickerSheetCell>

              <StickerSheetCell label="holo-badge">
                <HoloBadge variant="primary">stable</HoloBadge>
                <HoloBadge variant="outline">v0.1</HoloBadge>
                <HoloBadge variant="muted">registry</HoloBadge>
              </StickerSheetCell>

              <StickerSheetCell label="terminal" span={2} className="items-stretch">
                <Terminal
                  className="w-full"
                  title="pond"
                  lines={[
                    {
                      text: "npx shadcn add @duck/theme",
                      output: "Theme installed. Tokens written to globals.css",
                    },
                    { text: "npx shadcn add @duck/quack-button" },
                  ]}
                  loop
                />
              </StickerSheetCell>

              <StickerSheetCell label="duck-spinner">
                <DuckSpinner size="lg" />
              </StickerSheetCell>

              <StickerSheetCell label="glow-input">
                <GlowInput placeholder="Focus me" aria-label="Demo input" />
              </StickerSheetCell>

              <StickerSheetCell label="duck-tabs">
                <DuckTabs defaultValue="cli">
                  <DuckTabsList>
                    <DuckTabsTrigger value="cli">CLI</DuckTabsTrigger>
                    <DuckTabsTrigger value="manual">Manual</DuckTabsTrigger>
                  </DuckTabsList>
                  <DuckTabsContent value="cli" className="text-xs text-muted-foreground">
                    One command.
                  </DuckTabsContent>
                  <DuckTabsContent value="manual" className="text-xs text-muted-foreground">
                    Or copy the file.
                  </DuckTabsContent>
                </DuckTabs>
              </StickerSheetCell>

              <StickerSheetCell label="announcement">
                <Announcement tag="new" href="/docs/components/holo-avatar">
                  Holo avatars landed
                </Announcement>
              </StickerSheetCell>
            </StickerSheet>
          </Reveal>
        </div>
      </section>

      {/* AI surface */}
      <section className="border-t border-border">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28">
          <Reveal className="flex flex-col gap-6">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
              Your assistant can install it without you.
            </h2>
            <p className="text-muted-foreground">
              The registry is static JSON at a stable URL. Add the namespace to
              components.json once and every tool that speaks shadcn can reach
              it.
            </p>
            <dl className="flex flex-col divide-y divide-border border-y border-border">
              {aiSurfaces.map((surface) => (
                <div key={surface.title} className="grid gap-1 py-4 sm:grid-cols-[7rem_1fr] sm:gap-4">
                  <dt className="font-mono text-sm text-primary">
                    {surface.title}
                  </dt>
                  <dd className="text-sm text-muted-foreground">
                    {surface.body}
                  </dd>
                </div>
              ))}
            </dl>
            <HoloButton asChild variant="outline" className="w-fit">
              <Link href="/docs/ai">Read the AI setup</Link>
            </HoloButton>
          </Reveal>

          <Reveal delay={0.05}>
            <CodeWindow
              title="components.json"
              html={configHtml}
              copyValue={registryConfig}
              holo
            />
          </Reveal>
        </div>
      </section>

      {/* Rules */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:py-28">
          <Reveal className="mb-10 max-w-2xl">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
              Rules of the pond.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Four constraints keep the system from turning into a rainbow. The
              docs and the skill both enforce them.
            </p>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2">
            {rules.map((rule, index) => (
              <Reveal key={rule.title} delay={index * 0.05}>
                <div className="flex h-full flex-col gap-3 rounded-2xl border-2 border-border bg-card p-6">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className={
                        index === 0
                          ? "foil size-8 rounded-lg"
                          : index === 1
                            ? "size-8 rounded-lg bg-primary"
                            : index === 2
                              ? "size-8 rounded-lg bg-[linear-gradient(135deg,oklch(0.145_0.006_285)_50%,oklch(0.985_0.004_285)_50%)]"
                              : "size-8 rounded-lg border-2 border-dashed border-cut"
                      }
                    />
                    <h3 className="font-display text-lg font-bold tracking-tight">
                      {rule.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{rule.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Install */}
      <section className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 lg:py-28">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
            Start with the theme.
          </h2>
          <p className="max-w-lg text-muted-foreground">
            It restyles every shadcn component you already have. Add the
            signature pieces once you want them.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <InstallCommand command={site.install} />
            <HoloButton asChild variant="outline" size="lg">
              <Link href="/create">Open the theme editor</Link>
            </HoloButton>
          </div>
        </div>
      </section>
    </>
  );
}
