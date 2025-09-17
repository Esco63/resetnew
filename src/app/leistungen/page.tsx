"use client";

import {
  ArrowRight,
  CheckCircle,
  Truck,
  Sparkles,
  Home,
  Package,
  Brush,
  Hammer,
  Menu,
  X,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";

export default function LeistungenPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Kontakt / Business Daten (wie Landing)
  const business = {
    name: "reset. Schwerin",
    phoneHuman: "0176 / 72190267",
    phoneLink: "+017672190267",
    whatsappLink:
      "https://wa.me/4917672190267?text=Hallo%20reset.%20Anfrage%20aus%20Schwerin",
    email: "info@reset-service.de",
  } as const;

  const leistungen = [
    {
      title: "Haushaltsauflösungen",
      desc:
        "Komplette Auflösung von Wohnungen und Häusern – diskret, sorgfältig und mit dokumentierter Entsorgung. Auf Wunsch rechnen wir werthaltige Gegenstände an und übergeben besenrein.",
      bullets: [
        "Kostenlose Besichtigung oder WhatsApp-Video",
        "Wertanrechnung zur Preisreduktion möglich",
        "Nachweis der fachgerechten Entsorgung",
      ],
      icon: Home,
      image:
        "/haushaltsauflösung.png",
    },
    {
      title: "Entrümpelungen",
      desc:
        "Wir schaffen Platz in Keller, Dachboden, Garage oder Gewerberäumen. Sicheres Tragen, Sortieren & Abtransport inklusive – schnell und zum fairen Festpreis.",
      bullets: [
        "Kurzfristige Termine (oft 24–48h)",
        "Trennung von Holz, Metall, Elektroschrott",
        "Saubere Übergabe der Räumlichkeiten",
      ],
      icon: Package,
      image:
        "/entrümpeln.png",
    },
    {
      title: "Umzüge",
      desc:
        "Vom Single-Umzug bis zur Familienwohnung: Unser eingespieltes Team mit eigenen Fahrzeugen sorgt für einen reibungslosen Ablauf – auf Wunsch inkl. Verpackung & Montage.",
      bullets: [
        "Transporter mit Fahrer & Tragehelfer",
        "Schutzmaterial & Sicherung im Fahrzeug",
        "Optionale Möbelmontage und Aufbau",
      ],
      icon: Truck,
      image:
        "/umzüge.png",
    },
    {
      title: "Fahrzeugvermietung",
      desc:
        "Flexibel buchbare Transporter mit Fahrer – ideal für Umzüge, Abholungen oder Kurierfahrten. Transparent nach Stunden- oder Tagessatz abrechenbar.",
      bullets: [
        "Fahrer inklusive – kein Führerscheinstress",
        "Flexible Zeitfenster & faire Kilometer",
        "Hilfe beim Laden und Sichern",
      ],
      icon: Sparkles,
      image:
        "/fahrzeug.png",
    },
    {
      title: "Gebäudereinigung",
      desc:
        "Gründliche Grund- und Unterhaltsreinigung für privat & gewerblich. Von der Endreinigung nach Auszug bis zur regelmäßigen Objektpflege.",
      bullets: [
        "Individuelle Leistungsverzeichnisse",
        "Umweltbewusste Reinigungsmittel",
        "Terminpläne nach Bedarf (wöchentlich/monatlich)",
      ],
      icon: Brush,
      image:
        "/gebäudereinigung.png",
    },
    {
      title: "Hausmeisterservice",
      desc:
        "Zuverlässige Betreuung von Objekten: Kleinreparaturen, Pflege & saisonale Dienste – damit Immobilien wertstabil und gepflegt bleiben.",
      bullets: [
        "Kleinreparaturen & Instandhaltung",
        "Grünflächenpflege & Treppenhaus",
        "Winterdienst nach Absprache",
      ],
      icon: Hammer,
      image:
        "/hausmeister.png",
    },
  ];

  return (
    <div className="bg-white text-slate-900">
      {/* Header/NavBar wie Landing */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-slate-200/70">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-3.5 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
          >
            <span className="text-slate-900">re</span>
            <span className="text-orange-600">set.</span>
          </Link>

          {/* Desktop Nav */}
          <nav
            aria-label="Hauptnavigation"
            className="hidden md:flex items-center gap-6 font-medium"
          >
            <Link href="/leistungen" className="hover:text-orange-600">
              Leistungen
            </Link>
            <Link href="/#vorteile" className="hover:text-orange-600">
              Vorteile
            </Link>
            <Link href="/#preise" className="hover:text-orange-600">
              Preise
            </Link>
            <Link href="/#faq" className="hover:text-orange-600">
              FAQ
            </Link>
            <Link href="/#kontakt" className="hover:text-orange-600">
              Kontakt
            </Link>
            <Link
              href="/#angebot"
              className="ml-1 inline-flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-white shadow hover:bg-orange-700 transition"
            >
              Angebot anfordern <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </nav>

          {/* Mobile Burger */}
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

        {/* Mobile Menu */}
        {mobileNavOpen && (
          <div
            id="mobile-menu"
            className="md:hidden border-t border-slate-200 bg-white"
          >
            <div className="mx-auto max-w-7xl px-4 py-3 grid gap-3 text-base">
              <Link href="/leistungen" onClick={() => setMobileNavOpen(false)}>
                Leistungen
              </Link>
              <Link href="/#vorteile" onClick={() => setMobileNavOpen(false)}>
                Vorteile
              </Link>
              <Link href="/#preise" onClick={() => setMobileNavOpen(false)}>
                Preise
              </Link>
              <Link href="/#faq" onClick={() => setMobileNavOpen(false)}>
                FAQ
              </Link>
              <Link href="/#kontakt" onClick={() => setMobileNavOpen(false)}>
                Kontakt
              </Link>
              <Link
                href="/#angebot"
                onClick={() => setMobileNavOpen(false)}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-white shadow hover:bg-orange-700"
              >
                Angebot anfordern <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-gradient-to-b from-orange-50 to-white">
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-28 text-center">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">
              Unsere <span className="text-orange-600">Leistungen</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed">
              Alles aus einer Hand – zuverlässig, diskret und zu fairen
              Festpreisen.
            </p>
          </div>
        </section>

        {/* Leistungen Grid mit Bildern & Details */}
        <section className="bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-28">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {leistungen.map((l, i) => (
                <div
                  key={i}
                  className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition"
                >
                  {/* Bild */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={l.image}
                      alt={l.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Inhalt */}
                  <div className="flex-1 p-6 pb-20">
                    <l.icon
                      className="w-10 h-10 text-orange-600 mb-4"
                      aria-hidden="true"
                    />
                    <h3 className="text-xl font-bold tracking-tight">
                      {l.title}
                    </h3>
                    <p className="mt-2 text-slate-600 leading-relaxed">
                      {l.desc}
                    </p>
                    <ul className="mt-4 space-y-2 text-slate-700">
                      {l.bullets.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle
                            className="mt-0.5 text-orange-600"
                            size={18}
                            aria-hidden="true"
                          />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Fixierter CTA unten rechts */}
                  <div className="absolute bottom-0 right-0 p-4">
                    <Link
                      href="/#angebot"
                      className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-2.5 text-white font-semibold shadow hover:bg-orange-700 transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
                    >
                      Angebot anfordern <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Hinweisleiste */}
            <div className="mt-10 rounded-2xl ring-1 ring-slate-200/70 bg-white p-5 md:p-6 text-sm text-slate-600">
              Preise variieren nach Umfang, Zugangssituation und Entsorgungsmenge.
              Sende uns Fotos/Video per WhatsApp für ein schnelles Festpreis-Angebot.
            </div>
          </div>
        </section>

        {/* Vorteile */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-28 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                Ihr Vorteil mit <span className="text-orange-600">reset.</span>
              </h2>
              <ul className="mt-6 space-y-4">
                {[
                  "Transparente Festpreise ohne Überraschungen",
                  "Kostenlose Vor-Ort-Besichtigung oder WhatsApp-Video",
                  "Versichert, diskret & zuverlässig",
                  "Schnelle Termine – oft innerhalb von 48h",
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
            </div>
            <div
              className="rounded-2xl overflow-hidden shadow-xl border bg-[url('/super.png')] bg-cover bg-center min-h-[320px]"
              aria-hidden="true"
            />
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-b from-slate-50 to-white">
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-28 text-center">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Bereit für den <span className="text-orange-600">Neuanfang?</span>
            </h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              Holen Sie sich jetzt Ihr unverbindliches Angebot – schnell,
              einfach und kostenlos.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link href="/#angebot" className="btn-primary">
                Angebot sichern <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a
                href={business.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-emerald"
              >
                <MessageCircle size={18} aria-hidden="true" /> WhatsApp Anfrage
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky CTA / Mobile Bottom Bar wie Landing */}
      <div className="sticky bottom-0 z-50 bg-white/95 backdrop-blur shadow-[0_-12px_30px_-12px_rgba(0,0,0,0.25)] ring-1 ring-slate-200/60">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-2.5 flex items-center justify-between gap-3">
          {/* Desktop Hinweis + Buttons */}
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-700">
            <Sparkles size={16} aria-hidden="true" /> Unverbindlich & diskret
          </div>
          <div className="hidden md:flex items-center gap-2">
            <a
              href={business.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-white font-semibold shadow hover:bg-emerald-700 transition"
            >
              <MessageCircle size={18} aria-hidden="true" /> WhatsApp
            </a>
            <Link
              href="/#angebot"
              className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-2.5 text-white font-semibold shadow hover:bg-orange-700 transition"
            >
              Jetzt kostenlos anfragen <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>

          {/* Mobile: 3-Aktions-Leiste */}
          <div className="md:hidden grid grid-cols-3 gap-2 w-full">
            <a
              href={`tel:${business.phoneLink}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl ring-1 ring-slate-300 bg-white px-2 py-2 text-sm font-medium shadow-sm hover:bg-slate-50"
              aria-label="Anrufen"
            >
              <Phone size={18} aria-hidden="true" /> Anruf
            </a>
            <a
              href={business.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-2 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
              aria-label="WhatsApp Chat starten"
            >
              <MessageCircle size={18} aria-hidden="true" /> WhatsApp
            </a>
            <Link
              href="/#angebot"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-2 py-2 text-sm font-semibold text-white shadow hover:bg-orange-700"
              aria-label="Angebot anfordern"
            >
              <Sparkles size={18} aria-hidden="true" /> Angebot
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
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
                <Link href="/rechtliches" className="hover:underline">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/rechtliches" className="hover:underline">
                  Datenschutzerklärung
                </Link>
              </li>
              <li>
                <Link href="/rechtliches" className="hover:underline">
                  AGB
                </Link>
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
    </div>
  );
}
