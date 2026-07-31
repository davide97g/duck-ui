# Analytics: what is measured, and how

Self-hosted [Umami](https://umami.is). Cookieless, no consent banner, no third-party processor. The privacy and cookie notices render from the same two environment variables that enable the script, so a build either runs analytics and says so, or does neither.

## Setup

**1. Run Umami next to the site on Dokploy.** New Docker Compose service, its own subdomain (`analytics.davideghiotto.it` or similar):

```yaml
services:
  umami:
    image: ghcr.io/umami-software/umami:postgresql-latest
    environment:
      DATABASE_URL: postgresql://umami:${UMAMI_DB_PASSWORD}@umami-db:5432/umami
      DATABASE_TYPE: postgresql
      APP_SECRET: ${UMAMI_APP_SECRET}
    depends_on: [umami-db]
  umami-db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: umami
      POSTGRES_USER: umami
      POSTGRES_PASSWORD: ${UMAMI_DB_PASSWORD}
    volumes: [umami-db-data:/var/lib/postgresql/data]
volumes:
  umami-db-data:
```

Change the default `admin` / `umami` login immediately.

**2. Add the website in the Umami dashboard**, copy its website id.

**3. Set both build arguments** in the duck/ui Dokploy service — build arguments, not runtime environment. `NEXT_PUBLIC_*` is inlined at build time, and the legal pages are prerendered from it. Setting these at runtime ships a privacy notice that says no analytics runs while the script loads.

```
NEXT_PUBLIC_UMAMI_URL=https://analytics.davideghiotto.it/script.js
NEXT_PUBLIC_UMAMI_WEBSITE_ID=<id from the dashboard>
```

**4. Rebuild.** Confirm on the deployed site: the privacy notice should describe Umami by name, and `/legal/cookies` should mention the tag. If the notices still say no analytics runs, the variables did not reach the build.

## Events

Three, all site-owned. Registry components are never instrumented — `CopyButton` ships to consumers' projects, so the counter is wrapped around it rather than added to it.

| Event | Fires when | Read it as |
|---|---|---|
| `install-copy` | The install pill is copied, with the command as a property | The closest thing to a conversion |
| `theme-css-copy` | Generated CSS is copied from the theme editor | Someone is actually taking the theme |
| `theme-share-copy` | A preset share link is copied | Someone is passing the editor to a colleague |

Add more through `track()` in `lib/analytics.ts`. It is a no-op when analytics is disabled or the script is blocked, so call sites never need a guard.

## Tracking AI-assistant referrals

This is the point of the whole exercise: knowing whether the `llms.txt`, the schema and the comparison pages are earning citations. Umami's referrer report is where it shows up. Watch for these hosts:

| Referrer | Source |
|---|---|
| `chatgpt.com`, `chat.openai.com` | ChatGPT, including its search mode |
| `perplexity.ai`, `www.perplexity.ai` | Perplexity |
| `claude.ai` | Claude |
| `gemini.google.com`, `bard.google.com` | Gemini |
| `copilot.microsoft.com`, `bing.com` | Copilot and Bing chat |
| `you.com`, `poe.com`, `phind.com` | Smaller answer engines |

Two caveats worth knowing before reading the numbers.

**Assistants that read a page do not appear here at all.** A crawler fetching `/llms.txt` runs no JavaScript, so Umami never sees it. Only a human clicking a citation shows up. Server access logs are the other half of the picture — grep them for `GPTBot`, `ClaudeBot`, `PerplexityBot`, `OAI-SearchBot` and friends to see what is being read rather than what is being clicked.

**AI referral volume is small and worth more than it looks.** Treat a handful of visits from `perplexity.ai` as a signal that a comparison page is being cited, not as a traffic channel.

## Measuring installs

Neither Umami nor any client-side tool can see an install: `npx shadcn add @duck/theme` fetches static JSON from `/r/*.json` with no browser involved. Three ways to get at it, in order of effort:

1. **Server access logs.** Count requests to `/r/*.json`, grouped by day and by user agent. The shadcn CLI identifies itself, which separates real installs from crawlers. This is the honest number.
2. **`install-copy` events.** A leading indicator, not an install count — it measures intent on the site, which is still the metric worth optimising because it is the one the site controls.
3. **GitHub stars and repo traffic.** Weakly correlated, freely available in the repo's insights.

## What to watch

| Question | Where |
|---|---|
| Are comparison pages earning their keep? | Page views on `/compare/*`, and the referrers reaching them |
| Is the FAQ being cited? | Referrals from AI hosts landing directly on `/` and `/compare/*` |
| Are assistants reading the site? | Access-log hits on `/llms.txt`, `/llms-full.txt`, `/r/registry.json` by AI user agent |
| Does the theme editor convert? | `/create` views, then `theme-css-copy` and `theme-share-copy` rate |
| Which docs page precedes an install copy? | Page path on `install-copy` events |
| Which directory listings work? | Referrer report, filtered to the Tier 0 targets in [distribution.md](distribution.md) |

Review monthly, not daily. At this volume, daily numbers are noise.
