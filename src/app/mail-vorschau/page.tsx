import type { Metadata } from "next";
import { TEMPLATES, renderPreview } from "@/lib/mail-templates.mjs";

export const metadata: Metadata = {
  title: "E-Mail-Vorschau",
  robots: { index: false, follow: false },
};

const hints: Record<string, string> = {
  tisch: "Geht an den Gast, sobald du im Admin auf „Bestätigen“ klickst.",
  event: "Eigenes Design für Reservierungen zur Deutsch-Griechischen Nacht (mit Plakat).",
  allgemein: "Flexible Vorlage für Rückmeldungen auf Anfragen und Bewerbungen.",
};

const nummer: Record<string, string> = { tisch: "1", event: "2", allgemein: "3" };

export default function MailVorschauPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: 26, color: "#7a2222", marginBottom: 4 }}>
        E-Mail-Vorschau
      </h1>
      <p style={{ color: "#6b5555", marginBottom: 32, fontSize: 15 }}>
        So sehen die automatischen E-Mails an die Gäste aus. Diese Templates
        liegen in Resend und werden real versendet. (Diese Vorschau ist nicht
        öffentlich verlinkt und nicht bei Google indexiert.)
      </p>

      {TEMPLATES.map((t) => (
        <section key={t.key} style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 17, color: "#2a1414", marginBottom: 2 }}>
            {nummer[t.key]} · {t.name}
          </h2>
          <p style={{ color: "#6b5555", fontSize: 13, margin: "0 0 10px" }}>
            {hints[t.key]}
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
            {renderPreview(t.subject, t.sample)}
          </div>
          <iframe
            title={t.name}
            srcDoc={renderPreview(t.html, t.sample)}
            style={{
              width: "100%",
              height: t.key === "event" ? 900 : 640,
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
