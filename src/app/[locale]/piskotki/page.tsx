import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { OpenConsentButton } from "@/components/OpenConsentButton";
import { LAST_UPDATED } from "@/lib/legal";

type Props = { params: Promise<{ locale: Locale }> };
type Row = { name: string; purpose: string; duration: string; type: "necessary" | "analytics" };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, pathname: "/piskotki", title: t("cookies.title"), description: t("cookies.description") });
}

export default async function CookiesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legalPages.cookies");
  const tl = await getTranslations("legalPages");
  const tm = await getTranslations("meta");
  const rows = t.raw("rows") as Row[];

  return (
    <>
      <PageHeader title={t("title")} compact />
      <article className="container-x prose-legal max-w-3xl pb-24 text-graphite-700">
        <p className="text-sm text-graphite-600">{tl("updated", { date: LAST_UPDATED[locale] })}</p>
        <p className="lead mt-6 !text-graphite-700">{t("intro")}</p>

        <h2>{t("controllerTitle")}</h2>
        <p>{t("controllerText")}</p>

        <h2>{t("tableTitle")}</h2>
        <div className="-mx-4 overflow-x-auto px-4">
          <table className="w-full min-w-[40rem] border-collapse text-[0.95rem]">
            <thead>
              <tr className="border-b-2 border-graphite-900 text-left">
                <th className="py-2 pr-4 font-semibold">{t("colName")}</th>
                <th className="py-2 pr-4 font-semibold">{t("colPurpose")}</th>
                <th className="py-2 pr-4 font-semibold">{t("colDuration")}</th>
                <th className="py-2 font-semibold">{t("colType")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name} className="border-b border-steel-200 align-top">
                  <td className="py-3 pr-4 font-mono text-sm text-graphite-900">{r.name}</td>
                  <td className="py-3 pr-4">{r.purpose}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">{r.duration}</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        r.type === "necessary" ? "bg-steel-100 text-graphite-700" : "bg-signal-100 text-signal-700"
                      }`}
                    >
                      {r.type === "necessary" ? t("typeNecessary") : t("typeAnalytics")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>{t("analyticsTitle")}</h2>
        <p>{t("analyticsText")}</p>

        <h2>{t("manageTitle")}</h2>
        <p>{t("manageText")}</p>
        <div className="mt-2 mb-6">
          <OpenConsentButton label={t("manageButton")} />
        </div>

        <h2>{t("moreTitle")}</h2>
        <p>
          {t("moreText")}{" "}
          <Link href="/zasebnost">{tm("privacy.title")}</Link>
        </p>
      </article>
    </>
  );
}
