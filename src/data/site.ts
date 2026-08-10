import type { ImageMetadata } from "astro";

import adminShot from "../assets/screenshots/admin.png";
import adminShotDark from "../assets/screenshots/admin-dark.png";
import teacherShot from "../assets/screenshots/teacher.png";
import teacherShotDark from "../assets/screenshots/teacher-dark.png";
import gradebookShot from "../assets/screenshots/teacher-gradebook.png";
import gradebookShotDark from "../assets/screenshots/teacher-gradebook-dark.png";
import studentShot from "../assets/screenshots/student.png";
import studentShotDark from "../assets/screenshots/student-dark.png";

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
  image: ImageMetadata;
  imageDark: ImageMetadata;
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
    image: adminShot,
    imageDark: adminShotDark,
    alt: "Consola de administración mostrando el resumen del Colegio Técnico Profesional SMP: matrícula total, docentes, materias, secciones y aulas en uso.",
  },
  {
    id: "docentes",
    label: "Consola del docente",
    title: "El libro de notas que reemplaza el archivo de Excel",
    short:
      "Categorías ponderadas, asistencia por sección e informe de progreso listo para imprimir.",
    body: "Categorías ponderadas, notas por periodo, asistencia por sección, registro disciplinario e informe de progreso listo para imprimir. Al cerrar el periodo, las notas ya están donde tienen que estar.",
    image: gradebookShot,
    imageDark: gradebookShotDark,
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
    image: studentShot,
    imageDark: studentShotDark,
    alt: "Portal del estudiante mostrando asistencia, promedio de notas, resumen de calificaciones por periodo y próximos eventos.",
  },
];

/** Section 2's visual contrast. Each item is one of the sources that has to be
 *  reconciled by hand at period close, named as an object the director
 *  recognises rather than as an abstraction. */
export const patchwork = [
  { label: "Notas de 7° A", meta: "notas_7A_final.xlsx" },
  { label: "Asistencia", meta: "cuaderno, en papel" },
  { label: "Notas de 8° B", meta: "copia_de_notas_v3.xlsx" },
  { label: "Grupo de docentes", meta: "WhatsApp" },
  { label: "Matrícula 2026", meta: "matricula_ok.xlsx" },
  { label: "Notas de 9° A", meta: "notas9A_REVISADO.xlsx" },
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

/** The old "Qué no incluye" list, reframed.
 *
 *  Same three facts, and none of them softened: BRIEF §7 keeps this as a trust
 *  device and the candor is the whole point. What changed is the framing. A
 *  list of deficits under "para que no lo descubra en la primera reunión"
 *  announces bad news before the reader has asked; the same content as the
 *  director's own questions, answered straight, reads as candor instead. It
 *  also moved off the home page, where it was the first impression. */
export const faq = [
  {
    q: "¿Hay un portal para los encargados?",
    a: "No. Los encargados figuran como contacto en el expediente del estudiante, y son los docentes quienes los consultan. No tienen usuario propio.",
  },
  {
    q: "¿Qué colegios lo usan hoy?",
    a: "Ninguno todavía. Por eso esto es un piloto y no una venta, y por eso el primer curso lectivo se acompaña de cerca.",
  },
  {
    q: "¿Dónde se alojan los expedientes?",
    a: "En Estados Unidos, fuera del país. Está dicho también en la política de privacidad, y es de lo primero que un colegio debería preguntar.",
  },
];
