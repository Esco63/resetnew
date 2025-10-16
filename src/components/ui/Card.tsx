import * as React from "react";
import { cn } from "@/lib/cn";

type CardProps<C extends React.ElementType = "div"> = {
  as?: C;
  hover?: boolean;
  padded?: boolean;
  ring?: boolean;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<C>, "as" | "className">;

export function Card<C extends React.ElementType = "div">({
  as,
  hover = true,
  padded = true,
  ring = true,
  className,
  ...props
}: CardProps<C>) {
  const Tag = (as || "div") as React.ElementType;

  return (
    <Tag
      {...(props as any)}
      className={cn(
        "rounded-2xl bg-white shadow-sm",
        ring && "border border-slate-200/80",
        hover && "hover:shadow-md hover:-translate-y-0.5 transition",
        padded && "p-6",
        className
      )}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("mb-3", className)} />;
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      {...props}
      className={cn("text-lg md:text-xl font-bold tracking-tight", className)}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("text-slate-700", className)} />;
}

export function CardActions({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn("mt-4", className)} />;
}
