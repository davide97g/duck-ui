import { CodeWindow } from "@/components/ui/code-window";

const snippet = `npx shadcn@latest add \\
  @duck/theme @duck/sticker-card`;

export default function CodeWindowDemo() {
  return (
    <CodeWindow
      title="install.sh"
      copyValue={snippet}
      className="w-full max-w-xl"
    >
      {snippet}
    </CodeWindow>
  );
}
