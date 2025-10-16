// src/components/ui/Button.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "dark" | "success";
  size?: "sm" | "md" | "lg";
  asChild?: boolean; // optional: rendert nur Styles um die Children, kein <button>
};

export function Button({
  variant = "primary",
  size = "md",
  asChild = false,
  className,
  children,
  ...rest // <- hier sind jetzt NUR native button-Props (ohne asChild)
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 active:scale-[0.99]";

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5",
    lg: "px-6 py-3 text-base",
  };

  const variants = {
    primary: "bg-orange-600 text-white shadow hover:bg-orange-700",
    secondary: "bg-slate-900 text-white shadow hover:bg-slate-800",
    outline: "bg-transparent text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50",
    dark: "bg-slate-900 text-white hover:bg-slate-800 shadow",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow",
  };

  const classes = cn(base, sizes[size], variants[variant], className);

  // asChild: nur Styles/Wrapper, KEIN button-Element (z.B. wenn du <Link> als Kind gibst)
  if (asChild) {
    return <span className={classes}>{children}</span>;
  }

  return (
    <button {...rest} className={classes}>
      {children}
    </button>
  );
}
