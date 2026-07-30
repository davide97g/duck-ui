/**
 * Every component is registered in four places that nothing links together:
 * registry.json, lib/registry-docs.ts, components/previews/<slug>.tsx and the
 * previews barrel. Miss the barrel and the docs page renders without a Preview
 * — no type error, no build failure, because [slug]/page.tsx guards with
 * `slug in previews` and then casts. This script is that missing link.
 *
 * Run: node scripts/check-registry-sync.mjs
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";

const problems = [];
const fail = (message) => problems.push(message);

/* ---- the four sources ---- */

const registry = JSON.parse(readFileSync("registry.json", "utf8"));
const registryUi = registry.items
  .filter((item) => item.type === "registry:ui")
  .map((item) => item.name);

const docsSource = readFileSync("lib/registry-docs.ts", "utf8");
const docSlugs = [...docsSource.matchAll(/^\s{4}slug: "([^"]+)",$/gm)].map(
  (match) => match[1]
);

const previewFiles = readdirSync("components/previews")
  .filter((file) => file.endsWith(".tsx") && file !== "index.tsx")
  .map((file) => file.replace(/\.tsx$/, ""));

// Single-word slugs are valid identifiers, so they appear as bare keys.
const barrelSource = readFileSync("components/previews/index.tsx", "utf8");
const barrelKeys = [
  ...barrelSource.matchAll(/^\s{2}"?([a-z0-9][a-z0-9-]*)"?:/gm),
].map((match) => match[1]);

/* ---- set equality, reported per direction so the fix is obvious ---- */

const compare = (aName, a, bName, b) => {
  const bSet = new Set(b);
  const missing = a.filter((slug) => !bSet.has(slug));
  if (missing.length) {
    fail(`in ${aName} but not ${bName}: ${missing.join(", ")}`);
  }
};

const sources = [
  ["registry.json", registryUi],
  ["lib/registry-docs.ts", docSlugs],
  ["components/previews/*.tsx", previewFiles],
  ["previews barrel", barrelKeys],
];

for (const [aName, a] of sources) {
  for (const [bName, b] of sources) {
    if (aName !== bName) compare(aName, a, bName, b);
  }
}

/* ---- the ordering invariant: registry.json ui items track registry-docs ---- */

if (registryUi.length === docSlugs.length) {
  const outOfOrder = registryUi.findIndex((slug, i) => slug !== docSlugs[i]);
  if (outOfOrder !== -1) {
    fail(
      `order diverges at index ${outOfOrder}: registry.json has "${registryUi[outOfOrder]}", ` +
        `lib/registry-docs.ts has "${docSlugs[outOfOrder]}". Keep both lists in the same order.`
    );
  }
}

/* ---- every declared file actually exists ---- */

for (const item of registry.items) {
  for (const file of item.files ?? []) {
    if (!existsSync(file.path)) {
      fail(`${item.name}: files[].path does not exist — ${file.path}`);
    }
  }
}

/* ---- report ---- */

if (problems.length) {
  console.error("registry is out of sync:\n");
  for (const problem of problems) console.error(`  ${problem}`);
  console.error("");
  process.exit(1);
}

console.log(
  `registry in sync — ${registryUi.length} ui items, ${registry.items.length} items total.`
);
