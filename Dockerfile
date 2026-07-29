# syntax=docker/dockerfile:1

# Relies on output: "standalone" in next.config.ts — the runner image copies a
# traced server bundle rather than the whole dependency tree.

FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm" \
    PATH="/pnpm:$PATH" \
    NEXT_TELEMETRY_DISABLED=1
RUN corepack enable

# ---- dependencies -----------------------------------------------------------
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ---- build ------------------------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* is inlined into the client bundle at build time, and the site
# origin also drives metadataBase, canonicals, the sitemap and the registry URL.
# It therefore has to be a build argument, not a runtime variable — setting it
# only in the Dokploy runtime environment would bake the default into the HTML.
ARG NEXT_PUBLIC_SITE_URL=https://duckui.davideghiotto.it
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

RUN pnpm build

# ---- runtime ----------------------------------------------------------------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# public/ carries the generated registry JSON and the duck mark.
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
