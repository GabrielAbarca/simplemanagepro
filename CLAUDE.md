# CLAUDE.md

Working guide for AI agents (and humans) contributing to the **Simple Manage
Pro landing page**. Read this before making changes.

This repo is the marketing page only. The product it advertises lives in
`SMP-Web-Page` (the app repo) and has its own `CLAUDE.md`; where the two
disagree about this repo, this file wins.

## Project overview

One static Spanish document at `simplemanagepro.com`, built with **Astro 5**.
No framework, no adapter, no SSR, no routing — the page has none of the things
that would justify them. Everything dynamic on it (the demo, WhatsApp) lives on
another origin. Deploys as its own Vercel project.

| Path | What it is |
| --- | --- |
| `BRIEF.md` | **The decision record.** Positioning, audience, offer, page structure (§7), conversion path (§8), build decisions (§9), Costa Rican language notes (§10). Every tension in it was argued through and closed. |
| `src/pages/index.astro` | The page. All eight sections. |
| `src/layouts/Layout.astro` | `<head>`, icons, font preloads, skip link. |
| `src/components/` | `Header.astro` (sticky nav + theme toggle), `ThemedShot.astro` (light/dark screenshot swap). |
| `src/styles/tokens.css` | Design tokens **inherited from the app**, plus `@font-face` for Poppins. |
| `src/assets/screenshots/` | Portal captures, light and `-dark`, plus derived crops. |
| `public/` | Icon set, self-hosted Poppins, `og.png`. |

## Commands

```bash
npm run dev             # dev server on :4321
npm run check           # astro check — must stay 0 errors / 0 warnings
npm run build           # production build
npm run preview         # serve the build on :4321

npm run capture         # re-shoot all 8 portal screenshots from the live demo
npm run derive          # regenerate cropped screenshots from those captures
npm run og              # regenerate public/og.png (1200×630)

npm run audit:contrast  # WCAG 1.4.3 audit against the rendered page
npm run review          # full-page screenshots, desktop+mobile × light+dark
```

`audit:contrast` and `review` both need `npm run preview` already running.
Both accept `CHROMIUM_PATH=` when the environment ships a browser whose build
number does not match what Playwright would download.

**Run `check`, `build`, and `audit:contrast` before considering work done.**

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
  biography, no.
- **`Qué no incluye` stays.** It is a trust device, not filler.

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

  Two tokens have **zero headroom** and will fail under any decorative tint:
  `--color-dark-variant` (4.54:1) and `--color-info-dark` (4.50:1). If you put
  a gradient, glow, or large soft shadow anywhere near text set in them, it
  will fail. Hold the decoration off the text rather than dimming it until it
  passes — at any opacity where the effect is still worth having, those tiers
  are already under the line.

  Fills are separate from text colours: `--color-primary` carries white at
  only 3.48:1, so filled buttons use `--color-primary-fill` (4.53:1).
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
the director to click through to that exact demo. Two known blemishes cannot
currently be fixed by recapturing:

- The admin overview reads **"Bienvenido, Demo Account"** — the auth user's
  display name, which lives in `auth.users` and is out of bounds without an
  explicit ask.
- **"Asistencia de hoy: Sin datos"** appears whenever the capture runs on a
  weekend. A weekday run fills it.

`npm run derive` crops around both. BRIEF §9 sanctions cropping per section, so
cropping is the intended treatment rather than a workaround.

## Verification

Visual work is not done until it has been looked at. Drive Playwright against
`npm run preview` and read the resulting PNGs — set `img.loading='eager'` and
scroll gently before capturing, or below-the-fold sections come out blank.
`npm run review` does this for desktop and mobile in both themes.
