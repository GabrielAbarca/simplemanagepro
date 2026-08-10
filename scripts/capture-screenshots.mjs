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

/**
 * Second pass, for the hero's product fragments on a phone.
 *
 * The desktop capture cannot serve them. A fragment is only legible when it is
 * displayed at roughly the CSS size the app drew it at, and the narrowest
 * useful desktop crop (student name plus nota) is 1360 source px = 680 CSS px,
 * against about 358px of usable width on a 390px screen. That is 0.53x, which
 * is the same illegibility the desktop hero already had.
 *
 * Shooting the console at 390px instead lets the app lay itself out for a
 * phone, so a crop that fits the column is a crop of a phone-sized UI at 1:1.
 * 3x because a 390px viewport at 2x cannot fill a 3x device.
 */
const MOBILE_VIEWPORT = { width: 390, height: 844 };
const MOBILE_SCALE = 3;
const MOBILE_PORTALS = ["admin", "teacher-gradebook"];

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

async function capture(browser, theme, mobile = false) {
  const context = await browser.newContext({
    viewport: mobile ? MOBILE_VIEWPORT : VIEWPORT,
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

  const wanted = mobile
    ? PORTALS.filter((p) => MOBILE_PORTALS.includes(p.file))
    : PORTALS;

  for (const portal of wanted) {
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

    // Let entrance transitions land before the shutter.
    await page.waitForTimeout(900);

    const prefix = mobile ? "m-" : "";
    const file = path.join(OUT, `${prefix}${portal.file}${theme.suffix}.png`);
    await page.screenshot({ path: file });
    console.log(
      `  ${theme.name.padEnd(5)} ${prefix}${portal.file} → ${path.relative(process.cwd(), file)}`,
    );
  }

  await context.close();
}

const browser = await chromium.launch();
await mkdir(OUT, { recursive: true });

console.log(`Capturing ${BASE} at ${VIEWPORT.width}x${VIEWPORT.height} @${SCALE}x`);
for (const theme of THEMES) await capture(browser, theme);

console.log(
  `Capturing ${MOBILE_VIEWPORT.width}x${MOBILE_VIEWPORT.height} @${MOBILE_SCALE}x for the hero fragments`,
);
for (const theme of THEMES) await capture(browser, theme, true);

await browser.close();
console.log("Done.");
