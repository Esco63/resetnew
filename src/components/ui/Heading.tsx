import * as React from "react";
import { cn } from "@/lib/cn";

type HeadingLevel = 1 | 2 | 3 | 4;

type HProps = Omit<React.HTMLAttributes<HTMLHeadingElement>, "children"> & {
  level?: HeadingLevel;
  align?: "left" | "center";
  eyebrow?: string;
  children?: React.ReactNode;
};

const SIZE_CLASSES: Record<HeadingLevel, string> = {
  1: "text-4xl md:text-6xl",
  2: "text-3xl md:text-4xl",
  3: "text-2xl md:text-3xl",
  4: "text-xl md:text-2xl",
};

export default function Heading({
  level = 2,
  align = "left",
  eyebrow,
  className,
  children,
  ...props
}: HProps) {
  const TagMap: Record<HeadingLevel, "h1" | "h2" | "h3" | "h4"> = {
    1: "h1",
    2: "h2",
    3: "h3",
    4: "h4",
  };
  const Tag = TagMap[level];

  return (
    <div className={cn(align === "center" && "text-center")}>
      {eyebrow && (
        <div className="text-sm font-semibold tracking-wide text-orange-600">
          {eyebrow}
        </div>
      )}
      {React.createElement(
        Tag,
        {
          ...(props as React.HTMLAttributes<HTMLHeadingElement>),
          className: cn(
            "font-black tracking-tight",
            "text-slate-900 dark:text-white", // volle Farbe als Default
            SIZE_CLASSES[level],
            className
          ),
        },
        children
      )}
    </div>
  );
}
