"use client";

import { useEffect, useState } from "react";
import Link from "@/components/ui/Link";
import { Phone, MessageCircle, Sparkles } from "lucide-react";
import { business } from "@/lib/business";

export default function StickyBar() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY + 8) setShow(false);
      else if (y + 8 < lastY) setShow(true);
      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    const setOffset = () => {
      const safe = Number.parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue("env(safe-area-inset-bottom)")
          .replace("px", "") || "0",
        10
      );
      document.documentElement.style.setProperty(
        "--sticky-offset",
        `calc(${safe || 0}px + 12px)`
      );
    };
    setOffset();

    // 🩵 Typensichere VisualViewport-Erkennung
    const vv: VisualViewport | undefined = window.visualViewport ?? undefined;

    const onVV = () => setOffset();
    vv?.addEventListener("resize", onVV);
    vv?.addEventListener("scroll", onVV);

    return () => {
      window.removeEventListener("scroll", onScroll);
      vv?.removeEventListener("resize", onVV);
      vv?.removeEventListener("scroll", onVV);
    };
  }, []);

  return (
    <div
      className={[
        "site-fixed",
        "fixed inset-x-0 z-40 transition-transform duration-250 ease-out",
        show ? "translate-y-0" : "translate-y-[120%]",
      ].join(" ")}
      style={{ bottom: "var(--sticky-offset, 12px)" }}
    >
      <div className="mx-auto max-w-6xl px-4 no-x-overflow">
        <div className="rounded-full bg-white shadow-lg ring-1 ring-slate-200/70 px-2 py-2 flex items-center gap-2">
          <Link
            href={`tel:${business.phoneLink}`}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-slate-100 px-3 py-2 font-medium text-slate-500 shadow-sm hover:bg-slate-200"
          >
            <Phone size={18} /> Anruf
          </Link>

          <Link
            href={business.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-3 py-2 font-semibold text-white shadow hover:bg-emerald-700"
          >
            <MessageCircle size={18} /> WhatsApp
          </Link>

          <Link
            href="#angebot"
            className="flex-[1.4] inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-4 py-2 font-semibold text-white shadow hover:bg-orange-700"
          >
            <Sparkles size={18} /> Jetzt kostenlos anfragen
          </Link>
        </div>
      </div>
    </div>
  );
}
