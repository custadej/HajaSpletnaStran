import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { referenceCategories } from "@/lib/references";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

type Industry = { title: string; text: string };

/**
 * Reference categories as tall photo cards. With `showIndustries` the industries
 * are folded into the same block as a chip row, so the home page has one section
 * instead of two that looked alike.
 */
export async function ReferencesSection({
  headingLevel = 2,
  showAllLink = true,
  showIndustries = false,
}: {
  headingLevel?: 1 | 2;
  showAllLink?: boolean;
  showIndustries?: boolean;
}) {
  const t = await getTranslations("references");
  const tr = await getTranslations("refPages");
  const ti = await getTranslations("industries");
  const industries = ti.raw("items") as Industry[];
  const Heading = headingLevel === 1 ? "h1" : "h2";

  return (
    <section className="container-x py-20 lg:py-28">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <Heading className="display-lg text-graphite-900">{t("title")}</Heading>
          <p className="lead mt-5">{t("lead")}</p>
          {showIndustries && (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label={ti("title")}>
              {industries.map((it) => (
                <li
                  key={it.title}
                  title={it.text}
                  className="rounded-full border border-steel-200 bg-white px-3.5 py-1.5 text-sm font-medium text-graphite-700"
                >
                  {it.title}
                </li>
              ))}
            </ul>
          )}
        </div>
        {showAllLink && (
          <Link href="/reference" className="link-line hidden font-semibold text-graphite-900 md:inline-flex md:items-center md:gap-2">
            {t("all")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        )}
      </Reveal>

      <Stagger as="ul" className="mt-12 grid gap-5 md:grid-cols-3">
        {referenceCategories.map((c) => (
          <StaggerItem key={c.key} as="li">
            <Link
              href={c.pathname}
              className="shine group relative flex min-h-[30rem] flex-col justify-end overflow-hidden rounded-2xl bg-graphite-900 p-7 text-white shadow-[var(--shadow-panel)] transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]"
            >
              <Image
                src={c.cover.src}
                alt={tr(`${c.key}.images.${c.cover.id}`)}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-graphite-950/90 via-graphite-950/40 to-graphite-950/5" aria-hidden="true" />
              <div className="relative">
                <p className="text-sm text-steel-200">{t(`cards.${c.key}.subtitle`)}</p>
                <h3 className="display-sm mt-1.5 flex items-center justify-between gap-3">
                  {t(`cards.${c.key}.title`)}
                  <ArrowUpRight
                    className="size-5 shrink-0 text-steel-300 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
                    aria-hidden="true"
                  />
                </h3>
                <p className="mt-3 text-[0.95rem] text-steel-200">{t(`cards.${c.key}.text`)}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
                  {t("view")}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>

      {showAllLink && (
        <div className="mt-8 md:hidden">
          <Link href="/reference" className="btn btn-ghost">
            {t("all")}
          </Link>
        </div>
      )}
    </section>
  );
}
