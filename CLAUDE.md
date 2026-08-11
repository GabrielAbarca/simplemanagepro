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
| `src/data/site.ts` | Portal content, pilot lists, the `/piloto` answers. |
| `src/pages/` | One file per route. |
| `src/layouts/Layout.astro` | `<head>`, per-page OG, head slot for JSON-LD, skip link, `<main>`, reveal script. |
| `src/components/sections/` | Home-page sections. Shared closer: `CierreCta.astro`. |
| `src/components/` | `Header.astro` (nav, mobile menu, theme toggle), `Footer.astro`, `ThemedShot.astro`, `HeroShot.astro` (theme **and** viewport swap). |
| `src/lib/schema.ts` | JSON-LD builders. |
| `src/styles/tokens.css` | Design tokens inherited from the app, plus `@font-face` for Poppins. |
| `src/styles/base.css` | Shared layout and component primitives, and the fold system. |
| `src/assets/screenshots/` | Portal captures, light and `-dark`, `m-` for the 390px pass, plus derived crops. |
| `public/` | Icon set, self-hosted Poppins, `og.png`, `robots.txt`, manifest. |

## Commands

```bash
npm run dev             # dev server on :4321
npm run check           # astro check — must stay 0 errors / 0 warnings
npm run build           # production build
npm run preview         # serve the build on :4321

npm run capture         # re-shoot the portal screenshots from the live demo,
                        # desktop 1440@2x plus a 390@3x pass for hero fragments
npm run derive          # regenerate cropped screenshots from those captures
npm run og              # regenerate public/og.png (1200×630)

npm run audit:contrast  # WCAG 1.4.3 audit, every route
npm run review          # full-page screenshots, every route × desktop/mobile × light/dark
npm run check:nojs      # every route renders complete with JavaScript disabled
```

The last three need `npm run preview` already running, and all accept
`CHROMIUM_PATH=` when the environment ships a browser whose build number does
not match what Playwright would download. `audit:contrast` and `review` accept
`ROUTE=piloto` to narrow to one page while iterating.

**Run `check`, `build`, and `audit:contrast` before considering work done.**
Add `review` and `check:nojs` for anything visual.

Only one preview server can hold :4321. If a previous one is still running the
new one silently moves to :4322 and every harness then measures the stale
build — kill the old process rather than assuming the port.

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
- **The limits stay, as `Respuestas directas` on `/piloto`.** All three facts
  are intact and none is softened — no encargado portal, no colegio using it
  yet, expedientes hosted abroad. What changed is the framing and the location.
  A list of deficits headed *"para que no lo descubra en la primera reunión"*
  announces bad news before the reader has asked; the same content as the
  director's own questions, answered straight, reads as candor. Do not quietly
  drop it: BRIEF §7 keeps it as a trust device and it is still one.
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
- **The fold is the page's signature.** The brand mark is a crimson ribbon
  folded back on itself with the darker crimson on the underside; the hero is
  that shape at page scale, and `.fold-band` in `base.css` carries the same
  upward-to-the-right edge down alternating sections so the page reads as one
  folded sheet. It is all `clip-path` and gradients — no image, nothing that
  costs a slow Android anything to paint. Both layers sit behind the content in
  the band's own stacking context: **nothing decorative is ever painted over
  type.**
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

**Legibility is a scale problem, not a resolution one.** The captures are a
1440 CSS-px console; a full frame in the 1180px wrap is drawn at 0.41x, which
puts a 14px table row at 5.9px. No bigger source file and no `srcset` changes
that. The hero therefore uses **crops sized so displayed width is half the
source width**, i.e. 1:1 with the app's own CSS pixels — that ratio is the
whole trick, and `make-derived.mjs` prints it for every crop it writes. A phone
cannot use the desktop crops either, so `npm run capture` also shoots at
390@3x (`m-` prefix) and `HeroShot.astro` switches on viewport as well as theme.

Two known blemishes cannot be fixed from this repo:

- The admin overview reads **"Bienvenido, Demo Account"** — the auth user's
  display name, which lives in `auth.users` and is out of bounds without an
  explicit ask.
- **"Asistencia de hoy: Sin datos".** Previously recorded as a weekend
  artifact; that is wrong, a Monday capture shows it too. The demo's fixtures
  carry no attendance for the current date, so it will show on any day. Fixing
  it means seeding the demo, not re-running the capture.

`npm run derive` crops around both. BRIEF §9 sanctions cropping per section, so
cropping is the intended treatment rather than a workaround.

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
  build.
