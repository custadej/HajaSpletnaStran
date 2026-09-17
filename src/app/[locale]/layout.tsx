import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { localeMeta, site } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { Analytics } from "@/components/Analytics";
import "../globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "wdth"],
});

const sans = Figtree({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return {
    metadataBase: new URL(site.url),
    title: {
      default: t("home.title"),
      template: `%s – ${site.name}`,
    },
    description: t("home.description"),
    applicationName: site.name,
    authors: [{ name: site.author.name, url: site.author.url }],
    creator: site.author.name,
    publisher: site.legalName,
    robots: { index: true, follow: true },
    manifest: `${base}/manifest.webmanifest`,
    icons: {
      icon: [
        { url: `${base}/favicon.ico`, sizes: "32x32" },
        { url: `${base}/favicon.png`, type: "image/png", sizes: "60x60" },
      ],
      apple: [{ url: `${base}/apple-icon.png`, sizes: "180x180" }],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0c172e",
  width: "device-width",
  initialScale: 1,
};

function organizationJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": `${site.url}/#organization`,
        name: site.name,
        legalName: site.legalName,
        url: site.url,
        logo: `${site.url}/haja-logo.png`,
        image: `${site.url}/og.jpg`,
        email: site.email,
        telephone: site.phone,
        foundingDate: String(site.founded),
        taxID: site.taxNumber,
        founder: { "@type": "Person", name: site.contactPerson },
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          postalCode: site.address.postalCode,
          addressLocality: site.address.city,
          addressCountry: site.address.countryCode,
        },
        geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
        areaServed: ["SI", "AT", "DE", "HR", "IT"],
        sameAs: [site.linkedin],
        knowsAbout: [
          "Industrial automation",
          "PLC programming",
          "Allen-Bradley",
          "Siemens",
          "Beckhoff",
          "Fanuc robots",
          "Control system retrofit",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        inLanguage: localeMeta[locale].hrefLang,
        publisher: { "@id": `${site.url}/#organization` },
      },
    ],
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <html lang={localeMeta[locale].hrefLang} className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider>
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded focus:bg-signal focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
          >
            {t("skip")}
          </a>
          <Header />
          <main id="content" className="flex-1">
            {children}
          </main>
          <Footer />
          <CookieConsent />
          <Analytics />
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(locale)) }}
        />
      </body>
    </html>
  );
}
