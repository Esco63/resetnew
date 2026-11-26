"use client";

import Link from "@/components/ui/Link";
import { ArrowRight, MessageCircle, Phone, Sparkles } from "lucide-react";
import { business } from "@/lib/business";

export default function StickyBar() {
  return (
    <div className="sticky bottom-0 z-50 bg-white/95 backdrop-blur shadow-[0_-12px_30px_-12px_rgba(0,0,0,0.25)] ring-1 ring-slate-200/60">
      <div className="mx-auto max-w-7xl px-4 md:px-8 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] flex items-center justify-between gap-3">
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-700">
          <Sparkles size={16} aria-hidden="true" /> Unverbindlich & diskret
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Link
            href={business.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-white font-semibold shadow hover:bg-emerald-700 transition"
          >
            <MessageCircle size={18} aria-hidden="true" /> WhatsApp
          </Link>
          <Link
            href="/#kontakt"
            className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-2.5 text-white font-semibold shadow hover:bg-orange-700 transition"
          >
            Jetzt kostenlos anfragen <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <div className="md:hidden grid grid-cols-3 gap-1.5 w-full">
          <Link
            href={`tel:${business.phoneLink}`}
            className="inline-flex min-w-0 items-center justify-center gap-1 rounded-xl ring-1 ring-slate-300 bg-white px-1.5 py-2 text-xs font-semibold shadow-sm hover:bg-slate-50"
            aria-label="Anrufen"
          >
            <Phone size={18} aria-hidden="true" /> Anruf
          </Link>
          <Link
            href={business.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-w-0 items-center justify-center gap-1 rounded-xl bg-emerald-600 px-1.5 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-700"
            aria-label="WhatsApp Chat starten"
          >
            <MessageCircle size={18} aria-hidden="true" /> WhatsApp
          </Link>
          <Link
            href="/#kontakt"
            className="inline-flex min-w-0 items-center justify-center gap-1 rounded-xl bg-orange-600 px-1.5 py-2 text-xs font-semibold text-white shadow hover:bg-orange-700"
            aria-label="Angebot anfordern"
          >
            <Sparkles size={18} aria-hidden="true" /> Angebot
          </Link>
        </div>
      </div>
    </div>
  );
}
