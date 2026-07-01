import "server-only";
import type { Reservation } from "./types";
import type { ContactMessage } from "./messages";
import { restaurant } from "./restaurant";

const NOTIFY_TO = process.env.NOTIFY_EMAIL ?? "Hennes.huewe@icloud.com";
const FROM = process.env.NOTIFY_FROM ?? "Odysseus Website <onboarding@resend.dev>";
const GOOGLE_REVIEW_URL =
  process.env.GOOGLE_REVIEW_URL ??
  "https://g.page/r/PLACEHOLDER/review";

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
  const { subject, html, text } = format(r);
  await sendEmail({ to: NOTIFY_TO, subject, html, text, replyTo: r.email });
}

async function sendEmail(payload: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[E-Mail] (kein Key) → ${payload.subject}`);
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
        to: [payload.to],
        ...(payload.replyTo ? { reply_to: payload.replyTo } : {}),
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      }),
    });
    if (!res.ok) console.error("[Resend] Fehler:", await res.text());
  } catch (e) {
    console.error("[Resend] Ausnahme:", e);
  }
}

export async function confirmReservation(r: Reservation): Promise<void> {
  const isEvent = r.kind === "event";
  const kindLabel = isEvent ? "Deutsch-Griechischen Nacht" : "Tischreservierung";
  const dateFormatted = new Date(r.date + "T00:00:00").toLocaleDateString("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:auto;color:#1a0a0a">
      <div style="background:#7a2222;padding:24px 32px;border-radius:8px 8px 0 0">
        <h1 style="margin:0;font-size:22px;color:#f5ead8;letter-spacing:0.05em">RESTAURANT ODYSSEUS</h1>
        <p style="margin:4px 0 0;color:#d4a853;font-size:13px">Ochtrup</p>
      </div>
      <div style="background:#fff;padding:32px;border:1px solid #e8ddd0;border-top:none;border-radius:0 0 8px 8px">
        <p style="font-size:16px;margin-top:0">Liebe/r ${r.name},</p>
        <p>wir freuen uns, Ihre Reservierung für die <strong>${kindLabel}</strong> bestätigen zu dürfen.</p>
        <div style="background:#f7eee1;border-left:4px solid #7a2222;padding:16px 20px;margin:20px 0;border-radius:0 6px 6px 0">
          <p style="margin:0 0 6px"><strong>Datum:</strong> ${dateFormatted}</p>
          ${!isEvent ? `<p style="margin:0 0 6px"><strong>Uhrzeit:</strong> ${r.time} Uhr</p>` : ""}
          <p style="margin:0 0 6px"><strong>Personen:</strong> ${r.guests}</p>
          <p style="margin:0"><strong>Ort:</strong> ${restaurant.name}, ${restaurant.street}, ${restaurant.zip} ${restaurant.city}</p>
        </div>
        <p>Bei Fragen oder Änderungen erreichen Sie uns jederzeit:</p>
        <p>📞 <a href="tel:${restaurant.phoneHref}" style="color:#7a2222">${restaurant.phone}</a> &nbsp;|&nbsp; ✉️ <a href="mailto:${restaurant.email}" style="color:#7a2222">${restaurant.email}</a></p>
        <p style="margin-top:24px">Wir freuen uns auf Sie!</p>
        <p style="margin-bottom:0">Herzliche Grüße<br><strong>Ihr Team vom Restaurant Odysseus</strong></p>
      </div>
      <p style="color:#aaa;font-size:11px;text-align:center;margin-top:12px">
        ${restaurant.name} · ${restaurant.street} · ${restaurant.zip} ${restaurant.city}
      </p>
    </div>`;

  const text = `Liebe/r ${r.name},\n\nIhre Reservierung ist bestätigt:\n\nDatum: ${dateFormatted}\n${!isEvent ? `Uhrzeit: ${r.time} Uhr\n` : ""}Personen: ${r.guests}\n\nBei Fragen: ${restaurant.phone}\n\nHerzliche Grüße\nRestaurant Odysseus`;

  await sendEmail({
    to: r.email,
    subject: `Reservierungsbestätigung – ${restaurant.name}`,
    html,
    text,
  });
}

export async function sendReviewRequest(r: Reservation): Promise<void> {
  const dateFormatted = new Date(r.date + "T00:00:00").toLocaleDateString("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:auto;color:#1a0a0a">
      <div style="background:#7a2222;padding:24px 32px;border-radius:8px 8px 0 0">
        <h1 style="margin:0;font-size:22px;color:#f5ead8;letter-spacing:0.05em">RESTAURANT ODYSSEUS</h1>
        <p style="margin:4px 0 0;color:#d4a853;font-size:13px">Ochtrup</p>
      </div>
      <div style="background:#fff;padding:32px;border:1px solid #e8ddd0;border-top:none;border-radius:0 0 8px 8px">
        <p style="font-size:16px;margin-top:0">Liebe/r ${r.name},</p>
        <p>wir hoffen, dass Sie Ihren Abend bei uns am <strong>${dateFormatted}</strong> genossen haben und sich rundum wohl gefühlt haben.</p>
        <p>Ihr Feedback ist uns sehr wichtig – es hilft uns, uns stetig zu verbessern. Wenn Sie einen Moment Zeit haben, würden wir uns sehr über eine Bewertung bei Google freuen:</p>
        <div style="text-align:center;margin:28px 0">
          <a href="${GOOGLE_REVIEW_URL}" style="background:#7a2222;color:#f5ead8;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:15px;font-family:Arial,sans-serif;display:inline-block">
            ⭐ Jetzt auf Google bewerten
          </a>
        </div>
        <p style="font-size:13px;color:#888">Es dauert nur eine Minute und hilft anderen Gästen, uns zu finden.</p>
        <p>Wir würden uns freuen, Sie bald wieder bei uns begrüßen zu dürfen!</p>
        <p style="margin-bottom:0">Herzliche Grüße<br><strong>Ihr Team vom Restaurant Odysseus</strong></p>
      </div>
      <p style="color:#aaa;font-size:11px;text-align:center;margin-top:12px">
        ${restaurant.name} · ${restaurant.street} · ${restaurant.zip} ${restaurant.city}
      </p>
    </div>`;

  const text = `Liebe/r ${r.name},\n\nwir hoffen, dass Sie Ihren Abend bei uns am ${dateFormatted} genossen haben.\n\nWir würden uns sehr über eine Google-Bewertung freuen:\n${GOOGLE_REVIEW_URL}\n\nHerzliche Grüße\nRestaurant Odysseus`;

  await sendEmail({ to: r.email, subject: `Wie war Ihr Besuch? – ${restaurant.name}`, html, text });
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

  await sendEmail({ to: NOTIFY_TO, subject, html, text, replyTo: m.email });
}
