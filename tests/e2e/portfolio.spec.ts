import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("keyboard navigation, mode and locale controls", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  const clean = page.getByRole("button", { name: "Clean view" });
  await clean.focus();
  await page.keyboard.press("Space");
  await expect(clean).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".artwork")).toHaveCount(0);
  await page.getByRole("button", { name: "FR", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(
    page.getByText("Coordonnées à venir.", { exact: true }).first(),
  ).toBeVisible();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await expect(
    page.getByRole("button", { name: "Vue épurée" }),
  ).toHaveAttribute("aria-pressed", "true");
});
for (const locale of ["en", "fr"] as const) {
  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    test(`${locale}: no overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      if (locale === "fr")
        await page.getByRole("button", { name: "FR", exact: true }).click();
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        )
        .toBe(true);
      for (const heading of await page
        .locator("main h1,main h2,main h3")
        .all()) {
        const box = await heading.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
      }
    });
  }
}
for (const locale of ["en", "fr"] as const) {
  for (const clean of [false, true]) {
    test(`axe ${locale} clean=${clean}`, async ({ page }) => {
      await page.goto("/");
      if (locale === "fr")
        await page.getByRole("button", { name: "FR", exact: true }).click();
      if (clean)
        await page
          .getByRole("button", {
            name: locale === "fr" ? "Vue épurée" : "Clean view",
          })
          .click();
      const results = await new AxeBuilder({ page }).analyze();
      expect(
        results.violations.filter((v) =>
          ["serious", "critical"].includes(v.impact ?? ""),
        ),
      ).toEqual([]);
    });
  }
}
test("reduced motion uses static artwork without 3D requests", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const sceneRequests: string[] = [];
  page.on("request", (r) => {
    if (/three-|scene-runtime-|SignalScene-/.test(r.url()))
      sceneRequests.push(r.url());
  });
  await page.goto("/");
  await expect(page.locator(".signal-fallback")).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Pause sculpture animation" }),
  ).toHaveCount(0);
  expect(sceneRequests).toEqual([]);
});
test("WebGL unavailable retains usable page and static artwork", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      ...args: Parameters<typeof original>
    ) {
      if (String(args[0]).startsWith("webgl")) return null;
      return original.apply(this, args);
    } as typeof original;
  });
  await page.goto("/");
  await expect(page.locator(".signal-fallback")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Explore the portfolio" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Contact ↗", exact: true }).click();
  await expect(page).toHaveURL(/#contact$/);
});
test("print contains only supplied identity and CV placeholders", async ({
  page,
}) => {
  await page.goto("/");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("main")).toBeHidden();
  await expect(page.locator(".print-cv")).toBeVisible();
  await expect(page.locator(".print-cv h2")).toHaveText(
    "Yannick Ulrich Levi OUEDRAOGO",
  );
  await page.pdf({
    path: "test-results/cv.pdf",
    format: "A4",
    preferCSSPageSize: true,
  });
});
test("GPU buffers are released when CLEAN mode unmounts the scene", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const stats = { created: 0, deleted: 0 };
    Object.assign(window, { gpuStats: stats });
    for (const type of [WebGLRenderingContext, WebGL2RenderingContext]) {
      const create = type.prototype.createBuffer,
        dispose = type.prototype.deleteBuffer;
      type.prototype.createBuffer = function () {
        stats.created++;
        return create.call(this);
      };
      type.prototype.deleteBuffer = function (buffer) {
        stats.deleted++;
        return dispose.call(this, buffer);
      };
    }
  });
  await page.goto("/");
  await expect(page.locator("canvas")).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => Reflect.get(window, "gpuStats").created))
    .toBeGreaterThan(0);
  await page.getByRole("button", { name: "Clean view" }).click();
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect
    .poll(() => page.evaluate(() => Reflect.get(window, "gpuStats").deleted))
    .toBeGreaterThan(0);
});

test("pause and resume the interactive sculpture using the keyboard", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("canvas")).toBeVisible();
  const pause = page.getByRole("button", { name: "Pause sculpture animation" });
  await pause.focus();
  await page.keyboard.press("Space");
  const resume = page.getByRole("button", {
    name: "Resume sculpture animation",
  });
  await expect(resume).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Space");
  await expect(pause).toHaveAttribute("aria-pressed", "false");
});
