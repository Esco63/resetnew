"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { cn } from "@/lib/cn";

type ImportResponse = {
  checked?: number;
  created?: { id: string; object_address: string }[];
  skipped?: number;
  errors?: string[];
  error?: string;
};

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 86_400_000).toLocaleDateString("sv-SE", { timeZone: "Europe/Berlin" });

export function MailImportButton() {
  const router = useRouter();
  const [since, setSince] = useState(() => daysAgo(3));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  async function run() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/orders/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ since }),
      });
      const data = (await res.json()) as ImportResponse;
      if (!res.ok) throw new Error(data.error || "Abruf fehlgeschlagen.");

      const created = data.created ?? [];
      const parts = [
        created.length === 0
          ? "Keine neuen Aufträge."
          : `${created.length} neue${created.length === 1 ? "r" : ""} Auftrag${created.length === 1 ? "" : "e"}: ${created
              .map((order) => order.object_address || "ohne Adresse")
              .join("; ")}`,
        `${data.checked ?? 0} NBC-Mails geprüft.`,
      ];
      if (data.errors?.length) parts.push(`Probleme: ${data.errors.join(" | ")}`);
      setMessage({ type: data.errors?.length ? "error" : "ok", text: parts.join(" ") });
      if (created.length) router.refresh();
    } catch (error) {
      setMessage({ type: "error", text: (error as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-end gap-2">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          NBC-Mails abrufen ab
          <input
            type="date"
            value={since}
            max={daysAgo(0)}
            onChange={(event) => setSince(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-base"
          />
        </label>
        <button
          type="button"
          onClick={run}
          disabled={busy || !since}
          className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2.5 font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <MailCheck size={16} aria-hidden="true" />}
          {busy ? "Rufe ab…" : "Mails abrufen"}
        </button>
      </div>
      {message && (
        <p
          className={cn(
            "rounded-xl border px-3 py-2 text-sm",
            message.type === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-amber-200 bg-amber-50 text-amber-900"
          )}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
