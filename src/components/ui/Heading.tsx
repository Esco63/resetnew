import * as React from "react";
import { cn } from "@/lib/cn";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type Align = "left" | "center";

type HProps = Omit<React.HTMLAttributes<HTMLHeadingElement>, "children"> & {
  /** Überschriften-Level, bestimmt auch den Tag (h1..h6) */
  level?: HeadingLevel;
  /** Text-Ausrichtung */
  align?: Align;
  /** Kleine Vorzeile/Label oberhalb der Überschrift */
  eyebrow?: string;
  /** Inhalt der Überschrift */
  children?: React.ReactNode;
};

const SIZE_CLASSES: Record<HeadingLevel, string> = {
  1: "text-4xl sm:text-5xl md:text-6xl",
  2: "text-2xl sm:text-3xl md:text-4xl",
  3: "text-xl sm:text-2xl md:text-3xl",
  4: "text-lg sm:text-xl",
  5: "text-base sm:text-lg",
  6: "text-base",
};

const TAG_MAP: Record<HeadingLevel, "h1" | "h2" | "h3" | "h4" | "h5" | "h6"> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
};

const Heading = React.forwardRef<HTMLHeadingElement, HProps>(function Heading(
  { level = 2, align = "left", eyebrow, className, children, ...props },
  ref
) {
  const Tag = TAG_MAP[level];
  const eyebrowId = React.useId();

  // aria-describedby sauber zusammenführen, falls bereits gesetzt
  const describedBy = [
    eyebrow ? eyebrowId : null,
    props["aria-describedby"] ?? null,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    <div className={cn(align === "center" && "text-center")}>
      {eyebrow && (
        <div
          id={eyebrowId}
          className="mb-1 text-sm font-semibold tracking-wide text-orange-600"
        >
          {eyebrow}
        </div>
      )}
      {React.createElement(
        Tag,
        {
          ...props,
          ref,
          // Wichtig: dunkle Standardfarbe (Hero überschreibt via .hero)
          className: cn(
            "font-black tracking-tight leading-tight text-balance",
            "text-slate-900",
            SIZE_CLASSES[level],
            className
          ),
          ...(describedBy ? { "aria-describedby": describedBy } : {}),
        },
        children
      )}
    </div>
  );
});

export default Heading;
