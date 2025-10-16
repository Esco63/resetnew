import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
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
import Contact from "@/components/sections/Contact";

import JsonLd from "@/components/seo/JsonLd";
import { buildLocalBusinessLd } from "@/lib/business";

export default function Page() {
  return (
    <>
      {/* SEO: LocalBusiness JSON-LD */}
      <JsonLd id="ld-localbusiness" data={buildLocalBusinessLd()} />

      {/* Header (Top-Leiste + Navigation) */}
      <TopBar />
      <Header />

      {/* Hauptinhalt */}
      <main id="main">
        <Hero />
        <TrustBadges />
        <ServicesGrid />
        <BeforeAfter />
        <Benefits />
        <Pricing />
        <Marketplace />
        <Reviews />
        <Contact />
      </main>

      {/* Sticky-Bottom-CTA + Footer */}
      <StickyBar />
      <Footer />
    </>
  );
}
