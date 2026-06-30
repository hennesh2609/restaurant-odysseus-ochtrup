import type { Metadata } from "next";
import { restaurant } from "@/lib/restaurant";

export const metadata: Metadata = {
  title: "Impressum",
};

export default function ImpressumPage() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <h1 className="font-serif text-4xl font-semibold text-ink">Impressum</h1>
        <div className="mt-8 space-y-6 leading-relaxed text-ink-soft">
          <div>
            <h2 className="font-display text-sm tracking-widest text-bordeaux">
              ANGABEN GEMÄSS § 5 TMG
            </h2>
            <p className="mt-3">
              {restaurant.name}
              <br />
              Inhaber: {restaurant.owner}
              <br />
              {restaurant.street}
              <br />
              {restaurant.zip} {restaurant.city}
            </p>
          </div>

          <div>
            <h2 className="font-display text-sm tracking-widest text-bordeaux">
              KONTAKT
            </h2>
            <p className="mt-3">
              Telefon: {restaurant.phone}
              <br />
              Fax: {restaurant.fax}
              <br />
              E-Mail:{" "}
              <a
                href={`mailto:${restaurant.email}`}
                className="text-bordeaux hover:underline"
              >
                {restaurant.email}
              </a>
            </p>
          </div>

          <div>
            <h2 className="font-display text-sm tracking-widest text-bordeaux">
              VERANTWORTLICH FÜR DEN INHALT
            </h2>
            <p className="mt-3">
              {restaurant.owner}, Anschrift wie oben.
            </p>
          </div>

          <div>
            <h2 className="font-display text-sm tracking-widest text-bordeaux">
              HAFTUNG FÜR INHALTE
            </h2>
            <p className="mt-3">
              Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt.
              Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
              können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind
              wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach
              den allgemeinen Gesetzen verantwortlich.
            </p>
          </div>

          <div>
            <h2 className="font-display text-sm tracking-widest text-bordeaux">
              HINWEIS
            </h2>
            <p className="mt-3">
              Dieses Impressum ist ein Entwurf. Bitte vor Veröffentlichung
              rechtlich prüfen und ggf. um Umsatzsteuer-ID, zuständige
              Aufsichtsbehörde und weitere Pflichtangaben ergänzen.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
