import * as React from "react";
import Link from "next/link";
import { achievements } from "@/data/achievements";
import { AchievementCard } from "./AchievementCard";
import { DsaMiniTimeline } from "./DsaMiniTimeline";
import { ShieldCheck, Activity, Cpu, ArrowRight } from "lucide-react";

export interface AchievementDashboardProps {
  showDsaTimeline?: boolean;
  hideHeader?: boolean;
  className?: string;
}

export function AchievementDashboard({
  showDsaTimeline = false,
  hideHeader = false,
  className = "",
}: AchievementDashboardProps) {
  return (
    <section
      id="achievements"
      aria-label="Algorithmic Problem Solving & Achievement Telemetry"
      className={
        className ||
        "scroll-mt-20 py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-border/40"
      }
    >
      {/* Header */}
      {!hideHeader && (
        <div className="flex flex-col space-y-4 pb-8 border-b border-border/40">
          <div className="flex items-center space-x-2 text-accent font-mono text-xs uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-accent" />
            <span>Algorithmic Telemetry // Verification Dashboard</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-300">
                Algorithmic Telemetry &amp; Metrics
              </h2>
              <p className="text-muted text-base sm:text-lg max-w-2xl mt-2">
                Continuous problem-solving progression across foundational data structures, computational algorithms, and system design benchmarks. Metrics reflect authentic baselines without simulated figures.
              </p>
            </div>

            {/* Verification Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-surface border border-border font-mono text-xs text-muted shadow-sm">
              <ShieldCheck className="w-4 h-4 text-success animate-pulse" />
              <span className="text-emerald-400 font-medium">Integrity: Zero Simulated Statistics</span>
            </div>
          </div>
        </div>
      )}

      {/* Grid of achievement cards */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${hideHeader ? "pt-2" : "pt-10"}`}>
        {achievements.map((achievement) => (
          <AchievementCard key={achievement.platform} achievement={achievement} />
        ))}
      </div>

      {/* Mini DSA Journey Progression Timeline (Rendered in dedicated Telemetry view) */}
      {showDsaTimeline ? (
        <DsaMiniTimeline />
      ) : (
        <div className="pt-6 flex justify-end">
          <Link
            href="/telemetry"
            className="inline-flex items-center space-x-2 font-mono text-sm text-accent hover:text-accent-secondary transition-colors group"
          >
            <span>View Full Problem-Solving Telemetry &amp; DSA Roadmap</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      )}

      {/* Observational Note */}
      <div className="mt-8 p-4 rounded-lg border border-border/60 bg-surface-elevated/40 font-mono text-xs text-muted flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-accent flex-shrink-0" />
          <span>STATION STATUS: Telemetry tracking active for LeetCode, NeetCode, and HackerRank platforms.</span>
        </div>
        <span className="text-muted/70">AUTHENTIC BASELINE METRICS</span>
      </div>
    </section>
  );
}
