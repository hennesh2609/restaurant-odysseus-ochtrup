"use client";

import { useEffect, useState } from "react";
import { getConsent, saveConsent, onConsentChanged } from "@/lib/cookie-consent";

interface Props {
  title: string;
  src: string;
  className?: string;
}

export function CookieMap({ title, src, className = "" }: Props) {
  const [mapsOk, setMapsOk] = useState<boolean | null>(null);

  useEffect(() => {
    const read = () => setMapsOk(getConsent()?.maps ?? false);
    read();
    return onConsentChanged(read);
  }, []);

  // Noch keine Entscheidung geladen (SSR-Hydration)
  if (mapsOk === null) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-cream-dark`}
        aria-hidden="true"
      />
    );
  }

  if (!mapsOk) {
    return (
      <div
        className={`${className} flex flex-col items-center justify-center gap-3 bg-cream-dark px-6 text-center`}
      >
        <svg
          className="h-8 w-8 text-bordeaux/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>
        <p className="max-w-[220px] text-xs leading-relaxed text-ink-soft">
          Google Maps ist deaktiviert. Bitte Cookies akzeptieren, um die Karte zu laden.
        </p>
        <button
          onClick={() => {
            saveConsent(true);
            setMapsOk(true);
          }}
          className="rounded-full bg-bordeaux px-5 py-2 text-xs font-semibold text-cream transition-colors hover:bg-bordeaux-dark"
        >
          Karte laden
        </button>
      </div>
    );
  }

  return (
    <iframe
      title={title}
      src={src}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
