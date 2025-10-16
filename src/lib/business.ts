// lib/business.ts
export const business = {
  name: "reset. Schwerin",
  phoneHuman: "0176 / 72190267",
  phoneLink: "+4917672190267",
  whatsappLink:
    "https://wa.me/4917672190267?text=Hallo%20reset.%20Anfrage%20aus%20Schwerin",
  email: "info@reset-service.de",
  address: {
    street: "Wuppertaler Str. 34",
    zip: "19063",
    city: "Schwerin",
  },
  serviceArea: "Schwerin & Umgebung",
  openingHours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "07:00", closes: "20:00" },
    { days: ["Saturday"], opens: "09:00", closes: "15:00" },
  ],
} as const;

export function buildLocalBusinessLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    address: {
      "@type": "PostalAddress",
      addressLocality: business.address.city,
      postalCode: business.address.zip,
      streetAddress: business.address.street,
      addressCountry: "DE",
    },
    telephone: business.phoneLink,
    url: "https://reset-schwerin.example",
    sameAs: [business.whatsappLink],
    openingHours: ["Mo-Fr 07:00-20:00", "Sa 09:00-15:00"],
    openingHoursSpecification: business.openingHours.map((o) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: o.days,
      opens: o.opens,
      closes: o.closes,
    })),
    areaServed: business.serviceArea,
    priceRange: "€€",
  } as const;
}
