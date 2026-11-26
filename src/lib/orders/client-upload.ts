"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { ORDERS_BUCKET } from "./types";

const MAX_EDGE = 2200;
const MAX_BYTES = 3.5 * 1024 * 1024;

/**
 * Verkleinert große Fotos vor dem Upload (JPEG, max. 2200 px Kantenlänge),
 * damit sie schnell hochladen und von Claude gelesen werden können.
 * PDFs und kleine Bilder bleiben unverändert.
 */
export async function prepareUploadFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  const alreadyOk = ["image/jpeg", "image/png", "image/webp"].includes(file.type) && file.size <= MAX_BYTES;
  if (alreadyOk) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

/** Lädt eine Datei mit einem signierten Upload-Ticket direkt zu Supabase hoch. */
export async function uploadWithTicket(file: File, ticket: { path: string; token: string }) {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error("Supabase ist nicht konfiguriert.");
  const { error } = await supabase.storage
    .from(ORDERS_BUCKET)
    .uploadToSignedUrl(ticket.path, ticket.token, file, { contentType: file.type });
  if (error) throw new Error(error.message);
}
