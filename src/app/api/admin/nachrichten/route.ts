import { NextResponse } from "next/server";
import { listMessages } from "@/lib/messages";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "odysseus-admin";

function authorized(request: Request): boolean {
  return request.headers.get("x-admin-token") === ADMIN_PASSWORD;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, error: "Nicht autorisiert." }, { status: 401 });
  }
  try {
    const messages = await listMessages();
    return NextResponse.json({ ok: true, messages });
  } catch (e) {
    console.error("[Admin] Fehler beim Laden der Nachrichten:", e);
    return NextResponse.json(
      { ok: false, error: "Fehler beim Laden der Nachrichten." },
      { status: 500 }
    );
  }
}
