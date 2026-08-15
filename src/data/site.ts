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
  /** Paragraph-length elaboration shown only on /portales, below `body`.
   *  Rendered with set:html so a sentence can carry one contextual link. The
   *  home page never renders it, so growing it does not touch the lineup cards. */
  detail?: string[];
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
      "Curso lectivo, periodos, secciones, materias, docentes y matrícula, en un solo lugar.",
    body: "Curso lectivo y periodos, niveles, secciones, aulas, materias, docentes, horarios, expedientes y matrícula. La información se pueden importar directamente desde un archivo de Excel.",
    detail: [
      "Desde esta consola la dirección y la coordinación arman el curso lectivo antes de que empiecen las clases. Se definen los periodos de evaluación con su peso, de modo que la suma siempre cierra en cien por ciento, y quedan registrados los niveles, las secciones con su profesor guía y las aulas con su capacidad y su tipo, sea aula, laboratorio, biblioteca o gimnasio. Cada lista, desde los grados hasta la matrícula, se puede cargar de una vez desde un archivo, sin digitar registro por registro. Las materias se ordenan en un catálogo con su código y su color, y cada docente queda registrado con su cédula, su correo y su especialización.",
      "El horario semanal se arma por sección sobre las jornadas ya definidas, una sección puede copiar la semana de otra para no empezar de cero, y la consola avisa cuando dos clases coinciden en la misma aula o con el mismo docente, así que un choque se corrige antes de llegar al aula. El resumen muestra la matrícula total, la asistencia del mes y los estudiantes en riesgo por ausencias. El campo de identificación se ajusta al término que use cada colegio, sea cédula, DIMEX o tarjeta de identificación de menores, porque el sistema está <a href=\"/nosotros/\">hecho para el colegio costarricense</a> y no traducido de otro país.",
    ],
    capabilities: [
      "Curso lectivo y periodos, con sus fechas",
      "Niveles, secciones, aulas y horarios",
      "Matrícula importada desde su archivo de Excel",
      "Manejo de credenciales de docentes y estudiantes",
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
    title: "El libro de notas digital reemplaza el archivo de Excel",
    short:
      "Categorías ponderadas, asistencia por sección e informe de progreso listo para imprimir.",
    body: "Categorías ponderadas, notas por periodo, asistencia por sección, registro disciplinario e informe de progreso listo para imprimir. Al cerrar el periodo, las notas ya están unificadas y disponibles para el estudiante.",
    detail: [
      "El docente entra y ve primero las clases del día, cada una con su hora, su sección y el aula, y con la asistencia y el libro de notas a un toque. Pasar lista es marcar a cada estudiante como presente, ausente, tardía o justificada, con espacio para una observación, y la consola va sumando las ausencias y señalando quién queda en riesgo por inasistencia. Desde Mis clases pasa de un grupo a otro, y cada clase trae su lista, su libro de notas, su asistencia y su horario en el mismo lugar.",
      "El libro de notas trabaja por periodo y por categorías con su peso, así que la nota de cada estudiante se calcula sola conforme se califican las tareas. El docente arma sus categorías, agrega las tareas y, cuando el periodo está listo, publica las notas para que el estudiante las vea desde su portal. El trabajo que antes vivía repartido en archivos de Excel queda en una sola vista, por sección y por materia, y llega al cierre del periodo ya unificado.",
    ],
    capabilities: [
      "Categorías ponderadas por periodo",
      "Asistencia por sección, también desde el teléfono",
      "Informe de progreso listo para imprimir",
      "Desglose de clases y estudiantes, con notas y asistencia por periodo",
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
    detail: [
      "El estudiante abre el portal desde el teléfono y encuentra, sin tener que pedirlo, su promedio del curso lectivo, su porcentaje de asistencia y cuál es su próxima clase. El resumen de notas presenta cada materia con su calificación por periodo y el promedio, de modo que sabe dónde va parado mientras el periodo sigue abierto, no cuando ya no hay nada que hacer. En la sección de asistencia ve el detalle de cada ausencia y si quedó justificada, sin tener que preguntar en la oficina.",
      "En el mismo lugar consulta el horario de la semana, la lista de sus docentes con los datos para contactarlos y la cartelera con las fechas del colegio, desde los exámenes de cada periodo hasta la matrícula del próximo curso lectivo. Todo lo que el docente publica y la dirección configura aparece aquí en el momento, así que lo que ve el estudiante es la misma información que está en la consola. Es lo que un colegio pone a funcionar durante <a href=\"/piloto/\">el piloto 2027</a>.",
    ],
    capabilities: [
      "Promedio y porcentaje de asistencia al día",
      "Notas por materia y por periodo",
      "Horario semanal y eventos del colegio",
      "Lista de profesores y materias, con sus datos de contacto",
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
    cost: "El profesor pasa la información de múltiples fuentes, dando lugar a un margen de error.",
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
    cost: "Horas unificando información de distintos archivos, toma tiempo y esfuerzo.",
    fix: {
      title: "Libro de notas",
      body: "Categorías ponderadas por periodo. Toda la información de notas queda en un solo lugar, y el informe de progreso sale listo para imprimir.",
      glyph: "notas",
      accent: "var(--accent-docente)",
    },
  },
  {
    id: "matricula",
    job: "Documentos",
    hoy: [
      { label: "Matrícula 2026", meta: "matricula_ok.xlsx", kind: "sheet" },
      { label: "Cambios de sección", meta: "correo", kind: "chat" },
      { label: "Expedientes", meta: "carpetas en papel", kind: "paper" },
    ],
    cost: "Documentos interminables, difíciles de leer.",
    fix: {
      title: "Documentos importados",
      body: "Nuestro sistema escanéa su archivo de Excel y lo añade al sistema, sus documentos se muestran en cuestión de segundos.",
      glyph: "matricula",
      accent: "var(--accent-direccion)",
    },
  },
];

export const pilotGives = [
  "El sistema configurado con la estructura de su colegio: curso lectivo, periodos, niveles, secciones, materias, docentes y horarios.",
  "La información previa fundamental importada desde sus archivos de Excel, y las cuentas de docentes y estudiantes creadas.",
  "Su propia base de datos, con respaldos verificados antes de que entre un solo dato real.",
  "Acompañamiento durante todo el curso lectivo, manteniendo el sistema funcionando y en constante mejora.",
];

export const pilotAsks = [
  "Uso real del sistema con la estructura de su colegio durante un periodo establecido.",
  "Una conversación al cierre de el periodo, con fines de recibir retroalimentación de nuestro servicio.",
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
    q: "¿Podemos traer lo que ya tenemos en Excel?",
    a: "Sí. Los documentos se importan desde los archivos que el colegio ya usa, y lo mismo con docentes y secciones. No hay que volver a digitar el colegio entero para empezar.",
  },
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
    q: "¿Esto reemplaza algo del MEP?",
    a: "No. Simple Manage Pro no reemplaza nada del MEP. Ordena la información que el colegio ya maneja por dentro: notas, asistencia, horarios, expedientes y documentos para una mejor experiencia administrativa.",
  },
  {
    q: "¿Funciona desde el teléfono?",
    a: "Sí. Docentes y estudiantes entran desde el teléfono con el mismo usuario, que es donde se pasa asistencia y donde se consultan notas. Sin embargo, la configuración del colegio se hace más cómoda desde una computadora.",
  },
  {
    q: "¿Dónde se aloja la información?",
    a: "En Estados Unidos, fuera del país. Está dicho también en la política de privacidad.",
  },
  {
    q: "¿Y si algo falla durante el curso lectivo?",
    a: "Escribe por cualquier medio de contacto disponible y recibe respuesta en menos de 24h. Al ser un piloto de tres colegios, el soporte es prioritario y se atiende de inmediato.",
  },
];

/** /nosotros. Dates carry real information here, which is what justifies a
 *  timeline rather than three paragraphs. */
export const story = [
  {
    year: "2024",
    title: "Un proyecto de feria científica",
    body: "La idea fue plasmada en un proyecto de feria científica, con un prototipo estático que mostraba mucho potencial, ganando así el segundo puesto de la feria.",
  },
  {
    year: "2025",
    title: "De prototipo a sistema",
    body: "Las tres consolas, los periodos ponderados, la asistencia por sección y la matrícula. se empezó a construir un software funcional con un propoósito.",
  },
  {
    year: "2026",
    title: "Lanzamiento oficial del sistema junto a la demo pública",
    body: "Curso lectivo, secciones, cédula y materias en español, abierta para que cualquier colegio la revise sin pedir permiso ni dejar datos.",
  },
  {
    year: "2027",
    title: "Tres colegios",
    body: "El piloto arranca en febrero con el curso lectivo 2027. Cada colegio con su estructura y su propia base de datos.",
  },
];
