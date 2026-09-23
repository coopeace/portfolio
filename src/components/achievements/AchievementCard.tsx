import { ExternalLink, CheckCircle2 } from "lucide-react";
import type { Achievement } from "@/data/achievements";
import { cn } from "@/lib/utils";

export interface AchievementCardProps {
  achievement: Achievement;
  className?: string;
}

export function AchievementCard({ achievement, className }: AchievementCardProps) {
  const isLeetCode = achievement.platform.toLowerCase().includes("leetcode");
  const isNeetCode = achievement.platform.toLowerCase().includes("neetcode");
  const isHackerRank = achievement.platform.toLowerCase().includes("hackerrank");

  const platformBadgeClass = isLeetCode
    ? "text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10"
    : isNeetCode
    ? "text-cyan-600 dark:text-cyan-400 border-cyan-500/30 bg-cyan-500/10"
    : isHackerRank
    ? "text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
    : "text-accent border-border/40 bg-surface-elevated";

  const dotPulseColor = isLeetCode
    ? "bg-amber-500"
    : isNeetCode
    ? "bg-cyan-400"
    : isHackerRank
    ? "bg-emerald-400"
    : "bg-accent";

  const hoverBorderClass = isLeetCode
    ? "hover:border-amber-500/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]"
    : isNeetCode
    ? "hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(56,189,248,0.15)]"
    : isHackerRank
    ? "hover:border-emerald-400/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]"
    : "hover:border-border-hover";

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between p-6 rounded-panel border border-border bg-surface transition-all duration-300 shadow-sm hover:shadow-md",
        hoverBorderClass,
        className
      )}
    >
      {/* Top Meta Line */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border/40">
          <div className="flex items-center space-x-2">
            <span className={cn("w-2 h-2 rounded-full animate-pulse", dotPulseColor)} aria-hidden="true" />
            <span className={cn("font-mono text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded border", platformBadgeClass)}>
              {achievement.platform}
            </span>
          </div>
          <span className="font-mono text-[11px] text-muted">
            {achievement.status}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-foreground mt-4 group-hover:text-accent transition-colors">
          {achievement.label}
        </h3>

        {/* Description */}
        <p className="text-muted text-sm mt-2 leading-relaxed">
          {achievement.description}
        </p>

        {/* Telemetry Metrics */}
        <div className="mt-5 p-4 rounded-lg bg-surface-elevated border border-border/50 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between text-muted">
            <span>Problems Solved</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono text-sm tracking-wide">
              {achievement.solved ?? 0}
            </span>
          </div>

          {achievement.total !== undefined && achievement.total > 0 && (
            <div className="flex items-center justify-between text-muted">
              <span>Roadmap Target</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold font-mono text-sm">
                {achievement.total}
              </span>
            </div>
          )}

          {achievement.badges !== undefined && (
            <div className="flex items-center justify-between text-muted">
              <span>Verified Badges</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold font-mono text-sm">
                {achievement.badges}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-muted/70 pt-1 border-t border-border/30">
            <span>Data Integrity</span>
            <span className="text-success flex items-center space-x-1 font-medium">
              <CheckCircle2 className="w-3 h-3 inline" />
              <span>Truthful Baseline</span>
            </span>
          </div>
        </div>
      </div>

      {/* Footer link */}
      <div className="pt-6 mt-4 border-t border-border/40 flex items-center justify-between">
        <span className="font-mono text-[11px] text-muted/80">
          Synced: {achievement.lastUpdated || "Live"}
        </span>
        {achievement.url &&
        (achievement.url.startsWith("http://") ||
          achievement.url.startsWith("https://")) ? (
          <a
            href={achievement.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 font-mono text-xs text-accent hover:text-accent-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-1.5 py-0.5"
            aria-label={`Open ${achievement.platform} profile in external tab`}
          >
            <span>Platform Link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <span className="inline-flex items-center space-x-1.5 font-mono text-xs text-muted/60">
            <span>Link Inactive</span>
          </span>
        )}
      </div>
    </div>
  );
}
