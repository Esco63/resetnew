"use client";

import { useEffect, useState } from "react";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import Link from "@/components/ui/Link";
import { Clock, Shield, Sparkles, Truck } from "lucide-react";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Section className="hero relative isolate overflow-hidden p-0">
      {/* Hintergrundbild */}
      <div
        className="absolute inset-0 -z-10 bg-[url('/hero.png')] bg-cover bg-center"
        aria-hidden="true"
      />
      {/* Overlay (mobil stärker) */}
      <div className="absolute inset-0 -z-10 bg-black/60 md:bg-black/50" aria-hidden="true" />

      {/* Abstand unter fixed Header */}
      <Container className="pt-[var(--header-h-mobile)] md:pt-[var(--header-h-desktop)] pb-16 md:pb-24 text-white">
        <Heading
          level={1}
          className={[
            "max-w-4xl font-extrabold leading-tight",
            "text-4xl sm:text-5xl md:text-6xl",
            "text-shadow",
            mounted ? "motion-safe:animate-fade-in-up" : "opacity-0",
          ].join(" ")}
        >
          Auflösen. Entrümpeln. Neuanfangen.{" "}
          <span className="text-orange-400">In Schwerin.</span>
        </Heading>

        <p
          className={[
            "mt-5 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed",
            "text-white text-shadow-sm",
            mounted
              ? "motion-safe:animate-fade-in motion-safe:[animation-delay:120ms]"
              : "opacity-0",
          ].join(" ")}
        >
          Haushaltsauflösungen, Entrümpelungen, Umzüge, Gebäudereinigung &amp;
          Hausmeisterservice – diskret, versichert &amp; zum fairen Festpreis.
        </p>

        <div
          className={[
            "mt-8 flex flex-wrap items-center gap-4",
            mounted
              ? "motion-safe:animate-fade-in motion-safe:[animation-delay:220ms]"
              : "opacity-0",
          ].join(" ")}
        >
          <Link variant="pill" href="#angebot" className="shadow-lg">
            <Sparkles size={20} aria-hidden="true" /> Jetzt kostenloses Angebot
          </Link>
          <Link variant="ghost" href="#leistungen">
            Mehr erfahren
          </Link>
        </div>

        <div
          className={[
            "mt-8 flex flex-wrap items-center gap-6 text-sm text-white/85",
            "text-shadow-sm",
            mounted
              ? "motion-safe:animate-fade-in motion-safe:[animation-delay:300ms]"
              : "opacity-0",
          ].join(" ")}
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
      </Container>
    </Section>
  );
}
