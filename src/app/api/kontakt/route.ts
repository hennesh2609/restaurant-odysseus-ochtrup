import { NextResponse } from "next/server";
import { validateMessage } from "@/lib/validate";
import { createMessage } from "@/lib/messages";
import { notifyMessage } from "@/lib/notify";

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

  const result = validateMessage(body);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  try {
    const message = await createMessage(result.data);
    await notifyMessage(message);
    return NextResponse.json({ ok: true, id: message.id });
  } catch (e) {
    console.error("[Kontakt] Fehler:", e);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Nachricht konnte nicht gesendet werden. Bitte rufen Sie uns an.",
      },
      { status: 500 }
    );
  }
}
