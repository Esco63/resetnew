import { disposalNetFromSasGross } from "./invoice";
import { extractSasReceipt } from "./sas-extract";
import { getOrder, getOrdersDb } from "./server";
import { ORDERS_BUCKET, type Order } from "./types";

export type SasReceipt = {
  id: string;
  created_at: string;
  updated_at: string;
  file_path: string;
  status: "neu" | "gelesen" | "zugeordnet" | "fehler";
  error: string | null;
  receipt_date: string | null;
  receipt_time: string | null;
  receipt_number: string | null;
  gross: number | null;
  net: number | null;
  vat: number | null;
  items: { name: string; quantity: number | null; amount: number | null }[] | null;
  order_id: string | null;
};

export const RECEIPT_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function contentTypeFromPath(path: string) {
  const ext = path.split(".").pop()?.toLowerCase();
  return Object.entries(RECEIPT_TYPES).find(([, e]) => e === ext)?.[0] ?? "application/octet-stream";
}

export async function getReceipt(id: string) {
  const { data, error } = await getOrdersDb().from("sas_receipts").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data as SasReceipt | null;
}

export async function listReceipts() {
  const { data, error } = await getOrdersDb()
    .from("sas_receipts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(300);
  if (error) throw new Error(error.message);
  return (data ?? []) as SasReceipt[];
}

async function downloadFile(path: string) {
  const { data, error } = await getOrdersDb().storage.from(ORDERS_BUCKET).download(path);
  if (error || !data) throw new Error(error?.message ?? "Datei nicht gefunden.");
  return Buffer.from(await data.arrayBuffer());
}

/** Liest eine Datei als SAS-Beleg aus (für den Upload direkt am Auftrag). */
export async function readReceiptFile(path: string) {
  return extractSasReceipt(await downloadFile(path), contentTypeFromPath(path));
}

/** Beleg mit Claude auslesen und das Ergebnis speichern. */
export async function readAndStoreReceipt(id: string) {
  const receipt = await getReceipt(id);
  if (!receipt) throw new Error("Beleg nicht gefunden.");

  const db = getOrdersDb();
  try {
    const data = await readReceiptFile(receipt.file_path);
    const { data: updated, error } = await db
      .from("sas_receipts")
      .update({
        status: receipt.order_id ? "zugeordnet" : "gelesen",
        error: data.is_sas_receipt ? null : "Sieht nicht wie ein SAS-Beleg aus – bitte prüfen.",
        receipt_date: data.receipt_date,
        receipt_time: data.receipt_time,
        receipt_number: data.receipt_number,
        gross: data.gross,
        net: data.net,
        vat: data.vat,
        items: data.items,
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return updated as SasReceipt;
  } catch (readError) {
    const message = (readError as Error).message;
    await db.from("sas_receipts").update({ status: "fehler", error: message }).eq("id", id);
    throw readError;
  }
}

/** Beleg einem Auftrag zuordnen: Datei, Betrag und Einsatzdatum gehen in den Auftrag. */
export async function assignReceipt(receiptId: string, orderId: string) {
  const db = getOrdersDb();
  const receipt = await getReceipt(receiptId);
  if (!receipt) throw new Error("Beleg nicht gefunden.");
  const order = await getOrder(orderId);
  if (!order) throw new Error("Auftrag nicht gefunden.");
  if (order.status === "gesendet") throw new Error("Für diesen Auftrag ist die Rechnung schon gesendet.");

  // Bisher zugeordnete Belege lösen (am Auftrag oder am Beleg)
  if (receipt.order_id && receipt.order_id !== orderId) await unassignReceipt(receiptId);
  const { data: previous } = await db
    .from("sas_receipts")
    .select("id")
    .eq("order_id", orderId)
    .neq("id", receiptId);
  for (const row of previous ?? []) await unassignReceipt(row.id);

  const patch: Partial<Order> = { sas_receipt_path: receipt.file_path };
  if (receipt.gross !== null) {
    patch.sas_gross = receipt.gross;
    patch.disposal_net = disposalNetFromSasGross(Number(receipt.gross));
  }
  if (receipt.receipt_date) patch.work_date = receipt.receipt_date;

  const { error: orderError } = await db.from("orders").update(patch).eq("id", orderId);
  if (orderError) throw new Error(orderError.message);

  const { data, error } = await db
    .from("sas_receipts")
    .update({ status: "zugeordnet", order_id: orderId })
    .eq("id", receiptId)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as SasReceipt;
}

/** Zuordnung aufheben; der Auftrag verliert Beleg und Entsorgungsbetrag wieder. */
export async function unassignReceipt(receiptId: string) {
  const db = getOrdersDb();
  const receipt = await getReceipt(receiptId);
  if (!receipt) throw new Error("Beleg nicht gefunden.");

  if (receipt.order_id) {
    const order = await getOrder(receipt.order_id);
    if (order?.status === "gesendet") throw new Error("Für diesen Auftrag ist die Rechnung schon gesendet.");
    if (order && order.sas_receipt_path === receipt.file_path) {
      const { error } = await db
        .from("orders")
        .update({ sas_receipt_path: null, sas_gross: null, disposal_net: null })
        .eq("id", order.id);
      if (error) throw new Error(error.message);
    }
  }

  const { data, error } = await db
    .from("sas_receipts")
    .update({ status: receipt.receipt_date || receipt.gross !== null ? "gelesen" : "neu", order_id: null })
    .eq("id", receiptId)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as SasReceipt;
}
