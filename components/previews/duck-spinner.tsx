import { DuckSpinner } from "@/components/ui/duck-spinner";

/**
 * Marks loaded straight from a URL, so the src prop is documented by example
 * rather than only in the props table. Anything reachable works: a remote URL,
 * a path out of /public, or a data URI.
 */
const marks = [
  { src: undefined, label: "default — duck/ui logo" },
  { src: "https://github.com/davide97g.png", label: "github.com/davide97g.png" },
  { src: "https://github.com/shadcn.png", label: "github.com/shadcn.png" },
  { src: "https://github.com/vercel.png", label: "github.com/vercel.png" },
  { src: "/duck.png", label: "/duck.png — local file" },
];

export default function DuckSpinnerDemo() {
  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex items-end gap-8">
        <div className="flex flex-col items-center gap-3">
          <DuckSpinner size="sm" label="Checking registry" />
          <span className="text-xs text-muted-foreground">sm</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <DuckSpinner label="Installing components" />
          <span className="text-xs text-muted-foreground">default</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <DuckSpinner size="lg" label="Building the theme" />
          <span className="text-xs text-muted-foreground">lg</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <DuckSpinner size="lg" motion="spin" label="Publishing" />
          <span className="text-xs text-muted-foreground">
            motion=&quot;spin&quot;
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-center gap-6">
        {marks.map((mark) => (
          <div
            key={mark.label}
            className="flex w-32 flex-col items-center gap-3 text-center"
          >
            <DuckSpinner
              size="lg"
              src={mark.src}
              label={`Loading — ${mark.label}`}
            />
            <span className="text-[11px] leading-tight break-all text-muted-foreground">
              {mark.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
