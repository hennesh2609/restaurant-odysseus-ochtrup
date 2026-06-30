import { NextResponse } from "next/server";
import { validateReservation } from "@/lib/validate";
import { createReservation } from "@/lib/reservations";
import { notifyReservation } from "@/lib/notify";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Ungültige Anfrage." },
      { status: 400 }
    );
  }

  const result = validateReservation(body);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  try {
    const reservation = await createReservation(result.data);
    // E-Mail-Benachrichtigung (nicht blockierend für die Antwort relevant,
    // aber wir warten kurz, damit Fehler geloggt werden).
    await notifyReservation(reservation);
    return NextResponse.json({ ok: true, id: reservation.id });
  } catch (e) {
    console.error("[Reservierung] Fehler:", e);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Reservierung konnte nicht gespeichert werden. Bitte rufen Sie uns an.",
      },
      { status: 500 }
    );
  }
}
