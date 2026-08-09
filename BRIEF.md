# SMP — Landing Page Brief (decided)

Foundation document for the Simple Manage Pro landing page. Supersedes the
earlier context brief: every open tension in that document has been argued
through and closed, and several of its factual claims were corrected against
the product as it actually exists.

Written to be portable — paste into design prompts, copy prompts, or
brainstorming sessions as the shared starting context.

Last updated: August 2026

---

## 0. Corrections to the previous brief

These were wrong in the earlier document and are load-bearing. Do not
reintroduce them.

| Previous claim | Reality |
|---|---|
| App lives at `pilot.simplemanagepro.com` | That is the **writable pilot instance** (`VITE_DEMO_MODE=false`). The **public demo is `demo.simplemanagepro.com`**. The page links the demo and never the pilot. |
| Product is built for Costa Rica | It **was** built country-agnostic (`"Latin American institutions"`, ID label offering `DUI`/`Carné`). Now true rather than trimmed to fit — the product was changed, not the claim. See §11. |
| The demo needs three role accounts | One account is enough. It lands in the admin console and capability-gated links reach the other two portals. See §8. |
| Parents/families are part of the story | **There is no parent portal.** Guardians exist only as contact records visible to teachers. |
| Framework is Next.js | **Astro.** See §9. |
| Demo should show two periodos | Already does — `I PERIODO` / `II PERIODO` are live. |

---

## 1. Product

**Simple Manage Pro (SMP)** — a web-based school management system for
secondary schools. Three portals behind a shared login:

- **Consola de administración (director/coordinador)** — curso lectivo and
  periodos, niveles, secciones, aulas, materias, docentes, asignaciones,
  horarios, expedientes y matrícula (including CSV import), plus a school-wide
  overview.
- **Consola docente** — a "Hoy" view and a per-class workspace: lista,
  libro de notas, asistencia, horario. Weighted categories, final period
  grades posted to the report card, registro disciplinario, contactos de
  encargados, resumen de ausencias en riesgo, informe de progreso imprimible.
- **Portal estudiantil** — porcentaje de asistencia, promedio, próxima clase,
  notas por materia y periodo, horario semanal, docentes, historial de
  asistencia, cartelera de eventos.

**There is no parent/guardian portal.** This is a hard constraint on copy.

Bilingual ES/EN, light and dark themes. Public demo runs read-only
(server-side lockdown; visitor edits never reach the database).

**Architecture fact that matters commercially:** each school gets its **own
Supabase project**, provisioned by hand. Schools are not neighbours in a shared
database — no query can cross between them. This single fact carries three
different arguments on the page: privacy, scarcity, and pricing.

**Data residency:** United States (`us-west-1`), encrypted in transit and at
rest. Already disclosed plainly in `privacy.html`, including the sentence that
records are stored outside Costa Rica. Keep that candor.

**Founder:** Gabriel Zelaya, named as founder. Not presented as a student.

**Live URLs**

| Host | What it is |
|---|---|
| `simplemanagepro.com` | Landing page (currently 404 — free) |
| `demo.simplemanagepro.com` | Public read-only demo — **the one the page links** |
| `pilot.simplemanagepro.com` | Writable pilot instance — **never linked** |

---

## 2. Market

**Costa Rica.** Aimed at private colegios — the segment that decides
independently, holds its own budget, and is not served by MEP's SEA — but the
page **never uses the word "privado."** Naming the segment costs public-school
visitors and buys nothing.

Keep the ministerial defusal, which works for either kind of reader:
**SMP no reemplaza nada del MEP.**

**Calendar.** Curso lectivo 2026 ran Feb 23 – Dec 9 in two periodos. Nobody
switches systems mid-periodo. The decision window for a 2027 pilot is roughly
**October–January**, with the school starting in **February 2027**.

**The offer is a clean February 2027 start.** Not a mid-year parallel pilot.

---

## 3. Audiences

**Primary — the director/coordinador.** Signs. Non-technical. Real questions:
does this replace our spreadsheets or add to them; will my teachers use it;
where does our data live and who can see it; what does it cost and what happens
when it breaks; who else uses it.

Pain is concentrated and dateable: the reconciliation crunch at each period
close, when grades scattered across teachers' Excel files, paper attendance,
and WhatsApp threads have to be assembled into report cards by hand.

**Secondary — teachers.** Don't sign, can veto. One section speaks to them.

**Deferred — press.** No press page, no press entry point, not yet. The story
is materially stronger once a named pilot school exists. Revisit ~July 2027.

**Not an audience — developers and recruiters.** No tech stack on the page, no
GitHub link. Portfolio value lives on other surfaces.

---

## 4. Positioning

**The claim: _Hecho para Costa Rica._** Asserted directly — and the product is
being changed so the claim is true rather than trimmed to fit (§11).

**The wedge:** colegios run on a patchwork — Excel gradebooks per teacher,
paper attendance, WhatsApp groups, report cards assembled by hand at period
close. Real, recurring, dated.

**Why SMP over international software:** local structure by default (periodos
ponderados, secciones, cédula, español primero), a named human who answers
WhatsApp, and pricing built for a Costa Rican colegio rather than converted
from dollars.

**The reframe that solves having no customers:** this is a **pilot program for
three colegios**, not a product launch. True, explains the absent logos, makes
the ask small, and puts a date on the decision.

---

## 5. The offer

- **Three colegios. February 2027.** The number is real, not a marketing
  device — each school is a hand-provisioned database. Say the reason out loud.
- **Cost-recovery pricing, not free.** Free software is evaluated like free
  software and generates no institutional commitment — and a pilot nobody uses
  produces no evidence, which is the entire point. State *that* it covers
  infrastructure; never state the number. Pricing is discussed directly.
- **What the colegio commits to**, in writing on the page:
  1. one named coordinator who actually uses it weekly
  2. a conversation at each period close
  3. permission to name the colegio publicly — **contingent on the first
     periodo closing successfully**

Item 3 is worth more than the revenue. Conditionality is what makes it easy to
agree to.

---

## 6. Credibility

**Assets:** a live clickable demo with real Costa Rican fixture data; local
structure encoded in the product; a straight answer on data residency; a named
founder with a face and a reachable WhatsApp number.

**Handled honestly:** zero customers, zero logos, zero testimonials. Do not
paper over it — the pilot framing is the answer.

**Off the page:** tech stack, GitHub, Codingraph (no defined relationship yet;
revisit if it becomes one), the founder's student status (true, answerable if
asked, not foregrounded).

---

## 7. Page structure

One page. Order follows the director's skepticism.

1. **What this is, for whom** — one breath, with the demo immediately available
2. **Do you understand my reality?** — period close, teachers' spreadsheets,
   parents asking for grades
3. **The three portals** — director, docente, estudiante, with real screenshots
4. **Where does my students' data live, and who can see it?**
5. **Qué no incluye** — see below
6. **What exactly is the pilot** — what I get, what you want from me, when
7. **Who are you?**
8. **How do I talk to you** — WhatsApp and email

**Two amendments to the old content seed:**

- The demo is **not a section** — it is persistent. One *Ver la demo* CTA in the
  hero and again above the contact block (see §8 on why one, not three).
- **"Qué no incluye" is new and non-negotiable.** No parent portal, no
  customers yet, data hosted abroad. With this audience an explicit limits
  section buys more trust than any feature list, and it preempts the
  disappointment that would otherwise surface on the first call. Same instinct
  as the privacy page volunteering that records sit outside Costa Rica — which
  is the best sentence currently written anywhere on the property.
- The old item "prove it was built for CR" is **no longer a section**. The
  claim is asserted up front; the demo and the vocabulary carry the proof.

**On parents:** the pain may be named — the school stops assembling grade
information by hand when a parent asks, because the record is current and in
one place. Never imply a parent logs in. No "para las familias" section, no
parent screenshot, no guardian in the portal lineup.

---

## 8. Conversion path

- **Demo: open, zero gate. One CTA, not three.** The original plan called for
  three role buttons; that turned out to be unnecessary. The demo runs on one
  shared account that lands in the **admin console**, and capability-gated
  cross-portal links carry the visitor onward: admin → *Ver consola docente* →
  *Ver portal del estudiante*. All three portals are reachable from one click,
  and the demo login now says so in its panel. Three separate buttons are also
  not implementable pre-authentication, since the login is a single form.
- **Send directors to `demo.simplemanagepro.com`.** Never `pilot.` — that is a
  writable school instance.
- **Demo opens in Spanish**, always, regardless of browser language. EN toggle
  stays available.
- **Primary CTA: WhatsApp with a pre-filled message** — e.g. *"Buenas, soy
  director/a de [colegio] y quisiera conocer más sobre el piloto 2027."*
  Email secondary, for directors who want a written record. No forms, no
  calendar widget, no checkout.
- **OG share card is a first-class deliverable.** Directors forward links in
  WhatsApp, which renders a preview — so the card is the first impression for
  the second reader, who never spoke to Gabriel. 1200×630, Spanish, product
  name + one-line claim + the **director console** screenshot.

---

## 9. Build

| Decision | Choice |
|---|---|
| Framework | **Astro** — zero JS by default, image optimization for screenshots. Next.js was rejected: the page has no routing, no server components, no data fetching to justify it |
| Repo | Separate from the app; `simplemanagepro/` |
| Deploy | Separate Vercel project. Apex + `www` → landing; `demo` and `pilot` stay as they are |
| Design | **Inherit the app's design tokens** (color, type scale, radius, motion); diverge on layout — more spacious, more editorial. Screenshots are the dominant visual content, and a page styled unlike its own product looks like a template |
| Themes | Light and dark; default **light** (institutional register) |
| Screenshots | **Static captures**, cropped per section, each captioned. Not an iframe. Capture only after §11 is complete |
| Language | Spanish only for v1 |
| Analytics | Vercel Analytics — cookie-free, so no consent banner and nothing to explain under Ley 8968 |
| Legal | **Link** the existing `privacy.html` / `terms.html`. Never copy them — two divergent privacy policies is a real liability |

---

## 10. Language notes

Costa Rican Spanish, institutional register, **usted**.

**curso lectivo** (not "año escolar") · **colegio** (secondary; escuela =
primary) · **periodos** · **secciones** · **matrícula** · **notas** ·
**expediente** · **director/a**, **coordinador/a** · **cédula** / **tarjeta de
identificación de menores**

Note on the ID field: it is per-school configurable, and that is *correct for
Costa Rica* — students under 18 carry the tarjeta de identificación de menores
from the TSE while staff carry cédula. It reads as genericness only to someone
who doesn't know the country.

---

## 11. Blocking work before launch

The page asserts *Hecho para Costa Rica* and hands the visitor a demo to check
it against. Shipping the page before the demo is correct fails precisely the
test the page invites — in the first thirty seconds, with the only visitor who
matters.

**Status: cleared.** All of it is merged and live on
`demo.simplemanagepro.com`, verified in-browser. Screenshots are unblocked.

**Done — app repo (`SMP-Web-Page`)**

- [x] Costa Rica localization (#33). ID-label examples are now
      `"Cédula", "DIMEX", "Carné"` — better than the original proposal, since
      DIMEX is the Costa Rican foreign-resident document and *carné* covers
      students registered before a cédula exists. Fixture is `1-1054-0378`;
      `CLAUDE.md` says "Costa Rican schools"
- [x] Demo lands in the admin console (#34)
- [x] Portal-switch icons match their destinations (#35) — admin →
      `admin_panel_settings`, teacher → `co_present`, student → `person`
- [x] Sign-up switch hidden on every build (#36)
- [x] Demo login speaks to a director, school builds stay role-neutral (#37)

The ID-label **mechanism stays** — it is correct for Costa Rica, where students
under 18 carry the tarjeta de identificación de menores and staff carry cédula.
The CSV import aliases (`dni`, `dui`) also stay: invisible header-matching,
where breadth is a feature rather than a claim.

**Done — demo project**

- [x] Costa Rican fixture data — *Colegio Técnico Profesional SMP*, *Yendry
      Rojas Vargas*, Duodécimo, Sección 12-1, two periodos, CR subjects/events
- [x] Demo defaults to Spanish regardless of browser language
- [x] All three portals reachable from the one demo account — verified
      admin → teacher → student

**Done — security**

- [x] Self-signup closed on `pilot.simplemanagepro.com`. Both layers: the UI
      affordance is gone (#36), and Supabase Auth reports
      `disable_signup: true`, which is the layer that actually enforces it.
      Keep it off on every school project

**Still open — not blocking, worth doing**

- [ ] Demo's *Inicio del curso lectivo* reads Feb 9, 2026; MEP's real 2026
      start was Feb 23. Demo database content, not app code

---

## 12. Deliberately deferred

- **Press** — no page, no entry point. Revisit ~July 2027, once a named pilot
  school has closed one periodo.
- **Codingraph** — off the page until the relationship has a defined shape.
- **English version** of the landing page.
- **Displayed pricing** — discussed directly, by school size.
- **Parent portal** — not built, not promised.
