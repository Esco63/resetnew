import { NextResponse, type NextRequest } from "next/server";
import { getOrder, getOrdersDb, requireAdmin, sanitizeOrderPatch } from "@/lib/orders/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  try {
    const order = await getOrder(id);
    if (!order) return NextResponse.json({ error: "Auftrag nicht gefunden." }, { status: 404 });
    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  try {
    const existing = await getOrder(id);
    if (!existing) return NextResponse.json({ error: "Auftrag nicht gefunden." }, { status: 404 });
    if (existing.status === "gesendet") {
      return NextResponse.json(
        { error: "Die Rechnung ist schon gesendet. Der Auftrag kann nicht mehr geändert werden." },
        { status: 409 }
      );
    }

    const patch = sanitizeOrderPatch((await req.json()) as Record<string, unknown>);
    if (patch.status === "gesendet") {
      return NextResponse.json(
        { error: "Der Status „gesendet“ wird nur beim Rechnungsversand gesetzt." },
        { status: 400 }
      );
    }

    const { data, error } = await getOrdersDb()
      .from("orders")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);

    return NextResponse.json({ order: data });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
