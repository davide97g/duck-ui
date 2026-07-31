import Script from "next/script";

import { analytics } from "@/lib/analytics";

/**
 * The Umami tag, and only when one is configured. It is first-party — the
 * script is served from the same infrastructure as the site — sets no cookies
 * and stores no identifier in the browser, which is why there is no consent
 * banner and why the cookie notice can still say what it says.
 *
 * afterInteractive rather than beforeInteractive: a page view that arrives a
 * few hundred milliseconds late costs nothing, and blocking hydration on a
 * counter would be the wrong trade in a system that ships no runtime JS of its
 * own.
 */
export function Analytics() {
  if (!analytics.enabled) return null;

  return (
    <Script
      src={analytics.scriptUrl}
      data-website-id={analytics.websiteId}
      strategy="afterInteractive"
    />
  );
}
