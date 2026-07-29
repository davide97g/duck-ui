import {
  createHighlighter,
  type BundledLanguage,
  type Highlighter,
  type ThemeRegistrationRaw,
} from "shiki";

/**
 * Two Shiki themes cut from the duck/ui palette. Both are emitted at once and
 * swapped with CSS variables, so code blocks follow the site theme without a
 * client-side re-highlight.
 */

const duckDark: ThemeRegistrationRaw = {
  name: "duck-dark",
  type: "dark",
  colors: {
    "editor.background": "#1c1c20",
    "editor.foreground": "#f4f4f5",
  },
  settings: [
    { settings: { background: "#1c1c20", foreground: "#e8e8ec" } },
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#82828d", fontStyle: "italic" },
    },
    {
      scope: ["string", "constant.other.symbol", "string.quoted"],
      settings: { foreground: "#c3e86a" },
    },
    {
      scope: ["constant.numeric", "constant.language", "support.constant"],
      settings: { foreground: "#f0b45f" },
    },
    {
      scope: ["keyword", "storage", "storage.type", "keyword.control"],
      settings: { foreground: "#c58cf5" },
    },
    {
      scope: ["entity.name.function", "support.function", "meta.function-call"],
      settings: { foreground: "#6ad4bd" },
    },
    {
      scope: [
        "entity.name.type",
        "support.type",
        "support.class",
        "entity.other.inherited-class",
      ],
      settings: { foreground: "#7cbef8" },
    },
    {
      scope: ["variable", "meta.object-literal.key", "support.variable"],
      settings: { foreground: "#e8e8ec" },
    },
    { scope: ["entity.name.tag"], settings: { foreground: "#ff9095" } },
    {
      scope: ["entity.other.attribute-name"],
      settings: { foreground: "#f0b45f" },
    },
    {
      scope: ["punctuation", "meta.brace", "keyword.operator"],
      settings: { foreground: "#9a9aa4" },
    },
  ],
};

const duckLight: ThemeRegistrationRaw = {
  name: "duck-light",
  type: "light",
  colors: {
    "editor.background": "#ffffff",
    "editor.foreground": "#24242a",
  },
  settings: [
    { settings: { background: "#ffffff", foreground: "#24242a" } },
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#77777f", fontStyle: "italic" },
    },
    {
      scope: ["string", "constant.other.symbol", "string.quoted"],
      settings: { foreground: "#4d7a10" },
    },
    {
      scope: ["constant.numeric", "constant.language", "support.constant"],
      settings: { foreground: "#9a5b06" },
    },
    {
      scope: ["keyword", "storage", "storage.type", "keyword.control"],
      settings: { foreground: "#7b3bc4" },
    },
    {
      scope: ["entity.name.function", "support.function", "meta.function-call"],
      settings: { foreground: "#08736a" },
    },
    {
      scope: [
        "entity.name.type",
        "support.type",
        "support.class",
        "entity.other.inherited-class",
      ],
      settings: { foreground: "#1863b8" },
    },
    {
      scope: ["variable", "meta.object-literal.key", "support.variable"],
      settings: { foreground: "#24242a" },
    },
    { scope: ["entity.name.tag"], settings: { foreground: "#b32b3a" } },
    {
      scope: ["entity.other.attribute-name"],
      settings: { foreground: "#9a5b06" },
    },
    {
      scope: ["punctuation", "meta.brace", "keyword.operator"],
      settings: { foreground: "#6c6c76" },
    },
  ],
};

export const codeLanguages = [
  "tsx",
  "ts",
  "jsx",
  "js",
  "bash",
  "json",
  "jsonc",
  "css",
  "html",
  "markdown",
  "diff",
] as const satisfies readonly BundledLanguage[];

export type CodeLanguage = (typeof codeLanguages)[number];

const globalCache = globalThis as unknown as {
  __duckHighlighter?: Promise<Highlighter>;
};

function getHighlighter() {
  globalCache.__duckHighlighter ??= createHighlighter({
    themes: [duckDark, duckLight],
    langs: [...codeLanguages],
  });
  return globalCache.__duckHighlighter;
}

/** Highlight a snippet into dual-theme HTML. Server side only. */
export async function highlight(code: string, lang: CodeLanguage = "tsx") {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code.trim(), {
    lang,
    themes: { light: "duck-light", dark: "duck-dark" },
    defaultColor: false,
  });
}
