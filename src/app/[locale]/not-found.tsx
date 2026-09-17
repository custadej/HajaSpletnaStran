import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-start justify-center py-20">
      <p className="font-display text-sm font-semibold text-signal-700">404</p>
      <h1 className="display-lg mt-3 text-graphite-900">{t("title")}</h1>
      <p className="lead mt-5 max-w-[50ch]">{t("text")}</p>
      <Link href="/" className="btn btn-dark mt-8">
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t("back")}
      </Link>
    </section>
  );
}
