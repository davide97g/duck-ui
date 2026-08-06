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
const namesOfType = (type) =>
  registry.items.filter((item) => item.type === type).map((item) => item.name);
const registryUi = namesOfType("registry:ui");
const registryBlocks = namesOfType("registry:block");

// registry-docs.ts holds two arrays with identical shapes. Split the file so a
// block's slug never counts as a component's.
const docsSource = readFileSync("lib/registry-docs.ts", "utf8");
const blocksStart = docsSource.indexOf("export const blocks");
if (blocksStart === -1) fail("lib/registry-docs.ts: no `export const blocks`");
const slugsIn = (source) =>
  [...source.matchAll(/^\s{4}slug: "([^"]+)",$/gm)].map((match) => match[1]);
const docSlugs = slugsIn(docsSource.slice(0, blocksStart));
const blockDocSlugs = slugsIn(docsSource.slice(blocksStart));

const previewsIn = (dir) =>
  readdirSync(dir)
    .filter((file) => file.endsWith(".tsx") && file !== "index.tsx")
    .map((file) => file.replace(/\.tsx$/, ""));
const previewFiles = previewsIn("components/previews");
const blockPreviewFiles = previewsIn("components/previews/blocks");

// Single-word slugs are valid identifiers, so they appear as bare keys.
const keysIn = (path) =>
  [
    ...readFileSync(path, "utf8").matchAll(/^\s{2}"?([a-z0-9][a-z0-9-]*)"?:/gm),
  ].map((match) => match[1]);
const barrelKeys = keysIn("components/previews/index.tsx");
const blockBarrelKeys = keysIn("components/previews/blocks/index.tsx");

/* ---- set equality, reported per direction so the fix is obvious ---- */

const compare = (aName, a, bName, b) => {
  const bSet = new Set(b);
  const missing = a.filter((slug) => !bSet.has(slug));
  if (missing.length) {
    fail(`in ${aName} but not ${bName}: ${missing.join(", ")}`);
  }
};

const componentSources = [
  ["registry.json", registryUi],
  ["lib/registry-docs.ts", docSlugs],
  ["components/previews/*.tsx", previewFiles],
  ["previews barrel", barrelKeys],
];

const blockSources = [
  ["registry.json blocks", registryBlocks],
  ["lib/registry-docs.ts blocks", blockDocSlugs],
  ["components/previews/blocks/*.tsx", blockPreviewFiles],
  ["block previews barrel", blockBarrelKeys],
];

for (const sources of [componentSources, blockSources]) {
  for (const [aName, a] of sources) {
    for (const [bName, b] of sources) {
      if (aName !== bName) compare(aName, a, bName, b);
    }
  }
}

/* ---- the ordering invariant: registry.json items track registry-docs ---- */

if (registryUi.length === docSlugs.length) {
  const outOfOrder = registryUi.findIndex((slug, i) => slug !== docSlugs[i]);
  if (outOfOrder !== -1) {
    fail(
      `order diverges at index ${outOfOrder}: registry.json has "${registryUi[outOfOrder]}", ` +
        `lib/registry-docs.ts has "${docSlugs[outOfOrder]}". Keep both lists in the same order.`
    );
  }
}

if (registryBlocks.length === blockDocSlugs.length) {
  const outOfOrder = registryBlocks.findIndex(
    (slug, i) => slug !== blockDocSlugs[i]
  );
  if (outOfOrder !== -1) {
    fail(
      `block order diverges at index ${outOfOrder}: registry.json has "${registryBlocks[outOfOrder]}", ` +
        `lib/registry-docs.ts has "${blockDocSlugs[outOfOrder]}". Keep both lists in the same order.`
    );
  }
}

/* ---- the README tables list every item ---- */

// The README is the only inventory written by hand rather than generated, and
// it is the first thing a visitor reads. It drifted once already: the block
// layer shipped twelve blocks and the table kept listing five. Names only —
// what the row *says* stays prose.
const readme = readFileSync("README.md", "utf8");
const undocumented = registry.items
  .filter((item) => !readme.includes(`\`${item.name}\``))
  .map((item) => item.name);
if (undocumented.length) {
  fail(`in registry.json but not README.md: ${undocumented.join(", ")}`);
}

/* ---- the skill knows every component and block ---- */

// SKILL.md is what an assistant reads instead of the docs site, so a component
// missing from it is a component the assistant will not use — or will invent
// props for. It names exports, not slugs, so match either spelling.
const skill = readFileSync("skill/duck-ui/SKILL.md", "utf8");
const pascal = (name) =>
  name.replace(/(^|-)([a-z])/g, (_, __, letter) => letter.toUpperCase());
const unskilled = [...registryUi, ...registryBlocks].filter(
  (name) => !skill.includes(pascal(name)) && !skill.includes(name)
);
if (unskilled.length) {
  fail(`in registry.json but not skill/duck-ui/SKILL.md: ${unskilled.join(", ")}`);
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
  `registry in sync — ${registryUi.length} ui items, ${registryBlocks.length} blocks, ` +
    `${registry.items.length} items total.`
);
