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
import { selectedRoutes, BASE_URL } from "./routes.mjs";

const BASE = process.env.AUDIT_URL || BASE_URL;
const VIEWS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];
const THEMES = ["light", "dark"];

// Flattened rather than nested three deep: every route is audited at every
// viewport in both themes, and the body stays at one level of indentation.
const MATRIX = selectedRoutes().flatMap((route) =>
  VIEWS.flatMap((v) => THEMES.map((theme) => ({ route, v, theme }))),
);

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

for (const { route, v, theme } of MATRIX) {
  const ctx = await browser.newContext({
    viewport: { width: v.width, height: v.height },
    colorScheme: theme,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + route.path, { waitUntil: "networkidle" });

  // Reveal everything and settle the drifting blobs at a fixed frame, so a
  // run is reproducible and covers the whole document.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => {
    document.querySelectorAll(".reveal").forEach((e) => e.classList.add("is-in"));
    document.querySelectorAll("img").forEach((i) => i.setAttribute("loading", "eager"));
  });
  await page.waitForTimeout(500);

  // Freeze anything sized to the viewport BEFORE growing it.
  //
  // The grow below sets the viewport to the document height so that one layout
  // serves both the measurement and the screenshot. That silently breaks any
  // element sized in viewport units, and the home hero is now
  // `calc(100svh - var(--header-h))`: at a 5221px "viewport" it became a
  // 5157px hero, so the audit measured a page no visitor will ever see. The
  // hero wash lands somewhere else entirely at that height, which is how the
  // eyebrow came back at 4.48:1 against a background it never actually sits
  // on, while roughly 70 elements per pass fell out of the run.
  //
  // Pin the hero to the height it really had at the real viewport. Injected
  // before pass 1 so both passes still see one layout.
  // The fold is pinned as well as the hero. It carries its own
  // `height: calc(100svh - var(--header-h))` so that its clip-path percentages
  // stay percentages of the FIRST SCREEN rather than of a hero that now runs
  // past it — which means it balloons under the grow exactly like the hero did,
  // and the wash slides out from under the copy it is supposed to sit behind.
  const frozen = await page.evaluate(() => {
    const box = (sel) => {
      const el = document.querySelector(sel);
      return el ? Math.round(el.getBoundingClientRect().height) : 0;
    };
    return { hero: box(".hero"), fold: box(".fold-hero > .fold") };
  });
  // min-height as well as height, and that is not belt-and-braces: the hero is
  // sized by `min-height: max(calc(100svh - ...), 89rem)`, and pinning only
  // `height` leaves the min-height free to win. Under the grow it resolved to
  // the document height and the hero ballooned anyway — same 70-elements-per-
  // pass drop, second time around.
  const pin = (sel, px) =>
    `${sel} { height: ${px}px !important; min-height: ${px}px !important; }`;
  const pins = [
    frozen.hero && pin(".hero", frozen.hero),
    frozen.fold && pin(".fold-hero > .fold", frozen.fold),
  ].filter(Boolean);
  if (pins.length) {
    await page.addStyleTag({ content: pins.join("\n") });
    await page.waitForTimeout(200);
  }

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

  // Pass 1: what each text element IS — its colour, its size, its identity.
  // Positions are deliberately not taken here. Stamping an index on the way
  // through is what lets pass 2 find the same elements again.
  const targets = await page.evaluate(() => {
    const out = [];
    let n = 0;
    const walk = (node) => {
      for (const el of node.children) {
        const hasOwnText = [...el.childNodes].some(
          (x) => x.nodeType === 3 && x.textContent.trim().length > 1,
        );
        const cs = getComputedStyle(el);
        // checkVisibility() rather than only the computed style, because a
        // closed <details> is not covered by either. Chrome hides its contents
        // with content-visibility on ::details-content, which leaves the
        // children at display:block WITH a real, non-zero bounding box — so
        // the /piloto FAQ's collapsed answers were measured, sampled against
        // whatever is actually painted at those coordinates two sections
        // further down, and reported as failures for text nobody can see.
        const rendered =
          typeof el.checkVisibility === "function"
            ? el.checkVisibility({
                contentVisibilityAuto: true,
                opacityProperty: true,
                visibilityProperty: true,
              })
            : true;
        if (
          hasOwnText &&
          rendered &&
          cs.visibility !== "hidden" &&
          cs.display !== "none" &&
          parseFloat(cs.opacity) > 0.1
        ) {
          const b = el.getBoundingClientRect();
          if (b.width > 4 && b.height > 4) {
            const id = String(n++);
            el.setAttribute("data-audit-id", id);
            const size = parseFloat(cs.fontSize);
            const weight = parseInt(cs.fontWeight, 10) || 400;
            out.push({
              id,
              sel:
                el.tagName.toLowerCase() +
                (el.className && typeof el.className === "string"
                  ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
                  : ""),
              text: el.textContent.trim().slice(0, 40),
              color: cs.color,
              size,
              large: size >= 24 || (size >= 18.66 && weight >= 700),
            });
          }
        }
        walk(el);
      }
    };
    walk(document.body);
    return out;
  });

  // Pass 2: same page, no glyphs. Whatever is left inside a text box is
  // exactly what that text is sitting on.
  await page.addStyleTag({
    content: `*, *::before, *::after { color: transparent !important;
               text-decoration-color: transparent !important; }`,
  });
  await page.waitForTimeout(250);

  // Measure the boxes HERE, against the same layout the screenshot captures.
  //
  // They used to be measured in pass 1, before the glyphs were hidden, and
  // that is wrong: a universal !important declaration forces a full style
  // recalculation, and this page re-wraps under it — `.lede` and `.note` each
  // lost a line, moving everything below them up by 32px. Every box below the
  // fold was then sampled ~32px off its real position, which is how a filled
  // primary button came back as white-on-page-background at 1.08:1. Measuring
  // after the injection means the two can no longer disagree.
  const geometry = await page.evaluate(() => {
    const out = {};
    document.querySelectorAll("[data-audit-id]").forEach((el) => {
      const b = el.getBoundingClientRect();
      out[el.getAttribute("data-audit-id")] = {
        x: b.x + scrollX,
        y: b.y + scrollY,
        w: b.width,
        h: b.height,
      };
    });
    return out;
  });

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
    const box = geometry[t.id];
    // Gone or collapsed under the recalculation: nothing left to sit on.
    if (!box || box.w <= 4 || box.h <= 4) continue;
    const fg = t.color.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);
    let worst = Infinity;
    let worstBg = null;
    // Sample the middle of the box, not its edges. A border-box includes
    // the element's own rounded corners (where the page shows through) and
    // any border strip, and worst-pixel-wins would report those instead of
    // what is behind the glyphs — a filled pill button reads as 1.08:1 off
    // its own corner. Insetting keeps the sample on the painted surface.
    const insetX = Math.min(box.w * 0.15, 18);
    const insetY = Math.min(box.h * 0.3, 18);
    const x0 = Math.max(0, Math.round(box.x + insetX));
    const y0 = Math.max(0, Math.round(box.y + insetY));
    const x1 = Math.min(info.width - 1, Math.round(box.x + box.w - insetX));
    const y1 = Math.min(info.height - 1, Math.round(box.y + box.h - insetY));
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
        `FAIL ${route.slug} ${v.name}/${theme}  ${worst.toFixed(2)}:1 ` +
          `(need ${need})  ${t.sel}  fg ${hex(fg)} on ${hex(worstBg)}  ` +
          `"${t.text}"`,
      );
    }
  }

  await ctx.close();
}

await browser.close();
console.log(`\n${checked} text elements checked · ${failures} failing`);
process.exit(failures ? 1 : 0);
