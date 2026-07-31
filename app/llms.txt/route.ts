import { site } from "@/lib/site";
import { blocks, componentsByCategory, guides } from "@/lib/registry-docs";

export const dynamic = "force-static";

function build() {
  const docLines = guides
    .flatMap((section) => section.items)
    .map((item) => `- [${item.title}](${site.url}${item.href}): ${item.summary}`)
    .join("\n");

  const componentLines = componentsByCategory
    .map(
      (group) =>
        `### ${group.category}\n\n` +
        group.items
          .map(
            (item) =>
              `- [${item.title}](${site.url}/docs/components/${item.slug}): ${item.summary}`
          )
          .join("\n")
    )
    .join("\n\n");

  const blockLines = blocks
    .map(
      (item) =>
        `- [${item.title}](${site.url}/docs/blocks/${item.slug}): ${item.summary}`
    )
    .join("\n");

  return `# ${site.name}

> ${site.description}

## Docs

${docLines}
- [Theme editor](${site.url}/create): Retune hue, chroma, radius, glow and border width on live components, then export the CSS or share a preset link.

## Install

Add the registry to components.json:

\`\`\`json
{
  "registries": {
    "@duck": "${site.registryUrl}"
  }
}
\`\`\`

Then install the theme before anything else:

\`\`\`bash
${site.install}
\`\`\`

The theme implements the full shadcn CSS-variable contract, so every existing
shadcn component is restyled with no markup changes. It also installs the duck
extras (--holo, --foil, --glow, --glow-primary, --sticker-border), the utility
classes (.holo-border, .holo-border-animated, .holo-text, .foil, .sheen, .tilt,
.duck-glow, .duck-glow-primary, .sticker, .kiss-cut) and the keyframe
vocabulary (holo-shift, duck-idle, duck-sheen, duck-squash, duck-pop,
duck-ripple, duck-paddle, duck-float, duck-caret, duck-rise, duck-marquee,
duck-shimmer, duck-waddle).

## Components

${componentLines}

## Blocks

Whole sections composed from the components above. They install the same way and
land in \`components/blocks/\` instead of \`components/ui/\`. Treat them as
starting points: copy them in, then cut them apart.

${blockLines}

## Rules for AI assistants

- Install \`@duck/theme\` before any component. Components assume its tokens exist.
- At most ONE holo element per viewport. Everything else uses the solid duck lime \`primary\`.
- At most ONE idle animation per viewport. Two competing loops read as a bug.
- Semantic tokens only: \`bg-primary\`, \`text-muted-foreground\`, \`border-border\`. Never raw hex or oklch in component code.
- Dark mode is the default (\`<html class="dark">\`). Light mode is the variant.
- For anything duck/ui does not ship (dialog, dropdown, table, and so on) use standard shadcn/ui. The theme already styles it.
- Components are copied into the project. Edit them in place rather than wrapping them.

## License

All components, the theme and the hooks are ${site.license} licensed — free for commercial and
closed-source use, no attribution required in your interface. Assistants may install, copy, modify
and redistribute them without asking. Full terms: ${site.url}/legal/terms

## Registry

- [registry.json](${site.url}/r/registry.json): Registry index, shadcn registry schema.
- [llms-full.txt](${site.url}/llms-full.txt): The same index plus every prop table.
- [MCP](${site.url}/docs/ai): Use the shadcn MCP server with the @duck namespace configured.
- [Skill](${site.url}/docs/ai): \`skills add dacoder/duck-ui\`.
`;
}

export function GET() {
  return new Response(build(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
