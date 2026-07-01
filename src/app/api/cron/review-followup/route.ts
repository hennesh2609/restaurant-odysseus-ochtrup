import { NextResponse } from "next/server";
import { getReservationsForFollowup, markFollowupSent } from "@/lib/reservations";
import { sendReviewRequest } from "@/lib/notify";

export async function GET(request: Request) {
  // Vercel Cron-Authentifizierung
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  // Gestrige Reservierungen suchen
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split("T")[0];

  const reservations = await getReservationsForFollowup(dateStr);

  let sent = 0;
  for (const r of reservations) {
    await sendReviewRequest(r);
    await markFollowupSent(r.id);
    sent++;
  }

  return NextResponse.json({ ok: true, date: dateStr, sent });
}
