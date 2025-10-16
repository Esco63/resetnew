import * as React from "react";
import { cn } from "@/lib/cn";

export type SectionProps = React.HTMLAttributes<HTMLElement> & {
  padded?: boolean;
};

export default function Section({
  padded = true,
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      {...rest}
      className={cn(padded && "py-16 md:py-24", className)}
    >
      {children}
    </section>
  );
}
