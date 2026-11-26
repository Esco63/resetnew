import { NextResponse, type NextRequest } from "next/server";
import { getOrder, getOrdersDb, requireAdmin } from "@/lib/orders/server";
import {
  ORDER_FILE_COLUMNS,
  ORDER_FILE_KINDS,
  ORDERS_BUCKET,
  type OrderFileKind,
} from "@/lib/orders/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/** Hochladbar sind nur Auftragsmail und SAS-Beleg; das Rechnungs-PDF erzeugt der Server. */
const UPLOAD_KINDS: OrderFileKind[] = ["auftragsmail", "sas"];
const ALLOWED_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/heic": "heic",
  "image/heif": "heif",
  "image/webp": "webp",
};

function parseKind(value: unknown): OrderFileKind | null {
  return ORDER_FILE_KINDS.includes(value as OrderFileKind) ? (value as OrderFileKind) : null;
}

/** Datei ansehen: leitet auf eine kurz gültige, signierte URL weiter. */
export async function GET(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  const kind = parseKind(req.nextUrl.searchParams.get("kind"));
  if (!kind) return NextResponse.json({ error: "Unbekannte Dateiart." }, { status: 400 });

  const order = await getOrder(id);
  const path = order?.[ORDER_FILE_COLUMNS[kind]] as string | null | undefined;
  if (!path) return NextResponse.json({ error: "Keine Datei vorhanden." }, { status: 404 });

  const { data, error } = await getOrdersDb().storage.from(ORDERS_BUCKET).createSignedUrl(path, 120);
  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Datei nicht gefunden." }, { status: 500 });
  }
  return NextResponse.redirect(data.signedUrl);
}

/**
 * Schritt 1 des Uploads: signierte Upload-URL holen. Der Browser lädt die Datei
 * dann direkt zu Supabase hoch (umgeht das 4,5-MB-Limit von Vercel-Funktionen).
 */
export async function POST(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  const body = (await req.json()) as { kind?: string; contentType?: string };
  const kind = parseKind(body.kind);
  if (!kind || !UPLOAD_KINDS.includes(kind)) {
    return NextResponse.json({ error: "Unbekannte Dateiart." }, { status: 400 });
  }
  const ext = ALLOWED_TYPES[body.contentType ?? ""];
  if (!ext) {
    return NextResponse.json({ error: "Bitte ein PDF oder Foto hochladen." }, { status: 400 });
  }

  const order = await getOrder(id);
  if (!order) return NextResponse.json({ error: "Auftrag nicht gefunden." }, { status: 404 });
  if (order.status === "gesendet") {
    return NextResponse.json({ error: "Die Rechnung ist schon gesendet." }, { status: 409 });
  }

  const path = `${id}/${kind}-${Date.now()}.${ext}`;
  const { data, error } = await getOrdersDb()
    .storage.from(ORDERS_BUCKET)
    .createSignedUploadUrl(path);
  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Upload nicht möglich." }, { status: 500 });
  }
  return NextResponse.json({ path: data.path, token: data.token });
}

/** Schritt 2 des Uploads: hochgeladene Datei dem Auftrag zuordnen. */
export async function PUT(req: NextRequest, { params }: Params) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  const body = (await req.json()) as { kind?: string; path?: string };
  const kind = parseKind(body.kind);
  if (!kind || !UPLOAD_KINDS.includes(kind) || !body.path) {
    return NextResponse.json({ error: "Ungültige Angaben." }, { status: 400 });
  }
  if (!body.path.startsWith(`${id}/${kind}-`)) {
    return NextResponse.json({ error: "Ungültiger Dateipfad." }, { status: 400 });
  }

  const db = getOrdersDb();
  const fileName = body.path.slice(id.length + 1);
  const { data: listed, error: listError } = await db.storage
    .from(ORDERS_BUCKET)
    .list(id, { search: fileName });
  if (listError || !listed?.some((file) => file.name === fileName)) {
    return NextResponse.json({ error: "Die Datei ist nicht angekommen." }, { status: 400 });
  }

  const order = await getOrder(id);
  if (!order) return NextResponse.json({ error: "Auftrag nicht gefunden." }, { status: 404 });
  const column = ORDER_FILE_COLUMNS[kind];
  const previous = order[column] as string | null;

  const { data, error } = await db
    .from("orders")
    .update({ [column]: body.path })
    .eq("id", id)
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (previous && previous !== body.path) {
    await db.storage.from(ORDERS_BUCKET).remove([previous]);
  }
  return NextResponse.json({ order: data });
}
