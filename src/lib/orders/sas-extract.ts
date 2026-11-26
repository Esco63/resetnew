import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";

/** Was aus einem SAS-Beleg (Wertstoffhof-Quittung) gelesen wird. */
export const SasReceiptSchema = z.object({
  is_sas_receipt: z
    .boolean()
    .describe("true, wenn es ein Kassenbeleg der SAS Schwerin (Wertstoffhof) ist"),
  receipt_date: z
    .string()
    .nullable()
    .describe("Belegdatum im Format YYYY-MM-DD, null wenn nicht lesbar"),
  receipt_time: z.string().nullable().describe("Uhrzeit HH:MM, null wenn nicht lesbar"),
  receipt_number: z.string().nullable().describe("Belegnummer (Feld 'Beleg:')"),
  gross: z.number().nullable().describe("Gesamt (brutto) in Euro"),
  net: z.number().nullable().describe("Netto in Euro"),
  vat: z.number().nullable().describe("MwSt-Betrag in Euro"),
  items: z
    .array(
      z.object({
        name: z.string().describe("Bezeichnung, z. B. 'Sperrmüll GK SN [m³]'"),
        quantity: z.number().nullable(),
        amount: z.number().nullable().describe("Positionsbetrag in Euro"),
      })
    )
    .describe("Einzelpositionen des Belegs"),
});
export type SasReceiptData = z.infer<typeof SasReceiptSchema>;

const SUPPORTED_IMAGES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;

const PROMPT = `Lies diesen Kassenbeleg vom Wertstoffhof der SAS Schwerin (Schweriner Abfallentsorgungs- und Straßenreinigungsgesellschaft) aus.

- receipt_date: das Datum hinter "Datum und Zeit" (Format auf dem Beleg TT.MM.JJ, z. B. 24.09.26 = 2026-09-24).
- receipt_number: die Nummer hinter "Beleg:".
- gross: "Gesamt (brutto)", net: "Netto", vat: der MwSt-Betrag.
- items: jede Position mit Bezeichnung, Menge und Betrag in Euro.
Beträge als Zahl mit Punkt als Dezimaltrenner (59,20 € → 59.2). Was nicht sicher lesbar ist, setzt du auf null statt zu raten.
Ist das kein SAS-Beleg, setze is_sas_receipt auf false.`;

let client: Anthropic | null = null;
function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY fehlt in Vercel – Belege können nicht automatisch gelesen werden.");
  }
  client ??= new Anthropic();
  return client;
}

export function canReadReceipts() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/** Liest einen SAS-Beleg (PDF oder Foto) mit Claude aus. */
export async function extractSasReceipt(file: Buffer, contentType: string): Promise<SasReceiptData> {
  let source: Anthropic.Beta.BetaContentBlockParam;
  if (contentType === "application/pdf") {
    source = {
      type: "document",
      source: { type: "base64", media_type: "application/pdf", data: file.toString("base64") },
    };
  } else if ((SUPPORTED_IMAGES as readonly string[]).includes(contentType)) {
    source = {
      type: "image",
      source: {
        type: "base64",
        media_type: contentType as (typeof SUPPORTED_IMAGES)[number],
        data: file.toString("base64"),
      },
    };
  } else {
    throw new Error(`Dateiformat ${contentType} kann nicht gelesen werden – bitte als PDF oder JPG.`);
  }

  const response = await getClient().beta.messages.parse({
    model: "claude-opus-5-5",
    max_tokens: 4000,
    // Bei einer Ablehnung übernimmt automatisch ein anderes Modell.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: {
      effort: "low",
      format: betaZodOutputFormat(SasReceiptSchema),
    },
    messages: [{ role: "user", content: [source, { type: "text", text: PROMPT }] }],
  });

  if (response.stop_reason === "refusal") {
    throw new Error("Der Beleg konnte nicht ausgelesen werden (abgelehnt).");
  }
  if (response.stop_reason === "max_tokens" || !response.parsed_output) {
    throw new Error("Der Beleg konnte nicht ausgelesen werden.");
  }

  const data = response.parsed_output;
  if (data.receipt_date && !/^\d{4}-\d{2}-\d{2}$/.test(data.receipt_date)) data.receipt_date = null;
  return data;
}
