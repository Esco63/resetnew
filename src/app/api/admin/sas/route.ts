import { NextResponse, type NextRequest } from "next/server";
import { RECEIPT_TYPES, listReceipts } from "@/lib/orders/sas";
import { canReadReceipts } from "@/lib/orders/sas-extract";
import { getOrdersDb, listOrders, requireAdmin } from "@/lib/orders/server";
import { ORDERS_BUCKET } from "@/lib/orders/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Belege plus alle Aufträge, die noch einen Beleg bekommen können. */
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const [receipts, orders] = await Promise.all([listReceipts(), listOrders()]);
    return NextResponse.json({
      receipts,
      orders: orders.filter((order) => order.status === "neu" || order.status === "erledigt"),
      canRead: canReadReceipts(),
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

/** Neuen Beleg anlegen und eine signierte Upload-URL dafür zurückgeben. */
export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const body = (await req.json()) as { contentType?: string };
  const ext = RECEIPT_TYPES[body.contentType ?? ""];
  if (!ext) {
    return NextResponse.json(
      { error: "Bitte ein PDF oder Foto (JPG/PNG) hochladen." },
      { status: 400 }
    );
  }

  const db = getOrdersDb();
  const path = `sas/${crypto.randomUUID()}.${ext}`;
  const { data: upload, error: uploadError } = await db.storage
    .from(ORDERS_BUCKET)
    .createSignedUploadUrl(path);
  if (uploadError || !upload) {
    return NextResponse.json({ error: uploadError?.message ?? "Upload nicht möglich." }, { status: 500 });
  }

  const { data, error } = await db
    .from("sas_receipts")
    .insert({ file_path: path, status: "neu" })
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ id: data.id, path: upload.path, token: upload.token });
}
