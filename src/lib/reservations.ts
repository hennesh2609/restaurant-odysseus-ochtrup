import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { getSupabase, isSupabaseConfigured } from "./supabase";
import type { Reservation, ReservationInput } from "./types";

/*
  Speicher-Abstraktion für Reservierungen.
  - Ist Supabase konfiguriert (Env-Variablen gesetzt) -> Tabelle "reservations".
  - Sonst Fallback auf eine lokale JSON-Datei (nur für lokale Entwicklung/Demo).
*/

const TABLE = "reservations";
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "reservations.json");

// ---------- Datei-Fallback ----------
async function readFile(): Promise<Reservation[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Reservation[];
  } catch {
    return [];
  }
}

async function writeFile(rows: Reservation[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(rows, null, 2), "utf-8");
}

// ---------- Mapping Supabase <-> App ----------
type Row = {
  id: string;
  kind: string;
  name: string;
  email: string;
  phone: string;
  reserved_date: string;
  reserved_time: string;
  guests: number;
  message: string | null;
  status: string;
  created_at: string;
};

function rowToReservation(r: Row): Reservation {
  return {
    id: r.id,
    kind: r.kind as Reservation["kind"],
    name: r.name,
    email: r.email,
    phone: r.phone,
    date: r.reserved_date,
    time: r.reserved_time,
    guests: r.guests,
    message: r.message ?? undefined,
    status: r.status as Reservation["status"],
    createdAt: r.created_at,
  };
}

// ---------- Öffentliche API ----------
export async function createReservation(
  input: ReservationInput
): Promise<Reservation> {
  if (isSupabaseConfigured()) {
    const sb = getSupabase()!;
    const { data, error } = await sb
      .from(TABLE)
      .insert({
        kind: input.kind,
        name: input.name,
        email: input.email,
        phone: input.phone,
        reserved_date: input.date,
        reserved_time: input.time,
        guests: input.guests,
        message: input.message ?? null,
        status: "neu",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return rowToReservation(data as Row);
  }

  // Datei-Fallback
  const reservation: Reservation = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "neu",
  };
  const rows = await readFile();
  rows.unshift(reservation);
  await writeFile(rows);
  return reservation;
}

export async function listReservations(): Promise<Reservation[]> {
  if (isSupabaseConfigured()) {
    const sb = getSupabase()!;
    const { data, error } = await sb
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data as Row[]).map(rowToReservation);
  }
  return readFile();
}

export async function updateReservationStatus(
  id: string,
  status: Reservation["status"]
): Promise<void> {
  if (isSupabaseConfigured()) {
    const sb = getSupabase()!;
    const { error } = await sb.from(TABLE).update({ status }).eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }
  const rows = await readFile();
  const next = rows.map((r) => (r.id === id ? { ...r, status } : r));
  await writeFile(next);
}
