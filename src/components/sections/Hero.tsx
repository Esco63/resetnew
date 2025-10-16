// src/components/sections/Hero.tsx
"use client";

import { useEffect, useState } from "react";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import Link from "@/components/ui/Link";
import { ArrowRight, Clock, Shield, Sparkles, Truck } from "lucide-react";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Section className="relative isolate overflow-hidden bg-gradient-to-b from-white to-slate-50 p-0">
      {/* Hintergrundbild + Overlay */}
      <div
        className="absolute inset-0 -z-10 bg-[url('/hero.png')] bg-cover bg-center"
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-black/50" aria-hidden="true" />

      <Container className="py-20 md:py-28 text-white">
        <Heading
          level={1}
          className={`max-w-4xl leading-tight ${
            mounted ? "motion-safe:animate-fade-in-up" : "opacity-0"
          }`}
        >
          Auflösen. Entrümpeln. Neuanfangen.{" "}
          <span className="text-orange-400">In Schwerin.</span>
        </Heading>

        <p
          className={`mt-5 max-w-2xl text-lg md:text-xl text-white/90 leading-relaxed ${
            mounted
              ? "motion-safe:animate-fade-in motion-safe:[animation-delay:100ms]"
              : "opacity-0"
          }`}
        >
          Haushaltsauflösungen, Entrümpelungen, Umzüge, Gebäudereinigung &amp;
          Hausmeisterservice – diskret, versichert &amp; zum fairen Festpreis.
        </p>

        <div
          className={`mt-8 flex flex-wrap items-center gap-4 ${
            mounted
              ? "motion-safe:animate-fade-in motion-safe:[animation-delay:200ms]"
              : "opacity-0"
          }`}
        >
          <Link variant="pill" href="#angebot" className="shadow-lg">
            <Sparkles size={20} aria-hidden="true" /> Jetzt kostenloses Angebot
          </Link>
          <Link variant="ghost" href="#leistungen">
            Mehr erfahren
          </Link>
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
      </Container>
    </Section>
  );
}
