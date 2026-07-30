import { DuckThinking } from "@/components/ui/duck-thinking";

export default function DuckThinkingDemo() {
  return (
    <div className="flex flex-col items-start gap-5">
      <DuckThinking />
      <DuckThinking label="Reading the registry" />
      <DuckThinking label="Working" showLabel={false} />
    </div>
  );
}
