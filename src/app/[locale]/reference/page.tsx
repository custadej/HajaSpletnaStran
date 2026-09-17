import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { ReferencesSection } from "@/components/home/ReferencesSection";
import { CtaSection } from "@/components/home/CtaSection";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    locale,
    pathname: "/reference",
    title: t("references.title"),
    description: t("references.description"),
  });
}

export default async function ReferencesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ReferencesSection headingLevel={1} showAllLink={false} />
      <CtaSection />
    </>
  );
}
