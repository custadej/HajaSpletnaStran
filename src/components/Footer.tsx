"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { openConsentSettings } from "@/lib/consent";
import { site } from "@/lib/site";
import { Logo } from "./Logo";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const meta = useTranslations("meta");
  const year = new Date().getFullYear();

  const linkCls = "text-steel-300 transition-colors hover:text-white";

  return (
    <footer className="relative mt-24 bg-graphite-900 text-steel-200">
      <div className="dark-grid-texture pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="container-x relative">
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo className="h-8 w-auto" variant="light" />
            <p className="mt-5 max-w-sm text-steel-300">{t("tagline")}</p>
            <address className="mt-6 space-y-1 text-sm not-italic text-steel-300">
              <p className="font-medium text-white">{site.legalName}</p>
              <p>
                {site.address.street}, {site.address.postalCode} {site.address.city}, {site.address.country}
              </p>
              <p>
                <a href={`mailto:${site.email}`} className={linkCls}>
                  {site.email}
                </a>
              </p>
              <p>
                <a href={site.phoneHref} className={linkCls}>
                  {site.phone}
                </a>
              </p>
            </address>
          </div>

          <div className="lg:col-span-2">
            <p className="font-display text-sm font-semibold tracking-wide text-white">{t("navigation")}</p>
            <ul className="mt-4 space-y-2.5 text-[0.95rem]">
              <li><Link href="/" className={linkCls}>{nav("home")}</Link></li>
              <li><Link href="/storitve" className={linkCls}>{nav("services")}</Link></li>
              <li><Link href="/reference" className={linkCls}>{nav("references")}</Link></li>
              <li><Link href="/o-podjetju" className={linkCls}>{nav("about")}</Link></li>
              <li><Link href="/kontakt" className={linkCls}>{nav("contact")}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="font-display text-sm font-semibold tracking-wide text-white">{nav("references")}</p>
            <ul className="mt-4 space-y-2.5 text-[0.95rem]">
              <li><Link href="/reference/gumarska-industrija" className={linkCls}>{nav("refRubber")}</Link></li>
              <li><Link href="/reference/robotske-celice" className={linkCls}>{nav("refRobots")}</Link></li>
              <li><Link href="/reference/avtomatizacija" className={linkCls}>{nav("refAutomation")}</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="font-display text-sm font-semibold tracking-wide text-white">{t("legal")}</p>
            <ul className="mt-4 space-y-2.5 text-[0.95rem]">
              <li><Link href="/zasebnost" className={linkCls}>{meta("privacy.title")}</Link></li>
              <li><Link href="/piskotki" className={linkCls}>{meta("cookies.title")}</Link></li>
              <li><Link href="/pravno-obvestilo" className={linkCls}>{meta("legal.title")}</Link></li>
              <li>
                <button type="button" onClick={openConsentSettings} className={`${linkCls} cursor-pointer text-left`}>
                  {t("cookieSettings")}
                </button>
              </li>
            </ul>
            <div className="mt-6">
              <LocaleSwitcher variant="dark" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-sm text-steel-400 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.name} {t("rights")}
          </p>
          <p className="flex items-center gap-4">
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={linkCls}>
              LinkedIn
            </a>
            <span aria-hidden="true" className="text-white/20">|</span>
            <span>
              {t("madeBy")}{" "}
              <a href={site.author.url} target="_blank" rel="noopener" className="font-semibold text-white hover:text-signal-100">
                {site.author.name}
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
