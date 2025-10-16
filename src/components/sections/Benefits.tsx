// src/components/sections/Benefits.tsx
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import Link from "@/components/ui/Link";
import { CheckCircle } from "lucide-react";

const BENEFITS = [
  "Kostenloser Vor-Ort-Termin oder WhatsApp-Video",
  "Fester Ansprechpartner – keine Callcenter",
  "Transparenter Festpreis ohne Überraschungen",
  "Sorgfältige Trennung, Entsorgung & besenrein",
] as const;

export default function Benefits() {
  return (
    <Section id="vorteile" className="bg-slate-50 scroll-mt-[var(--header-h-mobile)] md:scroll-mt-[var(--header-h-desktop)]">
      <Container className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
          <Heading level={2} className="text-slate-900">Darum reset. in Schwerin</Heading>
          <ul className="mt-5 space-y-3.5 md:space-y-4 text-slate-800">
            {BENEFITS.map((v) => (
              <li key={v} className="flex items-start gap-2.5">
                <CheckCircle className="mt-0.5 text-orange-600" aria-hidden="true" />
                <span className="leading-relaxed">{v}</span>
              </li>
            ))}
          </ul>
          <Link variant="pill" href="#angebot" className="mt-7 inline-flex w-full sm:w-auto justify-center">Angebot sichern</Link>
        </div>
        <div className="relative rounded-2xl overflow-hidden border border-slate-200/70 shadow-md">
          <img
            src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=2000&auto=format&fit=crop"
            alt=""
            loading="lazy"
            decoding="async"
            className="h-[280px] w-full object-cover object-center md:h-[360px]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-black/5" />
        </div>
      </Container>
    </Section>
  );
}
