import * as React from "react";

/**
 * Comparison pages reuse DocShell for the frame and the JSON-LD, but they sit
 * outside /docs and so get no sidebar — only the container the docs layout
 * would otherwise provide.
 */
export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-12 sm:px-6">{children}</div>
  );
}
