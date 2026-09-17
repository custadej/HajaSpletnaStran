import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/motion/Reveal";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, pathname: "/kontakt", title: t("contact.title"), description: t("contact.description") });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  const row = "flex items-start gap-3";
  const icon = "mt-1 size-5 shrink-0 text-signal-700";

  return (
    <>
      <PageHeader title={t("title")} lead={t("lead")} compact />

      <section className="container-x grid gap-10 pb-24 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-7">
          <h2 className="display-sm text-graphite-900">{t("formTitle")}</h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </Reveal>

        <Reveal className="lg:col-span-5" delay={0.1}>
          <div className="rounded-xl border border-steel-200 bg-white p-6 shadow-[var(--shadow-panel)] sm:p-8">
            <h2 className="display-sm text-graphite-900">{t("details.title")}</h2>
            <p className="mt-1 text-sm text-graphite-600">{site.legalName}</p>

            <dl className="mt-6 space-y-5">
              <div className={row}>
                <MapPin className={icon} aria-hidden="true" />
                <div>
                  <dt className="text-sm font-semibold text-graphite-600">{t("details.address")}</dt>
                  <dd className="text-graphite-900">
                    {site.address.street}
                    <br />
                    {site.address.postalCode} {site.address.city}, {site.address.country}
                  </dd>
                  <dd className="mt-1">
                    <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-line text-sm font-semibold text-graphite-900">
                      {t("details.map")}
                    </a>
                  </dd>
                </div>
              </div>
              <div className={row}>
                <Mail className={icon} aria-hidden="true" />
                <div>
                  <dt className="text-sm font-semibold text-graphite-600">{t("details.email")}</dt>
                  <dd>
                    <a href={`mailto:${site.email}`} className="link-line text-graphite-900">
                      {site.email}
                    </a>
                  </dd>
                </div>
              </div>
              <div className={row}>
                <Phone className={icon} aria-hidden="true" />
                <div>
                  <dt className="text-sm font-semibold text-graphite-600">{t("details.phone")}</dt>
                  <dd>
                    <a href={site.phoneHref} className="link-line text-graphite-900">
                      {site.phone}
                    </a>
                  </dd>
                </div>
              </div>
              <div className={row}>
                <Clock className={icon} aria-hidden="true" />
                <div>
                  <dt className="text-sm font-semibold text-graphite-600">{t("details.hours")}</dt>
                  <dd className="text-graphite-900">{t("details.hoursValue")}</dd>
                </div>
              </div>
              <div className={row}>
                <ExternalLink className={icon} aria-hidden="true" />
                <div>
                  <dt className="text-sm font-semibold text-graphite-600">{t("details.linkedin")}</dt>
                  <dd>
                    <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="link-line text-graphite-900">
                      {site.contactPerson}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>

            <p className="mt-7 border-t border-steel-200 pt-5 text-sm text-graphite-600">{t("details.responseTime")}</p>
          </div>

        </Reveal>
      </section>
    </>
  );
}
