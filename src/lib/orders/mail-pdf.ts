import { PDFDocument, type PDFFont, StandardFonts, rgb } from "pdf-lib";

export type MailForPdf = {
  from: string;
  to: string;
  date: Date | null;
  subject: string;
  text: string;
  attachments: { filename: string; contentType: string; content: Buffer; inline: boolean }[];
};

const A4: [number, number] = [595.28, 841.89];
const MARGIN = 56;
const LINE = 14;

const dateFormat = new Intl.DateTimeFormat("de-DE", {
  timeZone: "Europe/Berlin",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** Entfernt Zeichen, die die PDF-Standardschrift nicht darstellen kann. */
function makeSanitizer(font: PDFFont) {
  const supported = new Set(font.getCharacterSet());
  return (text: string) =>
    Array.from(text.replace(/\t/g, "    ").replace(/ /g, " "))
      .map((char) => {
        if (char === "\n" || supported.has(char.codePointAt(0)!)) return char;
        if (/[‘’‚]/.test(char)) return "'";
        if (/[“”„]/.test(char)) return '"';
        if (/[–—]/.test(char)) return "-";
        return "";
      })
      .join("");
}

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const out: string[] = [];
  for (const paragraph of text.split(/\r?\n/)) {
    if (paragraph.trim() === "") {
      out.push("");
      continue;
    }
    let line = "";
    for (const word of paragraph.split(/(\s+)/)) {
      if (!word) continue;
      if (font.widthOfTextAtSize(line + word, size) <= width) {
        line += word;
        continue;
      }
      if (line.trim()) out.push(line.trimEnd());
      line = "";
      if (/^\s+$/.test(word)) continue;
      // überlange Wörter (z. B. URLs) hart umbrechen
      for (const char of word) {
        if (font.widthOfTextAtSize(line + char, size) > width) {
          out.push(line);
          line = "";
        }
        line += char;
      }
    }
    out.push(line.trimEnd());
  }
  return out;
}

/** Erstellt ein PDF der Auftragsmail; PDF- und Bildanhänge werden angehängt. */
export async function renderMailPdf(mail: MailForPdf) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(mail.subject || "Auftragsmail");
  pdf.setAuthor("reset. Service & Dienstleistungen");
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const clean = makeSanitizer(font);
  const width = A4[0] - MARGIN * 2;

  let page = pdf.addPage(A4);
  let y = A4[1] - MARGIN;
  const newPage = () => {
    page = pdf.addPage(A4);
    y = A4[1] - MARGIN;
  };
  const draw = (text: string, options: { font?: PDFFont; size?: number; color?: number } = {}) => {
    const size = options.size ?? 10.5;
    for (const line of wrap(clean(text), options.font ?? font, size, width)) {
      if (y < MARGIN + LINE) newPage();
      page.drawText(line, {
        x: MARGIN,
        y,
        size,
        font: options.font ?? font,
        color: rgb(options.color ?? 0.1, options.color ?? 0.1, options.color ?? 0.1),
      });
      y -= size + 3.5;
    }
  };

  draw(mail.subject || "(ohne Betreff)", { font: bold, size: 16 });
  y -= 6;
  draw(`Von: ${mail.from}`, { size: 9.5, color: 0.3 });
  draw(`An: ${mail.to}`, { size: 9.5, color: 0.3 });
  if (mail.date) draw(`Datum: ${dateFormat.format(mail.date)}`, { size: 9.5, color: 0.3 });
  const files = mail.attachments.filter((a) => !a.inline).map((a) => a.filename);
  if (files.length) draw(`Anhänge: ${files.join(", ")}`, { size: 9.5, color: 0.3 });
  y -= 4;
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: A4[0] - MARGIN, y },
    thickness: 0.7,
    color: rgb(0.75, 0.75, 0.75),
  });
  y -= 18;
  draw(mail.text.replace(/\n{3,}/g, "\n\n").trim() || "(kein Text)");

  for (const attachment of mail.attachments) {
    if (attachment.inline) continue;
    try {
      if (attachment.contentType === "application/pdf") {
        const source = await PDFDocument.load(attachment.content, { ignoreEncryption: true });
        const pages = await pdf.copyPages(source, source.getPageIndices());
        pages.forEach((p) => pdf.addPage(p));
      } else if (/^image\/(png|jpe?g)$/.test(attachment.contentType)) {
        const image = attachment.contentType === "image/png"
          ? await pdf.embedPng(attachment.content)
          : await pdf.embedJpg(attachment.content);
        const imagePage = pdf.addPage(A4);
        const scale = Math.min((A4[0] - MARGIN * 2) / image.width, (A4[1] - MARGIN * 2) / image.height, 1);
        imagePage.drawImage(image, {
          x: (A4[0] - image.width * scale) / 2,
          y: A4[1] - MARGIN - image.height * scale,
          width: image.width * scale,
          height: image.height * scale,
        });
      }
    } catch {
      // Anhang nicht lesbar – die Mail selbst ist trotzdem im PDF.
    }
  }

  return Buffer.from(await pdf.save());
}
