import type { Locale } from "@/i18n/routing";

/** Small inline flags for the language switcher. Purely decorative. */
export function Flag({ locale, className = "" }: { locale: Locale; className?: string }) {
  const common = { className, "aria-hidden": true as const, viewBox: "0 0 24 16" };
  if (locale === "sl") {
    return (
      <svg {...common}>
        <rect width="24" height="16" fill="#fff" />
        <rect y="5.33" width="24" height="5.34" fill="#0052b4" />
        <rect y="10.67" width="24" height="5.33" fill="#d80027" />
        {/* simplified coat of arms */}
        <path d="M5.2 3.6h3.6v3.2c0 1.6-1 2.6-1.8 3-.8-.4-1.8-1.4-1.8-3z" fill="#0052b4" stroke="#d80027" strokeWidth="0.4" />
        <path d="M5.8 7.4l1.2-1.6 1.2 1.6z" fill="#fff" />
        <path d="M5.5 7.6h3" stroke="#fff" strokeWidth="0.5" />
      </svg>
    );
  }
  if (locale === "de") {
    return (
      <svg {...common}>
        <rect width="24" height="16" fill="#000" />
        <rect y="5.33" width="24" height="5.34" fill="#d00" />
        <rect y="10.67" width="24" height="5.33" fill="#ffce00" />
      </svg>
    );
  }
  // en: Union Jack, simplified
  return (
    <svg {...common}>
      <rect width="24" height="16" fill="#012169" />
      <path d="M0 0l24 16M24 0L0 16" stroke="#fff" strokeWidth="3" />
      <path d="M0 0l24 16M24 0L0 16" stroke="#c8102e" strokeWidth="1.2" />
      <path d="M12 0v16M0 8h24" stroke="#fff" strokeWidth="4.5" />
      <path d="M12 0v16M0 8h24" stroke="#c8102e" strokeWidth="2.5" />
    </svg>
  );
}
