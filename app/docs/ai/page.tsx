import type { Metadata } from "next";

import { site } from "@/lib/site";
import { CodeBlock } from "@/components/docs/code-block";
import { DocSection, DocShell, Prose } from "@/components/docs/doc-shell";

export const metadata: Metadata = {
  title: "For AI assistants",
  description:
    "llms.txt, the shadcn MCP server, and the duck/ui skill. Three ways an assistant can install and use this system correctly.",
};

const mcpJson = `{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "shadcn@latest", "mcp"]
    }
  }
}`;

const mcpCli = `# Claude Code
claude mcp add shadcn -- npx shadcn@latest mcp

# then, in any project whose components.json has the @duck namespace:
#   "search the duck registry for an avatar"
#   "add the quack button to this page"`;

const skill = `skills add dacoder/duck-ui`;

const promptRules = `duck/ui rules:
- Install @duck/theme before any component.
- At most one holo element per viewport. Everything else uses primary (duck lime).
- Semantic tokens only: bg-primary, text-muted-foreground, border-border. Never raw hex.
- Dark mode is the default. Light mode is the variant.
- For anything duck/ui does not ship (dialog, dropdown, table), use standard shadcn.
  The theme styles it already.`;

export default function AiPage() {
  return (
    <DocShell
      title="For AI assistants"
      description="The registry is static JSON at a stable URL, which is the whole reason assistants can work with it. Three surfaces build on that: a text index, an MCP server, and a skill."
      pathname="/docs/ai"
      toc={[
        { id: "llms", label: "llms.txt" },
        { id: "mcp", label: "MCP" },
        { id: "skill", label: "Skill" },
        { id: "rules", label: "Rules to paste" },
      ]}
    >
      <DocSection
        id="llms"
        title="llms.txt"
        description="A plain text index of the system, in the format assistants already expect."
      >
        <Prose>
          <p>
            <a href="/llms.txt">
              {site.domain}/llms.txt
            </a>{" "}
            lists every component with a one-line description, the install
            steps and the four rules. <a href="/llms-full.txt">llms-full.txt</a>{" "}
            adds the full prop tables for assistants that can take the whole
            thing in one read.
          </p>
          <p>
            Both files are generated from the same source as these docs, so
            they cannot drift from what the site says.
          </p>
        </Prose>
        <CodeBlock lang="bash" code={`curl ${site.url}/llms.txt`} />
      </DocSection>

      <DocSection
        id="mcp"
        title="MCP"
        description="The shadcn MCP server reads any registry configured in components.json, including this one."
      >
        <CodeBlock code={mcpJson} lang="json" filename=".mcp.json" />
        <CodeBlock code={mcpCli} lang="bash" />
        <Prose>
          <p>
            Nothing duck-specific is involved. The server enumerates the
            namespaces in your <code>components.json</code>, and{" "}
            <code>@duck</code> is one of them.
          </p>
        </Prose>
      </DocSection>

      <DocSection
        id="skill"
        title="Skill"
        description="For assistants that support skills, this is the deepest surface: the design rules, not just the file list."
      >
        <CodeBlock code={skill} lang="bash" />
        <Prose>
          <p>
            The skill teaches the composition patterns, the holo budget, the
            token names and the install order. It activates on its own when a
            project&apos;s <code>components.json</code> contains the{" "}
            <code>@duck</code> namespace.
          </p>
        </Prose>
      </DocSection>

      <DocSection
        id="rules"
        title="Rules to paste"
        description="If your tool has none of the above, this block is enough to keep an assistant on-system."
      >
        <CodeBlock code={promptRules} lang="markdown" />
      </DocSection>
    </DocShell>
  );
}
