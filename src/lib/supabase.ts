import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-seitiger Supabase-Client (Service-Role-Key, nur auf dem Server!).
// Wird nur initialisiert, wenn die Umgebungsvariablen gesetzt sind –
// so funktioniert die Seite auch lokal ohne Supabase (Datei-Fallback).

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  cached = createClient(url, key, {
    auth: { persistSession: false },
  });
  return cached;
}

export const isSupabaseConfigured = () =>
  Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
