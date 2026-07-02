import type { Metadata } from "next";
import type { Reservation } from "@/lib/types";
import {
  tischBestaetigung,
  eventBestaetigung,
  allgemeineAntwort,
  allgemeineAntwortBeispiel,
} from "@/lib/email-templates";

export const metadata: Metadata = {
  title: "E-Mail-Vorschau",
  robots: { index: false, follow: false },
};

// Beispiel-Daten nur für die Vorschau
const tischBeispiel: Reservation = {
  id: "preview-1",
  kind: "restaurant",
  name: "Familie Papadopoulos",
  email: "gast@example.com",
  phone: "0170 1234567",
  date: "2026-08-15",
  time: "19:30",
  guests: 4,
  createdAt: new Date().toISOString(),
  status: "bestaetigt",
};

const eventBeispiel: Reservation = {
  ...tischBeispiel,
  id: "preview-2",
  kind: "event",
  name: "Familie Schmitz",
  date: "2026-08-22",
  guests: 6,
};

const templates = [
  {
    key: "tisch",
    label: "1 · Tischreservierung – Bestätigung",
    hint: "Geht an den Gast, sobald du im Admin auf „Bestätigen“ klickst.",
    mail: tischBestaetigung(tischBeispiel),
  },
  {
    key: "event",
    label: "2 · Deutsch-Griechische Nacht – Bestätigung",
    hint: "Eigenes Design für Event-Reservierungen.",
    mail: eventBestaetigung(eventBeispiel),
  },
  {
    key: "allgemein",
    label: "3 · Allgemeine Antwort (Anfragen / Bewerbungen)",
    hint: "Flexible Vorlage für Rückmeldungen auf Nachrichten.",
    mail: allgemeineAntwort({
      name: "Frau Müller",
      betreff: "Ihre Bewerbung als Servicekraft",
      nachricht: allgemeineAntwortBeispiel,
    }),
  },
];

export default function MailVorschauPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: 26, color: "#7a2222", marginBottom: 4 }}>
        E-Mail-Vorschau
      </h1>
      <p style={{ color: "#6b5555", marginBottom: 32, fontSize: 15 }}>
        So sehen die automatischen E-Mails an die Gäste aus. Diese Seite ist nur
        eine Vorschau (nicht öffentlich verlinkt, nicht indexiert).
      </p>

      {templates.map((t) => (
        <section key={t.key} style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 17, color: "#2a1414", marginBottom: 2 }}>
            {t.label}
          </h2>
          <p style={{ color: "#6b5555", fontSize: 13, margin: "0 0 10px" }}>
            {t.hint}
          </p>
          <div
            style={{
              fontSize: 13,
              color: "#6b5555",
              background: "#f1ebe1",
              border: "1px solid #e7dccb",
              borderRadius: "8px 8px 0 0",
              padding: "8px 14px",
            }}
          >
            <strong style={{ color: "#2a1414" }}>Betreff:</strong>{" "}
            {t.mail.subject}
          </div>
          <iframe
            title={t.label}
            srcDoc={t.mail.html}
            style={{
              width: "100%",
              height: 640,
              border: "1px solid #e7dccb",
              borderTop: "none",
              borderRadius: "0 0 8px 8px",
              background: "#fff",
            }}
          />
        </section>
      ))}
    </main>
  );
}
