import type { Metadata } from "next";
import Link from "next/link";

import { analytics } from "@/lib/analytics";
import { legal, site } from "@/lib/site";
import { DocSection, DocShell, Prose } from "@/components/docs/doc-shell";

export const metadata: Metadata = {
  title: "Cookie notice",
  description:
    "duck/ui sets no cookies. Two browser storage keys hold your theme and package-manager preference, and nothing else is stored.",
  alternates: { canonical: "/legal/cookies" },
};

export default function CookiesPage() {
  return (
    <DocShell
      title="Cookie notice"
      description="This site sets no cookies at all. What follows is the complete list of what it does keep in your browser, and why none of it needs a consent banner."
      pathname="/legal/cookies"
      docType="WebPage"
      toc={[
        { id: "cookies", label: "Cookies" },
        { id: "storage", label: "Browser storage" },
        { id: "consent", label: "Why no banner" },
        { id: "clearing", label: "Clearing it" },
        { id: "changes", label: "Changes" },
      ]}
    >
      <DocSection id="cookies" title="Cookies">
        <Prose>
          <p>
            <strong>{site.name} sets no cookies.</strong> Not first-party, not
            third-party, not analytics, not advertising. There is no consent
            management platform on this site because there is nothing to consent
            to.
          </p>
          {analytics.enabled ? (
            <p>
              The site loads no tag manager, no embedded trackers, no social
              widgets and no external fonts at runtime — the typefaces are
              self-hosted and served from this domain. One script does load: a
              self-hosted {analytics.vendor} tag that counts page views. It is
              cookieless by design and writes nothing to your browser, which is
              why it appears in the{" "}
              <Link href="/legal/privacy">privacy notice</Link> and not in the
              list below.
            </p>
          ) : (
            <p>
              The site loads no third-party scripts, no tag manager, no embedded
              trackers, no social widgets and no external fonts at runtime — the
              typefaces are self-hosted and served from this domain.
            </p>
          )}
        </Prose>
      </DocSection>

      <DocSection
        id="storage"
        title="Browser storage"
        description="Two keys, both written only by your own interaction, both readable only by this site."
      >
        <Prose>
          <ul>
            <li>
              <code>theme</code> — <strong>localStorage</strong>. Remembers
              whether you chose dark, light or system appearance, so the site
              does not flash the wrong palette on your next visit. Written when
              you use the theme switcher. Persists until you clear it.
            </li>
            <li>
              <code>duck-package-manager</code> —{" "}
              <strong>sessionStorage</strong>. Remembers whether you picked npm,
              pnpm, yarn or bun on the install snippets, so every code block on
              every page shows your manager. Written when you switch tabs.
              Discarded when you close the tab.
            </li>
          </ul>
          <p>
            Neither key contains an identifier. Neither is transmitted anywhere
            — they are read by JavaScript running on this page and never sent to
            a server. The theme editor keeps your in-progress preset in the page
            URL (the <code>?c=</code> parameter) so the link is shareable; it
            writes nothing to storage.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="consent" title="Why there is no banner">
        <Prose>
          <p>
            Under the ePrivacy Directive as implemented in {legal.jurisdiction},
            prior consent is required for storage that is not strictly necessary
            to provide the service you asked for. Both keys above are functional
            preferences you set deliberately through the interface, contain no
            identifier and enable no tracking, so they fall inside the
            exemption. Nothing here profiles you, follows you across sites or
            builds an audience segment.
          </p>
          {analytics.enabled && (
            <p>
              The {analytics.vendor} tag is outside that question entirely: the
              rule governs storing or reading information on your device, and it
              does neither. No cookie, no localStorage entry, no fingerprint.
              What it counts is derived from the request itself, which is the
              same information the web server already logs.
            </p>
          )}
          <p>
            If a third-party embed or any storage-based tracking is ever added,
            this notice gets rewritten first and a real consent mechanism ships
            with it — blocking the script until you choose, not a banner that
            has already loaded it.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="clearing" title="Clearing it">
        <Prose>
          <p>
            Clearing site data for this domain in your browser settings removes
            both keys. The site keeps working; it simply forgets your appearance
            and package-manager choice and falls back to dark mode and npm.
            Browsing in a private window stores nothing beyond the session.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="changes" title="Changes">
        <Prose>
          <p>
            Material changes are reflected in the date at the top of this page.
            Questions about anything here go to{" "}
            <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a>.
          </p>
        </Prose>
      </DocSection>
    </DocShell>
  );
}
