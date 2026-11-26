import { NextResponse, type NextRequest } from "next/server";
import { importOrderMails } from "@/lib/orders/mail-import";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Automatischer Mail-Abruf, aufgerufen von einem Zeitplan (Supabase pg_cron
 * oder Vercel Cron) mit `Authorization: Bearer <CRON_SECRET>`.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const since = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const result = await importOrderMails({ since });
    return NextResponse.json({ ...result, created: result.created.length });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
