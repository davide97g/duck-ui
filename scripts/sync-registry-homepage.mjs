/**
 * Keeps registry.json's `homepage` in step with NEXT_PUBLIC_SITE_URL before
 * `shadcn build` copies it into public/r/. Without this the origin lives in two
 * places and the published registry can claim a domain the site no longer uses
 * — which matters because assistants read that field to find the docs.
 */
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "registry.json";
const DEFAULT_URL = "https://duckui.davideghiotto.it";

const url = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_URL).replace(
  /\/+$/,
  ""
);

const raw = readFileSync(FILE, "utf8");
const registry = JSON.parse(raw);

if (registry.homepage === url) {
  console.log(`registry.json homepage already ${url}`);
  process.exit(0);
}

const previous = registry.homepage;
registry.homepage = url;

// Match the repo's existing formatting so the diff stays one line.
writeFileSync(FILE, `${JSON.stringify(registry, null, 2)}\n`);
console.log(`registry.json homepage ${previous} -> ${url}`);
