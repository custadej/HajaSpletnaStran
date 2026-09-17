export const site = {
  name: "HAJA d.o.o.",
  legalName: "HAJA, sistemi v avtomatizaciji, d.o.o.",
  shortName: "HAJA",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.haja.si").replace(/\/$/, ""),
  email: "info@haja.si",
  phone: "+386 31 395 374",
  phoneHref: "tel:+38631395374",
  address: {
    street: "Naraplje 11",
    postalCode: "2322",
    city: "Majšperk",
    country: "Slovenija",
    countryCode: "SI",
  },
  registrationNumber: "8034095000",
  taxNumber: "48233897",
  contactPerson: "Peter Čuš",
  founded: 2017,
  linkedin: "https://www.linkedin.com/in/peter-cus-758451b/",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Naraplje+11%2C+2322+Maj%C5%A1perk%2C+Slovenija",
  geo: { lat: 46.3563, lng: 15.7336 },
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
  author: { name: "cus.si", url: "https://cus.si" },
} as const;

export const localeMeta = {
  sl: { label: "Slovenščina", short: "SL", hrefLang: "sl-SI", ogLocale: "sl_SI" },
  en: { label: "English", short: "EN", hrefLang: "en", ogLocale: "en_GB" },
  de: { label: "Deutsch", short: "DE", hrefLang: "de", ogLocale: "de_DE" },
} as const;
