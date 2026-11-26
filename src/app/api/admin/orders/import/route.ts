import { NextResponse, type NextRequest } from "next/server";
import { importOrderMails } from "@/lib/orders/mail-import";
import { requireAdmin } from "@/lib/orders/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** „Mails abrufen“-Knopf im Adminbereich. Optional: { since: "YYYY-MM-DD" }. */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const body = (await req.json().catch(() => ({}))) as { since?: string };
  let since = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  if (body.since) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(body.since)) {
      return NextResponse.json({ error: "Ungültiges Datum." }, { status: 400 });
    }
    since = new Date(`${body.since}T00:00:00`);
  }

  try {
    return NextResponse.json(await importOrderMails({ since }));
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
