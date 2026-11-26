"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { RotateCcw, Save, Settings } from "lucide-react";
import { useState } from "react";
import {
  type CalculatorPricingConfig,
  type PricingPlan,
} from "@/lib/pricing";
import { usePricingSettings } from "@/lib/usePricingSettings";

function numberValue(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function Field({
  label,
  value,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-1 text-sm font-medium text-slate-700">
      {label}
      <input
        type="number"
        min={0}
        step={step}
        value={value}
        onChange={(event) => onChange(numberValue(event.target.value))}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-600"
      />
    </label>
  );
}

export default function AdminPreisePage() {
  const { settings, setSettings, resetSettings } = usePricingSettings();
  const router = useRouter();
  const [mailStatus, setMailStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [mailError, setMailError] = useState("");

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  async function sendTestMail() {
    setMailStatus("loading");
    setMailError("");

    const res = await fetch("/api/admin/mail-test", { method: "POST" });
    if (res.ok) {
      setMailStatus("success");
      return;
    }

    const data = (await res.json()) as { error?: string };
    setMailError(data.error || "Testmail konnte nicht gesendet werden.");
    setMailStatus("error");
  }

  function updatePlan(index: number, next: Partial<PricingPlan>) {
    const homepagePlans = settings.homepagePlans.map((plan, planIndex) =>
      planIndex === index ? { ...plan, ...next } : plan
    );
    setSettings({ ...settings, homepagePlans });
  }

  function updateCalculator<K extends keyof CalculatorPricingConfig>(
    group: K,
    next: Partial<CalculatorPricingConfig[K]>
  ) {
    setSettings({
      ...settings,
      calculator: {
        ...settings.calculator,
        [group]: { ...settings.calculator[group], ...next },
      },
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
              <Settings size={16} aria-hidden="true" /> Admin
            </div>
            <h1 className="mt-1 text-3xl font-black tracking-tight md:text-4xl">
              Preiseinstellungen
            </h1>
            <p className="mt-1 text-slate-600">
              Lokale Verwaltung für Startseite und Preisrechner. Später kann diese
              Struktur direkt an Supabase angebunden werden.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={sendTestMail}
              disabled={mailStatus === "loading"}
              className="rounded-full border border-emerald-200 bg-white px-4 py-2 font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
            >
              {mailStatus === "loading" ? "Sende..." : "Testmail senden"}
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 font-semibold hover:bg-slate-100"
            >
              Logout
            </button>
            <Link
              href="/admin/auftraege"
              className="rounded-full bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700"
            >
              Aufträge
            </Link>
            <Link
              href="/"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 font-semibold hover:bg-slate-100"
            >
              Startseite ansehen
            </Link>
            <Link
              href="/preise"
              className="rounded-full bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800"
            >
              Preise ansehen
            </Link>
          </div>
        </div>
        {mailStatus === "success" && (
          <div className="mx-auto max-w-7xl px-4 pb-4 md:px-8">
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
              Testmail wurde versendet.
            </p>
          </div>
        )}
        {mailStatus === "error" && (
          <div className="mx-auto max-w-7xl px-4 pb-4 md:px-8">
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {mailError}
            </p>
          </div>
        )}
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:px-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Startseite</h2>
              <p className="text-sm text-slate-600">
                Diese Pakete erscheinen im Bereich Beispielpreise auf der Hauptseite.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings })}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-4 py-2 font-semibold text-white shadow hover:bg-orange-700"
            >
              <Save size={16} aria-hidden="true" /> Gespeichert
            </button>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {settings.homepagePlans.map((plan, index) => (
              <article key={plan.name} className="rounded-xl border border-slate-200 p-4">
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  Paketname
                  <input
                    value={plan.name}
                    onChange={(event) => updatePlan(index, { name: event.target.value })}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-base"
                  />
                </label>
                <div className="mt-3">
                  <Field
                    label="Preis ab"
                    value={plan.priceFrom ?? 0}
                    onChange={(priceFrom) => updatePlan(index, { priceFrom })}
                  />
                </div>
                <label className="mt-3 grid gap-1 text-sm font-medium text-slate-700">
                  Punkte, je Zeile ein Eintrag
                  <textarea
                    value={plan.points.join("\n")}
                    rows={4}
                    onChange={(event) =>
                      updatePlan(index, {
                        points: event.target.value
                          .split("\n")
                          .map((line) => line.trim())
                          .filter(Boolean),
                      })
                    }
                    className="rounded-lg border border-slate-300 px-3 py-2 text-base"
                  />
                </label>
                <label className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={Boolean(plan.featured)}
                    onChange={(event) => updatePlan(index, { featured: event.target.checked })}
                  />
                  Als beliebt markieren
                </label>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-2xl font-black tracking-tight">Preisrechner</h2>
          <p className="text-sm text-slate-600">
            Diese Werte steuern die Berechnung auf der Seite Preise.
          </p>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <article className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-bold">Haushaltsauflösung</h3>
              <div className="mt-3 grid gap-3">
                <Field
                  label="Euro pro m²"
                  value={settings.calculator.haushalt.basePerSqm}
                  onChange={(basePerSqm) => updateCalculator("haushalt", { basePerSqm })}
                />
                <Field
                  label="Zuschlag % pro Etage"
                  value={settings.calculator.haushalt.floorSurchargePctPerLevel}
                  onChange={(floorSurchargePctPerLevel) =>
                    updateCalculator("haushalt", { floorSurchargePctPerLevel })
                  }
                />
                <Field
                  label="Mindestpreis"
                  value={settings.calculator.haushalt.minPrice}
                  onChange={(minPrice) => updateCalculator("haushalt", { minPrice })}
                />
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-bold">Entrümpelung</h3>
              <div className="mt-3 grid gap-3">
                <Field
                  label="Euro pro m²"
                  value={settings.calculator.entrumpelung.basePerSqm}
                  onChange={(basePerSqm) => updateCalculator("entrumpelung", { basePerSqm })}
                />
                <Field
                  label="Zuschlag % pro Etage"
                  value={settings.calculator.entrumpelung.floorSurchargePctPerLevel}
                  onChange={(floorSurchargePctPerLevel) =>
                    updateCalculator("entrumpelung", { floorSurchargePctPerLevel })
                  }
                />
                <Field
                  label="Mindestpreis"
                  value={settings.calculator.entrumpelung.minPrice}
                  onChange={(minPrice) => updateCalculator("entrumpelung", { minPrice })}
                />
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-bold">Transporte mit Fahrer</h3>
              <div className="mt-3 grid gap-3">
                <Field
                  label="Pauschale Schwerin"
                  value={settings.calculator.transporte.baseCityOnePickup}
                  onChange={(baseCityOnePickup) =>
                    updateCalculator("transporte", { baseCityOnePickup })
                  }
                />
                <Field
                  label="Stundensatz ab 2. Std"
                  value={settings.calculator.transporte.hourlyRate}
                  onChange={(hourlyRate) => updateCalculator("transporte", { hourlyRate })}
                />
                <Field
                  label="Euro pro km außerhalb"
                  step={0.1}
                  value={settings.calculator.transporte.kmRate}
                  onChange={(kmRate) => updateCalculator("transporte", { kmRate })}
                />
                <Field
                  label="Anhänger-Zuschlag"
                  value={settings.calculator.transporte.trailerExtra}
                  onChange={(trailerExtra) => updateCalculator("transporte", { trailerExtra })}
                />
              </div>
            </article>
          </div>
        </section>

        <div className="flex flex-wrap justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="max-w-2xl text-sm text-slate-600">
            Aktuell werden die Werte im Browser gespeichert. Sobald Supabase angebunden ist,
            ersetzen wir diesen lokalen Speicher durch Tabellen und geschützte Admin-Logins.
          </p>
          <button
            type="button"
            onClick={resetSettings}
            className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 font-semibold text-red-700 hover:bg-red-50"
          >
            <RotateCcw size={16} aria-hidden="true" /> Standardwerte wiederherstellen
          </button>
        </div>
      </div>
    </main>
  );
}
