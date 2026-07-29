import type { Metadata } from "next";
import Link from "next/link";

import { legal, site } from "@/lib/site";
import { DocSection, DocShell, Prose } from "@/components/docs/doc-shell";

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "The terms covering the duck/ui website and registry: MIT-licensed component code, no warranty, no uptime guarantee, and fair use of the public registry endpoints.",
  alternates: { canonical: "/legal/terms" },
};

export default function TermsPage() {
  return (
    <DocShell
      title="Terms of use"
      description="Short version: the components are MIT licensed and yours to use commercially, the site is provided as-is with no guarantees, and please do not hammer the registry. The long version follows."
      pathname="/legal/terms"
      docType="WebPage"
      toc={[
        { id: "who", label: "Who provides this" },
        { id: "license", label: "License to the code" },
        { id: "site", label: "The site itself" },
        { id: "registry", label: "Using the registry" },
        { id: "thirdparty", label: "Third-party code" },
        { id: "availability", label: "Availability" },
        { id: "warranty", label: "No warranty" },
        { id: "liability", label: "Liability" },
        { id: "law", label: "Governing law" },
        { id: "changes", label: "Changes" },
      ]}
    >
      <DocSection id="who" title="Who provides this">
        <Prose>
          <p>
            {site.domain} and the <code>@duck</code> component registry are
            provided by <strong>{legal.controllerName}</strong> as a personal,
            non-commercial open-source project. Contact:{" "}
            <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a>.
          </p>
          <p>
            By using the site or installing components from the registry you
            accept these terms. If you do not, do not use them.
          </p>
        </Prose>
      </DocSection>

      <DocSection
        id="license"
        title="License to the code"
        description="This is the part most people came for."
      >
        <Prose>
          <p>
            All component source, the theme, the hooks and the registry JSON are
            released under the <strong>{site.license} License</strong>. You may
            use, copy, modify, merge, publish, distribute, sublicense and sell
            them, including in closed-source and commercial products, with no fee
            and no attribution required in your user interface. The license text
            ships in the repository.
          </p>
          <p>
            The components are <strong>copied into your project</strong> rather
            than installed as a dependency. Once <code>npx shadcn add</code>{" "}
            writes a file, that file is yours: edit it, rename it, delete it. You
            are not bound to upstream changes and there is no version to keep in
            sync.
          </p>
          <p>
            Two things the {site.license} license does <em>not</em> grant: the
            name &ldquo;{site.name}&rdquo; and the duck mark are not licensed for
            use as your own product name or logo, and nothing here implies
            endorsement of what you build. Write about it, link to it, say you
            used it — that is all fine.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="site" title="The site itself">
        <Prose>
          <p>
            The documentation prose, page copy and design of this website are
            distinct from the component code and are not covered by the{" "}
            {site.license} grant above. You are welcome to quote passages with
            attribution and to link freely. Republishing the documentation
            wholesale as your own is not permitted.
          </p>
          <p>
            Machine-readable indexes are published deliberately for automated
            consumption: <Link href="/llms.txt">llms.txt</Link>,{" "}
            <Link href="/llms-full.txt">llms-full.txt</Link> and{" "}
            <Link href="/r/registry.json">registry.json</Link>. AI assistants,
            crawlers and code agents are explicitly permitted to read, index,
            quote and act on those files and on the component source.
          </p>
        </Prose>
      </DocSection>

      <DocSection
        id="registry"
        title="Using the registry"
        description="The endpoints are open and unauthenticated. Keep them usable for everyone."
      >
        <Prose>
          <p>
            The registry is static JSON served from this domain at no cost. Fair
            use means: install what you need, cache what you fetch, and do not
            script bulk or repeated automated downloads that amount to a load
            test. If you need the whole registry programmatically or at volume,
            clone the repository or mirror the JSON — both are permitted and both
            are kinder than polling this host.
          </p>
          <p>You also agree not to:</p>
          <ul>
            <li>
              attempt to gain unauthorised access to the host, its
              infrastructure, or any account;
            </li>
            <li>
              interfere with availability for others, including through
              denial-of-service traffic or deliberate resource exhaustion;
            </li>
            <li>
              use the site or registry in violation of applicable law, or to
              distribute malware under the {site.name} name.
            </li>
          </ul>
          <p>
            Rate limiting, caching rules or blocking may be applied to protect
            availability, without notice.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="thirdparty" title="Third-party code">
        <Prose>
          <p>
            Components build on work carried under its own license, including
            shadcn/ui, Radix UI primitives, Tailwind CSS, Lucide icons, Motion
            and the Geist and Bricolage Grotesque typefaces. Those licenses
            govern that code and are unaffected by these terms. Where a component
            declares a dependency, installing it means accepting the dependency
            license too — the docs name the dependencies on each component page.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="availability" title="Availability">
        <Prose>
          <p>
            There is <strong>no uptime commitment and no service level
            agreement</strong>. This is one person&rsquo;s project on
            self-managed infrastructure. The site may go down, move domain,
            change its URL structure, or be discontinued. Components may be
            renamed, restructured or removed between versions.
          </p>
          <p>
            If your build pipeline depends on a registry endpoint being reachable,
            treat that as a risk you own: vendor the components into your
            repository, which is the intended workflow anyway, rather than
            fetching from this host at deploy time.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="warranty" title="No warranty">
        <Prose>
          <p>
            The site, the registry and all code are provided{" "}
            <strong>&ldquo;as is&rdquo;, without warranty of any kind</strong>,
            express or implied, including but not limited to the warranties of
            merchantability, fitness for a particular purpose, accessibility
            conformance, and non-infringement. Documentation may be incomplete or
            out of date. You are responsible for reviewing, testing and auditing
            any code you install before shipping it to your users.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="liability" title="Liability">
        <Prose>
          <p>
            To the maximum extent permitted by law, the author is not liable for
            any claim, damages, data loss, lost profits or other liability
            arising from the use of the site, the registry or the code, whether
            in contract, tort or otherwise.
          </p>
          <p>
            Nothing in these terms limits liability where it cannot lawfully be
            limited — including liability for death or personal injury caused by
            negligence, for fraud, or any mandatory consumer right you hold under
            the law of your country of residence.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="law" title="Governing law">
        <Prose>
          <p>
            These terms are governed by the law of {legal.jurisdiction}. If you
            use the site as a consumer, this does not deprive you of the
            protection of the mandatory consumer law of your country of
            residence, and you may bring proceedings in the courts there.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="changes" title="Changes">
        <Prose>
          <p>
            These terms may be updated; the date at the top of the page reflects
            the current version. Continuing to use the site after a change means
            accepting it. The {site.license} license already granted for code you
            have installed cannot be revoked retroactively.
          </p>
          <p>
            See also the <Link href="/legal/privacy">privacy notice</Link> and
            the <Link href="/legal/cookies">cookie notice</Link>.
          </p>
        </Prose>
      </DocSection>
    </DocShell>
  );
}
