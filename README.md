# SIGNAL / OUAGA

A bilingual portfolio for Yannick Ulrich Levi OUEDRAOGO, with an optional procedural 3D sculpture, CLEAN view and an A4 print layout. Missing personal content is explicitly labeled. **Acceptance remains open:** see [docs/ACCEPTANCE.md](docs/ACCEPTANCE.md).

This public export contains the application, tests, credits and documentation. Private hosting configuration and the original private deployment history are intentionally excluded. No tokens or runtime secrets are required to run the site.

## Run and build

Install Node.js ≥22.13 and pnpm 11.25, then:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

To check and build:

```sh
pnpm check
```

This runs lint, typecheck, bilingual server-render tests and the production build. Output is `dist/`. `pnpm-workspace.yaml` permits esbuild's required install script.

## Browser acceptance

On a browser-capable machine:

```sh
pnpm exec playwright install chromium
pnpm build
pnpm test:e2e
pnpm test:performance
```

The browser test runner starts a production preview at `http://127.0.0.1:4173`; use `QA_BASE_URL` for an existing server. The performance test takes about six minutes on actual desktop WebGL hardware. Test artifacts go in `test-results/`.

With a production preview running:

```sh
pnpm lighthouse http://127.0.0.1:4173 --output=html --output=json --output-path=docs/reports/lighthouse-mobile --chrome-flags="--headless"
```

See [docs/reports/README.md](docs/reports/README.md) for measurement procedures. The browser suites compile and are discoverable, but have not run in the build environment. Lighthouse, axe, FPS, memory stability, responsive visuals and print pagination are unverified.

## Deploy

Run `pnpm check`, then publish the contents of `dist/` to a static host. No backend or runtime environment variables are needed. For a project URL under a subdirectory, configure Vite's `base` to that subdirectory before building. Hosting account setup is a prerequisite; the five-minute fresh-machine target has not been timed.

## Content and behavior

Edit `src/content/portfolio.ts` with verified content only. Biography and project titles/descriptions require both `en` and `fr`. Interface, metadata and print translations live in `src/content/i18n.ts`. The supplied name is the only populated personal fact; no projects, professional role, location, metrics or contact details have been invented.

EN/FR and CLEAN preferences persist locally when browser storage is available. CLEAN removes the artwork. Reduced motion and WebGL errors select inline SVG artwork. The scene pauses offscreen, in hidden tabs and through its pause control. Navigation uses native links and buttons. Print displays a CV layout with honest placeholders until verified CV data is supplied.

See [docs/TODO_USER.md](docs/TODO_USER.md), [docs/DECISIONS.md](docs/DECISIONS.md) and [CREDITS.md](CREDITS.md).
