import { NextResponse } from "next/server";
import { replyToGuest } from "@/lib/notify";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "odysseus-admin";

function authorized(request: Request): boolean {
  return request.headers.get("x-admin-token") === ADMIN_PASSWORD;
}

// Verschickt eine gebrandete Antwort (Template "Allgemeine Antwort") an einen Gast.
export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, error: "Nicht autorisiert." }, { status: 401 });
  }
  try {
    const body = (await request.json()) as {
      to?: string;
      name?: string;
      betreff?: string;
      nachricht?: string;
    };
    if (!body.to || !body.name || !body.nachricht?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Empfänger, Name und Nachricht sind erforderlich." },
        { status: 400 }
      );
    }
    const result = await replyToGuest({
      to: body.to,
      name: body.name,
      betreff: body.betreff?.trim() || "Ihre Nachricht an uns",
      nachricht: body.nachricht,
    });
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error || "Versand fehlgeschlagen." },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[Admin] Fehler beim Senden der Antwort:", e);
    return NextResponse.json(
      { ok: false, error: "Antwort konnte nicht gesendet werden." },
      { status: 500 }
    );
  }
}
