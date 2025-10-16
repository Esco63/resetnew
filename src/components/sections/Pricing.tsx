// src/components/sections/Pricing.tsx
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import Link from "@/components/ui/Link";
import { Card, CardActions, CardContent, CardTitle } from "@/components/ui/Card";
import { CheckCircle, ArrowRight } from "lucide-react";
import * as React from "react";

type Plan = {
  name: string;
  /** Netto-/Brutto-Richtwert (nur Zahl, wird formatiert) */
  priceFrom?: number;
  /** Freier Text statt Formatierung (z. B. "ab 199€") */
  priceLabel?: string;
  points: string[];
  featured?: boolean;
  /** Optional: eigener CTA-Link pro Plan (sonst #angebot) */
  href?: string;
};

const PLANS_DEFAULT: Plan[] = [
  { name: "Schnell & Klein", priceFrom: 199, points: ["Kellerabteil", "1–2m³ Entsorgung", "Besenrein"] },
  { name: "Wohnung", priceFrom: 799, points: ["2–3 Zimmer", "Wertanrechnung möglich", "Besenrein + Entsorgung"], featured: true },
  { name: "Haus komplett", priceFrom: 1999, points: ["120–160 m²", "Mehrtageseinsatz", "inkl. Abtransport"] },
];

/** EUR-Formatierung „ab 199 €“ */
function formatEuro(value: number): string {
  const f = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
  return `ab ${f}`;
}

type PricingProps = {
  id?: string;
  className?: string;
  plans?: Plan[];
};

export default function Pricing({ id = "preise", className, plans = PLANS_DEFAULT }: PricingProps) {
  const titleId = `${id}-title`;
  const descId = `${id}-desc`;

  return (
    <Section
      id={id}
      aria-labelledby={titleId}
      aria-describedby={descId}
      className={`bg-gradient-to-b from-white to-slate-50 scroll-mt-[64px] ${className ?? ""}`}
    >
      <Container>
        <Heading level={2} id={titleId}>
          Beispielpreise
        </Heading>
        <p id={descId} className="mt-2 text-slate-600 leading-relaxed">
          Jeder Auftrag ist individuell – diese Pakete helfen bei der Orientierung.
        </p>

        {/* Mobile: horizontal scroll mit Snap + Fade-Rändern */}
        <div
          className="mt-6 sm:hidden -mx-4 px-4"
          style={{
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0, black 16px, black calc(100% - 16px), transparent 100%)",
            maskImage:
              "linear-gradient(90deg, transparent 0, black 16px, black calc(100% - 16px), transparent 100%)",
          }}
        >
          <div role="list" className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-py-2 pb-2 -mb-2">
            {plans.map((p) => {
              const priceText = p.priceLabel ?? (typeof p.priceFrom === "number" ? formatEuro(p.priceFrom) : undefined);

              return (
                <Card
                  role="listitem"
                  key={p.name}
                  className={[
                    "relative snap-center min-w-[82%] h-full transition hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99]",
                    "focus-within:ring-2 focus-within:ring-orange-600/40",
                    p.featured ? "ring-2 ring-orange-600/40" : "",
                  ].join(" ")}
                  aria-current={p.featured ? "true" : undefined}
                >
                  {p.featured && (
                    <div
                      className="absolute -top-2 right-3 rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold text-white shadow"
                      aria-hidden="true"
                    >
                      Beliebt
                    </div>
                  )}

                  <CardTitle className="text-slate-900 font-semibold">{p.name}</CardTitle>

                  {priceText && <div className="mt-2 text-3xl font-black text-orange-600">{priceText}</div>}

                  <CardContent>
                    <ul className="mt-4 space-y-2 text-slate-700">
                      {p.points.map((pt) => (
                        <li key={`${p.name}-${pt}`} className="flex items-center gap-2">
                          <CheckCircle className="text-orange-600" size={18} aria-hidden="true" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardActions>
                    <Link
                      variant="pill"
                      href={p.href ?? "#angebot"}
                      aria-label={`Angebot anfordern – Paket ${p.name}`}
                      className="w-full justify-center"
                    >
                      Angebot anfordern <ArrowRight size={18} aria-hidden="true" />
                    </Link>
                  </CardActions>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Desktop/Tablet: auto-fit Grid */}
        <div
          className="hidden sm:grid sm:mt-8 gap-4 md:gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
        >
          {plans.map((p) => {
            const priceText = p.priceLabel ?? (typeof p.priceFrom === "number" ? formatEuro(p.priceFrom) : undefined);

            return (
              <Card
                key={p.name}
                className={[
                  "relative h-full transition hover:-translate-y-0.5 hover:shadow-lg",
                  "focus-within:ring-2 focus-within:ring-orange-600/40",
                  p.featured ? "ring-2 ring-orange-600/40" : "",
                ].join(" ")}
                aria-current={p.featured ? "true" : undefined}
              >
                {p.featured && (
                  <div
                    className="absolute -top-2 right-3 rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold text-white shadow"
                    aria-hidden="true"
                  >
                    Beliebt
                  </div>
                )}

                <CardTitle className="text-slate-900 font-semibold">{p.name}</CardTitle>

                {priceText && <div className="mt-2 text-3xl font-black text-orange-600">{priceText}</div>}

                <CardContent>
                  <ul className="mt-4 space-y-2 text-slate-700">
                    {p.points.map((pt) => (
                      <li key={`${p.name}-${pt}`} className="flex items-center gap-2">
                        <CheckCircle className="text-orange-600" size={18} aria-hidden="true" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardActions>
                  <Link
                    variant="pill"
                    href={p.href ?? "#angebot"}
                    aria-label={`Angebot anfordern – Paket ${p.name}`}
                    className="w-full sm:w-auto justify-center"
                  >
                    Angebot anfordern <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </CardActions>
              </Card>
            );
          })}
        </div>

        <p className="mt-4 text-sm text-slate-500">
          Preise sind Richtwerte und können je nach Umfang, Zugangssituation und Entsorgungsvolumen variieren.
        </p>
      </Container>
    </Section>
  );
}
