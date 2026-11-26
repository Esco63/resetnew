"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import {
  ArrowRight,
  Mail,
  MessageCircle,
  Phone,
  MapPin,
  Menu,
  X,
} from "lucide-react";
import StickyBar from "@/components/layout/StickyBar";
import { DEFAULT_PRICING_SETTINGS, type CalculatorPricingConfig } from "@/lib/pricing";
import { usePricingSettings } from "@/lib/usePricingSettings";

/**
 * Preise - reset. Schwerin
 * ----------------------------------------------
 * - Preise zentral oben in PRICING_CONFIG anpassbar
 * - Navbar/Topbar/Footer wie auf der UltraLanding-Seite
 * - 1. Transport-Stunde inklusive
 * - Admin-Panel zum Live-Feintuning
 * - Karten-spezifische Anfrage (Mail/WA) - nur die gewählte Leistung
 * - Transport: Schüttgut (Sand/Erde) -> Plane Pflicht bei Anhänger
 */

// ===== 1) BUSINESS + PRICING =====
const BUSINESS = {
  name: "reset. Schwerin",
  phoneHuman: "0176 / 72190267",
  // Für tel: E.164
  phoneLink: "+4917672190267",
  whatsappLink:
    "https://wa.me/4917672190267?text=Hallo%20reset.%20Anfrage%20aus%20Schwerin",
  email: "info@reset-service.de",
  address: {
    street: "Wuppertaler Str. 34",
    zip: "19063",
    city: "Schwerin",
  },
} as const;

// ===== 2) UI-Helper =====
const A: React.FC<
  React.ComponentPropsWithoutRef<"a"> & { variant?: "link" | "unstyled" }
> = ({ variant = "unstyled", className = "", ...rest }) => (
  <a
    {...rest}
    className={`${variant === "link" ? "hover:text-orange-600" : ""} focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 transition-colors ${className}`}
  />
);

const toMoney = (n: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(Math.round(n));
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, Number.isFinite(n) ? n : min));

// ===== 3) NAVIGATION (wie UltraLanding) =====
function TopBar() {
  return (
    <div className="hidden md:block bg-slate-900 text-white text-sm">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <MapPin size={16} aria-hidden />
            Schwerin & Umgebung
          </span>
          <A href={`mailto:${BUSINESS.email}`} variant="link" className="flex items-center gap-1 hover:underline">
            <Mail size={16} aria-hidden /> {BUSINESS.email}
          </A>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          <A
            href={`tel:${BUSINESS.phoneLink}`}
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-3 py-1.5 font-medium shadow hover:bg-orange-600 transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
            aria-label={`Anrufen: ${BUSINESS.phoneHuman}`}
          >
            <Phone size={16} aria-hidden /> {BUSINESS.phoneHuman}
          </A>
          <A
            href={BUSINESS.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1.5 font-medium text-white shadow hover:bg-emerald-700 transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-600"
            aria-label="WhatsApp öffnen"
          >
            <MessageCircle size={16} aria-hidden /> WhatsApp
          </A>
        </div>
      </div>
    </div>
  );
}

function NavLinks() {
  return (
    <>
      <Link href="/leistungen" className="hover:text-orange-600">Leistungen</Link>
      <Link href="/#vorteile" className="hover:text-orange-600">Vorteile</Link>
      <Link href="#preise" className="hover:text-orange-600">Preise</Link>
      <Link href="#faq" className="hover:text-orange-600">FAQ</Link>
      <Link href="/#kontakt" className="hover:text-orange-600">Kontakt</Link>
      <A
        href="/#kontakt"
        className="ml-1 inline-flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-white shadow hover:bg-orange-700 transition"
      >
        Angebot anfordern <ArrowRight size={18} aria-hidden />
      </A>
    </>
  );
}

function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-slate-200/70">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600">
          <span className="text-slate-900">re</span>
          <span className="text-orange-600">set.</span>
        </Link>
        <nav aria-label="Hauptnavigation" className="hidden md:flex items-center gap-6 font-medium">
          <NavLinks />
        </nav>
        <button
          type="button"
          onClick={() => setMobileNavOpen(v => !v)}
          className="md:hidden inline-flex items-center justify-center rounded-xl p-2 ring-1 ring-slate-300 hover:bg-slate-50"
          aria-expanded={mobileNavOpen}
          aria-controls="mobile-menu"
          aria-label="Menü umschalten"
        >
          {mobileNavOpen ? <X /> : <Menu />}
        </button>
      </div>
      <div id="mobile-menu" hidden={!mobileNavOpen} className="md:hidden border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 grid gap-3 text-base">
          <Link href="/leistungen" onClick={() => setMobileNavOpen(false)}>Leistungen</Link>
          <Link href="/#vorteile" onClick={() => setMobileNavOpen(false)}>Vorteile</Link>
          <Link href="#preise" onClick={() => setMobileNavOpen(false)}>Preise</Link>
          <Link href="#faq" onClick={() => setMobileNavOpen(false)}>FAQ</Link>
          <Link href="#angebot" onClick={() => setMobileNavOpen(false)}>Angebot</Link>
          <A
            href="#angebot"
            onClick={() => setMobileNavOpen(false)}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-white shadow hover:bg-orange-700"
          >
            Angebot anfordern <ArrowRight size={18} aria-hidden />
          </A>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-slate-50 mt-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="text-2xl font-black tracking-tight">
            <span className="text-slate-900">re</span>
            <span className="text-orange-600">set.</span>
          </div>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Auflösen · Entrümpeln · Neuanfangen - in Schwerin & Umgebung.
          </p>
        </div>
        <div>
          <h4 className="font-bold">Leistungen</h4>
          <ul className="mt-3 space-y-2 text-slate-600">
            <li>Haushaltsauflösung</li>
            <li>Entrümpelung</li>
            <li>Umzug mit Fahrer</li>
            <li>Fahrzeugvermietung</li>
            <li>Gebäudereinigung</li>
            <li>Hausmeisterservice</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold">Gebiete</h4>
          <ul className="mt-3 space-y-2 text-slate-600">
            <li>Innenstadt · Altstadt · Schelfstadt</li>
            <li>Paulsstadt · Werdervorstadt</li>
            <li>Lankow · Krebsförden · Neumühle</li>
            <li>Zippendorf · Mueß · Görries</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold">Rechtliches</h4>
          <ul className="mt-3 space-y-2 text-slate-600">
            <li><Link href="/rechtliches" className="hover:text-orange-600">Impressum</Link></li>
            <li><Link href="/rechtliches" className="hover:text-orange-600">Datenschutzerklärung</Link></li>
            <li><Link href="/rechtliches" className="hover:text-orange-600">AGB</Link></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 md:px-8 pb-10">
        <div className="rounded-2xl bg-white/70 ring-1 ring-slate-200/60 shadow-sm p-4 md:p-5 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm text-slate-600">© {new Date().getFullYear()} reset. Alle Rechte vorbehalten.</span>
          <span className="flex items-center gap-3 text-sm text-slate-600">
            Made with love in Schwerin
            <Link
              href="/admin/preise"
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 hover:border-orange-200 hover:text-orange-600"
            >
              Admin Login
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

// ===== 4) PAGE =====
export default function PreisePage() {
  const [mounted, setMounted] = useState(false);
  const { settings } = usePricingSettings();
  useEffect(() => setMounted(true), []);

  const config: CalculatorPricingConfig =
    settings.calculator ?? DEFAULT_PRICING_SETTINGS.calculator;

  // === Haushaltsauflösung ===
  type HHInput = { sqm: number; floorsAboveEG: number; notes?: string };
  const [hh, setHH] = useState<HHInput>({ sqm: 60, floorsAboveEG: 0, notes: "" });
  const hhResult = useMemo(() => {
    const base = hh.sqm * config.haushalt.basePerSqm;
    const floorPct = hh.floorsAboveEG > 0 ? config.haushalt.floorSurchargePctPerLevel * hh.floorsAboveEG : 0;
    const floorSurcharge = (base * floorPct) / 100;
    const subtotal = base + floorSurcharge;
    const total = Math.max(subtotal, config.haushalt.minPrice);
    return { base, floorPct, floorSurcharge, subtotal, total };
  }, [hh, config.haushalt]);

  // === Entrümpelung ===
  type ENInput = { sqm: number; floorsAboveEG: number; notes?: string };
  const [en, setEN] = useState<ENInput>({ sqm: 20, floorsAboveEG: 0, notes: "" });
  const enResult = useMemo(() => {
    const base = en.sqm * config.entrumpelung.basePerSqm;
    const floorPct = en.floorsAboveEG > 0 ? config.entrumpelung.floorSurchargePctPerLevel * en.floorsAboveEG : 0;
    const floorSurcharge = (base * floorPct) / 100;
    const subtotal = base + floorSurcharge;
    const total = Math.max(subtotal, config.entrumpelung.minPrice);
    return { base, floorPct, floorSurcharge, subtotal, total };
  }, [en, config.entrumpelung]);

  // === Transporte mit Fahrer (1. Std inkl.) ===
  type TRInput = {
    hours: number;
    kmOutsideCity: number;
    withTrailer: boolean;
    trailerWithTarp: boolean;
    isBulkMaterial: boolean; // Schüttgut (Sand/Erde)
    notes?: string;
  };
  const [tr, setTR] = useState<TRInput>({
    hours: 1,
    kmOutsideCity: 0,
    withTrailer: false,
    trailerWithTarp: true,
    isBulkMaterial: false,
    notes: "",
  });

  // Regel: Schüttgut + Anhänger -> Plane Pflicht
  useEffect(() => {
    if (tr.withTrailer && tr.isBulkMaterial && !tr.trailerWithTarp) {
      setTR(v => ({ ...v, trailerWithTarp: true }));
    }
  }, [tr.withTrailer, tr.isBulkMaterial, tr.trailerWithTarp]);

  const trResult = useMemo(() => {
    const base = config.transporte.baseCityOnePickup;
    const hours = clamp(tr.hours, 1, 24);
    const billableHours = Math.max(0, hours - 1);
    const timeCost = billableHours * config.transporte.hourlyRate;
    const kmCost = clamp(tr.kmOutsideCity, 0, 10000) * config.transporte.kmRate;
    const trailerCost = tr.withTrailer ? config.transporte.trailerExtra : 0;
    const total = base + timeCost + kmCost + trailerCost;
    return { base, timeCost, kmCost, trailerCost, total, billableHours, hours };
  }, [tr, config.transporte]);

  // ===== Zusammenfassung & Versand (pro Karte) =====
  type QuoteKind = "hh" | "en" | "tr" | "hm" | "gr" | "all";
  type QuoteStatus = "idle" | "loading" | "success" | "error";

  const [quoteKind, setQuoteKind] = useState<QuoteKind | null>(null);
  const [quoteStatus, setQuoteStatus] = useState<QuoteStatus>("idle");
  const [quoteError, setQuoteError] = useState("");

  const quoteSubjects: Record<QuoteKind, string> = {
    all: "Anfrage - Preise & Angebot (reset Schwerin)",
    hh: "Anfrage - Haushaltsauflösung (reset Schwerin)",
    en: "Anfrage - Entrümpelung (reset Schwerin)",
    tr: "Anfrage - Transport mit Fahrer (reset Schwerin)",
    hm: "Anfrage - Hausmeisterservice (reset Schwerin)",
    gr: "Anfrage - Gebäudereinigung (reset Schwerin)",
  };

  function buildSummary(kind: QuoteKind = "all") {
    const blocks: string[] = [];

    const hhBlock = [
      `Haushaltsauflösung: ${hh.sqm} m², Etagen über EG: ${hh.floorsAboveEG}`,
      hh.notes ? `Hinweise HH: ${hh.notes}` : null,
      `Summe: ${toMoney(hhResult.total)}`,
    ].filter(Boolean).join("\n");

    const enBlock = [
      `Entrümpelung: ${en.sqm} m², Etagen über EG: ${en.floorsAboveEG}`,
      en.notes ? `Hinweise EN: ${en.notes}` : null,
      `Summe: ${toMoney(enResult.total)}`,
    ].filter(Boolean).join("\n");

    const trBlock = [
      `Transport: ${trResult.hours} Std (1. Std inkl., berechnet: ${trResult.billableHours})`,
      `${tr.kmOutsideCity} km außerhalb, Anhänger: ${tr.withTrailer ? (tr.trailerWithTarp ? "mit Plane" : "ohne Plane") : "nein"}`,
      tr.isBulkMaterial ? "Hinweis: Schüttgut (Sand/Erde) - Plane vorgeschrieben, um Verlust/Verschmutzung zu vermeiden." : null,
      tr.notes ? `Hinweise TR: ${tr.notes}` : null,
      `Summe: ${toMoney(trResult.total)}`,
    ].filter(Boolean).join("\n");

    if (kind === "hh") blocks.push(hhBlock);
    else if (kind === "en") blocks.push(enBlock);
    else if (kind === "tr") blocks.push(trBlock);
    else if (kind === "hm") blocks.push("Hausmeisterservice: Preis auf Anfrage - abhängig von Aufgaben, Turnus und Objektgröße.");
    else if (kind === "gr") blocks.push("Gebäudereinigung: Preis auf Anfrage - Grund-/Unterhaltsreinigung, individuell kalkuliert.");
    else blocks.push(hhBlock, enBlock, trBlock);

    // Technische Konfig am Ende nur bei "all"
    if (kind === "all") {
      blocks.push(
        `Konfig: HH ${config.haushalt.basePerSqm}€/m² +${config.haushalt.floorSurchargePctPerLevel}%/Etage | ` +
          `EN ${config.entrumpelung.basePerSqm}€/m² +${config.entrumpelung.floorSurchargePctPerLevel}%/Etage | ` +
          `TR km=${config.transporte.kmRate}€/km, Std=${config.transporte.hourlyRate}€, Trailer +${config.transporte.trailerExtra}€`
      );
    }

    return blocks.filter(Boolean).join("\n\n");
  }

  function openQuoteModal(kind: QuoteKind = "all") {
    setQuoteKind(kind);
    setQuoteStatus("idle");
    setQuoteError("");
  }

  async function submitQuote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!quoteKind) return;

    const form = event.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const customerMessage = String(fd.get("customerMessage") || "").trim();

    const message = [
      quoteSubjects[quoteKind],
      "",
      "Kalkulation:",
      buildSummary(quoteKind),
      customerMessage ? `\nNachricht des Kunden:\n${customerMessage}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    setQuoteStatus("loading");
    setQuoteError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, hp: "" }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || "Anfrage konnte nicht gesendet werden.");
      }

      form.reset();
      setQuoteStatus("success");
    } catch (error) {
      setQuoteStatus("error");
      setQuoteError(error instanceof Error ? error.message : "Anfrage konnte nicht gesendet werden.");
    }
  }


  function whatsappQuote(kind: QuoteKind) {
    const phone = BUSINESS.phoneLink.replace(/^\+/, ""); // +4917... -> 4917...
    const text = buildSummary(kind);
    const url = `https://wa.me/${phone}€text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased [--header-h:64px]">
      {/* Skip link */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:ring-2 focus:ring-orange-600">
        Zum Inhalt springen
      </a>

      {/* JSON-LD */}
      <Script
        id="ld-localbusiness-preise"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: BUSINESS.name,
            address: {
              "@type": "PostalAddress",
              addressLocality: BUSINESS.address.city,
              postalCode: BUSINESS.address.zip,
              streetAddress: BUSINESS.address.street,
              addressCountry: "DE",
            },
            telephone: BUSINESS.phoneLink,
            areaServed: "Schwerin & Umgebung",
            priceRange: "€€",
          }),
        }}
      />

      <TopBar />
      <Header />

      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-white to-slate-50 shadow-[0_24px_42px_-28px_rgba(15,23,42,0.65)]">
        <div className="absolute inset-0 -z-10 bg-[url('/hero.png')] bg-cover bg-center" aria-hidden />
        <div className="absolute inset-0 -z-10 bg-black/50" aria-hidden />
        <div className="mx-auto max-w-7xl overflow-hidden px-4 md:px-8 py-16 md:py-24 text-white">
          <h1 className={`max-w-4xl text-[2rem] sm:text-4xl md:text-6xl font-black tracking-tight leading-tight !text-white ${mounted ? "motion-safe:animate-fade-in-up" : "opacity-0"}`}>
            Transparente <span className="text-orange-400">Preise</span>
          </h1>
          <p className={`mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base ${mounted ? "motion-safe:animate-fade-in motion-safe:[animation-delay:100ms]" : "opacity-0"}`}>
            Beispielrechner für Haushaltsauflösung, Entrümpelung und Transporte mit Fahrer. Hausmeisterservice & Gebäudereinigung: Preis auf Anfrage.
          </p>
        </div>
      </section>

      {/* RECHNER-KARTEN */}
      <section id="preise" className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-20 grid lg:grid-cols-3 gap-4 md:gap-6">
          {/* Haushaltsauflösung */}
          <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Haushaltsauflösung</h2>
            <p className="mt-1 text-slate-600 text-sm">Preisbeispiel nach m² & Etagen (automatisch berechnet).</p>
            <div className="mt-4 grid gap-3">
              <label className="text-sm">Wohn-/Nutzfläche (m²)
                <input type="number" min={0} step={1} value={hh.sqm} onChange={(e)=>setHH(v=>({...v, sqm: Number(e.target.value)}))}
                  className="mt-1 w-full rounded-xl border px-3 py-2" />
              </label>
              <label className="text-sm">Etagen über EG
                <input type="number" min={0} step={1} value={hh.floorsAboveEG} onChange={(e)=>setHH(v=>({...v, floorsAboveEG: Number(e.target.value)}))}
                  className="mt-1 w-full rounded-xl border px-3 py-2" />
              </label>
              <label className="text-sm">Hinweise (optional)
                <textarea value={hh.notes} onChange={(e)=>setHH(v=>({...v, notes: e.target.value}))} rows={2}
                  className="mt-1 w-full rounded-xl border px-3 py-2" />
              </label>
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 border p-4 text-sm">
              <div className="flex justify-between"><span>Grundpreis</span><strong>{toMoney(hhResult.base)}</strong></div>
              <div className="flex justify-between"><span>Zuschlag Etagen ({hhResult.floorPct}%)</span><strong>{toMoney(hhResult.floorSurcharge)}</strong></div>
              <div className="flex justify-between border-t mt-2 pt-2 text-slate-700"><span>Zwischensumme</span><strong>{toMoney(hhResult.subtotal)}</strong></div>
              <div className="flex justify-between border-t mt-2 pt-2 text-slate-900 text-base"><span className="font-bold">Voraussichtliche Summe</span><strong className="font-black text-orange-600">{toMoney(hhResult.total)}</strong></div>
              <p className="mt-2 text-xs text-slate-500">Unverbindliche Orientierung. Besichtigung (vor Ort oder per WhatsApp-Video) empfohlen.</p>
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={() => openQuoteModal("hh")} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-white font-semibold shadow hover:bg-orange-700 sm:w-auto">
                Per Mail anfragen <ArrowRight size={16} />
              </button>
              <button onClick={() => whatsappQuote("hh")} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-white font-semibold shadow hover:bg-emerald-700 sm:w-auto">
                <MessageCircle size={16}/> WhatsApp
              </button>
            </div>
          </article>

          {/* Entrümpelung */}
          <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Entrümpelung</h2>
            <p className="mt-1 text-slate-600 text-sm">Preisbeispiel nach m² & Etagen (automatisch berechnet).</p>
            <div className="mt-4 grid gap-3">
              <label className="text-sm">Fläche (m²)
                <input type="number" min={0} step={1} value={en.sqm} onChange={(e)=>setEN(v=>({...v, sqm: Number(e.target.value)}))}
                  className="mt-1 w-full rounded-xl border px-3 py-2" />
              </label>
              <label className="text-sm">Etagen über EG
                <input type="number" min={0} step={1} value={en.floorsAboveEG} onChange={(e)=>setEN(v=>({...v, floorsAboveEG: Number(e.target.value)}))}
                  className="mt-1 w-full rounded-xl border px-3 py-2" />
              </label>
              <label className="text-sm">Hinweise (optional)
                <textarea value={en.notes} onChange={(e)=>setEN(v=>({...v, notes: e.target.value}))} rows={2}
                  className="mt-1 w-full rounded-xl border px-3 py-2" />
              </label>
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 border p-4 text-sm">
              <div className="flex justify-between"><span>Grundpreis</span><strong>{toMoney(enResult.base)}</strong></div>
              <div className="flex justify-between"><span>Zuschlag Etagen ({enResult.floorPct}%)</span><strong>{toMoney(enResult.floorSurcharge)}</strong></div>
              <div className="flex justify-between border-t mt-2 pt-2 text-slate-700"><span>Zwischensumme</span><strong>{toMoney(enResult.subtotal)}</strong></div>
              <div className="flex justify-between border-t mt-2 pt-2 text-slate-900 text-base"><span className="font-bold">Voraussichtliche Summe</span><strong className="font-black text-orange-600">{toMoney(enResult.total)}</strong></div>
              <p className="mt-2 text-xs text-slate-500">Unverbindliche Orientierung. Je nach Umfang/Entsorgung variabel.</p>
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={() => openQuoteModal("en")} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-white font-semibold shadow hover:bg-orange-700 sm:w-auto">
                Per Mail anfragen <ArrowRight size={16} />
              </button>
              <button onClick={() => whatsappQuote("en")} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-white font-semibold shadow hover:bg-emerald-700 sm:w-auto">
                <MessageCircle size={16}/> WhatsApp
              </button>
            </div>
          </article>

          {/* Transporte mit Fahrer */}
          <article className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Transporte mit Fahrer</h2>
            <p className="mt-1 text-slate-600 text-sm">
              Pauschal in Schwerin (inkl. 1. Stunde, 1 Abholung) + km außerhalb + Stundenlohn ab 2. Stunde. Anhänger optional.
            </p>
            <div className="mt-4 grid gap-3">
              <label className="text-sm">Arbeitszeit (Std, 1. Std inkl.)
                <input type="number" min={1} step={0.5} value={tr.hours} onChange={(e)=>setTR(v=>({...v, hours: Number(e.target.value)}))}
                  className="mt-1 w-full rounded-xl border px-3 py-2" />
              </label>
              <label className="text-sm">Kilometer außerhalb Schwerin (gesamt)
                <input type="number" min={0} step={1} value={tr.kmOutsideCity} onChange={(e)=>setTR(v=>({...v, kmOutsideCity: Number(e.target.value)}))}
                  className="mt-1 w-full rounded-xl border px-3 py-2" />
              </label>

              {/* Trailer + Plane + Schüttgut */}
              <div className="flex flex-wrap items-center gap-4">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={tr.withTrailer}
                    onChange={(e)=>setTR(v=>({...v, withTrailer: e.target.checked }))}
                  />
                  750kg Anhänger (+{toMoney(config.transporte.trailerExtra)})
                </label>

                <label className={`inline-flex items-center gap-2 text-sm ${tr.withTrailer ? "" : "opacity-50"}`}>
                  <input
                    type="checkbox"
                    disabled={!tr.withTrailer || tr.isBulkMaterial}
                    checked={tr.trailerWithTarp}
                    onChange={(e)=>setTR(v=>({...v, trailerWithTarp: e.target.checked }))}
                  />
                  mit Plane
                </label>

                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={tr.isBulkMaterial}
                    onChange={(e)=>setTR(v=>({
                      ...v,
                      isBulkMaterial: e.target.checked,
                      // Bei Schüttgut + Anhänger -> Plane erzwungen
                      trailerWithTarp: e.target.checked && v.withTrailer ? true : v.trailerWithTarp
                    }))} />
                  Schüttgut (Sand/Erde)
                </label>
              </div>

              {tr.isBulkMaterial && tr.withTrailer && (
                <p className="text-xs text-slate-600">
                  <strong className="text-orange-600">Hinweis:</strong> Bei Schüttgut (z. B. Sand/Erde) ist die Nutzung einer Plane vorgeschrieben, um Verlust und Verschmutzung zu vermeiden.
                </p>
              )}

              <label className="text-sm">Hinweise (optional)
                <textarea value={tr.notes} onChange={(e)=>setTR(v=>({...v, notes: e.target.value}))} rows={2}
                  className="mt-1 w-full rounded-xl border px-3 py-2" />
              </label>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 border p-4 text-sm">
              <div className="flex justify-between"><span>Pauschalpreis (Stadt, 1 Abholung)</span><strong>{toMoney(trResult.base)}</strong></div>
              <div className="flex justify-between"><span>Zeit (ab 2. Std) {trResult.billableHours} × {toMoney(config.transporte.hourlyRate)}</span><strong>{toMoney(trResult.timeCost)}</strong></div>
              <div className="flex justify-between"><span>km außerhalb {tr.kmOutsideCity} × {toMoney(config.transporte.kmRate)}</span><strong>{toMoney(trResult.kmCost)}</strong></div>
              <div className="flex justify-between"><span>Anhänger</span><strong>{toMoney(trResult.trailerCost)}</strong></div>
              <div className="flex justify-between border-t mt-2 pt-2 text-slate-900 text-base"><span className="font-bold">Voraussichtliche Summe</span><strong className="font-black text-orange-600">{toMoney(trResult.total)}</strong></div>
              <p className="mt-2 text-xs text-slate-500">
                Kilometergeld und Stundensatz sind oben im Konfig-Panel veränderbar.
              </p>
              {tr.isBulkMaterial && (
                <p className="mt-1 text-xs text-slate-500">
                  Schüttgut (Sand/Erde): Bitte Ladepunkt m²glichst nah am Ziel angeben.
                </p>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button type="button" onClick={() => openQuoteModal("tr")} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-white font-semibold shadow hover:bg-orange-700 sm:w-auto">
                Per Mail anfragen <ArrowRight size={16} />
              </button>
              <button onClick={() => whatsappQuote("tr")} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-white font-semibold shadow hover:bg-emerald-700 sm:w-auto">
                <MessageCircle size={16}/> WhatsApp
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* Anfrage-Pakete */}
      <section className="bg-white py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-6 md:gap-10">
            <article className="rounded-2xl border border-slate-200/80 bg-slate-50 p-6 shadow-sm">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">Hausmeisterservice</h2>
              <p className="mt-1 text-slate-600">Preis auf Anfrage - abhängig von Aufgaben, Turnus & Objektgröße.</p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button type="button" onClick={() => openQuoteModal("hm")} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-white font-semibold shadow hover:bg-slate-800 sm:w-auto">
                  <Mail size={16}/> Anfrage per Mail
                </button>
                <A href={BUSINESS.whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-white font-semibold shadow hover:bg-emerald-700 sm:w-auto">
                  <MessageCircle size={16}/> WhatsApp
                </A>
              </div>
            </article>
            <article className="rounded-2xl border border-slate-200/80 bg-slate-50 p-6 shadow-sm">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">Gebäudereinigung</h2>
              <p className="mt-1 text-slate-600">Preis auf Anfrage - Grund-/Unterhaltsreinigung, individuell kalkuliert.</p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button type="button" onClick={() => openQuoteModal("gr")} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-white font-semibold shadow hover:bg-slate-800 sm:w-auto">
                  <Mail size={16}/> Anfrage per Mail
                </button>
                <A href={BUSINESS.whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-white font-semibold shadow hover:bg-emerald-700 sm:w-auto">
                  <MessageCircle size={16}/> WhatsApp
                </A>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ANGEBOT CTA (Gesamtzusammenfassung) */}
      <section id="angebot" className="bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">Angebot mit Ihren Angaben</h2>
            <p className="mt-2 text-slate-600">Senden Sie uns die obigen Kalkulationen per Klick - wir melden uns.</p>
          </div>
          <div className="flex w-full flex-col gap-2 md:w-auto sm:flex-row">
            <button type="button" onClick={() => openQuoteModal("all")} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-5 py-2.5 text-white font-semibold shadow hover:bg-orange-700 sm:w-auto">
              Zusammenfassung per Mail <ArrowRight size={18}/>
            </button>
            <button onClick={() => whatsappQuote("all")} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-white font-semibold shadow hover:bg-emerald-700 sm:w-auto">
              <MessageCircle size={18}/> WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* FAQ (kurz) */}
      <section id="faq" className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8 grid md:grid-cols-2 gap-4 md:gap-6">
          <div className="rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h3 className="font-bold">Wie läuft die Besichtigung ab?</h3>
            <p className="mt-2 text-slate-600">Auf Wunsch digital via WhatsApp-Video oder vor Ort. Danach erhalten Sie ein Festpreis-Angebot.</p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h3 className="font-bold">Entsorgen Sie alles fachgerecht?</h3>
            <p className="mt-2 text-slate-600">Ja, wir trennen sorgfältig und entsorgen nach gesetzlichen Vorgaben - inkl. Nachweis.</p>
          </div>
        </div>
      </section>

      {quoteKind && (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quote-modal-title"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="quote-modal-title" className="text-2xl font-black tracking-tight">
                  Anfrage per Mail
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Die berechneten Daten sind bereits angehängt. Bitte Kontaktdaten ergänzen.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setQuoteKind(null)}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
                aria-label="Modal schließen"
              >
                <X size={18} aria-hidden />
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">{quoteSubjects[quoteKind]}</div>
              <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-600">
                {buildSummary(quoteKind)}
              </pre>
            </div>

            {quoteStatus === "success" ? (
              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
                <p className="font-semibold">Danke, die Anfrage wurde gesendet.</p>
                <p className="mt-1 text-sm">Wir melden uns umgehend zurück.</p>
                <button
                  type="button"
                  onClick={() => setQuoteKind(null)}
                  className="mt-4 rounded-full bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
                >
                  Schließen
                </button>
              </div>
            ) : (
              <form onSubmit={submitQuote} className="mt-5 grid gap-4">
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  Name
                  <input
                    name="name"
                    required
                    minLength={2}
                    autoComplete="name"
                    className="rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600"
                  />
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-1 text-sm font-medium text-slate-700">
                    E-Mail
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600"
                    />
                  </label>
                  <label className="grid gap-1 text-sm font-medium text-slate-700">
                    Telefon
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      className="rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600"
                    />
                  </label>
                </div>
                <p className="text-xs text-slate-500">Bitte E-Mail oder Telefon angeben.</p>
                <label className="grid gap-1 text-sm font-medium text-slate-700">
                  Nachricht optional
                  <textarea
                    name="customerMessage"
                    rows={4}
                    className="rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="Wunschtermin, Adresse, Etage, Besonderheiten..."
                  />
                </label>
                {quoteStatus === "error" && (
                  <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{quoteError}</p>
                )}
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setQuoteKind(null)}
                    className="rounded-full border border-slate-300 px-5 py-2.5 font-semibold hover:bg-slate-50"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    disabled={quoteStatus === "loading"}
                    className="rounded-full bg-orange-600 px-5 py-2.5 font-semibold text-white shadow hover:bg-orange-700 disabled:opacity-60"
                  >
                    {quoteStatus === "loading" ? "Wird gesendet..." : "Anfrage senden"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <StickyBar />
      <Footer />
    </div>
  );
}
