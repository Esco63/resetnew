"use client";

import React, { useEffect, useState } from "react";
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
} from "lucide-react";

/**
 * Ultra Landing Page – reset. Schwerin (SSR-safe)
 *
 * Hinweise:
 * - In globals.css ergänzen:
 *   html { scroll-behavior: smooth; }
 *   body { font-synthesis-weight: none; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
 */

export default function UltraLanding() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const ld = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "reset. Schwerin",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Schwerin",
      postalCode: "19053",
      streetAddress: "Musterstraße 1",
      addressCountry: "DE",
    },
    telephone: "+49 385 55512345",
    url: "https://reset-schwerin.example",
    sameAs: ["https://wa.me/491721234567"],
    openingHours: ["Mo-Fr 07:00-20:00", "Sa 09:00-15:00"],
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "07:00", closes: "20:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "09:00", closes: "15:00" },
    ],
    areaServed: "Schwerin & Umgebung",
    priceRange: "€€",
  };

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
        <div className="mx-auto max-w-7xl px-6 md:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin size={16} aria-hidden="true" /> Schwerin & Umgebung
            </span>
            <a
              href="mailto:info@reset-schwerin.de"
              className="flex items-center gap-1 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
            >
              <Mail size={16} aria-hidden="true" /> info@reset-schwerin.de
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:+4938555512345"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-3 py-1.5 font-medium shadow hover:bg-orange-600 transition active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
            >
              <Phone size={16} aria-hidden="true" /> 0385 555 12345
            </a>
            <a
              href="https://wa.me/491721234567?text=Hallo%20reset.%20Anfrage%20aus%20Schwerin"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-3 py-1.5 font-medium shadow hover:bg-orange-600 transition active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
            >
              <Phone size={16} aria-hidden="true" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-slate-200/70">
        <div className="mx-auto max-w-7xl px-6 md:px-8 py-3.5 flex items-center justify-between">
          <a
            href="#"
            className="text-2xl font-black tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
          >
            <span className="text-slate-900">re</span>
            <span className="text-orange-600">set.</span>
          </a>
          <nav
            aria-label="Hauptnavigation"
            className="hidden md:flex items-center gap-6 font-medium"
          >
            <a href="#leistungen" className="hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600">
              Leistungen
            </a>
            <a href="#vorteile" className="hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600">
              Vorteile
            </a>
            <a href="#preise" className="hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600">
              Preise
            </a>
            <a href="#faq" className="hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600">
              FAQ
            </a>
            <a href="#kontakt" className="hover:text-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600">
              Kontakt
            </a>
            <a
              href="#angebot"
              className="ml-2 inline-flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-white shadow hover:bg-orange-700 transition active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
            >
              Angebot anfordern <ArrowRight size={18} aria-hidden="true" />
            </a>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main id="main">
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-white to-slate-50">
          <div
            className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"
            aria-hidden="true"
          />
          <div className="absolute inset-0 -z-10 bg-black/50" aria-hidden="true" />
          <div className="mx-auto max-w-7xl px-6 md:px-8 py-24 md:py-28 text-white">
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
                mounted ? "motion-safe:animate-fade-in motion-safe:[animation-delay:100ms]" : "opacity-0"
              }`}
            >
              Haushaltsauflösungen, Entrümpelungen, Umzüge, Gebäudereinigung & Hausmeisterservice – diskret, versichert & zum fairen Festpreis.
            </p>
            <div
              className={`mt-8 flex flex-wrap items-center gap-4 ${
                mounted ? "motion-safe:animate-fade-in motion-safe:[animation-delay:200ms]" : "opacity-0"
              }`}
            >
              <a
                href="#angebot"
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg hover:bg-orange-600 transition active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
              >
                <Sparkles size={20} aria-hidden="true" /> Jetzt kostenloses Angebot
              </a>
              <a
                href="#leistungen"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur hover:bg-white/20 transition active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
              >
                Mehr erfahren
              </a>
            </div>
            <div
              className={`mt-8 flex flex-wrap items-center gap-6 text-sm text-white/80 ${
                mounted ? "motion-safe:animate-fade-in motion-safe:[animation-delay:300ms]" : "opacity-0"
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
          <div className="mx-auto max-w-7xl px-6 md:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {["Festpreis-Angebot","Diskret & zuverlässig","WhatsApp-Bildercheck","Besenreine Übergabe"].map((t,i)=> (
              <div
                key={i}
                className="flex items-center gap-2 rounded-xl ring-1 ring-slate-200/70 bg-white p-3 md:p-4 shadow-sm hover:shadow-md transition hover:-translate-y-0.5"
              >
                <CheckCircle className="shrink-0 text-orange-600" aria-hidden="true"/>
                <span className="font-medium">{t}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Leistungen grid */}
        <section id="leistungen" className="bg-slate-50 scroll-mt-[var(--header-h)]">
          <div className="mx-auto max-w-7xl px-6 md:px-8 py-24 md:py-28">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Unsere Leistungen</h2>
            <p className="mt-2 text-slate-600 leading-relaxed">Alles aus einer Hand – für Ihren Neuanfang in Schwerin.</p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {title:"Haushaltsauflösungen", desc:"Schnell, sauber & mit Wertanrechnung."},
                {title:"Entrümpelungen", desc:"Keller, Dachboden, Garage – wir schaffen Platz."},
                {title:"Umzüge", desc:"Stressfrei mit Fahrer & passendem Fahrzeug."},
                {title:"Fahrzeugvermietung", desc:"Transporter mit Fahrer – flexibel buchbar."},
                {title:"Gebäudereinigung", desc:"Grund- & Unterhaltsreinigung für Haus & Büro."},
                {title:"Hausmeisterservice", desc:"Reparaturen, Pflege & Winterdienst."},
              ].map((card,i)=> (
                <a
                  key={i}
                  href={`/leistungen#${encodeURIComponent(card.title)}`}
                  className="group rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-transform"
                >
                  <div className="p-6 md:p-7">
                    <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                      {card.title}
                      <ArrowRight
                        className="opacity-0 group-hover:opacity-100 transition text-orange-600 translate-x-0 group-hover:translate-x-0.5"
                        size={18}
                        aria-hidden="true"
                      />
                    </h3>
                    <p className="mt-2 text-slate-600 leading-relaxed">{card.desc}</p>
                  </div>
                </a>
              ))}
            </div>
            <div className="mt-8">
              <a
                href="/leistungen"
                className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-6 py-3 text-white font-semibold shadow hover:bg-orange-700 transition active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
              >
                Alle Leistungen ansehen <ArrowRight size={18} aria-hidden="true"/>
              </a>
            </div>
          </div>
        </section>

        {/* Before/After */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-6 md:px-8 py-24 md:py-28 grid lg:grid-cols-2 gap-10 items-center">
            <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow relative">
              <img
                loading="lazy"
                alt="Vorher"
                src="https://images.unsplash.com/photo-1616486943872-8ef7d1d41b66?q=80&w=1600&auto=format&fit=crop"
                className="h-full w-full object-cover opacity-90"
              />
              <span className="absolute top-3 left-3 rounded-full bg-slate-900/80 text-white text-xs px-2 py-1">
                Vorher
              </span>
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow relative">
              <img
                loading="lazy"
                alt="Nachher"
                src="https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1600&auto=format&fit=crop"
                className="h-full w-full object-cover"
              />
              <span className="absolute top-3 left-3 rounded-full bg-orange-600 text-white text-xs px-2 py-1">
                Nachher
              </span>
            </div>
          </div>
        </section>

        {/* Vorteile */}
        <section id="vorteile" className="bg-slate-50 scroll-mt-[var(--header-h)]">
          <div className="mx-auto max-w-7xl px-6 md:px-8 py-24 md:py-28 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">Darum reset. in Schwerin</h2>
              <ul className="mt-6 space-y-4">
                {[
                  "Kostenloser Vor-Ort-Termin oder WhatsApp-Video",
                  "Fester Ansprechpartner – keine Callcenter",
                  "Transparenter Festpreis ohne Überraschungen",
                  "Sorgfältige Trennung, Entsorgung & besenrein",
                ].map((v,i)=> (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 text-orange-600" aria-hidden="true"/>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#angebot"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-white font-semibold shadow hover:bg-slate-800 transition active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
              >
                Angebot sichern <ArrowRight size={18} aria-hidden="true"/>
              </a>
            </div>
            <div
              className="rounded-2xl overflow-hidden shadow-xl border bg-[url('https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center min-h-[320px]"
              aria-hidden="true"
            />
          </div>
        </section>

        {/* Preise Teaser */}
        <section id="preise" className="bg-gradient-to-b from-white to-slate-50 scroll-mt-[var(--header-h)]">
          <div className="mx-auto max-w-7xl px-6 md:px-8 py-24 md:py-28">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Beispielpreise</h2>
            <p className="mt-2 text-slate-600 leading-relaxed">
              Jeder Auftrag ist individuell – diese Pakete helfen bei der Orientierung.
            </p>
            <div className="mt-10 grid md:grid-cols-3 gap-6">
              {[
                {name:"Schnell & Klein", price:"ab 199€", points:["Kellerabteil","1–2m³ Entsorgung","Besenrein"]},
                {name:"Wohnung", price:"ab 799€", points:["2–3 Zimmer","Wertanrechnung möglich","Besenrein + Entsorgung"]},
                {name:"Haus komplett", price:"ab 1.999€", points:["120–160 m²","Mehrtageseinsatz","inkl. Abtransport"]},
              ].map((p,i)=> (
                <div key={i} className="rounded-2xl border border-slate-200/80 shadow-sm p-6">
                  <h3 className="text-xl font-bold">{p.name}</h3>
                  <div className="mt-2 text-3xl font-black text-orange-600">{p.price}</div>
                  <ul className="mt-4 space-y-2 text-slate-700">
                    {p.points.map((pt,j)=> (
                      <li key={j} className="flex items-center gap-2">
                        <CheckCircle className="text-orange-600" size={18} aria-hidden="true"/>{pt}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#angebot"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-2.5 text-white font-semibold shadow hover:bg-orange-700 transition active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
                  >
                    Angebot anfordern <ArrowRight size={18} aria-hidden="true"/>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bewertungen */}
        <section className="bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 md:px-8 py-24 md:py-28">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Was Kund:innen sagen</h2>
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              {[
                {name:"M. Mancic", text:"Schnelle Rückmeldung, top Team – Wohnung innerhalb eines Tages komplett leer & besenrein.", stars:5},
                {name:"Pflegeheim an der Mühle", text:"Seit Jahren zuverlässige Unterstützung bei Räumungen – absolut zu empfehlen.", stars:5},
                {name:"OBSCURA21", text:"Professionell, pünktlich, fairer Preis. Gerne wieder!", stars:5},
              ].map((r,i)=> (
                <figure key={i} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-1" aria-label={`${r.stars} Sterne`}>
                    {Array.from({length: r.stars || 0}).map((_,k)=>(
                      <Star key={k} size={18} className="text-orange-600 fill-orange-600" aria-hidden="true"/>
                    ))}
                  </div>
                  <blockquote className="mt-3 text-slate-700">“{r.text}”</blockquote>
                  <figcaption className="mt-3 text-sm text-slate-500">— {r.name}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Kontakt & Angebot */}
        <section id="angebot" className="relative isolate scroll-mt-[var(--header-h)]">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-50 to-slate-50" aria-hidden="true" />
          <div className="mx-auto max-w-7xl px-6 md:px-8 py-24 md:py-28 grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">Kostenloses Angebot in 2 Minuten</h2>
              <p className="mt-2 text-slate-600 leading-relaxed">
                Schicken Sie uns Eckdaten & optional Fotos/Video per WhatsApp. Wir melden uns zeitnah.
              </p>
              <form onSubmit={(e)=>e.preventDefault()} className="mt-8 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input className="w-full rounded-xl border px-4 py-3" placeholder="Ihr Name" aria-label="Ihr Name"/>
                  <input className="w-full rounded-xl border px-4 py-3" placeholder="Ihre E-Mail" type="email" aria-label="Ihre E-Mail"/>
                </div>
                <input className="w-full rounded-xl border px-4 py-3" placeholder="Telefon (für Rückfragen)" aria-label="Telefon (für Rückfragen)"/>
                <textarea className="w-full rounded-xl border px-4 py-3" placeholder="Was sollen wir wo erledigen?" rows={5} aria-label="Nachricht"/>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-6 py-3 text-white font-semibold shadow hover:bg-orange-700 transition active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
                    type="submit"
                  >
                    Angebot anfordern <ArrowRight size={18} aria-hidden="true"/>
                  </button>
                  <a
                    href="https://wa.me/491721234567?text=Hallo%20reset.%20ich%20habe%20eine%20Anfrage%20in%20Schwerin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-white font-semibold shadow hover:bg-orange-600 transition active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
                  >
                    <Phone size={18} aria-hidden="true"/> WhatsApp Anfrage
                  </a>
                </div>
                <p className="text-xs text-slate-500">
                  Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäß{" "}
                  <a className="underline" href="#">Datenschutzerklärung</a> zu.
                </p>
              </form>
            </div>
            <div id="kontakt" className="rounded-2xl border bg-white p-6 shadow-sm scroll-mt-[var(--header-h)]">
              <h3 className="text-2xl font-bold tracking-tight">Kontakt</h3>
              <div className="mt-4 space-y-3 text-slate-700">
                <p className="flex items-center gap-2"><Phone size={18} aria-hidden="true"/> 0385 555 12345</p>
                <p className="flex items-center gap-2"><Mail size={18} aria-hidden="true"/> info@reset-schwerin.de</p>
                <p className="flex items-center gap-2"><MapPin size={18} aria-hidden="true"/> Musterstraße 1, 19053 Schwerin</p>
              </div>
              <div className="mt-6 aspect-video w-full rounded-xl bg-slate-100" aria-label="Karte Schwerin"></div>
              <p className="mt-3 text-sm text-slate-500">Termine Mo–Fr 07:00–20:00 Uhr, Sa nach Vereinbarung</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-white scroll-mt-[var(--header-h)]">
          <div className="mx-auto max-w-7xl px-6 md:px-8 py-24 md:py-28">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Häufige Fragen</h2>

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              {[
                {q:"Wie läuft die Besichtigung ab?", a:"Auf Wunsch digital via WhatsApp-Video oder vor Ort. Danach erhalten Sie ein Festpreis-Angebot."},
                {q:"Entsorgen Sie alles fachgerecht?", a:"Ja, wir trennen sorgfältig und entsorgen nach gesetzlichen Vorgaben – inkl. Nachweis."},
                {q:"Gibt es Wertanrechnung?", a:"Ja, werthaltige Gegenstände werden auf Wunsch angerechnet und mindern den Preis."},
                {q:"Wie schnell sind Termine frei?", a:"In der Regel innerhalb von 48 Stunden – je nach Umfang."},
              ].map((f,i)=> (
                <div key={i} className="rounded-2xl border border-slate-200/80 p-6 shadow-sm">
                  <h3 className="font-bold">{f.q}</h3>
                  <p className="mt-2 text-slate-600 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 z-50 border-t bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 md:px-8 py-3 flex items-center justify-between gap-3">
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-700">
            <Shield size={16} aria-hidden="true" /> Unverbindlich & diskret
          </div>
          <a
            href="#angebot"
            className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-2.5 text-white font-semibold shadow hover:bg-orange-700 transition active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
          >
            Jetzt kostenlos anfragen <ArrowRight size={18} aria-hidden="true"/>
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-6 md:px-8 py-10 grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-black tracking-tight">
              <span className="text-slate-900">re</span><span className="text-orange-600">set.</span>
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
                <a href="#" className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600">Impressum</a>
              </li>
              <li>
                <a href="#" className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600">Datenschutzerklärung</a>
              </li>
              <li>
                <a href="#" className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600">AGB</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t">
          <div className="mx-auto max-w-7xl px-6 md:px-8 py-6 text-sm text-slate-500 flex flex-wrap items-center justify-between gap-3">
            <span>© {new Date().getFullYear()} reset. Alle Rechte vorbehalten.</span>
            <span>Made with ❤️ in Schwerin</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// -----------------------------
// Runtime Smoke Tests (non-breaking)
if (typeof window !== "undefined") {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has("test")) {
      const html = document.documentElement.outerHTML;
      const hasHeroCTA = /Jetzt kostenloses Angebot/.test(html);
      const hasStickyCTA = /Jetzt kostenlos anfragen/.test(html);
      const serviceLinks = Array.from(document.querySelectorAll('a[href^="/leistungen#"], section#leistungen a'));
      const serviceCount = serviceLinks.length >= 6;
      const hasWa = /wa\.me\//.test(html);
      const stars = document.querySelectorAll('svg').length > 0;
      const jsonLdEl = document.getElementById('ld-localbusiness');
      let ldOk = false;
      try {
        if (jsonLdEl?.textContent) {
          const parsed = JSON.parse(jsonLdEl.textContent);
          ldOk = parsed && parsed["@type"] === "LocalBusiness" && !!parsed.name;
        }
      } catch {}
      const hasOrangeButtons = /bg-orange-6\d\d/.test(html);
      console.log(JSON.stringify({ hasHeroCTA, hasStickyCTA, serviceCount, hasWa, stars, ldOk, hasOrangeButtons }));
    }
  } catch (e) {
    console.warn("[SmokeTests] Non-fatal:", e);
  }
}
