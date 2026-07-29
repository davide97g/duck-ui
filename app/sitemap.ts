import type { MetadataRoute } from "next";

import { site } from "@/lib/site";
import { allDocRoutes } from "@/lib/doc-routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/create", ...allDocRoutes.map((route) => route.href)];

  return pages.map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
