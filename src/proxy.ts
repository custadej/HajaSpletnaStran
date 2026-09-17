import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing, type Locale } from "./i18n/routing";

/**
 * Locale negotiation:
 * 1. A locale prefix already in the URL wins.
 * 2. A remembered choice (cookie set by the language switcher) wins next.
 * 3. Otherwise the visitor's country (from the hosting platform's geo header)
 *    picks Slovenian for Slovenia and German for DE / AT / CH.
 * 4. Otherwise next-intl matches the browser's Accept-Language header.
 * 5. Fallback: English for everyone else.
 */
const COUNTRY_TO_LOCALE: Record<string, Locale> = {
  SI: "sl",
  DE: "de",
  AT: "de",
  CH: "de",
  LI: "de",
};

function hasLocalePrefix(pathname: string) {
  return routing.locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieLocale = request.cookies.get("haja_locale")?.value;

  let defaultLocale: Locale = "en";
  // When the country is known we trust it over Accept-Language.
  let localeDetection = true;

  if (!hasLocalePrefix(pathname) && !cookieLocale) {
    const country = (
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      request.headers.get("x-country-code") ||
      ""
    ).toUpperCase();

    if (country && COUNTRY_TO_LOCALE[country]) {
      defaultLocale = COUNTRY_TO_LOCALE[country];
      localeDetection = false;
    } else {
      const accept = request.headers.get("accept-language") || "";
      const first = accept.split(",")[0]?.trim().slice(0, 2).toLowerCase();
      if (first === "sl") defaultLocale = "sl";
      else if (first === "de") defaultLocale = "de";
      else if (first === "en") defaultLocale = "en";
      else if (/\bsl\b/.test(accept)) defaultLocale = "sl";
      else if (/\bde\b/.test(accept)) defaultLocale = "de";
    }
  }

  const handle = createMiddleware({ ...routing, defaultLocale, localeDetection });
  return handle(request);
}

export const config = {
  matcher: [
    // Root and every locale-prefixed path
    "/",
    "/(sl|en|de)/:path*",
    // Old, unprefixed URLs from the previous site are redirected in next.config.ts
  ],
};
