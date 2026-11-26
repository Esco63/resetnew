"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";

const inputClass =
  "rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-600";

export default function NeuerAuftragPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        object_address: form.get("object_address"),
        task: form.get("task"),
        recipient_email: form.get("recipient_email"),
      }),
    });
    const data = (await res.json()) as { id?: string; error?: string };
    if (!res.ok || !data.id) {
      setError(data.error || "Auftrag konnte nicht angelegt werden.");
      setSaving(false);
      return;
    }
    router.replace(`/admin/auftraege/${data.id}`);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <AdminHeader />
      <div className="mx-auto max-w-xl px-4 py-6 md:px-8">
        <h1 className="text-3xl font-black tracking-tight">Neuer Auftrag</h1>
        <p className="mt-1 text-slate-600">
          Für Aufträge, die nicht automatisch per Mail kommen. Die Auftragsmail kannst du im
          nächsten Schritt als PDF anhängen.
        </p>

        <form onSubmit={submit} className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Objekt / Adresse
            <input
              name="object_address"
              required
              placeholder="19063 Schwerin, Kantstraße 38, Müllplatz"
              className={inputClass}
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Auftrag
            <input name="task" defaultValue="Beräumung des Sperrmülls" className={inputClass} />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            Rechnung per Mail an
            <input
              name="recipient_email"
              type="email"
              defaultValue="s.wagner@nbc-hv.de"
              className={inputClass}
            />
          </label>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-orange-600 px-4 py-3 font-semibold text-white shadow hover:bg-orange-700 disabled:opacity-60"
          >
            {saving ? "Lege an…" : "Auftrag anlegen"}
          </button>
        </form>
      </div>
    </main>
  );
}
