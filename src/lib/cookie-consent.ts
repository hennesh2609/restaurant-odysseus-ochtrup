export type CookieConsent = {
  essential: true;
  maps: boolean;
  decidedAt: string;
};

const KEY = "odysseus-cookie-consent";
const EVENT = "odysseus:consent-changed";

export function getConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CookieConsent) : null;
  } catch {
    return null;
  }
}

export function saveConsent(maps: boolean): void {
  const consent: CookieConsent = {
    essential: true,
    maps,
    decidedAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify(consent));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function clearConsent(): void {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function onConsentChanged(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
