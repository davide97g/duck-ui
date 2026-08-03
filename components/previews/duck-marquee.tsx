import { DuckMarquee } from "@/components/ui/duck-marquee";
import { HoloBadge } from "@/components/ui/holo-badge";

const stack = [
  "React 19",
  "Tailwind v4",
  "shadcn CLI",
  "Radix",
  "motion",
  "TypeScript",
  "OKLCH",
];

export default function DuckMarqueeDemo() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <DuckMarquee duration={22}>
        {stack.map((item) => (
          <HoloBadge key={item} variant="outline" shape="tag">
            {item}
          </HoloBadge>
        ))}
      </DuckMarquee>
      {/* A second strip running the other way reads as one moving surface. */}
      <DuckMarquee duration={30} reverse>
        {stack.map((item) => (
          <span key={item} className="hud">
            {item}
          </span>
        ))}
      </DuckMarquee>
    </div>
  );
}
