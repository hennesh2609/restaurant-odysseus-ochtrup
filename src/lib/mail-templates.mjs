// Kanonische Quelle der Resend-E-Mail-Templates für Restaurant Odysseus.
// Wird von zwei Stellen genutzt:
//   1) scripts/setup-resend-templates.mjs  -> legt/aktualisiert die Templates in Resend an
//   2) src/app/mail-vorschau/page.tsx      -> lokale Vorschau mit Beispieldaten
//
// Personalisierung über Resend-Variablen im Format {{{VARIABLE}}} (dreifach!).
// Nur Inline-Styles verwenden (E-Mail-Kompatibilität; keine {}-Kollision mit Variablen).

// Öffentliche Basis-URL für Bilder (Logo, Plakat). Bilder liegen in /public/images.
export const ASSET_BASE = "https://restaurant-odysseus-ochtrup.vercel.app";

const C = {
  bordeaux: "#7a2222",
  bordeauxDark: "#5e1a1a",
  gold: "#d4a853",
  cream: "#f5ead8",
  creamSoft: "#faf4e9",
  paper: "#f1ebe1",
  ink: "#2a1414",
  inkSoft: "#6b5555",
  line: "#e7dccb",
};

const FONT = "Georgia, 'Cormorant Garamond', 'Times New Roman', serif";

// Gemeinsames Grundgerüst (Header mit Logo, Gold-Linie, Body, Footer)
// Mobile-Optimierung über Media-Query (Padding/Schriftgrößen) + robuste Tabellen.
function shell({ preheader, eyebrow, heading, bodyHtml, headerBg = C.cream }) {
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<style>
  @media only screen and (max-width:600px) {
    .card { border-radius:0 !important; }
    .hpad { padding:22px 18px 14px !important; }
    .bpad { padding:26px 20px !important; }
    .fpad { padding:20px 18px !important; }
    .title { font-size:20px !important; }
    .logo { width:130px !important; }
    .lbl { font-size:12px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.paper};font-family:${FONT};color:${C.ink}">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0">${preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};padding:24px 10px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="card" style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 6px 24px rgba(90,26,26,0.10)">
        <tr><td class="hpad" style="background:${headerBg};padding:26px 36px 20px;text-align:center">
          <img src="${ASSET_BASE}/images/odysseus-logo.png" width="150" alt="Restaurant Odysseus" class="logo" style="display:inline-block;width:150px;max-width:55%;height:auto">
          <div style="font-size:11px;letter-spacing:0.24em;color:${C.bordeaux};text-transform:uppercase;margin-top:12px;opacity:0.85">${eyebrow}</div>
        </td></tr>
        <tr><td style="background:${C.gold};height:4px;line-height:4px;font-size:0">&nbsp;</td></tr>
        <tr><td class="bpad" style="padding:32px 36px">
          <h1 class="title" style="margin:0 0 20px;font-size:23px;color:${C.bordeaux};line-height:1.3">${heading}</h1>
          ${bodyHtml}
        </td></tr>
        <tr><td class="fpad" style="background:${C.creamSoft};border-top:1px solid ${C.line};padding:22px 36px;text-align:center">
          <div style="font-size:14px;color:${C.bordeaux};font-weight:bold">Restaurant Odysseus</div>
          <div style="font-size:12px;color:${C.inkSoft};margin-top:6px;line-height:1.7">
            Kniepenkamp 1 · 48607 Ochtrup<br>
            Tel. <a href="tel:+4925531204" style="color:${C.bordeaux};text-decoration:none">02553 1204</a>
            &nbsp;·&nbsp;
            <a href="mailto:info@odysseus-ochtrup.de" style="color:${C.bordeaux};text-decoration:none">info@odysseus-ochtrup.de</a>
          </div>
        </td></tr>
      </table>
      <div style="max-width:560px;margin:14px auto 0;font-size:11px;color:${C.inkSoft};opacity:0.7;text-align:center">
        Diese E-Mail wurde automatisch vom Reservierungssystem von Restaurant Odysseus versendet.
      </div>
    </td></tr>
  </table>
</body>
</html>`;
}

// Zwei-Spalten-Tabelle: Label (nicht umbrechend) links, Wert rechts (bricht sauber
// innerhalb seiner Zelle um). Sieht auf Desktop und Smartphone gleichermaßen gut aus.
function detailBox(rows, accent = C.bordeaux) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.creamSoft};border-left:4px solid ${accent};border-radius:0 8px 8px 0;margin:22px 0">
    <tr><td style="padding:14px 22px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${rows
          .map(
            ([k, v]) =>
              `<tr>
          <td class="lbl" style="padding:6px 14px 6px 0;font-size:13px;color:${C.inkSoft};vertical-align:top;white-space:nowrap">${k}</td>
          <td style="padding:6px 0;font-size:15px;color:${C.ink};font-weight:bold;vertical-align:top;line-height:1.4">${v}</td>
        </tr>`
          )
          .join("")}
      </table>
    </td></tr>
  </table>`;
}

const p = (t) =>
  `<p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:${C.ink}">${t}</p>`;
const gruss = `<p style="margin:22px 0 0;font-size:15px;line-height:1.7">Herzliche Grüße<br><strong>Ihr Team vom Restaurant Odysseus</strong></p>`;

// ── Template 1: Tischreservierung – Bestätigung ─────────────────────────────
const tischHtml = shell({
  preheader: "Ihre Tischreservierung ist bestätigt.",
  eyebrow: "Reservierung bestätigt",
  heading: "Ihr Tisch ist reserviert",
  bodyHtml: `
    ${p("Liebe/r {{{KONTAKTPERSON}}},")}
    ${p("herzlichen Dank für Ihre Reservierung. Wir freuen uns, Ihren Tisch verbindlich bestätigen zu dürfen – und noch mehr darauf, Sie bei uns begrüßen zu dürfen.")}
    ${detailBox([
      ["Datum", "{{{DATUM}}}"],
      ["Uhrzeit", "{{{UHRZEIT}}} Uhr"],
      ["Personen", "{{{PERSONEN}}}"],
      ["Ort", "Restaurant Odysseus, Kniepenkamp 1"],
    ])}
    ${p('Sollte sich an Ihren Plänen etwas ändern, geben Sie uns bitte kurz Bescheid – telefonisch unter <a href="tel:+4925531204" style="color:' + C.bordeaux + ';font-weight:bold;text-decoration:none">02553 1204</a>.')}
    ${gruss}`,
});

// ── Template 2: Deutsch-Griechische Nacht – Bestätigung ─────────────────────
const eventHtml = shell({
  preheader: "Ihre Plätze für die Deutsch-Griechische Nacht sind reserviert.",
  headerBg: C.cream,
  eyebrow: "Die 3. Ochtruper · Deutsch-Griechische Nacht",
  heading: "Ihre Plätze sind reserviert",
  bodyHtml: `
    ${p("Liebe/r {{{KONTAKTPERSON}}},")}
    ${p("Ihre Sitzplatzreservierung für die <strong>Deutsch-Griechische Nacht</strong> ist bestätigt. Freuen Sie sich auf einen Abend voller Live-Musik, griechischer Spezialitäten und ausgelassener Stimmung – open-air mitten in Ochtrup.")}
    <a href="${ASSET_BASE}/deutsch-griechische-nacht" style="text-decoration:none">
      <img src="${ASSET_BASE}/images/plakat-dg-nacht-2026.jpg" width="488" alt="Plakat Deutsch-Griechische Nacht 2026" style="display:block;width:100%;max-width:488px;height:auto;border-radius:10px;margin:6px 0 4px">
    </a>
    ${detailBox(
      [
        ["Datum", "Samstag, 22. August 2026"],
        ["Beginn", "ab 18:00 Uhr"],
        ["Personen", "{{{PERSONEN}}}"],
        ["Ort", "Open-Air auf dem Kirchplatz, Ochtrup"],
        ["Eintritt", "frei"],
      ],
      C.gold
    )}
    ${p('Bei Rückfragen zur Veranstaltung erreichen Sie uns unter <a href="tel:016097038374" style="color:' + C.bordeaux + ';font-weight:bold;text-decoration:none">0160 97038374</a>.')}
    <p style="margin:22px 0 0;font-size:15px;line-height:1.7">Wir freuen uns auf Sie!<br><strong>Bücker &amp; Restaurant Odysseus</strong></p>`,
});

// ── Template 3: Allgemeine Antwort (Anfragen / Bewerbungen) ─────────────────
const allgemeinHtml = shell({
  preheader: "Ihre Nachricht an Restaurant Odysseus",
  eyebrow: "Ihre Nachricht an uns",
  heading: "{{{BETREFF}}}",
  bodyHtml: `
    ${p("Liebe/r {{{KONTAKTPERSON}}},")}
    <div style="font-size:15px;line-height:1.7;color:${C.ink}">{{{NACHRICHT}}}</div>
    ${gruss}`,
});

// Beispiel-Antworttext (Startwert im Admin / Vorschau)
export const ALLGEMEIN_BEISPIEL =
  "vielen Dank für Ihre Nachricht – wir haben Ihre Anfrage erhalten und melden uns schnellstmöglich persönlich bei Ihnen zurück.<br><br>Für dringende Anliegen erreichen Sie uns auch gerne telefonisch zu unseren Öffnungszeiten.";

export const TEMPLATES = [
  {
    key: "tisch",
    alias: "reservierung-tisch",
    name: "Tischreservierung – Bestätigung",
    subject: "Reservierungsbestätigung – Restaurant Odysseus",
    html: tischHtml,
    sample: {
      KONTAKTPERSON: "Familie Papadopoulos",
      DATUM: "Samstag, 15. August 2026",
      UHRZEIT: "19:30",
      PERSONEN: "4",
    },
  },
  {
    key: "event",
    alias: "reservierung-event",
    name: "Deutsch-Griechische Nacht – Bestätigung",
    subject: "Ihre Plätze für die Deutsch-Griechische Nacht – bestätigt",
    html: eventHtml,
    sample: { KONTAKTPERSON: "Familie Schmitz", PERSONEN: "6" },
  },
  {
    key: "allgemein",
    alias: "allgemeine-antwort",
    name: "Allgemeine Antwort (Anfragen / Bewerbungen)",
    subject: "{{{BETREFF}}} – Restaurant Odysseus",
    html: allgemeinHtml,
    sample: {
      KONTAKTPERSON: "Frau Müller",
      BETREFF: "Ihre Bewerbung als Servicekraft",
      NACHRICHT: ALLGEMEIN_BEISPIEL,
    },
  },
];

// Ersetzt {{{VAR}}} durch Beispielwerte (nur für die lokale Vorschau).
export function renderPreview(html, vars) {
  return html.replace(/\{\{\{(\w+)\}\}\}/g, (_, k) => vars[k] ?? "");
}
