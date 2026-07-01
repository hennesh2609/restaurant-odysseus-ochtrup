import type { Metadata } from "next";
import Link from "next/link";
import { Meander } from "@/components/Meander";
import { ContactForm } from "@/components/ContactForm";
import { CookieMap } from "@/components/CookieMap";
import { restaurant, openingHours } from "@/lib/restaurant";

export const metadata: Metadata = {
  title: "Kontakt & Anfahrt",
  description:
    "Kontakt, Anfahrt und Öffnungszeiten des Restaurant Odysseus in Ochtrup. Schreiben Sie uns oder bewerben Sie sich als Aushilfe.",
};

export default async function KontaktPage({
  searchParams,
}: {
  searchParams: Promise<{ betreff?: string }>;
}) {
  const { betreff } = await searchParams;
  const defaultSubject =
    betreff === "bewerbung" ? "Bewerbung als Aushilfe" : "Allgemeine Anfrage";

  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="text-center">
          <p className="font-display text-sm tracking-[0.3em] text-bordeaux">
            KONTAKT & ANFAHRT
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold text-ink sm:text-5xl">
            Wir freuen uns auf Sie
          </h1>
          <Meander className="mt-6 text-bordeaux/60" />
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-2xl border border-bordeaux/10 shadow-soft">
              <CookieMap
                title="Standort Restaurant Odysseus"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  restaurant.mapsQuery
                )}&output=embed`}
                className="h-80 w-full"
              />
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                restaurant.mapsQuery
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-bordeaux hover:underline"
            >
              Route planen <span aria-hidden>→</span>
            </a>
          </div>

          <div>
            <div className="rounded-2xl bg-cream p-8 shadow-soft">
              <h2 className="font-display text-sm tracking-widest text-bordeaux">
                {restaurant.name.toUpperCase()}
              </h2>
              <address className="mt-4 space-y-1 not-italic text-ink-soft">
                <p className="text-lg font-medium text-ink">{restaurant.street}</p>
                <p className="text-lg text-ink">
                  {restaurant.zip} {restaurant.city}
                </p>
              </address>
              <div className="mt-5 space-y-2 text-ink-soft">
                <p>
                  Telefon:{" "}
                  <a
                    href={`tel:${restaurant.phoneHref}`}
                    className="font-semibold text-bordeaux hover:underline"
                  >
                    {restaurant.phone}
                  </a>
                </p>
                <p>Fax: {restaurant.fax}</p>
                <p>
                  E-Mail:{" "}
                  <a
                    href={`mailto:${restaurant.email}`}
                    className="font-semibold text-bordeaux hover:underline"
                  >
                    {restaurant.email}
                  </a>
                </p>
              </div>

              <div className="my-6 h-px bg-bordeaux/10" />

              <h3 className="font-display text-sm tracking-widest text-bordeaux">
                ÖFFNUNGSZEITEN
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                {openingHours.map((h) => (
                  <li
                    key={h.days}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="font-medium text-ink">{h.days}</span>
                    <span className="text-right text-ink-soft">
                      {h.time}
                      {h.note ? (
                        <span className="block text-xs opacity-70">{h.note}</span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/reservierung"
                className="mt-8 inline-block rounded-full bg-bordeaux px-8 py-3.5 text-sm font-semibold text-cream shadow-soft transition-all hover:bg-bordeaux-dark"
              >
                Tisch reservieren
              </Link>
            </div>
          </div>
        </div>

        {/* Kontakt- / Bewerbungsformular */}
        <div id="kontaktformular" className="mt-20 scroll-mt-24">
          <div className="text-center">
            <Meander className="text-bordeaux/60" />
            <h2 className="mt-6 font-serif text-3xl font-semibold text-ink sm:text-4xl">
              Schreiben Sie uns
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-soft">
              Egal ob Frage, Feedback oder Bewerbung als Aushilfe – nutzen Sie
              einfach das Formular. Wir freuen uns auf Ihre Nachricht.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-bordeaux/10 bg-cream p-6 shadow-soft sm:p-8">
            <ContactForm defaultSubject={defaultSubject} />
          </div>
        </div>
      </div>
    </section>
  );
}
