import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { ServicesSection } from "@/components/home/ServicesSection";
import { TechSection } from "@/components/home/TechSection";
import { ValuesSection } from "@/components/home/ValuesSection";
import { ReferencesSection } from "@/components/home/ReferencesSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { CtaSection } from "@/components/home/CtaSection";
import { PhotoMarquee } from "@/components/home/PhotoMarquee";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    ...buildMetadata({ locale, pathname: "/", title: t("home.title"), description: t("home.description") }),
    title: { absolute: t("home.title") },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Stats />
      <ServicesSection />
      <PhotoMarquee />
      <TechSection />
      <ValuesSection />
      <ReferencesSection showIndustries />
      <ProcessSection />
      <CtaSection />
    </>
  );
}
