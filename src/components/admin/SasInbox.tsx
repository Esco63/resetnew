"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Link2Off, Loader2, RotateCw, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/cn";
import { prepareUploadFile, uploadWithTicket } from "@/lib/orders/client-upload";
import { disposalNetFromSasGross, formatEuro } from "@/lib/orders/invoice";
import type { SasReceipt } from "@/lib/orders/sas";
import type { Order } from "@/lib/orders/types";

const dateLabel = (value: string | null) =>
  value ? new Date(`${value.slice(0, 10)}T12:00:00`).toLocaleDateString("de-DE") : "–";
const DAY = 86_400_000;

/** Aufträge für einen Beleg sortieren: gleiches Einsatzdatum zuerst, dann jüngste Auftragsmail vor dem Belegdatum. */
function rankOrders(orders: Order[], receipt: SasReceipt, takenOrderIds: Set<string>) {
  const receiptDay = receipt.receipt_date ? new Date(`${receipt.receipt_date}T23:59:59`).getTime() : null;
  return orders
    .filter((order) => !takenOrderIds.has(order.id))
    .map((order) => {
      const orderDay = new Date(order.mail_received_at ?? order.created_at).getTime();
      let score = 10_000;
      if (receipt.receipt_date && order.work_date === receipt.receipt_date) score = 0;
      else if (receiptDay !== null && orderDay <= receiptDay) score = 1 + (receiptDay - orderDay) / DAY;
      else if (receiptDay !== null) score = 5_000 + (orderDay - receiptDay) / DAY;
      return { order, score };
    })
    .sort((a, b) => a.score - b.score)
    .map(({ order }) => order);
}

type UploadState = { name: string; state: "upload" | "read" | "fertig" | "fehler"; error?: string };

export function SasInbox() {
  const [receipts, setReceipts] = useState<SasReceipt[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [canRead, setCanRead] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rowError, setRowError] = useState<Record<string, string>>({});
  const [choice, setChoice] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/sas", { cache: "no-store" });
    const data = (await res.json()) as { receipts?: SasReceipt[]; orders?: Order[]; canRead?: boolean; error?: string };
    if (!res.ok) {
      setLoadError(data.error || "Belege konnten nicht geladen werden.");
    } else {
      setReceipts(data.receipts ?? []);
      setOrders(data.orders ?? []);
      setCanRead(data.canRead ?? false);
      setLoadError("");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function action(id: string, body: Record<string, unknown>) {
    setBusyId(id);
    setRowError((current) => ({ ...current, [id]: "" }));
    try {
      const res = await fetch(`/api/admin/sas/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Aktion fehlgeschlagen.");
      await load();
    } catch (error) {
      setRowError((current) => ({ ...current, [id]: (error as Error).message }));
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Beleg wirklich löschen?")) return;
    setBusyId(id);
    const res = await fetch(`/api/admin/sas/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setRowError((current) => ({ ...current, [id]: data.error || "Löschen fehlgeschlagen." }));
    }
    setBusyId(null);
    await load();
  }

  async function uploadFiles(files: File[]) {
    setUploads(files.map((file) => ({ name: file.name, state: "upload" })));
    const update = (index: number, next: Partial<UploadState>) =>
      setUploads((current) => current.map((item, i) => (i === index ? { ...item, ...next } : item)));

    for (const [index, original] of files.entries()) {
      try {
        const file = await prepareUploadFile(original);
        const ticketRes = await fetch("/api/admin/sas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contentType: file.type }),
        });
        const ticket = (await ticketRes.json()) as { id?: string; path?: string; token?: string; error?: string };
        if (!ticketRes.ok || !ticket.id || !ticket.path || !ticket.token) {
          throw new Error(ticket.error || "Upload nicht möglich.");
        }
        await uploadWithTicket(file, { path: ticket.path, token: ticket.token });

        update(index, { state: "read" });
        const readRes = await fetch(`/api/admin/sas/${ticket.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "read" }),
        });
        const read = (await readRes.json()) as { error?: string };
        if (!readRes.ok) throw new Error(read.error || "Beleg konnte nicht gelesen werden.");
        update(index, { state: "fertig" });
      } catch (error) {
        update(index, { state: "fehler", error: (error as Error).message });
      }
      await load();
    }
  }

  const takenByReceipt = useMemo(
    () => new Set(receipts.filter((r) => r.order_id).map((r) => r.order_id!)),
    [receipts]
  );
  const ordersWithForeignReceipt = useMemo(
    () =>
      new Set(
        orders
          .filter((o) => o.sas_receipt_path && !receipts.some((r) => r.file_path === o.sas_receipt_path))
          .map((o) => o.id)
      ),
    [orders, receipts]
  );
  const open = receipts.filter((r) => r.status !== "zugeordnet");
  const done = receipts.filter((r) => r.status === "zugeordnet");
  const orderById = new Map(orders.map((o) => [o.id, o]));

  return (
    <div className="mx-auto grid max-w-3xl gap-5 px-4 py-6 md:px-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">SAS-Belege</h1>
        <p className="mt-1 text-slate-600">
          Belege hochladen – Datum, Belegnummer und Betrag werden automatisch gelesen. Danach den
          passenden Auftrag wählen.
        </p>
      </div>

      {!canRead && !loading && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Das automatische Auslesen ist noch nicht eingerichtet (ANTHROPIC_API_KEY fehlt in Vercel).
          Hochladen und Zuordnen geht trotzdem.
        </p>
      )}

      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white px-4 py-8 text-center hover:border-orange-500">
        <Upload size={28} className="text-orange-600" aria-hidden="true" />
        <span className="font-semibold">Belege hochladen</span>
        <span className="text-sm text-slate-500">PDF, Foto oder Scan – auch mehrere auf einmal</span>
        <input
          type="file"
          multiple
          accept="application/pdf,image/*"
          className="sr-only"
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            event.target.value = "";
            if (files.length) void uploadFiles(files);
          }}
        />
      </label>

      {uploads.length > 0 && (
        <ul className="grid gap-1 rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-sm">
          {uploads.map((item, index) => (
            <li key={`${item.name}-${index}`} className="flex items-center gap-2">
              {item.state === "fertig" ? (
                <CheckCircle2 size={16} className="text-emerald-600" aria-hidden="true" />
              ) : item.state === "fehler" ? (
                <AlertTriangle size={16} className="text-red-600" aria-hidden="true" />
              ) : (
                <Loader2 size={16} className="animate-spin text-slate-500" aria-hidden="true" />
              )}
              <span className="truncate">{item.name}</span>
              <span className="ml-auto shrink-0 text-slate-500">
                {item.state === "upload" && "lädt hoch…"}
                {item.state === "read" && "wird gelesen…"}
                {item.state === "fertig" && "fertig"}
                {item.state === "fehler" && <span className="text-red-700">{item.error}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}

      {loadError && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{loadError}</p>
      )}
      {loading && <p className="text-sm text-slate-500">Lade Belege…</p>}

      <section>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">
          Noch zuzuordnen <span className="text-slate-400">({open.length})</span>
        </h2>
        <div className="grid gap-3">
          {!loading && open.length === 0 && (
            <p className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
              Alle Belege sind zugeordnet.
            </p>
          )}
          {open.map((receipt) => {
            const candidates = rankOrders(orders, receipt, new Set([...takenByReceipt, ...ordersWithForeignReceipt]));
            const selected = choice[receipt.id] ?? candidates[0]?.id ?? "";
            const busy = busyId === receipt.id;
            return (
              <article key={receipt.id} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-lg font-black">{dateLabel(receipt.receipt_date)}</span>
                  {receipt.receipt_time && <span className="text-slate-500">{receipt.receipt_time} Uhr</span>}
                  {receipt.receipt_number && <span className="text-slate-500">Beleg {receipt.receipt_number}</span>}
                  <span className="ml-auto font-semibold">
                    {receipt.gross !== null ? formatEuro(Number(receipt.gross)) : "Betrag ?"}
                  </span>
                </div>
                {receipt.gross !== null && (
                  <p className="-mt-2 text-sm text-slate-500">
                    → Entsorgung auf der Rechnung: {formatEuro(disposalNetFromSasGross(Number(receipt.gross)))} netto
                  </p>
                )}
                {(receipt.error || rowError[receipt.id]) && (
                  <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
                    {rowError[receipt.id] || receipt.error}
                  </p>
                )}
                <div className="flex flex-col gap-2 sm:flex-row">
                  <select
                    value={selected}
                    onChange={(event) => setChoice((current) => ({ ...current, [receipt.id]: event.target.value }))}
                    className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-base"
                  >
                    {candidates.length === 0 && <option value="">Kein offener Auftrag</option>}
                    {candidates.map((order) => (
                      <option key={order.id} value={order.id}>
                        {order.object_address || "Ohne Adresse"} · Mail{" "}
                        {dateLabel(order.mail_received_at ?? order.created_at)}
                        {order.work_date ? ` · Einsatz ${dateLabel(order.work_date)}` : ""}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={!selected || busy}
                    onClick={() => void action(receipt.id, { action: "assign", orderId: selected })}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-orange-600 px-4 py-2 font-semibold text-white shadow hover:bg-orange-700 disabled:opacity-50"
                  >
                    {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <CheckCircle2 size={16} aria-hidden="true" />}
                    Zuordnen
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  <a
                    href={`/api/admin/sas/${receipt.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-slate-300 px-3 py-1 font-semibold hover:bg-slate-100"
                  >
                    Beleg ansehen
                  </a>
                  {canRead && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void action(receipt.id, { action: "read" })}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 font-semibold hover:bg-slate-100"
                    >
                      <RotateCw size={14} aria-hidden="true" /> Neu lesen
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void remove(receipt.id)}
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={14} aria-hidden="true" /> Löschen
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {done.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">
            Zugeordnet <span className="text-slate-400">({done.length})</span>
          </h2>
          <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {done.map((receipt) => {
              const order = receipt.order_id ? orderById.get(receipt.order_id) : undefined;
              return (
                <li key={receipt.id} className="flex flex-wrap items-center gap-2 px-4 py-3 text-sm">
                  <span className="font-semibold">{dateLabel(receipt.receipt_date)}</span>
                  <span className="text-slate-500">
                    {receipt.gross !== null ? formatEuro(Number(receipt.gross)) : ""}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    →{" "}
                    {receipt.order_id ? (
                      <Link href={`/admin/auftraege/${receipt.order_id}`} className="font-semibold text-orange-700 hover:underline">
                        {order?.object_address || "Auftrag öffnen"}
                      </Link>
                    ) : null}
                  </span>
                  {(!order || order.status !== "gesendet") && (
                    <button
                      type="button"
                      disabled={busyId === receipt.id}
                      onClick={() => void action(receipt.id, { action: "unassign" })}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-1 font-semibold text-slate-600 hover:bg-slate-100"
                      )}
                    >
                      <Link2Off size={14} aria-hidden="true" /> Lösen
                    </button>
                  )}
                  {rowError[receipt.id] && <span className="w-full text-red-700">{rowError[receipt.id]}</span>}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
