import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";

/**
 * Flat config using the ESLint CLI. `next lint` is deprecated in Next 15 and
 * gone in 16; it also prompted interactively when no config existed, so
 * `pnpm lint` could never run unattended.
 *
 * eslint-config-next still ships eslintrc-style presets, hence FlatCompat.
 */
const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const config = [
  {
    ignores: [
      ".next/**",
      ".next-probe/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "public/**",
      "next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Unused args are often there to document a signature; allow the
      // underscore convention rather than forcing deletion.
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    // registry/ is published source that consumers copy into their own repos,
    // where the import aliases resolve differently. Lint it for correctness but
    // do not enforce this app's resolution rules on it.
    files: ["registry/**/*.{ts,tsx}"],
    rules: {
      "import/no-unresolved": "off",
      // Registry components render a plain <img>: next/image does not exist for
      // a Vite or Remix consumer. The rule has to be silenced here rather than
      // with an inline pragma, because an `eslint-disable-next-line
      // @next/next/no-img-element` comment gets copied into the consumer's repo
      // and fails there as "Definition for rule ... was not found". Their lint
      // config is not ours to satisfy; not breaking it is the minimum.
      "@next/next/no-img-element": "off",
    },
  },
  {
    // components/previews/ re-exports registry sources for the docs site and
    // inherits the same constraint.
    files: ["components/previews/**/*.tsx"],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
];

export default config;
