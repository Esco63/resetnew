"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, FileText, Loader2, Send, Upload } from "lucide-react";
import { fileHash, prepareUploadFile, uploadWithTicket } from "@/lib/orders/client-upload";
import { FilePreview } from "./FilePreview";
import {
  buildInvoicePreview,
  disposalNetFromSasGross,
  formatEuro,
} from "@/lib/orders/invoice";
import { ORDER_STATUS_LABELS, type Order, type OrderFileKind } from "@/lib/orders/types";
import { cn } from "@/lib/cn";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-600 disabled:bg-slate-100";

const dateTimeFormat = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

type Draft = {
  object_address: string;
  task: string;
  recipient_email: string;
  work_date: string;
  hours: string;
  sas_gross: string;
  disposal_net: string;
  notes: string;
};

const toInput = (value: number | string | null | undefined) =>
  value === null || value === undefined ? "" : String(value).replace(".", ",");
const parseInput = (value: string) => {
  const parsed = Number(value.trim().replace(",", "."));
  return value.trim() === "" || !Number.isFinite(parsed) ? null : parsed;
};
const today = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Berlin" });

function draftFrom(order: Order): Draft {
  return {
    object_address: order.object_address,
    task: order.task ?? "",
    recipient_email: order.recipient_email ?? "",
    work_date: order.work_date ?? today(),
    hours: toInput(order.hours),
    sas_gross: toInput(order.sas_gross),
    disposal_net: toInput(order.disposal_net),
    notes: order.notes ?? "",
  };
}

function FileSlot({
  order,
  kind,
  label,
  locked,
  onUploaded,
}: {
  order: Order;
  kind: Extract<OrderFileKind, "auftragsmail" | "sas">;
  label: string;
  locked: boolean;
  onUploaded: (order: Order) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const path = kind === "auftragsmail" ? order.order_mail_path : order.sas_receipt_path;

  async function upload(original: File) {
    setBusy(true);
    setError("");
    try {
      const hash = kind === "sas" ? await fileHash(original) : undefined;
      const file = await prepareUploadFile(original);
      const contentType = file.type || "application/octet-stream";
      const ticketRes = await fetch(`/api/admin/orders/${order.id}/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, contentType, hash }),
      });
      const ticket = (await ticketRes.json()) as { path?: string; token?: string; error?: string };
      if (!ticketRes.ok || !ticket.path || !ticket.token) {
        throw new Error(ticket.error || "Upload nicht möglich.");
      }

      await uploadWithTicket(file, { path: ticket.path, token: ticket.token });

      const confirmRes = await fetch(`/api/admin/orders/${order.id}/files`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, path: ticket.path, hash }),
      });
      const confirmed = (await confirmRes.json()) as { order?: Order; error?: string; readError?: string | null };
      if (!confirmRes.ok || !confirmed.order) throw new Error(confirmed.error || "Upload fehlgeschlagen.");
      onUploaded(confirmed.order);
      if (confirmed.readError) setError(confirmed.readError);
    } catch (uploadError) {
      setError((uploadError as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <div className="flex items-center gap-3">
        <FileText size={20} className={path ? "text-emerald-600" : "text-slate-400"} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{label}</p>
          <p className="text-sm text-slate-500">{path ? "Vorhanden" : "Fehlt noch"}</p>
        </div>
        {path && (
          <a
            href={`/api/admin/orders/${order.id}/files?kind=${kind}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold hover:bg-slate-100"
          >
            Ansehen
          </a>
        )}
        {!locked && (
          <label
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold",
              path ? "border border-slate-300 hover:bg-slate-100" : "bg-slate-900 text-white hover:bg-slate-800",
              busy && "pointer-events-none opacity-60"
            )}
          >
            {busy ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <Upload size={15} aria-hidden="true" />}
            {path ? "Ersetzen" : "Hochladen"}
            <input
              type="file"
              accept="application/pdf,image/*"
              className="sr-only"
              disabled={busy}
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) void upload(file);
              }}
            />
          </label>
        )}
      </div>
      {error && <p className="mt-2 text-sm font-medium text-red-700">{error}</p>}
      {path && (
        <FilePreview
          key={path}
          src={`/api/admin/orders/${order.id}/files?kind=${kind}&v=${encodeURIComponent(path)}`}
          path={path}
          className="mt-3 h-56"
        />
      )}
    </div>
  );
}

export function OrderEditor({ initialOrder }: { initialOrder: Order }) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [draft, setDraft] = useState(() => draftFrom(initialOrder));
  const [disposalTouched, setDisposalTouched] = useState(
    initialOrder.disposal_net !== null &&
      initialOrder.sas_gross !== null &&
      initialOrder.disposal_net !== disposalNetFromSasGross(initialOrder.sas_gross)
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const locked = order.status === "gesendet";
  const preview = useMemo(
    () =>
      buildInvoicePreview({
        object_address: draft.object_address,
        work_date: draft.work_date || null,
        hours: parseInput(draft.hours),
        disposal_net: parseInput(draft.disposal_net),
      }),
    [draft]
  );
  const missing = [...preview.missing, ...(order.sas_receipt_path ? [] : ["SAS-Beleg"])];

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => {
      const next = { ...current, [key]: value };
      if (key === "sas_gross" && !disposalTouched) {
        const gross = parseInput(value);
        next.disposal_net = gross === null ? "" : toInput(disposalNetFromSasGross(gross));
      }
      return next;
    });
    setMessage(null);
  }

  async function save(status?: Order["status"]) {
    setSaving(true);
    setMessage(null);
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        object_address: draft.object_address,
        task: draft.task,
        recipient_email: draft.recipient_email,
        work_date: draft.work_date,
        hours: parseInput(draft.hours),
        sas_gross: parseInput(draft.sas_gross),
        disposal_net: parseInput(draft.disposal_net),
        notes: draft.notes,
        ...(status ? { status } : {}),
      }),
    });
    const data = (await res.json()) as { order?: Order; error?: string };
    setSaving(false);
    if (!res.ok || !data.order) {
      setMessage({ type: "error", text: data.error || "Speichern fehlgeschlagen." });
      return;
    }
    setOrder(data.order);
    setDraft(draftFrom(data.order));
    setMessage({ type: "ok", text: status === "erledigt" ? "Als erledigt markiert." : "Gespeichert." });
    router.refresh();
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-5 px-4 py-6 md:px-8">
      <div>
        <Link href="/admin/auftraege" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-slate-900">
          <ArrowLeft size={15} aria-hidden="true" /> Alle Aufträge
        </Link>
        <h1 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">
          {order.object_address || "Auftrag ohne Adresse"}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-bold text-white">
            {ORDER_STATUS_LABELS[order.status]}
          </span>
          {order.mail_received_at && (
            <> · Mail von {order.mail_from} am {dateTimeFormat.format(new Date(order.mail_received_at))}</>
          )}
          {order.invoice_number && <> · Rechnung {order.invoice_number}</>}
        </p>
      </div>

      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <h2 className="text-lg font-black">Auftrag</h2>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Objekt / Adresse (steht so auf der Rechnung)
          <input value={draft.object_address} disabled={locked} onChange={(e) => update("object_address", e.target.value)} className={inputClass} />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Auftrag
          <input value={draft.task} disabled={locked} onChange={(e) => update("task", e.target.value)} className={inputClass} />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Rechnung per Mail an
          <input type="email" value={draft.recipient_email} disabled={locked} onChange={(e) => update("recipient_email", e.target.value)} className={inputClass} />
        </label>
        <FileSlot order={order} kind="auftragsmail" label="Auftragsmail (PDF)" locked={locked} onUploaded={setOrder} />
      </section>

      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <h2 className="text-lg font-black">Erledigt</h2>
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Einsatzdatum
            <input type="date" value={draft.work_date} disabled={locked} onChange={(e) => update("work_date", e.target.value)} className={inputClass} />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Stunden
            <input inputMode="decimal" placeholder="z. B. 3,5" value={draft.hours} disabled={locked} onChange={(e) => update("hours", e.target.value)} className={inputClass} />
          </label>
        </div>
        <FileSlot
          order={order}
          kind="sas"
          label="SAS-Beleg"
          locked={locked}
          onUploaded={(updated) => {
            setOrder(updated);
            // Vom Beleg gelesene Werte übernehmen, übrige Eingaben behalten
            setDraft((current) => ({
              ...current,
              work_date: updated.work_date ?? current.work_date,
              sas_gross: updated.sas_gross !== null ? toInput(updated.sas_gross) : current.sas_gross,
              disposal_net: updated.disposal_net !== null ? toInput(updated.disposal_net) : current.disposal_net,
            }));
            if (updated.disposal_net !== null) setDisposalTouched(false);
          }}
        />
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            SAS gesamt (brutto)
            <input inputMode="decimal" placeholder="z. B. 59,20" value={draft.sas_gross} disabled={locked} onChange={(e) => update("sas_gross", e.target.value)} className={inputClass} />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Entsorgung netto
            <input
              inputMode="decimal"
              value={draft.disposal_net}
              disabled={locked}
              onChange={(e) => {
                setDisposalTouched(true);
                update("disposal_net", e.target.value);
              }}
              className={inputClass}
            />
          </label>
        </div>
        <p className="text-xs text-slate-500">
          Entsorgung netto = SAS-Bruttobetrag auf volle Euro aufgerundet. Du kannst den Wert überschreiben.
        </p>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          Notiz (nur intern)
          <textarea rows={2} value={draft.notes} disabled={locked} onChange={(e) => update("notes", e.target.value)} className={inputClass} />
        </label>
      </section>

      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <h2 className="text-lg font-black">Rechnungsvorschau</h2>
        <p className="text-sm text-slate-600">
          An: Schwerin Resi GmbH c/o NBC Service &amp; Hausverwaltung GmbH, Stralsunder Straße 2, 19063 Schwerin
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="py-2 pr-2 font-semibold">Bezeichnung</th>
                <th className="py-2 pr-2 text-right font-semibold">Menge</th>
                <th className="py-2 pr-2 text-right font-semibold">Einzel</th>
                <th className="py-2 text-right font-semibold">Gesamt</th>
              </tr>
            </thead>
            <tbody>
              {preview.lines.map((line) => (
                <tr key={line.name} className="border-b border-slate-100 align-top">
                  <td className="py-2 pr-2">
                    <span className="font-semibold">{line.name}</span>
                    {line.description && <span className="block text-slate-500">{line.description}</span>}
                  </td>
                  <td className="whitespace-nowrap py-2 pr-2 text-right">
                    {toInput(line.quantity)} {line.unitName}
                  </td>
                  <td className="whitespace-nowrap py-2 pr-2 text-right">{formatEuro(line.unitPriceNet)}</td>
                  <td className="whitespace-nowrap py-2 text-right">{formatEuro(line.amountNet)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="pt-2 text-right text-slate-600">Netto</td>
                <td className="pt-2 text-right">{formatEuro(preview.totalNet)}</td>
              </tr>
              <tr>
                <td colSpan={3} className="text-right text-slate-600">Umsatzsteuer 19 %</td>
                <td className="text-right">{formatEuro(preview.totalTax)}</td>
              </tr>
              <tr>
                <td colSpan={3} className="pt-1 text-right font-black">Gesamt</td>
                <td className="pt-1 text-right font-black">{formatEuro(preview.totalGross)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        {draft.work_date && (
          <p className="text-sm text-slate-600">
            Leistungsdatum: {new Date(`${draft.work_date}T12:00:00`).toLocaleDateString("de-DE")} · Zahlungsziel 14 Tage
          </p>
        )}
        {missing.length > 0 && !locked && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Fehlt noch: {missing.join(", ")}
          </p>
        )}
      </section>

      {message && (
        <p
          className={cn(
            "rounded-xl border px-4 py-3 text-sm font-medium",
            message.type === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          )}
        >
          {message.text}
        </p>
      )}

      {!locked && (
        <div className="sticky bottom-0 -mx-4 grid gap-2 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:mx-0 sm:flex sm:rounded-2xl sm:border">
          <button
            type="button"
            onClick={() => save()}
            disabled={saving}
            className="rounded-full border border-slate-300 px-4 py-2.5 font-semibold hover:bg-slate-100 disabled:opacity-60"
          >
            {saving ? "Speichere…" : "Speichern"}
          </button>
          {order.status === "neu" && (
            <button
              type="button"
              onClick={() => save("erledigt")}
              disabled={saving || missing.length > 0}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-orange-600 px-4 py-2.5 font-semibold text-white shadow hover:bg-orange-700 disabled:opacity-50"
            >
              <CheckCircle2 size={17} aria-hidden="true" /> Als erledigt markieren
            </button>
          )}
          {order.status === "erledigt" && (
            <button
              type="button"
              disabled
              title="Kommt im nächsten Ausbauschritt (Lexware + Mailversand)"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-900 px-4 py-2.5 font-semibold text-white opacity-50"
            >
              <Send size={17} aria-hidden="true" /> Rechnung erstellen &amp; senden (bald)
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Auftrag wirklich stornieren?")) void save("storniert");
            }}
            disabled={saving}
            className="rounded-full px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 sm:ml-auto"
          >
            Stornieren
          </button>
        </div>
      )}
    </div>
  );
}
