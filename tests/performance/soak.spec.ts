import { expect, test } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";

test("desktop scene frame rate and five-minute retained-memory scrolling", async ({
  page,
  browserName,
  browser,
}) => {
  test.skip(
    browserName !== "chromium",
    "CDP is required for forced-GC heap sampling",
  );
  await page.addInitScript(() => {
    let draws = 0;
    Object.defineProperty(window, "signalDraws", { get: () => draws });
    const original = WebGL2RenderingContext.prototype.drawElements;
    WebGL2RenderingContext.prototype.drawElements = function (
      ...args: Parameters<typeof original>
    ) {
      draws++;
      return original.apply(this, args);
    };
  });
  await page.goto("/");
  await expect(page.locator("canvas")).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => Reflect.get(window, "signalDraws")))
    .toBeGreaterThan(0);
  const fps = await page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        let frames = 0,
          last = 0;
        const started = performance.now();
        function sample(now: number) {
          const draws = Reflect.get(window, "signalDraws");
          if (draws !== last) {
            frames++;
            last = draws;
          }
          if (now - started < 10_000) requestAnimationFrame(sample);
          else resolve(frames / ((now - started) / 1000));
        }
        requestAnimationFrame(sample);
      }),
  );
  const session = await page.context().newCDPSession(page);
  await session.send("Performance.enable");
  const heap = async () => {
    await session.send("HeapProfiler.collectGarbage");
    const { metrics } = await session.send("Performance.getMetrics");
    return metrics.find((m: { name: string }) => m.name === "JSHeapUsedSize")!
      .value as number;
  };
  // Warm every section before the baseline so the initial font/layout work is excluded.
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(1000);
  const samples = [{ minute: 0, bytes: await heap() }];
  for (let minute = 1; minute <= 5; minute++) {
    const deadline = Date.now() + 60_000;
    while (Date.now() < deadline) {
      await page.evaluate(() =>
        scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }),
      );
      await page.waitForTimeout(1500);
      await page.evaluate(() => scrollTo({ top: 0, behavior: "smooth" }));
      await page.waitForTimeout(1500);
    }
    samples.push({ minute, bytes: await heap() });
  }
  const final = samples.at(-1)!.bytes,
    baseline = samples[0].bytes;
  const report = {
    commit: execFileSync("git", ["rev-parse", "HEAD"], {
      encoding: "utf8",
    }).trim(),
    browser: browser.version(),
    viewport: { width: 1440, height: 900 },
    sceneFps: fps,
    forcedGcHeapSamples: samples,
    retainedGrowthBytes: final - baseline,
    notes:
      "Hardware and DevTools trace must accompany this report. Strict retained-growth check; inspect failures for browser noise rather than waiving them.",
  };
  await mkdir("docs/reports", { recursive: true });
  await writeFile(
    "docs/reports/performance-desktop.json",
    JSON.stringify(report, null, 2) + "\n",
  );
  expect(fps).toBeGreaterThanOrEqual(55);
  expect(
    final,
    "Retained heap increased after five minutes; inspect snapshots",
  ).toBeLessThanOrEqual(baseline);
});
