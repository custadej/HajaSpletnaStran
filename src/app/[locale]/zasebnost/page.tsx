import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { LAST_UPDATED } from "@/lib/legal";

type Props = { params: Promise<{ locale: Locale }> };
type Section = { title: string; text: string };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, pathname: "/zasebnost", title: t("privacy.title"), description: t("privacy.description") });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legalPages.privacy");
  const tl = await getTranslations("legalPages");
  const sections = t.raw("sections") as Section[];

  return (
    <>
      <PageHeader title={t("title")} compact />
      <article className="container-x prose-legal max-w-3xl pb-24 text-graphite-700">
        <p className="text-sm text-graphite-600">{tl("updated", { date: LAST_UPDATED[locale] })}</p>
        <p className="lead mt-6 !text-graphite-700">{t("intro")}</p>
        {sections.map((s) => (
          <section key={s.title}>
            <h2>{s.title}</h2>
            <p>{s.text}</p>
          </section>
        ))}
      </article>
    </>
  );
}
