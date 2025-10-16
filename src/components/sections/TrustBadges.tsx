// src/components/sections/TrustBadges.tsx
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import { CheckCircle } from "lucide-react";

const BADGES = ["Festpreis-Angebot", "Diskret & zuverlässig", "WhatsApp-Bildercheck", "Besenreine Übergabe"] as const;

export default function TrustBadges() {
  return (
    <Section className="bg-white">
      <Container>
        {/* Mobile: horizontales Scrolling */}
        <div className="md:hidden -mx-4 px-4 flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-py-2">
          {BADGES.map((t) => (
            <div
              key={t}
              className="snap-start min-w-[75%] flex items-center gap-2 rounded-xl ring-1 ring-slate-200/70 bg-white p-3 shadow-sm hover:shadow-md transition"
            >
              <CheckCircle className="shrink-0 text-orange-600" aria-hidden="true" />
              <span className="font-medium">{t}</span>
            </div>
          ))}
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {BADGES.map((t) => (
            <div
              key={t}
              className="flex items-center gap-2 rounded-xl ring-1 ring-slate-200/70 bg-white p-4 shadow-sm hover:shadow-md transition hover:-translate-y-0.5"
            >
              <CheckCircle className="shrink-0 text-orange-600" aria-hidden="true" />
              <span className="font-medium">{t}</span>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
