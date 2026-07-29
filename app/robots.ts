import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

/**
 * Everything here is public and meant to be read by machines, so every crawler
 * is allowed. The AI crawlers are named explicitly rather than left to the
 * wildcard: several of them (Google-Extended, Applebot-Extended) exist purely
 * as opt-out switches, so an explicit Allow is the only way to state intent
 * instead of leaving it ambiguous.
 */
const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "DuckAssistBot",
  "meta-externalagent",
  "Amazonbot",
  "Bytespider",
  "CCBot",
  "cohere-ai",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: aiCrawlers, allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
