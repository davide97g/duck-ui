import * as React from "react";
import { promises as fs } from "node:fs";
import path from "node:path";

import { CodeBlock } from "@/components/docs/code-block";
import { PreviewShell } from "@/components/docs/preview-shell";
import { previews } from "@/components/previews";

/**
 * ComponentPreview — renders the real example component and, next to it, the
 * exact source file it was rendered from. The code can never drift from the
 * preview because there is only one copy of it.
 */
export async function ComponentPreview({
  name,
  align,
  replay,
}: {
  name: keyof typeof previews;
  align?: "center" | "start" | "stretch";
  replay?: boolean;
}) {
  const Demo = previews[name];
  const file = path.join(process.cwd(), "components", "previews", `${name}.tsx`);

  let source = "";
  try {
    source = await fs.readFile(file, "utf8");
  } catch {
    source = `// Missing example source: components/previews/${name}.tsx`;
  }

  return (
    <PreviewShell
      align={align}
      replay={replay}
      preview={<Demo />}
      code={<CodeBlock code={source} lang="tsx" filename={`${name}.tsx`} />}
    />
  );
}
