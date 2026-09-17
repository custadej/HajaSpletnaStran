import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

type Step = { title: string; text: string };

export async function ProcessSection() {
  const t = await getTranslations("process");
  const steps = t.raw("steps") as Step[];

  return (
    <section className="border-t border-steel-200 bg-white">
      <div className="container-x grid gap-10 py-20 lg:grid-cols-12 lg:py-28">
        <Reveal className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <h2 className="display-lg text-graphite-900">{t("title")}</h2>
            <p className="lead mt-5">{t("lead")}</p>
            <figure className="relative mt-8 aspect-[2/3] max-w-md overflow-hidden rounded-2xl bg-steel-200 shadow-[var(--shadow-panel)]">
              <Image
                src="/images/machinery-factory.jpg"
                alt={t("imageAlt")}
                fill
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="object-cover"
              />
            </figure>
          </div>
        </Reveal>
        <Stagger as="ol" className="lg:col-span-7">
          {steps.map((s, i) => (
            <StaggerItem
              key={s.title}
              as="li"
              className="grid gap-3 border-b border-steel-200 py-7 first:pt-0 sm:grid-cols-[4rem_1fr] sm:gap-6"
            >
              <span className="font-display text-3xl font-semibold text-signal tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="display-sm text-graphite-900">{s.title}</h3>
                <p className="mt-2 max-w-[62ch] text-graphite-600">{s.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
