"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Menu,
  X,
  Phone,
  Mail,
  MessageCircle,
  FileText,
  ShieldCheck,
  Scale,
  Calendar,
  MapPin,
  Sparkles,
} from "lucide-react";

export default function RechtlichesPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [active, setActive] = useState<"dse" | "impressum" | "agb">("dse");

  // Business-Daten – gern anpassen/zentralisieren
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
    owner: "Max Mustermann",
    vatId: "DE123456789", // falls vorhanden
    register: {
      court: "Amtsgericht Schwerin",
      number: "HRB 12345", // falls vorhanden (bei GmbH/UG etc.)
    },
    lastUpdated: "01.09.2025",
  } as const;

  // Tab-Navigation
  const tabs = [
    { id: "dse", label: "Datenschutzerklärung", icon: ShieldCheck },
    { id: "impressum", label: "Impressum", icon: FileText },
    { id: "agb", label: "AGB", icon: Scale },
  ] as const;

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
              <Link href="/rechtliches" onClick={() => setMobileNavOpen(false)}>
                Rechtliches
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
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-center">
              Rechtliches
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-center text-lg md:text-xl text-slate-600 leading-relaxed">
              Transparenz und Sicherheit: Hier finden Sie unsere
              Datenschutzerklärung, das Impressum und die Allgemeinen
              Geschäftsbedingungen.
            </p>
          </div>
        </section>

        {/* Tabs */}
        <section className="bg-slate-50">
         <div className="mx-auto max-w-7xl px-4 md:px-8 pt-8 md:pt-12 pb-4">
            <div className="flex flex-wrap gap-2">
              {tabs.map((t) => {
                const Icon = t.icon;
                const isActive = active === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActive(t.id)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ring-1 transition ${
                      isActive
                        ? "bg-orange-600 text-white ring-orange-600"
                        : "bg-white text-slate-800 ring-slate-200 hover:bg-slate-100"
                    }`}
                    aria-pressed={isActive}
                  >
                    <Icon size={18} /> {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-8 md:py-12">
            <div className="card p-6 md:p-8">
              {active === "dse" && (
                <article>
                  <header className="flex items-center gap-3">
                    <ShieldCheck className="text-orange-600" />
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                        Datenschutzerklärung
                      </h2>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Calendar size={14} /> Stand: {business.lastUpdated}
                      </p>
                    </div>
                  </header>

                  <section className="mt-6 space-y-6 leading-relaxed text-slate-700">
                    <p>
                      Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst.
                      Personenbezogene Daten werden vertraulich und entsprechend
                      den gesetzlichen Datenschutzvorschriften sowie dieser
                      Datenschutzerklärung behandelt.
                    </p>

                    <div>
                      <h3 className="font-bold text-lg">1. Verantwortlicher</h3>
                      <p>
                        {business.name}, {business.address.street},{" "}
                        {business.address.zip} {business.address.city}
                        <br />
                        E-Mail: {business.email} · Telefon: {business.phoneHuman}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg">
                        2. Erhebung und Verarbeitung
                      </h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>
                          <strong>Webserver-Logs:</strong> IP-Adresse,
                          Datum/Uhrzeit, aufgerufene Seiten – zur
                          Betriebssicherheit (Art. 6 Abs. 1 lit. f DSGVO).
                        </li>
                        <li>
                          <strong>Kontakt-/Angebotsformular:</strong> Name,
                          Kontaktdaten, Nachricht – zur Bearbeitung Ihrer
                          Anfrage (Art. 6 Abs. 1 lit. b/f DSGVO).
                        </li>
                        <li>
                          <strong>WhatsApp-Kontakt:</strong> Kommunikation über
                          den Dienst von WhatsApp Ireland Ltd. Bitte beachten
                          Sie deren Datenschutzbestimmungen.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg">
                        3. Speicherdauer & Empfänger
                      </h3>
                      <p>
                        Wir speichern Daten nur solange, wie es zur Erfüllung
                        des Zwecks erforderlich ist bzw. gesetzliche Pflichten
                        es verlangen. Eine Übermittlung an Dritte erfolgt nur,
                        wenn hierfür eine Rechtsgrundlage besteht (z. B.
                        Auftragsverarbeitung, gesetzliche Pflicht).
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg">4. Ihre Rechte</h3>
                      <p>
                        Sie haben das Recht auf Auskunft, Berichtigung, Löschung,
                        Einschränkung der Verarbeitung, Datenübertragbarkeit
                        sowie Widerspruch. Außerdem besteht ein Beschwerderecht
                        bei einer Datenschutzaufsichtsbehörde.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg">5. Cookies & Tools</h3>
                      <p>
                        Soweit wir Cookies/Analyse- oder Marketing-Tools
                        einsetzen, informieren wir hierüber gesondert (z. B. im
                        Cookie-Banner) und holen – wo erforderlich – Ihre
                        Einwilligung ein (Art. 6 Abs. 1 lit. a DSGVO).
                      </p>
                    </div>

                    <p className="text-sm text-slate-500">
                      Hinweis: Diese Vorlage ersetzt keine Rechtsberatung und
                      muss auf deinen tatsächlichen Einsatz (Hosting, Tools,
                      Tracking, Plugins) angepasst werden.
                    </p>
                  </section>
                </article>
              )}

              {active === "impressum" && (
                <article>
                  <header className="flex items-center gap-3">
                    <FileText className="text-orange-600" />
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                        Impressum
                      </h2>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <MapPin size={14} /> Angaben gemäß § 5 TMG
                      </p>
                    </div>
                  </header>

                  <section className="mt-6 space-y-6 leading-relaxed text-slate-700">
                    <div>
                      <h3 className="font-bold text-lg">Diensteanbieter</h3>
                      <p>
                        {business.name}
                        <br />
                        {business.address.street}
                        <br />
                        {business.address.zip} {business.address.city}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg">Kontakt</h3>
                      <p>
                        Telefon: {business.phoneHuman}
                        <br />
                        E-Mail: {business.email}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg">Vertretungsberechtigt</h3>
                      <p>{business.owner}</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg">
                        Register & USt-IdNr.
                      </h3>
                      <p>
                        {business.register.number
                          ? `Handelsregister: ${business.register.court}, ${business.register.number}`
                          : "Kein Handelsregistereintrag vorhanden."}
                        <br />
                        {business.vatId
                          ? `USt-IdNr.: ${business.vatId}`
                          : "USt-IdNr.: nicht vorhanden / nicht anwendbar"}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg">Haftungshinweis</h3>
                      <p>
                        Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir
                        keine Haftung für Inhalte externer Links. Für den Inhalt
                        der verlinkten Seiten sind ausschließlich deren
                        Betreiber verantwortlich.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg">Urheberrecht</h3>
                      <p>
                        Die durch den Seitenbetreiber erstellten Inhalte und
                        Werke auf diesen Seiten unterliegen dem deutschen
                        Urheberrecht. Beiträge Dritter sind als solche
                        gekennzeichnet.
                      </p>
                    </div>
                  </section>
                </article>
              )}

              {active === "agb" && (
                <article>
                  <header className="flex items-center gap-3">
                    <Scale className="text-orange-600" />
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                        Allgemeine Geschäftsbedingungen (AGB)
                      </h2>
                      <p className="text-sm text-slate-500">
                        Geltungsbereich: Dienstleistungen (Haushaltsauflösungen,
                        Entrümpelungen, Umzüge, Reinigung, Hausmeisterservice)
                      </p>
                    </div>
                  </header>

                  <section className="mt-6 space-y-6 leading-relaxed text-slate-700">
                    <div>
                      <h3 className="font-bold text-lg">1. Geltung</h3>
                      <p>
                        Diese AGB gelten für alle Verträge zwischen {business.name} und
                        ihren Kund:innen, soweit nichts Abweichendes schriftlich
                        vereinbart wurde.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg">2. Angebote & Preise</h3>
                      <p>
                        Angebote sind – sofern nicht anders angegeben – 14 Tage
                        gültig. Festpreise basieren auf den bei Besichtigung oder
                        Bild-/Videoprüfung übermittelten Informationen.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg">3. Leistungserbringung</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Termine nach Verfügbarkeit, übliche Arbeitszeiten.</li>
                        <li>
                          Sorgfältige Trennung/Entsorgung gemäß gesetzlichen
                          Vorgaben.
                        </li>
                        <li>
                          Übergabe in vereinbartem Zustand (z. B. besenrein).
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg">4. Zahlungsbedingungen</h3>
                      <p>
                        Sofern nicht anders vereinbart, ist der Rechnungsbetrag
                        nach Leistungserbringung sofort ohne Abzug fällig.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg">
                        5. Haftung & Versicherung
                      </h3>
                      <p>
                        Es gilt die gesetzliche Haftung. Schäden sind uns
                        unverzüglich, spätestens innerhalb von 7 Tagen nach
                        Abnahme mitzuteilen. Eine Betriebshaftpflicht ist
                        vorhanden.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg">6. Stornierung</h3>
                      <p>
                        Stornierungen bis 48 Stunden vor Termin sind
                        kostenfrei; danach können entstandene Aufwendungen
                        berechnet werden.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg">7. Schlussbestimmungen</h3>
                      <p>
                        Es gilt deutsches Recht. Gerichtsstand ist – soweit
                        zulässig – {business.address.city}.
                      </p>
                    </div>

                    <p className="text-sm text-slate-500">
                      Hinweis: Diese AGB sind eine schlanke Vorlage und sollten
                      auf dein konkretes Geschäftsmodell angepasst und ggf. juristisch
                      geprüft werden.
                    </p>
                  </section>
                </article>
              )}
            </div>
          </div>
        </section>

        {/* Kontakt-Schnellzugriff */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-12">
            <div className="rounded-2xl ring-1 ring-slate-200/60 bg-white p-6 md:p-7 shadow-sm grid md:grid-cols-3 gap-4">
              <p className="md:col-span-2 text-slate-700">
                Fragen zu unseren rechtlichen Informationen? Wir helfen gern
                weiter.
              </p>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <a
                  href={`mailto:${business.email}`}
                  className="inline-flex items-center gap-2 rounded-full ring-1 ring-slate-300 px-5 py-2.5 hover:bg-slate-50"
                >
                  <Mail size={18} /> {business.email}
                </a>
                <a
                  href={`tel:${business.phoneLink}`}
                  className="inline-flex items-center gap-2 rounded-full bg-orange-600 text-white px-5 py-2.5 hover:bg-orange-700"
                >
                  <Phone size={18} /> {business.phoneHuman}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Sticky CTA / Mobile Bottom Bar wie Landing */}
      <div className="sticky bottom-0 z-50 bg-white/95 backdrop-blur shadow-[0_-12px_30px_-12px_rgba(0,0,0,0.25)] ring-1 ring-slate-200/60">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-2.5 flex items-center justify-between gap-3">
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
              Angebot
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
                  Datenschutzerklärung
                </Link>
              </li>
              <li>
                <Link href="/rechtliches" className="hover:underline">
                  Impressum
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
