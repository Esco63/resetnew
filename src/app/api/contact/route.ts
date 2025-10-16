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
  email: "info@reset-service.de", // muss zu deiner Domain-DKIM/SPF passen
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

/** --- Types --- */
type SendBothArgs = {
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
  unsubscribeUrl: string;
};

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "unknown";

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

  // Honeypot -> still OK (silent success)
  if (hp && hp.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // Required ENV
  const TO = mustEnv("CONTACT_TO");
  const FROM = mustEnv("CONTACT_FROM"); // z.B. 'reset. Schwerin <info@reset-service.de>' ODER nur 'info@reset-service.de'
  const USER = mustEnv("SMTP_USER");
  const PASS = mustEnv("SMTP_PASS");

  // Optional ENV (mit Defaults)
  const ENVELOPE_FROM = process.env.SMTP_ENVELOPE_FROM || BRAND.email; // z.B. bounce@reset-service.de
  const SMTP_HOST = process.env.SMTP_HOST || "smtps.udag.de";
  const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
  const UNSUBSCRIBE_HTTPS =
    process.env.UNSUBSCRIBE_HTTPS || `${BRAND.site}/api/unsubscribe`;

  /** Plaintext fallback */
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

  /** HTML (internal) – KEINE Aktions-Buttons mehr */
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
    actions: [],
    legal: [
      "Sie erhalten diese Benachrichtigung, weil das Kontaktformular auf Ihrer Website ausgefüllt wurde.",
      `Weitere Informationen zur Datenverarbeitung finden Sie in unserer <a href="${BRAND.privacyUrl}" style="color:${BRAND.brandPrimary};text-decoration:underline;">Datenschutzerklärung</a>.`,
    ],
    extraBox: {
      title: "Vorgeschlagene Antwort",
      contentPre: replyTemplate(name, message),
    },
    variant: "internal",
    signature: true, // interne Mail darf ruhig die Signatur zeigen
  });

  /** HTML (auto-reply to sender) – Empfangsbestätigung & „umgehend“ */
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
      "Diese E-Mail ist eine automatische Empfangsbestätigung zu Ihrer Anfrage über unser Kontaktformular.",
      `Details zum Datenschutz: <a href="${BRAND.privacyUrl}" style="color:${BRAND.brandPrimary};text-decoration:underline;">Datenschutzerklärung</a>.`,
    ],
    signature: true,      // Signatur aktiv: Footer zeigt nur Rechtliches, keine Doppelung
    helpfulNextSteps: true,
    actions: [],
    variant: "external",
  });

  const subject = `Neue Kontaktanfrage – ${name}`;

  // Optional DKIM
  const dkim =
    process.env.SMTP_DKIM_DOMAIN &&
    process.env.SMTP_DKIM_SELECTOR &&
    process.env.SMTP_DKIM_PRIVATE_KEY
      ? {
          domainName: process.env.SMTP_DKIM_DOMAIN,
          keySelector: process.env.SMTP_DKIM_SELECTOR,
          privateKey: process.env.SMTP_DKIM_PRIVATE_KEY.replace(/\\n/g, "\n"),
          cacheDir: false as const,
        }
      : undefined;

  try {
    // Primary Transport
    const primary = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: USER, pass: PASS },
      authMethod: "LOGIN",
      requireTLS: SMTP_PORT !== 465,
      tls: { minVersion: "TLSv1.2", rejectUnauthorized: false },
      dkim,
    });

    await primary.verify();
    await sendBoth(primary, {
      FROM,
      TO,
      subject,
      text,
      htmlInternal,
      htmlAuto,
      email: email || undefined,
      name,
      message,
      ip,
      envelopeFrom: ENVELOPE_FROM,
      unsubscribeUrl: UNSUBSCRIBE_HTTPS,
    });
    return NextResponse.json({ ok: true });
  } catch (errPrimary) {
    // Fallbacks: zuerst 465 SSL, dann 587 STARTTLS, falls Primary anderweitig gesetzt war
    try {
      const t465 = nodemailer.createTransport({
        host: "smtps.udag.de",
        port: 465,
        secure: true,
        auth: { user: USER, pass: PASS },
        authMethod: "LOGIN",
        tls: { minVersion: "TLSv1.2", rejectUnauthorized: false },
        dkim,
      });
      await t465.verify();
      await sendBoth(t465, {
        FROM,
        TO,
        subject,
        text,
        htmlInternal,
        htmlAuto,
        email: email || undefined,
        name,
        message,
        ip,
        envelopeFrom: ENVELOPE_FROM,
        unsubscribeUrl: UNSUBSCRIBE_HTTPS,
      });
      return NextResponse.json({ ok: true });
    } catch (err465) {
      try {
        const t587 = nodemailer.createTransport({
          host: "smtp.udag.de",
          port: 587,
          secure: false,
          auth: { user: USER, pass: PASS },
          authMethod: "LOGIN",
          requireTLS: true,
          tls: { minVersion: "TLSv1.2", rejectUnauthorized: false },
          dkim,
        });
        await t587.verify();
        await sendBoth(t587, {
          FROM,
          TO,
          subject,
          text,
          htmlInternal,
          htmlAuto,
          email: email || undefined,
          name,
          message,
          ip,
          envelopeFrom: ENVELOPE_FROM,
          unsubscribeUrl: UNSUBSCRIBE_HTTPS,
        });
        return NextResponse.json({ ok: true });
      } catch (err587) {
        return NextResponse.json(
          {
            ok: false,
            error: "SMTP login failed",
            debug: { primary: errAsJson(errPrimary), a465: errAsJson(err465), b587: errAsJson(err587) },
          },
          { status: 500 }
        );
      }
    }
  }
}

/** Versand: intern + (optional) Auto-Reply */
async function sendBoth(
  transporter: Transporter,
  args: SendBothArgs
) {
  const {
    FROM,
    TO,
    subject,
    text,
    htmlInternal,
    htmlAuto,
    email,
    name,
    message,
    ip,
    envelopeFrom,
    unsubscribeUrl,
  } = args;

  // Anti-Spam: konsistente Header inkl. One-Click Unsubscribe
  const commonHeaders: Record<string, string> = {
    "X-Originating-IP": ip,
    "Content-Language": "de",
    "List-Unsubscribe": `<mailto:${BRAND.email}>, <${unsubscribeUrl}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    "X-Auto-Response-Suppress": "All",
  };

  // interne Benachrichtigung
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

  // Auto-Reply an Absender
  if (email && email !== "") {
    await transporter.sendMail({
      from: FROM,
      to: email,
      subject: "Empfangsbestätigung: Wir melden uns umgehend",
      text: makeAutoTextReceipt(name, message),
      html: htmlAuto,
      headers: {
        ...commonHeaders,
        "Auto-Submitted": "auto-replied",
        "Precedence": "auto_reply",
      },
      envelope: { from: envelopeFrom, to: email },
    });
  }
}

/** -------- Helpers -------- */
function replyTemplate(name: string, originalMessage?: string) {
  const quoted = originalMessage ? `\n\n— Ihre Nachricht —\n${originalMessage}` : "";
  return `Hallo ${name},

vielen Dank für Ihre Anfrage! Damit wir Ihnen schnell ein faires Angebot machen können, schicken Sie uns bitte (falls vorhanden):
- Adresse des Objekts
- Gewünschter Zeitraum/Termin
- Kurzbeschreibung (Anzahl Zimmer / Keller / Dachboden etc.)
- Fotos oder ein kurzer Handy-Video-Rundgang (optional)

Wir melden uns umgehend.

Freundliche Grüße
${BRAND.name}
${BRAND.address}
Tel. ${BRAND.phoneHuman} • ${BRAND.email}
${BRAND.site}${quoted}`;
}

function makeAutoTextReceipt(name: string, msg: string) {
  return `Hallo ${name},

vielen Dank für Ihre Nachricht. Diese E-Mail ist Ihre Empfangsbestätigung.
Wir melden uns umgehend bei Ihnen.

Zusammenfassung:
${msg}

Freundliche Grüße
${BRAND.name}
${BRAND.address}
Tel. ${BRAND.phoneHuman} • ${BRAND.email}
${BRAND.site}
`;
}

function errAsJson(err: unknown) {
  const e = err as Record<string, unknown> | undefined;
  return {
    name: (e?.name as string) ?? undefined,
    message: (e?.message as string) ?? undefined,
    code: e?.code ?? undefined,
    response: e?.response ?? undefined,
    responseCode: e?.responseCode ?? undefined,
    command: e?.command ?? undefined,
  };
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function mustEnv(key: string): string {
  const v = process.env[key];
  if (!v || v.trim() === "") throw new Error(`Missing required env var: ${key}`);
  return v;
}

/** Responsive, mobile- & Outlook-freundliches Template (ohne VML)
 *  Signatur zeigt die Kontaktdaten.
 *  Footer darunter zeigt NUR Rechtliches (kein erneutes Adress-/Kontakt-Block).
 */
function emailTemplate(opts: {
  preheader?: string;
  title: string;
  intro?: string[];
  facts?: Array<[label: string, value: string]>;
  messageLabel?: string;
  messageBody?: string;
  actions?: { label: string; href: string }[];
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
    actions = [],
    legal = [],
    extraBox,
    signature = false,
    helpfulNextSteps = false,
  } = opts;

  const brand = BRAND;
  const textColor = brand.brandDark;
  const muted = brand.brandMuted;

  const actionsHtml = ""; // Buttons global deaktiviert

  const factsHtml =
    facts.length > 0
      ? `<tr><td style="padding:16px 24px 0 24px;">
           <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 8px;">
             ${facts
               .map(
                 ([label, value]) => `
               <tr>
                 <td style="width:140px;vertical-align:top;color:${muted};font-size:13px;padding:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">${escapeHtml(
                   label
                 )}</td>
                 <td style="color:${textColor};font-size:14px;padding:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">${escapeHtml(
                   value || "-"
                 )}</td>
               </tr>`
               )
               .join("")}
           </table>
         </td></tr>`
      : "";

  const msgHtml = messageBody
    ? `<tr><td style="padding:16px 24px 0 24px;">
         <div style="font-size:12px;color:${muted};margin:0 0 6px 0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">${escapeHtml(
           messageLabel || "Nachricht"
         )}</div>
         <div style="white-space:pre-wrap;background:${brand.brandSoftBg};border:1px solid #e2e8f0;border-radius:12px;padding:12px;color:${textColor};font-size:14px;line-height:1.6;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
           ${escapeHtml(messageBody)}
         </div>
       </td></tr>`
    : "";

  const intros =
    intro.length > 0
      ? `<tr><td style="padding:8px 24px 0 24px;">
           ${intro
             .map(
               (p) =>
                 `<p style="margin:8px 0 0 0;color:${muted};font-size:14px;line-height:1.6;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">${p}</p>`
             )
             .join("")}
         </td></tr>`
      : "";

  const extra =
    extraBox
      ? `<tr><td style="padding:20px 24px 0 24px;">
           <div style="background:${brand.brandSoftBg};border:1px solid #e2e8f0;border-radius:12px;padding:12px;">
             <div style="font-weight:700;color:${textColor};font-size:14px;margin-bottom:6px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">${escapeHtml(
               extraBox.title
             )}</div>
             <pre style="white-space:pre-wrap;margin:0;font-size:13px;line-height:1.6;color:${textColor};font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">${escapeHtml(
               extraBox.contentPre
             )}</pre>
           </div>
         </td></tr>`
      : "";

  const helpfulBlock = helpfulNextSteps
    ? `<tr><td style="padding:16px 24px 0 24px;">
         <div style="font-size:12px;color:${muted};margin:0 0 6px 0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">Wie es jetzt weitergeht</div>
         <div style="background:${brand.brandSoftBg};border:1px solid #e2e8f0;border-radius:12px;padding:12px;color:${textColor};font-size:14px;line-height:1.6;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
           <ol style="margin:0 0 0 18px;padding:0;">
             <li>Antworten Sie gerne auf diese E-Mail mit <b>Adresse</b> und <b>zeitlicher Vorstellung</b>.</li>
             <li>Optional: Senden Sie uns <b>Fotos</b> oder einen <b>kurzen Video-Rundgang</b>.</li>
             <li>Wir melden uns mit einem <b>transparenten Angebot</b> und möglichen Terminen.</li>
           </ol>
         </div>
       </td></tr>`
    : "";

  /** Signatur: enthält die Kontaktdaten */
  const signatureBlock = signature
    ? `<tr><td style="padding:16px 24px 8px 24px;">
         <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
           <tr>
             <td style="vertical-align:top;width:56px;">
               <div style="height:48px;width:48px;border-radius:12px;background:${brand.brandSoftBg};border:1px solid #e2e8f0;text-align:center;line-height:48px;font-weight:900;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${brand.brandPrimary};">r</div>
             </td>
             <td style="vertical-align:top;">
               <p style="margin:0;font-weight:700;color:${textColor};font-size:14px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">${brand.name}</p>
               <p style="margin:2px 0 0 0;color:${muted};font-size:12px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">Auflösen • Räumen • Neuanfangen</p>
               <p style="margin:8px 0 0 0;color:${textColor};font-size:13px;line-height:1.6;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
                 ${brand.address}<br/>
                 Tel. ${brand.phoneHuman} • <a href="mailto:${brand.email}" style="color:${brand.brandPrimary};text-decoration:underline;">${brand.email}</a>
               </p>
               <p style="margin:6px 0 0 0;">
                 <a href="${brand.site}" style="color:${brand.brandPrimary};font-size:12px;text-decoration:underline;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">${brand.site.replace(/^https?:\/\//, "")}</a>
               </p>
             </td>
           </tr>
         </table>
       </td></tr>`
    : "";

  /** Footer: wenn Signatur aktiv, KEINE erneute Adress-/Kontaktzeile */
  const footerContactHtml = signature
    ? ""
    : `<p style="margin:0 0 8px 0;color:${muted};font-size:12px;line-height:1.6;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
         ${brand.name} • ${brand.address}<br/>
         Tel. ${brand.phoneHuman} • <a href="mailto:${brand.email}" style="color:${brand.brandPrimary};text-decoration:underline;">${brand.email}</a> • 
         <a href="${brand.site}" style="color:${brand.brandPrimary};text-decoration:underline;">${brand.site.replace(/^https?:\/\//, "")}</a>
       </p>`;

  const legalHtml =
    legal.length
      ? `<div style="margin-top:${signature ? "0" : "6px"};color:${muted};font-size:12px;line-height:1.6;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
           ${legal.map((l) => `<p style="margin:6px 0 0 0;">${l}</p>`).join("")}
         </div>`
      : "";

  const legalLinks =
    `<p style="margin:${signature ? "0" : "10px"} 0 0 0;color:${muted};font-size:12px;line-height:1.6;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
       <a href="${brand.imprintUrl}" style="color:${brand.brandPrimary};text-decoration:underline;">Impressum</a> · 
       <a href="${brand.privacyUrl}" style="color:${brand.brandPrimary};text-decoration:underline;">Datenschutz</a>
     </p>`;

  return `
  <!doctype html>
  <html lang="de">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${escapeHtml(title)}</title>
      <style>
        @media (max-width: 600px) {
          .container { width: 100% !important; }
          .padded { padding: 16px !important; }
          .hero-title { font-size: 20px !important; }
        }
      </style>
    </head>
    <body style="margin:0;background:${brand.brandSoftBg};">
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>

      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${brand.brandSoftBg};">
        <tr>
          <td align="center" style="padding:24px;">
            <table role="presentation" width="600" class="container" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:${brand.brandBg};border-radius:16px;border:1px solid #e2e8f0;box-shadow:0 2px 12px rgba(0,0,0,0.06);overflow:hidden;">
              <tr>
                <td style="background:${brand.brandBg};padding:24px 24px 8px 24px;text-align:left;">
                  <div style="font-weight:900;font-size:22px;letter-spacing:-0.02em;color:${brand.brandDark};font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
                    <span style="color:${brand.brandDark}">re</span><span style="color:${brand.brandPrimary}">set.</span>
                    <span style="color:${brand.brandMuted};font-weight:600;font-size:14px;margin-left:8px;">Schwerin</span>
                  </div>
                </td>
              </tr>

              <tr>
                <td class="padded" style="padding:8px 24px 0 24px;">
                  <h1 class="hero-title" style="margin:0;font-size:24px;line-height:1.3;color:${brand.brandDark};font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
                    ${escapeHtml(title)}
                  </h1>
                </td>
              </tr>

              ${intros}
              ${factsHtml}
              ${msgHtml}
              ${helpfulBlock}
              ${actionsHtml}
              ${extra}

              <tr><td style="padding:20px 24px 0 24px;"><div style="height:1px;background:#e2e8f0;"></div></td></tr>

              ${signatureBlock}

              <tr>
                <td class="padded" style="padding:16px 24px 24px 24px;">
                  ${footerContactHtml}
                  ${legalHtml}
                  ${legalLinks}
                </td>
              </tr>
            </table>
            <div style="height:32px;"></div>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}
