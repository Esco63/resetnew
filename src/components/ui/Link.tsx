// src/components/ui/Link.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type LinkProps = React.ComponentPropsWithoutRef<"a"> & {
  variant?: "link" | "unstyled" | "pill" | "ghost";
};

export default function Link({
  variant = "unstyled",
  className,
  ...props
}: LinkProps) {
  const base = "focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 transition";
  const variants = {
    unstyled: "",
    link: "hover:text-orange-600 underline-offset-4 hover:underline",
    pill:
      "inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-2.5 text-white font-semibold shadow hover:bg-orange-700 active:scale-[0.99]",
    ghost:
      "inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-white hover:bg-white/20",
  } as const;

  return <a {...props} className={cn(base, variants[variant], className)} />;
}
