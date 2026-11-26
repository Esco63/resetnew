// src/app/page.tsx (oder entsprechende Route)
import SiteHeader from "@/components/layout/SiteHeader";
import StickyBar from "@/components/layout/StickyBar";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/sections/Hero";
import TrustBadges from "@/components/sections/TrustBadges";
import ServicesGrid from "@/components/sections/ServicesGrid";
import BeforeAfter from "@/components/sections/BeforeAfter";
import Benefits from "@/components/sections/Benefits";
import Pricing from "@/components/sections/Pricing";
import Marketplace from "@/components/sections/Marketplace";
import Reviews from "@/components/sections/Reviews";
import FAQ, { FAQ_ITEMS } from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

import JsonLd from "@/components/seo/JsonLd";
import { buildLocalBusinessLd } from "@/lib/business";

export default function Page() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      {/* SEO: LocalBusiness JSON-LD */}
      <JsonLd id="ld-localbusiness" data={buildLocalBusinessLd()} />
      <JsonLd id="ld-faq" data={faqLd} />

      {/* Header inkl. Topbar (auto-hide) */}
      <SiteHeader />

      {/* Hauptinhalt */}
      <main id="main" role="main">
        <Hero />
        <TrustBadges />
        <ServicesGrid />
        <BeforeAfter />
        <Benefits />
        <Pricing />
        <Marketplace />
        <Reviews />
        <FAQ />
        <Contact />
      </main>

      {/* Sticky-Bottom-CTA + Footer */}
      <StickyBar />
      <Footer />
    </>
  );
}
