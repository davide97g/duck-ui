import { DuckHero } from "@/components/blocks/duck-hero";

export default function DuckHeroDemo() {
  return (
    <DuckHero
      className="px-0 pt-0 pb-0 lg:pt-0 lg:pb-0"
      eyebrow={{ tag: "new", text: "v1 is out of the pond", href: "#" }}
      title="Stick it on anything."
      description="A dark-first shadcn registry with holographic accents and thick sticker borders. One command installs the theme everywhere."
      primaryAction={{ label: "Get started", href: "#" }}
      secondaryAction={{ label: "Browse components", href: "#" }}
      terminal={[
        { text: "npx shadcn add @duck/theme", output: "✔ Added 1 item" },
        { text: "npx shadcn add @duck/duck-hero", output: "✔ Added components/blocks/duck-hero.tsx" },
      ]}
      proof={
        <p className="text-sm text-muted-foreground">
          31 components · MIT · no runtime dependency
        </p>
      }
    />
  );
}
