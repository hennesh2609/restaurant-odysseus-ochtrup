import Link from "next/link";
import { restaurant, openingHours } from "@/lib/restaurant";
import { MeanderStrip } from "./Meander";
import { CookieSettingsLink } from "./CookieSettingsLink";

export function Footer() {
  return (
    <footer className="bg-bordeaux-dark text-cream-dark">
      <MeanderStrip />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        {/* Marke */}
        <div>
          <p className="font-display text-2xl tracking-wide text-cream">ODYSSEUS</p>
          <p className="mt-3 max-w-xs font-serif text-lg italic text-cream-dark/80">
            {restaurant.tagline}
          </p>
          <p className="mt-4 text-sm text-cream-dark/70">
            Inhaber: {restaurant.owner}
          </p>
        </div>

        {/* Kontakt */}
        <div>
          <h3 className="font-display text-sm tracking-widest text-gold-light">
            KONTAKT
          </h3>
          <address className="mt-4 space-y-1 not-italic text-sm leading-relaxed">
            <p>{restaurant.street}</p>
            <p>
              {restaurant.zip} {restaurant.city}
            </p>
            <p className="pt-2">
              Tel.:{" "}
              <a
                href={`tel:${restaurant.phoneHref}`}
                className="hover:text-cream hover:underline"
              >
                {restaurant.phone}
              </a>
            </p>
            <p>
              E-Mail:{" "}
              <a
                href={`mailto:${restaurant.email}`}
                className="hover:text-cream hover:underline"
              >
                {restaurant.email}
              </a>
            </p>
          </address>
        </div>

        {/* Öffnungszeiten */}
        <div>
          <h3 className="font-display text-sm tracking-widest text-gold-light">
            ÖFFNUNGSZEITEN
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {openingHours.map((h) => (
              <li key={h.days} className="flex flex-col">
                <span className="font-medium text-cream">{h.days}</span>
                <span className="text-cream-dark/75">
                  {h.time}
                  {h.note ? ` (${h.note})` : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-cream-dark/15">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-cream-dark/60 sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} {restaurant.name}, {restaurant.city}
          </p>
          <div className="flex flex-wrap gap-5">
            <Link href="/impressum" className="hover:text-cream hover:underline">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-cream hover:underline">
              Datenschutz
            </Link>
            <CookieSettingsLink />
          </div>
        </div>
      </div>
    </footer>
  );
}
