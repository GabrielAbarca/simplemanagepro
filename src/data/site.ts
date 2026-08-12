import type { ImageMetadata } from "astro";

import adminShot from "../assets/screenshots/admin.png";
import adminShotDark from "../assets/screenshots/admin-dark.png";
import adminShotM from "../assets/screenshots/m-admin.png";
import adminShotMDark from "../assets/screenshots/m-admin-dark.png";
import teacherShot from "../assets/screenshots/teacher.png";
import teacherShotDark from "../assets/screenshots/teacher-dark.png";
import gradebookShot from "../assets/screenshots/teacher-gradebook.png";
import gradebookShotDark from "../assets/screenshots/teacher-gradebook-dark.png";
import gradebookShotM from "../assets/screenshots/m-teacher-gradebook.png";
import gradebookShotMDark from "../assets/screenshots/m-teacher-gradebook-dark.png";
import gradebookShotT from "../assets/screenshots/t-teacher-gradebook.png";
import gradebookShotTDark from "../assets/screenshots/t-teacher-gradebook-dark.png";
import studentShot from "../assets/screenshots/student.png";
import studentShotDark from "../assets/screenshots/student-dark.png";
import studentShotM from "../assets/screenshots/m-student.png";
import studentShotMDark from "../assets/screenshots/m-student-dark.png";

export interface Portal {
  id: string;
  /** The portal's own name. Rendered as a prominent label, not a small eyebrow:
   *  the reader has to know which console they are looking at before they read
   *  the claim about it. */
  label: string;
  title: string;
  /** One line for the home page's condensed lineup. */
  short: string;
  body: string;
  /** Three concrete things this console does, so a card is not one claim and a
   *  picture. Kept to three: a fourth turns a card into a feature list. */
  capabilities: string[];
  /** Which of the three portal accents this console wears, everywhere it
   *  appears. See tokens.css for why these are fills and never text. */
  accent: string;
  /** Drawn wireframe used where a screenshot would be too small to read. */
  glyph: "direccion" | "docente" | "estudiante";
  image: ImageMetadata;
  imageDark: ImageMetadata;
  /** 390@3x capture, so a phone gets a phone-shaped console at 1:1 instead of
   *  a desktop frame at 0.3x. */
  mobileImage: ImageMetadata;
  mobileImageDark: ImageMetadata;
  /** 1180@2x landscape capture. Only the docente console has one, because only
   *  the home hero's lineup needs a tablet and only the gradebook is in it.
   *  1180 is above the app's desktop breakpoint, so this is the tablet layout
   *  with its collapsed icon rail rather than the phone layout enlarged. */
  tabletImage?: ImageMetadata;
  tabletImageDark?: ImageMetadata;
  alt: string;
  /** Second capture, shown only on /portales where there is room for it. */
  extraImage?: ImageMetadata;
  extraImageDark?: ImageMetadata;
  extraAlt?: string;
}

export const portals: Portal[] = [
  {
    id: "direccion",
    label: "Consola de la dirección",
    title: "El colegio completo, configurado desde un solo lugar",
    short:
      "Curso lectivo, periodos, secciones, materias, docentes y matrícula, en un solo tablero.",
    body: "Curso lectivo y periodos, niveles, secciones, aulas, materias, docentes, horarios, expedientes y matrícula. La matrícula entra directamente desde un archivo de Excel.",
    capabilities: [
      "Curso lectivo y periodos, con sus fechas",
      "Niveles, secciones, aulas y horarios",
      "Matrícula importada desde su archivo de Excel",
    ],
    accent: "var(--accent-direccion)",
    glyph: "direccion",
    image: adminShot,
    imageDark: adminShotDark,
    mobileImage: adminShotM,
    mobileImageDark: adminShotMDark,
    alt: "Consola de administración mostrando el resumen del Colegio Técnico Profesional SMP: matrícula total, docentes, materias, secciones y aulas en uso.",
  },
  {
    id: "docentes",
    label: "Consola del docente",
    title: "El libro de notas que reemplaza el archivo de Excel",
    short:
      "Categorías ponderadas, asistencia por sección e informe de progreso listo para imprimir.",
    body: "Categorías ponderadas, notas por periodo, asistencia por sección, registro disciplinario e informe de progreso listo para imprimir. Al cerrar el periodo, las notas ya están donde tienen que estar.",
    capabilities: [
      "Categorías ponderadas por periodo",
      "Asistencia por sección, también desde el teléfono",
      "Informe de progreso listo para imprimir",
    ],
    accent: "var(--accent-docente)",
    glyph: "docente",
    image: gradebookShot,
    imageDark: gradebookShotDark,
    mobileImage: gradebookShotM,
    mobileImageDark: gradebookShotMDark,
    tabletImage: gradebookShotT,
    tabletImageDark: gradebookShotTDark,
    alt: "Libro de notas de Matemáticas, Undécimo Sección 1, mostrando la nota de cada estudiante en el II Periodo.",
    extraImage: teacherShot,
    extraImageDark: teacherShotDark,
    extraAlt:
      "Vista de las clases del docente, con cada sección y materia asignada.",
  },
  {
    id: "estudiantes",
    label: "Portal del estudiante",
    title: "Lo que el estudiante necesita, sin tener que pedirlo",
    short:
      "Promedio, asistencia, horario semanal y notas por periodo, desde el teléfono.",
    body: "Promedio, porcentaje de asistencia, notas por materia y periodo, horario semanal, docentes y la cartelera de eventos del colegio. Consultable en cualquier momento, desde el teléfono.",
    capabilities: [
      "Promedio y porcentaje de asistencia al día",
      "Notas por materia y por periodo",
      "Horario semanal y cartelera del colegio",
    ],
    accent: "var(--accent-estudiante)",
    glyph: "estudiante",
    image: studentShot,
    imageDark: studentShotDark,
    mobileImage: studentShotM,
    mobileImageDark: studentShotMDark,
    alt: "Portal del estudiante mostrando asistencia, promedio de notas, resumen de calificaciones por periodo y próximos eventos.",
  },
];

/** Section 2, as three jobs rather than one pile.
 *
 *  Each row is a thing the colegio already does every period, shown twice: the
 *  objects it is done with today, and the one console that replaces them. It
 *  used to be a single six-item scatter beside a single "un solo sistema"
 *  card, which said there was a mess but never said what the product does
 *  about any particular part of it.
 *
 *  `kind` picks the glyph on the "hoy" side, and it is still the argument that
 *  block is making. Identical pills would say "three things"; things that are
 *  visibly a spreadsheet, a paper cuaderno and a chat thread say what KIND of
 *  mess it is, which is the part the director recognises.
 *
 *  `accent` is the console that does the work, so the colour is a claim about
 *  which portal this lands in and not decoration. Two of the three are the
 *  docente console, because two of the three are the docente's job. */
export type SourceKind = "sheet" | "paper" | "chat";
export type FixGlyph = "asistencia" | "notas" | "matricula";

export const contrasts: {
  id: string;
  job: string;
  hoy: { label: string; meta: string; kind: SourceKind }[];
  cost: string;
  fix: { title: string; body: string; glyph: FixGlyph; accent: string };
}[] = [
  {
    id: "asistencia",
    job: "Asistencia",
    hoy: [
      { label: "Asistencia de 7° A", meta: "cuaderno, en papel", kind: "paper" },
      { label: "Ausencias del mes", meta: "conteo a mano", kind: "paper" },
      { label: "Avisos de ausencia", meta: "WhatsApp", kind: "chat" },
    ],
    cost: "Alguien tiene que pasar cada lista a un archivo antes de poder contar nada.",
    fix: {
      title: "Panel de asistencia",
      body: "La lista se toma en el sistema y el reporte del mes sale en unos clics, por sección o por estudiante.",
      glyph: "asistencia",
      accent: "var(--accent-docente)",
    },
  },
  {
    id: "notas",
    job: "Notas",
    hoy: [
      { label: "Notas de 7° A", meta: "notas_7A_final.xlsx", kind: "sheet" },
      { label: "Notas de 8° B", meta: "copia_de_notas_v3.xlsx", kind: "sheet" },
      { label: "Notas de 9° A", meta: "notas9A_REVISADO.xlsx", kind: "sheet" },
    ],
    cost: "Un archivo por docente, y al cierre nadie sabe cuál versión es la buena.",
    fix: {
      title: "Libro de notas",
      body: "Categorías ponderadas por periodo. Al cerrar, las notas ya están donde tienen que estar.",
      glyph: "notas",
      accent: "var(--accent-docente)",
    },
  },
  {
    id: "matricula",
    job: "Matrícula",
    hoy: [
      { label: "Matrícula 2026", meta: "matricula_ok.xlsx", kind: "sheet" },
      { label: "Cambios de sección", meta: "correo", kind: "chat" },
      { label: "Expedientes", meta: "carpetas en papel", kind: "paper" },
    ],
    cost: "La misma lista, tecleada otra vez en cada lugar que la necesita.",
    fix: {
      title: "Matrícula importada",
      body: "El mismo archivo de Excel entra directo, con secciones y expedientes ya asociados.",
      glyph: "matricula",
      accent: "var(--accent-direccion)",
    },
  },
];

export const pilotGives = [
  "El sistema configurado con la estructura de su colegio: curso lectivo, periodos, niveles, secciones, materias, docentes y horarios.",
  "La matrícula importada desde sus archivos de Excel, y las cuentas de docentes y estudiantes creadas.",
  "Su propia base de datos, con respaldos verificados antes de que entre un solo expediente real.",
  "Acompañamiento durante todo el curso lectivo, por WhatsApp, con la persona que construyó el sistema.",
];

export const pilotAsks = [
  "Una persona de contacto que lo use todas las semanas, normalmente la coordinación académica.",
  "Una conversación al cierre de cada periodo, para corregir lo que no sirva.",
  "Permiso para nombrar al colegio públicamente, si el primer periodo cierra bien.",
];

/** The questions a director actually asks before the first meeting.
 *
 *  This block began as "Qué no incluye" and then as three deficits reframed as
 *  questions. Gabriel's call, August 2026: the no-encargado-portal and
 *  no-colegios-yet answers come off the page and get handled in the
 *  conversation, where they can be answered with context. Recorded in BRIEF §7
 *  rather than taken quietly.
 *
 *  Data residency stays, here and in the home page's Datos section. It is the
 *  one a colegio should ask first, it is already in the privacy policy, and
 *  volunteering it is worth more than it costs.
 *
 *  These are marked up as FAQPage (lib/schema.ts). The questions in the graph
 *  and the questions on the page must stay identical: marking up copy the
 *  reader cannot see is a structured-data violation, not a shortcut. */
export const faq = [
  {
    q: "¿Se puede dejar un colegio configurado desde cero en menos de una hora?",
    a: "La estructura sí: curso lectivo, periodos, niveles, secciones, materias y aulas se configuran en esa primera sesión, y la matrícula entra importada desde su archivo de Excel. Lo que toma tiempo no es el sistema, es ponerse de acuerdo en cómo está organizado el colegio.",
  },
  {
    q: "¿Cada docente entra con su propia cuenta?",
    a: "Sí. Cada docente recibe su usuario y ve únicamente sus secciones, sus materias y sus estudiantes. La dirección crea y desactiva esas cuentas desde su consola, sin depender de nadie más.",
  },
  {
    q: "¿Los estudiantes también entran?",
    a: "Sí, con su propio usuario. Ven su promedio, su porcentaje de asistencia, su horario semanal y sus notas por materia y periodo. No pueden modificar nada.",
  },
  {
    q: "¿Podemos traer lo que ya tenemos en Excel?",
    a: "Sí. La matrícula se importa desde el archivo que el colegio ya usa, y lo mismo con docentes y secciones. No hay que volver a digitar el colegio entero para empezar.",
  },
  {
    q: "¿Esto reemplaza algo del MEP?",
    a: "No. Simple Manage Pro no reemplaza nada del MEP. Ordena la información que el colegio ya maneja por dentro: notas, asistencia, horarios, expedientes y matrícula.",
  },
  {
    q: "¿Funciona desde el teléfono?",
    a: "Sí. Docentes y estudiantes entran desde el teléfono con el mismo usuario, que es donde se pasa asistencia y donde se consultan notas. La configuración del colegio se hace más cómoda desde una computadora.",
  },
  {
    q: "¿Dónde se alojan los expedientes?",
    a: "En Estados Unidos, fuera del país. Está dicho también en la política de privacidad, y es de lo primero que un colegio debería preguntar.",
  },
  {
    q: "¿Y si algo falla durante el curso lectivo?",
    a: "Escribe por WhatsApp y le contesta la persona que construyó el sistema y puede cambiarlo. Por eso el piloto es de tres colegios y no de treinta.",
  },
];

/** /nosotros. Dates carry real information here, which is what justifies a
 *  timeline rather than three paragraphs. */
export const story = [
  {
    year: "2024",
    title: "Un proyecto de feria científica",
    body: "El problema es el mismo que sigue siendo hoy: al cierre de cada periodo, alguien arma las notas a mano desde archivos sueltos.",
  },
  {
    year: "2025",
    title: "De prototipo a sistema",
    body: "Las tres consolas, los periodos ponderados, la asistencia por sección y la matrícula. Deja de ser un proyecto y empieza a ser software.",
  },
  {
    year: "2026",
    title: "Una demo pública, con datos costarricenses",
    body: "Curso lectivo, secciones, cédula y materias en español, abierta para que cualquier colegio la revise sin pedir permiso ni dejar datos.",
  },
  {
    year: "2027",
    title: "Tres colegios",
    body: "El piloto arranca en febrero, con el curso lectivo. Cada colegio con su estructura y su propia base de datos.",
  },
];
