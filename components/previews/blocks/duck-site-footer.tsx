import { DuckSiteFooter } from "@/components/blocks/duck-site-footer";
import { DuckMark } from "@/components/ui/duck-mark";

export default function DuckSiteFooterDemo() {
  return (
    <DuckSiteFooter
      className="rounded-xl border border-border"
      brand={<DuckMark className="size-10" />}
      description="A dark-first shadcn registry. Open code, installed by the CLI, readable by your assistant."
      columns={[
        {
          title: "Docs",
          links: [
            { label: "Installation", href: "#installation" },
            { label: "Theming", href: "#theming" },
            { label: "Motion", href: "#motion" },
          ],
        },
        {
          title: "Build",
          links: [
            { label: "Theme editor", href: "#create" },
            { label: "Registry index", href: "#registry" },
            { label: "llms.txt", href: "#llms" },
          ],
        },
        {
          title: "Elsewhere",
          links: [
            { label: "GitHub", href: "#github", external: true },
            { label: "YouTube", href: "#youtube", external: true },
          ],
        },
      ]}
      note={<>Built in public. MIT licensed.</>}
      legal={[
        { label: "Privacy", href: "#privacy" },
        { label: "Terms", href: "#terms" },
      ]}
    />
  );
}
