import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "article" | "section";
  hoverEffect?: boolean;
}

export function Card({
  as: Component = "div",
  className,
  hoverEffect = false,
  children,
  ...props
}: CardProps) {
  return (
    <Component
      className={cn(
        "rounded-xl border border-border bg-surface text-foreground transition-all duration-300",
        hoverEffect &&
          "hover:border-border-hover hover:bg-surface-hover hover:shadow-[0_4px_24px_rgb(var(--accent-rgb)/0.08)] hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6 pb-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h2" | "h3" | "h4" | "h5" | "h6";
}

export function CardTitle({
  as: Heading = "h3",
  className,
  children,
  ...props
}: CardTitleProps) {
  return (
    <Heading
      className={cn(
        "text-lg font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Heading>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-muted leading-relaxed", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pt-3", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center p-6 pt-0 text-sm text-muted", className)}
      {...props}
    >
      {children}
    </div>
  );
}
