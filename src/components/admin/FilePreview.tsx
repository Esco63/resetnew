"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Vorschau eines Belegs: Fotos als Bild, PDFs eingebettet.
 * `src` ist eine Admin-Route, die auf eine signierte Supabase-URL weiterleitet.
 */
export function FilePreview({
  src,
  path,
  className,
}: {
  src: string;
  path: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const isPdf = path.toLowerCase().endsWith(".pdf");

  if (failed) {
    return (
      <div className={cn("grid place-items-center rounded-xl bg-slate-100 p-4 text-sm text-slate-500", className)}>
        Vorschau nicht möglich – „Beleg ansehen“ öffnet die Datei.
      </div>
    );
  }

  return (
    <a
      href={src}
      target="_blank"
      rel="noreferrer"
      className={cn("block overflow-hidden rounded-xl border border-slate-200 bg-slate-100", className)}
      title="Beleg groß öffnen"
    >
      {isPdf ? (
        <iframe
          src={`${src}${src.includes("?") ? "&" : "?"}v=preview#toolbar=0&view=FitH`}
          title="Beleg-Vorschau"
          className="pointer-events-none h-full min-h-72 w-full bg-white"
          loading="lazy"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- signierte, kurzlebige URL; kein Next-Image-Caching
        <img
          src={src}
          alt="Beleg-Vorschau"
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full max-h-96 w-full object-contain"
        />
      )}
    </a>
  );
}
