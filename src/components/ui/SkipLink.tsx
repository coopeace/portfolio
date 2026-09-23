import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkipLinkProps {
  targetId?: string;
  label?: string;
  className?: string;
}

export function SkipLink({
  targetId = "main-content",
  label = "Skip to main content",
  className,
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        "sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50",
        "focus:px-4 focus:py-2.5 focus:rounded-lg focus:font-medium focus:text-white focus:bg-accent",
        "focus:shadow-[0_0_25px_rgb(var(--accent-rgb)/0.5)] focus:border focus:border-accent",
        "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background",
        "focus:font-mono focus:text-sm",
        "transition-all duration-150 ease-out",
        className
      )}
    >
      {label}
    </a>
  );
}
