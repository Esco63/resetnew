// src/components/layout/StickyBar.tsx
import Container from "@/components/ui/Container";
import Link from "@/components/ui/Link";
import { business } from "@/lib/business";
import { ArrowRight, MessageCircle, Phone, Shield, Sparkles } from "lucide-react";

export default function StickyBar() {
  return (
    <div className="sticky bottom-0 z-50 bg-white/95 backdrop-blur shadow-[0_-12px_30px_-12px_rgba(0,0,0,0.25)] ring-1 ring-slate-200/60">
      <Container className="py-2.5 flex items-center justify-between gap-3">
        {/* Desktop Hinweis + Buttons */}
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-700">
          <Shield size={16} aria-hidden="true" /> Unverbindlich & diskret
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Link
            href={business.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-white font-semibold shadow hover:bg-emerald-700 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-600"
          >
            <MessageCircle size={18} aria-hidden="true" /> WhatsApp
          </Link>
          <Link
            href="#angebot"
            className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-2.5 text-white font-semibold shadow hover:bg-orange-700 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
          >
            Jetzt kostenlos anfragen <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile: 3-Aktions-Leiste */}
        <div className="md:hidden grid grid-cols-3 gap-2 w-full">
          <Link
            href={`tel:${business.phoneLink}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl ring-1 ring-slate-300 bg-white px-2 py-2 text-sm font-medium shadow-sm hover:bg-slate-50"
            aria-label="Anrufen"
          >
            <Phone size={18} aria-hidden="true" /> Anruf
          </Link>
          <Link
            href={business.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-2 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
            aria-label="WhatsApp Chat starten"
          >
            <MessageCircle size={18} aria-hidden="true" /> WhatsApp
          </Link>
          <Link
            href="#angebot"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-2 py-2 text-sm font-semibold text-white shadow hover:bg-orange-700"
            aria-label="Angebot anfordern"
          >
            <Sparkles size={18} aria-hidden="true" /> Angebot
          </Link>
        </div>
      </Container>
    </div>
  );
}
