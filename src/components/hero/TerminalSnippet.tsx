"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TerminalOutputLine {
  type: "command" | "output" | "comment" | "success" | "accent";
  text: string;
}

export interface TerminalSnippetProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  command?: string;
  outputLines?: TerminalOutputLine[];
  showCopyButton?: boolean;
}

export const defaultTerminalLines: TerminalOutputLine[] = [
  { type: "command", text: "$ cat /etc/mission-profile" },
  { type: "output", text: "DEVELOPER:  Shishir Dev (Backend & Systems)" },
  { type: "output", text: "ACADEMICS:  BCA @ Michael Madhusudan Memorial College (KNU)" },
  { type: "output", text: "FOCUS:      Beneath Abstractions · OS & Network Stacks" },
  { type: "output", text: "CORE STACK: Python · Linux POSIX · CLI Tools · Sockets" },
  { type: "output", text: "LOCATION:   Durgapur, India [Base Station]" },
  { type: "success", text: "TELEMETRY:  All systems operational // 100% Nominal" },
];

export function TerminalSnippet({
  title = "shishir@station:~ (bash)",
  outputLines = defaultTerminalLines,
  showCopyButton = true,
  className,
  ...props
}: TerminalSnippetProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(() => {
    const textToCopy = outputLines.map((line) => line.text).join("\n");
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          // Gracefully ignore clipboard write error in restricted iframes
        });
    }
  }, [outputLines]);

  return (
    <div
      className={cn(
        "w-full rounded-panel border border-border/80 bg-surface-elevated/95 dark:bg-[#030611]/95 shadow-xl backdrop-blur-md overflow-hidden text-left",
        className
      )}
      {...props}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-border/60 bg-surface/80 dark:bg-slate-950/80 select-none">
        {/* Window controls */}
        <div className="flex items-center space-x-1.5" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
        </div>

        {/* Window Title */}
        <span className="font-mono text-[11px] text-muted tracking-tight">
          {title}
        </span>

        {/* Copy Button */}
        {showCopyButton && (
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy terminal content"
            className="text-muted hover:text-accent transition-colors p-1 rounded focus-ring"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-success" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Terminal Body */}
      <div className="p-3.5 sm:p-4 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto select-text space-y-1">
        {outputLines.map((line, idx) => {
          if (line.type === "command") {
            return (
              <div key={idx} className="pb-1 font-semibold flex items-center space-x-1.5">
                <span className="text-accent font-bold">$</span>
                <span className="text-amber-600 dark:text-amber-400">cat</span>
                <span className="text-cyan-700 dark:text-cyan-300">
                  {line.text.replace(/^\$\s*cat\s*/, "")}
                </span>
              </div>
            );
          }

          // Parse KEY: VALUE lines for vibrant terminal telemetry syntax
          const colonIdx = line.text.indexOf(":");
          if (colonIdx > 0 && colonIdx < 15) {
            const key = line.text.substring(0, colonIdx + 1);
            const val = line.text.substring(colonIdx + 1);

            let keyColor = "text-accent";
            let valColor = "text-foreground font-medium";

            if (key.startsWith("DEVELOPER")) {
              keyColor = "text-indigo-600 dark:text-indigo-400 font-bold";
            } else if (key.startsWith("ACADEMICS")) {
              keyColor = "text-purple-600 dark:text-purple-400 font-bold";
            } else if (key.startsWith("FOCUS")) {
              keyColor = "text-sky-600 dark:text-sky-400 font-bold";
            } else if (key.startsWith("CORE STACK")) {
              keyColor = "text-cyan-600 dark:text-cyan-400 font-bold";
              valColor = "text-foreground font-medium";
            } else if (key.startsWith("LOCATION")) {
              keyColor = "text-amber-600 dark:text-amber-400 font-bold";
            } else if (key.startsWith("TELEMETRY")) {
              keyColor = "text-emerald-600 dark:text-emerald-400 font-bold";
              valColor = "text-emerald-700 dark:text-emerald-300 font-medium";
            }

            return (
              <div key={idx} className="flex items-baseline space-x-2">
                <span className={keyColor}>{key}</span>
                <span className={valColor}>{val}</span>
              </div>
            );
          }

          let lineStyle = "text-foreground/90";
          if (line.type === "success") lineStyle = "text-success font-medium";
          if (line.type === "accent") lineStyle = "text-accent font-medium";
          if (line.type === "comment") lineStyle = "text-muted";

          return (
            <div key={idx} className={lineStyle}>
              {line.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}
