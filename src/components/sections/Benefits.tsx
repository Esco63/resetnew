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
    <Section id="vorteile" className="bg-slate-50 scroll-mt-[64px]">
      <Container className="grid lg:grid-cols-2 gap-10 md:gap-12 items-center">
        <div>
          <Heading level={2}>Darum reset. in Schwerin</Heading>
          <ul className="mt-6 space-y-4">
            {BENEFITS.map((v) => (
              <li key={v} className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 text-orange-600" aria-hidden="true" />
                <span>{v}</span>
              </li>
            ))}
          </ul>
          <Link variant="pill" href="#angebot" className="mt-8 inline-flex">
            Angebot sichern
          </Link>
        </div>

        {/* Bildfläche */}
        <div
          className="rounded-2xl overflow-hidden shadow-xl border bg-[url('https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center min-h-[320px]"
          aria-hidden="true"
        />
      </Container>
    </Section>
  );
}
