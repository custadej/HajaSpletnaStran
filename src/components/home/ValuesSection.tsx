import { getTranslations } from "next-intl/server";
import { FileCheck2, Headset, PackageCheck, Recycle } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

type Value = { title: string; text: string };
const ICONS = [Recycle, PackageCheck, FileCheck2, Headset];

/** Four working principles, shown on the home page between the systems and references. */
export async function ValuesSection() {
  const t = await getTranslations("about");
  const values = t.raw("values") as Value[];

  return (
    <section className="border-b border-steel-200 bg-white">
      <div className="container-x grid gap-10 py-20 lg:grid-cols-12 lg:py-24">
        <Reveal className="lg:col-span-4">
          <h2 className="display-lg text-graphite-900">{t("valuesTitle")}</h2>
        </Reveal>
        <Stagger as="ul" className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:col-span-8">
          {values.map((v, i) => {
            const Icon = ICONS[i];
            return (
              <StaggerItem key={v.title} as="li" className="group flex gap-4">
                <span className="mt-0.5 inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-signal-50 text-signal transition-colors duration-300 group-hover:bg-signal group-hover:text-white">
                  <Icon className="size-5" aria-hidden="true" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="display-sm text-graphite-900">{v.title}</h3>
                  <p className="mt-1.5 max-w-[42ch] text-[0.95rem] text-graphite-600">{v.text}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
