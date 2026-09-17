import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type AppPathname, type Locale } from "@/i18n/routing";
import { localeMeta, site } from "./site";

type Args = {
  locale: Locale;
  pathname: AppPathname;
  title: string;
  description: string;
  image?: string;
};

/** Absolute URL for a given internal pathname in a given locale. */
export function absoluteUrl(locale: Locale, pathname: AppPathname) {
  return `${site.url}${getPathname({ locale, href: pathname })}`;
}

/** Builds page metadata with canonical + hreflang alternates for every locale. */
export function buildMetadata({ locale, pathname, title, description, image }: Args): Metadata {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[localeMeta[l].hrefLang] = absoluteUrl(l, pathname);
  }
  languages["x-default"] = absoluteUrl(routing.defaultLocale, pathname);

  const url = absoluteUrl(locale, pathname);
  const ogImage = image ?? `${site.url}/og.jpg`;

  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: site.name,
      locale: localeMeta[locale].ogLocale,
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => localeMeta[l].ogLocale),
      images: [{ url: ogImage, width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
