"use client";

import { useState } from "react";
import type { ReservationKind } from "@/lib/types";

const TIME_SLOTS = [
  "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30",
];

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export function ReservationForm({
  kind = "restaurant",
  fixedDate,
  accent = "bordeaux",
}: {
  kind?: ReservationKind;
  fixedDate?: string; // bei Events ein festes Datum
  accent?: "bordeaux" | "cream";
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
      kind,
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      date: fixedDate ?? fd.get("date"),
      time: kind === "event" ? "" : fd.get("time"),
      guests: Number(fd.get("guests")),
      message: fd.get("message"),
    };

    try {
      const res = await fetch("/api/reservierung", {
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

  const onCream = accent === "cream";
  const labelCls = `mb-1.5 block text-sm font-medium ${
    onCream ? "text-cream-dark" : "text-ink-soft"
  }`;
  const inputCls = `w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors ${
    onCream
      ? "border-cream-dark/30 bg-bordeaux-dark/40 text-cream placeholder-cream-dark/40 focus:border-gold-light"
      : "border-bordeaux/20 bg-white/60 text-ink placeholder-ink-soft/40 focus:border-bordeaux"
  }`;

  if (status === "ok") {
    return (
      <div
        className={`rounded-2xl border p-8 text-center ${
          onCream
            ? "border-gold-light/40 bg-bordeaux-dark/40 text-cream"
            : "border-bordeaux/20 bg-white/70 text-ink"
        }`}
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 text-3xl">
          ✓
        </div>
        <h3 className="font-display text-xl tracking-wide text-gold">
          Vielen Dank!
        </h3>
        <p className="mt-2 text-sm opacity-90">
          Ihre Reservierungsanfrage ist bei uns eingegangen. Wir bestätigen
          Ihnen Ihren Tisch in Kürze telefonisch oder per E-Mail.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
          <label htmlFor="guests" className={labelCls}>
            Personen *
          </label>
          <input
            id="guests"
            name="guests"
            type="number"
            min={1}
            max={50}
            defaultValue={2}
            required
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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
          <label htmlFor="phone" className={labelCls}>
            Telefon *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className={inputCls}
            placeholder="0151 23456789"
          />
        </div>
      </div>

      {kind === "restaurant" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="date" className={labelCls}>
              Datum *
            </label>
            <input
              id="date"
              name="date"
              type="date"
              required
              min={todayISO()}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="time" className={labelCls}>
              Uhrzeit *
            </label>
            <select id="time" name="time" required className={inputCls}>
              <option value="">Bitte wählen</option>
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>
                  {t} Uhr
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            onCream
              ? "border-gold-light/30 bg-bordeaux-dark/30 text-cream-dark"
              : "border-bordeaux/15 bg-bordeaux/5 text-ink-soft"
          }`}
        >
          Reservierung für die <strong>Deutsch-Griechische Nacht</strong>
          {fixedDate ? <> am {formatDate(fixedDate)}</> : null}.
        </div>
      )}

      <div>
        <label htmlFor="message" className={labelCls}>
          Nachricht (optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          className={inputCls}
          placeholder="Anlass, Allergien, Sitzwünsche …"
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
        className={`w-full rounded-full px-6 py-3.5 text-sm font-semibold shadow-soft transition-all disabled:opacity-60 ${
          onCream
            ? "bg-gold text-bordeaux-dark hover:bg-gold-light"
            : "bg-bordeaux text-cream hover:bg-bordeaux-dark hover:shadow-card"
        }`}
      >
        {status === "sending" ? "Wird gesendet …" : "Reservierung absenden"}
      </button>

      <p
        className={`text-center text-xs ${
          onCream ? "text-cream-dark/60" : "text-ink-soft/60"
        }`}
      >
        Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten zur Bearbeitung
        der Reservierung zu.
      </p>
    </form>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("de-DE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
