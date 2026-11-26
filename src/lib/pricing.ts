export type PricingPlan = {
  name: string;
  priceFrom?: number;
  priceLabel?: string;
  points: string[];
  featured?: boolean;
  href?: string;
};

export type CalculatorPricingConfig = {
  haushalt: {
    basePerSqm: number;
    floorSurchargePctPerLevel: number;
    minPrice: number;
  };
  entrumpelung: {
    basePerSqm: number;
    floorSurchargePctPerLevel: number;
    minPrice: number;
  };
  transporte: {
    baseCityOnePickup: number;
    hourlyRate: number;
    kmRate: number;
    trailerExtra: number;
  };
};

export type PricingSettings = {
  homepagePlans: PricingPlan[];
  calculator: CalculatorPricingConfig;
};

export const DEFAULT_PRICING_SETTINGS: PricingSettings = {
  homepagePlans: [
    {
      name: "Schnell & Klein",
      priceFrom: 199,
      points: ["Kellerabteil", "1-2m³ Entsorgung", "Besenrein"],
    },
    {
      name: "Wohnung",
      priceFrom: 799,
      points: ["2-3 Zimmer", "Wertanrechnung möglich", "Besenrein + Entsorgung"],
      featured: true,
    },
    {
      name: "Haus komplett",
      priceFrom: 1999,
      points: ["120-160 m²", "Mehrtageseinsatz", "inkl. Abtransport"],
    },
  ],
  calculator: {
    haushalt: { basePerSqm: 18, floorSurchargePctPerLevel: 4, minPrice: 199 },
    entrumpelung: { basePerSqm: 12, floorSurchargePctPerLevel: 3, minPrice: 149 },
    transporte: {
      baseCityOnePickup: 79,
      hourlyRate: 30,
      kmRate: 1.2,
      trailerExtra: 20,
    },
  },
};

export const PRICING_STORAGE_KEY = "reset.pricing.settings.v1";

export function formatEuro(value: number): string {
  const formatted = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
  return `ab ${formatted}`;
}
