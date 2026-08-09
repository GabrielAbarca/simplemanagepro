// Derived image assets, generated from the captured portal screenshots.
//
//   npm run derive
//
// Two outputs, both committed so `npm run build` never depends on this script:
//
//   src/assets/screenshots/admin-stats{,-dark}.png
//     A vertical strip of three stat tiles from the admin overview, used as
//     the floating foreground plane of the hero composite.
//
//     Cropping is what makes the admin capture usable at all. The full frame
//     carries two blemishes that a recapture cannot currently fix: the welcome
//     card reads "Bienvenido, Demo Account" (the auth user's display name,
//     which lives in auth.users and is out of bounds for this repo), and the
//     "Asistencia de hoy" tile reads "Sin datos" because both capture runs so
//     far have landed on a Sunday. This box excludes the welcome card and the
//     entire middle column, so neither can appear. It keeps the left column:
//     Matrícula total 90 · Docentes 8 · Aulas en uso 6/10 — the strongest
//     number of the seven, and three that are true on any day of the week.
//
//     BRIEF §9 already specifies "static captures, cropped per section", so
//     this is the sanctioned treatment rather than a workaround.
//
//   public/og.png
//     See scripts/make-og.mjs — rendered separately, through a browser, so it
//     can use the real Poppins files.

import sharp from "sharp";
import path from "node:path";

const SHOTS = path.resolve(process.cwd(), "src/assets/screenshots");

// Source captures are 2880×1800 (a 1440×900 viewport at 2x). The box is in
// those source pixels. Light and dark share it: the console's layout is
// identical between themes, only its colours change.
const STAT_STRIP = { left: 480, top: 648, width: 540, height: 592 };

for (const suffix of ["", "-dark"]) {
  const from = path.join(SHOTS, `admin${suffix}.png`);
  const to = path.join(SHOTS, `admin-stats${suffix}.png`);
  const { width, height } = await sharp(from).extract(STAT_STRIP).toFile(to);
  console.log(`admin-stats${suffix}.png  ${width}×${height}`);
}
