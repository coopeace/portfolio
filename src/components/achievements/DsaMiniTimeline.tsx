"use client";

import * as React from "react";
import { dsaJourneyMilestones } from "@/data/timeline";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Code2,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DsaMiniTimeline() {
  return (
    <div className="space-y-6 pt-10 border-t border-border/40">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-border/40">
        <div>
          <div className="flex items-center space-x-2 text-accent font-mono text-xs uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-accent" />
            <span>Problem-Solving Trace // Vertical Stepper</span>
          </div>
          <h3 className="text-2xl font-bold font-mono text-foreground mt-1">
            DSA Journey Progression
          </h3>
          <p className="text-muted text-sm max-w-2xl mt-1">
            Authentic problem-solving trajectory tracking foundational complexity, arrays, hash maps, and the canonical Two Sum milestone.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 font-mono text-xs text-muted px-3 py-1.5 rounded bg-surface border border-border/60 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Milestone: Two Sum Solved</span>
        </div>
      </div>

      {/* Vertical Stepper Timeline Track */}
      <div className="relative pl-6 sm:pl-8 space-y-8 pt-2">
        {/* Continuous Stepper Rail */}
        <div
          className="absolute left-[13px] sm:left-[17px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-emerald-500/50 via-cyan-400/50 to-border/40 pointer-events-none"
          aria-hidden="true"
        />

        {dsaJourneyMilestones.map((item) => {
          const isCurrent = item.status === "Current Milestone";
          const isCompleted = item.status === "Completed";
          const isNext = item.status === "Next Target";

          return (
            <div key={item.id} className="relative group">
              {/* Stepper Node Marker on the Rail */}
              <div
                className="absolute -left-[23px] sm:-left-[31px] top-3.5 flex items-center justify-center"
                aria-hidden="true"
              >
                {isCurrent ? (
                  <span className="relative flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-surface-elevated border-2 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.7)]">
                      <Sparkles className="w-2.5 h-2.5 text-cyan-300" />
                    </span>
                  </span>
                ) : isCompleted ? (
                  <div className="w-4 h-4 rounded-full border-2 border-emerald-500 bg-surface-elevated flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-dashed border-border bg-surface flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted/50" />
                  </div>
                )}
              </div>

              {/* Vertical Step Card */}
              <div
                className={cn(
                  "p-5 rounded-panel border transition-all space-y-3",
                  isCurrent
                    ? "bg-surface-elevated/95 border-cyan-400/50 shadow-[0_0_25px_rgba(34,211,238,0.08)] ring-1 ring-cyan-400/20"
                    : isCompleted
                    ? "bg-surface/80 border-border hover:border-emerald-500/40 shadow-sm"
                    : "bg-surface/50 border-border/50 text-muted"
                )}
              >
                {/* Header row: Step pill, badge, status pill & complexity */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-[11px] font-bold tracking-wider",
                        isCurrent
                          ? "bg-cyan-400/15 text-cyan-300 border border-cyan-400/30"
                          : isCompleted
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-surface text-muted border border-border"
                      )}
                    >
                      STEP {item.step}
                    </span>

                    <span className="text-muted/40" aria-hidden="true">
                      {"//"}
                    </span>

                    <span className="text-[11px] text-muted uppercase tracking-wider font-semibold">
                      {item.badge}
                    </span>
                  </div>

                  {/* Status Indicator Pill */}
                  <div className="flex items-center space-x-2">
                    {item.complexity && (
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-surface-elevated text-muted text-[11px] border border-border/50 font-mono">
                        {item.complexity}
                      </span>
                    )}

                    <span
                      className={cn(
                        "inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider",
                        isCurrent
                          ? "text-cyan-300 bg-cyan-400/10 border border-cyan-400/30 animate-pulse"
                          : isCompleted
                          ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                          : "text-muted bg-surface/50 border border-border/40"
                      )}
                    >
                      {isCompleted && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {isCurrent && <Sparkles className="w-3 h-3 mr-1" />}
                      {isNext && <ArrowRight className="w-3 h-3 mr-1" />}
                      <span>{item.status}</span>
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h4
                  className={cn(
                    "text-base sm:text-lg font-bold font-mono",
                    isCurrent ? "text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-cyan-200 to-indigo-200" : "text-foreground"
                  )}
                >
                  {item.title}
                </h4>

                {/* Description */}
                <p className="text-muted text-sm leading-relaxed">
                  {item.description}
                </p>

                {/* Code Snippet Callout (For Two Sum Milestone) */}
                {item.codeHighlight && (
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-cyan-400/30 font-mono text-xs text-foreground/90 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-muted/70 pb-1 border-b border-border/30">
                      <div className="flex items-center space-x-1.5 text-cyan-300">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Optimal Solution Pattern</span>
                      </div>
                      <span className="text-emerald-400">O(n) Time · O(n) Space</span>
                    </div>
                    <div className="text-cyan-400/90 pt-1">
                      <span className="text-indigo-400">for</span> i, num{" "}
                      <span className="text-indigo-400">in</span> enumerate(nums):
                    </div>
                    <div className="pl-4 text-emerald-300">
                      complement = target - num
                    </div>
                    <div className="pl-4 text-amber-300">
                      <span className="text-indigo-400">if</span> complement{" "}
                      <span className="text-indigo-400">in</span> seen:{" "}
                      <span className="text-indigo-400">return</span> [seen[complement], i]
                    </div>
                    <div className="pl-4 text-muted/80">seen[num] = i</div>
                  </div>
                )}

                {/* Tags */}
                {item.topics && item.topics.length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-1.5">
                    {item.topics.map((topic) => (
                      <span
                        key={topic}
                        className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface-elevated border border-border/60 text-muted"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
