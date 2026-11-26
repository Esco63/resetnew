"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { LockKeyhole } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error || "Login fehlgeschlagen.");
      setLoading(false);
      return;
    }

    const nextUrl = new URL(window.location.href).searchParams.get("next");
    router.replace(nextUrl || "/admin/auftraege");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-slate-900">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-orange-600 text-white">
            <LockKeyhole size={22} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Admin Login</h1>
            <p className="text-sm text-slate-600">Preise und Inhalte verwalten</p>
          </div>
        </div>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          E-Mail
          <input
            name="email"
            type="email"
            autoComplete="username"
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-600"
          />
        </label>

        <label className="mt-4 grid gap-1 text-sm font-medium text-slate-700">
          Passwort
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-600"
          />
        </label>

        {error && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-orange-600 px-5 py-2.5 font-semibold text-white shadow hover:bg-orange-700 disabled:opacity-60"
        >
          {loading ? "Wird geprüft..." : "Einloggen"}
        </button>
      </form>
    </main>
  );
}
