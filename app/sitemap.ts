import type { MetadataRoute } from "next";

import { legal, legalNav, site } from "@/lib/site";
import { allDocRoutes } from "@/lib/doc-routes";

/**
 * Stamped once when the static build runs, so every page reports the same
 * lastModified and the file stays byte-stable between deploys of unchanged
 * content. The legal pages report their own edit date instead.
 */
const buildDate = new Date();

type Entry = MetadataRoute.Sitemap[number];

export default function sitemap(): MetadataRoute.Sitemap {
  const landing: Entry = {
    url: site.url,
    lastModified: buildDate,
    changeFrequency: "weekly",
    priority: 1,
  };

  const primary: Entry[] = [
    { path: "/docs", priority: 0.9 },
    { path: "/create", priority: 0.9 },
  ].map(({ path, priority }) => ({
    url: `${site.url}${path}`,
    lastModified: buildDate,
    changeFrequency: "weekly",
    priority,
  }));

  const docs: Entry[] = allDocRoutes.map((route) => ({
    url: `${site.url}${route.href}`,
    lastModified: buildDate,
    changeFrequency: "weekly",
    // The AI page is the entry point for assistants, so it outranks the rest.
    priority: route.href === "/docs/ai" ? 0.8 : 0.7,
  }));

  const legalPages: Entry[] = legalNav.map((item) => ({
    url: `${site.url}${item.href}`,
    lastModified: new Date(legal.lastUpdated),
    changeFrequency: "yearly",
    priority: 0.2,
  }));

  return [landing, ...primary, ...docs, ...legalPages];
}
