import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import Link from "@/components/ui/Link";
import { ChevronDown, MessageCircle } from "lucide-react";
import { business } from "@/lib/business";

export const FAQ_ITEMS = [
  {
    question: "Wie schnell bekomme ich ein Angebot?",
    answer:
      "In der Regel melden wir uns umgehend. Mit Fotos oder einem kurzen WhatsApp-Video können wir Umfang, Zugang und Entsorgungsmenge oft besonders schnell einschätzen.",
  },
  {
    question: "Kostet die Besichtigung etwas?",
    answer:
      "Nein. Die erste Einschätzung per Telefon, WhatsApp oder vor Ort ist unverbindlich. Danach erhalten Sie ein transparentes Festpreis-Angebot.",
  },
  {
    question: "Was ist im Festpreis enthalten?",
    answer:
      "Je nach Auftrag sind Sortieren, Tragen, Abtransport, Entsorgung und eine besenreine Übergabe enthalten. Den genauen Leistungsumfang halten wir im Angebot fest.",
  },
  {
    question: "Entsorgen Sie fachgerecht?",
    answer:
      "Ja. Wir trennen Wertstoffe, Sperrmüll, Elektrogeräte und weitere Materialien sorgfältig und entsorgen nach den geltenden Vorgaben.",
  },
  {
    question: "Sind kurzfristige Termine möglich?",
    answer:
      "Oft ja. Je nach Auslastung sind Termine innerhalb von 24 bis 48 Stunden möglich, besonders bei kleineren Entrümpelungen oder Transporten.",
  },
  {
    question: "Welche Gebiete decken Sie ab?",
    answer:
      "Wir arbeiten in Schwerin und Umgebung. Dazu gehören unter anderem Innenstadt, Schelfstadt, Lankow, Krebsförden, Zippendorf, Mueß und weitere Orte im Umkreis.",
  },
] as const;

export default function FAQ() {
  return (
    <Section
      id="faq"
      className="bg-white scroll-mt-[var(--header-h-mobile)] md:scroll-mt-[var(--header-h-desktop)]"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Heading level={2} align="center" className="text-slate-900">
            Häufige Fragen
          </Heading>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Die wichtigsten Antworten zu Ablauf, Preisen und Terminen.
          </p>
        </div>

        <div className="mx-auto mt-8 md:mt-10 max-w-4xl divide-y divide-slate-200 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          {FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-slate-900 md:px-6">
                <span>{item.question}</span>
                <ChevronDown
                  size={20}
                  aria-hidden="true"
                  className="shrink-0 text-orange-600 transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="px-5 pb-5 text-slate-600 leading-relaxed md:px-6">
                {item.answer}
              </div>
            </details>
          ))}
        </div>

        <div className="mx-auto mt-8 flex max-w-4xl flex-col items-center justify-between gap-4 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/70 md:flex-row md:p-6">
          <p className="text-center text-slate-700 md:text-left">
            Ihre Frage ist nicht dabei? Schreiben Sie uns direkt.
          </p>
          <Link
            href={business.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow hover:bg-emerald-700 sm:w-auto"
          >
            <MessageCircle size={18} aria-hidden="true" /> WhatsApp Anfrage
          </Link>
        </div>
      </Container>
    </Section>
  );
}
