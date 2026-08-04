"use client";

import { DuckAuthCard } from "@/components/blocks/duck-auth-card";
import { DuckMark } from "@/components/ui/duck-mark";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** 123456 verifies; anything else is rejected, so both paths are visible. */
export default function DuckAuthCardDemo() {
  return (
    <DuckAuthCard
      brand={<DuckMark className="size-8 text-primary" />}
      title="Sign in to duck/ui"
      description="We send a six-digit code. No password to forget."
      onRequestCode={async () => {
        await wait(700);
      }}
      onVerify={async (code) => {
        await wait(700);
        if (code !== "123456") throw new Error("That code did not match. Try 123456.");
      }}
      providers={[{ label: "Continue with GitHub" }]}
      legal="By signing in you agree to the terms and the privacy notice."
      footer={
        <>
          No account?{" "}
          <a className="text-primary underline-offset-4 hover:underline" href="#">
            Create one
          </a>
        </>
      }
    />
  );
}
