import { DuckCtaBand } from "@/components/blocks/duck-cta-band";

export default function DuckCtaBandDemo() {
  return (
    <DuckCtaBand
      className="px-0 py-0 lg:py-0"
      align="split"
      eyebrow="one command"
      title="Install the theme, keep your components."
      description="Every shadcn component already in the project inherits the tokens. Nothing to migrate."
      primaryAction={{ label: "Get started", href: "#" }}
      secondaryAction={{ label: "Read the docs", href: "#" }}
      note="MIT. No runtime dependency."
    />
  );
}
