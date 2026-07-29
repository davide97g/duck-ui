"use client";

import { useQuackToast } from "@/components/ui/quack-toast";
import { QuackButton } from "@/components/ui/quack-button";

export default function QuackToastDemo() {
  const { toast, quack } = useQuackToast();

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <QuackButton
        variant="outline"
        onClick={() =>
          toast({
            title: "Deploy queued",
            description: "Pushing pond-docs to the edge network.",
          })
        }
      >
        Notify
      </QuackButton>
      <QuackButton
        variant="outline"
        onClick={() => toast({ title: "Theme installed", variant: "success" })}
      >
        Success
      </QuackButton>
      <QuackButton idle="breathe" onClick={quack}>
        Quack
      </QuackButton>
    </div>
  );
}
