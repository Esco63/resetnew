import { ImapFlow } from "imapflow";
import { simpleParser, type AddressObject } from "mailparser";
import { getOrdersDb } from "./server";
import { NBC_SENDER_DOMAINS, isNbcSender, isOrderSubject, parseOrderMail } from "./mail-parse";
import { renderMailPdf } from "./mail-pdf";
import { mailPlainText } from "./mail-text";
import { ORDERS_BUCKET } from "./types";

export type MailImportResult = {
  checked: number;
  created: { id: string; object_address: string }[];
  skipped: number;
  errors: string[];
};

function firstAddress(value: AddressObject | AddressObject[] | undefined) {
  const list = Array.isArray(value) ? value : value ? [value] : [];
  return list.flatMap((entry) => entry.value).find((entry) => entry.address)?.address ?? null;
}

function addressText(value: AddressObject | AddressObject[] | undefined) {
  const list = Array.isArray(value) ? value : value ? [value] : [];
  return list.map((entry) => entry.text).join(", ");
}

/**
 * Liest NBC-Auftragsmails aus dem Posteingang (nur lesend, nichts wird markiert
 * oder verschoben) und legt für jedes Objekt einen Auftrag an. Bereits
 * importierte Mails werden anhand der Message-ID übersprungen.
 */
export async function importOrderMails({ since }: { since: Date }): Promise<MailImportResult> {
  const user = process.env.IMAP_USER || process.env.SMTP_USER;
  const pass = process.env.IMAP_PASS || process.env.SMTP_PASS;
  if (!user || !pass) throw new Error("Zugangsdaten für das Postfach fehlen (SMTP_USER/SMTP_PASS).");

  const db = getOrdersDb();
  const result: MailImportResult = { checked: 0, created: [], skipped: 0, errors: [] };

  const client = new ImapFlow({
    host: process.env.IMAP_HOST || "imaps.udag.de",
    port: Number(process.env.IMAP_PORT || 993),
    secure: true,
    auth: { user, pass },
    logger: false,
    socketTimeout: 45_000,
  });

  await client.connect();
  try {
    const lock = await client.getMailboxLock("INBOX", { readOnly: true });
    try {
      const uids = new Set<number>();
      for (const domain of NBC_SENDER_DOMAINS) {
        const found = await client.search({ since, from: domain }, { uid: true });
        if (Array.isArray(found)) found.forEach((uid) => uids.add(uid));
      }

      for (const uid of [...uids].sort((a, b) => a - b)) {
        result.checked += 1;
        try {
          const message = await client.fetchOne(String(uid), { source: true }, { uid: true });
          if (!message || !message.source) continue;
          const mail = await simpleParser(message.source);

          const fromAddress = firstAddress(mail.from);
          if (!isNbcSender(fromAddress) || !isOrderSubject(mail.subject)) {
            result.skipped += 1;
            continue;
          }

          const messageId = mail.messageId || `uid-${uid}-${mail.date?.toISOString() ?? "ohne-datum"}`;
          const text = mailPlainText(mail);
          const parsed = parseOrderMail(text);
          const objects = parsed.objects.length ? parsed.objects : [""];
          const ids = objects.map((_, index) => (index === 0 ? messageId : `${messageId}#${index + 1}`));

          const { data: existing, error: existingError } = await db
            .from("orders")
            .select("mail_message_id")
            .in("mail_message_id", ids);
          if (existingError) throw new Error(existingError.message);
          const known = new Set((existing ?? []).map((row) => row.mail_message_id));
          if (ids.every((id) => known.has(id))) {
            result.skipped += 1;
            continue;
          }

          const pdf = await renderMailPdf({
            from: addressText(mail.from),
            to: addressText(mail.to),
            date: mail.date ?? null,
            subject: mail.subject ?? "",
            text,
            attachments: mail.attachments.map((attachment) => ({
              filename: attachment.filename ?? "Anhang",
              contentType: attachment.contentType,
              content: attachment.content,
              inline: attachment.related || attachment.contentDisposition === "inline",
            })),
          });

          for (const [index, objectAddress] of objects.entries()) {
            if (known.has(ids[index])) continue;

            const { data: order, error: insertError } = await db
              .from("orders")
              .insert({
                status: "neu",
                source: "mail",
                mail_message_id: ids[index],
                mail_from: fromAddress,
                mail_subject: mail.subject ?? null,
                mail_received_at: (mail.date ?? new Date()).toISOString(),
                mail_text: text.slice(0, 20_000),
                object_address: objectAddress,
                task: parsed.task,
                recipient_email: fromAddress,
              })
              .select("id")
              .single();
            if (insertError) {
              // gleichzeitiger zweiter Abruf: Mail ist schon angelegt
              if (insertError.code === "23505") continue;
              throw new Error(insertError.message);
            }

            const path = `${order.id}/auftragsmail-${Date.now()}.pdf`;
            const { error: uploadError } = await db.storage
              .from(ORDERS_BUCKET)
              .upload(path, pdf, { contentType: "application/pdf" });
            if (uploadError) {
              result.errors.push(`PDF für „${objectAddress}“ nicht gespeichert: ${uploadError.message}`);
            } else {
              await db.from("orders").update({ order_mail_path: path }).eq("id", order.id);
            }

            result.created.push({ id: order.id, object_address: objectAddress });
          }
        } catch (error) {
          result.errors.push(`Mail ${uid}: ${(error as Error).message}`);
        }
      }
    } finally {
      lock.release();
    }
  } finally {
    await client.logout().catch(() => client.close());
  }

  return result;
}
