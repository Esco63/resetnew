import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { EDITABLE_ORDER_FIELDS, ORDER_STATUSES, type Order } from "./types";

export async function requireAdmin(req: NextRequest) {
  if (await isAdminRequest(req)) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function getOrdersDb() {
  const supabase = getSupabaseAdminClient();
  if (!supabase) throw new Error("Supabase ist nicht konfiguriert.");
  return supabase;
}

export async function listOrders() {
  const { data, error } = await getOrdersDb()
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);
  return (data ?? []) as Order[];
}

export async function getOrder(id: string) {
  const { data, error } = await getOrdersDb().from("orders").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data as Order | null;
}

const numberOrNull = (value: unknown) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(String(value).replace(",", "."));
  if (!Number.isFinite(parsed)) throw new Error(`Ungültige Zahl: ${String(value)}`);
  return parsed;
};

const textOrNull = (value: unknown) => {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text === "" ? null : text;
};

/** Nimmt nur erlaubte Felder an und bringt sie in das Datenbankformat. */
export function sanitizeOrderPatch(input: Record<string, unknown>) {
  const patch: Partial<Order> = {};
  for (const field of EDITABLE_ORDER_FIELDS) {
    if (!(field in input)) continue;
    const value = input[field];
    switch (field) {
      case "status":
        if (!ORDER_STATUSES.includes(value as Order["status"])) {
          throw new Error(`Ungültiger Status: ${String(value)}`);
        }
        patch.status = value as Order["status"];
        break;
      case "hours":
      case "sas_gross":
      case "disposal_net":
        patch[field] = numberOrNull(value);
        break;
      case "work_date": {
        const text = textOrNull(value);
        if (text && !/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error("Ungültiges Datum.");
        patch.work_date = text;
        break;
      }
      case "object_address":
        patch.object_address = textOrNull(value) ?? "";
        break;
      default:
        patch[field] = textOrNull(value);
    }
  }
  return patch;
}
