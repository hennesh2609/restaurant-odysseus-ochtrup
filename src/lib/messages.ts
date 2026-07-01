import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { getSupabase, isSupabaseConfigured } from "./supabase";

/*
  Speicher für Kontakt-/Bewerbungsnachrichten.
  Wie bei den Reservierungen: Supabase (Tabelle "messages") falls konfiguriert,
  sonst lokale JSON-Datei als Fallback.
*/

export type ContactMessage = {
  id: string;
  subject: string; // z.B. "Bewerbung als Aushilfe" oder "Allgemeine Anfrage"
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
};

export type ContactInput = Omit<ContactMessage, "id" | "createdAt">;

const TABLE = "messages";
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "messages.json");

async function readFile(): Promise<ContactMessage[]> {
  try {
    return JSON.parse(await fs.readFile(DATA_FILE, "utf-8")) as ContactMessage[];
  } catch {
    return [];
  }
}

async function writeFile(rows: ContactMessage[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(rows, null, 2), "utf-8");
}

export async function listMessages(): Promise<ContactMessage[]> {
  if (isSupabaseConfigured()) {
    const sb = getSupabase()!;
    const { data, error } = await sb
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data as { id: string; subject: string; name: string; email: string; phone: string | null; message: string; created_at: string }[]).map((r) => ({
      id: r.id,
      subject: r.subject,
      name: r.name,
      email: r.email,
      phone: r.phone ?? undefined,
      message: r.message,
      createdAt: r.created_at,
    }));
  }
  return readFile();
}

export async function createMessage(
  input: ContactInput
): Promise<ContactMessage> {
  if (isSupabaseConfigured()) {
    const sb = getSupabase()!;
    const { data, error } = await sb
      .from(TABLE)
      .insert({
        subject: input.subject,
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        message: input.message,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    const r = data as {
      id: string;
      subject: string;
      name: string;
      email: string;
      phone: string | null;
      message: string;
      created_at: string;
    };
    return {
      id: r.id,
      subject: r.subject,
      name: r.name,
      email: r.email,
      phone: r.phone ?? undefined,
      message: r.message,
      createdAt: r.created_at,
    };
  }

  const msg: ContactMessage = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const rows = await readFile();
  rows.unshift(msg);
  await writeFile(rows);
  return msg;
}
