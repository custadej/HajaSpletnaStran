import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

type Item = { name: string; detail: string };

export async function TechSection() {
  const t = await getTranslations("tech");
  const tr = await getTranslations("refPages");
  const items = t.raw("items") as Item[];

  return (
    <section className="relative overflow-hidden bg-graphite-900 text-white">
      <Image
        src="/images/banner-wiring-engineer.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-[0.16]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-graphite-900 via-graphite-900/80 to-graphite-900/40" aria-hidden="true" />
      <div className="dark-grid-texture pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="container-x relative grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-7">
          <Reveal className="max-w-2xl">
            <h2 className="display-lg">{t("title")}</h2>
            <p className="lead mt-5 !text-steel-300">{t("lead")}</p>
          </Reveal>

          <Stagger as="ul" className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {items.map((it) => (
              <StaggerItem key={it.name} as="li" className="bg-graphite-900/90 p-6 backdrop-blur-sm lg:p-7">
                <p className="font-display text-2xl font-semibold tracking-tight">{it.name}</p>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-steel-300">{it.detail}</p>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-7 flex items-center gap-3 text-sm text-steel-300">
            <span className="inline-block size-1.5 rounded-full bg-signal" aria-hidden="true" />
            {t("networks")}
          </Reveal>
        </div>

        <Reveal className="lg:col-span-5" delay={0.15}>
          <div className="grid grid-cols-2 gap-4">
            <figure className="relative aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-white/10">
              <Image src="/images/auto-controllogix-io.jpg" alt={tr("automation.images.controllogixIo")} fill sizes="(min-width:1024px) 20vw, 50vw" className="object-cover" />
            </figure>
            <figure className="relative mt-10 aspect-[3/4] overflow-hidden rounded-2xl ring-1 ring-white/10">
              <Image src="/images/auto-cabinet-beckhoff.jpg" alt={tr("automation.images.beckhoff")} fill sizes="(min-width:1024px) 20vw, 50vw" className="object-cover" />
            </figure>
            <figure className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-white/10">
              <Image src="/images/rubber-studio5000-trend.jpg" alt={tr("rubber.images.studio5000")} fill sizes="(min-width:1024px) 20vw, 50vw" className="object-cover" />
            </figure>
            <figure className="relative mt-10 aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-white/10">
              <Image src="/images/robot-m710ic-lathe.jpg" alt={tr("robots.images.m710ic")} fill sizes="(min-width:1024px) 20vw, 50vw" className="object-cover" />
            </figure>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
