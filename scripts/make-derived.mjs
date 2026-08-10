// Derived image assets, generated from the captured portal screenshots.
//
//   npm run derive
//
// All outputs are committed so `npm run build` never depends on this script.
//
// Cropping is not a workaround; BRIEF §9 specifies "static captures, cropped
// per section". It does two jobs here.
//
// 1. LEGIBILITY. This is the reason the hero crops exist.
//
//    The captures are a 1440 CSS-px console shot at 2x. The hero renders its
//    product visual into a column about 609 CSS px wide, so a full frame is
//    displayed at 0.42x and a 14px table row lands at 5.9px. Nothing about the
//    source file can fix that: it is a scale problem, not a resolution one.
//
//    Every crop below is therefore sized so that displayed width = width / 2,
//    which puts it back at 1:1 with the app's own CSS pixels. That is the whole
//    trick, and it is why the old stat strip was the only readable thing in the
//    composite: at 540 source px shown at 190 CSS px it was 0.70x, while the
//    gradebook beside it was 0.42x.
//
// 2. BLEMISHES. Two things a recapture cannot currently fix:
//
//    - The admin overview reads "Bienvenido, Demo Account". That is the auth
//      user's display name, it lives in auth.users, and app rule 5 puts it
//      behind an explicit ask.
//    - "Asistencia de hoy: Sin datos". Previously believed to be a weekend
//      artifact; a Monday capture shows it too, so it is the demo's fixture
//      data having no attendance for the current date, not the day of the week.
//
//    The stat strip box excludes the welcome card and the whole middle column,
//    so neither can appear.

import sharp from "sharp";
import path from "node:path";

const SHOTS = path.resolve(process.cwd(), "src/assets/screenshots");

// Boxes are in source pixels (2880×1800). Light and dark share them: the
// console's layout is identical between themes, only its colours change.
const CROPS = [
  {
    from: "admin",
    to: "admin-stats",
    // Left column of the overview: Matrícula total 90 · Docentes 8 · Aulas en
    // uso 6/10. The strongest number of the seven, and three that are true on
    // any day. Shown at 270 CSS px.
    box: { left: 480, top: 648, width: 540, height: 592 },
  },
  {
    from: "teacher-gradebook",
    to: "gradebook-rows",
    // Table header plus the first five students, carrying both the ESTUDIANTE
    // and NOTA columns. The width is set by NOTA at source x≈1738: a narrower
    // box crops it off and leaves a gradebook with no grades in it, which is
    // not a gradebook. COMPLETADO starts at 2121 and would push this past
    // 720 CSS px, so it is left out rather than shrink the whole fragment.
    // Shown at 680 CSS px.
    box: { left: 496, top: 688, width: 1360, height: 608 },
  },
  {
    from: "m-teacher-gradebook",
    to: "gradebook-rows-mobile",
    scale: 3,
    // Same table, from the 390px @3x capture, so a phone gets the fragment at
    // 1:1 too instead of the desktop crop at 0.53x. 1074 source px = 358 CSS
    // px, which is exactly the usable width inside a 390px viewport once the
    // page's own gutters are taken off.
    box: { left: 12, top: 1616, width: 1074, height: 836 },
  },
];

for (const crop of CROPS) {
  const scale = crop.scale ?? 2;
  for (const suffix of ["", "-dark"]) {
    const from = path.join(SHOTS, `${crop.from}${suffix}.png`);
    const to = path.join(SHOTS, `${crop.to}${suffix}.png`);
    const { width, height } = await sharp(from).extract(crop.box).toFile(to);
    console.log(
      `${crop.to}${suffix}.png  ${width}×${height}  → show at ${width / scale}px`,
    );
  }
}
