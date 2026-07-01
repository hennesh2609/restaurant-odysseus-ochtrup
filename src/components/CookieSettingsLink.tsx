"use client";

import { clearConsent } from "@/lib/cookie-consent";

export function CookieSettingsLink() {
  return (
    <button
      onClick={() => {
        clearConsent();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="hover:text-cream hover:underline"
    >
      Cookie-Einstellungen
    </button>
  );
}
