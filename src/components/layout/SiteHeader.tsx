// src/components/layout/SiteHeader.tsx
"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import Container from "@/components/ui/Container";
import Link from "@/components/ui/Link";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  Menu,
  X,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { business } from "@/lib/business";

type NavItem = { label: string; href: string };
const NAV: NavItem[] = [
  { label: "Leistungen", href: "/leistungen" },
  { label: "Vorteile", href: "#vorteile" },
  { label: "Preise", href: "/preise" },
  { label: "FAQ", href: "#faq" },
  { label: "Kontakt", href: "#kontakt" },
];

const MOBILE_HEADER_H = 64;
const DESKTOP_HEADER_H = 64;
const TOPBAR_H = 40;

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTopbar, setShowTopbar] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (y < 32) setShowTopbar(true);
      else if (y > lastY) setShowTopbar(false);
      else if (y + 16 < lastY) setShowTopbar(true);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const desktopTotal = DESKTOP_HEADER_H + (showTopbar ? TOPBAR_H : 0);
    root.style.setProperty("--header-h-mobile", `${MOBILE_HEADER_H}px`);
    root.style.setProperty("--header-h-desktop", `${desktopTotal}px`);
  }, [showTopbar]);

  // >>> wichtig: oben voll weiß, beim Scroll halbtransparent + blur + border/shadow
  const headerStateClass =
    scrolled || !showTopbar
      ? "bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200 shadow-sm"
      : "bg-white border-b border-transparent";

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out",
        headerStateClass,
      ].join(" ")}
    >
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:ring-2 focus:ring-orange-600"
      >
        Zum Inhalt springen
      </a>

      {/* Topbar (Desktop) – klappt ein/aus */}
      <div
        className={[
          "hidden md:block overflow-hidden transition-all duration-300 ease-out",
          showTopbar ? "max-h-16 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2",
          "bg-slate-900 text-white text-sm",
        ].join(" ")}
        aria-hidden={!showTopbar}
      >
        <Container className="py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin size={16} aria-hidden="true" /> {business.serviceArea}
            </span>
            <Link
              href={`mailto:${business.email}`}
              variant="link"
              className="flex items-center gap-1 hover:underline text-white/90 hover:text-white"
            >
              <Mail size={16} aria-hidden="true" /> {business.email}
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <Link
              href={`tel:${business.phoneLink}`}
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-3 py-1.5 font-medium shadow hover:bg-orange-600 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
              aria-label={`Anrufen: ${business.phoneHuman}`}
            >
              <Phone size={16} aria-hidden="true" /> {business.phoneHuman}
            </Link>
            <Link
              href={business.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1.5 font-medium text-white shadow hover:bg-emerald-700 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-600"
              aria-label="WhatsApp öffnen"
            >
              <MessageCircle size={16} aria-hidden="true" /> WhatsApp
            </Link>
          </div>
        </Container>
      </div>

      {/* Hauptleiste */}
      <Container className="py-3.5 flex items-center justify-between">
        <NextLink
          href="/"
          className="text-2xl font-black tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
          aria-label="Startseite"
        >
          <span className="text-slate-900">re</span>
          <span className="text-orange-600">set.</span>
        </NextLink>

        <nav aria-label="Hauptnavigation" className="hidden md:flex items-center gap-6 font-medium">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} variant="link">
              {n.label}
            </Link>
          ))}
          <Link
            href="#angebot"
            className="ml-1 inline-flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-white shadow hover:bg-orange-700 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
          >
            Angebot anfordern <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center rounded-xl p-2 ring-1 ring-slate-300 hover:bg-slate-50"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Menü umschalten"
        >
          {open ? <X /> : <Menu />}
        </button>
      </Container>

      <div id="mobile-menu" hidden={!open} className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur">
        <Container className="py-3 grid gap-3 text-base">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
          <Button
            asChild={false}
            className="w-full"
            onClick={() => {
              window.location.hash = "angebot";
              setOpen(false);
            }}
          >
            <span className="inline-flex items-center gap-2">
              Angebot anfordern <ArrowRight size={18} aria-hidden="true" />
            </span>
          </Button>
        </Container>
      </div>
    </header>
  );
}
