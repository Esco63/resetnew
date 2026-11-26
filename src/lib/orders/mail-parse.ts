/**
 * Liest aus einer NBC-Auftragsmail die Objekte und den Auftragstext.
 *
 * Typischer Aufbau:
 *   hiermit erteilen wir Ihnen folgenden Auftrag:
 *    - 19063 Schwerin, Kantstraße 38, Müllplatz
 *   Wir bitten um Beräumung des Sperrmülls.
 *   Bei Rückfragen steht Ihnen der Hausmeister ... zur Verfügung.
 *   Die Rechnungsadresse lautet: ...
 */

export const NBC_SENDER_DOMAINS = ["nbc-hv.de", "nbc-hausverwaltung.de"] as const;

export function isNbcSender(address: string | null | undefined) {
  const domain = address?.toLowerCase().split("@")[1]?.trim();
  return !!domain && NBC_SENDER_DOMAINS.some((d) => domain === d || domain.endsWith(`.${d}`));
}

export function isOrderSubject(subject: string | null | undefined) {
  return /auftrag/i.test(subject ?? "");
}

export type ParsedOrderMail = {
  objects: string[];
  task: string | null;
};

const START = /folgenden\s+auftr(a|ä)g(e)?\s*:?/i;
const STOP = /^(bei\s+r(ü|ue)ckfragen|die\s+rechnungsadresse|rechnungsadresse|mit\s+freundlichen|freundliche\s+gr(ü|ue)(ß|ss)e|viele\s+gr(ü|ue)(ß|ss)e|beste\s+gr(ü|ue)(ß|ss)e|vielen\s+dank)/i;
const BULLET = /^[-–—•*·]\s*(.+)$/;
const ZIP = /\b\d{5}\b/;
const TASK_START = /^(wir\s|bitte\b|es\s|hier|der\s|die\s|das\s|zus(ä|ae)tzlich)/i;

function cleanLine(line: string) {
  return line.replace(/ /g, " ").replace(/\s+/g, " ").trim();
}

function normalizeObject(value: string) {
  return cleanLine(value).replace(/[;,.]\s*$/, "");
}

export function parseOrderMail(text: string): ParsedOrderMail {
  const lines = text.split(/\r?\n/).map(cleanLine);

  let start = lines.findIndex((line) => START.test(line));
  const objects: string[] = [];
  const taskLines: string[] = [];

  if (start >= 0) {
    // Text hinter dem Doppelpunkt in derselben Zeile mitnehmen
    const rest = lines[start].replace(/^.*?folgenden\s+auftr(a|ä)g(e)?\s*:?/i, "").trim();
    const block = [rest, ...lines.slice(start + 1)];
    // Ein Objekt kann über mehrere Zeilen umbrechen ("- 19063 Schwerin," / "Kantstraße 25, Müllplatz").
    let collecting = false;
    for (const line of block) {
      if (!line) continue;
      if (STOP.test(line)) break;
      const bullet = line.match(BULLET);
      if (bullet || (objects.length === 0 && ZIP.test(line))) {
        objects.push(normalizeObject(bullet ? bullet[1] : line));
        collecting = true;
      } else if (collecting && taskLines.length === 0 && !TASK_START.test(line)) {
        const last = objects.length - 1;
        const joiner = /,$/.test(objects[last]) ? " " : ", ";
        objects[last] = normalizeObject(`${objects[last]}${joiner}${line}`);
      } else {
        collecting = false;
        taskLines.push(line);
      }
    }
  } else {
    start = lines.findIndex((line) => ZIP.test(line) && /schwerin/i.test(line));
    if (start >= 0) objects.push(normalizeObject(lines[start].replace(BULLET, "$1")));
  }

  const task = taskLines.join(" ").trim();
  return {
    objects: [...new Set(objects.filter(Boolean))],
    task: task || null,
  };
}
