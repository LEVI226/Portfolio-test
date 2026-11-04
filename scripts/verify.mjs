import assert from "node:assert/strict";
import { createServer } from "vite";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
const server = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false },
  optimizeDeps: { noDiscovery: true, include: [] },
  appType: "custom",
});
try {
  const { messages } = await server.ssrLoadModule("/src/content/i18n.ts");
  assert.deepEqual(
    Object.keys(messages.en).sort(),
    Object.keys(messages.fr).sort(),
  );
  const { default: App } = await server.ssrLoadModule("/src/App.tsx");
  const html = renderToStaticMarkup(createElement(App));
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g))
    assert.ok(ids.has(target), `Missing navigation target: ${target}`);
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, "One primary heading");
  assert.ok(html.includes("Skip to content"));
  assert.ok(html.includes("Yannick Ulrich Levi OUEDRAOGO"));
  assert.ok(html.includes("Contact details forthcoming."));
  assert.ok(html.includes("Selected work, forthcoming."));
  assert.ok(!/href="(?:#|mailto:)"/.test(html), "No empty contact actions");
  assert.ok(
    html.includes("signal-fallback"),
    "Static artwork renders without WebGL",
  );
  const { portfolio } = await server.ssrLoadModule("/src/content/portfolio.ts");
  portfolio.biography = {
    en: "Verified biography fixture.",
    fr: "Biographie vérifiée.",
  };
  portfolio.email = "portfolio@example.com";
  portfolio.projects = [
    {
      title: { en: "Project fixture", fr: "Projet de test" },
      description: {
        en: "Approved project fixture.",
        fr: "Description vérifiée.",
      },
      url: "https://example.com/project",
    },
  ];
  const populated = renderToStaticMarkup(createElement(App));
  assert.ok(populated.includes("Verified biography fixture."));
  assert.ok(populated.includes('href="mailto:portfolio@example.com"'));
  assert.ok(populated.includes('href="https://example.com/project"'));
  assert.ok(!populated.includes("Selected work, forthcoming."));
  const french = renderToStaticMarkup(
    createElement(App, { initialLocale: "fr" }),
  );
  assert.ok(french.includes("Biographie vérifiée."));
  assert.ok(french.includes("Projet de test"));
  assert.ok(french.includes("Vue épurée"));
  assert.ok(french.includes("Aller au contenu"));
  console.log(
    "PASS: server render, navigation targets, primary heading, missing and populated content states, static artwork.",
  );
} finally {
  await server.close();
}
