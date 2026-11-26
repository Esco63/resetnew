import { convert as htmlToText } from "html-to-text";
import type { ParsedMail } from "mailparser";

/**
 * Klartext der Mail. Bei HTML-Mails mit eingebetteten Bildern (z. B. dem
 * NBC-Logo) liefert mailparser keinen Text, dann wird das HTML umgewandelt.
 */
export function mailPlainText(mail: Pick<ParsedMail, "text" | "html">) {
  if (mail.text?.trim()) return mail.text;
  if (typeof mail.html === "string" && mail.html.trim()) {
    return htmlToText(mail.html, {
      wordwrap: false,
      selectors: [
        { selector: "img", format: "skip" },
        { selector: "a", options: { ignoreHref: true } },
        { selector: "h1", options: { uppercase: false } },
        { selector: "h2", options: { uppercase: false } },
        { selector: "h3", options: { uppercase: false } },
        { selector: "table", format: "dataTable" },
      ],
    });
  }
  return "";
}
