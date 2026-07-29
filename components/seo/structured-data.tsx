import { site } from "@/lib/site";

/**
 * JSON-LD emitters. Search engines use these for rich results; AI answer
 * engines use them to decide what this site *is* before deciding whether to
 * cite it. Both matter more here than on a normal marketing page, because the
 * whole pitch is that machines can consume this registry.
 */

type Json = Record<string, unknown>;

/**
 * `<` is escaped because a string ending in `</script>` inside a JSON-LD block
 * would otherwise close the tag early. JSON.stringify does not do this for us.
 */
export function JsonLd({ data }: { data: Json }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

const authorId = `${site.url}/#author`;
const websiteId = `${site.url}/#website`;
const softwareId = `${site.url}/#software`;

/**
 * The site-wide graph, emitted once from the root layout. One @graph with
 * cross-references beats three disconnected blocks — it tells a consumer that
 * the website, the author and the software are the same project.
 */
export function siteGraph(): Json {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": authorId,
        name: site.author.name,
        url: site.author.url,
        sameAs: [site.author.url, site.author.youtube, site.repo],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: site.url,
        name: site.name,
        description: site.description,
        inLanguage: "en",
        publisher: { "@id": authorId },
        author: { "@id": authorId },
        license: `${site.url}/legal/terms`,
      },
      {
        "@type": "SoftwareSourceCode",
        "@id": softwareId,
        name: site.name,
        description: site.description,
        url: site.url,
        codeRepository: site.repo,
        programmingLanguage: ["TypeScript", "CSS"],
        runtimePlatform: "React",
        license: "https://opensource.org/licenses/MIT",
        author: { "@id": authorId },
        isPartOf: { "@id": websiteId },
        keywords: [
          "shadcn registry",
          "React components",
          "design system",
          "Tailwind CSS v4",
          "component library",
          "dark mode UI",
        ],
      },
      {
        "@type": "SoftwareApplication",
        name: site.name,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        url: site.url,
        description: site.description,
        author: { "@id": authorId },
        // A free tool still needs an offer for the price to be machine-readable.
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
        },
      },
    ],
  };
}

/** Breadcrumb trail for a docs page. Improves how the URL renders in SERPs. */
export function breadcrumbSchema(
  trail: { name: string; path: string }[]
): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

/**
 * A single page. TechArticle for documentation, WebPage for legal and policy
 * pages — calling a privacy notice technical documentation would be a lie to
 * the crawler, and the distinction is free to make.
 */
export function pageSchema({
  title,
  description,
  path,
  docType = "TechArticle",
}: {
  title: string;
  description: string;
  path: string;
  docType?: "TechArticle" | "WebPage";
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": docType,
    headline: title,
    description,
    url: `${site.url}${path}`,
    inLanguage: "en",
    author: { "@id": authorId },
    publisher: { "@id": authorId },
    isPartOf: { "@id": websiteId },
    license: "https://opensource.org/licenses/MIT",
  };
}
