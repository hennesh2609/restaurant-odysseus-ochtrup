import type { ReservationInput } from "./types";
import type { ContactInput } from "./messages";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SUBJECTS = [
  "Allgemeine Anfrage",
  "Bewerbung als Aushilfe",
  "Frage zur Reservierung",
  "Feedback",
];

export function validateMessage(
  body: unknown
): { ok: true; data: ContactInput } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Ungültige Anfrage." };
  }
  const b = body as Record<string, unknown>;
  const subject = String(b.subject ?? "").trim();
  const name = String(b.name ?? "").trim();
  const email = String(b.email ?? "").trim();
  const phone = String(b.phone ?? "").trim();
  const message = String(b.message ?? "").trim();

  if (!SUBJECTS.includes(subject))
    return { ok: false, error: "Bitte wählen Sie einen Betreff." };
  if (name.length < 2)
    return { ok: false, error: "Bitte geben Sie Ihren Namen an." };
  if (!EMAIL_RE.test(email))
    return { ok: false, error: "Bitte geben Sie eine gültige E-Mail-Adresse an." };
  if (message.length < 5)
    return { ok: false, error: "Bitte schreiben Sie uns eine kurze Nachricht." };

  return {
    ok: true,
    data: { subject, name, email, phone: phone || undefined, message },
  };
}

export function validateReservation(
  body: unknown
): { ok: true; data: ReservationInput } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Ungültige Anfrage." };
  }
  const b = body as Record<string, unknown>;

  const kind = b.kind === "event" ? "event" : "restaurant";
  const name = String(b.name ?? "").trim();
  const email = String(b.email ?? "").trim();
  const phone = String(b.phone ?? "").trim();
  const date = String(b.date ?? "").trim();
  const time = String(b.time ?? "").trim();
  const guests = Number(b.guests);
  const message = String(b.message ?? "").trim();

  if (name.length < 2) return { ok: false, error: "Bitte geben Sie Ihren Namen an." };
  if (!EMAIL_RE.test(email))
    return { ok: false, error: "Bitte geben Sie eine gültige E-Mail-Adresse an." };
  if (phone.length < 5)
    return { ok: false, error: "Bitte geben Sie eine Telefonnummer an." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
    return { ok: false, error: "Bitte wählen Sie ein gültiges Datum." };
  if (!Number.isFinite(guests) || guests < 1 || guests > 50)
    return { ok: false, error: "Bitte geben Sie die Anzahl der Personen an (1–50)." };
  if (kind === "restaurant" && !/^\d{2}:\d{2}$/.test(time))
    return { ok: false, error: "Bitte wählen Sie eine Uhrzeit." };

  // Datum darf nicht in der Vergangenheit liegen
  const chosen = new Date(date + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (chosen < today)
    return { ok: false, error: "Das Datum darf nicht in der Vergangenheit liegen." };

  return {
    ok: true,
    data: {
      kind,
      name,
      email,
      phone,
      date,
      time: kind === "event" ? "" : time,
      guests,
      message: message || undefined,
    },
  };
}
