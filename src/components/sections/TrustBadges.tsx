// src/components/sections/TrustBadges.tsx
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import { CheckCircle } from "lucide-react";

const BADGES = [
  "Festpreis-Angebot",
  "Diskret & zuverlässig",
  "WhatsApp-Bildercheck",
  "Besenreine Übergabe",
] as const;

export default function TrustBadges() {
  return (
    <Section className="bg-white">
      <Container>
        {/* Mobile: horizontales Scrolling mit Snap + Fade-Rändern als Scroll-Hinweis */}
        <div
          className="md:hidden -mx-4 px-4"
          // weiche Fade-Ränder links/rechts, damit man „Scrollbarkeit“ sieht
          style={{
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0, black 16px, black calc(100% - 16px), transparent 100%)",
            maskImage:
              "linear-gradient(90deg, transparent 0, black 16px, black calc(100% - 16px), transparent 100%)",
          }}
        >
          <div
            role="list"
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-py-2 pb-2 -mb-2"
          >
            {BADGES.map((t) => (
              <div
                role="listitem"
                key={t}
                className="snap-center min-w-[72%] flex items-center gap-2 rounded-2xl ring-1 ring-slate-200/70 bg-white px-4 py-3 shadow-sm hover:shadow-md transition active:scale-[0.99] focus-within:ring-2 focus-within:ring-orange-500"
              >
                <CheckCircle
                  className="shrink-0 text-orange-600"
                  size={18}
                  aria-hidden="true"
                />
                <span className="font-medium text-slate-900">{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {BADGES.map((t) => (
            <div
              key={t}
              className="flex items-center gap-2 rounded-2xl ring-1 ring-slate-200/70 bg-white p-4 shadow-sm hover:shadow-md transition hover:-translate-y-0.5"
            >
              <CheckCircle
                className="shrink-0 text-orange-600"
                size={18}
                aria-hidden="true"
              />
              <span className="font-medium text-slate-900">{t}</span>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
