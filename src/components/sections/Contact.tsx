"use client";

import { useState } from "react";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Heading from "@/components/ui/Heading";
import Link from "@/components/ui/Link";
import { MessageCircle, ArrowRight, Clock, Shield, Phone, Mail, MapPin, Info } from "lucide-react";
import { business } from "@/lib/business";
import ServiceAreaMap from "@/components/ServiceAreaMap";

type SendStatus = "idle" | "loading" | "success" | "error";
type FieldErrors = Record<string, string[] | undefined>;

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Unbekannter Fehler";
  }
}

export default function Contact() {
  const [status, setStatus] = useState<SendStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [msgLen, setMsgLen] = useState<number>(0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    setFieldErrors({});

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());

    // sanfte Client-Validierung: E-Mail ODER Telefon
    const email = String(payload.email || "").trim();
    const phone = String(payload.phone || "").trim();
    if (!email && !phone) {
      setStatus("error");
      setFieldErrors({ email: ["Bitte gib E-Mail oder Telefon an."] });
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json: unknown = await res.json();

      // prüfen, ob Response die übliche Struktur hat
      if (
        typeof json === "object" &&
        json !== null &&
        "ok" in json &&
        (json as { ok: boolean }).ok === true &&
        res.ok
      ) {
        setStatus("success");
        form.reset();
        setMsgLen(0);
        return;
      }

      // Feldfehler schön anzeigen (422 vom Server)
      if (
        typeof json === "object" &&
        json !== null &&
        "details" in json &&
        (json as any).details?.fieldErrors // eslint-disable-line @typescript-eslint/no-explicit-any
      ) {
        const fe = (json as { details: { fieldErrors: FieldErrors } }).details.fieldErrors;
        setFieldErrors(fe);
        setStatus("error");
        return;
      }

      // generischer Fehler
      setStatus("error");
      const message =
        typeof json === "object" && json !== null && "error" in json
          ? String((json as { error: unknown }).error)
          : "Senden fehlgeschlagen.";
      setErrorMsg(message);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(getErrorMessage(err));
    }
  }

  const messageHelp =
    msgLen === 0
      ? "Bitte schreibe mindestens 10 Zeichen."
      : msgLen < 10
      ? `Noch ${10 - msgLen} Zeichen bis zum Absenden.`
      : "Danke! Das reicht aus.";

  const fe = (key: string) => fieldErrors?.[key]?.[0];

  return (
    <Section id="kontakt" className="relative isolate scroll-mt-[64px] bg-white">
      <Container className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
        {/* Formular */}
        <div>
          <Heading level={2}>Kostenloses Angebot in 2 Minuten</Heading>
          <p className="mt-2 text-slate-600 leading-relaxed">
            Schicken Sie uns Eckdaten & optional Fotos/Video per WhatsApp. Wir melden uns umgehend.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 md:mt-8 space-y-4" noValidate>
            {/* Honeypot */}
            <input type="text" name="hp" tabIndex={-1} autoComplete="off" className="hidden" />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <input
                  className="w-full rounded-xl border px-4 py-3 shadow-sm focus:ring-2 focus:ring-orange-500"
                  placeholder="Ihr Name"
                  aria-label="Ihr Name"
                  name="name"
                  autoComplete="name"
                  required
                />
                {fe("name") && <p className="mt-1 text-sm text-red-600">{fe("name")}</p>}
              </div>

              <div>
                <input
                  className="w-full rounded-xl border px-4 py-3 shadow-sm focus:ring-2 focus:ring-orange-500"
                  placeholder="Ihre E-Mail (optional)"
                  type="email"
                  aria-label="Ihre E-Mail"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                />
                {fe("email") && <p className="mt-1 text-sm text-red-600">{fe("email")}</p>}
              </div>
            </div>

            <div>
              <input
                className="w-full rounded-xl border px-4 py-3 shadow-sm focus:ring-2 focus:ring-orange-500"
                placeholder="Telefon (für Rückfragen, optional)"
                aria-label="Telefon (für Rückfragen)"
                type="tel"
                inputMode="tel"
                name="phone"
                autoComplete="tel"
              />
              {fe("phone") && <p className="mt-1 text-sm text-red-600">{fe("phone")}</p>}
            </div>

            <div>
              <textarea
                className="w-full rounded-xl border px-4 py-3 shadow-sm focus:ring-2 focus:ring-orange-500"
                placeholder="Was sollen wir wo erledigen?"
                rows={5}
                aria-label="Nachricht"
                name="message"
                required
                minLength={10}
                onChange={(e) => setMsgLen(e.currentTarget.value.trim().length)}
                aria-describedby="message-help"
              />
              <div
                id="message-help"
                className={`mt-1 text-sm ${msgLen < 10 ? "text-slate-600" : "text-emerald-700"}`}
              >
                {messageHelp} <span className="text-slate-400">({msgLen}/5000)</span>
              </div>
              {fe("message") && <p className="mt-1 text-sm text-red-600">{fe("message")}</p>}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={status === "loading" || msgLen < 10}
                className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-6 py-3 text-white font-semibold shadow hover:bg-orange-700 transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-orange-600 disabled:opacity-60"
              >
                {status === "loading" ? "Wird gesendet…" : "Angebot anfordern"}{" "}
                {status !== "loading" && <ArrowRight size={18} aria-hidden />}
              </button>

              <Link
                href={business.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-white font-semibold shadow hover:bg-emerald-700 transition active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-600"
              >
                <MessageCircle size={18} aria-hidden /> WhatsApp Anfrage
              </Link>
            </div>

            {/* Statusmeldungen – optisch sauber, ohne zerrissene Wörter */}
            <div aria-live="polite" className="min-h-[1.5rem]">
              {status === "success" && (
                <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 p-3">
                  <p className="m-0 flex items-start gap-2">
                    <span className="pt-[2px]">
                      <Info size={16} aria-hidden />
                    </span>
                    <span className="font-medium">Danke!</span>
                    <span className="whitespace-pre-line">
                      Ihre Nachricht ist angekommen. Wir melden uns umgehend.
                    </span>
                  </p>
                </div>
              )}
              {status === "error" && Object.keys(fieldErrors).length === 0 && (
                <p className="mt-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                  Senden fehlgeschlagen: {errorMsg}
                </p>
              )}
            </div>

            <ul className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
              <li className="flex items-center gap-1.5">
                <Shield size={16} aria-hidden /> Unverbindlich & diskret
              </li>
              <li className="flex items-center gap-1.5">
                <Clock size={16} aria-hidden /> Rückmeldung umgehend
              </li>
            </ul>

            <p className="text-xs text-slate-500 mt-2">
              Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäß{" "}
              <Link className="underline" href="/rechtliches" variant="link">
                Datenschutzerklärung
              </Link>{" "}
              zu.
            </p>
          </form>
        </div>

        {/* Kontakt + Karte */}
        <div className="rounded-2xl ring-1 ring-slate-200/60 bg-white p-6 md:p-7 shadow-md">
          <h3 className="text-2xl font-bold tracking-tight">Kontakt</h3>

          <div className="mt-4 grid gap-3 text-slate-700">
            <p className="flex items-center gap-2">
              <Phone size={18} aria-hidden /> {business.phoneHuman}
            </p>
            <p className="flex items-center gap-2">
              <Mail size={18} aria-hidden /> {business.email}
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={18} aria-hidden />
              {business.address.street}, {business.address.zip} {business.address.city}
            </p>
          </div>

          <div className="mt-6 aspect-video w-full rounded-xl overflow-hidden ring-1 ring-slate-200/70 shadow-inner">
            <ServiceAreaMap radiusMeters={25000} />
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-orange-600 ring-2 ring-orange-200" aria-hidden />
            <span>Servicegebiet: {business.serviceArea}</span>
          </div>

          <p className="mt-3 text-sm text-slate-500">Termine Mo–Fr 07:00–20:00 Uhr, Sa nach Vereinbarung</p>
        </div>
      </Container>
    </Section>
  );
}
