// The WhatsApp share card. 1200×630 → public/og.png
//
//   npm run og
//
// BRIEF §8 makes this a first-class deliverable rather than metadata: a
// director forwards the link, and the recipient — who never spoke to Gabriel —
// sees this card before they see anything else. It has to say what the product
// is, for whom, and that it is Costa Rican, without being read.
//
// Rendered through a browser rather than composited with sharp, because the
// card has to be set in Poppins and librsvg would silently fall back to
// whatever font the machine happens to have.
//
// The product visual is the director console, whole and bleeding off the right
// edge — §8 asks for the director console specifically. It used to be a cropped
// strip of three overview tiles, which kept "Bienvenido, Demo Account" off the
// one image that gets forwarded without context. The card now matches the page:
// a whole console, because a strip of tiles does not read as a product.

import { chromium } from "playwright";
import path from "node:path";
import { writeFile, unlink } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const root = process.cwd();

// Relative paths against a real file:// document. setContent() leaves the page
// on about:blank, and Chromium refuses to pull file:// subresources into a
// document that isn't itself file:// — which silently produced a card with a
// broken-image icon where the logo goes and no Poppins anywhere.
const asset = (p) => p;

const html = `<!doctype html>
<meta charset="utf-8">
<style>
  @font-face { font-family: Poppins; font-weight: 400; src: url("${asset("public/fonts/poppins-latin-400-normal.woff2")}") format("woff2"); }
  @font-face { font-family: Poppins; font-weight: 600; src: url("${asset("public/fonts/poppins-latin-600-normal.woff2")}") format("woff2"); }
  @font-face { font-family: Poppins; font-weight: 700; src: url("${asset("public/fonts/poppins-latin-700-normal.woff2")}") format("woff2"); }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; overflow: hidden;
    font-family: Poppins, sans-serif;
    background: #f6f6f9; color: #363949;
    position: relative; display: flex; align-items: center;
  }

  /* Same wash as the hero, frozen. Kept off the text side for the same reason
     it is on the page: the muted tiers have no contrast headroom. */
  .b { position: absolute; border-radius: 50%; filter: blur(90px); }
  .b1 { width: 620px; height: 620px; top: -260px; right: -140px; background: #7380ec; opacity: .34; }
  .b2 { width: 420px; height: 420px; bottom: -200px; right: 180px; background: #a78bfa; opacity: .30; }
  .b3 { width: 300px; height: 300px; top: 120px; right: 420px; background: #d30011; opacity: .12; }
  .grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(132,139,200,.18) 1px, transparent 1px),
      linear-gradient(90deg, rgba(132,139,200,.18) 1px, transparent 1px);
    background-size: 72px 72px;
    mask-image: linear-gradient(105deg, transparent 30%, #000 75%);
  }
  .veil {
    position: absolute; inset: 0;
    background: linear-gradient(90deg, #f6f6f9 0 46%, transparent 86%);
  }

  .copy { position: relative; padding: 0 0 0 72px; width: 660px; }
  .brand { display: flex; align-items: center; gap: 12px; margin-bottom: 34px; }
  .brand img { width: 40px; height: 40px; border-radius: 8px; }
  .brand span { font-size: 20px; font-weight: 700; letter-spacing: .04em; }
  .brand b { font-weight: 700; color: #d30011; }

  h1 {
    font-size: 52px; font-weight: 700; line-height: 1.1;
    letter-spacing: -.02em; text-wrap: balance;
  }
  .sub { margin-top: 24px; font-size: 22px; line-height: 1.45; color: #667281; max-width: 34ch; }

  .foot {
    position: absolute; left: 72px; bottom: 46px;
    display: flex; align-items: center; gap: 14px;
    font-size: 19px; font-weight: 600; color: #4455e6;
  }
  .foot .dot { width: 5px; height: 5px; border-radius: 50%; background: #667281; opacity: .5; }
  .foot .muted { color: #667281; font-weight: 400; }

  /* Bleeds past the right edge. A whole 1280px console shown at 560px is 0.44x,
     which is far too small to read — and reading is not this image's job. It
     has to be recognised as a working dashboard in a WhatsApp preview at about
     a third of this size, and a frame that runs off the edge does that better
     than a smaller one floating inside the card. */
  .shot {
    position: absolute; right: -100px; top: 50%;
    width: 560px; transform: translateY(-50%) rotate(-3deg);
    border-radius: 16px; overflow: hidden;
    box-shadow: 0 12px 28px rgba(24,26,30,.12), 0 36px 68px rgba(24,26,30,.16);
    outline: 1px solid rgba(132,139,200,.18);
  }
  .shot img { display: block; width: 100%; }
</style>

<span class="b b1"></span><span class="b b2"></span><span class="b b3"></span>
<span class="grid"></span><span class="veil"></span>

<div class="copy">
  <div class="brand">
    <img src="${asset("public/apple-touch-icon.png")}" alt="">
    <span>SIMPLE <b>MANAGE PRO</b></span>
  </div>
  <!-- Tracks the home hero's headline. A share card that promises one claim
       and a page that opens with another is the same page contradicting
       itself in the two seconds the forward is worth. -->
  <h1>Tres consolas. Un solo sistema.</h1>
  <p class="sub">
    Notas, asistencia, horarios y expedientes, sobre los mismos datos.
  </p>
</div>

<div class="foot">
  <span>Hecho para Costa Rica</span>
  <span class="dot"></span>
  <span class="muted">simplemanagepro.com</span>
</div>

<div class="shot">
  <img src="${asset("src/assets/screenshots/admin.png")}" alt="">
</div>
`;

const tmp = path.resolve(root, ".og-render.html");
await writeFile(tmp, html, "utf8");

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
try {
  await page.goto(pathToFileURL(tmp).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  // Fail loudly rather than shipping a card with holes in it.
  const broken = await page.evaluate(() =>
    [...document.images]
      .filter((i) => !i.complete || i.naturalWidth === 0)
      .map((i) => i.getAttribute("src")),
  );
  if (broken.length) throw new Error(`images failed to load: ${broken.join(", ")}`);
  const poppins = await page.evaluate(() => document.fonts.check("700 52px Poppins"));
  if (!poppins) throw new Error("Poppins did not load — card would render in a fallback face");

  await page.waitForTimeout(200);
  await page.screenshot({ path: path.resolve(root, "public/og.png") });
} finally {
  await browser.close();
  await unlink(tmp).catch(() => {});
}

console.log("public/og.png  1200×630");
