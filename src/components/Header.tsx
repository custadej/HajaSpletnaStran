"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { site } from "@/lib/site";
import { Logo } from "./Logo";
import { LocaleSwitcher } from "./LocaleSwitcher";

const REFERENCE_LINKS: {
  key: "refRubber" | "refRobots" | "refAutomation";
  href: AppPathname;
}[] = [
  { key: "refRubber", href: "/reference/gumarska-industrija" },
  { key: "refRobots", href: "/reference/robotske-celice" },
  { key: "refAutomation", href: "/reference/avtomatizacija" },
];

const NAV: {
  key: "services" | "references" | "about" | "contact";
  href: AppPathname;
}[] = [
  { key: "services", href: "/storitve" },
  { key: "references", href: "/reference" },
  { key: "about", href: "/o-podjetju" },
  { key: "contact", href: "/kontakt" },
];

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  // Menu state is keyed by the pathname it was opened on, so navigating closes it
  // without an effect.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const [refOpenAt, setRefOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const refOpen = refOpenAt === pathname;
  const setOpen = (v: boolean | ((prev: boolean) => boolean)) =>
    setOpenAt((prev) =>
      (typeof v === "function" ? v(prev === pathname) : v) ? pathname : null,
    );
  const setRefOpen = (v: boolean) => setRefOpenAt(v ? pathname : null);
  const refTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll + Escape to close while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenAt(null);
    window.addEventListener("keydown", onKey);
    menuRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: AppPathname) =>
    href === "/reference"
      ? pathname.startsWith("/reference")
      : pathname === href;

  const showRef = () => {
    if (refTimer.current) clearTimeout(refTimer.current);
    setRefOpen(true);
  };
  const hideRef = () => {
    refTimer.current = setTimeout(() => setRefOpen(false), 120);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          scrolled || open
            ? "bg-steel-50/85 shadow-[0_1px_0_0_var(--color-steel-200)] backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link
            href="/"
            className="flex shrink-0 items-center"
            aria-label={site.name}
          >
            <Logo className="h-8 w-auto md:h-9" priority />
          </Link>

          {/* Desktop navigation */}
          <nav
            aria-label={t("menu")}
            className="hidden items-center gap-7 lg:flex"
          >
            {NAV.map((item) =>
              item.key === "references" ? (
                <div
                  key={item.key}
                  className="relative"
                  onMouseEnter={showRef}
                  onMouseLeave={hideRef}
                  onFocus={showRef}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node))
                      setRefOpen(false);
                  }}
                >
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="link-line inline-flex items-center gap-1 text-[0.95rem] font-medium text-graphite-800"
                  >
                    {t(item.key)}
                    <ChevronDown
                      className="size-4 opacity-60"
                      aria-hidden="true"
                    />
                  </Link>
                  <AnimatePresence>
                    {refOpen && (
                      <motion.div
                        initial={reduce ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-1/2 mt-3 w-64 -translate-x-1/2 rounded-lg border border-steel-200 bg-white p-2 shadow-[var(--shadow-panel)]"
                      >
                        <p className="px-3 pt-2 pb-1 text-xs text-steel-500">
                          {t("refIntro")}
                        </p>
                        {REFERENCE_LINKS.map((r) => (
                          <Link
                            key={r.key}
                            href={r.href}
                            aria-current={
                              pathname === r.href ? "page" : undefined
                            }
                            className="block rounded-md px-3 py-2 text-[0.95rem] font-medium text-graphite-800 transition-colors hover:bg-steel-100 aria-[current=page]:bg-steel-100"
                          >
                            {t(r.key)}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="link-line text-[0.95rem] font-medium text-graphite-800"
                >
                  {t(item.key)}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <LocaleSwitcher />
            <Link
              href="/kontakt"
              className="btn btn-primary !min-h-[2.6rem] !px-4 text-[0.95rem]"
            >
              {t("cta")}
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={site.phoneHref}
              className="inline-flex size-11 items-center justify-center rounded-md text-graphite-900 hover:bg-steel-100"
              aria-label={t("phone")}
            >
              <Phone className="size-5" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t("close") : t("open")}
              className="inline-flex size-11 items-center justify-center rounded-md text-graphite-900 hover:bg-steel-100"
            >
              {open ? (
                <X className="size-6" aria-hidden="true" />
              ) : (
                <Menu className="size-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu (outside the header: backdrop-filter would otherwise become its containing block) */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-[var(--header-h)] bottom-0 z-40 overflow-y-auto bg-steel-50 lg:hidden"
          >
            <nav
              aria-label={t("menu")}
              className="container-x flex flex-col py-6"
            >
              <Link
                href="/"
                aria-current={pathname === "/" ? "page" : undefined}
                className="border-b border-steel-200 py-4 font-display text-2xl font-semibold text-graphite-900"
              >
                {t("home")}
              </Link>
              {NAV.map((item) => (
                <div key={item.key} className="border-b border-steel-200">
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="block py-4 font-display text-2xl font-semibold text-graphite-900"
                  >
                    {t(item.key)}
                  </Link>
                  {item.key === "references" && (
                    <div className="-mt-1 mb-3 flex flex-col">
                      {REFERENCE_LINKS.map((r) => (
                        <Link
                          key={r.key}
                          href={r.href}
                          className="py-2 pl-4 text-base text-graphite-600"
                        >
                          {t(r.key)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <LocaleSwitcher />
                <Link href="/kontakt" className="btn btn-primary">
                  {t("cta")}
                </Link>
              </div>
              <div className="mt-8 text-sm text-graphite-600">
                <a href={`mailto:${site.email}`} className="block py-1">
                  {site.email}
                </a>
                <a href={site.phoneHref} className="block py-1">
                  {site.phone}
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
