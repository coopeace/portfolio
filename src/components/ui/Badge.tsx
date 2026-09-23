import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "accent" | "secondary" | "outline" | "tech";
  tech?: string;
  size?: "sm" | "md";
  pulse?: boolean;
  showDot?: boolean;
  icon?: React.ReactNode;
}

export function getTechTagColor(tech: string): string {
  const normalized = tech.toLowerCase().replace(/^#/, "").trim();

  // Python & Python Ecosystem
  if (
    normalized.includes("python") ||
    normalized.includes("pytest") ||
    normalized.includes("numpy") ||
    normalized.includes("pandas")
  ) {
    return "text-amber-800 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-400/15 border-amber-500/30 hover:border-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.08)]";
  }

  // Networking, Sockets, Protocols
  if (
    normalized.includes("socket") ||
    normalized.includes("network") ||
    normalized.includes("tcp") ||
    normalized.includes("udp") ||
    normalized.includes("packet") ||
    normalized.includes("protocol") ||
    normalized.includes("icmp") ||
    normalized.includes("ip")
  ) {
    return "text-indigo-800 dark:text-indigo-300 bg-indigo-500/10 dark:bg-indigo-400/15 border-indigo-500/30 hover:border-indigo-500/60 shadow-[0_0_10px_rgba(99,102,241,0.08)]";
  }

  // Linux, OS, Kernel, Syscalls, POSIX, Bash, Systems
  if (
    normalized.includes("linux") ||
    normalized.includes("kernel") ||
    normalized.includes("procfs") ||
    normalized.includes("syscall") ||
    normalized.includes("posix") ||
    normalized.includes("bash") ||
    normalized.includes("shell") ||
    normalized.includes("os") ||
    normalized.includes("system")
  ) {
    return "text-sky-800 dark:text-sky-300 bg-sky-500/10 dark:bg-sky-400/15 border-sky-500/30 hover:border-sky-500/60 shadow-[0_0_10px_rgba(56,189,248,0.08)]";
  }

  // Algorithms, Data Structures, Problem Solving
  if (
    normalized.includes("algo") ||
    normalized.includes("dsa") ||
    normalized.includes("data structure") ||
    normalized.includes("graph") ||
    normalized.includes("tree") ||
    normalized.includes("string") ||
    normalized.includes("problem solving") ||
    normalized.includes("kmp") ||
    normalized.includes("leetcode") ||
    normalized.includes("neetcode")
  ) {
    return "text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 dark:bg-emerald-400/15 border-emerald-500/30 hover:border-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.08)]";
  }

  // Low-level Systems, C, C++, Struct, Memory
  if (
    normalized === "c" ||
    normalized.includes("c++") ||
    normalized.includes("struct") ||
    normalized.includes("memory") ||
    normalized.includes("wal") ||
    normalized.includes("assembly") ||
    normalized.includes("rust")
  ) {
    return "text-rose-800 dark:text-rose-300 bg-rose-500/10 dark:bg-rose-400/15 border-rose-500/30 hover:border-rose-500/60 shadow-[0_0_10px_rgba(244,63,94,0.08)]";
  }

  // Backend, Asynchronous, Storage, Distributed
  if (
    normalized.includes("backend") ||
    normalized.includes("async") ||
    normalized.includes("storage") ||
    normalized.includes("distributed") ||
    normalized.includes("database") ||
    normalized.includes("sql") ||
    normalized.includes("api")
  ) {
    return "text-purple-800 dark:text-purple-300 bg-purple-500/10 dark:bg-purple-400/15 border-purple-500/30 hover:border-purple-500/60 shadow-[0_0_10px_rgba(168,85,247,0.08)]";
  }

  // Developer Tools, Benchmarking, Performance, Monitoring
  if (
    normalized.includes("tool") ||
    normalized.includes("benchmark") ||
    normalized.includes("monitor") ||
    normalized.includes("telemetry") ||
    normalized.includes("perf")
  ) {
    return "text-teal-800 dark:text-teal-300 bg-teal-500/10 dark:bg-teal-400/15 border-teal-500/30 hover:border-teal-500/60 shadow-[0_0_10px_rgba(20,184,166,0.08)]";
  }

  // Deterministic palette fallback for any other tech/tag
  const fallbackPalettes = [
    "text-cyan-800 dark:text-cyan-300 bg-cyan-500/10 dark:bg-cyan-400/15 border-cyan-500/30 hover:border-cyan-500/60 shadow-[0_0_10px_rgba(6,182,212,0.08)]",
    "text-amber-800 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-400/15 border-amber-500/30 hover:border-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.08)]",
    "text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 dark:bg-emerald-400/15 border-emerald-500/30 hover:border-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.08)]",
    "text-indigo-800 dark:text-indigo-300 bg-indigo-500/10 dark:bg-indigo-400/15 border-indigo-500/30 hover:border-indigo-500/60 shadow-[0_0_10px_rgba(99,102,241,0.08)]",
    "text-rose-800 dark:text-rose-300 bg-rose-500/10 dark:bg-rose-400/15 border-rose-500/30 hover:border-rose-500/60 shadow-[0_0_10px_rgba(244,63,94,0.08)]",
    "text-purple-800 dark:text-purple-300 bg-purple-500/10 dark:bg-purple-400/15 border-purple-500/30 hover:border-purple-500/60 shadow-[0_0_10px_rgba(168,85,247,0.08)]",
    "text-teal-800 dark:text-teal-300 bg-teal-500/10 dark:bg-teal-400/15 border-teal-500/30 hover:border-teal-500/60 shadow-[0_0_10px_rgba(20,184,166,0.08)]",
  ];

  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % fallbackPalettes.length;
  return fallbackPalettes[index];
}

const badgeVariants: Record<Exclude<BadgeProps["variant"], "tech" | undefined>, string> = {
  default:
    "bg-surface-elevated text-foreground border border-border",
  success:
    "bg-success/10 text-success border border-success/30 shadow-[0_0_8px_rgb(var(--success-rgb)/0.15)]",
  accent:
    "bg-accent/10 text-accent border border-accent/30 shadow-[0_0_8px_rgb(var(--accent-rgb)/0.15)]",
  secondary:
    "bg-accent-secondary/10 text-accent-secondary border border-accent-secondary/30",
  outline:
    "bg-transparent text-muted border border-border",
};

const badgeSizes: Record<NonNullable<BadgeProps["size"]>, string> = {
  sm: "px-2.5 py-0.5 text-[11px] gap-1.5",
  md: "px-3 py-1 text-xs gap-1.5",
};

export function Badge({
  className,
  variant = "default",
  tech,
  size = "sm",
  pulse = false,
  showDot,
  icon,
  children,
  ...props
}: BadgeProps) {
  const isTech = variant === "tech" || Boolean(tech);
  const techKey = tech || (typeof children === "string" ? children : "");
  const colorClass = isTech ? getTechTagColor(techKey) : badgeVariants[variant];
  const displayDot = showDot !== undefined ? showDot : isTech;

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono font-medium rounded-full uppercase tracking-wider select-none border transition-all duration-200",
        isTech && "hover:scale-[1.04] backdrop-blur-sm",
        colorClass,
        badgeSizes[size],
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span
            className={cn(
              "absolute inline-flex h-full w-full rounded-full opacity-75 motion-safe:animate-ping",
              variant === "success" && "bg-success",
              variant === "accent" && "bg-accent",
              variant === "secondary" && "bg-accent-secondary",
              (variant === "default" || variant === "outline" || isTech) && "bg-current"
            )}
          />
          <span
            className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              variant === "success" && "bg-success",
              variant === "accent" && "bg-accent",
              variant === "secondary" && "bg-accent-secondary",
              (variant === "default" || variant === "outline" || isTech) && "bg-current"
            )}
          />
        </span>
      )}
      {!pulse && displayDot && (
        <span
          className="w-1.5 h-1.5 rounded-full bg-current opacity-70 flex-shrink-0"
          aria-hidden="true"
        />
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
