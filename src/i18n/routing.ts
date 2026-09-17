import { defineRouting } from "next-intl/routing";

export const locales = ["sl", "en", "de"] as const;
export type Locale = (typeof locales)[number];

/**
 * Localized URL slugs (e.g. /en/services, /de/leistungen). They are rewritten
 * to the internal Slovenian paths by the proxy. The static export (GitHub Pages
 * demo) has no proxy, so it uses the internal paths for every language.
 */
const localizedPathnames = {
  "/": "/",
  "/storitve": { sl: "/storitve", en: "/services", de: "/leistungen" },
  "/reference": { sl: "/reference", en: "/references", de: "/referenzen" },
  "/reference/gumarska-industrija": {
    sl: "/reference/gumarska-industrija",
    en: "/references/rubber-industry",
    de: "/referenzen/gummiindustrie",
  },
  "/reference/robotske-celice": {
    sl: "/reference/robotske-celice",
    en: "/references/robot-cells",
    de: "/referenzen/roboterzellen",
  },
  "/reference/avtomatizacija": {
    sl: "/reference/avtomatizacija",
    en: "/references/automation",
    de: "/referenzen/automatisierung",
  },
  "/o-podjetju": { sl: "/o-podjetju", en: "/about", de: "/unternehmen" },
  "/kontakt": { sl: "/kontakt", en: "/contact", de: "/kontakt" },
  "/piskotki": { sl: "/piskotki", en: "/cookies", de: "/cookies" },
  "/zasebnost": { sl: "/zasebnost", en: "/privacy", de: "/datenschutz" },
  "/pravno-obvestilo": {
    sl: "/pravno-obvestilo",
    en: "/legal-notice",
    de: "/impressum",
  },
} as const;

const isStatic = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

const pathnames = isStatic
  ? (Object.fromEntries(Object.keys(localizedPathnames).map((k) => [k, k])) as {
      [K in keyof typeof localizedPathnames]: K;
    })
  : localizedPathnames;

export const routing = defineRouting({
  locales,
  defaultLocale: "sl",
  localePrefix: "always",
  localeCookie: {
    name: "haja_locale",
    maxAge: 60 * 60 * 24 * 365,
  },
  pathnames,
});

export type AppPathname = keyof typeof localizedPathnames;
