# Restaurant Odysseus – Website

Moderne Website für das Restaurant Odysseus in Ochtrup mit Online-Reservierung,
eigener Event-Seite (Deutsch-Griechische Nacht), kompletter Speisekarte und einer
Admin-Übersicht für eingehende Reservierungen.

Gebaut mit **Next.js 16**, **React 19**, **Tailwind CSS v4** und optional **Supabase**.

## Schnellstart (lokal)

```bash
npm install
npm run dev
```

→ http://localhost:3000

Ohne weitere Konfiguration läuft alles sofort: Reservierungen werden in einer
lokalen Datei (`data/reservations.json`) gespeichert. Ideal zum Ausprobieren.

## Seiten

| Pfad | Inhalt |
| --- | --- |
| `/` | Startseite mit Hero, Highlights, Event-Teaser, Öffnungszeiten, Karte |
| `/speisekarte` | Komplette Speisekarte (alle Kategorien & Preise) |
| `/deutsch-griechische-nacht` | Event-Seite mit eigenem Reservierungsformular |
| `/reservierung` | Tischreservierung |
| `/kontakt` | Kontakt, Anfahrt, Öffnungszeiten |
| `/impressum`, `/datenschutz` | Rechtliches (Entwürfe – bitte prüfen lassen) |
| `/admin` | Passwortgeschützte Reservierungs-Übersicht fürs Restaurant |

## Inhalte pflegen

- **Speisekarte:** `src/lib/menu.ts`
- **Event-Daten (Datum, Preis, Programm):** `src/lib/event.ts`
- **Stammdaten (Adresse, Telefon, Öffnungszeiten):** `src/lib/restaurant.ts`
- **Bilder:** `src/lib/images.ts` – aktuell hochwertige Platzhalter (Unsplash).
  Bitte durch echte Restaurant-Fotos ersetzen (URLs eintragen oder Dateien in
  `public/images` ablegen). Logo & Schriftzug liegen bereits in `public/images`.

## Reservierungen produktiv schalten (Supabase)

1. Projekt auf [supabase.com](https://supabase.com) anlegen.
2. SQL aus `supabase/schema.sql` im SQL-Editor ausführen (legt die Tabelle an).
3. `.env.local` anlegen (siehe `.env.example`) und ausfüllen:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API)
   - `ADMIN_PASSWORD` (eigenes, sicheres Passwort für `/admin`)
4. Server neu starten. Reservierungen landen ab jetzt in der Datenbank.

## E-Mail-Benachrichtigung (optional)

Über [Resend](https://resend.com) wird bei jeder neuen Reservierung eine E-Mail
verschickt. In `.env.local`:

- `RESEND_API_KEY` – API-Key von Resend
- `NOTIFY_EMAIL` – Empfänger (vorerst: `Hennes.huewe@icloud.com`)
- `NOTIFY_FROM` – verifizierte Absenderadresse

Ohne `RESEND_API_KEY` wird jede Reservierung nur in der Server-Konsole geloggt
(die Speicherung in der Datenbank/Datei funktioniert trotzdem).

## Admin-Bereich

`/admin` → Passwort = `ADMIN_PASSWORD` (Standard lokal: `odysseus-admin`).
Dort lassen sich Reservierungen filtern, bestätigen und absagen.

## Deployment

Empfohlen: **Vercel**. Repository verbinden, die Umgebungsvariablen aus
`.env.example` im Vercel-Dashboard eintragen, fertig. Anschließend die Domain
`odysseus-ochtrup.de` in den Projekteinstellungen hinterlegen.

## Hinweise

- Impressum & Datenschutz sind inhaltliche Entwürfe und sollten vor dem
  Live-Gang rechtlich geprüft werden.
- Preise & Speisekarte wurden von der bisherigen Website übernommen.
