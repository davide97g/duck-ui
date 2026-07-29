import { site } from "@/lib/site";
import { components, guides } from "@/lib/registry-docs";

export const dynamic = "force-static";

function componentSection(slug: string) {
  const doc = components.find((item) => item.slug === slug);
  if (!doc) return "";

  const props = doc.props.length
    ? doc.props
        .map(
          (prop) =>
            `| \`${prop.name}\` | \`${prop.type}\` | ${
              prop.default ? `\`${prop.default}\`` : "-"
            } | ${prop.description} |`
        )
        .join("\n")
    : "| - | - | - | No props. |";

  return `### ${doc.title}

${doc.summary}

- Install: \`npx shadcn@latest add @duck/${doc.slug}\`
- Import: \`import { ${doc.exports.join(", ")} } from "@/components/ui/${doc.slug}"\`
- Category: ${doc.category}
- Rendering: ${doc.client ? "client component" : "server safe"}
${doc.dependencies ? `- npm dependencies: ${doc.dependencies.join(", ")}\n` : ""}${
    doc.registryDependencies
      ? `- registry dependencies: ${doc.registryDependencies.join(", ")}\n`
      : ""
  }
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
${props}
${doc.rules?.length ? `\nRules:\n${doc.rules.map((rule) => `- ${rule}`).join("\n")}\n` : ""}`;
}

function build() {
  const guideList = guides
    .flatMap((section) => section.items)
    .map((item) => `- ${item.title}: ${item.summary} (${site.url}${item.href})`)
    .join("\n");

  return `# ${site.name} (full)

> ${site.description}

Source of truth: ${site.url}. Registry index: ${site.url}/r/registry.json.

## Setup

\`\`\`json
// components.json
{
  "registries": {
    "@duck": "${site.registryUrl}"
  }
}
\`\`\`

\`\`\`bash
${site.install}          # always first
npx shadcn@latest add @duck/quack-button
\`\`\`

## Design rules

1. One holo element per viewport. The iridescent finish marks the single most
   important thing on screen; a second one halves the value of the first.
2. Lime is the meal, holo is the seasoning. Default actions use the solid
   \`primary\` variant.
3. One idle animation per viewport. Reactive animation (press, ripple, state
   change) has no budget because the user caused it.
4. Dark is designed first. Light is derived and checked separately.
5. Semantic tokens only. Components never reference a raw color.
6. Compose with shadcn/ui for everything duck/ui does not ship.

## Tokens

Standard shadcn contract: background, foreground, card, card-foreground,
popover, popover-foreground, primary, primary-foreground, secondary,
secondary-foreground, muted, muted-foreground, accent, accent-foreground,
destructive, destructive-foreground, border, input, ring, chart-1 to chart-5,
radius.

duck extras: \`--holo\` (linear gradient), \`--foil\` (conic gradient),
\`--glow\` and \`--glow-primary\` (box shadows), \`--sticker-border\` (border
width), \`--sheet\` / \`--sheet-line\` / \`--cut\` (sticker sheet backing),
\`--fx\` / \`--fy\` / \`--rx\` / \`--ry\` (pointer position, written by
useHoloPointer).

## Guides

${guideList}

## Components

${components.map((item) => componentSection(item.slug)).join("\n")}
## Hook

### useHoloPointer

\`import { useHoloPointer } from "@/hooks/use-holo-pointer"\`

Writes pointer position into CSS variables inside one animation frame, so
foil, tilt and magnetism run entirely in CSS. Options: \`tilt\` (degrees,
default 8), \`magnet\` (px, default 0), \`reset\` (return to rest on leave,
default true), \`disabled\`. Returns a ref to attach to the element. Does
nothing when the user prefers reduced motion.
`;
}

export function GET() {
  return new Response(build(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
