import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type AppPathname } from "@/i18n/routing";
import { localeMeta, site } from "@/lib/site";

// Required for the static export (GitHub Pages demo); harmless otherwise.
export const dynamic = "force-static";

const PAGES: { pathname: AppPathname; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
  { pathname: "/", priority: 1, changeFrequency: "weekly" },
  { pathname: "/storitve", priority: 0.9, changeFrequency: "monthly" },
  { pathname: "/reference", priority: 0.8, changeFrequency: "monthly" },
  { pathname: "/reference/gumarska-industrija", priority: 0.7, changeFrequency: "monthly" },
  { pathname: "/reference/robotske-celice", priority: 0.7, changeFrequency: "monthly" },
  { pathname: "/reference/avtomatizacija", priority: 0.7, changeFrequency: "monthly" },
  { pathname: "/o-podjetju", priority: 0.6, changeFrequency: "yearly" },
  { pathname: "/kontakt", priority: 0.8, changeFrequency: "yearly" },
  { pathname: "/piskotki", priority: 0.2, changeFrequency: "yearly" },
  { pathname: "/zasebnost", priority: 0.2, changeFrequency: "yearly" },
  { pathname: "/pravno-obvestilo", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PAGES.flatMap((p) =>
    routing.locales.map((locale) => {
      const languages: Record<string, string> = {};
      for (const l of routing.locales) {
        languages[localeMeta[l].hrefLang] = `${site.url}${getPathname({ locale: l, href: p.pathname })}`;
      }
      languages["x-default"] = `${site.url}${getPathname({ locale: routing.defaultLocale, href: p.pathname })}`;
      return {
        url: `${site.url}${getPathname({ locale, href: p.pathname })}`,
        lastModified: now,
        changeFrequency: p.changeFrequency,
        priority: p.priority,
        alternates: { languages },
      };
    }),
  );
}
