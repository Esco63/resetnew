import * as React from "react";
import { cn } from "@/lib/cn";

type SectionElement = keyof JSX.IntrinsicElements;

type SectionProps<C extends React.ElementType = "section"> = {
  as?: C;
  padded?: boolean;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<C>, "as" | "className">;

export default function Section<C extends React.ElementType = "section">({
  as,
  padded = true,
  className,
  ...props
}: SectionProps<C>) {
  const Tag = (as || "section") as React.ElementType;

  return (
    <Tag
      {...(props as any)}
      className={cn(padded && "py-16 md:py-24", className)}
    />
  );
}
