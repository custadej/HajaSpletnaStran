"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { Cookie, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { CONSENT_OPEN_EVENT, readConsent, useConsent, writeConsent } from "@/lib/consent";

const EASE = [0.16, 1, 0.3, 1] as const;

export function CookieConsent() {
  const t = useTranslations("cookie");
  const reduce = useReducedMotion();
  const consent = useConsent();
  const [delayDone, setDelayDone] = useState(false);
  const [modal, setModal] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // The banner shows only when no choice is stored, after a short delay so it
  // does not compete with the hero on first paint.
  const banner = delayDone && consent === null;

  useEffect(() => {
    const id = setTimeout(() => setDelayDone(true), 900);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const open = () => {
      setAnalytics(readConsent()?.analytics ?? false);
      setModal(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, open);
  }, []);

  useEffect(() => {
    if (!modal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModal(false);
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [modal]);

  const decide = (allowAnalytics: boolean) => {
    writeConsent(allowAnalytics);
    setAnalytics(allowAnalytics);
    setModal(false);
  };

  return (
    <>
      <AnimatePresence>
        {banner && !modal && (
          <motion.div
            role="region"
            aria-label={t("title")}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-xl rounded-xl border border-steel-200 bg-white p-5 shadow-[var(--shadow-lift)] sm:inset-x-auto sm:right-5 sm:bottom-5 sm:left-auto sm:p-6"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-signal-100 text-signal-700">
                <Cookie className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-lg font-semibold text-graphite-900">{t("title")}</p>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-graphite-600">{t("text")}</p>
                <p className="mt-2 text-sm">
                  <Link href="/piskotki" className="underline underline-offset-4 hover:text-graphite-900">
                    {t("policy")}
                  </Link>
                </p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={() => decide(true)} className="btn btn-primary !min-h-[2.75rem]">
                {t("acceptAll")}
              </button>
              <button type="button" onClick={() => decide(false)} className="btn btn-ghost !min-h-[2.75rem]">
                {t("rejectAll")}
              </button>
              <button
                type="button"
                onClick={() => setModal(true)}
                className="btn !min-h-[2.75rem] text-graphite-700 hover:text-graphite-900"
              >
                {t("settings")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-end justify-center bg-graphite-950/60 p-3 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.target === e.currentTarget && setModal(false)}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cookie-modal-title"
              initial={reduce ? false : { opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="w-full max-w-lg rounded-xl bg-white p-6 shadow-[var(--shadow-lift)] sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 id="cookie-modal-title" className="font-display text-xl font-semibold text-graphite-900">
                  {t("modalTitle")}
                </h2>
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  aria-label={t("close")}
                  className="-mt-1 -mr-1 inline-flex size-10 items-center justify-center rounded-md text-graphite-600 hover:bg-steel-100"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>
              <p className="mt-2 text-[0.95rem] text-graphite-600">{t("modalText")}</p>

              <div className="mt-5 divide-y divide-steel-200 rounded-lg border border-steel-200">
                <div className="flex items-start justify-between gap-4 p-4">
                  <div>
                    <p className="font-semibold text-graphite-900">{t("necessary")}</p>
                    <p className="mt-1 text-sm text-graphite-600">{t("necessaryText")}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-steel-100 px-2.5 py-1 text-xs font-semibold text-graphite-700">
                    {t("alwaysOn")}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4 p-4">
                  <div>
                    <label htmlFor="consent-analytics" className="font-semibold text-graphite-900">
                      {t("analytics")}
                    </label>
                    <p className="mt-1 text-sm text-graphite-600">{t("analyticsText")}</p>
                  </div>
                  <button
                    id="consent-analytics"
                    type="button"
                    role="switch"
                    aria-checked={analytics}
                    onClick={() => setAnalytics((v) => !v)}
                    className={`relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition-colors ${
                      analytics ? "bg-graphite-900" : "bg-steel-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 size-5 rounded-full bg-white shadow transition-transform ${
                        analytics ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <button type="button" onClick={() => decide(analytics)} className="btn btn-dark !min-h-[2.75rem]">
                  {t("save")}
                </button>
                <button type="button" onClick={() => decide(true)} className="btn btn-ghost !min-h-[2.75rem]">
                  {t("acceptAll")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
