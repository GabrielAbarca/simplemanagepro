// Portal screenshots for the landing page.
//
// Captures the LIVE demo (demo.simplemanagepro.com), not mocked fixtures.
// That is deliberate: the page asserts "Hecho para Costa Rica" and invites the
// director to click through to this exact demo, so the screenshots have to
// show the same Costa Rican data he will land in — Colegio Técnico Profesional
// SMP, Duodécimo, I/II PERIODO, materias in Spanish. The app repo's
// design-review capture harness renders richer rows but its fixtures carry
// English subject names, which would contradict the page's central claim.
//
// The demo is read-only server-side (demo_lockdown.sql), so a capture run
// cannot write anything. Credentials are public by design in a one-click demo.
//
//   npm run capture
//
// ── Why 1280 @3x, and why that number is the whole point ─────────────────────
//
// A screenshot of a UI looks soft for one reason: the browser resamples it.
// Two things cause that, and neither is fixed by a bigger source file.
//
//   1. Fractional downscale. A console captured at 1440 CSS px and displayed
//      in a 1180px column is drawn at 0.82x, so every glyph lands on a
//      fractional pixel grid. No amount of source resolution removes that.
//   2. Upscale. If the widest srcset candidate is narrower than the slot's
//      device pixels, the browser stretches it. That is what actually reads
//      as "bad quality", and it is what the old widths list did: it topped out
//      at 2400 against a 2880 source, so any 2x display needed ~2900 px and
//      got 2400 blown up.
//
// So the capture width is now chosen to match what the PAGE displays, not what
// a desktop happens to be:
//
//      capture at the CSS width the page renders it at, and ship srcset
//      candidates at exactly 1x and 2x of that width.
//
// 1280 CSS px is the widest surface (the /portales bleed), 3x gives 3840 px of
// source, and 3840 covers a 1600 CSS-px slot on a 2x display with room over.
// DPR 1 gets a clean integer downsample, DPR 2 gets untouched pixels, and
// nothing anywhere upscales.
//
// Heights are measured rather than fixed. The old 1440x900 frames were up to a
// third empty below the content, and a third of a product shot spent on blank
// background is a third of the argument thrown away.

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = "https://demo.simplemanagepro.com";
const OUT = path.resolve(process.cwd(), "src/assets/screenshots");

/** The CSS width every desktop surface on the page displays a console at. */
const VIEWPORT = { width: 1280, height: 900 };
const SCALE = 3;

/**
 * Phone pass. The app lays itself out for 390px, so a capture at that width is
 * a phone-shaped console rather than a desktop one shrunk into a column — the
 * difference between /portales being readable on a phone and not.
 */
const MOBILE_VIEWPORT = { width: 390, height: 860 };
const MOBILE_SCALE = 3;

/** Light keeps the plain filename; dark takes a suffix. */
const THEMES = [
  { name: "light", suffix: "" },
  { name: "dark", suffix: "-dark" },
];

/**
 * Height is trimmed to the content, then clamped. The floor stops a sparse
 * view (the admin overview) from producing a letterbox that reads as a browser
 * window someone squashed; the ceiling stops a long one (75 gradebook rows)
 * from producing a strip nobody can place on a page.
 */
const HEIGHT = { desktop: { min: 720, max: 1040 }, mobile: { min: 700, max: 860 } };

/**
 * The three portals, in the order the page shows them. `ready` is a selector
 * that only appears once real data has replaced the loading skeleton — without
 * it the captures are of spinners.
 */
const PORTALS = [
  { file: "admin", path: "/admin", ready: "#overview-heading" },
  {
    file: "teacher",
    path: "/teacher",
    // NOT the default "Hoy" view. It renders "Hoy no hay clases — es fin de
    // semana" on a weekend, so capturing the landing tab yields a blank page
    // on two days in seven. "Mis clases" carries the same weight and is
    // day-independent.
    ready: "#myclasses-grid",
    steps: [{ click: '[data-page="myclasses"]', wait: ".class-card" }],
  },
  {
    // The gradebook is the teacher view that actually argues the case: it is
    // what replaces the per-teacher Excel file the brief is built around.
    // Second card = the largest section, so the grid is not near-empty.
    file: "teacher-gradebook",
    path: "/teacher",
    ready: "#view-class",
    steps: [
      { click: '[data-page="myclasses"]', wait: ".class-card" },
      { click: ".class-card >> nth=1", wait: '[data-tab="gradebook"]' },
      // No period is selected here on purpose. The gradebook defaults to the
      // current period (teacher.js:2143) and the demo now carries grades in
      // both, so this captures exactly what a visitor lands on.
      { click: '[data-tab="gradebook"]', wait: "#view-class table" },
    ],
    // Guards against shooting before the period defaults in.
    //
    // Worth knowing if the periodo control ever comes back empty: the app's
    // custom select paints its label from #gradebook-period-trigger, not from
    // the native <select>, which is transparent by design. That button used to
    // collapse to width 0 below the desktop breakpoint, so the control
    // captured as an empty box on the phone pass. Fixed in the app; if it
    // regresses, measure the trigger's width rather than the select's value.
    settle: () => {
      const s = document.querySelector("#view-class select");
      return !s || Boolean(s.value);
    },
  },
  { file: "student", path: "/", ready: ".grade-overview, #grades-table, main" },
];

/**
 * Bottom edge of the real content, in CSS px.
 *
 * Measured off leaf nodes so a full-height wrapper cannot report the whole
 * viewport, and with the chrome excluded: the sidebar pins "Cerrar sesión" to
 * its own bottom, so including it would always answer "as tall as the window"
 * and the trim would never do anything.
 */
async function contentHeight(page) {
  return page.evaluate(() => {
    const CHROME = "aside, nav, header, footer, .sidebar, [class*='sidebar']";
    let bottom = 0;

    for (const el of document.querySelectorAll("body *")) {
      if (el.closest(CHROME)) continue;
      if (el.children.length) continue; // leaves only

      const style = getComputedStyle(el);
      if (style.visibility === "hidden" || style.display === "none") continue;
      if (style.position === "fixed") continue;

      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) continue;

      bottom = Math.max(bottom, r.bottom + window.scrollY);
    }

    return Math.ceil(bottom);
  });
}

const clamp = (n, { min, max }) => Math.min(max, Math.max(min, n));

async function capture(browser, theme, mobile = false) {
  const base = mobile ? MOBILE_VIEWPORT : VIEWPORT;
  const bounds = mobile ? HEIGHT.mobile : HEIGHT.desktop;

  const context = await browser.newContext({
    viewport: base,
    deviceScaleFactor: mobile ? MOBILE_SCALE : SCALE,
    locale: "es-CR",
    isMobile: mobile,
    hasTouch: mobile,
  });

  // The page's inline <head> guard reads this before first paint, so seeding
  // it up front avoids a flash of the other theme in the capture.
  await context.addInitScript(
    (value) => localStorage.setItem("smp-theme", value),
    theme.name,
  );

  const page = await context.newPage();

  // One shared account, prefilled and locked by the demo build.
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await page.locator("form").first().evaluate((f) => f.requestSubmit());
  await page.waitForURL(/\/admin\b/, { timeout: 30_000 });

  for (const portal of PORTALS) {
    // Reset: the previous portal trimmed the window to its own content.
    await page.setViewportSize(base);

    await page.goto(`${BASE}${portal.path}`, { waitUntil: "networkidle" });
    await page
      .locator(portal.ready)
      .first()
      .waitFor({ state: "visible", timeout: 30_000 })
      .catch(() => {});

    // At 390px the console's sidebar collapses behind #menu-btn, so every
    // step that navigates via a sidebar link has to open it first. Closing it
    // again matters: an open drawer covers the content being captured.
    const steps = portal.steps ?? [];
    if (mobile && steps.length) {
      await page.locator("#menu-btn").click().catch(() => {});
      await page.waitForTimeout(400);
    }

    for (const step of steps) {
      if (step.select) {
        await page.locator(step.select).selectOption({ index: step.index });
      } else {
        await page.locator(step.click).first().click();
      }
      await page
        .locator(step.wait)
        .first()
        .waitFor({ state: "visible", timeout: 30_000 })
        .catch(() => console.warn(`    (never saw ${step.wait} on ${portal.file})`));
    }

    if (mobile) {
      await page.locator("#close-btn").click().catch(() => {});
      await page.waitForTimeout(300);
    }

    // The readiness selectors above are per-portal guesses; this is the check
    // that actually matters. Every portal renders .skeleton placeholders until
    // its data arrives, so a capture taken too early is a picture of loading
    // bars — the one failure mode that silently produces a plausible file.
    // Count only VISIBLE ones: the nodes stay in the DOM after loading, so a
    // naive querySelectorAll length check never reaches zero.
    await page
      .waitForFunction(
        () =>
          [...document.querySelectorAll(".skeleton")].every(
            (el) => el.offsetParent === null,
          ),
        null,
        { timeout: 30_000 },
      )
      .catch(() => console.warn(`    (skeletons still visible on ${portal.path})`));

    if (portal.settle) {
      await page
        .waitForFunction(portal.settle, null, { timeout: 20_000 })
        .catch(() => console.warn(`    (never settled on ${portal.file})`));
    }

    // Let entrance transitions land before anything is measured.
    await page.waitForTimeout(900);

    // Trim the window to the content, then let the app re-lay out inside it so
    // whatever it pins to the bottom edge lands on the real bottom edge. A
    // clip would cut those in half instead.
    const height = clamp((await contentHeight(page)) + 24, bounds);
    if (height !== base.height) {
      await page.setViewportSize({ width: base.width, height });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
    }

    const prefix = mobile ? "m-" : "";
    const scale = mobile ? MOBILE_SCALE : SCALE;
    const file = path.join(OUT, `${prefix}${portal.file}${theme.suffix}.png`);
    await page.screenshot({ path: file });
    console.log(
      `  ${theme.name.padEnd(5)} ${(prefix + portal.file).padEnd(20)}` +
        ` ${base.width}x${height} @${scale}x` +
        ` → ${base.width * scale}px source, show at up to ${base.width}px`,
    );
  }

  await context.close();
}

const browser = await chromium.launch();
await mkdir(OUT, { recursive: true });

console.log(`Capturing ${BASE} at ${VIEWPORT.width} CSS px @${SCALE}x`);
for (const theme of THEMES) await capture(browser, theme);

console.log(`Capturing ${MOBILE_VIEWPORT.width} CSS px @${MOBILE_SCALE}x for phones`);
for (const theme of THEMES) await capture(browser, theme, true);

await browser.close();
console.log("Done.");
