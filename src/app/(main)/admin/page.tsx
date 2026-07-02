"use client";

import { useCallback, useEffect, useState } from "react";
import type { Reservation } from "@/lib/types";
import type { ContactMessage } from "@/lib/messages";

const STORAGE_KEY = "odysseus-admin-token";

type View = "reservierungen" | "nachrichten" | "archiv";
type Zeit = "alle" | "heute" | "morgen" | "woche";
type StatusFilter = "alle" | Reservation["status"];
type MsgFilter = "alle" | "anfrage" | "bewerbung";

// ── Datums-Helfer (lokale Zeitzone) ─────────────────────────────────────────
const localISO = (d = new Date()) => {
  const t = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return t.toISOString().split("T")[0];
};
const addDaysISO = (iso: string, n: number) => {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return localISO(d);
};

const statusLabels: Record<Reservation["status"], string> = {
  neu: "Neu",
  bestaetigt: "Bestätigt",
  abgesagt: "Abgesagt",
};
const statusPill: Record<Reservation["status"], string> = {
  neu: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  bestaetigt: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  abgesagt: "bg-rose-50 text-rose-600 ring-1 ring-rose-200",
};
const statusDot: Record<Reservation["status"], string> = {
  neu: "bg-amber-500",
  bestaetigt: "bg-emerald-500",
  abgesagt: "bg-rose-400",
};

function fmtLong(iso: string) {
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
function fmtDateTime(iso: string) {
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
function weekday(iso: string, opt: "short" | "long" = "short") {
  return new Date(iso + "T00:00:00").toLocaleDateString("de-DE", { weekday: opt });
}
function dayMonth(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
  });
}
function groupLabel(iso: string, today: string, tomorrow: string) {
  const base = `${weekday(iso)}, ${dayMonth(iso)}`;
  if (iso === today) return `Heute · ${base}`;
  if (iso === tomorrow) return `Morgen · ${base}`;
  return base;
}

function isApplication(subject: string) {
  return subject.toLowerCase().includes("bewerbung");
}

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

  const [view, setView] = useState<View>("reservierungen");
  const [zeit, setZeit] = useState<Zeit>("alle");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("alle");
  const [nurEvent, setNurEvent] = useState(false);
  const [dayFilter, setDayFilter] = useState<string | null>(null);
  const [msgFilter, setMsgFilter] = useState<MsgFilter>("alle");

  const [expandedRes, setExpandedRes] = useState<string | null>(null);
  const [expandedMsg, setExpandedMsg] = useState<string | null>(null);

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
      if (!resData.ok) {
        setError(resData.error || "Fehler.");
        return;
      }
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
    if (saved) {
      setToken(saved);
      load(saved);
    }
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
        body: JSON.stringify({ to: m.email, name: m.name, betreff: m.subject, nachricht: composeText }),
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
      <section className="min-h-screen bg-stone-100">
        <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-bordeaux">
            Odysseus Ochtrup
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-stone-900">Betriebszentrale</h1>
          <p className="mt-1 text-sm text-stone-500">
            Reservierungen, Nachrichten und Tagesplanung.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              load(token);
            }}
            className="mt-8 space-y-3"
          >
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Passwort"
              autoFocus
              className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none focus:border-bordeaux focus:ring-2 focus:ring-bordeaux/20"
            />
            {error && <p className="text-sm text-rose-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-bordeaux px-6 py-3 font-semibold text-white transition hover:bg-bordeaux-dark disabled:opacity-60"
            >
              {loading ? "Anmelden …" : "Anmelden"}
            </button>
          </form>
        </div>
      </section>
    );
  }

  // ── Ableitungen ─────────────────────────────────────────────────────────────
  const today = localISO();
  const tomorrow = addDaysISO(today, 1);
  const weekEnd = addDaysISO(today, 6);

  const upcoming = reservations.filter((r) => r.date >= today);
  const upcomingActive = upcoming.filter((r) => r.status !== "abgesagt");

  const perDay = new Map<string, { count: number; guests: number; event: boolean }>();
  for (const r of upcomingActive) {
    const e = perDay.get(r.date) ?? { count: 0, guests: 0, event: false };
    e.count += 1;
    e.guests += r.guests;
    if (r.kind === "event") e.event = true;
    perDay.set(r.date, e);
  }

  const kpi = {
    heute: perDay.get(today) ?? { count: 0, guests: 0, event: false },
    morgen: perDay.get(tomorrow) ?? { count: 0, guests: 0, event: false },
    woche: upcomingActive.filter((r) => r.date <= weekEnd).length,
    offen: upcoming.filter((r) => r.status === "neu").length,
    bestaetigt: upcoming.filter((r) => r.status === "bestaetigt").length,
    event: upcomingActive.filter((r) => r.kind === "event").length,
    nachrichten: messages.length,
  };

  const next7 = Array.from({ length: 7 }, (_, i) => addDaysISO(today, i));

  // Reservierungsliste filtern
  let list = reservations.filter((r) => (view === "archiv" ? r.date < today : r.date >= today));
  if (view !== "archiv") {
    if (dayFilter) list = list.filter((r) => r.date === dayFilter);
    else if (zeit === "heute") list = list.filter((r) => r.date === today);
    else if (zeit === "morgen") list = list.filter((r) => r.date === tomorrow);
    else if (zeit === "woche") list = list.filter((r) => r.date <= weekEnd);
  }
  if (statusFilter !== "alle") list = list.filter((r) => r.status === statusFilter);
  if (nurEvent) list = list.filter((r) => r.kind === "event");

  list.sort((a, b) => {
    if (a.date !== b.date) return view === "archiv" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
    return (a.time || "").localeCompare(b.time || "");
  });

  const groups: { date: string; items: Reservation[] }[] = [];
  for (const r of list) {
    const g = groups.find((x) => x.date === r.date);
    if (g) g.items.push(r);
    else groups.push({ date: r.date, items: [r] });
  }

  // Nachrichten filtern
  const msgList = messages.filter((m) =>
    msgFilter === "alle"
      ? true
      : msgFilter === "bewerbung"
      ? isApplication(m.subject)
      : !isApplication(m.subject)
  );

  function resetFilters() {
    setZeit("alle");
    setStatusFilter("alle");
    setNurEvent(false);
    setDayFilter(null);
  }

  // KPI-Klick → passende Ansicht/Filter
  function goto(target: "heute" | "morgen" | "woche" | "offen" | "bestaetigt" | "event" | "nachrichten") {
    if (target === "nachrichten") {
      setView("nachrichten");
      return;
    }
    setView("reservierungen");
    resetFilters();
    if (target === "heute") setZeit("heute");
    if (target === "morgen") setZeit("morgen");
    if (target === "woche") setZeit("woche");
    if (target === "offen") setStatusFilter("neu");
    if (target === "bestaetigt") setStatusFilter("bestaetigt");
    if (target === "event") setNurEvent(true);
  }

  const kpiCards: {
    key: Parameters<typeof goto>[0];
    label: string;
    value: number;
    sub?: string;
    accent?: boolean;
  }[] = [
    { key: "heute", label: "Heute", value: kpi.heute.count, sub: `${kpi.heute.guests} Gäste` },
    { key: "morgen", label: "Morgen", value: kpi.morgen.count, sub: `${kpi.morgen.guests} Gäste` },
    { key: "woche", label: "Diese Woche", value: kpi.woche, sub: "7 Tage" },
    { key: "offen", label: "Offen", value: kpi.offen, sub: "zu prüfen", accent: kpi.offen > 0 },
    { key: "bestaetigt", label: "Bestätigt", value: kpi.bestaetigt, sub: "kommend" },
    { key: "nachrichten", label: "Nachrichten", value: kpi.nachrichten, sub: "gesamt", accent: kpi.nachrichten > 0 },
  ];

  const chevron = (open: boolean) => (
    <svg
      viewBox="0 0 20 20"
      className={`h-4 w-4 shrink-0 text-stone-400 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  const phoneIcon = (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
      <path d="M3.5 3.8c0-.5.4-.9.9-.9h2.1c.4 0 .8.3.9.7l.8 2.7c.1.4 0 .8-.3 1L6.6 8.4c.8 1.7 2.2 3.1 3.9 3.9l1.1-1.2c.3-.3.7-.4 1-.3l2.7.8c.4.1.7.5.7.9v2.1c0 .5-.4.9-.9.9C8.1 15.5 4.5 11.9 3.5 3.8Z" />
    </svg>
  );

  // ── Layout ──────────────────────────────────────────────────────────────────
  return (
    <section className="min-h-screen bg-stone-100 text-stone-900">
      {/* Kopfzeile */}
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bordeaux">
              Odysseus · Betriebszentrale
            </p>
            <p className="truncate text-sm text-stone-500">{fmtLong(today)}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => load(token)}
              disabled={loading}
              className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
            >
              {loading ? "…" : "Aktualisieren"}
            </button>
            <button
              onClick={logout}
              className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-500 hover:bg-stone-50"
            >
              Abmelden
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-5">
        {/* KPI-Leiste */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {kpiCards.map((c) => (
            <button
              key={c.key}
              onClick={() => goto(c.key)}
              className={`rounded-xl border p-3 text-left transition hover:shadow-sm ${
                c.accent
                  ? "border-bordeaux/30 bg-bordeaux/5"
                  : "border-stone-200 bg-white"
              }`}
            >
              <div className="flex items-baseline gap-1.5">
                <span className={`text-2xl font-semibold tabular-nums ${c.accent ? "text-bordeaux" : "text-stone-900"}`}>
                  {c.value}
                </span>
              </div>
              <div className="mt-0.5 text-xs font-medium text-stone-600">{c.label}</div>
              {c.sub && <div className="text-[11px] text-stone-400">{c.sub}</div>}
            </button>
          ))}
        </div>

        {/* Ansichts-Umschalter */}
        <div className="mt-5 flex gap-1 rounded-xl border border-stone-200 bg-white p-1">
          {(
            [
              ["reservierungen", "Reservierungen"],
              ["nachrichten", `Nachrichten${kpi.nachrichten ? ` (${kpi.nachrichten})` : ""}`],
              ["archiv", "Archiv"],
            ] as [View, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setView(key);
                resetFilters();
              }}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                view === key ? "bg-bordeaux text-white" : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Reservierungen ── */}
        {(view === "reservierungen" || view === "archiv") && (
          <div className="mt-4">
            {view === "reservierungen" && (
              <>
                {/* Wochenstreifen */}
                <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                  {next7.map((iso) => {
                    const d = perDay.get(iso);
                    const active = dayFilter === iso;
                    return (
                      <button
                        key={iso}
                        onClick={() => {
                          setDayFilter(active ? null : iso);
                          setZeit("alle");
                        }}
                        className={`flex min-w-[64px] shrink-0 flex-col items-center rounded-xl border px-2 py-2 transition ${
                          active
                            ? "border-bordeaux bg-bordeaux text-white"
                            : "border-stone-200 bg-white hover:border-stone-300"
                        }`}
                      >
                        <span className={`text-[11px] uppercase ${active ? "text-white/80" : "text-stone-400"}`}>
                          {weekday(iso)}
                        </span>
                        <span className="text-sm font-semibold">{dayMonth(iso)}</span>
                        <span
                          className={`mt-1 flex items-center gap-1 text-[11px] ${
                            active ? "text-white/90" : "text-stone-500"
                          }`}
                        >
                          {d?.event && (
                            <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-gold-light" : "bg-gold"}`} />
                          )}
                          {d ? `${d.count}` : "–"}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Filter-Chips */}
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      ["alle", "Alle"],
                      ["heute", "Heute"],
                      ["morgen", "Morgen"],
                      ["woche", "Woche"],
                    ] as [Zeit, string][]
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setZeit(key);
                        setDayFilter(null);
                      }}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                        zeit === key && !dayFilter
                          ? "bg-stone-900 text-white"
                          : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                  <span className="mx-1 h-4 w-px bg-stone-200" />
                  {(
                    [
                      ["alle", "Alle Status"],
                      ["neu", "Neu"],
                      ["bestaetigt", "Bestätigt"],
                      ["abgesagt", "Abgesagt"],
                    ] as [StatusFilter, string][]
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setStatusFilter(key)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                        statusFilter === key
                          ? "bg-stone-900 text-white"
                          : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                  <button
                    onClick={() => setNurEvent((v) => !v)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      nurEvent
                        ? "bg-gold text-white"
                        : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    Nur Event
                  </button>
                </div>
              </>
            )}

            {view === "archiv" && (
              <div className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-500">
                Vergangene Reservierungen · schreibgeschützt
              </div>
            )}

            {/* Gruppierte Liste */}
            <div className="mt-4 space-y-5">
              {groups.length === 0 && (
                <div className="rounded-xl border border-dashed border-stone-300 bg-white p-10 text-center text-sm text-stone-400">
                  Keine Reservierungen in dieser Ansicht.
                </div>
              )}
              {groups.map((g) => {
                const guests = g.items
                  .filter((r) => r.status !== "abgesagt")
                  .reduce((s, r) => s + r.guests, 0);
                return (
                  <div key={g.date}>
                    <div className="mb-2 flex items-baseline justify-between">
                      <h3 className="text-sm font-semibold text-stone-900">
                        {groupLabel(g.date, today, tomorrow)}
                      </h3>
                      <span className="text-xs text-stone-400">
                        {g.items.length} Res. · {guests} Gäste
                      </span>
                    </div>
                    <div className="divide-y divide-stone-100 overflow-hidden rounded-xl border border-stone-200 bg-white">
                      {g.items.map((r) => {
                        const open = expandedRes === r.id;
                        return (
                          <div key={r.id}>
                            <div className="flex items-center gap-2 px-3 py-2.5">
                              <button
                                onClick={() => setExpandedRes(open ? null : r.id)}
                                className="flex min-w-0 flex-1 items-center gap-3 text-left"
                              >
                                <span className="w-12 shrink-0 text-sm font-semibold tabular-nums text-stone-900">
                                  {r.time || "—"}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="flex items-center gap-1.5">
                                    <span className={`h-2 w-2 shrink-0 rounded-full ${statusDot[r.status]}`} />
                                    <span className="truncate font-medium text-stone-900">{r.name}</span>
                                  </span>
                                  <span className="block truncate text-xs text-stone-500">
                                    {r.guests} Pers.
                                    {r.kind === "event" ? " · Event" : ""}
                                    {r.message ? " · Hinweis" : ""}
                                  </span>
                                </span>
                              </button>

                              {view !== "archiv" && r.status === "neu" && (
                                <button
                                  onClick={() => setStatus(r.id, "bestaetigt")}
                                  className="shrink-0 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                                >
                                  ✓
                                </button>
                              )}
                              <a
                                href={`tel:${r.phone}`}
                                className="shrink-0 rounded-lg border border-stone-200 p-1.5 text-stone-500 hover:bg-stone-50"
                                aria-label="Anrufen"
                              >
                                {phoneIcon}
                              </a>
                              <button
                                onClick={() => setExpandedRes(open ? null : r.id)}
                                className="shrink-0 p-1"
                                aria-label="Details"
                              >
                                {chevron(open)}
                              </button>
                            </div>

                            {open && (
                              <div className="border-t border-stone-100 bg-stone-50/60 px-3 py-3">
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                                  <a href={`tel:${r.phone}`} className="font-medium text-bordeaux hover:underline">
                                    {r.phone}
                                  </a>
                                  <a href={`mailto:${r.email}`} className="break-all text-stone-500 hover:underline">
                                    {r.email}
                                  </a>
                                </div>
                                <p className="mt-1 text-xs text-stone-400">
                                  {fmtLong(r.date)}
                                  {r.time ? `, ${r.time} Uhr` : ""} · {r.guests}{" "}
                                  {r.guests === 1 ? "Person" : "Personen"}
                                </p>
                                {r.message && (
                                  <p className="mt-2 rounded-lg bg-white p-3 text-sm text-stone-600 ring-1 ring-stone-200">
                                    „{r.message}"
                                  </p>
                                )}
                                {view !== "archiv" && (
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    <button
                                      onClick={() => setStatus(r.id, "bestaetigt")}
                                      disabled={r.status === "bestaetigt"}
                                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-40"
                                    >
                                      Bestätigen
                                    </button>
                                    <button
                                      onClick={() => setStatus(r.id, "abgesagt")}
                                      disabled={r.status === "abgesagt"}
                                      className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-40"
                                    >
                                      Absagen
                                    </button>
                                    <button
                                      onClick={() => setStatus(r.id, "neu")}
                                      disabled={r.status === "neu"}
                                      className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-white disabled:opacity-40"
                                    >
                                      Als neu
                                    </button>
                                    <span className={`ml-auto self-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusPill[r.status]}`}>
                                      {statusLabels[r.status]}
                                    </span>
                                  </div>
                                )}
                                <p className="mt-2 text-[11px] text-stone-400">
                                  Eingegangen: {fmtDateTime(r.createdAt)}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Nachrichten ── */}
        {view === "nachrichten" && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ["alle", "Alle"],
                  ["anfrage", "Anfragen"],
                  ["bewerbung", "Bewerbungen"],
                ] as [MsgFilter, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setMsgFilter(key)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    msgFilter === key
                      ? "bg-stone-900 text-white"
                      : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-4 divide-y divide-stone-100 overflow-hidden rounded-xl border border-stone-200 bg-white">
              {msgList.length === 0 && (
                <div className="p-10 text-center text-sm text-stone-400">Keine Nachrichten.</div>
              )}
              {msgList.map((m) => {
                const open = expandedMsg === m.id;
                const bewerbung = isApplication(m.subject);
                return (
                  <div key={m.id}>
                    <button
                      onClick={() => setExpandedMsg(open ? null : m.id)}
                      className="flex w-full items-center gap-3 px-3 py-3 text-left"
                    >
                      <span
                        className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium ${
                          bewerbung
                            ? "bg-violet-50 text-violet-700 ring-1 ring-violet-200"
                            : "bg-sky-50 text-sky-700 ring-1 ring-sky-200"
                        }`}
                      >
                        {bewerbung ? "Bewerbung" : "Anfrage"}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate font-medium text-stone-900">{m.name}</span>
                          {composeSent[m.id] && (
                            <span className="shrink-0 text-xs font-semibold text-emerald-600">✓ beantwortet</span>
                          )}
                        </span>
                        <span className="block truncate text-xs text-stone-500">{m.subject}</span>
                      </span>
                      {chevron(open)}
                    </button>

                    {open && (
                      <div className="border-t border-stone-100 bg-stone-50/60 px-3 py-3">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                          {m.phone && (
                            <a href={`tel:${m.phone}`} className="font-medium text-bordeaux hover:underline">
                              {m.phone}
                            </a>
                          )}
                          <a href={`mailto:${m.email}`} className="break-all text-stone-500 hover:underline">
                            {m.email}
                          </a>
                        </div>
                        <p className="mt-2 whitespace-pre-line rounded-lg bg-white p-3 text-sm leading-relaxed text-stone-600 ring-1 ring-stone-200">
                          {m.message}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => (composeFor === m.id ? setComposeFor(null) : openCompose(m))}
                            className="rounded-lg bg-bordeaux px-3 py-1.5 text-xs font-semibold text-white hover:bg-bordeaux-dark"
                          >
                            Mit Vorlage antworten
                          </button>
                          <a
                            href={vorlageMailto(m)}
                            className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-white"
                          >
                            Im eigenen Mailprogramm
                          </a>
                          <span className="ml-auto text-[11px] text-stone-400">
                            {fmtDateTime(m.createdAt)}
                          </span>
                        </div>

                        {composeFor === m.id && (
                          <div className="mt-3 rounded-lg border border-stone-200 bg-white p-3">
                            <p className="mb-2 text-xs text-stone-500">
                              Wird als <strong className="text-stone-700">gestaltete Mail im Odysseus-Design</strong> an{" "}
                              <strong className="text-stone-700">{m.email}</strong> versendet.
                            </p>
                            <textarea
                              value={composeText}
                              onChange={(e) => setComposeText(e.target.value)}
                              rows={6}
                              autoFocus
                              className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-bordeaux focus:ring-2 focus:ring-bordeaux/20"
                              placeholder="Ihre persönliche Antwort …"
                            />
                            {composeError && <p className="mt-2 text-xs text-rose-600">{composeError}</p>}
                            <div className="mt-2 flex flex-wrap gap-2">
                              <button
                                onClick={() => sendReply(m)}
                                disabled={composeSending}
                                className="rounded-lg bg-bordeaux px-4 py-1.5 text-xs font-semibold text-white hover:bg-bordeaux-dark disabled:opacity-60"
                              >
                                {composeSending ? "Senden …" : "Gestaltete Mail senden"}
                              </button>
                              <button
                                onClick={() => {
                                  setComposeFor(null);
                                  setComposeError("");
                                }}
                                className="rounded-lg border border-stone-300 px-4 py-1.5 text-xs font-semibold text-stone-500 hover:bg-stone-50"
                              >
                                Abbrechen
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
