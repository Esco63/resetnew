// src/components/ui/Container.tsx
import * as React from "react";
import { cn } from "@/lib/cn";

type Props = React.HTMLAttributes<HTMLDivElement>;

export default function Container({ className, ...props }: Props) {
  return (
    <div
      {...props}
      className={cn("mx-auto max-w-7xl px-4 md:px-8", className)}
    />
  );
}
