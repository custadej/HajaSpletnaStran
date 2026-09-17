import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";

type Item = { title: string; text: string; bullets: string[]; imageAlt: string };

const IMAGES = ["/images/service-retrofit.jpg", "/images/service-new-machines.jpg", "/images/service-industries.jpg"];

/** Services list. `detailed` shows all three in full; the home page shows the same. */
export async function ServicesSection({ showLink = true, headingLevel = 2 }: { showLink?: boolean; headingLevel?: 1 | 2 }) {
  const t = await getTranslations("services");
  const items = t.raw("items") as Item[];
  const Heading = headingLevel === 1 ? "h1" : "h2";

  return (
    <section className="container-x py-20 lg:py-28">
      <Reveal className="max-w-3xl">
        <Heading className="display-lg text-graphite-900">{t("title")}</Heading>
        <p className="lead mt-5">{t("lead")}</p>
      </Reveal>

      <div className="mt-14 space-y-12 lg:mt-20 lg:space-y-16">
        {items.map((s, i) => (
          <Reveal key={s.title} as="article" className="grid items-center gap-7 lg:grid-cols-12 lg:gap-12">
            <div className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-steel-200 shadow-[var(--shadow-panel)]">
                <Image
                  src={IMAGES[i]}
                  alt={s.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] hover:scale-[1.03]"
                />
              </div>
            </div>
            <div className={`lg:col-span-7 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
              <p className="font-display text-sm font-semibold text-signal">0{i + 1}</p>
              <h3 className="display-md mt-2 text-graphite-900">{s.title}</h3>
              <p className="mt-4 max-w-[60ch] text-graphite-600">{s.text}</p>
              <ul className="mt-6 space-y-2.5">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-[0.98rem] text-graphite-800">
                    <span className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-signal-100 text-signal-700">
                      <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      {showLink && (
        <Reveal className="mt-14">
          <Link href="/storitve" className="btn btn-dark">
            {t("more")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Reveal>
      )}
    </section>
  );
}
