import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { Reveal } from "@/components/motion/Reveal";

type Props = {
  title: string;
  lead?: string;
  back?: { href: AppPathname; label: string };
  children?: ReactNode;
  compact?: boolean;
};

/** Consistent opening block for inner pages. */
export function PageHeader({ title, lead, back, children, compact = false }: Props) {
  return (
    <section className="relative overflow-hidden">
      <div className="grid-texture pointer-events-none absolute inset-0" aria-hidden="true" />
      <Reveal className={`container-x relative ${compact ? "pt-10 pb-8 lg:pt-14 lg:pb-10" : "pt-12 pb-10 lg:pt-20 lg:pb-14"}`}>
        {back && (
          <Link href={back.href} className="link-line mb-6 inline-flex items-center gap-2 text-sm font-medium text-graphite-600 hover:text-graphite-900">
            <ArrowLeft className="size-4" aria-hidden="true" />
            {back.label}
          </Link>
        )}
        <h1 className="display-xl max-w-[16ch] text-graphite-900">{title}</h1>
        {lead && <p className="lead mt-6 max-w-[62ch]">{lead}</p>}
        {children}
      </Reveal>
    </section>
  );
}
