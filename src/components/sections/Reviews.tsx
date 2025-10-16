// src/components/sections/Reviews.tsx
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import { Card, CardContent } from "@/components/ui/Card";
import { Star } from "lucide-react";

const REVIEWS = [
  { name: "M. Mancic", text: "Schnelle Rückmeldung, top Team – Wohnung innerhalb eines Tages komplett leer & besenrein.", stars: 5 },
  { name: "Pflegeheim an der Mühle", text: "Seit Jahren zuverlässige Unterstützung bei Räumungen – absolut zu empfehlen.", stars: 5 },
  { name: "OBSCURA21", text: "Professionell, pünktlich, fairer Preis. Gerne wieder!", stars: 5 },
] as const;

export default function Reviews() {
  return (
    <Section className="bg-slate-50">
      <Container>
        <Heading level={2}>Was Kund:innen sagen</Heading>

        {/* Mobile: horizontal scroll mit snap; Desktop: Grid */}
        <div className="mt-6 md:mt-8">
          <div className="md:hidden -mx-4 px-4 flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-py-2">
            {REVIEWS.map((r) => (
              <Card key={r.name} className="min-w-[85%] snap-start">
                <div className="flex items-center gap-1" aria-label={`${r.stars} Sterne`}>
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <Star key={i} size={18} className="text-orange-600 fill-orange-600" aria-hidden="true" />
                  ))}
                </div>
                <CardContent className="mt-3 text-slate-700">“{r.text}”</CardContent>
                <div className="mt-3 text-sm text-slate-500">— {r.name}</div>
              </Card>
            ))}
          </div>

          <div className="hidden md:grid md:grid-cols-3 gap-4 md:gap-6">
            {REVIEWS.map((r) => (
              <Card key={r.name}>
                <div className="flex items-center gap-1" aria-label={`${r.stars} Sterne`}>
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <Star key={i} size={18} className="text-orange-600 fill-orange-600" aria-hidden="true" />
                  ))}
                </div>
                <CardContent className="mt-3 text-slate-700">“{r.text}”</CardContent>
                <div className="mt-3 text-sm text-slate-500">— {r.name}</div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
