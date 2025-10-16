import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer, { type Transporter } from "nodemailer";

export const runtime = "nodejs";

/** --- Branding / Business --- */
const BRAND = {
  name: "reset. Schwerin",
  brandPrimary: "#ea580c",
  brandDark: "#0f172a",
  brandMuted: "#64748b",
  brandBg: "#ffffff",
  brandSoftBg: "#f8fafc",
  site: "https://reset-service.de",
  email: "info@reset-service.de",
  phoneHuman: "0176 / 72190267",
  address: "Wuppertaler Str. 34, 19063 Schwerin",
  privacyUrl: "https://reset-service.de/rechtliches",
  imprintUrl: "https://reset-service.de/rechtliches",
} as const;

/** --- Validation --- */
const ContactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: "Bitte gib deinen Namen an (mindestens 2 Zeichen)." })
      .max(100, { message: "Bitte max. 100 Zeichen für den Namen verwenden." }),
    email: z
      .string()
      .trim()
      .email({ message: "Bitte gib eine gültige E-Mail-Adresse an." })
      .optional()
      .or(z.literal("")),
    phone: z
      .string()
      .trim()
      .max(50, { message: "Bitte max. 50 Zeichen für die Telefonnummer verwenden." })
      .optional()
      .or(z.literal("")),
    message: z
      .string()
      .trim()
      .min(10, { message: "Bitte schreibe mindestens 10 Zeichen in die Nachricht." })
      .max(5000, { message: "Deine Nachricht ist zu lang (max. 5000 Zeichen)." }),
    hp: z.string().optional().or(z.literal("")),
  })
  .refine((v) => (v.email && v.email !== "") || (v.phone && v.phone !== ""), {
    message: "Bitte gib E-Mail oder Telefon an.",
    path: ["email"],
  });

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";

  let data: unknown;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { name, email, phone, message, hp } = parsed.data;

  // Honeypot -> silent success
  if (hp && hp.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // ENV
  const TO = mustEnv("CONTACT_TO");
  const FROM = mustEnv("CONTACT_FROM");
  const USER = mustEnv("SMTP_USER");
  const PASS = mustEnv("SMTP_PASS");
  const ENVELOPE_FROM = process.env.SMTP_ENVELOPE_FROM || BRAND.email;

  const text = [
    `Neue Kontaktanfrage (${BRAND.site})`,
    ``,
    `Name:    ${name}`,
    `E-Mail:  ${email || "-"}`,
    `Telefon: ${phone || "-"}`,
    `IP:      ${ip}`,
    ``,
    `Nachricht:`,
    message,
    ``,
    `—`,
    `${BRAND.name} • ${BRAND.address}`,
    `Tel. ${BRAND.phoneHuman} • ${BRAND.email}`,
    `Datenschutz: ${BRAND.privacyUrl}`,
  ].join("\n");

  const htmlInternal = emailTemplate({
    preheader: "Neue Kontaktanfrage über das Formular.",
    title: "Neue Kontaktanfrage",
    intro: [
      `Domain: <b>${escapeHtml(BRAND.site.replace(/^https?:\/\//, ""))}</b>`,
      `IP: <b>${escapeHtml(ip)}</b>`,
    ],
    facts: [
      ["Name", name],
      ["E-Mail", email || "-"],
      ["Telefon", phone || "-"],
    ],
    messageLabel: "Nachricht",
    messageBody: message,
    legal: [
      "Sie erhalten diese Benachrichtigung, weil das Kontaktformular auf Ihrer Website ausgefüllt wurde.",
      `Weitere Informationen finden Sie in unserer <a href="${BRAND.privacyUrl}" style="color:${BRAND.brandPrimary};text-decoration:underline;">Datenschutzerklärung</a>.`,
    ],
    extraBox: {
      title: "Vorgeschlagene Antwort",
      contentPre: replyTemplate(name, message),
    },
    variant: "internal",
  });

  const htmlAuto = emailTemplate({
    preheader: "Empfangsbestätigung: Wir melden uns umgehend.",
    title: "Empfangsbestätigung Ihrer Anfrage",
    intro: [
      "Vielen Dank! Ihre Nachricht ist bei uns eingegangen.",
      "Wir melden uns <b>umgehend</b> (in der Regel innerhalb kurzer Zeit).",
      "Hier ist Ihre Zusammenfassung:",
    ],
    facts: [
      ["Name", name],
      ["E-Mail", email || "-"],
      ["Telefon", phone || "-"],
    ],
    messageLabel: "Ihre Nachricht",
    messageBody: message,
    legal: [
      "Diese E-Mail ist eine automatische Empfangsbestätigung zu Ihrer Anfrage.",
      `Details zum Datenschutz: <a href="${BRAND.privacyUrl}" style="color:${BRAND.brandPrimary};text-decoration:underline;">Datenschutzerklärung</a>.`,
    ],
    signature: true,
    helpfulNextSteps: true,
    variant: "external",
  });

  const subject = `Neue Kontaktanfrage – ${name}`;

  try {
    const t465 = nodemailer.createTransport({
      host: "smtps.udag.de",
      port: 465,
      secure: true,
      auth: { user: USER, pass: PASS },
      authMethod: "LOGIN",
      tls: { minVersion: "TLSv1.2", rejectUnauthorized: false },
    });

    await t465.verify();
    await sendBoth(t465, { FROM, TO, subject, text, htmlInternal, htmlAuto, email, name, message, ip, envelopeFrom: ENVELOPE_FROM });
    return NextResponse.json({ ok: true });
  } catch (err465) {
    console.warn("[contact] 465 failed, trying 587:", (err465 as Error).message);

    try {
      const t587 = nodemailer.createTransport({
        host: "smtp.udag.de",
        port: 587,
        secure: false,
        auth: { user: USER, pass: PASS },
        authMethod: "LOGIN",
        requireTLS: true,
        tls: { minVersion: "TLSv1.2", rejectUnauthorized: false },
      });

      await t587.verify();
      await sendBoth(t587, { FROM, TO, subject, text, htmlInternal, htmlAuto, email, name, message, ip, envelopeFrom: ENVELOPE_FROM });
      return NextResponse.json({ ok: true });
    } catch (err587) {
      return NextResponse.json(
        { ok: false, error: "SMTP login failed", debug: { a465: errAsJson(err465), b587: errAsJson(err587) } },
        { status: 500 }
      );
    }
  }
}

async function sendBoth(
  transporter: Transporter,
  args: {
    FROM: string;
    TO: string;
    subject: string;
    text: string;
    htmlInternal: string;
    htmlAuto: string;
    email?: string;
    name: string;
    message: string;
    ip: string;
    envelopeFrom: string;
  }
) {
  const { FROM, TO, subject, text, htmlInternal, htmlAuto, email, ip, envelopeFrom } = args;
  const commonHeaders: Record<string, string> = {
    "X-Originating-IP": ip,
    "List-Unsubscribe": `<mailto:${BRAND.email}>`,
    "X-Auto-Response-Suppress": "All",
  };

  await transporter.sendMail({
    from: FROM,
    to: TO,
    subject,
    text,
    html: htmlInternal,
    replyTo: email && email !== "" ? email : undefined,
    headers: commonHeaders,
    envelope: { from: envelopeFrom, to: TO },
  });

  if (email && email !== "") {
    await transporter.sendMail({
      from: FROM,
      to: email,
      subject: "Empfangsbestätigung: Wir melden uns umgehend",
      text: makeAutoTextReceipt(args.name, args.message),
      html: htmlAuto,
      headers: {
        ...commonHeaders,
        "Auto-Submitted": "auto-replied",
        Precedence: "auto_reply",
      },
      envelope: { from: envelopeFrom, to: email },
    });
  }
}

/** --- Helpers --- */
function replyTemplate(name: string, originalMessage?: string) {
  const quoted = originalMessage ? `\n\n— Ihre Nachricht —\n${originalMessage}` : "";
  return `Hallo ${name},

vielen Dank für Ihre Anfrage!
Damit wir Ihnen schnell ein faires Angebot machen können, schicken Sie uns bitte:
- Adresse des Objekts
- Gewünschter Zeitraum
- Kurzbeschreibung (Zimmer, Keller etc.)
- Fotos oder Video (optional)

Wir melden uns umgehend.

Freundliche Grüße
${BRAND.name}
${BRAND.address}
Tel. ${BRAND.phoneHuman} • ${BRAND.email}
${BRAND.site}${quoted}`;
}

function makeAutoTextReceipt(name: string, msg: string) {
  return `Hallo ${name},

vielen Dank für Ihre Nachricht.
Diese E-Mail ist Ihre Empfangsbestätigung.
Wir melden uns umgehend bei Ihnen.

Zusammenfassung:
${msg}

Freundliche Grüße
${BRAND.name}
${BRAND.address}
Tel. ${BRAND.phoneHuman} • ${BRAND.email}
${BRAND.site}`;
}

function errAsJson(err: unknown) {
  const e = err as Record<string, unknown> | undefined;
  return {
    name: (e?.name as string) ?? undefined,
    message: (e?.message as string) ?? undefined,
    code: e?.code ?? undefined,
    responseCode: e?.responseCode ?? undefined,
    command: e?.command ?? undefined,
  };
}

function escapeHtml(input: string) {
  return input.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function mustEnv(key: string): string {
  const v = process.env[key];
  if (!v || v.trim() === "") throw new Error(`Missing required env var: ${key}`);
  return v;
}

/** Email Template */
function emailTemplate(opts: {
  preheader?: string;
  title: string;
  intro?: string[];
  facts?: Array<[label: string, value: string]>;
  messageLabel?: string;
  messageBody?: string;
  legal?: string[];
  extraBox?: { title: string; contentPre: string };
  signature?: boolean;
  helpfulNextSteps?: boolean;
  variant?: "internal" | "external";
}) {
  const {
    preheader = "",
    title,
    intro = [],
    facts = [],
    messageLabel,
    messageBody,
    legal = [],
    extraBox,
    signature = false,
    helpfulNextSteps = false,
  } = opts;

  const brand = BRAND;
  const muted = brand.brandMuted;
  const textColor = brand.brandDark;

  const factsHtml =
    facts.length > 0
      ? `<tr><td style="padding:16px 24px 0 24px;">
          <table width="100%" style="border-collapse:separate;border-spacing:0 8px;">
            ${facts
              .map(
                ([label, value]) => `
              <tr>
                <td style="width:140px;color:${muted};font-size:13px;">${escapeHtml(label)}</td>
                <td style="color:${textColor};font-size:14px;">${escapeHtml(value || "-")}</td>
              </tr>`
              )
              .join("")}
          </table>
        </td></tr>`
      : "";

  const msgHtml = messageBody
    ? `<tr><td style="padding:16px 24px 0 24px;">
         <div style="font-size:12px;color:${muted};margin:0 0 6px 0;">${escapeHtml(messageLabel || "Nachricht")}</div>
         <div style="white-space:pre-wrap;background:${brand.brandSoftBg};border:1px solid #e2e8f0;border-radius:12px;padding:12px;color:${textColor};font-size:14px;">
           ${escapeHtml(messageBody)}
         </div>
       </td></tr>`
    : "";

  const intros =
    intro.length > 0
      ? `<tr><td style="padding:8px 24px 0 24px;">
           ${intro.map((p) => `<p style="margin:8px 0 0 0;color:${muted};font-size:14px;line-height:1.6;">${p}</p>`).join("")}
         </td></tr>`
      : "";

  const extra =
    extraBox
      ? `<tr><td style="padding:20px 24px 0 24px;">
           <div style="background:${brand.brandSoftBg};border:1px solid #e2e8f0;border-radius:12px;padding:12px;">
             <div style="font-weight:700;color:${textColor};font-size:14px;margin-bottom:6px;">${escapeHtml(extraBox.title)}</div>
             <pre style="white-space:pre-wrap;margin:0;font-size:13px;line-height:1.6;color:${textColor};">${escapeHtml(extraBox.contentPre)}</pre>
           </div>
         </td></tr>`
      : "";

  const helpfulBlock = helpfulNextSteps
    ? `<tr><td style="padding:16px 24px 0 24px;">
         <div style="font-size:12px;color:${muted};margin:0 0 6px 0;">Wie es jetzt weitergeht</div>
         <div style="background:${brand.brandSoftBg};border:1px solid #e2e8f0;border-radius:12px;padding:12px;color:${textColor};font-size:14px;">
           <ol style="margin:0 0 0 18px;padding:0;">
             <li>Antworten Sie auf diese E-Mail mit <b>Adresse</b> und <b>Terminwunsch</b>.</li>
             <li>Optional: Senden Sie uns <b>Fotos</b> oder ein <b>Video</b>.</li>
             <li>Wir melden uns mit einem transparenten Angebot.</li>
           </ol>
         </div>
       </td></tr>`
    : "";

  const signatureBlock = signature
    ? `<tr><td style="padding:16px 24px 8px 24px;">
         <p style="margin:0;font-weight:700;color:${textColor};font-size:14px;">${brand.name}</p>
         <p style="margin:2px 0 0 0;color:${muted};font-size:12px;">Auflösen • Räumen • Neuanfangen</p>
         <p style="margin:8px 0 0 0;color:${textColor};font-size:13px;line-height:1.6;">
           ${brand.address}<br/>
           Tel. ${brand.phoneHuman} • <a href="mailto:${brand.email}" style="color:${brand.brandPrimary};text-decoration:underline;">${brand.email}</a>
         </p>
       </td></tr>`
    : "";

  return `<!doctype html><html lang="de"><head><meta charset="utf-8" /></head>
  <body style="background:${brand.brandSoftBg};">
  <table width="100%"><tr><td align="center" style="padding:24px;">
  <table width="600" style="background:${brand.brandBg};border-radius:16px;border:1px solid #e2e8f0;">
  <tr><td style="padding:24px;"><h1 style="font-size:22px;color:${brand.brandDark};">${escapeHtml(title)}</h1></td></tr>
  ${intros}${factsHtml}${msgHtml}${helpfulBlock}${extra}${signatureBlock}
  <tr><td style="padding:24px;font-size:12px;color:${muted};">
  ${brand.name} • ${brand.address}<br/>Tel. ${brand.phoneHuman} • ${brand.email}
  </td></tr>
  </table></td></tr></table></body></html>`;
}
