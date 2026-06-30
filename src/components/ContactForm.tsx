"use client";

import { useState } from "react";

const SUBJECTS = [
  "Allgemeine Anfrage",
  "Bewerbung als Aushilfe",
  "Frage zur Reservierung",
  "Feedback",
];

export function ContactForm({
  defaultSubject = "Allgemeine Anfrage",
}: {
  defaultSubject?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      subject: fd.get("subject"),
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      message: fd.get("message"),
    };

    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Es ist ein Fehler aufgetreten.");
        setStatus("error");
        return;
      }
      setStatus("ok");
    } catch {
      setError("Verbindungsfehler. Bitte versuchen Sie es erneut.");
      setStatus("error");
    }
  }

  const labelCls = "mb-1.5 block text-sm font-medium text-ink-soft";
  const inputCls =
    "w-full rounded-lg border border-bordeaux/20 bg-white/60 px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder-ink-soft/40 focus:border-bordeaux";

  if (status === "ok") {
    return (
      <div className="rounded-2xl border border-bordeaux/20 bg-white/70 p-8 text-center text-ink">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 text-3xl">
          ✓
        </div>
        <h3 className="font-display text-xl tracking-wide text-bordeaux">
          Vielen Dank!
        </h3>
        <p className="mt-2 text-sm text-ink-soft">
          Ihre Nachricht ist bei uns eingegangen. Wir melden uns
          schnellstmöglich bei Ihnen.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="subject" className={labelCls}>
          Betreff *
        </label>
        <select
          id="subject"
          name="subject"
          defaultValue={defaultSubject}
          required
          className={inputCls}
        >
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>
            Name *
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            className={inputCls}
            placeholder="Ihr Name"
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelCls}>
            Telefon
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={inputCls}
            placeholder="optional"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelCls}>
          E-Mail *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputCls}
          placeholder="name@beispiel.de"
        />
      </div>

      <div>
        <label htmlFor="message" className={labelCls}>
          Nachricht *
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={inputCls}
          placeholder="Worum geht es? Bei einer Bewerbung gerne kurz etwas zu Ihnen, Ihrer Verfügbarkeit und Erfahrung."
        />
      </div>

      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-bordeaux px-6 py-3.5 text-sm font-semibold text-cream shadow-soft transition-all hover:bg-bordeaux-dark hover:shadow-card disabled:opacity-60"
      >
        {status === "sending" ? "Wird gesendet …" : "Nachricht senden"}
      </button>

      <p className="text-center text-xs text-ink-soft/60">
        Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten zur Bearbeitung
        Ihrer Anfrage zu.
      </p>
    </form>
  );
}
