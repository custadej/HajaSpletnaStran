import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/PageHeader";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Stats } from "@/components/home/Stats";
import { CtaSection } from "@/components/home/CtaSection";

type Props = { params: Promise<{ locale: Locale }> };
type Fact = { label: string; value: string };
type Value = { title: string; text: string };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({ locale, pathname: "/o-podjetju", title: t("about.title"), description: t("about.description") });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tr = await getTranslations("refPages");
  const paragraphs = t.raw("paragraphs") as string[];
  const facts = t.raw("facts") as Fact[];
  const values = t.raw("values") as Value[];

  return (
    <>
      <PageHeader title={t("title")} lead={t("lead")} />

      <section className="container-x grid gap-10 pb-20 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-7">
          <div className="space-y-5 text-[1.05rem] leading-relaxed text-graphite-700">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <h2 className="display-sm mt-12 text-graphite-900">{t("factsTitle")}</h2>
          <dl className="mt-4 divide-y divide-steel-200 border-y border-steel-200">
            {facts.map((f) => (
              <div key={f.label} className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-6">
                <dt className="text-sm font-semibold text-graphite-600">{f.label}</dt>
                <dd className="text-graphite-900">{f.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-graphite-600">
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="link-line font-semibold text-graphite-900">
              LinkedIn
            </a>
          </p>
        </Reveal>

        <Reveal className="lg:col-span-5" delay={0.1}>
          <figure className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-steel-200 shadow-[var(--shadow-panel)]">
            <Image
              src="/images/auto-mixing-plant.jpg"
              alt={t("imageAlt")}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </figure>
        </Reveal>
      </section>

      <Stats />

      <section className="container-x pt-20 lg:pt-28">
        <Reveal>
          <h2 className="display-sm text-graphite-900">{t("galleryTitle")}</h2>
          <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ["/images/robot-grey-bench.jpg", tr("robots.images.greyBench")],
              ["/images/auto-labeling-machine.jpg", tr("automation.images.labeling")],
              ["/images/auto-gantry-pick.jpg", tr("automation.images.gantryPick")],
              ["/images/rubber-cabinet-drives.jpg", tr("rubber.images.cabinetDrives")],
            ].map(([src, alt]) => (
              <li key={src} className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-steel-200 shadow-[var(--shadow-panel)]">
                <Image src={src} alt={alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] hover:scale-[1.04]" />
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="container-x py-20 lg:py-28">
        <Reveal>
          <h2 className="display-lg text-graphite-900">{t("valuesTitle")}</h2>
        </Reveal>
        <Stagger as="ul" className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {values.map((v) => (
            <StaggerItem key={v.title} as="li" className="border-t-2 border-graphite-900 pt-5">
              <h3 className="display-sm text-graphite-900">{v.title}</h3>
              <p className="mt-2 max-w-[48ch] text-graphite-600">{v.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <CtaSection />
    </>
  );
}
