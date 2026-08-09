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

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = "https://demo.simplemanagepro.com";
const OUT = path.resolve(process.cwd(), "src/assets/screenshots");

/** Landscape "screen" proportions; 2x so the PNGs stay crisp when scaled. */
const VIEWPORT = { width: 1440, height: 900 };
const SCALE = 2;

/** Light keeps the plain filename; dark takes a suffix. */
const THEMES = [
  { name: "light", suffix: "" },
  { name: "dark", suffix: "-dark" },
];

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
  },
  { file: "student", path: "/", ready: ".grade-overview, #grades-table, main" },
];

async function capture(browser, theme) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: SCALE,
    locale: "es-CR",
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
    await page.goto(`${BASE}${portal.path}`, { waitUntil: "networkidle" });
    await page
      .locator(portal.ready)
      .first()
      .waitFor({ state: "visible", timeout: 30_000 })
      .catch(() => {});

    for (const step of portal.steps ?? []) {
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

    // Let entrance transitions land before the shutter.
    await page.waitForTimeout(900);

    const file = path.join(OUT, `${portal.file}${theme.suffix}.png`);
    await page.screenshot({ path: file });
    console.log(`  ${theme.name.padEnd(5)} ${portal.file} → ${path.relative(process.cwd(), file)}`);
  }

  await context.close();
}

const browser = await chromium.launch();
await mkdir(OUT, { recursive: true });
console.log(`Capturing ${BASE} at ${VIEWPORT.width}x${VIEWPORT.height} @${SCALE}x`);
for (const theme of THEMES) await capture(browser, theme);
await browser.close();
console.log("Done.");
