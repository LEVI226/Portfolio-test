import js from "@eslint/js";
import ts from "typescript-eslint";
import hooks from "eslint-plugin-react-hooks";
import globals from "globals";
export default ts.config(
  { ignores: ["dist", "test-results", "playwright-report"] },
  js.configs.recommended,
  {
    files: [
      "scripts/**/*.mjs",
      "*.js",
      "playwright.config.ts",
      "playwright.performance.config.ts",
      "tests/performance/**/*.ts",
    ],
    languageOptions: { globals: globals.node },
  },
  ...ts.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}", "tests/**/*.ts"],
    languageOptions: { globals: globals.browser },
    plugins: { "react-hooks": hooks },
    rules: hooks.configs.recommended.rules,
  },
);
