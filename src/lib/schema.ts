const ORIGIN = "https://simplemanagepro.com";

/** BreadcrumbList for a subpage. The home crumb is added here so no caller has
 *  to remember it, and so every subpage agrees on what it is called. */
export function breadcrumbLd(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: `${ORIGIN}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name,
        // Trailing slash so the crumb matches the page's own canonical
        // (/contacto/), not the slashless form that reads as a separate URL.
        item: `${ORIGIN}${path.replace(/\/$/, "")}/`,
      },
    ],
  };
}

/** FAQPage for /piloto's straight-answers block. The questions on the page and
 *  the questions in this graph must stay identical: marking up copy the reader
 *  cannot see is a structured-data violation, not a shortcut. */
export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}
