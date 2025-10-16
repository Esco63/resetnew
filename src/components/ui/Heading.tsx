// src/components/ui/Heading.tsx
import * as React from "react";
import { cn } from "@/lib/cn";

type HProps = React.HTMLAttributes<HTMLHeadingElement> & {
  level?: 1 | 2 | 3 | 4;
  align?: "left" | "center";
  eyebrow?: string; // kleiner Übertitel, optional
};

export default function Heading({
  level = 2,
  align = "left",
  eyebrow,
  className,
  children,
  ...props
}: HProps) {
  const Tag = (`h${level}` as unknown) as React.ElementType;

  const sizes: Record<number, string> = {
    1: "text-4xl md:text-6xl",
    2: "text-3xl md:text-4xl",
    3: "text-2xl md:text-3xl",
    4: "text-xl md:text-2xl",
  };

  return (
    <div className={cn(align === "center" && "text-center")}>
      {eyebrow && (
        <div className="text-sm font-semibold tracking-wide text-orange-600">
          {eyebrow}
        </div>
      )}
      <Tag
        {...(props as any)}
        className={cn(
          "font-black tracking-tight",
          sizes[level],
          className
        )}
      >
        {children}
      </Tag>
    </div>
  );
}
