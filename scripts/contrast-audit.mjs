// Contrast audit against the rendered page.
//
//   npm run preview &   →   node scripts/contrast-audit.mjs
//
// The app's palette was audited to 4.5:1 against flat surfaces, and this page
// puts a moving gradient behind some of it. A token being "audited" therefore
// proves nothing here — what matters is the pixel that actually ends up behind
// each glyph. So: paint every text node transparent, screenshot, and sample
// the real background inside each text box, worst pixel wins.
//
// Compares against WCAG 1.4.3 — 4.5:1 for normal text, 3:1 for large text
// (>=24px, or >=18.66px when bold).

import { chromium } from "playwright";

const BASE = process.env.AUDIT_URL || "http://localhost:4321/";
const VIEWS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];
const THEMES = ["light", "dark"];

const srgb = (v) => {
  v /= 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);

let failures = 0;
let checked = 0;

for (const v of VIEWS) {
  for (const theme of THEMES) {
    const ctx = await browser.newContext({
      viewport: { width: v.width, height: v.height },
      colorScheme: theme,
    });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: "networkidle" });

    // Reveal everything and settle the drifting blobs at a fixed frame, so a
    // run is reproducible and covers the whole document.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.evaluate(() => {
      document.querySelectorAll(".reveal").forEach((e) => e.classList.add("is-in"));
      document.querySelectorAll("img").forEach((i) => i.setAttribute("loading", "eager"));
    });
    await page.waitForTimeout(500);

    // Grow the viewport to the whole document instead of using fullPage
    // screenshots. fullPage re-lays-out at the document height internally, so
    // boxes measured at 1440×900 no longer line up with the pixels captured —
    // which is how the hero note came back reading a button's drop shadow
    // that is nowhere near it. One layout for both measurements.
    const docHeight = await page.evaluate(
      () => document.documentElement.scrollHeight,
    );
    await page.setViewportSize({ width: v.width, height: docHeight });
    await page.waitForTimeout(400);

    const targets = await page.evaluate(() => {
      const out = [];
      const walk = (node) => {
        for (const el of node.children) {
          const hasOwnText = [...el.childNodes].some(
            (n) => n.nodeType === 3 && n.textContent.trim().length > 1,
          );
          const cs = getComputedStyle(el);
          if (
            hasOwnText &&
            cs.visibility !== "hidden" &&
            cs.display !== "none" &&
            parseFloat(cs.opacity) > 0.1
          ) {
            const b = el.getBoundingClientRect();
            if (b.width > 4 && b.height > 4) {
              const size = parseFloat(cs.fontSize);
              const weight = parseInt(cs.fontWeight, 10) || 400;
              out.push({
                sel:
                  el.tagName.toLowerCase() +
                  (el.className && typeof el.className === "string"
                    ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
                    : ""),
                text: el.textContent.trim().slice(0, 40),
                color: cs.color,
                size,
                large: size >= 24 || (size >= 18.66 && weight >= 700),
                box: {
                  x: b.x + scrollX,
                  y: b.y + scrollY,
                  w: b.width,
                  h: b.height,
                },
              });
            }
          }
          walk(el);
        }
      };
      walk(document.body);
      return out;
    });

    // Second pass: same layout, no glyphs. Whatever is left inside a text box
    // is exactly what that text is sitting on.
    await page.addStyleTag({
      content: `*, *::before, *::after { color: transparent !important;
                 text-decoration-color: transparent !important; }`,
    });
    await page.waitForTimeout(200);
    const shot = await page.screenshot();
    const sharp = (await import("sharp")).default;
    const { data, info } = await sharp(shot)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const at = (x, y) => {
      const o = (y * info.width + x) * info.channels;
      return [data[o], data[o + 1], data[o + 2]];
    };

    for (const t of targets) {
      const fg = t.color.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);
      let worst = Infinity;
      let worstBg = null;
      // Sample the middle of the box, not its edges. A border-box includes
      // the element's own rounded corners (where the page shows through) and
      // any border strip, and worst-pixel-wins would report those instead of
      // what is behind the glyphs — a filled pill button reads as 1.08:1 off
      // its own corner. Insetting keeps the sample on the painted surface.
      const insetX = Math.min(t.box.w * 0.15, 18);
      const insetY = Math.min(t.box.h * 0.3, 18);
      const x0 = Math.max(0, Math.round(t.box.x + insetX));
      const y0 = Math.max(0, Math.round(t.box.y + insetY));
      const x1 = Math.min(info.width - 1, Math.round(t.box.x + t.box.w - insetX));
      const y1 = Math.min(info.height - 1, Math.round(t.box.y + t.box.h - insetY));
      if (x1 <= x0 || y1 <= y0) continue;
      const stepX = Math.max(1, Math.floor((x1 - x0) / 24));
      const stepY = Math.max(1, Math.floor((y1 - y0) / 12));
      for (let y = y0; y <= y1; y += stepY) {
        for (let x = x0; x <= x1; x += stepX) {
          const bg = at(x, y);
          const r = ratio(fg, bg);
          if (r < worst) {
            worst = r;
            worstBg = bg;
          }
        }
      }
      // Epsilon: --color-info-dark lands on exactly 4.50 against the page by
      // the app's own audit, and float noise otherwise reports it as 4.4996.
      const need = t.large ? 3 : 4.5;
      checked++;
      if (worst < need - 0.01) {
        failures++;
        const hex = (c) =>
          "#" + c.map((n) => n.toString(16).padStart(2, "0")).join("");
        console.log(
          `FAIL ${v.name}/${theme}  ${worst.toFixed(2)}:1 (need ${need})  ` +
            `${t.sel}  fg ${hex(fg)} on ${hex(worstBg)}  "${t.text}"`,
        );
      }
    }

    await ctx.close();
  }
}

await browser.close();
console.log(`\n${checked} text elements checked · ${failures} failing`);
process.exit(failures ? 1 : 0);
