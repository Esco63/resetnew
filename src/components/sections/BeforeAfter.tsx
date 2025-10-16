// src/components/sections/BeforeAfter.tsx
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";

export default function BeforeAfter() {
  return (
    <Section className="bg-gradient-to-b from-white to-slate-50">
      <Container>
        <div className="text-center max-w-3xl mx-auto">
          <Heading level={2} className="text-slate-900">
            Ergebnisse auf einen Blick
          </Heading>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Mit unserer Arbeit verwandeln wir Chaos in Ordnung. Hier ein Beispiel aus einem realen Auftrag.
          </p>
        </div>

        {/* Mobile: Swipe-Galerie mit Snap */}
        <div
          className="mt-8 md:hidden -mx-4 px-4 flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-py-2"
          style={{
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
            maskImage:
              "linear-gradient(90deg, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
          }}
        >
          {[
            { label: "Vorher", src: "/vorher.png", color: "bg-slate-900/85" },
            { label: "Nachher", src: "/nacher.png", color: "bg-orange-600" },
          ].map((img) => (
            <figure
              key={img.label}
              className="snap-center relative min-w-[82%] overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition group"
            >
              <img
                loading="lazy"
                decoding="async"
                src={img.src}
                alt={img.label}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <figcaption
                className={`absolute top-3 left-3 rounded-full ${img.color} text-white text-xs px-3 py-1.5 font-medium shadow`}
              >
                {img.label}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Desktop: 2-Spalten Ansicht */}
        <div className="hidden md:grid md:grid-cols-2 gap-4 md:gap-6 mt-10 md:mt-12">
          {/* Vorher */}
          <figure className="group relative overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <img
              loading="lazy"
              decoding="async"
              alt="Vorher"
              src="/vorher.png"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <figcaption className="absolute top-3 left-3 rounded-full bg-slate-900/85 text-white text-xs px-3 py-1.5 font-medium shadow">
              Vorher
            </figcaption>
          </figure>

          {/* Nachher */}
          <figure className="group relative overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <img
              loading="lazy"
              decoding="async"
              alt="Nachher"
              src="/nacher.png"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
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
