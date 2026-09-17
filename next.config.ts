import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * STATIC_EXPORT=true builds a fully static site (GitHub Pages demo).
 * In that mode there is no proxy (language detection) and no API route, so
 * the CI workflow removes those files before building and the contact form
 * falls back to a mailto link. The normal build (Vercel / Node) keeps everything.
 */
const isStatic = process.env.STATIC_EXPORT === "true";
const basePath = isStatic ? process.env.BASE_PATH || "" : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(isStatic
    ? {
        output: "export",
        trailingSlash: true,
        basePath,
        images: { loader: "custom", loaderFile: "./src/lib/image-loader.ts" },
        env: { NEXT_PUBLIC_BASE_PATH: basePath },
      }
    : {
        images: {
          formats: ["image/avif", "image/webp"],
          deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
          qualities: [60, 75, 85],
        },
        async redirects() {
          // Old WordPress URLs (previous www.haja.si) -> new Slovenian pages, permanent.
          const old: [string, string][] = [
            ["/storitve", "/sl/storitve"],
            ["/kontakt", "/sl/kontakt"],
            ["/gumarska-industrija", "/sl/reference/gumarska-industrija"],
            ["/robotske-celice", "/sl/reference/robotske-celice"],
            ["/avtomatizacija", "/sl/reference/avtomatizacija"],
            ["/piskotki", "/sl/piskotki"],
            ["/pogoji-zasebnosti", "/sl/zasebnost"],
            ["/o-nas", "/sl/o-podjetju"],
            ["/home", "/sl"],
            ["/offer", "/sl/storitve"],
            ["/how-we-work", "/sl/kontakt"],
          ];
          return old.map(([source, destination]) => ({ source, destination, permanent: true }));
        },
        async headers() {
          return [
            {
              source: "/(.*)",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "X-Frame-Options", value: "SAMEORIGIN" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                {
                  key: "Permissions-Policy",
                  value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
                },
              ],
            },
          ];
        },
      }),
};

export default withNextIntl(nextConfig);
