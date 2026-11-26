import { NextResponse, type NextRequest } from "next/server";
import {
  assignReceipt,
  getReceipt,
  readAndStoreReceipt,
  unassignReceipt,
} from "@/lib/orders/sas";
import { getOrdersDb, requireAdmin } from "@/lib/orders/server";
import { ORDERS_BUCKET } from "@/lib/orders/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Params = { params: Promise<{ id: string }> };

/** Beleg ansehen: Weiterleitung auf eine kurz gültige, signierte URL. */
export async function GET(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  const receipt = await getReceipt(id);
  if (!receipt) return NextResponse.json({ error: "Beleg nicht gefunden." }, { status: 404 });

  const { data, error } = await getOrdersDb()
    .storage.from(ORDERS_BUCKET)
    .createSignedUrl(receipt.file_path, 120);
  if (error || !data) return NextResponse.json({ error: error?.message }, { status: 500 });
  return NextResponse.redirect(data.signedUrl);
}

/**
 * Aktionen am Beleg:
 *   { action: "read" }                      – mit Claude auslesen
 *   { action: "assign", orderId: "<uuid>" } – einem Auftrag zuordnen
 *   { action: "unassign" }                  – Zuordnung lösen
 */
export async function POST(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  const body = (await req.json()) as { action?: string; orderId?: string };
  try {
    switch (body.action) {
      case "read":
        return NextResponse.json({ receipt: await readAndStoreReceipt(id) });
      case "assign":
        if (!body.orderId) throw new Error("Bitte einen Auftrag wählen.");
        return NextResponse.json({ receipt: await assignReceipt(id, body.orderId) });
      case "unassign":
        return NextResponse.json({ receipt: await unassignReceipt(id) });
      default:
        return NextResponse.json({ error: "Unbekannte Aktion." }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

/** Nicht zugeordneten Beleg löschen (z. B. doppelt hochgeladen). */
export async function DELETE(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  const receipt = await getReceipt(id);
  if (!receipt) return NextResponse.json({ error: "Beleg nicht gefunden." }, { status: 404 });
  if (receipt.order_id) {
    return NextResponse.json({ error: "Bitte zuerst die Zuordnung lösen." }, { status: 409 });
  }

  const db = getOrdersDb();
  const { error } = await db.from("sas_receipts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await db.storage.from(ORDERS_BUCKET).remove([receipt.file_path]);
  return NextResponse.json({ ok: true });
}
