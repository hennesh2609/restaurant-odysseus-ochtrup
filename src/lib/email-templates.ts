// Kundenseitige E-Mail-Templates für Restaurant Odysseus.
// Reines HTML/Text – keine Server-Abhängigkeiten, damit die Templates auch
// in einer Vorschau-Seite gerendert werden können. Der eigentliche Versand
// läuft über notify.ts (Resend).

import type { Reservation } from "./types";
import { restaurant } from "./restaurant";
import { event } from "./event";

// ── Design-Tokens (an das Website-Design angelehnt) ─────────────────────────
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

export type RenderedEmail = { subject: string; html: string; text: string };

// ── Gemeinsames Grundgerüst ─────────────────────────────────────────────────
function shell(opts: {
  preheader: string;
  headerBg: string;
  eyebrow: string;
  heading: string;
  bodyHtml: string;
}): string {
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${opts.heading}</title>
</head>
<body style="margin:0;padding:0;background:${C.paper};font-family:Georgia,'Times New Roman',serif;color:${C.ink}">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0">${opts.preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 6px 24px rgba(90,26,26,0.08)">
        <!-- Header -->
        <tr><td style="background:${opts.headerBg};padding:30px 36px;text-align:center">
          <div style="font-size:12px;letter-spacing:0.28em;color:${C.gold};text-transform:uppercase;margin-bottom:8px">${opts.eyebrow}</div>
          <div style="font-size:26px;letter-spacing:0.14em;color:${C.cream};font-weight:bold">RESTAURANT ODYSSEUS</div>
          <div style="font-size:13px;color:${C.cream};opacity:0.8;margin-top:4px;font-style:italic">${restaurant.tagline}</div>
        </td></tr>
        <!-- Titelband -->
        <tr><td style="background:${C.gold};height:4px;line-height:4px;font-size:0">&nbsp;</td></tr>
        <!-- Body -->
        <tr><td style="padding:34px 36px">
          <h1 style="margin:0 0 20px;font-size:22px;color:${C.bordeaux};line-height:1.3">${opts.heading}</h1>
          ${opts.bodyHtml}
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:${C.creamSoft};border-top:1px solid ${C.line};padding:24px 36px;text-align:center">
          <div style="font-size:14px;color:${C.bordeaux};font-weight:bold">${restaurant.name}</div>
          <div style="font-size:12px;color:${C.inkSoft};margin-top:6px;line-height:1.6">
            ${restaurant.street} · ${restaurant.zip} ${restaurant.city}<br>
            Tel. <a href="tel:${restaurant.phoneHref}" style="color:${C.bordeaux};text-decoration:none">${restaurant.phone}</a>
            &nbsp;·&nbsp;
            <a href="mailto:${restaurant.email}" style="color:${C.bordeaux};text-decoration:none">${restaurant.email}</a>
          </div>
        </td></tr>
      </table>
      <div style="max-width:560px;margin:14px auto 0;font-size:11px;color:${C.inkSoft};opacity:0.7;text-align:center">
        Diese E-Mail wurde automatisch vom Reservierungssystem von ${restaurant.name} versendet.
      </div>
    </td></tr>
  </table>
</body>
</html>`;
}

// „Info-Box" mit Eckdaten
function detailBox(rows: [string, string][], accent = C.bordeaux): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.creamSoft};border-left:4px solid ${accent};border-radius:0 8px 8px 0;margin:22px 0">
    <tr><td style="padding:18px 22px">
      ${rows
        .map(
          ([k, v]) =>
            `<div style="margin:4px 0;font-size:15px;color:${C.ink}"><span style="display:inline-block;min-width:96px;color:${C.inkSoft};font-size:13px">${k}</span> <strong>${v}</strong></div>`
        )
        .join("")}
    </td></tr>
  </table>`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("de-DE", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

// ── 1) Tischreservierung – Bestätigung ──────────────────────────────────────
export function tischBestaetigung(r: Reservation): RenderedEmail {
  const dateStr = formatDate(r.date);
  const body = `
    <p style="margin:0 0 14px;font-size:16px;line-height:1.6">Liebe/r ${r.name},</p>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.7;color:${C.ink}">
      herzlichen Dank für Ihre Reservierung. Wir freuen uns, Ihren Tisch verbindlich bestätigen zu dürfen –
      und noch mehr darauf, Sie bei uns begrüßen zu dürfen.
    </p>
    ${detailBox([
      ["Datum", dateStr],
      ["Uhrzeit", `${r.time} Uhr`],
      ["Personen", String(r.guests)],
      ["Ort", `${restaurant.name}, ${restaurant.street}`],
    ])}
    <p style="margin:0 0 8px;font-size:15px;line-height:1.7">
      Sollte sich an Ihren Plänen etwas ändern, geben Sie uns bitte kurz Bescheid –
      telefonisch unter <a href="tel:${restaurant.phoneHref}" style="color:${C.bordeaux};font-weight:bold;text-decoration:none">${restaurant.phone}</a>.
    </p>
    <p style="margin:22px 0 0;font-size:15px;line-height:1.7">
      Herzliche Grüße<br>
      <strong>Ihr Team vom ${restaurant.name}</strong>
    </p>`;

  const html = shell({
    preheader: `Ihre Reservierung am ${dateStr} um ${r.time} Uhr ist bestätigt.`,
    headerBg: C.bordeaux,
    eyebrow: "Reservierung bestätigt",
    heading: "Ihr Tisch ist reserviert",
    bodyHtml: body,
  });

  const text = `Liebe/r ${r.name},

herzlichen Dank für Ihre Reservierung. Wir bestätigen Ihnen verbindlich:

Datum:    ${dateStr}
Uhrzeit:  ${r.time} Uhr
Personen: ${r.guests}
Ort:      ${restaurant.name}, ${restaurant.street}, ${restaurant.zip} ${restaurant.city}

Bei Änderungen erreichen Sie uns unter ${restaurant.phone}.

Herzliche Grüße
Ihr Team vom ${restaurant.name}`;

  return { subject: `Reservierungsbestätigung – ${restaurant.name}`, html, text };
}

// ── 2) Deutsch-Griechische Nacht – Bestätigung ──────────────────────────────
export function eventBestaetigung(r: Reservation): RenderedEmail {
  const body = `
    <p style="margin:0 0 14px;font-size:16px;line-height:1.6">Liebe/r ${r.name},</p>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.7">
      Ihre Sitzplatzreservierung für die <strong>${event.title}</strong> ist bestätigt.
      Freuen Sie sich auf einen Abend voller Live-Musik, griechischer Spezialitäten und
      ausgelassener Stimmung – open-air mitten in Ochtrup.
    </p>
    ${detailBox(
      [
        ["Datum", event.date],
        ["Beginn", event.time],
        ["Personen", String(r.guests)],
        ["Ort", event.location],
        ["Eintritt", event.admission],
      ],
      C.gold
    )}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px">
      <tr><td style="background:${C.bordeaux};border-radius:8px;padding:16px 20px;text-align:center">
        <div style="font-size:12px;letter-spacing:0.2em;color:${C.gold};text-transform:uppercase">Live auf der Bühne</div>
        <div style="font-size:18px;color:${C.cream};font-weight:bold;margin-top:4px">${event.band.name}</div>
        <div style="font-size:13px;color:${C.cream};opacity:0.85;margin-top:2px">${event.band.genre}</div>
      </td></tr>
    </table>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.7">
      Bei Rückfragen zur Veranstaltung erreichen Sie uns unter
      <a href="tel:${event.phone.replace(/\s/g, "")}" style="color:${C.bordeaux};font-weight:bold;text-decoration:none">${event.phone}</a>.
    </p>
    <p style="margin:22px 0 0;font-size:15px;line-height:1.7">
      Wir freuen uns auf Sie!<br>
      <strong>${event.presentedBy}</strong>
    </p>`;

  const html = shell({
    preheader: `Ihre Plätze für die ${event.title} am ${event.date} sind reserviert.`,
    headerBg: C.bordeauxDark,
    eyebrow: event.edition + " · " + event.title,
    heading: "Ihre Plätze sind reserviert",
    bodyHtml: body,
  });

  const text = `Liebe/r ${r.name},

Ihre Sitzplatzreservierung für die ${event.title} ist bestätigt:

Datum:    ${event.date}
Beginn:   ${event.time}
Personen: ${r.guests}
Ort:      ${event.location}
Eintritt: ${event.admission}

Live auf der Bühne: ${event.band.name} (${event.band.genre})

Rückfragen: ${event.phone}

Wir freuen uns auf Sie!
${event.presentedBy}`;

  return { subject: `Ihre Plätze für die ${event.title} – bestätigt`, html, text };
}

// ── 3) Allgemeine Antwort (Anfragen / Bewerbungen) ──────────────────────────
export function allgemeineAntwort(opts: {
  name: string;
  betreff: string;
  nachricht: string; // freier Antworttext des Restaurants (Zeilenumbrüche erlaubt)
}): RenderedEmail {
  const paragraphs = opts.nachricht
    .trim()
    .split(/\n{2,}/)
    .map(
      (p) =>
        `<p style="margin:0 0 12px;font-size:15px;line-height:1.7;color:${C.ink}">${p.replace(/\n/g, "<br>")}</p>`
    )
    .join("");

  const body = `
    <p style="margin:0 0 14px;font-size:16px;line-height:1.6">Liebe/r ${opts.name},</p>
    ${paragraphs}
    <p style="margin:22px 0 0;font-size:15px;line-height:1.7">
      Herzliche Grüße<br>
      <strong>Ihr Team vom ${restaurant.name}</strong>
    </p>`;

  const html = shell({
    preheader: opts.betreff,
    headerBg: C.bordeaux,
    eyebrow: "Ihre Nachricht an uns",
    heading: opts.betreff,
    bodyHtml: body,
  });

  const text = `Liebe/r ${opts.name},

${opts.nachricht.trim()}

Herzliche Grüße
Ihr Team vom ${restaurant.name}`;

  return { subject: `${opts.betreff} – ${restaurant.name}`, html, text };
}

// Beispiel-Antworttext für die allgemeine Vorlage (Vorschau / Startwert im Admin)
export const allgemeineAntwortBeispiel =
  `vielen Dank für Ihre Nachricht – wir haben Ihre Anfrage erhalten und melden uns schnellstmöglich persönlich bei Ihnen zurück.

Für dringende Anliegen erreichen Sie uns auch gerne telefonisch zu unseren Öffnungszeiten.`;
