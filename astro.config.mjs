// @ts-check
import { defineConfig } from "astro/config";

// One static page in Spanish. No adapter, no SSR: the whole site is a document
// plus images, and everything dynamic on it (the demo, WhatsApp) lives on
// another origin.
export default defineConfig({
  site: "https://simplemanagepro.com",
  compressHTML: true,
  build: {
    inlineStylesheets: "always",
  },
});
