import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";
import { Reveal } from "@/components/motion/Reveal";

export async function CtaSection() {
  const t = await getTranslations("cta");

  return (
    <section className="container-x pt-20 lg:pt-28">
      <Reveal className="relative overflow-hidden rounded-3xl bg-graphite-900 px-6 py-16 text-center text-white sm:px-10 lg:px-16 lg:py-24">
        <Image src="/images/hero-robot-panel.jpg" alt="" fill sizes="100vw" className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-graphite-950/70 via-graphite-900/80 to-graphite-950/90" aria-hidden="true" />
        <div className="dark-grid-texture pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center">
          <h2 className="display-lg">{t("title")}</h2>
          <p className="lead mt-5 max-w-[52ch] !text-steel-300">{t("text")}</p>
          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <Link href="/kontakt" className="btn btn-primary">
              {t("button")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <a href={site.phoneHref} className="btn btn-ghost-light">
              <Phone className="size-4" aria-hidden="true" />
              {site.phone}
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
