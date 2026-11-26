"use client";

import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import Link from "@/components/ui/Link";
import { Card, CardActions, CardContent, CardTitle } from "@/components/ui/Card";
import { CheckCircle, ArrowRight } from "lucide-react";
import { formatEuro, type PricingPlan } from "@/lib/pricing";
import { usePricingSettings } from "@/lib/usePricingSettings";

type PricingProps = { id?: string; className?: string; plans?: PricingPlan[] };

export default function Pricing({ id = "preise", className, plans }: PricingProps) {
  const { settings } = usePricingSettings();
  const activePlans = plans ?? settings.homepagePlans;
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
          Jeder Auftrag ist individuell - diese Pakete helfen bei der Orientierung.
        </p>

        <div
          className="mt-6 sm:mt-8 grid gap-3 sm:gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
        >
          {activePlans.map((p) => {
            const priceText =
              p.priceLabel ??
              (typeof p.priceFrom === "number" ? formatEuro(p.priceFrom) : undefined);
            return (
              <Card
                key={p.name}
                className={[
                  "relative h-full transition hover:-translate-y-0.5 hover:shadow-lg focus-within:ring-2 focus-within:ring-orange-600/40",
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
                {priceText && (
                  <div className="mt-2 text-3xl font-black text-orange-600">{priceText}</div>
                )}
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
                    href={p.href ?? "#kontakt"}
                    aria-label={`Angebot anfordern - Paket ${p.name}`}
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
          Preise sind Richtwerte und können je nach Umfang, Zugangssituation und
          Entsorgungsvolumen variieren.
        </p>
      </Container>
    </Section>
  );
}
