export type Consent = {
  necessary: true;
  analytics: boolean;
  /** ISO date when the choice was made */
  at: string;
  v: 1;
};

export const CONSENT_COOKIE = "haja_consent";
export const CONSENT_EVENT = "haja:consent";
export const CONSENT_OPEN_EVENT = "haja:consent-open";
const MAX_AGE = 60 * 60 * 24 * 365; // 12 months

export function readConsent(): Consent | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`));
  if (!match) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1]));
    if (parsed && parsed.v === 1 && typeof parsed.analytics === "boolean") {
      return parsed as Consent;
    }
  } catch {
    /* malformed cookie: treat as no choice */
  }
  return null;
}

export function writeConsent(analytics: boolean): Consent {
  const consent: Consent = { necessary: true, analytics, at: new Date().toISOString(), v: 1 };
  const secure =
    typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(
    JSON.stringify(consent),
  )}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: consent }));
  return consent;
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

// ---- React hook -----------------------------------------------------------
import { useSyncExternalStore } from "react";

function subscribe(cb: () => void) {
  window.addEventListener(CONSENT_EVENT, cb);
  return () => window.removeEventListener(CONSENT_EVENT, cb);
}
function getSnapshot() {
  const m = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`));
  return m ? m[1] : "";
}
function getServerSnapshot() {
  return null;
}

/**
 * Current consent. `undefined` while rendering on the server / hydrating,
 * `null` when the visitor has not decided yet, otherwise the stored choice.
 */
export function useConsent(): Consent | null | undefined {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (raw === null) return undefined;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (parsed && parsed.v === 1 && typeof parsed.analytics === "boolean") return parsed as Consent;
  } catch {
    /* malformed */
  }
  return null;
}
