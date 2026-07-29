import type { Metadata } from "next";
import Link from "next/link";

import { legal, site } from "@/lib/site";
import { DocSection, DocShell, Prose } from "@/components/docs/doc-shell";

export const metadata: Metadata = {
  title: "Privacy notice",
  description:
    "duck/ui runs no analytics and asks for no personal data. This notice covers the only processing that happens: standard server logs, and requests made by the shadcn CLI.",
  alternates: { canonical: "/legal/privacy" },
};

export default function PrivacyPage() {
  return (
    <DocShell
      title="Privacy notice"
      description="There is no account, no form, no newsletter and no analytics on this site, so there is very little to describe. This notice describes it anyway, because the little that remains is still personal data."
      pathname="/legal/privacy"
      docType="WebPage"
      toc={[
        { id: "controller", label: "Who is responsible" },
        { id: "what", label: "What is processed" },
        { id: "not", label: "What is not" },
        { id: "basis", label: "Legal basis" },
        { id: "processors", label: "Who else sees it" },
        { id: "retention", label: "Retention" },
        { id: "rights", label: "Your rights" },
        { id: "changes", label: "Changes" },
      ]}
    >
      <DocSection id="controller" title="Who is responsible">
        <Prose>
          <p>
            The data controller for {site.domain} is{" "}
            <strong>{legal.controllerName}</strong>, acting as a private
            individual, reachable at{" "}
            <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a>.
            This is a personal open-source project, not a company, so there is
            no VAT number or registered office to publish.
          </p>
        </Prose>
      </DocSection>

      <DocSection
        id="what"
        title="What is processed"
        description="Two things, both unavoidable consequences of serving a website."
      >
        <Prose>
          <ul>
            <li>
              <strong>Server access logs.</strong> Like any web server, the host
              records the IP address, timestamp, requested path, HTTP status,
              user agent and referrer for each request. An IP address is
              personal data under the GDPR, which is why it is disclosed here.
              These logs exist to keep the site up, diagnose errors and absorb
              abuse or denial-of-service traffic. They are not joined to
              anything, not used to build profiles and not used to measure you
              as an audience.
            </li>
            <li>
              <strong>Registry requests from tooling.</strong> When you run{" "}
              <code>npx shadcn add @duck/…</code>, or when an AI assistant reads{" "}
              <Link href="/llms.txt">llms.txt</Link>, that is an ordinary HTTP
              request to this domain and it lands in the same access logs. The
              registry is static JSON — the request carries no information about
              your project, your code or your machine beyond the standard
              headers your client sends.
            </li>
          </ul>
        </Prose>
      </DocSection>

      <DocSection id="not" title="What is not processed">
        <Prose>
          <ul>
            <li>
              No analytics. No Google Analytics, Plausible, Umami, Vercel
              Analytics or equivalent. No page-view counting of any kind.
            </li>
            <li>
              No cookies — see the <Link href="/legal/cookies">cookie notice</Link>{" "}
              for the two functional storage keys that exist instead.
            </li>
            <li>
              No accounts, sign-up, login, or password. Nothing on this site
              asks who you are.
            </li>
            <li>
              No contact form, newsletter, mailing list or email capture.
            </li>
            <li>
              No advertising, no remarketing pixels, no fingerprinting, no
              session recording, no heatmaps.
            </li>
            <li>
              No third-party scripts or embeds at all, and no external font CDN
              — typefaces are self-hosted on this domain.
            </li>
            <li>
              No special-category data, and nothing is knowingly collected from
              children. The site is documentation for a developer tool.
            </li>
            <li>
              No automated decision-making or profiling in the sense of Article
              22 GDPR.
            </li>
          </ul>
          <p>
            Anything you type into the <Link href="/create">theme editor</Link>{" "}
            stays in your browser. The preset is encoded into the page URL so you
            can share it; it is never submitted to a server.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="basis" title="Legal basis">
        <Prose>
          <p>
            Access logs are processed under <strong>legitimate interest</strong>{" "}
            (Article 6(1)(f) GDPR): keeping a public website available, secure
            and debuggable. Since no consent-requiring technology is used, no
            consent is collected — asking for it would be theatre.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="processors" title="Who else sees it">
        <Prose>
          <p>
            The site is self-hosted on infrastructure operated by the
            controller. The hosting provider processes access logs as a
            technical necessity of routing traffic. No data is sold, rented,
            shared with advertisers or handed to any analytics processor, because
            none is engaged.
          </p>
          <p>
            Source code and the issue tracker live on GitHub. If you choose to
            open an issue or pull request, that interaction happens on GitHub
            under{" "}
            <a
              href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub&rsquo;s own privacy statement
            </a>
            , not this one.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="retention" title="Retention">
        <Prose>
          <p>
            Access logs are kept only as long as they are useful for
            troubleshooting and abuse handling, and are rotated on a short cycle
            — on the order of weeks, not years. Nothing is archived for
            analytical purposes because there is no analysis.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="rights" title="Your rights">
        <Prose>
          <p>
            Under the GDPR you may request access, rectification, erasure,
            restriction, portability, and object to processing based on
            legitimate interest. Write to{" "}
            <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a> and
            you will get a reply within one month.
          </p>
          <p>
            An honest caveat on what that can achieve here: the only record tied
            to you is a raw log line containing an IP address, with no key that
            links it to your identity. To act on an access or erasure request the
            controller would need enough detail to locate those lines, and in
            most cases identifying them is not possible — which is itself a
            consequence of collecting nothing that identifies you.
          </p>
          <p>
            You also have the right to lodge a complaint with a supervisory
            authority. In {legal.jurisdiction} that is the{" "}
            <a
              href="https://www.garanteprivacy.it"
              rel="noopener noreferrer"
              target="_blank"
            >
              Garante per la protezione dei dati personali
            </a>
            .
          </p>
        </Prose>
      </DocSection>

      <DocSection id="changes" title="Changes">
        <Prose>
          <p>
            If analytics or any third-party service is ever introduced, this
            notice is updated before that change ships, and the date at the top
            of the page moves. Material changes will also be noted in the
            project changelog.
          </p>
        </Prose>
      </DocSection>
    </DocShell>
  );
}
