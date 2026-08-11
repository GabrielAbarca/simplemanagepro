// Every route the site publishes. Both the contrast audit and the review
// harness used to hit "/" only, which was correct while the site was one
// document and silently stopped covering most of it the moment it was not.
//
// Keep in step with src/config.ts NAV plus "/".

/** Where the harnesses look for the site.
 *
 *  Only one process can hold :4321. A second `npm run preview` silently moves
 *  to :4322 and every harness then measures the STALE build, which reads as
 *  "my change did nothing" and has cost a session before. When something else
 *  already has the port — a dev server someone left running — start preview
 *  elsewhere and point the harnesses at it rather than guessing:
 *
 *      npx astro preview --port 4325
 *      PREVIEW_URL=http://localhost:4325 npm run audit:contrast
 */
export const BASE_URL = process.env.PREVIEW_URL || "http://localhost:4321";

export const ROUTES = [
  { path: "/", slug: "home" },
  { path: "/portales/", slug: "portales" },
  { path: "/piloto/", slug: "piloto" },
  { path: "/nosotros/", slug: "nosotros" },
  { path: "/contacto/", slug: "contacto" },
];

/** Allow a single-route run while iterating: ROUTE=/piloto/ npm run review */
export function selectedRoutes() {
  const only = process.env.ROUTE;
  if (!only) return ROUTES;
  const hit = ROUTES.filter((r) => r.path === only || r.slug === only);
  if (!hit.length) {
    throw new Error(
      `ROUTE="${only}" matches nothing. Known: ${ROUTES.map((r) => r.slug).join(", ")}`,
    );
  }
  return hit;
}
