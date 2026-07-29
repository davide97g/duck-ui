import type { Metadata } from "next";
import Link from "next/link";

import { legal, legalNav, site } from "@/lib/site";
import { DocShell, Prose } from "@/components/docs/doc-shell";

export const metadata: Metadata = {
  title: "Legal",
  description:
    "Terms of use, privacy notice and cookie notice for duck/ui. No analytics, no cookies, MIT-licensed code.",
  alternates: { canonical: "/legal" },
};

const summaries: Record<string, string> = {
  "/legal/terms":
    "MIT licence on all component code, commercial use included. No warranty, no uptime commitment, and what fair use of the public registry means.",
  "/legal/privacy":
    "No analytics and no accounts. Covers the only processing that happens: server access logs, and the requests your tooling makes to the registry.",
  "/legal/cookies":
    "This site sets no cookies. The two functional browser-storage keys that exist instead, and why no consent banner is required.",
};

export default function LegalIndexPage() {
  return (
    <DocShell
      title="Legal"
      description="Three short documents. The summary is that the code is yours under the MIT licence and nothing here tracks you."
      pathname="/legal"
      docType="WebPage"
    >
      <Prose>
        <p>
          {site.name} is a personal open-source project by{" "}
          <strong>{legal.controllerName}</strong>. Questions about any of the
          below, including data-protection requests, go to{" "}
          <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a>.
        </p>
      </Prose>

      <ul className="grid gap-3 sm:grid-cols-2">
        {legalNav.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex h-full flex-col gap-2 rounded-xl border-2 border-border p-5 transition-colors hover:border-primary/50"
            >
              <span className="font-display font-bold group-hover:text-primary">
                {item.label}
              </span>
              <span className="text-sm text-pretty text-muted-foreground">
                {summaries[item.href]}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </DocShell>
  );
}
