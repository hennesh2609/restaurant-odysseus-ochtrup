"use client";

import { useCallback, useEffect, useState } from "react";
import type { Reservation } from "@/lib/types";

const STORAGE_KEY = "odysseus-admin-token";

const statusLabels: Record<Reservation["status"], string> = {
  neu: "Neu",
  bestaetigt: "Bestätigt",
  abgesagt: "Abgesagt",
};

const statusStyles: Record<Reservation["status"], string> = {
  neu: "bg-amber-100 text-amber-800",
  bestaetigt: "bg-green-100 text-green-800",
  abgesagt: "bg-red-100 text-red-700",
};

function formatDate(iso: string) {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("de-DE", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [rows, setRows] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"alle" | Reservation["status"]>("alle");

  const load = useCallback(async (t: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/reservierungen", {
        headers: { "x-admin-token": t },
      });
      if (res.status === 401) {
        setError("Falsches Passwort.");
        setAuthed(false);
        sessionStorage.removeItem(STORAGE_KEY);
        return;
      }
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Fehler.");
        return;
      }
      setRows(data.reservations);
      setAuthed(true);
      sessionStorage.setItem(STORAGE_KEY, t);
    } catch {
      setError("Verbindungsfehler.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      setToken(saved);
      load(saved);
    }
  }, [load]);

  async function setStatus(id: string, status: Reservation["status"]) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    await fetch("/api/admin/reservierungen", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ id, status }),
    });
  }

  if (!authed) {
    return (
      <section className="bg-paper">
        <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
          <h1 className="font-serif text-3xl font-semibold text-ink">
            Admin-Bereich
          </h1>
          <p className="mt-2 text-ink-soft">
            Reservierungs-Übersicht für das Restaurant.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              load(token);
            }}
            className="mt-6 space-y-4"
          >
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Passwort"
              className="w-full rounded-lg border border-bordeaux/20 bg-white/60 px-4 py-3 outline-none focus:border-bordeaux"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-bordeaux px-6 py-3 font-semibold text-cream hover:bg-bordeaux-dark disabled:opacity-60"
            >
              {loading ? "Anmelden …" : "Anmelden"}
            </button>
          </form>
        </div>
      </section>
    );
  }

  const filtered = rows.filter((r) => filter === "alle" || r.status === filter);
  const counts = {
    alle: rows.length,
    neu: rows.filter((r) => r.status === "neu").length,
    bestaetigt: rows.filter((r) => r.status === "bestaetigt").length,
    abgesagt: rows.filter((r) => r.status === "abgesagt").length,
  };

  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-ink">
              Reservierungen
            </h1>
            <p className="text-ink-soft">{rows.length} Einträge gesamt</p>
          </div>
          <button
            onClick={() => load(token)}
            className="rounded-full border border-bordeaux/30 px-5 py-2 text-sm font-medium text-bordeaux hover:bg-bordeaux/5"
          >
            Aktualisieren
          </button>
        </div>

        {/* Filter */}
        <div className="mt-6 flex flex-wrap gap-2">
          {(["alle", "neu", "bestaetigt", "abgesagt"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-bordeaux text-cream"
                  : "bg-bordeaux/10 text-bordeaux hover:bg-bordeaux/20"
              }`}
            >
              {f === "alle" ? "Alle" : statusLabels[f]} ({counts[f]})
            </button>
          ))}
        </div>

        {/* Liste */}
        <div className="mt-8 space-y-4">
          {filtered.length === 0 && (
            <p className="rounded-xl bg-white/60 p-8 text-center text-ink-soft">
              Keine Reservierungen in dieser Ansicht.
            </p>
          )}
          {filtered.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-bordeaux/10 bg-cream p-5 shadow-soft"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-ink">{r.name}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[r.status]}`}
                    >
                      {statusLabels[r.status]}
                    </span>
                    {r.kind === "event" && (
                      <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-medium text-bordeaux">
                        Griechische Nacht
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-ink-soft">
                    {formatDate(r.date)}
                    {r.time ? `, ${r.time} Uhr` : ""} · {r.guests}{" "}
                    {r.guests === 1 ? "Person" : "Personen"}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <a
                    href={`tel:${r.phone}`}
                    className="block font-medium text-bordeaux hover:underline"
                  >
                    {r.phone}
                  </a>
                  <a
                    href={`mailto:${r.email}`}
                    className="block text-ink-soft hover:underline"
                  >
                    {r.email}
                  </a>
                </div>
              </div>

              {r.message && (
                <p className="mt-3 rounded-lg bg-bordeaux/5 p-3 text-sm text-ink-soft">
                  „{r.message}“
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setStatus(r.id, "bestaetigt")}
                  disabled={r.status === "bestaetigt"}
                  className="rounded-full bg-green-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-40"
                >
                  Bestätigen
                </button>
                <button
                  onClick={() => setStatus(r.id, "abgesagt")}
                  disabled={r.status === "abgesagt"}
                  className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-40"
                >
                  Absagen
                </button>
                <button
                  onClick={() => setStatus(r.id, "neu")}
                  disabled={r.status === "neu"}
                  className="rounded-full bg-bordeaux/10 px-4 py-1.5 text-xs font-semibold text-bordeaux hover:bg-bordeaux/20 disabled:opacity-40"
                >
                  Als neu markieren
                </button>
                <span className="ml-auto self-center text-xs text-ink-soft/60">
                  Eingegangen:{" "}
                  {new Date(r.createdAt).toLocaleString("de-DE")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
