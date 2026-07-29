import type { Metadata } from "next";

import { ThemeEditor } from "@/components/site/theme-editor";

export const metadata: Metadata = {
  title: "Theme editor",
  description:
    "Retune the duck palette on live components, then copy the CSS or share the preset as a link.",
  alternates: { canonical: "/create" },
};

export default function CreatePage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:py-16">
      <header className="mb-10 flex max-w-2xl flex-col gap-3">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">
          Theme editor
        </h1>
        <p className="text-lg text-pretty text-muted-foreground">
          Every control writes a CSS variable. The components on the right are
          the real ones, so what you see is what installs. Copy the block into
          globals.css, or share the link and the settings travel with it.
        </p>
      </header>

      <ThemeEditor />
    </div>
  );
}
