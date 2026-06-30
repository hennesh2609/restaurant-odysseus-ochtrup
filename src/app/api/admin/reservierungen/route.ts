import { NextResponse } from "next/server";
import { listReservations, updateReservationStatus } from "@/lib/reservations";

// Einfacher Token-Schutz. Setze ADMIN_PASSWORD in der Umgebung.
// Für die lokale Entwicklung ist ein Standardwert hinterlegt.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "odysseus-admin";

function authorized(request: Request): boolean {
  const token = request.headers.get("x-admin-token");
  return token === ADMIN_PASSWORD;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, error: "Nicht autorisiert." }, { status: 401 });
  }
  try {
    const reservations = await listReservations();
    return NextResponse.json({ ok: true, reservations });
  } catch (e) {
    console.error("[Admin] Fehler beim Laden:", e);
    return NextResponse.json(
      { ok: false, error: "Fehler beim Laden der Reservierungen." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, error: "Nicht autorisiert." }, { status: 401 });
  }
  try {
    const body = (await request.json()) as { id?: string; status?: string };
    const valid = ["neu", "bestaetigt", "abgesagt"];
    if (!body.id || !body.status || !valid.includes(body.status)) {
      return NextResponse.json({ ok: false, error: "Ungültige Daten." }, { status: 400 });
    }
    await updateReservationStatus(body.id, body.status as "neu" | "bestaetigt" | "abgesagt");
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[Admin] Fehler beim Aktualisieren:", e);
    return NextResponse.json(
      { ok: false, error: "Aktualisierung fehlgeschlagen." },
      { status: 500 }
    );
  }
}
