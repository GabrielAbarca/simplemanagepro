// Every route the site publishes. Both the contrast audit and the review
// harness used to hit "/" only, which was correct while the site was one
// document and silently stopped covering most of it the moment it was not.
//
// Keep in step with src/config.ts NAV plus "/".

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
