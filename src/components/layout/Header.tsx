"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import Container from "@/components/ui/Container";
import Link from "@/components/ui/Link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Menu, X } from "lucide-react";

type NavItem = { label: string; href: string };
const NAV: NavItem[] = [
  { label: "Leistungen", href: "/leistungen" },
  { label: "Vorteile", href: "#vorteile" },
  { label: "Preise", href: "/preise" },
  { label: "FAQ", href: "#faq" },
  { label: "Kontakt", href: "#kontakt" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all",
        "border-b border-slate-200 bg-white shadow-sm",     // Start: solide
        scrolled ? "bg-white/75 backdrop-blur-md shadow" : "" // Nach Scroll: leicht transparent + Blur
      ].join(" ")}
    >
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:ring-2 focus:ring-orange-600"
      >
        Zum Inhalt springen
      </a>

      <Container className="py-3.5 flex items-center justify-between">
        {/* Logo */}
        <NextLink
          href="/"
          className="text-2xl font-black tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
          aria-label="Startseite"
        >
          <span className="text-slate-900">re</span>
          <span className="text-orange-600">set.</span>
        </NextLink>

        {/* Desktop Nav */}
        <nav
          aria-label="Hauptnavigation"
          className="hidden md:flex items-center gap-6 font-medium"
        >
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

        {/* Mobile burger */}
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

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur"
      >
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
