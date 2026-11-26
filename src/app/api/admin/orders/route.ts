import { NextResponse, type NextRequest } from "next/server";
import { getOrdersDb, listOrders, requireAdmin, sanitizeOrderPatch } from "@/lib/orders/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    return NextResponse.json({ orders: await listOrders() });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

/** Auftrag von Hand anlegen (solange der Mail-Abruf noch nicht läuft). */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const patch = sanitizeOrderPatch(body);
    if (!patch.object_address) {
      return NextResponse.json({ error: "Bitte Objekt / Adresse angeben." }, { status: 400 });
    }

    const { data, error } = await getOrdersDb()
      .from("orders")
      .insert({ ...patch, status: "neu", source: "manuell" })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
