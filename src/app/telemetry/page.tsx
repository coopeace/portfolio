import type { Metadata } from "next";
import { AchievementDashboard } from "@/components/achievements/AchievementDashboard";
import { Activity, ShieldCheck, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Telemetry & Algorithmic Benchmarks | Shishir Dev",
  description:
    "Truthful problem-solving metrics across LeetCode, NeetCode, and HackerRank platforms alongside a vertical DSA journey progression roadmap.",
  openGraph: {
    title: "Algorithmic Telemetry // Shishir Dev",
    description:
      "Telemetry dashboard tracking verified problem-solving milestones, data structures, and computational benchmarks.",
  },
};

export default function TelemetryPage() {
  return (
    <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
      {/* Page Header */}
      <header className="pb-8 border-b border-border/40 space-y-4">
        <div className="flex items-center space-x-2 text-accent font-mono text-xs uppercase tracking-wider">
          <Activity className="w-4 h-4 text-success animate-pulse" />
          <span>Personnel Dossier // Telemetry Stream SD-01</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-300">
          Algorithmic Telemetry &amp; Metrics
        </h1>

        <p className="text-muted text-base sm:text-lg max-w-3xl leading-relaxed">
          Continuous problem-solving progression across foundational data structures, live platform status benchmarks, and our vertical algorithmic progression from first principles up to canonical problem milestones.
        </p>

        <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-muted pt-2">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Telemetry Rule: <strong className="text-foreground">Zero Simulated Statistics</strong></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Compass className="w-4 h-4 text-accent" />
            <span>Trajectory: <strong className="text-foreground">Arrays &rarr; Two Sum &rarr; Two Pointers</strong></span>
          </div>
        </div>
      </header>

      {/* Main Dashboard with Vertical DSA Progression Timeline (header hidden to prevent duplication) */}
      <AchievementDashboard
        showDsaTimeline={true}
        hideHeader={true}
        className="w-full space-y-8"
      />
    </div>
  );
}
