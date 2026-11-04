# Verification

The authoritative open/verified matrix is [ACCEPTANCE.md](ACCEPTANCE.md).

## Passing checks

- `pnpm lint`: ESLint passes.
- `pnpm typecheck`: application, Vite configuration, Playwright configuration and all test sources pass TypeScript checks.
- `pnpm test`: server-render checks pass for both locales, dictionary key coverage, fragment destinations, primary heading, skip navigation, supplied identity, missing/populated personal content and static artwork.
- `pnpm build`: production output builds successfully.
- `pnpm test:e2e:list`: 22 browser scenarios are discoverable; **listing is not execution**.
- Performance suite discovery: one desktop five-minute memory/FPS scenario; **not executed**.
- Production HTML does not eagerly preload Three.js or the scene runtime.
- Self-hosted font and software license notices are included in the static output.
- A scoped credential-pattern scan checks working-tree files and all historical Git blobs; see `reports/credential-scan.json`. This does not establish exhaustive security review.

## Unverified

Lighthouse, axe browser runs, keyboard behavior, visual quality, responsive clipping, live WebGL, pause/resume, runtime disposal, context-loss fallback, print pagination, desktop FPS, five-minute memory stability and fresh-machine setup timing are unverified. The supported browser tooling and Sites preview helper are unavailable; no browser was installed and no unsupported browser-control path was used.

The optional Three.js chunk is approximately 181 KB gzip; Vite's default uncompressed-size advisory remains. The dependency is deferred and omitted entirely from CLEAN and reduced-motion rendering paths.

Only the name and creative title were supplied. Section 4, the inspiration reference and the feature brief for minimap/gallery/phone/modals remain unavailable. No acceptance-complete claim is made.
