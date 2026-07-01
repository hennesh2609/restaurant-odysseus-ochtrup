"use client";

import { useCallback, useEffect, useState } from "react";
import type { Reservation } from "@/lib/types";
import type { ContactMessage } from "@/lib/messages";

const STORAGE_KEY = "odysseus-admin-token";

type Tab = "tisch" | "event" | "nachrichten";

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

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function isApplication(subject: string) {
  return subject.toLowerCase().includes("bewerbung");
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("tisch");
  const [statusFilter, setStatusFilter] = useState<"alle" | Reservation["status"]>("alle");

  const load = useCallback(async (t: string) => {
    setLoading(true);
    setError("");
    try {
      const [resRes, msgRes] = await Promise.all([
        fetch("/api/admin/reservierungen", { headers: { "x-admin-token": t } }),
        fetch("/api/admin/nachrichten", { headers: { "x-admin-token": t } }),
      ]);
      if (resRes.status === 401) {
        setError("Falsches Passwort.");
        setAuthed(false);
        sessionStorage.removeItem(STORAGE_KEY);
        return;
      }
      const resData = await resRes.json();
      const msgData = await msgRes.json();
      if (!resData.ok) { setError(resData.error || "Fehler."); return; }
      setReservations(resData.reservations);
      if (msgData.ok) setMessages(msgData.messages);
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
    if (saved) { setToken(saved); load(saved); }
  }, [load]);

  async function setStatus(id: string, status: Reservation["status"]) {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    await fetch("/api/admin/reservierungen", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ id, status }),
    });
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
    setToken("");
    setReservations([]);
    setMessages([]);
  }

  // ── Login ──────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <section className="bg-paper">
        <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
          <p className="font-display text-sm tracking-[0.3em] text-bordeaux">ODYSSEUS OCHTRUP</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-ink">Admin-Bereich</h1>
          <p className="mt-2 text-ink-soft">Reservierungen, Nachrichten und Einstellungen.</p>
          <form
            onSubmit={(e) => { e.preventDefault(); load(token); }}
            className="mt-8 space-y-4"
          >
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Passwort"
              autoFocus
              className="w-full rounded-xl border border-bordeaux/20 bg-white px-4 py-3 outline-none focus:border-bordeaux focus:ring-1 focus:ring-bordeaux/30"
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

  // ── Daten für Tabs ─────────────────────────────────────────────────────────
  const tischRes = reservations.filter((r) => r.kind !== "event");
  const eventRes = reservations.filter((r) => r.kind === "event");

  const tischNeu = tischRes.filter((r) => r.status === "neu").length;
  const eventNeu = eventRes.filter((r) => r.status === "neu").length;
  const msgNeu = messages.length;

  const activeRes = tab === "tisch" ? tischRes : eventRes;
  const filteredRes = activeRes.filter(
    (r) => statusFilter === "alle" || r.status === statusFilter
  );
  const counts = {
    alle: activeRes.length,
    neu: activeRes.filter((r) => r.status === "neu").length,
    bestaetigt: activeRes.filter((r) => r.status === "bestaetigt").length,
    abgesagt: activeRes.filter((r) => r.status === "abgesagt").length,
  };

  // ── Layout ─────────────────────────────────────────────────────────────────
  return (
    <section className="min-h-screen bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-xs tracking-[0.3em] text-bordeaux">ODYSSEUS OCHTRUP</p>
            <h1 className="mt-1 font-serif text-3xl font-semibold text-ink">Admin-Bereich</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => load(token)}
              disabled={loading}
              className="rounded-full border border-bordeaux/30 px-5 py-2 text-sm font-medium text-bordeaux hover:bg-bordeaux/5 disabled:opacity-50"
            >
              {loading ? "Lädt …" : "Aktualisieren"}
            </button>
            <button
              onClick={logout}
              className="rounded-full border border-bordeaux/30 px-5 py-2 text-sm font-medium text-ink-soft hover:bg-bordeaux/5"
            >
              Abmelden
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-1 rounded-2xl bg-bordeaux/5 p-1">
          {(
            [
              { key: "tisch", label: "Tischreservierungen", badge: tischNeu },
              { key: "event", label: "Griechische Nacht", badge: eventNeu },
              { key: "nachrichten", label: "Nachrichten", badge: msgNeu },
            ] as { key: Tab; label: string; badge: number }[]
          ).map(({ key, label, badge }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setStatusFilter("alle"); }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                tab === key
                  ? "bg-white shadow-soft text-bordeaux"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              {label}
              {badge > 0 && (
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  tab === key ? "bg-bordeaux text-cream" : "bg-bordeaux/15 text-bordeaux"
                }`}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Reservierungen-Tab (Tisch + Event) ── */}
        {(tab === "tisch" || tab === "event") && (
          <div className="mt-6">
            {tab === "event" && (
              <div className="mb-5 rounded-xl border border-gold/30 bg-gold/10 px-5 py-3 text-sm text-bordeaux">
                <strong>Event:</strong> Deutsch-Griechische Nacht · Samstag, 22. August 2026
              </div>
            )}

            {/* Status-Filter */}
            <div className="flex flex-wrap gap-2">
              {(["alle", "neu", "bestaetigt", "abgesagt"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    statusFilter === f
                      ? "bg-bordeaux text-cream"
                      : "bg-bordeaux/10 text-bordeaux hover:bg-bordeaux/20"
                  }`}
                >
                  {f === "alle" ? "Alle" : statusLabels[f]} ({counts[f]})
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-4">
              {filteredRes.length === 0 && (
                <div className="rounded-2xl border border-bordeaux/10 bg-cream p-10 text-center text-ink-soft">
                  Keine Einträge in dieser Ansicht.
                </div>
              )}
              {filteredRes.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-bordeaux/10 bg-cream p-5 shadow-soft"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-ink">{r.name}</h3>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[r.status]}`}>
                          {statusLabels[r.status]}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-ink-soft">
                        {formatDate(r.date)}
                        {r.time ? `, ${r.time} Uhr` : ""} · {r.guests}{" "}
                        {r.guests === 1 ? "Person" : "Personen"}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <a href={`tel:${r.phone}`} className="block font-medium text-bordeaux hover:underline">
                        {r.phone}
                      </a>
                      <a href={`mailto:${r.email}`} className="block text-ink-soft hover:underline">
                        {r.email}
                      </a>
                    </div>
                  </div>

                  {r.message && (
                    <p className="mt-3 rounded-lg bg-bordeaux/5 p-3 text-sm text-ink-soft">
                      „{r.message}"
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-2">
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
                      className="rounded-full border border-bordeaux/30 px-4 py-1.5 text-xs font-semibold text-bordeaux hover:bg-bordeaux/10 disabled:opacity-40"
                    >
                      Als neu markieren
                    </button>
                    <span className="ml-auto text-xs text-ink-soft/60">
                      Eingegangen: {formatDateTime(r.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Nachrichten-Tab ── */}
        {tab === "nachrichten" && (
          <div className="mt-6 space-y-4">
            {messages.length === 0 && (
              <div className="rounded-2xl border border-bordeaux/10 bg-cream p-10 text-center text-ink-soft">
                Noch keine Nachrichten eingegangen.
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className="rounded-2xl border border-bordeaux/10 bg-cream p-5 shadow-soft"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-ink">{m.name}</h3>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        isApplication(m.subject)
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {isApplication(m.subject) ? "Bewerbung" : "Anfrage"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm font-medium text-ink-soft">{m.subject}</p>
                  </div>
                  <div className="text-right text-sm">
                    {m.phone && (
                      <a href={`tel:${m.phone}`} className="block font-medium text-bordeaux hover:underline">
                        {m.phone}
                      </a>
                    )}
                    <a href={`mailto:${m.email}`} className="block text-ink-soft hover:underline">
                      {m.email}
                    </a>
                  </div>
                </div>

                <p className="mt-3 rounded-lg bg-bordeaux/5 p-3 text-sm leading-relaxed text-ink-soft">
                  {m.message}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                    className="rounded-full bg-bordeaux px-4 py-1.5 text-xs font-semibold text-cream hover:bg-bordeaux-dark"
                  >
                    Antworten
                  </a>
                  <span className="ml-auto text-xs text-ink-soft/60">
                    Eingegangen: {formatDateTime(m.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
