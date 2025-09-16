"use client";

import React, { useEffect, useState } from "react";
import ServiceAreaMap from "@/app/components/ServiceAreaMap";
import Script from "next/script";
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  CheckCircle,
  Shield,
  Clock,
  Truck,
  Sparkles,
  Star,
  MessageCircle,
  Menu,
  X,
} from "lucide-react";

/**
 * Ultra Landing Page – reset. Schwerin (optimiert, SSR-safe, mobile-first)
 *
 * globals.css (empfohlen):
 * html { scroll-behavior: smooth; }
 * body { font-synthesis-weight: none; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
 */

export default function UltraLanding() {
  const [mounted, setMounted] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  // ---- Business-Daten
  const business = {
    name: "reset. Schwerin",
    phoneHuman: "0385 555 12345",
    phoneLink: "+4938555512345",
    whatsappLink:
      "https://wa.me/491721234567?text=Hallo%20reset.%20Anfrage%20aus%20Schwerin",
    email: "info@reset-schwerin.de",
    address: {
      street: "Musterstraße 1",
      zip: "19053",
      city: "Schwerin",
    },
  } as const;

  // ---- JSON-LD
  const ld = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    address: {
      "@type": "PostalAddress",
      addressLocality: business.address.city,
      postalCode: business.address.zip,
      streetAddress: business.address.street,
      addressCountry: "DE",
    },
    telephone: business.phoneLink,
    url: "https://reset-schwerin.example",
    sameAs: ["https://wa.me/491721234567"],
    openingHours: ["Mo-Fr 07:00-20:00", "Sa 09:00-15:00"],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "15:00",
      },
    ],
    areaServed: "Schwerin & Umgebung",
    priceRange: "€€",
  } as const;

  // ---- Link-Helper (fix: Buttons verlieren nicht ihre Textfarbe bei Hover)
  type AProps = React.ComponentPropsWithoutRef<"a"> & {
    variant?: "link" | "unstyled";
  };
  const A = ({ variant = "unstyled", ...props }: AProps) => (
    <a
      {...props}
      className={`${variant === "link" ? "hover:text-orange-600" : ""} focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 transition-colors ${
        props.className ?? ""
      }`}
    />
  );

  // ---- Nav-Links
  const NavLinks = () => (
    <>
      <A href="#leistungen" variant="link">
        Leistungen
      </A>
      <A href="#vorteile" variant="link">
        Vorteile
      </A>
      <A href="#preise" variant="link">
        Preise
      </A>
      <A href="#faq" variant="link">
        FAQ
      </A>
      <A href="#kontakt" variant="link">
        Kontakt
      </A>
      <A
        href="#angebot"
        className="ml-1 inline-flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-white shadow hover:bg-orange-700 transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
      >
        Angebot anfordern <ArrowRight size={18} aria-hidden="true" />
      </A>
    </>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased [--header-h:64px]">
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:ring-2 focus:ring-orange-600"
      >
        Zum Inhalt springen
      </a>

      {/* JSON-LD */}
      <Script
        id="ld-localbusiness"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      {/* Top Bar */}
      <div className="bg-slate-900 text-white text-sm">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin size={16} aria-hidden="true" /> Schwerin & Umgebung
            </span>
            <A
              href={`mailto:${business.email}`}
              variant="link"
              className="flex items-center gap-1 hover:underline"
            >
              <Mail size={16} aria-hidden="true" /> {business.email}
            </A>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <A
              href={`tel:${business.phoneLink}`}
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-3 py-1.5 font-medium shadow hover:bg-orange-600 transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
              aria-label={`Anrufen: ${business.phoneHuman}`}
            >
              <Phone size={16} aria-hidden="true" /> {business.phoneHuman}
            </A>
            <A
              href={business.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1.5 font-medium text-white shadow hover:bg-emerald-700 transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-600"
              aria-label="WhatsApp öffnen"
            >
              <MessageCircle size={16} aria-hidden="true" /> WhatsApp
            </A>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-3.5 flex items-center justify-between">
          <a
            href="#"
            className="text-2xl font-black tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
          >
            <span className="text-slate-900">re</span>
            <span className="text-orange-600">set.</span>
          </a>

          {/* Desktop Nav */}
          <nav
            aria-label="Hauptnavigation"
            className="hidden md:flex items-center gap-6 font-medium"
          >
            <NavLinks />
          </nav>

          {/* Mobile burger */}
          <button
            type="button"
            onClick={() => setMobileNavOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center rounded-xl p-2 ring-1 ring-slate-300 hover:bg-slate-50"
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-menu"
            aria-label="Menü umschalten"
          >
            {mobileNavOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile menu panel */}
        <div
          id="mobile-menu"
          hidden={!mobileNavOpen}
          className="md:hidden border-t border-slate-200 bg-white"
        >
          <div className="mx-auto max-w-7xl px-4 py-3 grid gap-3 text-base">
            <A href="#leistungen" onClick={() => setMobileNavOpen(false)}>
              Leistungen
            </A>
            <A href="#vorteile" onClick={() => setMobileNavOpen(false)}>
              Vorteile
            </A>
            <A href="#preise" onClick={() => setMobileNavOpen(false)}>
              Preise
            </A>
            <A href="#faq" onClick={() => setMobileNavOpen(false)}>
              FAQ
            </A>
            <A href="#kontakt" onClick={() => setMobileNavOpen(false)}>
              Kontakt
            </A>
            <A
              href="#angebot"
              onClick={() => setMobileNavOpen(false)}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-white shadow hover:bg-orange-700"
            >
              Angebot anfordern <ArrowRight size={18} aria-hidden="true" />
            </A>
          </div>
        </div>
      </header>

      {/* Main */}
      <main id="main">
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-white to-slate-50">
          <div
            className="absolute inset-0 -z-10 bg-[url('/hero.png')] bg-cover bg-center"
            aria-hidden="true"
          />
          <div className="absolute inset-0 -z-10 bg-black/50" aria-hidden="true" />
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-28 text-white">
            <h1
              className={`max-w-4xl text-4xl md:text-6xl font-black tracking-tight leading-tight ${
                mounted ? "motion-safe:animate-fade-in-up" : "opacity-0"
              }`}
            >
              Auflösen. Entrümpeln. Neuanfangen.{" "}
              <span className="text-orange-400">In Schwerin.</span>
            </h1>
            <p
              className={`mt-5 max-w-2xl text-lg md:text-xl text-white/90 leading-relaxed ${
                mounted
                  ? "motion-safe:animate-fade-in motion-safe:[animation-delay:100ms]"
                  : "opacity-0"
              }`}
            >
              Haushaltsauflösungen, Entrümpelungen, Umzüge, Gebäudereinigung &
              Hausmeisterservice – diskret, versichert & zum fairen Festpreis.
            </p>
            <div
              className={`mt-8 flex flex-wrap items-center gap-4 ${
                mounted
                  ? "motion-safe:animate-fade-in motion-safe:[animation-delay:200ms]"
                  : "opacity-0"
              }`}
            >
              <A
                href="#angebot"
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg hover:bg-orange-600 transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
              >
                <Sparkles size={20} aria-hidden="true" /> Jetzt kostenloses
                Angebot
              </A>
              <A
                href="#leistungen"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur hover:bg-white/20 transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
              >
                Mehr erfahren
              </A>
            </div>
            <div
              className={`mt-8 flex flex-wrap items-center gap-6 text-sm text-white/80 ${
                mounted
                  ? "motion-safe:animate-fade-in motion-safe:[animation-delay:300ms]"
                  : "opacity-0"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <Shield size={16} aria-hidden="true" /> Versichert
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock size={16} aria-hidden="true" /> Termine in 48h
              </span>
              <span className="inline-flex items-center gap-2">
                <Truck size={16} aria-hidden="true" /> Eigene Fahrzeuge
              </span>
            </div>
          </div>
        </section>

        {/* Trust badges row */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-8 md:py-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {[
              "Festpreis-Angebot",
              "Diskret & zuverlässig",
              "WhatsApp-Bildercheck",
              "Besenreine Übergabe",
            ].map((t, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-xl ring-1 ring-slate-200/70 bg-white p-3 md:p-4 shadow-sm hover:shadow-md transition hover:-translate-y-0.5"
              >
                <CheckCircle
                  className="shrink-0 text-orange-600"
                  aria-hidden="true"
                />
                <span className="font-medium">{t}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Leistungen grid */}
        <section
          id="leistungen"
          className="bg-slate-50 scroll-mt-[var(--header-h)]"
        >
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-28">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Unsere Leistungen
            </h2>
            <p className="mt-2 text-slate-600 leading-relaxed">
              Alles aus einer Hand – für Ihren Neuanfang in Schwerin.
            </p>
            <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {[
                {
                  title: "Haushaltsauflösungen",
                  desc: "Schnell, sauber & mit Wertanrechnung.",
                },
                {
                  title: "Entrümpelungen",
                  desc: "Keller, Dachboden, Garage – wir schaffen Platz.",
                },
                {
                  title: "Umzüge",
                  desc: "Stressfrei mit Fahrer & passendem Fahrzeug.",
                },
                {
                  title: "Fahrzeugvermietung",
                  desc: "Transporter mit Fahrer – flexibel buchbar.",
                },
                {
                  title: "Gebäudereinigung",
                  desc: "Grund- & Unterhaltsreinigung für Haus & Büro.",
                },
                {
                  title: "Hausmeisterservice",
                  desc: "Reparaturen, Pflege & Winterdienst.",
                },
              ].map((card, i) => (
                <A
                  key={i}
                  href={`/leistungen#${encodeURIComponent(card.title)}`}
                  className="group rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-transform"
                >
                  <div className="p-5 md:p-7">
                    <h3 className="text-lg md:text-xl font-bold tracking-tight flex items-center gap-2">
                      {card.title}
                      <ArrowRight
                        className="opacity-0 group-hover:opacity-100 transition text-orange-600 translate-x-0 group-hover:translate-x-0.5"
                        size={18}
                        aria-hidden="true"
                      />
                    </h3>
                    <p className="mt-2 text-slate-600 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </A>
              ))}
            </div>
            <div className="mt-8">
              <A
                href="/leistungen"
                className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-6 py-3 text-white font-semibold shadow hover:bg-orange-700 transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
              >
                Alle Leistungen ansehen{" "}
                <ArrowRight size={18} aria-hidden="true" />
              </A>
            </div>
          </div>
        </section>

        {/* Vorher / Nachher */}
        <section className="bg-gradient-to-b from-white to-slate-50">
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-28">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                Ergebnisse auf einen Blick
              </h2>
              <p className="mt-3 text-slate-600 leading-relaxed">
                Mit unserer Arbeit verwandeln wir Chaos in Ordnung. Hier ein Beispiel aus einem realen Auftrag.
              </p>
            </div>

            <div className="mt-12 grid md:grid-cols-2 gap-8">
              {/* Vorher */}
              <figure className="group relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-lg transition">
                <img
                  loading="lazy"
                  alt="Vorher"
                  src="/vorher.png"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <figcaption className="absolute top-3 left-3 rounded-full bg-slate-900/80 text-white text-xs px-3 py-1.5 font-medium shadow">
                  Vorher
                </figcaption>
              </figure>

              {/* Nachher */}
              <figure className="group relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-lg transition">
                <img
                  loading="lazy"
                  alt="Nachher"
                  src="/nacher.png"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <figcaption className="absolute top-3 left-3 rounded-full bg-orange-600 text-white text-xs px-3 py-1.5 font-medium shadow">
                  Nachher
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* Vorteile */}
        <section
          id="vorteile"
          className="bg-slate-50 scroll-mt-[var(--header-h)]"
        >
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-28 grid lg:grid-cols-2 gap-10 md:gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                Darum reset. in Schwerin
              </h2>
              <ul className="mt-6 space-y-4">
                {[
                  "Kostenloser Vor-Ort-Termin oder WhatsApp-Video",
                  "Fester Ansprechpartner – keine Callcenter",
                  "Transparenter Festpreis ohne Überraschungen",
                  "Sorgfältige Trennung, Entsorgung & besenrein",
                ].map((v, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle
                      className="mt-0.5 text-orange-600"
                      aria-hidden="true"
                    />
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
              <A
                href="#angebot"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-white font-semibold shadow hover:bg-slate-800 transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
              >
                Angebot sichern <ArrowRight size={18} aria-hidden="true" />
              </A>
            </div>
            <div
              className="rounded-2xl overflow-hidden shadow-xl border bg-[url('https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center min-h-[320px]"
              aria-hidden="true"
            />
          </div>
        </section>

        {/* Preise */}
        <section
          id="preise"
          className="bg-gradient-to-b from-white to-slate-50 scroll-mt-[var(--header-h)]"
        >
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-28">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Beispielpreise
            </h2>
            <p className="mt-2 text-slate-600 leading-relaxed">
              Jeder Auftrag ist individuell – diese Pakete helfen bei der
              Orientierung.
            </p>
            <div className="mt-8 md:mt-10 grid md:grid-cols-3 gap-4 md:gap-6">
              {[
                {
                  name: "Schnell & Klein",
                  price: "ab 199€",
                  points: ["Kellerabteil", "1–2m³ Entsorgung", "Besenrein"],
                },
                {
                  name: "Wohnung",
                  price: "ab 799€",
                  points: [
                    "2–3 Zimmer",
                    "Wertanrechnung möglich",
                    "Besenrein + Entsorgung",
                  ],
                },
                {
                  name: "Haus komplett",
                  price: "ab 1.999€",
                  points: ["120–160 m²", "Mehrtageseinsatz", "inkl. Abtransport"],
                },
              ].map((p, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200/80 shadow-sm p-6"
                >
                  <h3 className="text-xl font-bold">{p.name}</h3>
                  <div className="mt-2 text-3xl font-black text-orange-600">
                    {p.price}
                  </div>
                  <ul className="mt-4 space-y-2 text-slate-700">
                    {p.points.map((pt, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <CheckCircle
                          className="text-orange-600"
                          size={18}
                          aria-hidden="true"
                        />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <A
                    href="#angebot"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-2.5 text-white font-semibold shadow hover:bg-orange-700 transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
                  >
                    Angebot anfordern{" "}
                    <ArrowRight size={18} aria-hidden="true" />
                  </A>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bewertungen */}
        <section className="bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-28">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Was Kund:innen sagen
            </h2>
            <div className="mt-6 md:mt-8 grid md:grid-cols-3 gap-4 md:gap-6">
              {[
                {
                  name: "M. Mancic",
                  text: "Schnelle Rückmeldung, top Team – Wohnung innerhalb eines Tages komplett leer & besenrein.",
                  stars: 5,
                },
                {
                  name: "Pflegeheim an der Mühle",
                  text: "Seit Jahren zuverlässige Unterstützung bei Räumungen – absolut zu empfehlen.",
                  stars: 5,
                },
                {
                  name: "OBSCURA21",
                  text: "Professionell, pünktlich, fairer Preis. Gerne wieder!",
                  stars: 5,
                },
              ].map((r, i) => (
                <figure
                  key={i}
                  className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
                >
                  <div
                    className="flex items-center gap-1"
                    aria-label={`${r.stars} Sterne`}
                  >
                    {Array.from({ length: r.stars || 0 }).map((_, k) => (
                      <Star
                        key={k}
                        size={18}
                        className="text-orange-600 fill-orange-600"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <blockquote className="mt-3 text-slate-700">
                    “{r.text}”
                  </blockquote>
                  <figcaption className="mt-3 text-sm text-slate-500">
                    — {r.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ==== Divider: slate-50 → white (oben, weicher Übergang) ==== */}
        <div aria-hidden="true" className="bg-slate-50">
          <svg
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            className="block w-full h-12 md:h-16 text-white"
          >
            <path
              fill="currentColor"
              d="M0,64 C240,0 480,128 720,64 C960,0 1200,64 1440,32 L1440,100 L0,100 Z"
            />
          </svg>
        </div>

        {/* ==== Kontakt & Angebot (neutral, weich) ==== */}
        <section
          id="angebot"
          className="relative isolate scroll-mt-[var(--header-h)] bg-white"
        >
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24 grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Linke Spalte: Formular */}
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                Kostenloses Angebot in 2 Minuten
              </h2>
              <p className="mt-2 text-slate-600 leading-relaxed">
                Schicken Sie uns Eckdaten & optional Fotos/Video per WhatsApp. Wir melden uns zeitnah.
              </p>

              <form onSubmit={(e) => e.preventDefault()} className="mt-6 md:mt-8 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    className="w-full rounded-xl border px-4 py-3 shadow-sm focus:ring-2 focus:ring-orange-500"
                    placeholder="Ihr Name"
                    aria-label="Ihr Name"
                    name="name"
                    autoComplete="name"
                    required
                  />
                  <input
                    className="w-full rounded-xl border px-4 py-3 shadow-sm focus:ring-2 focus:ring-orange-500"
                    placeholder="Ihre E-Mail"
                    type="email"
                    aria-label="Ihre E-Mail"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                  />
                </div>

                <input
                  className="w-full rounded-xl border px-4 py-3 shadow-sm focus:ring-2 focus:ring-orange-500"
                  placeholder="Telefon (für Rückfragen)"
                  aria-label="Telefon (für Rückfragen)"
                  type="tel"
                  inputMode="tel"
                  name="phone"
                  autoComplete="tel"
                />

                <textarea
                  className="w-full rounded-xl border px-4 py-3 shadow-sm focus:ring-2 focus:ring-orange-500"
                  placeholder="Was sollen wir wo erledigen?"
                  rows={5}
                  aria-label="Nachricht"
                  name="message"
                  required
                />

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-6 py-3 text-white font-semibold shadow hover:bg-orange-700 transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
                  >
                    Angebot anfordern <ArrowRight size={18} aria-hidden="true" />
                  </button>

                  <A
                    href={business.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-white font-semibold shadow hover:bg-emerald-700 transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-600"
                  >
                    <MessageCircle size={18} aria-hidden="true" /> WhatsApp Anfrage
                  </A>
                </div>

                {/* Vertrauenshinweise */}
                <ul className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <Shield size={16} aria-hidden="true" /> Unverbindlich & diskret
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Clock size={16} aria-hidden="true" /> Antwort meist in 24–48h
                  </li>
                </ul>

                <p className="text-xs text-slate-500 mt-2">
                  Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäß{" "}
                  <A className="underline" href="#" variant="link">Datenschutzerklärung</A> zu.
                </p>
              </form>
            </div>

            {/* Rechte Spalte: Kontakt + Karte */}
            <div className="rounded-2xl ring-1 ring-slate-200/60 bg-white p-6 md:p-7 shadow-md">
              <h3 className="text-2xl font-bold tracking-tight">Kontakt</h3>

              <div className="mt-4 grid gap-3 text-slate-700">
                <p className="flex items-center gap-2">
                  <Phone size={18} aria-hidden="true" /> {business.phoneHuman}
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={18} aria-hidden="true" /> {business.email}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={18} aria-hidden="true" />
                  {business.address.street}, {business.address.zip} {business.address.city}
                </p>
              </div>

              {/* Karte mit Servicegebiet + Legende */}
              <div className="mt-6 aspect-video w-full rounded-xl overflow-hidden ring-1 ring-slate-200/70 shadow-inner">
                <ServiceAreaMap radiusMeters={25000} />
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-orange-600 ring-2 ring-orange-200" aria-hidden="true" />
                <span>Servicegebiet: Schwerin & umliegende Orte</span>
              </div>

              <p className="mt-3 text-sm text-slate-500">
                Termine Mo–Fr 07:00–20:00 Uhr, Sa nach Vereinbarung
              </p>
            </div>
          </div>
        </section>


        {/* ==== Divider unten: feine Haarlinie (white → white) ==== */}
        <div aria-hidden="true" className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>

        {/* FAQ */}
        <section id="faq" className="bg-white scroll-mt-[var(--header-h)]">
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-28">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Häufige Fragen
            </h2>

            <div className="mt-6 md:mt-8 grid md:grid-cols-2 gap-4 md:gap-6">
              {[
                {
                  q: "Wie läuft die Besichtigung ab?",
                  a: "Auf Wunsch digital via WhatsApp-Video oder vor Ort. Danach erhalten Sie ein Festpreis-Angebot.",
                },
                {
                  q: "Entsorgen Sie alles fachgerecht?",
                  a: "Ja, wir trennen sorgfältig und entsorgen nach gesetzlichen Vorgaben – inkl. Nachweis.",
                },
                {
                  q: "Gibt es Wertanrechnung?",
                  a: "Ja, werthaltige Gegenstände werden auf Wunsch angerechnet und mindern den Preis.",
                },
                {
                  q: "Wie schnell sind Termine frei?",
                  a: "In der Regel innerhalb von 48 Stunden – je nach Umfang.",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200/80 p-6 shadow-sm"
                >
                  <h3 className="font-bold">{f.q}</h3>
                  <p className="mt-2 text-slate-600 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Sticky CTA / Mobile Bottom Bar (WhatsApp mittig) */}
      <div className="sticky bottom-0 z-50 bg-white/95 backdrop-blur shadow-[0_-12px_30px_-12px_rgba(0,0,0,0.25)] ring-1 ring-slate-200/60">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-2.5 flex items-center justify-between gap-3">
          {/* Desktop Hinweis + Buttons */}
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-700">
            <Shield size={16} aria-hidden="true" /> Unverbindlich & diskret
          </div>
          <div className="hidden md:flex items-center gap-2">
            <A
              href={business.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-white font-semibold shadow hover:bg-emerald-700 transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-600"
            >
              <MessageCircle size={18} aria-hidden="true" /> WhatsApp
            </A>
            <A
              href="#angebot"
              className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-2.5 text-white font-semibold shadow hover:bg-orange-700 transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
            >
              Jetzt kostenlos anfragen{" "}
              <ArrowRight size={18} aria-hidden="true" />
            </A>
          </div>

          {/* Mobile: 3-Aktions-Leiste */}
          <div className="md:hidden grid grid-cols-3 gap-2 w-full">
            <A
              href={`tel:${business.phoneLink}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl ring-1 ring-slate-300 bg-white px-2 py-2 text-sm font-medium shadow-sm hover:bg-slate-50"
              aria-label="Anrufen"
            >
              <Phone size={18} aria-hidden="true" /> Anruf
            </A>
            <A
              href={business.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-2 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
              aria-label="WhatsApp Chat starten"
            >
              <MessageCircle size={18} aria-hidden="true" /> WhatsApp
            </A>
            <A
              href="#angebot"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-2 py-2 text-sm font-semibold text-white shadow hover:bg-orange-700"
              aria-label="Angebot anfordern"
            >
              <Sparkles size={18} aria-hidden="true" /> Angebot
            </A>
          </div>
        </div>
      </div>

      {/* Footer (weich, ohne harte Linien) */}
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
              <li>
                <A href="#" variant="link">
                  Impressum
                </A>
              </li>
              <li>
                <A href="#" variant="link">
                  Datenschutzerklärung
                </A>
              </li>
              <li>
                <A href="#" variant="link">
                  AGB
                </A>
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 md:px-8 pb-10">
          <div className="rounded-2xl bg-white/70 ring-1 ring-slate-200/60 shadow-sm p-4 md:p-5 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-slate-600">
              © {new Date().getFullYear()} reset. Alle Rechte vorbehalten.
            </span>
            <span className="text-sm text-slate-600">Made with ❤️ in Schwerin</span>
          </div>
        </div>
      </footer>

      {/* Runtime Smoke Tests (stabile Variante ohne JSX-Children) */}
      {(() => {
        const code = `
          try {
            const params = new URLSearchParams(window.location.search);
            if (params.has('test')) {
              const html = document.documentElement.outerHTML;
              const hasHeroCTA = /Jetzt kostenloses Angebot/.test(html);
              const hasStickyCTA = /Jetzt kostenlos anfragen|Angebot/.test(html);
              const serviceLinks = Array.from(document.querySelectorAll('a[href^="/leistungen#"], section#leistungen a'));
              const serviceCount = serviceLinks.length >= 6;
              const hasWa = /wa\\.me\\//.test(html);
              const stars = document.querySelectorAll('svg').length > 0;
              const jsonLdEl = document.getElementById('ld-localbusiness');
              let ldOk = false;
              try {
                if (jsonLdEl?.textContent) {
                  const parsed = JSON.parse(jsonLdEl.textContent);
                  ldOk = parsed && parsed['@type'] === 'LocalBusiness' && !!parsed.name;
                }
              } catch {}
              const hasOrangeButtons = /bg-orange-6\\d\\d/.test(html);
              console.log(JSON.stringify({ hasHeroCTA, hasStickyCTA, serviceCount, hasWa, stars, ldOk, hasOrangeButtons }));
            }
          } catch (e) { console.warn('[SmokeTests] Non-fatal:', e); }
        `;
        return (
          <Script
            id="smoke-tests"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: code }}
          />
        );
      })()}
    </div>
  );
}
