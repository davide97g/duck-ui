"use client";

import * as React from "react";
import Link from "next/link";
import { Rocket } from "lucide-react";

import {
  QuackButton,
  type QuackButtonState,
} from "@/components/ui/quack-button";

export default function QuackButtonDemo() {
  const [state, setState] = React.useState<QuackButtonState>("idle");

  React.useEffect(() => {
    if (state === "idle") return;
    const next: QuackButtonState = state === "loading" ? "success" : "idle";
    const delay = state === "loading" ? 1200 : 1600;
    const timer = window.setTimeout(() => setState(next), delay);
    return () => window.clearTimeout(timer);
  }, [state]);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <QuackButton
        state={state}
        loadingLabel="Shipping"
        successLabel="Live in Milan"
        onClick={() => setState("loading")}
      >
        Ship release 4.2
      </QuackButton>
      <QuackButton variant="primary" idle="sheen" magnetic={14}>
        <Rocket />
        Follow the pointer
      </QuackButton>
      <QuackButton asChild variant="outline">
        <Link href="/docs/components">Browse components</Link>
      </QuackButton>
    </div>
  );
}
