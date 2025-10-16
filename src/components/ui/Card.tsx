import * as React from "react";
import { cn } from "@/lib/cn";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
  padded?: boolean;
  ring?: boolean;
};

export function Card({
  hover = true,
  padded = true,
  ring = true,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      {...rest}
      className={cn(
        "rounded-2xl bg-white shadow-sm",
        ring && "border border-slate-200/80",
        hover && "hover:shadow-md hover:-translate-y-0.5 transition",
        padded && "p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return <div {...rest} className={cn("mb-3", className)} />;
}

export function CardTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  const { className, ...rest } = props;
  return (
    <h3 {...rest} className={cn("text-lg md:text-xl font-bold tracking-tight", className)} />
  );
}

export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return <div {...rest} className={cn("text-slate-700", className)} />;
}

export function CardActions(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return <div {...rest} className={cn("mt-4", className)} />;
}
