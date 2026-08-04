import { DuckLogoWall } from "@/components/blocks/duck-logo-wall";

/** No assets here, which is the wordmark fallback doing its job. */
export default function DuckLogoWallDemo() {
  return (
    <DuckLogoWall
      className="px-0 py-0 lg:py-0"
      variant="marquee"
      eyebrow="Built with duck/ui"
      title="Four apps shipped on the registry, and every gap they found is filed."
      logos={[
        { name: "Thumb Studio", href: "#" },
        { name: "Cinema", href: "#" },
        { name: "Channeling", href: "#" },
        { name: "dacoder.it", href: "#" },
        { name: "Pond", href: "#" },
        { name: "Quackstack", href: "#" },
      ]}
      footer="Wordmarks, because none of them has a logo file yet."
    />
  );
}
