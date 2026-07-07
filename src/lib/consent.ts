export const CONSENT_STORAGE_KEY = "color-match-consent";
const LEGACY_CONSENT_KEY = "color-match-cookie-consent";

export type ConsentStatus = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_PARAMS: Record<ConsentStatus, Record<string, string>> = {
  granted: {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted",
  },
  denied: {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  },
};

export function getStoredConsent(): ConsentStatus | null {
  if (typeof window === "undefined") return null;

  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (value === "granted" || value === "denied") return value;

    if (localStorage.getItem(LEGACY_CONSENT_KEY) === "accepted") {
      return "granted";
    }
  } catch {
    /* ignore */
  }

  return null;
}

export function setStoredConsent(status: ConsentStatus): void {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, status);
    localStorage.removeItem(LEGACY_CONSENT_KEY);
  } catch {
    /* ignore */
  }
}

export function applyConsent(status: ConsentStatus): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", CONSENT_PARAMS[status]);
}

export function consentDefaultScript(): string {
  return `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      wait_for_update: 500
    });
  `;
}
