// The crease must never cross type.
//
//   npm run preview &   →   node scripts/crease-check.mjs
//
// The fold is the page's signature: a diagonal where the sheet breaks, drawn
// behind the content. Behind is the operative word. A crease that passes under
// a line of copy or through a button stops reading as an edge and starts
// reading as a stray rule someone left in, and it has now happened three
// separate times — through the CTA row on an early home hero, through the lede
// when the home hero was rebuilt, and through "Ver la demo" on /portales.
//
// It keeps happening because the safe band is narrow, moves with the viewport,
// and differs per page: the crease is placed in percentages of a box whose
// height depends on how long that page's copy happens to wrap. Eyeballing one
// width proves nothing about the other six.
//
// So assert it instead. For every hero, at every width, this walks the text
// nodes and checks whether the crease line intersects any of their boxes.
//
// The home hero is the one deliberate exception: its crease is MEANT to pass
// behind the console, which is opaque and nearly the full width, so it is
// checked against copy only and the console is treated as cover.

import { chromium } from "playwright";
import { ROUTES, BASE_URL } from "./routes.mjs";

const WIDTHS = [390, 600, 760, 900, 1024, 1280, 1440, 1920];

/** A few px of grace: the crease is 0.6% of the fold tall, not a hairline. */
const MARGIN = 6;

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);

let failures = 0;

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({
      viewport: { width, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await page.goto(BASE_URL + route.path, { waitUntil: "networkidle" });

    const hits = await page.evaluate((margin) => {
      const hero = document.querySelector(".hero, .page-hero");
      if (!hero) return null;

      const fold = hero.querySelector(":scope > .fold");
      if (!fold) return null;

      const hb = hero.getBoundingClientRect();
      const fb = fold.getBoundingClientRect();
      const cs = getComputedStyle(hero);
      const pct = (name) => parseFloat(cs.getPropertyValue(name)) / 100;

      // The crease, in coordinates relative to the hero box.
      const yAtLeft = fb.top - hb.top + fb.height * pct("--fold-left");
      const yAtRight = fb.top - hb.top + fb.height * pct("--fold-right");

      const yAt = (x) => yAtLeft + ((yAtRight - yAtLeft) * x) / hb.width;

      // The console is opaque and covers the crease where it overlaps.
      const cover = hero.querySelector(".console-frame");
      const cb = cover
        ? (() => {
            const r = cover.getBoundingClientRect();
            return {
              x0: r.left - hb.left,
              x1: r.right - hb.left,
              y0: r.top - hb.top,
              y1: r.bottom - hb.top,
            };
          })()
        : null;

      const out = [];
      for (const el of hero.querySelectorAll("h1, h2, p, a, li, span, button")) {
        if (!el.textContent.trim()) continue;
        if (el.closest("[aria-hidden='true']")) continue;
        // Containers repeat their children's text; only measure leaves.
        if (el.querySelector("h1, h2, p, a, li, span, button")) continue;

        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;

        const x0 = r.left - hb.left;
        const x1 = r.right - hb.left;
        const y0 = r.top - hb.top;
        const y1 = r.bottom - hb.top;

        // Monotonic line: its range over [x0, x1] is bounded by its ends.
        const lo = Math.min(yAt(x0), yAt(x1)) - margin;
        const hi = Math.max(yAt(x0), yAt(x1)) + margin;
        if (hi < y0 || lo > y1) continue;

        // Covered by the console for this element's whole width?
        if (cb && x0 >= cb.x0 && x1 <= cb.x1 && lo >= cb.y0 && hi <= cb.y1) {
          continue;
        }

        out.push({
          text: el.textContent.trim().replace(/\s+/g, " ").slice(0, 46),
          box: [Math.round(y0), Math.round(y1)],
          crease: [Math.round(lo), Math.round(hi)],
        });
      }
      return out;
    }, MARGIN);

    await ctx.close();

    if (hits === null) {
      console.log(`${route.slug.padEnd(9)} ${String(width).padEnd(5)} no hero`);
      continue;
    }
    if (hits.length) {
      failures += hits.length;
      console.log(`${route.slug.padEnd(9)} ${String(width).padEnd(5)} CROSSES:`);
      for (const h of hits) {
        console.log(
          `  "${h.text}" box ${h.box[0]}..${h.box[1]}  crease ${h.crease[0]}..${h.crease[1]}`,
        );
      }
    } else {
      console.log(`${route.slug.padEnd(9)} ${String(width).padEnd(5)} clear`);
    }
  }
}

await browser.close();

if (failures) {
  console.error(`\n${failures} crossing(s). The crease must stay behind type.`);
  process.exit(1);
}
console.log("\nEvery hero clear at every width.");
