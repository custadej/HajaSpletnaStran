"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useConsent } from "@/lib/consent";
import { site } from "@/lib/site";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Google Analytics 4, loaded only after the visitor allows analytics cookies.
 * Uses Consent Mode v2 so a later withdrawal is honoured without a reload.
 */
export function Analytics() {
  const pathname = usePathname();
  const consent = useConsent();
  const allowed = consent?.analytics === true;
  const id = site.gaId;

  // Keep Google's consent state in sync with the visitor's choice.
  useEffect(() => {
    if (!consent || !window.gtag) return;
    window.gtag("consent", "update", {
      analytics_storage: consent.analytics ? "granted" : "denied",
    });
  }, [consent]);

  // Page views for client-side navigation.
  useEffect(() => {
    if (!allowed || !id || !window.gtag) return;
    window.gtag("event", "page_view", { page_path: pathname });
  }, [pathname, allowed, id]);

  if (!id || !allowed) return null;

  return (
    <>
      <Script id="ga-consent" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied', analytics_storage:'granted'});
gtag('js', new Date());
gtag('config', '${id}', { anonymize_ip: true, send_page_view: false });`}
      </Script>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
    </>
  );
}
