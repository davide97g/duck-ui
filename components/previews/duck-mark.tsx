import { DuckMark } from "@/components/ui/duck-mark";

export default function DuckMarkDemo() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <DuckMark className="size-16" />
        <span className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          rest
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <DuckMark pose="swim" className="size-16" />
        <span className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          swim
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <DuckMark className="size-16 text-foreground" />
        <span className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          currentColor
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-end gap-1">
          <DuckMark className="size-4" />
          <DuckMark className="size-6" />
          <DuckMark className="size-8" />
        </div>
        <span className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          any size
        </span>
      </div>
    </div>
  );
}
