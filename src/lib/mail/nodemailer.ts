import nodemailer from "nodemailer";

export function createSmtpTransport() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    throw new Error("SMTP_USER or SMTP_PASS is missing.");
  }

  const port = Number(process.env.SMTP_PORT || 465);
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

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtps.udag.de",
    port,
    secure: port === 465,
    auth: { user, pass },
    authMethod: "LOGIN",
    requireTLS: port !== 465,
    tls: { minVersion: "TLSv1.2", rejectUnauthorized: false },
    dkim,
  });
}

export function getMailAddresses() {
  const from = process.env.CONTACT_FROM;
  const to = process.env.CONTACT_TO;
  if (!from || !to) {
    throw new Error("CONTACT_FROM or CONTACT_TO is missing.");
  }

  return {
    from,
    to,
    envelopeFrom: process.env.SMTP_ENVELOPE_FROM || "info@reset-service.de",
  };
}
