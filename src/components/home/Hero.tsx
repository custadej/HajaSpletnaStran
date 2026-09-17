"use client";

import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, Cpu, ShieldCheck, Wrench } from "lucide-react";
import { useRef } from "react";
import { Link } from "@/i18n/navigation";
import { TiltCard } from "@/components/motion/TiltCard";

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};
const card = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.1, ease: EASE, delay } },
});

export function Hero() {
  const t = useTranslations("hero");
  const tr = useTranslations("refPages");
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yMain = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 70]);
  const ySide = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 130]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="grid-texture pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="blob blob-a right-[8%] top-[10%] h-[28rem] w-[28rem] bg-signal/20" />
        <div className="blob blob-b left-[-6%] bottom-[-10%] h-[24rem] w-[24rem] bg-signal/10" />
      </div>

      <div className="container-x relative grid min-h-[calc(100dvh-var(--header-h))] items-center gap-12 py-14 lg:grid-cols-12 lg:gap-6 lg:py-12">
        <motion.div
          style={{ y: textY }}
          variants={container}
          initial={reduce ? "show" : "hidden"}
          animate="show"
          className="lg:col-span-6"
        >
          <motion.p variants={item} className="inline-flex items-center gap-2 rounded-full border border-steel-200 bg-white/70 px-3.5 py-1.5 text-[0.85rem] font-medium text-graphite-700 backdrop-blur-sm">
            <span className="inline-block size-1.5 rounded-full bg-signal" aria-hidden="true" />
            {t("kicker")}
          </motion.p>
          <motion.h1 variants={item} className="display-xl mt-7 max-w-[14ch] text-graphite-900">
            {t("title")}
          </motion.h1>
          <motion.p variants={item} className="lead mt-7 max-w-[54ch]">
            {t("lead")}
          </motion.p>
          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/kontakt" className="btn btn-primary">
              {t("primary")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/reference" className="btn btn-ghost">
              {t("secondary")}
            </Link>
          </motion.div>
          <motion.ul variants={item} className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-graphite-600">
            <li className="flex items-center gap-2">
              <Cpu className="size-4 text-signal" aria-hidden="true" />
              Allen-Bradley · Siemens · Beckhoff
            </li>
            <li className="flex items-center gap-2">
              <Wrench className="size-4 text-signal" aria-hidden="true" />
              Fanuc
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-signal" aria-hidden="true" />
              {t("badgeExp")}
            </li>
          </motion.ul>
        </motion.div>

        {/* Photo collage with pointer tilt and scroll parallax */}
        <div className="relative lg:col-span-6">
          <div className="relative mx-auto grid max-w-xl grid-cols-12 grid-rows-[auto] gap-4 lg:max-w-none">
            <motion.div
              style={{ y: yMain }}
              variants={card(0.25)}
              initial={reduce ? "show" : "hidden"}
              animate="show"
              className="col-span-8 col-start-1 row-start-1"
            >
              <TiltCard className="h-full">
                <figure className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-graphite-800 shadow-[var(--shadow-lift)]">
                  <Image
                    src="/images/robot-m20ia-tending.jpg"
                    alt={t("imageAlt")}
                    fill
                    priority
                    sizes="(min-width: 1024px) 34vw, (min-width: 640px) 380px, 66vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-graphite-950/60 via-transparent to-transparent" aria-hidden="true" />
                  <figcaption className="absolute bottom-4 left-4 flex items-center gap-3 rounded-md border border-white/15 bg-graphite-900/75 px-3.5 py-2.5 text-white backdrop-blur-sm">
                    <span className="inline-block size-2 rounded-full bg-signal" aria-hidden="true" />
                    <span className="text-sm font-medium">Fanuc M-20iA</span>
                  </figcaption>
                </figure>
              </TiltCard>
            </motion.div>

            <motion.div
              style={{ y: ySide }}
              variants={card(0.45)}
              initial={reduce ? "show" : "hidden"}
              animate="show"
              className="col-span-5 col-start-8 row-start-1 mt-10 self-start"
            >
              <TiltCard max={8}>
                <figure className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-steel-200 shadow-[var(--shadow-lift)] ring-4 ring-steel-50">
                  <Image
                    src="/images/auto-cabinet-ab-controllogix.jpg"
                    alt={tr("automation.images.controllogix")}
                    fill
                    priority
                    sizes="(min-width: 1024px) 22vw, 40vw"
                    className="object-cover"
                  />
                </figure>
              </TiltCard>
            </motion.div>

            <motion.div
              style={{ y: ySide }}
              variants={card(0.6)}
              initial={reduce ? "show" : "hidden"}
              animate="show"
              className="col-span-6 col-start-7 row-start-1 self-end"
            >
              <TiltCard max={8}>
                <figure className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-steel-200 shadow-[var(--shadow-lift)] ring-4 ring-steel-50">
                  <Image
                    src="/images/rubber-calender-line.jpg"
                    alt={tr("rubber.images.calenderLine")}
                    fill
                    sizes="(min-width: 1024px) 26vw, 50vw"
                    className="object-cover"
                  />
                </figure>
              </TiltCard>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
