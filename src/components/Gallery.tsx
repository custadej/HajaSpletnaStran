"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export type GalleryImage = { src: string; alt: string; w: number; h: number };

const EASE = [0.16, 1, 0.3, 1] as const;

/** Responsive photo grid; each photo opens in an accessible lightbox with keyboard navigation. */
export function Gallery({ images, label }: { images: GalleryImage[]; label: string }) {
  const t = useTranslations("refPages");
  const reduce = useReducedMotion();
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (index === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [index, close, step]);

  const current = index === null ? null : images[index];

  return (
    <>
      <ul aria-label={label} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {images.map((img, i) => {
          const portrait = img.h > img.w;
          return (
            <li key={img.src + i} className={portrait ? "row-span-2" : ""}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${t("open")}: ${img.alt}`}
                className={`group relative block w-full overflow-hidden rounded-lg bg-steel-200 ${
                  portrait ? "aspect-[3/4] lg:aspect-[3/4]" : "aspect-[4/3]"
                } ${portrait ? "h-full" : ""}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                />
                <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-graphite-900/10" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>

      <AnimatePresence>
        {current && index !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={current.alt}
            className="fixed inset-0 z-[95] flex flex-col bg-graphite-950/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.target === e.currentTarget && close()}
          >
            <div className="flex items-center justify-between p-3 text-white sm:p-4">
              <p className="text-sm text-steel-300 tabular-nums">
                {index + 1} / {images.length}
              </p>
              <button
                type="button"
                onClick={close}
                aria-label={t("close")}
                autoFocus
                className="inline-flex size-11 items-center justify-center rounded-md hover:bg-white/10"
              >
                <X className="size-6" aria-hidden="true" />
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-4 sm:px-16" onClick={(e) => e.target === e.currentTarget && close()}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.figure
                  key={current.src}
                  initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="relative flex h-full w-full flex-col items-center justify-center"
                >
                  <div className="relative h-[calc(100%-3rem)] w-full">
                    <Image
                      src={current.src}
                      alt={current.alt}
                      fill
                      sizes="100vw"
                      quality={85}
                      className="object-contain"
                      priority
                    />
                  </div>
                  <figcaption className="mt-3 max-w-2xl px-4 text-center text-sm text-steel-300">{current.alt}</figcaption>
                </motion.figure>
              </AnimatePresence>

              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={t("prev")}
                className="absolute top-1/2 left-2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-4 sm:size-12"
              >
                <ChevronLeft className="size-6" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={t("next")}
                className="absolute top-1/2 right-2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-4 sm:size-12"
              >
                <ChevronRight className="size-6" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
