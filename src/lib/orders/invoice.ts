import type { Order } from "./types";

/**
 * Rechnungsmuster für NBC-Aufträge, abgeleitet aus den bisherigen
 * Lexware-Rechnungen (z. B. RE0128, RE0130):
 *   Pos. 1  Sperrmüll-Leistung, Stunden × 35,00 € netto, Beschreibung = Objekt
 *   Pos. 2  Entsorgung, 1 Stück, netto = SAS-Bruttobetrag auf volle Euro aufgerundet
 * 19 % USt, 14 Tage Zahlungsziel (Lexware-Standard), Leistungsdatum = Einsatztag.
 */
export const NBC_INVOICE = {
  contactId: "c8cfab8e-6029-4ba8-8942-29c16beb4c10",
  taxRatePercentage: 19,
  labour: {
    articleId: "93f4cb8e-ecd2-4ec2-8fb1-a2b9750314cc",
    name: "Sperrmüll fachgerecht entfernt, entsorgt und Abstellfläche gereinigt",
    unitName: "Stunde",
    unitPriceNet: 35,
  },
  disposal: {
    articleId: "083397bf-1369-47e3-bb73-884f5943165b",
    name: "Fachgerechte Entsorgung anfallender Materialien",
    unitName: "Stück",
  },
} as const;

/** SAS-Bruttobetrag → Nettopreis der Entsorgungsposition (auf volle Euro aufrunden). */
export function disposalNetFromSasGross(sasGross: number) {
  // kleine Toleranz, damit z. B. 59.0000001 nicht zu 60 wird
  return Math.max(0, Math.ceil(Math.round(sasGross * 100) / 100 - 1e-9));
}

export type InvoiceLine = {
  name: string;
  description?: string;
  quantity: number;
  unitName: string;
  unitPriceNet: number;
  amountNet: number;
};

export type InvoicePreview = {
  lines: InvoiceLine[];
  totalNet: number;
  totalTax: number;
  totalGross: number;
  missing: string[];
};

const toCents = (value: number) => Math.round(value * 100);
const fromCents = (cents: number) => cents / 100;

export function buildInvoicePreview(
  order: Pick<Order, "object_address" | "hours" | "disposal_net" | "work_date">
): InvoicePreview {
  const missing: string[] = [];
  if (!order.object_address.trim()) missing.push("Objekt / Adresse");
  if (!order.work_date) missing.push("Einsatzdatum");
  if (!order.hours) missing.push("Stunden");
  if (order.disposal_net === null || order.disposal_net === undefined) {
    missing.push("Entsorgungsbetrag (SAS-Beleg)");
  }

  const lines: InvoiceLine[] = [];
  if (order.hours) {
    lines.push({
      name: NBC_INVOICE.labour.name,
      description: order.object_address.trim() || undefined,
      quantity: Number(order.hours),
      unitName: NBC_INVOICE.labour.unitName,
      unitPriceNet: NBC_INVOICE.labour.unitPriceNet,
      amountNet: fromCents(Math.round(Number(order.hours) * toCents(NBC_INVOICE.labour.unitPriceNet))),
    });
  }
  if (order.disposal_net !== null && order.disposal_net !== undefined && Number(order.disposal_net) > 0) {
    lines.push({
      name: NBC_INVOICE.disposal.name,
      quantity: 1,
      unitName: NBC_INVOICE.disposal.unitName,
      unitPriceNet: Number(order.disposal_net),
      amountNet: Number(order.disposal_net),
    });
  }

  const netCents = lines.reduce((sum, line) => sum + toCents(line.amountNet), 0);
  const taxCents = Math.round((netCents * NBC_INVOICE.taxRatePercentage) / 100);

  return {
    lines,
    totalNet: fromCents(netCents),
    totalTax: fromCents(taxCents),
    totalGross: fromCents(netCents + taxCents),
    missing,
  };
}

export function formatEuro(value: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);
}
