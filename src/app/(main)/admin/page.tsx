"use client";

import { useCallback, useEffect, useState } from "react";
import type { Reservation } from "@/lib/types";
import type { ContactMessage } from "@/lib/messages";

const STORAGE_KEY = "odysseus-admin-token";

type Tab = "tisch" | "event" | "nachrichten" | "archiv";

const todayISO = () => new Date().toISOString().split("T")[0];

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

const statusDot: Record<Reservation["status"], string> = {
  neu: "bg-amber-500",
  bestaetigt: "bg-green-600",
  abgesagt: "bg-red-500",
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

function formatDateShort(iso: string) {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("de-DE", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  } catch {
    return iso;
  }
}

function isApplication(subject: string) {
  return subject.toLowerCase().includes("bewerbung");
}

// Öffnet das E-Mail-Programm mit vorformulierter, gebrandeter Antwort.
// Der Text ist frei editierbar, bevor er aus dem eigenen Postfach versendet wird.
function vorlageMailto(m: ContactMessage) {
  const dank = isApplication(m.subject)
    ? "vielen Dank für Ihre Bewerbung – wir haben Ihre Unterlagen erhalten."
    : "vielen Dank für Ihre Nachricht.";
  const body = `Liebe/r ${m.name},

${dank}

[Hier Ihre persönliche Antwort …]

Herzliche Grüße
Ihr Team vom Restaurant Odysseus
Kniepenkamp 1 · 48607 Ochtrup
Tel. 02553 1204 · info@odysseus-ochtrup.de`;
  return `mailto:${m.email}?subject=${encodeURIComponent("Re: " + m.subject)}&body=${encodeURIComponent(body)}`;
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

  // Aufgeklappte Listeneinträge (kompakte Liste + Detail)
  const [expandedRes, setExpandedRes] = useState<string | null>(null);
  const [expandedMsg, setExpandedMsg] = useState<string | null>(null);

  // Antwort-Editor (gebrandete Mail über Resend)
  const [composeFor, setComposeFor] = useState<string | null>(null);
  const [composeText, setComposeText] = useState("");
  const [composeSending, setComposeSending] = useState(false);
  const [composeError, setComposeError] = useState("");
  const [composeSent, setComposeSent] = useState<Record<string, boolean>>({});

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

  function openCompose(m: ContactMessage) {
    const dank = isApplication(m.subject)
      ? "vielen Dank für Ihre Bewerbung – wir haben Ihre Unterlagen erhalten."
      : "vielen Dank für Ihre Nachricht.";
    setComposeFor(m.id);
    setComposeError("");
    setComposeText(`${dank}\n\n`);
  }

  async function sendReply(m: ContactMessage) {
    if (!composeText.trim()) {
      setComposeError("Bitte eine Nachricht eingeben.");
      return;
    }
    setComposeSending(true);
    setComposeError("");
    try {
      const res = await fetch("/api/admin/antwort", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({
          to: m.email,
          name: m.name,
          betreff: m.subject,
          nachricht: composeText,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setComposeError(data.error || "Versand fehlgeschlagen.");
        return;
      }
      setComposeSent((prev) => ({ ...prev, [m.id]: true }));
      setComposeFor(null);
      setComposeText("");
    } catch {
      setComposeError("Verbindungsfehler.");
    } finally {
      setComposeSending(false);
    }
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
  const today = todayISO();
  const allTischRes = reservations.filter((r) => r.kind !== "event");
  const allEventRes = reservations.filter((r) => r.kind === "event");

  // Aktiv = heute oder zukünftig; Archiv = vergangen
  const tischRes = allTischRes.filter((r) => r.date >= today);
  const eventRes = allEventRes.filter((r) => r.date >= today);
  const archivRes = reservations.filter((r) => r.date < today);

  const tischNeu = tischRes.filter((r) => r.status === "neu").length;
  const eventNeu = eventRes.filter((r) => r.status === "neu").length;
  const msgNeu = messages.length;

  const activeRes = tab === "tisch" ? tischRes : tab === "event" ? eventRes : archivRes;
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

        {/* Tabs – mobil 2 Spalten, ab sm eine Reihe */}
        <div className="mt-8 grid grid-cols-2 gap-1 rounded-2xl bg-bordeaux/5 p-1 sm:grid-cols-4">
          {(
            [
              { key: "tisch", label: "Tische", badge: tischNeu },
              { key: "event", label: "Event", badge: eventNeu },
              { key: "nachrichten", label: "Nachrichten", badge: msgNeu },
              { key: "archiv", label: "Archiv", badge: 0 },
            ] as { key: Tab; label: string; badge: number }[]
          ).map(({ key, label, badge }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setStatusFilter("alle"); }}
              className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-sm font-medium transition-all ${
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

        {/* ── Reservierungen-Tab (Tisch + Event + Archiv) ── */}
        {(tab === "tisch" || tab === "event" || tab === "archiv") && (
          <div className="mt-6">
            {tab === "event" && (
              <div className="mb-5 rounded-xl border border-gold/30 bg-gold/10 px-5 py-3 text-sm text-bordeaux">
                <strong>Event:</strong> Deutsch-Griechische Nacht · Samstag, 22. August 2026
              </div>
            )}
            {tab === "archiv" && (
              <div className="mb-5 rounded-xl border border-ink/10 bg-ink/5 px-5 py-3 text-sm text-ink-soft">
                Vergangene Reservierungen (alle Arten) · schreibgeschützt
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

            <div className="mt-5 space-y-2">
              {filteredRes.length === 0 && (
                <div className="rounded-2xl border border-bordeaux/10 bg-cream p-10 text-center text-ink-soft">
                  Keine Einträge in dieser Ansicht.
                </div>
              )}
              {filteredRes.map((r) => {
                const open = expandedRes === r.id;
                return (
                  <div
                    key={r.id}
                    className="overflow-hidden rounded-xl border border-bordeaux/10 bg-cream shadow-soft"
                  >
                    {/* Kompakte Zeile */}
                    <button
                      onClick={() => setExpandedRes(open ? null : r.id)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left"
                    >
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusDot[r.status]}`} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-ink">{r.name}</span>
                        <span className="block text-xs text-ink-soft">
                          {formatDateShort(r.date)}
                          {r.time ? ` · ${r.time}` : ""} · {r.guests} Pers.
                        </span>
                      </span>
                      <span
                        className={`hidden shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium sm:inline ${statusStyles[r.status]}`}
                      >
                        {statusLabels[r.status]}
                      </span>
                      <svg
                        viewBox="0 0 20 20"
                        className={`h-4 w-4 shrink-0 text-bordeaux transition-transform ${open ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    {/* Detailbereich */}
                    {open && (
                      <div className="border-t border-bordeaux/10 px-4 py-3">
                        <div className="flex flex-col gap-0.5 text-sm">
                          <a href={`tel:${r.phone}`} className="font-medium text-bordeaux hover:underline">
                            {r.phone}
                          </a>
                          <a href={`mailto:${r.email}`} className="break-all text-ink-soft hover:underline">
                            {r.email}
                          </a>
                          <span className="text-xs text-ink-soft/70">
                            {formatDate(r.date)}
                            {r.time ? `, ${r.time} Uhr` : ""} · {r.guests}{" "}
                            {r.guests === 1 ? "Person" : "Personen"}
                          </span>
                        </div>

                        {r.message && (
                          <p className="mt-2 rounded-lg bg-bordeaux/5 p-3 text-sm text-ink-soft">
                            „{r.message}"
                          </p>
                        )}

                        {tab !== "archiv" && (
                          <div className="mt-3 flex flex-wrap gap-2">
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
                          </div>
                        )}
                        <p className="mt-2 text-xs text-ink-soft/60">
                          Eingegangen: {formatDateTime(r.createdAt)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
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
            {messages.map((m) => {
              const open = expandedMsg === m.id;
              const bewerbung = isApplication(m.subject);
              return (
                <div
                  key={m.id}
                  className="overflow-hidden rounded-xl border border-bordeaux/10 bg-cream shadow-soft"
                >
                  {/* Kompakte Zeile */}
                  <button
                    onClick={() => setExpandedMsg(open ? null : m.id)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate font-semibold text-ink">{m.name}</span>
                        {composeSent[m.id] && (
                          <span className="shrink-0 text-xs font-semibold text-green-700">✓</span>
                        )}
                      </span>
                      <span className="block truncate text-xs text-ink-soft">{m.subject}</span>
                    </span>
                    <span
                      className={`hidden shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium sm:inline ${
                        bewerbung ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {bewerbung ? "Bewerbung" : "Anfrage"}
                    </span>
                    <svg
                      viewBox="0 0 20 20"
                      className={`h-4 w-4 shrink-0 text-bordeaux transition-transform ${open ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Detailbereich */}
                  {open && (
                    <div className="border-t border-bordeaux/10 px-4 py-3">
                      <div className="flex flex-col gap-0.5 text-sm">
                        {m.phone && (
                          <a href={`tel:${m.phone}`} className="font-medium text-bordeaux hover:underline">
                            {m.phone}
                          </a>
                        )}
                        <a href={`mailto:${m.email}`} className="break-all text-ink-soft hover:underline">
                          {m.email}
                        </a>
                      </div>

                      <p className="mt-2 rounded-lg bg-bordeaux/5 p-3 text-sm leading-relaxed text-ink-soft">
                        {m.message}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => (composeFor === m.id ? setComposeFor(null) : openCompose(m))}
                          className="rounded-full bg-bordeaux px-4 py-1.5 text-xs font-semibold text-cream hover:bg-bordeaux-dark"
                        >
                          Mit Vorlage antworten
                        </button>
                        <a
                          href={vorlageMailto(m)}
                          className="rounded-full border border-bordeaux/30 px-4 py-1.5 text-xs font-semibold text-bordeaux hover:bg-bordeaux/10"
                        >
                          Im eigenen Mailprogramm
                        </a>
                        {composeSent[m.id] && (
                          <span className="text-xs font-semibold text-green-700">✓ Gesendet</span>
                        )}
                      </div>

                      {composeFor === m.id && (
                        <div className="mt-3 rounded-xl border border-bordeaux/20 bg-white p-4">
                          <p className="mb-2 text-xs text-ink-soft">
                            Diese Nachricht wird als <strong>gestaltete Mail im Odysseus-Design</strong> an{" "}
                            <strong>{m.email}</strong> versendet (Anrede, Logo und Fußzeile kommen automatisch).
                          </p>
                          <textarea
                            value={composeText}
                            onChange={(e) => setComposeText(e.target.value)}
                            rows={6}
                            autoFocus
                            className="w-full rounded-lg border border-bordeaux/20 bg-paper px-3 py-2 text-sm outline-none focus:border-bordeaux focus:ring-1 focus:ring-bordeaux/30"
                            placeholder="Ihre persönliche Antwort …"
                          />
                          {composeError && (
                            <p className="mt-2 text-xs text-red-600">{composeError}</p>
                          )}
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              onClick={() => sendReply(m)}
                              disabled={composeSending}
                              className="rounded-full bg-bordeaux px-5 py-1.5 text-xs font-semibold text-cream hover:bg-bordeaux-dark disabled:opacity-60"
                            >
                              {composeSending ? "Senden …" : "Gestaltete Mail senden"}
                            </button>
                            <button
                              onClick={() => { setComposeFor(null); setComposeError(""); }}
                              className="rounded-full border border-bordeaux/30 px-5 py-1.5 text-xs font-semibold text-ink-soft hover:bg-bordeaux/5"
                            >
                              Abbrechen
                            </button>
                          </div>
                        </div>
                      )}

                      <p className="mt-2 text-xs text-ink-soft/60">
                        Eingegangen: {formatDateTime(m.createdAt)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
