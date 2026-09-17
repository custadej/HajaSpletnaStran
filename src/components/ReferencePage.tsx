import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { referenceByKey, referenceCategories, type RefCategory } from "@/lib/references";
import { Gallery } from "@/components/Gallery";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { CtaSection } from "@/components/home/CtaSection";

type Section = { title: string; text: string };

export async function ReferencePage({ category }: { category: RefCategory["key"] }) {
  const t = await getTranslations("refPages");
  const tc = await getTranslations("references");
  const data = referenceByKey[category];
  const sections = t.raw(`${category}.sections`) as Section[];
  const others = referenceCategories.filter((c) => c.key !== category);

  return (
    <>
      <PageHeader
        title={t(`${category}.title`)}
        lead={t(`${category}.lead`)}
        back={{ href: "/reference", label: t("back") }}
      />

      <div className="container-x space-y-20 pb-8 lg:space-y-28">
        {data.sections.map((sec, i) => {
          const images = sec.images.map((img) => ({
            src: img.src,
            alt: t(`${category}.images.${img.id}`),
            w: img.w,
            h: img.h,
          }));
          return (
            <section key={sec.id} className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <Reveal className="lg:col-span-4">
                <div className="lg:sticky lg:top-28">
                  <p className="font-display text-sm font-semibold text-signal">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="display-md mt-2 text-graphite-900">{sections[i]?.title}</h2>
                  <p className="mt-4 text-graphite-600">{sections[i]?.text}</p>
                </div>
              </Reveal>
              <Reveal className="lg:col-span-8">
                <Gallery images={images} label={`${t("gallery")}: ${sections[i]?.title}`} />
              </Reveal>
            </section>
          );
        })}
      </div>

      <section className="container-x pt-16">
        <Reveal>
          <h2 className="display-sm text-graphite-900">{t("otherTitle")}</h2>
          <ul className="mt-5 grid gap-5 sm:grid-cols-2">
            {others.map((c) => (
              <li key={c.key}>
                <Link
                  href={c.pathname}
                  className="group flex items-center gap-5 rounded-xl border border-steel-200 bg-white p-3 pr-6 transition-shadow hover:shadow-[var(--shadow-panel)]"
                >
                  <span className="relative block size-20 shrink-0 overflow-hidden rounded-lg bg-steel-200">
                    <Image src={c.cover.src} alt="" fill sizes="80px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-graphite-600">{tc(`cards.${c.key}.subtitle`)}</span>
                    <span className="display-sm block text-graphite-900">{tc(`cards.${c.key}.title`)}</span>
                  </span>
                  <ArrowUpRight className="size-5 shrink-0 text-steel-400 transition-colors group-hover:text-graphite-900" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <CtaSection />
    </>
  );
}
