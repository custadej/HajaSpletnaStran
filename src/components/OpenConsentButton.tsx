"use client";

import { openConsentSettings } from "@/lib/consent";

export function OpenConsentButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={openConsentSettings} className="btn btn-dark">
      {label}
    </button>
  );
}
