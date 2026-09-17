import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { referenceCategories } from "@/lib/references";

/** Continuous band of project photos; pauses on hover, static under reduced motion. */
export async function PhotoMarquee() {
  const t = await getTranslations("refPages");
  const tg = await getTranslations("gallery");

  // Pull a varied selection from every category, de-duplicated by src.
  const seen = new Set<string>();
  const items: { src: string; alt: string; portrait: boolean }[] = [];
  for (const c of referenceCategories) {
    for (const s of c.sections) {
      for (const img of s.images) {
        if (seen.has(img.src)) continue;
        seen.add(img.src);
        items.push({ src: img.src, alt: t(`${c.key}.images.${img.id}`), portrait: img.h > img.w });
      }
    }
  }
  // Interleave so the band alternates categories rather than grouping them.
  const picked = items.filter((_, i) => i % 2 === 0).concat(items.filter((_, i) => i % 2 === 1)).slice(0, 16);
  const track = [...picked, ...picked];

  return (
    <section aria-label={tg("title")} className="marquee relative overflow-hidden border-y border-steel-200 bg-white py-8">
      <p className="container-x mb-5 text-sm font-medium text-graphite-600">{tg("title")}</p>
      <div className="marquee-track gap-4">
        {track.map((img, i) => (
          <figure
            key={`${img.src}-${i}`}
            aria-hidden={i >= picked.length ? true : undefined}
            className={`relative h-44 shrink-0 overflow-hidden rounded-xl bg-steel-200 sm:h-56 ${
              img.portrait ? "w-36 sm:w-44" : "w-60 sm:w-80"
            }`}
          >
            <Image src={img.src} alt={i >= picked.length ? "" : img.alt} fill sizes="320px" className="object-cover" />
          </figure>
        ))}
      </div>
    </section>
  );
}
