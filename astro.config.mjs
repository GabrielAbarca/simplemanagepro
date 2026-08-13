// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Five static Spanish pages. Still no adapter, no SSR and no data fetching —
// nothing on the site needs a server. What changed is that it is no longer one
// document, so the parts that assumed a single route had to go.
export default defineConfig({
  site: "https://simplemanagepro.com",
  // Directory build already serves every route with a trailing slash, and the
  // canonical/og/sitemap URLs derived from Astro.site carry one too. Declaring
  // it makes the policy explicit and keeps the breadcrumb item URLs (schema.ts)
  // in agreement instead of emitting the slashless form a crawler reads as a
  // second, redirecting URL.
  trailingSlash: "always",
  compressHTML: true,
  integrations: [sitemap()],
  build: {
    // Was "always", which is right for one page and wrong for five: the shared
    // tokens.css + base.css would be inlined into every document, so a visitor
    // moving between routes re-downloads the same CSS each time instead of
    // hitting a cached file. "auto" still inlines the small per-page chunks.
    inlineStylesheets: "auto",
  },
});
