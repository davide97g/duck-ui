"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";

import { QuackToastProvider } from "@/components/ui/quack-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <QuackToastProvider>{children}</QuackToastProvider>
    </ThemeProvider>
  );
}
