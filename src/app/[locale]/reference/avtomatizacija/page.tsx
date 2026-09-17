import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { ReferencePage } from "@/components/ReferencePage";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    locale,
    pathname: "/reference/avtomatizacija",
    title: t("refAutomation.title"),
    description: t("refAutomation.description"),
    image: `${site.url}/images/auto-mixing-plant.jpg`,
  });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ReferencePage category="automation" />;
}
