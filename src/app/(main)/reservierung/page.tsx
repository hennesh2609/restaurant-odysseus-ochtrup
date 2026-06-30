import type { Metadata } from "next";
import { ReservationForm } from "@/components/ReservationForm";
import { Meander } from "@/components/Meander";
import { restaurant, openingHours } from "@/lib/restaurant";

export const metadata: Metadata = {
  title: "Tisch reservieren",
  description:
    "Reservieren Sie online Ihren Tisch im Restaurant Odysseus in Ochtrup – schnell, bequem und rund um die Uhr.",
};

export default function ReservierungPage() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <div className="text-center">
          <p className="font-display text-sm tracking-[0.3em] text-bordeaux">
            RESERVIERUNG
          </p>
          <h1 className="mt-4 font-serif text-4xl font-semibold text-ink sm:text-5xl">
            Tisch reservieren
          </h1>
          <Meander className="mt-6 text-bordeaux/60" />
          <p className="mx-auto mt-6 max-w-xl text-lg text-ink-soft">
            Füllen Sie einfach das Formular aus – wir bestätigen Ihre
            Reservierung schnellstmöglich. Für kurzfristige Anfragen rufen Sie
            uns gerne direkt an.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-5">
          {/* Formular */}
          <div className="md:col-span-3">
            <div className="rounded-2xl border border-bordeaux/10 bg-cream p-6 shadow-soft sm:p-8">
              <ReservationForm kind="restaurant" />
            </div>
          </div>

          {/* Infos */}
          <aside className="md:col-span-2">
            <div className="rounded-2xl bg-bordeaux-dark p-6 text-cream shadow-soft sm:p-8">
              <h2 className="font-display text-sm tracking-widest text-gold-light">
                DIREKTER KONTAKT
              </h2>
              <p className="mt-4 text-cream/85">
                Lieber persönlich? Wir sind gerne für Sie da:
              </p>
              <a
                href={`tel:${restaurant.phoneHref}`}
                className="mt-3 block font-serif text-2xl text-gold-light hover:underline"
              >
                {restaurant.phone}
              </a>
              <a
                href={`mailto:${restaurant.email}`}
                className="mt-1 block text-sm text-cream/80 hover:underline"
              >
                {restaurant.email}
              </a>

              <div className="my-6 h-px bg-cream/15" />

              <h3 className="font-display text-sm tracking-widest text-gold-light">
                ÖFFNUNGSZEITEN
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                {openingHours.map((h) => (
                  <li key={h.days}>
                    <span className="block font-medium text-cream">
                      {h.days}
                    </span>
                    <span className="text-cream/70">
                      {h.time}
                      {h.note ? ` (${h.note})` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
