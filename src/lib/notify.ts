import "server-only";
import type { Reservation } from "./types";
import type { ContactMessage } from "./messages";
import { restaurant } from "./restaurant";

/*
  E-Mail-Benachrichtigung bei neuer Reservierung.
  Nutzt Resend (https://resend.com), falls RESEND_API_KEY gesetzt ist.
  Ohne Key wird die Reservierung nur geloggt (Demo-Betrieb).

  Empfänger: NOTIFY_EMAIL (Standard: vorerst die hinterlegte Adresse).
*/

const NOTIFY_TO = process.env.NOTIFY_EMAIL ?? "Hennes.huewe@icloud.com";
const FROM = process.env.NOTIFY_FROM ?? "Odysseus Website <onboarding@resend.dev>";

function format(r: Reservation): { subject: string; html: string; text: string } {
  const kind =
    r.kind === "event" ? "Deutsch-Griechische Nacht" : "Tischreservierung";
  const subject = `Neue ${kind}: ${r.name} (${r.guests} Pers., ${r.date})`;

  const rows: [string, string][] = [
    ["Art", kind],
    ["Name", r.name],
    ["Personen", String(r.guests)],
    ["Datum", r.date],
    ...(r.kind === "restaurant" ? ([["Uhrzeit", r.time]] as [string, string][]) : []),
    ["Telefon", r.phone],
    ["E-Mail", r.email],
    ["Nachricht", r.message || "—"],
    ["Eingegangen", new Date(r.createdAt).toLocaleString("de-DE")],
  ];

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
      <h2 style="color:#7a2222">Neue ${kind}</h2>
      <table style="border-collapse:collapse;width:100%">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:8px 12px;background:#f7eee1;font-weight:bold;width:140px">${k}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${v}</td></tr>`
          )
          .join("")}
      </table>
      <p style="color:#888;font-size:12px;margin-top:16px">
        Automatisch gesendet von der Website ${restaurant.name}.
      </p>
    </div>`;

  return { subject, html, text };
}

export async function notifyReservation(r: Reservation): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const { subject, html, text } = format(r);

  if (!apiKey) {
    console.log(
      `[Reservierung] (keine E-Mail konfiguriert) → ${subject}\n${text}`
    );
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [NOTIFY_TO],
        reply_to: r.email,
        subject,
        html,
        text,
      }),
    });
    if (!res.ok) {
      console.error("[Resend] Fehler:", await res.text());
    }
  } catch (e) {
    console.error("[Resend] Ausnahme:", e);
  }
}

export async function notifyMessage(m: ContactMessage): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const subject = `${m.subject}: ${m.name}`;
  const rows: [string, string][] = [
    ["Betreff", m.subject],
    ["Name", m.name],
    ["E-Mail", m.email],
    ["Telefon", m.phone || "—"],
    ["Nachricht", m.message],
    ["Eingegangen", new Date(m.createdAt).toLocaleString("de-DE")],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  if (!apiKey) {
    console.log(`[Nachricht] (keine E-Mail konfiguriert) → ${subject}\n${text}`);
    return;
  }

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
      <h2 style="color:#7a2222">${m.subject}</h2>
      <table style="border-collapse:collapse;width:100%">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:8px 12px;background:#f7eee1;font-weight:bold;width:140px">${k}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${v}</td></tr>`
          )
          .join("")}
      </table>
      <p style="color:#888;font-size:12px;margin-top:16px">
        Automatisch gesendet von der Website ${restaurant.name}.
      </p>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [NOTIFY_TO],
        reply_to: m.email,
        subject,
        html,
        text,
      }),
    });
    if (!res.ok) console.error("[Resend] Fehler:", await res.text());
  } catch (e) {
    console.error("[Resend] Ausnahme:", e);
  }
}
