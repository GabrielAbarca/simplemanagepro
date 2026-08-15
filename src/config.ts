// Single source for the values that appear on more than one route. DEMO_URL
// used to be declared separately in Header.astro and index.astro; at five
// routes that becomes five copies and one of them eventually goes stale.

export const DEMO_URL = "https://demo.simplemanagepro.com";

// Legal pages live on the demo origin. BRIEF §9: link them, never copy them —
// two divergent privacy policies is a real liability.
export const PRIVACY_URL = `${DEMO_URL}/privacy.html`;
export const TERMS_URL = `${DEMO_URL}/terms.html`;

// TODO: real number. wa.me wants digits only, country code first (506 = CR).
<<<<<<< HEAD
export const WHATSAPP = "50600000000";
// Brand-domain address: the page's subject is data custody, so the contact a
// director writes to should sit on the same domain, not a personal one. Feeds
// the /contacto page and the Organization JSON-LD. The mailbox must be live
// before deploy.
export const EMAIL = "contacto@simplemanagepro.com";
=======
export const WHATSAPP = "50671848300";
export const EMAIL = "contact@gzelaya.com";
>>>>>>> 879d5b8ca10ea659cd65614cf26e733197e8e9ab

export const WHATSAPP_MSG =
  "Buenas, soy director/a de [colegio] y quisiera conocer más sobre el piloto 2027.";

export const waHref = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
  WHATSAPP_MSG,
)}`;

// Nav order is the director's reading order, not the sitemap's: what it is,
// then what it costs to try, then who is behind it, then how to make contact.
export const NAV = [
  { href: "/portales", label: "Portales" },
  { href: "/piloto", label: "Piloto 2027" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
] as const;

export const SITE_NAME = "Simple Manage Pro";
