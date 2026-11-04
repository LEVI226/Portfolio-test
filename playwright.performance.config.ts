import { defineConfig } from "@playwright/test";
import base from "./playwright.config";
export default defineConfig({
  ...base,
  testDir: "./tests/performance",
  fullyParallel: false,
  workers: 1,
  timeout: 420_000,
  use: { ...base.use, viewport: { width: 1440, height: 900 } },
  reporter: [["list"]],
  outputDir: "test-results/performance",
});
