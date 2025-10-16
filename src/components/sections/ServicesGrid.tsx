// src/components/sections/ServicesGrid.tsx
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import Link from "@/components/ui/Link";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { ArrowRight } from "lucide-react";

const SERVICES = [
  { title: "Haushaltsauflösungen", desc: "Schnell, sauber & mit Wertanrechnung." },
  { title: "Entrümpelungen", desc: "Keller, Dachboden, Garage – wir schaffen Platz." },
  { title: "Umzüge", desc: "Stressfrei mit Fahrer & passendem Fahrzeug." },
  { title: "Fahrzeugvermietung", desc: "Transporter mit Fahrer – flexibel buchbar." },
  { title: "Gebäudereinigung", desc: "Grund- & Unterhaltsreinigung für Haus & Büro." },
  { title: "Hausmeisterservice", desc: "Reparaturen, Pflege & Winterdienst." },
] as const;

export default function ServicesGrid() {
  return (
    <Section id="leistungen" className="bg-slate-50 scroll-mt-[64px]">
      <Container>
        <Heading level={2}>Unsere Leistungen</Heading>
        <p className="mt-2 text-slate-600 leading-relaxed">
          Alles aus einer Hand – für Ihren Neuanfang in Schwerin.
        </p>

        {/* Mobile: horizontal scroll mit Snap + Fade-Rändern */}
        <div
          className="mt-6 md:hidden -mx-4 px-4"
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
            {SERVICES.map((card) => (
              <Link
                key={card.title}
                href="/leistungen"
                aria-label={`${card.title} – Details ansehen`}
                className="group snap-center min-w-[82%]"
                role="listitem"
              >
                <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99] focus-within:ring-2 focus-within:ring-orange-600/40">
                  <CardTitle className="flex items-center gap-2 text-slate-900 font-semibold">
                    {card.title}
                    <ArrowRight
                      className="opacity-0 group-hover:opacity-100 transition translate-x-0 group-hover:translate-x-0.5 text-orange-600"
                      size={18}
                      aria-hidden="true"
                    />
                  </CardTitle>
                  <CardContent className="mt-2 text-slate-700">{card.desc}</CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop: klassisches Grid */}
        <div className="hidden md:grid md:mt-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {SERVICES.map((card) => (
            <Link
              key={card.title}
              href="/leistungen"
              aria-label={`${card.title} – Details ansehen`}
              className="group"
            >
              <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99] focus-within:ring-2 focus-within:ring-orange-600/40">
                <CardTitle className="flex items-center gap-2 text-slate-900 font-semibold">
                  {card.title}
                  <ArrowRight
                    className="opacity-0 group-hover:opacity-100 transition translate-x-0 group-hover:translate-x-0.5 text-orange-600"
                    size={18}
                    aria-hidden="true"
                  />
                </CardTitle>
                <CardContent className="mt-2 text-slate-700">{card.desc}</CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Link variant="pill" href="/leistungen" className="w-full sm:w-auto justify-center">
            Alle Leistungen ansehen <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
