import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Car, Cog, Layers } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

type Item = { title: string; text: string };
const ICONS = [Layers, Cog, Car];
const IMAGES = ["/images/ref-calender-front.jpg", "/images/robot-lrmate-haas.jpg", "/images/ref-hmi-welding.jpg"];

export async function IndustriesSection() {
  const t = await getTranslations("industries");
  const items = t.raw("items") as Item[];

  return (
    <section className="container-x py-20 lg:py-28">
      <Reveal className="max-w-2xl">
        <h2 className="display-lg text-graphite-900">{t("title")}</h2>
        <p className="lead mt-5">{t("lead")}</p>
      </Reveal>
      <Stagger as="ul" className="mt-12 grid gap-5 md:grid-cols-3">
        {items.map((it, i) => {
          const Icon = ICONS[i];
          return (
            <StaggerItem
              key={it.title}
              as="li"
              className="group relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-2xl bg-graphite-900 p-7 text-white shadow-[var(--shadow-panel)]"
            >
              <Image
                src={IMAGES[i]}
                alt=""
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-graphite-950/90 via-graphite-950/45 to-graphite-950/10" aria-hidden="true" />
              <div className="relative">
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15 backdrop-blur-sm">
                  <Icon className="size-5" aria-hidden="true" strokeWidth={1.75} />
                </span>
                <h3 className="display-sm mt-4">{it.title}</h3>
                <p className="mt-2 text-[0.95rem] text-steel-200">{it.text}</p>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}
