import type { Metadata } from "next";
import { restaurant } from "@/lib/restaurant";

export const metadata: Metadata = {
  title: "Datenschutz",
};

export default function DatenschutzPage() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <h1 className="font-serif text-4xl font-semibold text-ink">
          Datenschutzerklärung
        </h1>
        <div className="mt-8 space-y-6 leading-relaxed text-ink-soft">
          <div>
            <h2 className="font-display text-sm tracking-widest text-bordeaux">
              VERANTWORTLICHE STELLE
            </h2>
            <p className="mt-3">
              {restaurant.owner}
              <br />
              {restaurant.street}, {restaurant.zip} {restaurant.city}
              <br />
              Telefon: {restaurant.phone}
              <br />
              E-Mail: {restaurant.email}
            </p>
          </div>

          <div>
            <h2 className="font-display text-sm tracking-widest text-bordeaux">
              RESERVIERUNGEN
            </h2>
            <p className="mt-3">
              Wenn Sie über unser Online-Formular einen Tisch reservieren,
              verarbeiten wir die von Ihnen angegebenen Daten (Name, E-Mail,
              Telefonnummer, Datum, Uhrzeit, Personenzahl sowie optionale
              Nachricht) ausschließlich zur Bearbeitung und Bestätigung Ihrer
              Reservierung. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO
              (Durchführung vorvertraglicher Maßnahmen) bzw. lit. f DSGVO
              (berechtigtes Interesse an einer reibungslosen Tischverwaltung).
              Die Daten werden nach Abwicklung der Reservierung gelöscht, sofern
              keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
            </p>
          </div>

          <div>
            <h2 className="font-display text-sm tracking-widest text-bordeaux">
              SERVER-LOGFILES
            </h2>
            <p className="mt-3">
              Beim Besuch unserer Website werden automatisch Informationen
              allgemeiner Natur erfasst (z. B. Browsertyp, Betriebssystem,
              IP-Adresse). Diese dienen der Sicherstellung eines reibungslosen
              Verbindungsaufbaus sowie der Systemsicherheit. Rechtsgrundlage ist
              Art. 6 Abs. 1 lit. f DSGVO.
            </p>
          </div>

          <div>
            <h2 className="font-display text-sm tracking-widest text-bordeaux">
              KARTENDIENST (GOOGLE MAPS)
            </h2>
            <p className="mt-3">
              Zur Darstellung unseres Standorts binden wir Google Maps ein. Beim
              Aufruf der Karte werden Daten an Google übertragen. Anbieter ist
              die Google Ireland Limited. Weitere Informationen finden Sie in der
              Datenschutzerklärung von Google.
            </p>
          </div>

          <div>
            <h2 className="font-display text-sm tracking-widest text-bordeaux">
              IHRE RECHTE
            </h2>
            <p className="mt-3">
              Sie haben jederzeit das Recht auf Auskunft (Art. 15 DSGVO),
              Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO),
              Einschränkung der Verarbeitung (Art. 18 DSGVO), Widerspruch (Art.
              21 DSGVO) sowie Datenübertragbarkeit (Art. 20 DSGVO). Zudem können
              Sie sich bei einer Aufsichtsbehörde beschweren.
            </p>
          </div>

          <div>
            <h2 className="font-display text-sm tracking-widest text-bordeaux">
              HINWEIS
            </h2>
            <p className="mt-3">
              Diese Datenschutzerklärung ist ein Entwurf und sollte vor
              Veröffentlichung rechtlich geprüft und an die tatsächlich
              eingesetzten Dienste (Hosting, E-Mail-Versand, Datenbank) angepasst
              werden.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
