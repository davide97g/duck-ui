import { CopyButton } from "@/components/ui/copy-button";

const command = "npx shadcn@latest add @duck/copy-button";

export default function CopyButtonDemo() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card/60 px-3 py-2">
      <code className="font-mono text-xs text-muted-foreground sm:text-sm">
        {command}
      </code>
      <CopyButton value={command} label="Copy install command" />
    </div>
  );
}
