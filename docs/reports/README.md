# Browser reports — NOT RUN

No Lighthouse, axe, desktop FPS or five-minute memory result has been measured in this session. No scores or performance guarantees are claimed.

The managed environment does not expose the supported browser tool or Sites preview helper. The Sites skill directs skipping browser QA when that tool is unavailable. Playwright tests are supplied for a browser-capable environment; their presence is not a passing run.

Run on a production build served locally, outside the private hosting sign-in screen:

```sh
QA_BASE_URL=http://127.0.0.1:4173 pnpm test:e2e
pnpm lighthouse http://127.0.0.1:4173 --output=html --output=json --output-path=docs/reports/lighthouse-mobile --chrome-flags="--headless"
```

Lighthouse thresholds: performance 90, accessibility 95, best practices 95, SEO 95. Audit both EN and FR, with default mobile settings, and retain HTML/JSON. Record Chrome version, hardware, viewport and exact source commit.

`pnpm test:performance` supplies an automated five-minute scrolling/forced-GC check and a ten-second scene-draw FPS sample. It writes `performance-desktop.json` only when actually executed; the test fails on retained heap growth and requires at least 55 scene frames per second. This has NOT RUN here.

For desktop performance: use actual WebGL-capable hardware at 1440×900, record a five-minute DevTools performance trace while repeatedly scrolling the page, measure foreground animation near 60 fps, force GC before/after each sample and compare retained heaps across repeated runs. Capture renderer geometry/texture counts and disposal calls after CLEAN mode switches, reduced-motion changes, and context-loss fallback. A single growing heap sample is not proof of a leak or its absence. Save traces and results here. The Playwright GPU cleanup test checks buffer deletion but does not replace the five-minute soak test.

Print the generated `test-results/cv.pdf` and confirm one A4 page, clean text, and no clipping. Browser CI must retain test artifacts and report failures rather than treating skipped tests as passed.
