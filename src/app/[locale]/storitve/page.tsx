import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { ServicesSection } from "@/components/home/ServicesSection";
import { TechSection } from "@/components/home/TechSection";
import { IndustriesSection } from "@/components/home/IndustriesSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { CtaSection } from "@/components/home/CtaSection";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    locale,
    pathname: "/storitve",
    title: t("services.title"),
    description: t("services.description"),
  });
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ServicesSection showLink={false} headingLevel={1} />
      <TechSection />
      <IndustriesSection />
      <ProcessSection />
      <CtaSection />
    </>
  );
}
