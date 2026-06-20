import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import astro from "eslint-plugin-astro";
import globals from "globals";

// Pragmatic rules for an existing codebase: genuine-bug rules stay errors;
// stylistic / gradual-cleanup rules are warnings so `npm run lint` is adoptable.
const pragmaticRules = {
  "@typescript-eslint/no-explicit-any": "off",
  "@typescript-eslint/no-empty-object-type": "off",
  "@typescript-eslint/no-unused-vars": [
    "warn",
    {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
      caughtErrors: "none",
      ignoreRestSiblings: true,
    },
  ],
  "no-empty": ["warn", { allowEmptyCatch: true }],
  "prefer-const": "warn",
  // The canonical Google Analytics gtag snippet intentionally uses `arguments`;
  // this stylistic rule isn't worth rewriting third-party analytics code for.
  "prefer-rest-params": "off",
};

// Flat config for an Astro 5 + React 19 + TypeScript project.
export default tseslint.config(
  {
    ignores: [
      "dist/**",
      ".astro/**",
      "node_modules/**",
      "public/**",
      "**/*.d.ts",
      // Standalone CommonJS dev/migration scripts — not part of the app.
      "update-urls.js",
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,

  // JS / TS / React source
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      ...pragmaticRules,
    },
  },

  // Astro components — same pragmatic rules. `export const prerender` is hoisted
  // by Astro and can legally sit after a `return` in the frontmatter, which the
  // core no-unreachable rule misreads, so disable it here.
  {
    files: ["**/*.astro"],
    rules: {
      ...pragmaticRules,
      "no-unreachable": "off",
    },
  },
);
