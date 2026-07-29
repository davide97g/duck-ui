import { Terminal, type TerminalLine } from "@/components/ui/terminal";

const lines: TerminalLine[] = [
  {
    text: "npx shadcn@latest init",
    output: "Wrote components.json and tailwind tokens.",
  },
  {
    text: "npx shadcn@latest add @duck/quack-button",
    output: "Added quack-button.tsx and use-holo-pointer.ts",
  },
  {
    text: "pnpm dev",
    output: "Ready on http://localhost:3000 in 812ms",
  },
];

export default function TerminalDemo() {
  return (
    <Terminal
      lines={lines}
      loop
      title="~/projects/pond"
      className="w-full max-w-xl"
    />
  );
}
