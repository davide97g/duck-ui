import { CodeSnippet } from "@/components/ui/code-snippet";

const snippet = `// Sticker-cut card, foil ring while the pointer is on it.
export function PondCard({ title, count = 0 }: PondCardProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <StickerCard tilt onClick={() => setOpen(!open)}>
      <StickerCardTitle>{title}</StickerCardTitle>
      <HoloBadge variant="primary">{count} ducks</HoloBadge>
    </StickerCard>
  );
}`;

export default function CodeSnippetDemo() {
  return (
    <CodeSnippet
      code={snippet}
      title="pond-card.tsx"
      highlight="7-9"
      schemePicker
      wrapToggle
      watermark="duckui.davideghiotto.it"
      className="w-full max-w-xl"
    />
  );
}
