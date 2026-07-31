import * as React from "react";
import { promises as fs } from "node:fs";
import path from "node:path";

import { CodeBlock } from "@/components/docs/code-block";
import { PreviewShell } from "@/components/docs/preview-shell";
import { blockPreviews } from "@/components/previews/blocks";

/**
 * BlockPreview — the ComponentPreview of a whole section. Same contract: the
 * example renders and its own source is the code tab, so the two cannot drift.
 * Blocks are laid out edge to edge, so the frame gives them the full width.
 */
export async function BlockPreview({
  name,
  replay,
}: {
  name: keyof typeof blockPreviews;
  replay?: boolean;
}) {
  const Demo = blockPreviews[name];
  const file = path.join(
    process.cwd(),
    "components",
    "previews",
    "blocks",
    `${name}.tsx`
  );

  let source = "";
  try {
    source = await fs.readFile(file, "utf8");
  } catch {
    source = `// Missing example source: components/previews/blocks/${name}.tsx`;
  }

  return (
    <PreviewShell
      align="stretch"
      replay={replay}
      preview={<Demo />}
      code={<CodeBlock code={source} lang="tsx" filename={`${name}.tsx`} />}
    />
  );
}
