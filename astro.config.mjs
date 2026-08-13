// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Five static Spanish pages. Still no adapter, no SSR and no data fetching —
// nothing on the site needs a server. What changed is that it is no longer one
// document, so the parts that assumed a single route had to go.
export default defineConfig({
  site: "https://simplemanagepro.com",
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
