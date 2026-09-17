"use client";

import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";

type ErrorKey = "name" | "email" | "subject" | "message" | "consent";
type Errors = Partial<Record<ErrorKey, string>>;
type Status = "idle" | "sending" | "success" | "error";

function FieldError({ k, message }: { k: ErrorKey; message?: string }) {
  if (!message) return null;
  return (
    <p id={`${k}-error`} role="alert" className="mt-1.5 text-sm text-danger">
      {message}
    </p>
  );
}

export function ContactForm() {
  const t = useTranslations("contact.form");
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  const validate = (data: FormData): Errors => {
    const e: Errors = {};
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name) e.name = t("required");
    if (!email) e.email = t("required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) e.email = t("invalidEmail");
    if (!message) e.message = t("required");
    else if (message.length < 10) e.message = t("minMessage");
    if (!data.get("consent")) e.consent = t("consentRequired");
    return e;
  };

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const data = new FormData(form);
    const e = validate(data);
    setErrors(e);
    if (Object.keys(e).length) {
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    setStatus("sending");

    // Static demo (GitHub Pages) has no server: hand the message to the visitor's mail app instead.
    if (process.env.NEXT_PUBLIC_STATIC_EXPORT === "true") {
      const subject = encodeURIComponent(String(data.get("subject") || "Povpraševanje"));
      const body = encodeURIComponent(
        `${data.get("name")}\n${data.get("email")}\n${data.get("phone") || ""}\n\n${data.get("message")}`,
      );
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      setStatus("success");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          subject: data.get("subject"),
          message: data.get("message"),
          consent: true,
          website: data.get("website"), // honeypot
          locale,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  const field = (key: keyof Errors) => ({
    "aria-invalid": errors[key] ? ("true" as const) : undefined,
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-graphite-800">
            {t("name")}
          </label>
          <input id="name" name="name" type="text" autoComplete="organization" required className="field" {...field("name")} />
          <FieldError k="name" message={errors.name} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-graphite-800">
            {t("email")}
          </label>
          <input id="email" name="email" type="email" autoComplete="email" inputMode="email" required className="field" {...field("email")} />
          <FieldError k="email" message={errors.email} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-graphite-800">
            {t("phone")}
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" className="field" />
        </div>
        <div>
          <label htmlFor="subject" className="mb-1.5 block text-sm font-semibold text-graphite-800">
            {t("subject")}
          </label>
          <input id="subject" name="subject" type="text" className="field" />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-graphite-800">
          {t("message")}
        </label>
        <textarea id="message" name="message" rows={6} required className="field resize-y" placeholder={t("messageHint")} {...field("message")} />
        <FieldError k="message" message={errors.message} />
      </div>

      {/* Honeypot: hidden from people, filled by naive bots */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex items-start gap-3 text-[0.95rem] text-graphite-700">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-1 size-4 shrink-0 accent-graphite-900"
            aria-invalid={errors.consent ? "true" : undefined}
            aria-describedby={errors.consent ? "consent-error" : undefined}
          />
          <span>
            {t.rich("consent", {
              link: (chunks) => (
                <Link href="/zasebnost" className="underline underline-offset-4 hover:text-graphite-900">
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </label>
        <FieldError k="consent" message={errors.consent} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={status === "sending"} className="btn btn-primary disabled:opacity-70">
          {status === "sending" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
          {status === "sending" ? t("sending") : t("submit")}
        </button>
      </div>

      <AnimatePresence>
        {status === "success" && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 rounded-lg border border-ok/30 bg-ok/10 p-4 text-graphite-900"
          >
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-ok" aria-hidden="true" />
            <div>
              <p className="font-semibold">{t("successTitle")}</p>
              <p className="mt-0.5 text-sm text-graphite-700">{t("successText")}</p>
            </div>
          </motion.div>
        )}
        {status === "error" && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 rounded-lg border border-danger/30 bg-danger/10 p-4 text-graphite-900"
          >
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden="true" />
            <div>
              <p className="font-semibold">{t("errorTitle")}</p>
              <p className="mt-0.5 text-sm text-graphite-700">
                {t.rich("errorText", {
                  email: () => (
                    <a href={`mailto:${site.email}`} className="font-semibold underline underline-offset-4">
                      {site.email}
                    </a>
                  ),
                })}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
