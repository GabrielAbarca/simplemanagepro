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

**Never 3D-transform a screenshot.** A `rotateY` on a console resamples every
glyph across the plane, which undoes all of the above for a bit of depth. Depth
comes from the frame, the elevation and the fold behind it. Entrance animations
are fine because they end at identity.

A phone cannot use a desktop frame at all, so `npm run capture` also shoots at
390@3x (`m-` prefix) and `ConsoleShot` switches on viewport as well as theme.

Three known blemishes cannot be fixed from this repo:

- The admin overview reads **"Bienvenido, Demo Account"** — the auth user's
  display name, which lives in `auth.users` and is out of bounds without an
  explicit ask. Gabriel's call, August 2026: keep the overview and accept it.
- **"Asistencia de hoy: Sin datos".** Previously recorded as a weekend
  artifact; that is wrong, a Monday capture shows it too. The demo's fixtures
  carry no attendance for the current date, so it will show on any day. Fixing
  it means seeding the demo, not re-running the capture.
- **The gradebook's periodo control captures as an empty box at 390px.** Not a
  timing problem and not a colour problem: `#gradebook-period-trigger` measures
  158px wide at 1280 and **0px at 390**, so its label is never painted. That is
  a real bug in the app on phones. Until it is fixed, the docente portal's
  `mobileImage` points at `m-teacher` instead of `m-teacher-gradebook`.

Full frames make the app's own wording legible, and it contradicts the page:
the consoles say *"toda la escuela"*, *"Año escolar activo"* and *"año escolar
actual"* while every line of copy says **colegio** and **curso lectivo**.
Belongs in `../SMP-Web-Page`.

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
- `naturalWidth` on a `w`-descriptor `srcset` is **density-corrected**, so a
  2480px file selected for a 1240px slot reports 1240. Check `currentSrc`, not
  `naturalWidth`, when verifying which candidate a browser picked.
