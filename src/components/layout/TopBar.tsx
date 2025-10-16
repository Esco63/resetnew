// src/components/layout/TopBar.tsx
import Container from "@/components/ui/Container";
import Link from "@/components/ui/Link";
import { business } from "@/lib/business";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

export default function TopBar() {
  return (
    <div className="hidden md:block bg-slate-900 text-white text-sm">
      <Container className="py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <MapPin size={16} aria-hidden="true" /> {business.serviceArea}
          </span>
          <Link
            href={`mailto:${business.email}`}
            variant="link"
            className="flex items-center gap-1 hover:underline"
          >
            <Mail size={16} aria-hidden="true" /> {business.email}
          </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          <Link
            href={`tel:${business.phoneLink}`}
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-3 py-1.5 font-medium shadow hover:bg-orange-600 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600"
            aria-label={`Anrufen: ${business.phoneHuman}`}
          >
            <Phone size={16} aria-hidden="true" /> {business.phoneHuman}
          </Link>
          <Link
            href={business.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1.5 font-medium text-white shadow hover:bg-emerald-700 active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-600"
            aria-label="WhatsApp öffnen"
          >
            <MessageCircle size={16} aria-hidden="true" /> WhatsApp
          </Link>
        </div>
      </Container>
    </div>
  );
}
