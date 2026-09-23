"use client";

import * as React from "react";
import { Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ThemeSwitcherProps {
  variant?: "segmented" | "cycle";
  className?: string;
}

/**
 * Permanent Dark Theme Indicator.
 * Light mode has been deprecated in favor of pristine Obsidian Dark.
 */
export function ThemeSwitcher({
  variant = "segmented",
  className,
}: ThemeSwitcherProps) {
  if (variant === "cycle") {
    return (
      <div
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-accent shadow-sm",
          className
        )}
        title="Theme: Obsidian Dark (Permanent)"
        aria-label="Theme: Obsidian Dark"
      >
        <Moon className="h-4 w-4 text-accent" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-surface font-mono text-[11px] text-accent shadow-sm",
        className
      )}
      title="Theme: Obsidian Dark (Permanent)"
      aria-label="Theme: Obsidian Dark"
    >
      <Moon className="h-3.5 w-3.5 text-accent" />
      <span className="text-foreground/80 font-medium">OBSIDIAN</span>
    </div>
  );
}
