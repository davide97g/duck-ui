import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { Analytics } from "@/components/site/analytics";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { JsonLd, siteGraph } from "@/components/seo/structured-data";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  axes: ["opsz", "wdth"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}, ${site.tagline.toLowerCase()}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "shadcn registry",
    "design system",
    "react components",
    "tailwind v4",
    "holographic ui",
    "duck ui",
  ],
  authors: [{ name: site.author.name, url: site.author.url }],
  creator: site.author.name,
  publisher: site.author.name,
  applicationName: site.name,
  category: "technology",
  alternates: {
    canonical: "/",
    // Advertises the machine-readable index in <head>, which is how the
    // llms.txt convention expects agents to discover it without guessing.
    types: {
      "text/plain": [
        { url: "/llms.txt", title: `${site.name} index for AI assistants` },
      ],
      "application/json": [
        { url: "/r/registry.json", title: `${site.name} shadcn registry` },
      ],
    },
  },
  openGraph: {
    type: "website",
    url: site.url,
    title: `${site.name}, ${site.tagline.toLowerCase()}`,
    description: site.description,
    siteName: site.name,
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}, ${site.tagline.toLowerCase()}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Let Google show full text snippets and large image previews. The
      // defaults are conservative and truncate the description in SERPs.
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1e" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        bricolage.variable,
        GeistSans.variable,
        GeistMono.variable,
        "scheme-light dark:scheme-dark"
      )}
    >
      <body className="min-h-dvh bg-background font-sans antialiased">
        <JsonLd data={siteGraph()} />
        <Analytics />
        <Providers>
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:font-semibold focus:text-primary-foreground"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="content">{children}</main>
          <SiteFooter />
          <div aria-hidden className="grain" />
        </Providers>
      </body>
    </html>
  );
}
