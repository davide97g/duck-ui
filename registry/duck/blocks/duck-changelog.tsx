import * as React from "react";

import { cn } from "@/lib/utils";
import { DuckProse } from "@/components/ui/duck-prose";
import { DuckSectionMarker } from "@/components/ui/duck-section-marker";
import { DuckTimeline, DuckTimelineItem } from "@/components/ui/duck-timeline";
import { HoloBadge } from "@/components/ui/holo-badge";

/**
 * DuckChangelog — releases down a spine, each one linkable.
 *
 * The timeline, the prose surface and the marker all shipped with the long-form
 * layer; a changelog is what you get when they are told about each other. Four
 * decisions come with that.
 *
 * **A release is an anchor.** The id comes from the version, slugified — not from
 * `useId` — because the whole point of a changelog entry is that someone can send
 * `/changelog#v1-2-0` and land on it. That also makes this block a server
 * component: nothing here needs the client, and a page of releases should not ship
 * JavaScript to be read.
 *
 * **The date is machine-readable and printed in UTC.** A `<time dateTime>` gives
 * the crawler the ISO value; the visible text is formatted with an explicit
 * `timeZone: "UTC"`, because a formatter that follows the reader's zone renders
 * one string on the server and a different one in the browser, which is a
 * hydration mismatch that only shows up for readers a day away from you.
 *
 * **One entry is the latest.** The newest gets the lit node and the badge, and
 * nothing else does — a list where every row is highlighted has highlighted
 * nothing.
 *
 * **The body is prose, not a schema.** A release note is written, so `body` takes
 * whatever the MDX pipeline hands over and DuckProse styles it from the tokens.
 * `highlights` is there for the scannable half, since most readers want the four
 * lines before they want the four paragraphs.
 */
export interface DuckChangelogRelease {
  /** Becomes the anchor: "1.2.0" gives #1-2-0. Also the heading. */
  version: string;
  /** ISO date. Printed in UTC and exposed through <time dateTime>. */
  date?: string;
  title?: React.ReactNode;
  /** Taxonomy: "breaking", "feat", "fix". Rendered as tags. */
  tags?: string[];
  /** The scannable half — one line each. */
  highlights?: React.ReactNode[];
  /** The written half. MDX output drops straight in. */
  body?: React.ReactNode;
}

export interface DuckChangelogProps
  extends Omit<React.ComponentProps<"section">, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** The HUD label above the heading. */
  eyebrow?: React.ReactNode;
  releases: DuckChangelogRelease[];
  /** Prefix for the anchors, when a page carries two of these. */
  idPrefix?: string;
  /** Locale for the printed date. The time zone stays UTC either way. */
  locale?: string;
  latestLabel?: string;
  /** Heading level of a release. Drop to h3 under an existing h2. */
  headingLevel?: "h2" | "h3";
}

/** "1.2.0" → "1-2-0", "v2 (beta)" → "v2-beta". */
function slugify(version: string) {
  return version
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * UTC, always. A formatter that follows the reader's zone prints one string on the
 * server and another in the browser for anyone a day away.
 */
function formatDate(iso: string, locale: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function DuckChangelog({
  className,
  title,
  description,
  eyebrow,
  releases,
  idPrefix = "",
  locale = "en-GB",
  latestLabel = "latest",
  headingLevel = "h2",
  ...props
}: DuckChangelogProps) {
  const Heading = headingLevel;

  return (
    <section
      data-slot="duck-changelog"
      className={cn(
        "@container mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:py-24",
        className
      )}
      {...props}
    >
      {(eyebrow || title || description) && (
        <div className="mb-10 flex flex-col gap-4">
          {eyebrow && <DuckSectionMarker>{eyebrow}</DuckSectionMarker>}
          {title && (
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-balance">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-pretty text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      <DuckTimeline>
        {releases.map((release, index) => {
          const id = `${idPrefix}${slugify(release.version)}`;
          const latest = index === 0;

          return (
            <DuckTimelineItem
              key={release.version}
              // The newest node is lit and no other one is. A list where every
              // row is highlighted has highlighted nothing.
              active={latest}
              when={
                release.date ? (
                  <time dateTime={release.date}>
                    {formatDate(release.date, locale)}
                  </time>
                ) : undefined
              }
              className="pb-10"
            >
              {/* An article, named by its own heading, so a reader can jump
                  between releases and know where they landed. */}
              <article aria-labelledby={`${id}-title`} className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Heading
                    id={`${id}-title`}
                    className="font-display text-xl font-extrabold tracking-tight"
                  >
                    {/* The anchor is on the heading, and the link is the version
                        itself — the thing anyone would copy. */}
                    <a href={`#${id}-title`} className="hover:text-primary">
                      {release.version}
                    </a>
                    {release.title && (
                      <span className="ml-2 font-semibold text-muted-foreground">
                        {release.title}
                      </span>
                    )}
                  </Heading>
                  {latest && (
                    <HoloBadge variant="primary" shape="tag">
                      {latestLabel}
                    </HoloBadge>
                  )}
                  {release.tags?.map((tag) => (
                    <HoloBadge key={tag} variant="muted" shape="tag">
                      {tag}
                    </HoloBadge>
                  ))}
                </div>

                {release.highlights && release.highlights.length > 0 && (
                  <ul className="flex flex-col gap-1.5 text-sm">
                    {release.highlights.map((line, position) => (
                      <li
                        key={position}
                        className="relative pl-4 text-pretty before:absolute before:top-[0.55em] before:left-0 before:size-1.5 before:rounded-full before:bg-primary"
                      >
                        {line}
                      </li>
                    ))}
                  </ul>
                )}

                {release.body && (
                  <DuckProse measure="wide" className="text-sm">
                    {release.body}
                  </DuckProse>
                )}
              </article>
            </DuckTimelineItem>
          );
        })}
      </DuckTimeline>
    </section>
  );
}

export { DuckChangelog, slugify };
