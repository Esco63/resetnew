"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import {
  ArrowRight,
  Mail,
  MessageCircle,
  Phone,
  Settings,
  MapPin,
  Menu,
  X,
  Shield,
  Clock,
  Truck,
} from "lucide-react";

/**
 * Preise – reset. Schwerin
 * ----------------------------------------------
 * • Preise zentral oben in PRICING_CONFIG anpassbar
 * • Navbar/Topbar/Footer wie auf der UltraLanding-Seite
 * • 1. Transport-Stunde inklusive
 * • Admin-Panel zum Live-Feintuning
 * • Karten-spezifische Anfrage (Mail/WA) – nur die gewählte Leistung
 * • Transport: Schüttgut (Sand/Erde) → Plane Pflicht bei Anhänger
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

type PricingConfig = {
  haushalt: { basePerSqm: number; floorSurchargePctPerLevel: number; minPrice: number };
  entrumpelung: { basePerSqm: number; floorSurchargePctPerLevel: number; minPrice: number };
  transporte: { baseCityOnePickup: number; hourlyRate: number; kmRate: number; trailerExtra: number };
};

const PRICING_CONFIG: PricingConfig = {
  haushalt: { basePerSqm: 18, floorSurchargePctPerLevel: 4, minPrice: 199 },
  entrumpelung: { basePerSqm: 12, floorSurchargePctPerLevel: 3, minPrice: 149 },
  transporte: { baseCityOnePickup: 79, hourlyRate: 30, kmRate: 1.2, trailerExtra: 20 },
};

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
          <Link href="#preise" onClick={() => setMobileNavOpen(false)}>Preise</Link>
          <Link href="#faq" onClick={() => setMobileNavOpen(false)}>FAQ</Link>
          <Link href="#angebot" onClick={() => setMobileNavOpen(false)}>Kontakt</Link>
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

function StickyBottomBar() {
  return (
    <div className="sticky bottom-0 z-50 bg-white/95 backdrop-blur shadow-[0_-12px_30px_-12px_rgba(0,0,0,0.25)] ring-1 ring-slate-200/60">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-2.5 flex items-center justify-between gap-3">
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-700">
          <Shield size={16} aria-hidden /> Unverbindlich & diskret
        </div>
        <div className="hidden md:flex items-center gap-2">
          <A
            href={BUSINESS.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-white font-semibold shadow hover:bg-emerald-700 transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-600"
          >
            <MessageCircle size={18} aria-hidden /> WhatsApp
          </A>
          <A
            href="#angebot"
            className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-2.5 text-white font-semibold shadow hover:bg-orange-700 transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
          >
            Jetzt kostenlos anfragen <ArrowRight size={18} aria-hidden />
          </A>
        </div>

        {/* Mobile 3er-Bar */}
        <div className="md:hidden grid grid-cols-3 gap-2 w-full">
          <A
            href={`tel:${BUSINESS.phoneLink}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl ring-1 ring-slate-300 bg-white px-2 py-2 text-sm font-medium shadow-sm hover:bg-slate-50"
            aria-label="Anrufen"
          >
            <Phone size={18} aria-hidden /> Anruf
          </A>
          <A
            href={BUSINESS.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-2 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
            aria-label="WhatsApp Chat starten"
          >
            <MessageCircle size={18} aria-hidden /> WhatsApp
          </A>
          <A
            href="#angebot"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-2 py-2 text-sm font-semibold text-white shadow hover:bg-orange-700"
            aria-label="Angebot anfordern"
          >
            Angebot <ArrowRight size={16} aria-hidden />
          </A>
        </div>
      </div>
    </div>
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
            Auflösen · Entrümpeln · Neuanfangen – in Schwerin & Umgebung.
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
          <span className="text-sm text-slate-600">Made with ❤️ in Schwerin</span>
        </div>
      </div>
    </footer>
  );
}

// ===== 4) PAGE =====
export default function PreisePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Lokale State-Kopie
  const [config, setConfig] = useState<PricingConfig>(() => ({
    haushalt: { ...PRICING_CONFIG.haushalt },
    entrumpelung: { ...PRICING_CONFIG.entrumpelung },
    transporte: { ...PRICING_CONFIG.transporte },
  }));

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

  // Regel: Schüttgut + Anhänger → Plane Pflicht
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
  type QuoteKind = "hh" | "en" | "tr" | "all";

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
      tr.isBulkMaterial ? "Hinweis: Schüttgut (Sand/Erde) – Plane vorgeschrieben, um Verlust/Verschmutzung zu vermeiden." : null,
      tr.notes ? `Hinweise TR: ${tr.notes}` : null,
      `Summe: ${toMoney(trResult.total)}`,
    ].filter(Boolean).join("\n");

    if (kind === "hh") blocks.push(hhBlock);
    else if (kind === "en") blocks.push(enBlock);
    else if (kind === "tr") blocks.push(trBlock);
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

  function mailtoQuote(kind: QuoteKind = "all") {
    const subjects: Record<QuoteKind, string> = {
      all: "Anfrage – Preise & Angebot (reset Schwerin)",
      hh: "Anfrage – Haushaltsauflösung (reset Schwerin)",
      en: "Anfrage – Entrümpelung (reset Schwerin)",
      tr: "Anfrage – Transport mit Fahrer (reset Schwerin)",
    };
    const subject = encodeURIComponent(subjects[kind]);
    const body = encodeURIComponent(buildSummary(kind));
    window.location.href = `mailto:${BUSINESS.email}?subject=${subject}&body=${body}`;
  }

  function whatsappQuote(kind: QuoteKind) {
    const phone = BUSINESS.phoneLink.replace(/^\+/, ""); // +4917… → 4917…
    const text = buildSummary(kind);
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
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
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-white to-slate-50">
        <div className="absolute inset-0 -z-10 bg-[url('/hero.png')] bg-cover bg-center" aria-hidden />
        <div className="absolute inset-0 -z-10 bg-black/50" aria-hidden />
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24 text-white">
          <h1 className={`max-w-4xl text-4xl md:text-6xl font-black tracking-tight leading-tight ${mounted ? "motion-safe:animate-fade-in-up" : "opacity-0"}`}>
            Transparente <span className="text-orange-400">Preise</span>
          </h1>
          <p className={`mt-4 max-w-2xl text-white/90 ${mounted ? "motion-safe:animate-fade-in motion-safe:[animation-delay:100ms]" : "opacity-0"}`}>
            Beispielrechner für Haushaltsauflösung, Entrümpelung und Transporte mit Fahrer. Hausmeisterservice & Gebäudereinigung: Preis auf Anfrage.
          </p>
        </div>
      </section>

      {/* ADMIN-KONFIG */}
      <section className="bg-white py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <details className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 shadow-sm">
            <summary className="flex items-center gap-2 cursor-pointer font-semibold">
              <Settings size={18} /> Preis-Konfiguration (für Admin anpassbar)
            </summary>
            <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
              <div className="rounded-xl bg-white border p-4">
                <h3 className="font-bold">Haushaltsauflösung</h3>
                <label className="block mt-2">€ / m²
                  <input type="number" min={0} step={1} className="mt-1 w-full rounded-lg border px-3 py-2" value={config.haushalt.basePerSqm}
                    onChange={(e)=>setConfig(v=>({...v, haushalt:{...v.haushalt, basePerSqm: Number(e.target.value)}}))} />
                </label>
                <label className="block mt-2">Zuschlag % / Etage
                  <input type="number" min={0} step={1} className="mt-1 w-full rounded-lg border px-3 py-2" value={config.haushalt.floorSurchargePctPerLevel}
                    onChange={(e)=>setConfig(v=>({...v, haushalt:{...v.haushalt, floorSurchargePctPerLevel: Number(e.target.value)}}))} />
                </label>
                <label className="block mt-2">Mindestpreis
                  <input type="number" min={0} step={1} className="mt-1 w-full rounded-lg border px-3 py-2" value={config.haushalt.minPrice}
                    onChange={(e)=>setConfig(v=>({...v, haushalt:{...v.haushalt, minPrice: Number(e.target.value)}}))} />
                </label>
              </div>
              <div className="rounded-xl bg-white border p-4">
                <h3 className="font-bold">Entrümpelung</h3>
                <label className="block mt-2">€ / m²
                  <input type="number" min={0} step={1} className="mt-1 w-full rounded-lg border px-3 py-2" value={config.entrumpelung.basePerSqm}
                    onChange={(e)=>setConfig(v=>({...v, entrumpelung:{...v.entrumpelung, basePerSqm: Number(e.target.value)}}))} />
                </label>
                <label className="block mt-2">Zuschlag % / Etage
                  <input type="number" min={0} step={1} className="mt-1 w-full rounded-lg border px-3 py-2" value={config.entrumpelung.floorSurchargePctPerLevel}
                    onChange={(e)=>setConfig(v=>({...v, entrumpelung:{...v.entrumpelung, floorSurchargePctPerLevel: Number(e.target.value)}}))} />
                </label>
                <label className="block mt-2">Mindestpreis
                  <input type="number" min={0} step={1} className="mt-1 w-full rounded-lg border px-3 py-2" value={config.entrumpelung.minPrice}
                    onChange={(e)=>setConfig(v=>({...v, entrumpelung:{...v.entrumpelung, minPrice: Number(e.target.value)}}))} />
                </label>
              </div>
              <div className="rounded-xl bg-white border p-4">
                <h3 className="font-bold">Transporte mit Fahrer</h3>
                <label className="block mt-2">Pauschal (Stadt, 1 Abholung)
                  <input type="number" min={0} step={1} className="mt-1 w-full rounded-lg border px-3 py-2" value={config.transporte.baseCityOnePickup}
                    onChange={(e)=>setConfig(v=>({...v, transporte:{...v.transporte, baseCityOnePickup: Number(e.target.value)}}))} />
                </label>
                <label className="block mt-2">€ / Stunde (ab 2. Std)
                  <input type="number" min={0} step={1} className="mt-1 w-full rounded-lg border px-3 py-2" value={config.transporte.hourlyRate}
                    onChange={(e)=>setConfig(v=>({...v, transporte:{...v.transporte, hourlyRate: Number(e.target.value)}}))} />
                </label>
                <label className="block mt-2">€ / km außerhalb
                  <input type="number" min={0} step={0.1} className="mt-1 w-full rounded-lg border px-3 py-2" value={config.transporte.kmRate}
                    onChange={(e)=>setConfig(v=>({...v, transporte:{...v.transporte, kmRate: Number(e.target.value)}}))} />
                </label>
                <label className="block mt-2">Anhänger-Zuschlag
                  <input type="number" min={0} step={1} className="mt-1 w-full rounded-lg border px-3 py-2" value={config.transporte.trailerExtra}
                    onChange={(e)=>setConfig(v=>({...v, transporte:{...v.transporte, trailerExtra: Number(e.target.value)}}))} />
                </label>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Hinweis: Die Standardwerte kommen aus <code>PRICING_CONFIG</code> oben. Für dauerhafte Änderungen Werte dort anpassen.
            </p>
          </details>
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
            <div className="mt-4 flex gap-2">
              <button onClick={() => mailtoQuote("hh")} className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-white font-semibold shadow hover:bg-orange-700">
                Per Mail anfragen <ArrowRight size={16} />
              </button>
              <button onClick={() => whatsappQuote("hh")} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-white font-semibold shadow hover:bg-emerald-700">
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
            <div className="mt-4 flex gap-2">
              <button onClick={() => mailtoQuote("en")} className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-white font-semibold shadow hover:bg-orange-700">
                Per Mail anfragen <ArrowRight size={16} />
              </button>
              <button onClick={() => whatsappQuote("en")} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-white font-semibold shadow hover:bg-emerald-700">
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
                      // Bei Schüttgut + Anhänger → Plane erzwungen
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
                  Schüttgut (Sand/Erde): Bitte Ladepunkt möglichst nah am Ziel angeben.
                </p>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <button onClick={() => mailtoQuote("tr")} className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-white font-semibold shadow hover:bg-orange-700">
                Per Mail anfragen <ArrowRight size={16} />
              </button>
              <button onClick={() => whatsappQuote("tr")} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-white font-semibold shadow hover:bg-emerald-700">
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
              <p className="mt-1 text-slate-600">Preis auf Anfrage – abhängig von Aufgaben, Turnus & Objektgröße.</p>
              <div className="mt-4 flex gap-2">
                <A href={`mailto:${BUSINESS.email}?subject=${encodeURIComponent("Anfrage Hausmeisterservice – reset Schwerin")}`} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-white font-semibold shadow hover:bg-slate-800">
                  <Mail size={16}/> Anfrage per Mail
                </A>
                <A href={BUSINESS.whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-white font-semibold shadow hover:bg-emerald-700">
                  <MessageCircle size={16}/> WhatsApp
                </A>
              </div>
            </article>
            <article className="rounded-2xl border border-slate-200/80 bg-slate-50 p-6 shadow-sm">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">Gebäudereinigung</h2>
              <p className="mt-1 text-slate-600">Preis auf Anfrage – Grund-/Unterhaltsreinigung, individuell kalkuliert.</p>
              <div className="mt-4 flex gap-2">
                <A href={`mailto:${BUSINESS.email}?subject=${encodeURIComponent("Anfrage Gebäudereinigung – reset Schwerin")}`} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-white font-semibold shadow hover:bg-slate-800">
                  <Mail size={16}/> Anfrage per Mail
                </A>
                <A href={BUSINESS.whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-white font-semibold shadow hover:bg-emerald-700">
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
            <p className="mt-2 text-slate-600">Senden Sie uns die obigen Kalkulationen per Klick – wir melden uns.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => mailtoQuote("all")} className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-2.5 text-white font-semibold shadow hover:bg-orange-700">
              Zusammenfassung per Mail <ArrowRight size={18}/>
            </button>
            <button onClick={() => whatsappQuote("all")} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-white font-semibold shadow hover:bg-emerald-700">
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
            <p className="mt-2 text-slate-600">Ja, wir trennen sorgfältig und entsorgen nach gesetzlichen Vorgaben – inkl. Nachweis.</p>
          </div>
        </div>
      </section>

      <StickyBottomBar />
      <Footer />

      {/* Kleiner Runtime-Test */}
      <Script id="preise-smoke" strategy="afterInteractive">
        {`
          try {
            const html = document.documentElement.outerHTML;
            console.log('[Preise] buttons:', /Per Mail anfragen/.test(html), /WhatsApp/.test(html));
          } catch {}
        `}
      </Script>
    </div>
  );
}
