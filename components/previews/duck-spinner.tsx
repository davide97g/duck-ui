import { DuckSpinner } from "@/components/ui/duck-spinner";

export default function DuckSpinnerDemo() {
  return (
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
    </div>
  );
}
