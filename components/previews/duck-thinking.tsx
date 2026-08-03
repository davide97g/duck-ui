import { Orbit } from "lucide-react";

import { DuckThinking } from "@/components/ui/duck-thinking";

export default function DuckThinkingDemo() {
  return (
    <div className="flex flex-col items-start gap-5">
      <DuckThinking />
      <DuckThinking label="Reading the registry" />
      <DuckThinking label="Working" showLabel={false} />
      <DuckThinking
        label="Tuning in"
        mark={
          <Orbit className="relative size-6 text-primary [animation:duck-paddle_0.9s_ease-in-out_infinite]" />
        }
      />
    </div>
  );
}
