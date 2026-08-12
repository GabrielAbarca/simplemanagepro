# CLAUDE.md

Working guide for AI agents (and humans) contributing to the **Simple Manage
Pro landing page**. Read this before making changes.

This repo is the marketing page only. The product it advertises lives in
`SMP-Web-Page` (the app repo) and has its own `CLAUDE.md`; where the two
disagree about this repo, this file wins.

## Project overview

Five static Spanish pages at `simplemanagepro.com`, built with **Astro 5**. No
framework, no adapter, no SSR — everything dynamic (the demo, WhatsApp) lives
on another origin. Deploys as its own Vercel project.

| Route | Job |
| --- | --- |
| `/` | Claim, problem→solution, portal overview, data isolation, pilot teaser |
| `/portales` | The three consoles in depth, with real screenshots |
| `/piloto` | The offer, both commitments, pricing stance, straight answers |
| `/nosotros` | Misión, visión, how the work is done |
| `/contacto` | WhatsApp and email |

Slugs are Spanish because the site is `lang="es-CR"` and Spanish-only. Adding a
route means adding it to `src/config.ts` (`NAV`) **and** `scripts/routes.mjs`,
or the audit and review harnesses silently stop covering it.

| Path | What it is |
| --- | --- |
| `BRIEF.md` | **The decision record.** Positioning, audience, offer, page structure (§7 + its amendment), conversion path (§8), build decisions (§9), Costa Rican language notes (§10). |
| `src/config.ts` | URLs, contact details, nav. Anything used by more than one route. |
| `src/data/site.ts` | Portal content (accent, glyph, capabilities, captures), pilot lists, the `/piloto` FAQ, the `/nosotros` story beats. |
| `src/pages/` | One file per route. |
| `src/layouts/Layout.astro` | `<head>`, per-page OG, head slot for JSON-LD, skip link, `<main>`, reveal script. |
| `src/components/sections/` | Home-page sections. Shared closer: `CierreCta.astro`. |
| `src/components/` | `Header.astro` (nav, mobile menu, theme toggle), `Footer.astro`, `PageHero.astro` (every route but `/`), `ConsoleShot.astro` (theme **and** viewport swap, and the srcset rule), `ConsoleFrame.astro` (browser chrome), `PortalGlyph.astro` (drawn console wireframe). |
| `src/lib/schema.ts` | JSON-LD builders. |
| `src/styles/tokens.css` | Design tokens inherited from the app, the three portal accents, plus `@font-face` for Poppins. |
| `src/styles/base.css` | Shared layout and component primitives, the card hierarchy, console frames, and the fold system. |
| `src/assets/screenshots/` | Portal captures, light and `-dark`, `m-` for the 390px pass. Nothing derived: see Screenshots. |
| `public/` | Icon set, self-hosted Poppins, `og.png`, `robots.txt`, manifest. |

## Commands

```bash
npm run dev             # dev server on :4321
npm run check           # astro check — must stay 0 errors / 0 warnings
npm run build           # production build
npm run preview         # serve the build on :4321

npm run capture         # re-shoot the portal screenshots from the live demo,
                        # desktop 1280@3x plus a 390@3x pass for phones
npm run og              # regenerate public/og.png (1200×630)

npm run audit:contrast  # WCAG 1.4.3 audit, every route
npm run check:crease    # the fold never crosses type, every hero × 8 widths
npm run review          # full-page screenshots, every route × desktop/mobile × light/dark
npm run check:nojs      # every route renders complete with JavaScript disabled
```

The last four need `npm run preview` already running, and all accept
`CHROMIUM_PATH=` when the environment ships a browser whose build number does
not match what Playwright would download. `audit:contrast` and `review` accept
`ROUTE=piloto` to narrow to one page while iterating.

**Run `check`, `build`, `audit:contrast` and `check:crease` before considering
work done.** Add `review` and `check:nojs` for anything visual.

Only one preview server can hold :4321. If a previous one is still running the
new one silently moves to :4322 and every harness then measures the stale
build. Either kill the old process, or leave it alone and point the harnesses
somewhere else — all four read `PREVIEW_URL`:

```bash
npx astro preview --port 4325
PREVIEW_URL=http://localhost:4325 npm run audit:contrast
```

## Hard rules

These are non-negotiable. They override default agent behavior.

1. **Branch per task, off `main`.** Naming is `<type>/<short-kebab-summary>` —
   `feat/`, `fix/`, `docs/`, `chore/`, `refactor/`. Two or three words after
   the slash.

   **Never use an agent- or tool-generated branch name.** Forbidden: any
   `claude/…` prefix, any random suffix or hash, any timestamp or session id.

   **This applies even when the session starts on a pre-assigned branch.**
   Claude Code on the web opens sessions on a branch it names itself and tells
   the agent to push there. That instruction does not override this rule.
   Create a correctly named branch off `main` and push that one instead.

2. **Claude is never an author, co-author, or contributor.** This is the rule
   most likely to be broken by accident, because there are **two** places it
   can leak and checking only one is not enough:

   - **The commit message** — no `Co-Authored-By: Claude …` trailer, no
     `Generated with Claude Code` line, no AI meta-commentary.
   - **The git identity itself** — hosted environments ship with
     `user.name=Claude` / `user.email=noreply@anthropic.com` preconfigured, so
     commits are authored by Claude even when the message is clean. This has
     already happened once in this repo.

   **Before your first commit in any session, run:**

   ```bash
   git config user.name    # must be GabrielAbarca
   git config user.email   # must be gzelaya0404@gmail.com
   ```

   Set them locally if they differ. Nothing should surface Claude or AI in
   GitHub's contributor list or in commit metadata.

3. **Commit messages** are professional and imperative (`Add the pilot
   timeline`). Explain *why* in the body when the reason is not obvious from
   the diff.

4. **Finished branches merge into `main` via PR.** No AI attribution in PR
   titles or bodies either.

5. **`BRIEF.md` is settled.** Do not relitigate positioning, structure, or the
   offer. If a design argument requires deviating from it, say so explicitly
   and get agreement first — do not quietly diverge.

6. **Clarify vague prompts.** If scope or intent is unclear, ask. A wrong
   assumption is more expensive than a question. This applies especially to
   visual direction, where "make it modern" means different things to different
   people and a full build in the wrong direction wastes a session.

## Content rules

These come from `BRIEF.md` and are load-bearing. Breaking one is a factual
error about the product, not a style choice.

- **Costa Rican Spanish, institutional register, `usted`.** Vocabulary:
  *curso lectivo* (not "año escolar"), *colegio* (secondary; *escuela* is
  primary), *periodos*, *secciones*, *matrícula*, *notas*, *expediente*,
  *director/a*, *coordinador/a*, *cédula*.
- **There is no parent portal.** Guardians are contact records visible to
  teachers, nothing more. The *pain* may name parents; the *product* never
  implies one logs in. No "para las familias" section, no guardian in the
  portal lineup.
- **Never write the word "privado."** The segment is private colegios; naming
  it costs public-school visitors and buys nothing.
- **Link `demo.simplemanagepro.com`. Never `pilot.`** — that is a writable
  school instance.
- **No tech stack, no GitHub link, no Codingraph** on the page.
- **Do not foreground the founder's student status.** Named founder, yes;
  biography, no. He is named on `/nosotros` and nowhere else: on the home page
  the same paragraph read as solo-founder risk to a director who had not yet
  decided anything.
- **`/piloto` carries an FAQ, and data residency is the part that stays.**
  This block began as `Qué no incluye` (three deficits), became `Respuestas
  directas` (the same three as the director's own questions), and is now eight
  questions a director actually asks before deciding anything.

  Gabriel's call, August 2026: the **no encargado portal** and **no colegio
  using it yet** answers come off the page and get handled in the conversation,
  where they can be answered with context. That is a real deviation from
  BRIEF §7, which pinned all three to this block as a trust device, so it is
  recorded in §7 rather than taken quietly. Do not reinstate them without
  asking, and do not read this as licence to drop the third.

  **Expedientes hosted abroad stays**, both here and in the home page's `Datos`
  section. It is the first thing a colegio should ask, it is already in the
  privacy policy, and volunteering it is worth more than it costs. Nothing on
  the page may imply an encargado portal exists.
- **Never use an em dash (—) in copy.** It is the most recognizable marker of
  AI-written text and this page cannot afford to read as generated. Commas,
  colons and full stops do the same work. The same goes for the wider register:
  no *optimizar*, *robusto*, *integral*, *sin fisuras*, no "en el mundo actual",
  no empty intensifiers. Em dashes in **code comments** are fine — the rule is
  about what a visitor reads.
- **The brand is `SIMPLE MANAGE PRO` as a logotype, `Simple Manage Pro` in
  prose.** Caps in the header, footer and OG card, matching the app's own
  sidebar, which is visible inside the screenshots this page displays. Title
  case in body copy, `<title>` and OG tags, matching the app's own metadata.
  Caps need positive tracking; lowercase does not.

## Design conventions

- **Inherit the app's tokens, diverge on layout.** Colour, type scale, radius
  and motion come from the app so the page and its own product screenshots
  look like the same software. Layout should be more spacious and more
  editorial than the console.
- **Light theme is the default** (institutional register); dark is supported
  and must be tested, including the screenshots.
- **Accessibility floor is WCAG 1.4.3 — 4.5:1 normal text, 3:1 large.**
  Non-negotiable, and `npm run audit:contrast` is how you prove it rather than
  assuming.

  The two muted text tiers **diverge from the app on purpose**, and this is the
  one token divergence the page takes. The app's `#667281` / `#627388` clear
  4.5:1 by 0.09 and 0.07, which is enough for a console because a console is
  flat everywhere. A marketing page is not: the hero's own wash tints the
  background to `#f4f4f7` and drops both under the line. That is why the
  previous pass had a gradient in exactly one place and flat bands everywhere
  else.

  They are now `--color-dark-variant: #515c6b` (6.34:1) and
  `--color-info-dark: #4e5c70` (6.35:1), so about 1.5 points are available for
  tint, glow and gradient behind body copy. Dark mode needed only info-dark
  raised (`#8f9eb1`, 6.38:1). **Spend that headroom, do not bank it — but run
  `audit:contrast` after every change to a decorative layer.**

  Fills are separate from text colours: `--color-primary` carries white at
  only 3.48:1, so filled buttons use `--color-primary-fill` (4.53:1).
- **Two card tiers, and only two.** `.card` is the quiet default; `.card-lead`
  is for the thing a section is actually about, and `.card-fold` adds the
  ribbon's turned-back corner. When everything on a page is the same white box
  with the same 1px border, nothing announces that it is the point of its
  section — which is exactly why the three portals once read as navigation.
  Reach for `.card-lead` once or twice per page, not everywhere.
- **One accent per portal, and they are fills.** `--accent-direccion`,
  `--accent-docente` and `--accent-estudiante` follow each console everywhere
  it appears. Each carries `#fff` above 4.5:1, and a fill's contrast is a
  property of the fill rather than of the theme, so none is overridden in dark.
  **Never set one as `color` on the page background.** Crimson is not among
  them: `--color-brand` is identity only, and a portal wearing it would teach
  the reader that red means "action" here and "brand" three sections later.
- **The home hero fills one viewport but is not limited to it.** It carries two
  floors and the taller wins: `min-height: max(calc(100svh - var(--header-h)),
  89rem)`. The first is the screen. The second is the lineup's own extent, so
  the hero continues past the fold far enough to hold the devices whole.

  It used to be a fixed `height`, and that was wrong: `.fold-hero`'s clip cut
  the tablet and the phone off at the hero's bottom edge and no amount of
  scrolling revealed the rest, so they read as broken rather than as bled. The
  `overflow: hidden` stays regardless, because it is also what lets the phone
  bezel bleed off both edges at 390.

  **The fold covers the first screen, not the hero.** Its clip-path percentages
  are of the fold element, so letting it span the taller hero drags the crease
  hundreds of px below the fold line. It carries its own
  `height: calc(100svh - var(--header-h))` and `bottom: auto`.

  `--header-h` is rounded up past the real header (65.03px with the nav,
  61.77px with the menu button): over-estimating leaves a few px of the next
  section peeking, under-estimating forces a scrollbar. Two more traps.
  `base.css` gives every `<section>` 6.4rem of block padding and a hero that
  owns its height must zero it, or the inner box is 102px short at each end.
  And the devices are anchored in **rem, not per cent**: the copy stack does
  not shrink with the window, so a percentage that clears it at 900px tall puts
  a device through the note at 657.
- **A glyph component's classes are global, so prefix them.** `FeatureGlyph`
  drew its grade chips with `class="chip"`, which matched `base.css`'s pill
  component. That rule sets `color`, so `fill: currentColor` resolved to the
  page's dark text instead of the accent and the chips came out charcoal. Every
  class in these SVGs is `g-` prefixed now, and the fills read a private
  `var(--g)` rather than `currentColor` — a custom property cannot be reached
  by a global rule that happens to set `color`.
- **The fold is the page's signature.** The brand mark is a crimson ribbon
  folded back on itself with the darker crimson on the underside; the hero is
  that shape at page scale, and `.fold-band` in `base.css` carries the same
  upward-to-the-right edge down alternating sections so the page reads as one
  folded sheet. It is all `clip-path` and gradients — no image, nothing that
  costs a slow Android anything to paint. Both layers sit behind the content in
  the band's own stacking context: **nothing decorative is ever painted over
  type.**

  The crease must also never pass *behind* type. It has been placed through
  copy three times now, because the safe band is narrow, moves with the
  viewport and depends on how each page's copy wraps, so checking one width
  proves nothing about the rest. `npm run check:crease` asserts it against
  every hero at eight widths; run it after any change to a hero's layout or
  copy length. The home hero is the one exception: its crease is meant to pass
  behind the console, which is opaque, so the console counts as cover.
- **Motion is CSS, and cheap.** No WebGL, no GIF backgrounds. The primary
  channel is a WhatsApp forward opening on mobile data. Everything must
  collapse under `prefers-reduced-motion`, and the page must render complete
  and readable with JavaScript disabled.
- **Never let a scroll effect leave content invisible.** Reveal-on-scroll is
  implemented as a scroll sweep, not an `IntersectionObserver`: IO reports only
  at the moment an element crosses its threshold, and a fling scroll that
  misses that window leaves the section hidden for the rest of the visit.

## Screenshots

Captures come from the **live demo**, not fixtures, because the page invites
the director to click through to that exact demo.

### The one rule

> **Capture a console at the CSS width the page displays it at, and ship
> `srcset` candidates at exactly 1× and 2× of that width.**

Then a 1× display gets a clean integer downsample and a 2× display gets
untouched pixels. The browser never resamples fractionally and never upscales.
`ConsoleShot.astro` is the only way screenshots reach the page, and it derives
the whole `srcset` from one `displayWidth` prop so the rule cannot be forgotten.

Concretely: `npm run capture` shoots at **1280 CSS px @3x**, every surface caps
its frame at **1240 CSS px**, and 3× leaves headroom so nothing upscales
anywhere. Heights are measured and the window trimmed to the content before the
shutter, so a frame is all product.

This replaces an earlier rule about cropping to half the source width. The old
hero was soft for three reasons and only the first was about scale: a 1440px
console in the 1180px wrap was drawn at 0.82×; the `srcset` topped out at 2400
against a 2880 source, so any 2× display **upscaled**; and WebP at Astro's
default quality rings around 13px UI glyph edges. Cropping treated the first
and left the other two. With the ratio inverted there is nothing left to crop,
so `make-derived.mjs` and the derived files are gone.

**A tilt is allowed, and there is exactly one safe way to do it.** What damages
a screenshot is magnification, not rotation: perspective scales a point by
`p / (p - z)`. Rotate about the edge the rotation brings **forward** and every
other point goes to a negative `z`, so the factor is at most 1.0 there and
below 1.0 everywhere else — the plane can only be minified, which is what a
downsample is. The home hero does this with `transform-origin: right center`
and a negative `rotateY`, and its pointer parallax is clamped to keep `rotateY`
negative for the same reason. A centred origin, or a positive `rotateY`, pulls
the near half toward the viewer and starts upscaling it.

This is a correction: an earlier pass removed the hero's tilt outright on the
grounds that any 3D transform resamples the glyphs. That threw away depth the
page wanted in exchange for a problem the geometry above does not have.

A phone cannot use a desktop frame at all, so `npm run capture` also shoots at
390@3x (`m-` prefix) and `ConsoleShot` switches on viewport as well as theme.

**The density is not the same on both axes, and stating the rule as a flat
1×/2× is what broke it a second time.** Laptops are 1× or 2×; phones are 3×,
near universally, which is exactly why the mobile pass is shot at 3×. A 1×/2×
ladder under a 300px phone frame topped out at 600w against a 900 device-px
need and the browser upscaled by 1.5×, on the surface where the reader is
closest to the glass. `ConsoleShot` parameterises the ladder now: 2× desktop,
3× mobile. Desktop deliberately stays at 2× because 1240 × 3 would emit a
3720px WebP no real display asks for.

The phone frame is **390, the width the capture was shot at**, not 300. A
390 CSS-px capture displayed in a 300px box shrinks the app's own layout, so
the product's 13px UI text painted at 10px before any resampling started.

### The one exception, and why it is not a licence

**The home hero's hardware phone is displayed at 280 and below, not 390.** It
is the only place on the site that breaks the rule above, and it does so
because the rule and the surface are genuinely incompatible:

- A phone capture is 390 × 2.205 = 860px of screen before the bezel. Rendered
  life-size on a 390px viewport it *is* the viewport. Measured before the fix:
  the device stood 821px tall at 390 and 892px at 430, began 558px down the
  page, and ran 535px past the fold, with the hero at 1354px on an 844px
  screen. There is no arrangement of copy that leaves room for it.
- The rule exists to keep a console **legible to someone reading it**. On
  /portales that is exactly what is being asked. In the hero it is a product
  shot, seen at a glance, two inches under a "Ver la demo" button that takes
  the reader to the real thing at full size.
- The mobile pass is shot at **3×**, so a 280px display is a 4.2× source. That
  is a clean downsample. The failure this rule was written after was the
  opposite — a 1×/2× ladder *upscaling* by 1.5× — and `ConsoleShot`'s ladder
  already fixes that independently.

Two things keep the exception honest. `mobileDisplayWidth` must be passed
explicitly, so a frame can only opt out on purpose and the `srcset` follows the
width it is actually displayed at. And the phone's hardware — bezel, corner
radius, island, side buttons — is now a **fraction of `--screen-w`** rather
than px calibrated for 390 (`base.css`, "THE HARDWARE IS A FRACTION"): fixed
hardware on a scaled screen is what makes a mockup read as fake, and at 226px
the old 96px island covered 42% of the width against about 25% on the real
device.

**This is not permission to shrink a console elsewhere.** Anywhere the reader
is meant to read the screenshot, the frame is still the capture's own width.

There are three passes, and `PASS=tablet npm run capture` reshoots one without
disturbing captures that are already reviewed. The tablet pass is **1180@2x
landscape** (`t-` prefix) and only the gradebook has one, because only the home
hero's lineup needs a tablet. 1180 is above the app's desktop breakpoint, so it
captures the tablet layout with its collapsed icon rail rather than the phone
layout enlarged.

A portal may also override the desktop viewport, and one does. **The student
Panel is shot at 1366**, because below about 1320 the app clips the third stat
card ("Próxima clase") against the main column: it loses its right rounded
corner and its text runs into the cut. Measured on the demo, clipped at 1240,
1280 and 1300, clean at 1366 and up, and the old capture shipped the defect.
The page still displays it at 1240 like the others, so the app's layout lands
about 9% smaller in that one console — much cheaper than a cut card. **This is
a workaround for an app bug**: put it back on the shared viewport once
`SMP-Web-Page` stops clipping at 1280.

**`DeviceFrame.astro` puts a console in hardware, and its bezel is padding
outside the screen.** The screen is always the exact CSS width its capture was
shot at, so wrapping a shot in a monitor, tablet or phone can never shrink the
product to make room for the frame. Set `screenWidth`, never a width on the
device. `ConsoleFrame` stays the default for surfaces showing one console: it
says "this is a web app, at this host", which is what those pages should say.

One known blemish is left, and it is deliberate: the admin overview reads
**"Bienvenido, Demo Account"**. That is the auth user's display name, it lives
in `auth.users`, and it is out of bounds without an explicit ask. Gabriel's
call, August 2026: keep the overview and accept it.

Three others were real and are now fixed **in the demo and the app**, so
captures taken from here on show the corrected product. Recorded because the
page's copy depends on the first two, and because the third would otherwise
look like a capture-timing bug:

- Attendance is seeded. The overview reads *"Asistencia del mes"* with a real
  percentage rather than *"Sin datos"*.
- The consoles say **colegio** and **curso lectivo**. They used to say *"toda
  la escuela"*, *"Año escolar activo"* and *"año escolar actual"*, which
  contradicted every line of copy on this page — full frames make the app's own
  wording legible, so this mattered more once the crops went.
- The gradebook's periodo control paints at 390px. `#gradebook-period-trigger`
  used to collapse to `width: 0` below the desktop breakpoint, so the control
  captured as an empty box on the phone pass. If it ever comes back empty,
  measure that trigger's width — the native `<select>` under it is transparent
  by design and will always look wrong.

## Verification

Visual work is not done until it has been looked at. `npm run review` drives
Playwright against `npm run preview` for every route, desktop and mobile, both
themes — then **read the PNGs**.

Two traps that have already cost a session each:

- **Check the output path.** The harness writes to `os.tmpdir()`. It used to
  default to a literal `/tmp/review`, which Node on Windows resolves against
  the current drive as `C:\tmp\review` while the launching shell translates the
  same string to the real temp directory. The captures went one place and were
  read from another, so a change looked like it had done nothing.
- **Check which server you measured.** If a preview is already on :4321 the new
  one moves to :4322 without failing, and every harness then measures the old
  build. `PREVIEW_URL` exists so you can leave someone else's dev server alone.

**When a harness reports something physically implausible, suspect the harness
first.** It has been wrong three times and right every other time:

- `contrast-audit` measured boxes *before* injecting `color: transparent`. That
  injection forces a style recalc, the page re-wraps under it, and every box
  below the fold was sampled about 32px off — including a filled button at
  1.08:1. It re-measures after injection now.
- `contrast-audit` then failed collapsed FAQ answers. A closed `<details>` is
  not `display: none`: Chrome hides its contents with `content-visibility` on
  `::details-content`, so the children keep `display: block` **and a real
  bounding box**, and the audit was sampling text nobody can see against
  whatever is painted at those coordinates two sections further down. It calls
  `checkVisibility()` now.
- `contrast-audit` grows the viewport to the document height so that one layout
  serves both the measurement and the screenshot. That silently breaks anything
  sized in viewport units, and the home hero is now
  `calc(100svh - var(--header-h))`: at a 5221px "viewport" it became a 5157px
  hero, so the audit measured a page no visitor will ever see. The wash landed
  somewhere else entirely, which reported the eyebrow at 4.48:1 against a
  background it never sits on, while about 70 elements per pass fell out of the
  run. **A drop in the element count is the tell** — it should sit near 1138.
  It pins the hero's and the fold's real heights before growing now, and it
  pins **`min-height` as well as `height`**: the hero is sized by a
  `min-height: max(...)`, so pinning only `height` left the min-height free to
  win and the hero ballooned anyway. That cost a second round of the same bug.
- `naturalWidth` on a `w`-descriptor `srcset` is **density-corrected**, so a
  2480px file selected for a 1240px slot reports 1240. Check `currentSrc`, not
  `naturalWidth`, when verifying which candidate a browser picked.
