// Every page must render complete and readable with JavaScript disabled.
import { chromium } from "playwright";
import { ROUTES, BASE_URL } from "./routes.mjs";

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
for (const r of ROUTES) {
  const p = await ctx.newPage();
  await p.goto(BASE_URL + r.path, { waitUntil: "load" });
  const res = await p.evaluate(() => {
    const hidden = [...document.querySelectorAll(".reveal")].filter((e) => {
      const cs = getComputedStyle(e);
      return parseFloat(cs.opacity) < 0.9 || cs.visibility === "hidden";
    }).length;
    const navLinks = document.querySelectorAll("header nav a").length;
    const menuLinks = document.querySelectorAll(".menu-panel a").length;
    return {
      h1: document.querySelector("h1")?.textContent.trim().slice(0, 40),
      textLen: document.body.innerText.replace(/\s+/g, " ").trim().length,
      hiddenReveals: hidden,
      navLinks, menuLinks,
      imgs: document.querySelectorAll("img").length,
    };
  });
  console.log(r.slug.padEnd(9), JSON.stringify(res));
  await p.close();
}
await b.close();
