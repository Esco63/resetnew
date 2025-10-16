// src/components/sections/BeforeAfter.tsx
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";

export default function BeforeAfter() {
  return (
    <Section className="bg-gradient-to-b from-white to-slate-50">
      <Container>
        <div className="text-center max-w-3xl mx-auto">
          <Heading level={2}>Ergebnisse auf einen Blick</Heading>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Mit unserer Arbeit verwandeln wir Chaos in Ordnung. Hier ein Beispiel aus einem realen Auftrag.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {/* Vorher */}
          <figure className="group relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-lg transition">
            <img
              loading="lazy"
              alt="Vorher"
              src="/vorher.png"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <figcaption className="absolute top-3 left-3 rounded-full bg-slate-900/80 text-white text-xs px-3 py-1.5 font-medium shadow">
              Vorher
            </figcaption>
          </figure>

          {/* Nachher */}
          <figure className="group relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-lg transition">
            <img
              loading="lazy"
              alt="Nachher"
              src="/nacher.png"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <figcaption className="absolute top-3 left-3 rounded-full bg-orange-600 text-white text-xs px-3 py-1.5 font-medium shadow">
              Nachher
            </figcaption>
          </figure>
        </div>
      </Container>
    </Section>
  );
}
