"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Erste PDF-Seite im Browser als Bild rendern. Ein <iframe> mit PDF wird auf
 * dem iPhone so breit wie das PDF und macht die ganze Seite zu groß.
 */
async function renderPdfFirstPage(src: string, targetWidth: number) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const res = await fetch(src);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(await res.arrayBuffer()) }).promise;
  try {
    const page = await pdf.getPage(1);
    const base = page.getViewport({ scale: 1 });
    const scale = Math.min(3, (targetWidth * (window.devicePixelRatio || 1)) / base.width);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    await page.render({ canvasContext: canvas.getContext("2d")!, viewport }).promise;
    return canvas.toDataURL("image/jpeg", 0.85);
  } finally {
    await pdf.destroy();
  }
}

/**
 * Vorschau eines Belegs: Fotos direkt, PDFs als Bild der ersten Seite.
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
  const isPdf = path.toLowerCase().endsWith(".pdf");
  const [image, setImage] = useState<string | null>(isPdf ? null : src);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!isPdf) return;
    let cancelled = false;
    renderPdfFirstPage(src, 400)
      .then((dataUrl) => {
        if (!cancelled) setImage(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [isPdf, src]);

  // Lange Kassenbons in voller Breite zeigen; im Kasten kann man nach unten scrollen.
  return (
    <div
      className={cn(
        "relative w-full min-w-0 max-w-full overflow-x-hidden overflow-y-auto overscroll-contain rounded-xl border border-slate-200 bg-slate-100",
        className
      )}
    >
      {failed ? (
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="absolute inset-0 grid place-items-center p-4 text-center text-sm text-slate-500"
        >
          Keine Vorschau – tippen zum Öffnen
        </a>
      ) : image ? (
        <a href={src} target="_blank" rel="noreferrer" title="Beleg groß öffnen" className="block">
          {/* eslint-disable-next-line @next/next/no-img-element -- signierte, kurzlebige URL bzw. lokal gerendertes Bild */}
          <img
            src={image}
            alt="Beleg-Vorschau"
            loading="lazy"
            onError={() => setFailed(true)}
            className="block h-auto w-full max-w-full"
          />
        </a>
      ) : (
        <span className="absolute inset-0 grid place-items-center text-slate-400">
          <Loader2 size={20} className="animate-spin" aria-hidden="true" />
        </span>
      )}
    </div>
  );
}
