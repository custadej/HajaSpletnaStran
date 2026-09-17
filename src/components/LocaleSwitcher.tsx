"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { localeMeta } from "@/lib/site";
import { Flag } from "./Flag";

type Props = {
  variant?: "light" | "dark";
  className?: string;
};

/** Three-way language switch (flag + code) that keeps the visitor on the same page. */
export function LocaleSwitcher({ variant = "light", className = "" }: Props) {
  const locale = useLocale();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const params = useParams();

  const base =
    variant === "light"
      ? "text-graphite-600 hover:bg-white hover:text-graphite-900"
      : "text-steel-300 hover:bg-white/10 hover:text-white";
  const active =
    variant === "light"
      ? "bg-white text-graphite-900 shadow-[0_1px_2px_rgba(12,23,46,0.12)]"
      : "bg-white text-graphite-900";
  const wrap = variant === "light" ? "bg-steel-100" : "bg-white/10";

  return (
    <nav aria-label={t("language")} className={`inline-flex items-center gap-0.5 rounded-md p-0.5 ${wrap} ${className}`}>
      {routing.locales.map((l) => (
        <Link
          key={l}
          // @ts-expect-error -- params always match the current route
          href={{ pathname, params }}
          locale={l}
          hrefLang={localeMeta[l].hrefLang}
          aria-current={l === locale ? "true" : undefined}
          aria-label={localeMeta[l].label}
          className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-[0.78rem] font-semibold tracking-wide transition-colors duration-200 ${
            l === locale ? active : base
          }`}
        >
          <Flag locale={l} className="h-3 w-[18px] rounded-[2px] ring-1 ring-black/10" />
          {localeMeta[l].short}
        </Link>
      ))}
    </nav>
  );
}
