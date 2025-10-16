// src/components/sections/Marketplace.tsx
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import Link from "@/components/ui/Link";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import { ArrowRight, MapPin, MessageCircle, Shield, Truck, Phone } from "lucide-react";
import { business } from "@/lib/business";

export default function Marketplace() {
  const phoneHref = `tel:${business.phoneLink}`;
  const phoneLabel = business.phoneHuman ?? "Jetzt anrufen";

  return (
    <Section id="marktplatz" className="bg-gradient-to-b from-white to-slate-50 scroll-mt-[64px]" aria-labelledby="marktplatz-heading">
      <Container>
        <div className="max-w-3xl">
          <Heading id="marktplatz-heading" level={2}>Marktplatz: eBay & Kleinanzeigen</Heading>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Wir verkaufen dort nützliche Gegenstände aus Aufträgen. <span className="font-medium">Kein Versand</span> – bitte <span className="font-medium">Abholung vor Ort nach Termin</span>.
            <br className="hidden sm:block" />
            <span className="mt-2 inline-flex items-center gap-1">
              <Shield className="text-orange-600" size={16} aria-hidden="true" />
              reset ist kein Ladengeschäft.
            </span>
          </p>

          {/* CTAs */}
          <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
            <Link href="https://www.ebay.de/usr/DEIN_EBAY_NAME" target="_blank" rel="noopener noreferrer" className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-white font-semibold shadow hover:bg-slate-800 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600">
              eBay-Profil ansehen <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="https://www.kleinanzeigen.de/s-bestandsliste.html?userId=DEINE_USER_ID" target="_blank" rel="noopener noreferrer" className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-full bg-orange-600 px-5 py-3 text-white font-semibold shadow hover:bg-orange-700 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600">
              Kleinanzeigen ansehen <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href={business.whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-white font-semibold shadow hover:bg-emerald-700 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-600">
              <MessageCircle size={18} aria-hidden="true" /> Fragen per WhatsApp
            </Link>
          </div>
        </div>

        {/* Info-Karten */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
          <Card className="h-full">
            <CardTitle className="flex items-center gap-2 text-slate-900 font-semibold">
              <MapPin className="text-orange-600" aria-hidden="true" /> Abholung nach Termin
            </CardTitle>
            <CardContent className="mt-2 text-slate-600">
              <span className="font-medium">Abholadresse:</span> nach Vereinbarung. Termin bitte vorher abstimmen.
            </CardContent>
          </Card>
          <Card className="h-full">
            <CardTitle className="flex items-center gap-2 text-slate-900 font-semibold">
              <Truck className="text-orange-600" aria-hidden="true" /> Lieferung im Umkreis
            </CardTitle>
            <CardContent className="mt-2 text-slate-600">
              Lieferung im Umkreis von Schwerin ist möglich. Sprechen Sie uns an – wir nennen Ihnen gern die Kosten.
            </CardContent>
          </Card>
          <Card className="h-full">
            <CardTitle className="flex items-center gap-2 text-slate-900 font-semibold">
              <Shield className="text-orange-600" aria-hidden="true" /> Hinweis
            </CardTitle>
            <CardContent className="mt-2 text-slate-600">
              reset ist kein Ladengeschäft. Besichtigung und Abholung sind nur nach vorheriger Absprache möglich.
            </CardContent>
          </Card>
        </div>

        {/* Mini-FAQ */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          <Card>
            <CardTitle className="text-slate-900 font-semibold">Versand möglich?</CardTitle>
            <CardContent className="mt-2 text-slate-600">Nein. Alle Artikel werden ausschließlich vor Ort abgeholt oder auf Wunsch im Umkreis geliefert.</CardContent>
          </Card>
          <Card>
            <CardTitle className="text-slate-900 font-semibold">Wie mache ich einen Termin?</CardTitle>
            <CardContent className="mt-3 flex items-center justify-between gap-4">
              <p className="text-slate-600 leading-relaxed">Am schnellsten telefonisch – rufen Sie uns direkt an.</p>
              <Link href={phoneHref} aria-label={`Jetzt anrufen: ${phoneLabel}`} className="shrink-0 inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-white shadow hover:bg-orange-700 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600" title={`Jetzt anrufen: ${phoneLabel}`}>
                <Phone aria-hidden="true" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
