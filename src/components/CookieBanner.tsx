"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getConsent, saveConsent } from "@/lib/cookie-consent";

type View = "banner" | "settings";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [view, setView] = useState<View>("banner");
  const [mapsEnabled, setMapsEnabled] = useState(false);

  useEffect(() => {
    if (!getConsent()) setVisible(true);
  }, []);

  if (!visible) return null;

  function acceptAll() {
    saveConsent(true);
    setVisible(false);
  }

  function acceptEssential() {
    saveConsent(false);
    setVisible(false);
  }

  function saveSettings() {
    saveConsent(mapsEnabled);
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie-Einstellungen"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-bordeaux/15 bg-cream shadow-[0_8px_40px_rgba(28,16,12,0.18)] backdrop-blur-sm">
        {view === "banner" ? (
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <span className="hidden text-2xl sm:block" aria-hidden>🍪</span>
              <div className="flex-1">
                <h2 className="font-display text-base tracking-widest text-bordeaux">
                  COOKIE-EINSTELLUNGEN
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  Diese Website verwendet Cookies. Essentielle Cookies sind für den
                  Betrieb der Seite notwendig und können nicht deaktiviert werden.
                  Optionale Cookies (z. B. Google Maps) werden nur mit Ihrer
                  Zustimmung geladen.{" "}
                  <Link
                    href="/datenschutz"
                    className="text-bordeaux underline underline-offset-2 hover:text-bordeaux-dark"
                  >
                    Mehr erfahren
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={() => setView("settings")}
                className="order-last text-sm text-ink-soft underline underline-offset-2 hover:text-ink sm:order-first"
              >
                Einstellungen anpassen
              </button>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={acceptEssential}
                  className="rounded-full border border-bordeaux/40 px-6 py-2.5 text-sm font-semibold text-bordeaux transition-colors hover:bg-bordeaux/5"
                >
                  Nur Essentielle
                </button>
                <button
                  onClick={acceptAll}
                  className="rounded-full bg-bordeaux px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-bordeaux-dark"
                >
                  Alle akzeptieren
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            <button
              onClick={() => setView("banner")}
              className="mb-4 flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
            >
              <span aria-hidden>←</span> Zurück
            </button>
            <h2 className="font-display text-base tracking-widest text-bordeaux">
              COOKIE-EINSTELLUNGEN
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              Hier können Sie festlegen, welche Cookies gesetzt werden dürfen.
            </p>

            <div className="mt-5 divide-y divide-bordeaux/10">
              {/* Essenziell – immer aktiv */}
              <div className="flex items-start justify-between gap-4 py-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">
                    Essentielle Cookies
                    <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Immer aktiv
                    </span>
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                    Diese Cookies sind für den technischen Betrieb der Website
                    zwingend erforderlich. Sie ermöglichen z. B. das Laden von
                    Seiten und den sicheren Zugriff auf geschützte Bereiche. Sie
                    können nicht deaktiviert werden.
                  </p>
                  <p className="mt-1 text-xs text-ink-soft/70">
                    Anbieter: Restaurant Odysseus · Speicherdauer: Sitzung
                  </p>
                </div>
                <div className="mt-0.5 shrink-0">
                  <div
                    aria-checked="true"
                    role="checkbox"
                    aria-label="Essentielle Cookies (immer aktiv)"
                    className="flex h-6 w-11 cursor-not-allowed items-center rounded-full bg-bordeaux/40 px-0.5"
                  >
                    <span className="h-5 w-5 translate-x-5 rounded-full bg-white shadow transition-transform" />
                  </div>
                </div>
              </div>

              {/* Google Maps – optional */}
              <div className="flex items-start justify-between gap-4 py-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">
                    Externe Karten (Google Maps)
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                    Wir binden Google Maps ein, um Ihnen die Anfahrt zu unserem
                    Restaurant zu erleichtern. Dabei werden Daten an Google LLC
                    (USA) übertragen. Google kann diese Daten zur Erstellung von
                    Nutzerprofilen verwenden. Rechtsgrundlage: Einwilligung
                    (Art. 6 Abs. 1 lit. a DSGVO).
                  </p>
                  <p className="mt-1 text-xs text-ink-soft/70">
                    Anbieter: Google LLC, USA · Datenschutzerklärung:{" "}
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      policies.google.com/privacy
                    </a>
                  </p>
                </div>
                <button
                  role="checkbox"
                  aria-checked={mapsEnabled}
                  aria-label="Google Maps aktivieren"
                  onClick={() => setMapsEnabled((v) => !v)}
                  className={`mt-0.5 flex h-6 w-11 shrink-0 items-center rounded-full px-0.5 transition-colors ${
                    mapsEnabled ? "bg-bordeaux" : "bg-bordeaux/20"
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      mapsEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={acceptEssential}
                className="rounded-full border border-bordeaux/40 px-6 py-2.5 text-sm font-semibold text-bordeaux transition-colors hover:bg-bordeaux/5"
              >
                Nur Essentielle
              </button>
              <button
                onClick={saveSettings}
                className="rounded-full bg-bordeaux px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-bordeaux-dark"
              >
                Auswahl speichern
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
