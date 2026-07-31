/**
 * Umami, self-hosted, or nothing at all.
 *
 * Both variables are read at build time, like NEXT_PUBLIC_SITE_URL, so a build
 * without them ships no script tag and no third party — which is also what the
 * privacy and cookie notices then say. Never gate this on NODE_ENV: the check
 * is "is a tracker configured", and answering that from the environment keeps
 * the legal pages and the actual behaviour derived from one fact.
 */
const scriptUrl = process.env.NEXT_PUBLIC_UMAMI_URL?.trim();
const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim();

export const analytics = {
  enabled: Boolean(scriptUrl && websiteId),
  scriptUrl,
  websiteId,
  /** Named in the privacy notice. Keep the two in step. */
  vendor: "Umami",
} as const;

interface Umami {
  track: (event: string, data?: Record<string, string | number>) => void;
}

/**
 * Fire a named event. Silent when analytics is off, when the script has not
 * loaded, and when the visitor blocks it — a missing counter must never break
 * the thing being counted, because every call site here is a real action the
 * user asked for.
 */
export function track(event: string, data?: Record<string, string | number>) {
  if (!analytics.enabled) return;
  const umami = (globalThis as { umami?: Umami }).umami;
  if (!umami?.track) return;
  try {
    umami.track(event, data);
  } catch {
    // A failed beacon is not worth a broken interaction.
  }
}
