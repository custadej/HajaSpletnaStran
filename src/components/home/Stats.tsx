"use client";

import { useTranslations } from "next-intl";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";

type Item = { value: string; suffix: string; label: string };

export function Stats() {
  const t = useTranslations("stats");
  const items = t.raw("items") as Item[];

  return (
    <section aria-label="Key facts" className="border-y border-steel-200 bg-white">
      <Reveal className="container-x">
        <dl className="grid grid-cols-2 divide-steel-200 lg:grid-cols-4 lg:divide-x">
          {items.map((it, i) => (
            <div
              key={it.label}
              className={`py-8 lg:px-8 lg:py-10 ${i % 2 === 1 ? "pl-6 lg:pl-8" : "pr-6 lg:pr-8"} ${
                i === 0 ? "lg:pl-0" : ""
              } ${i === items.length - 1 ? "lg:pr-0" : ""}`}
            >
              <dd className="font-display text-4xl font-semibold tracking-tight text-graphite-900 lg:text-5xl">
                <Counter value={Number(it.value)} suffix={it.suffix} />
              </dd>
              <dt className="mt-2 max-w-[18ch] text-[0.95rem] leading-snug text-graphite-600">{it.label}</dt>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
