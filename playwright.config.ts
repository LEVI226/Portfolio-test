import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: "test-results/report", open: "never" }],
  ],
  use: {
    baseURL: process.env.QA_BASE_URL ?? "http://127.0.0.1:4173",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.QA_BASE_URL
    ? undefined
    : {
        command: "pnpm exec vite preview --host 127.0.0.1 --port 4173",
        url: "http://127.0.0.1:4173",
        reuseExistingServer: !process.env.CI,
      },
  outputDir: "test-results/artifacts",
});
