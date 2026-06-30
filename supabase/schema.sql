-- Datenbank-Schema für die Reservierungen des Restaurant Odysseus.
-- Im Supabase SQL-Editor ausführen (oder via CLI als Migration).

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'restaurant' check (kind in ('restaurant', 'event')),
  name text not null,
  email text not null,
  phone text not null,
  reserved_date date not null,
  reserved_time text not null default '',
  guests integer not null check (guests between 1 and 50),
  message text,
  status text not null default 'neu' check (status in ('neu', 'bestaetigt', 'abgesagt')),
  created_at timestamptz not null default now()
);

create index if not exists reservations_created_at_idx
  on public.reservations (created_at desc);

create index if not exists reservations_date_idx
  on public.reservations (reserved_date);

-- Row Level Security aktivieren.
-- Zugriff erfolgt ausschließlich serverseitig über den Service-Role-Key,
-- der RLS umgeht. Es werden bewusst KEINE öffentlichen Policies angelegt,
-- damit niemand über den Anon-Key Reservierungen auslesen kann.
alter table public.reservations enable row level security;

-- Kontakt-/Bewerbungsnachrichten (Kontaktformular)
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_created_at_idx
  on public.messages (created_at desc);

alter table public.messages enable row level security;
