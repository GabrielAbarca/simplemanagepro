// Visual review harness. Not part of the build — run it against `npm run
// preview` to look at the page the way a visitor gets it.
//
//   npm run preview &   →   node scripts/review-shots.mjs
//
// Writes to /tmp; nothing here is committed.

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { selectedRoutes } from "./routes.mjs";

const OUT = process.env.REVIEW_OUT || "/tmp/review";
const BASE = process.env.REVIEW_URL || "http://localhost:4321";
const ROUTES = selectedRoutes();

const VIEWS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];
const THEMES = ["light", "dark"];

await mkdir(OUT, { recursive: true });
// Honour a pre-installed browser when the environment supplies one whose build
// number does not match what this playwright version would download.
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);

for (const route of ROUTES) {
  for (const v of VIEWS) {
    for (const theme of THEMES) {
      const ctx = await browser.newContext({
        viewport: { width: v.width, height: v.height },
        deviceScaleFactor: 2,
        colorScheme: theme,
      });
      const page = await ctx.newPage();
      await page.goto(BASE + route.path, { waitUntil: "networkidle" });

      // Lazy images below the fold never decode if the page is captured
      // without being scrolled, so a full-page shot comes out with blank
      // frames.
      await page.evaluate(async () => {
        document
          .querySelectorAll("img")
          .forEach((i) => i.setAttribute("loading", "eager"));
        // Deliberately unhurried. Coarse jumps here once skipped a section's
        // reveal entirely and made the capture look like a layout bug.
        await new Promise((r) => {
          let y = 0;
          const step = () => {
            y += 200;
            scrollTo(0, y);
            if (y < document.body.scrollHeight) setTimeout(step, 60);
            else {
              scrollTo(0, 0);
              setTimeout(r, 400);
            }
          };
          step();
        });
      });
      await page.waitForTimeout(700);

      const stem = `${OUT}/${route.slug}-${v.name}-${theme}`;
      await page.screenshot({ path: `${stem}-top.png` });
      await page.screenshot({ path: `${stem}-full.png`, fullPage: true });
      await ctx.close();
      console.log(`${route.slug} ${v.name}-${theme}`);
    }
  }
}

await browser.close();
