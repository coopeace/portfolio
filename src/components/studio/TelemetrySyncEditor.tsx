"use client";

import * as React from "react";
import Link from "next/link";
import {
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ExternalLink,
  Save,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AchievementCard } from "@/components/achievements/AchievementCard";
import type { Achievement } from "@/data/achievements";

export function TelemetrySyncEditor() {
  const [achievements, setAchievements] = React.useState<Achievement[]>([]);
  const [stationLocation, setStationLocation] = React.useState("");
  const [stationStatus, setStationStatus] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Fetch current live telemetry from disk
  const loadTelemetryData = React.useCallback(async () => {
    setIsLoading(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/studio/telemetry");
      const data = await res.json();
      if (data.success) {
        setAchievements(data.achievements || []);
        if (data.profile) {
          setStationLocation(data.profile.location || "");
          setStationStatus(data.profile.status || "");
        }
      } else {
        setFeedback({
          type: "error",
          message: data.message || "Could not retrieve telemetry from disk.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Failed to communicate with telemetry gateway.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadTelemetryData();
  }, [loadTelemetryData]);

  // Handle updating a specific platform's achievement fields
  const updateAchievement = (index: number, patch: Partial<Achievement>) => {
    setAchievements((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], ...patch };
      }
      return updated;
    });
  };

  // Submit telemetry update
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    const currentDate = new Date().toISOString().split("T")[0];

    // Ensure lastUpdated is synchronized to today's date
    const synchronizedAchievements = achievements.map((ach) => ({
      ...ach,
      lastUpdated: currentDate,
      progress:
        ach.total && ach.total > 0
          ? Math.min(100, Math.round(((ach.solved || 0) / ach.total) * 100))
          : ach.progress,
    }));

    try {
      const res = await fetch("/api/studio/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          achievements: synchronizedAchievements,
          profile: {
            location: stationLocation,
            status: stationStatus,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAchievements(synchronizedAchievements);
        setFeedback({
          type: "success",
          message:
            "Telemetry synchronized successfully! All public dashboards updated.",
        });
      } else {
        setFeedback({
          type: "error",
          message: data.message || "Failed to commit telemetry to disk.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Network error encountered during telemetry sync.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4 rounded-xl border border-border bg-surface/50 font-mono text-sm text-muted">
        <RefreshCw className="w-6 h-6 text-accent animate-spin" />
        <span>Fetching live telemetry data from disk...</span>
      </div>
    );
  }

  const leetcode = achievements.find((a) => a.platform === "LeetCode");
  const neetcode = achievements.find((a) => a.platform === "NeetCode");
  const hackerrank = achievements.find((a) => a.platform === "HackerRank");

  const leetcodeIdx = achievements.findIndex((a) => a.platform === "LeetCode");
  const neetcodeIdx = achievements.findIndex((a) => a.platform === "NeetCode");
  const hackerrankIdx = achievements.findIndex((a) => a.platform === "HackerRank");

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Header and Integrity Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <div className="flex items-center space-x-2 text-accent font-mono text-xs uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4 text-accent" />
            <span>Mission Control // Telemetry Stream Sync</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-mono text-foreground">
            Algorithmic Telemetry &amp; Metrics Sync
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-1 max-w-2xl">
            Live synchronize verified problem-solving counts, platform profiles, and ground station parameters directly to disk.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={loadTelemetryData}
            disabled={isSaving}
            className="space-x-1.5 font-mono text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reload Disk Baseline</span>
          </Button>
          <Link
            href="/telemetry"
            target="_blank"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-elevated font-mono text-xs text-accent transition-colors"
          >
            <span>Inspect Live Dossier</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Notification Banner */}
      {feedback && (
        <div
          role="status"
          className={`p-4 rounded-lg font-mono text-xs flex flex-wrap items-center justify-between gap-2 border ${
            feedback.type === "success"
              ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-400"
              : "bg-red-950/40 border-red-500/50 text-red-400"
          }`}
        >
          <div className="flex items-center space-x-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        </div>
      )}

      {/* Integrity Constraint Alert */}
      <div className="p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 font-mono text-xs text-muted flex items-start sm:items-center space-x-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5 sm:mt-0" />
        <div className="flex-1">
          <strong className="text-emerald-400">Zero Simulated Statistics Directive:</strong>{" "}
          Always input genuine benchmark counts. Every update is stamped with the synchronization timestamp and verifiable across public profiles.
        </div>
      </div>

      {/* Platform Metric Grid Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. LeetCode */}
        {leetcode && leetcodeIdx !== -1 && (
          <div className="p-5 rounded-panel border border-amber-500/30 bg-surface/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <span className="font-mono text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded border text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10">
                LeetCode
              </span>
              <span className="font-mono text-[11px] text-muted">Core Engine</span>
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                Problems Solved
              </label>
              <input
                type="number"
                min="0"
                value={leetcode.solved ?? 0}
                onChange={(e) =>
                  updateAchievement(leetcodeIdx, {
                    solved: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                Platform Profile URL
              </label>
              <input
                type="url"
                value={leetcode.url}
                onChange={(e) =>
                  updateAchievement(leetcodeIdx, { url: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                Status Badge
              </label>
              <input
                type="text"
                value={leetcode.status}
                onChange={(e) =>
                  updateAchievement(leetcodeIdx, {
                    status: e.target.value as Achievement["status"],
                  })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                Description
              </label>
              <textarea
                rows={2}
                value={leetcode.description}
                onChange={(e) =>
                  updateAchievement(leetcodeIdx, { description: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
            </div>
          </div>
        )}

        {/* 2. NeetCode */}
        {neetcode && neetcodeIdx !== -1 && (
          <div className="p-5 rounded-panel border border-cyan-500/30 bg-surface/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <span className="font-mono text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded border text-cyan-600 dark:text-cyan-400 border-cyan-500/30 bg-cyan-500/10">
                NeetCode
              </span>
              <span className="font-mono text-[11px] text-muted">150 Roadmap</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                  Solved / Target 150
                </label>
                <span className="font-mono text-xs text-cyan-400 font-semibold">
                  {Math.round(((neetcode.solved || 0) / 150) * 100)}%
                </span>
              </div>
              <input
                type="number"
                min="0"
                max="150"
                value={neetcode.solved ?? 0}
                onChange={(e) =>
                  updateAchievement(neetcodeIdx, {
                    solved: parseInt(e.target.value, 10) || 0,
                    progress: Math.min(
                      100,
                      Math.round(((parseInt(e.target.value, 10) || 0) / 150) * 100)
                    ),
                  })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              {/* Live Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-surface-elevated border border-border overflow-hidden mt-2">
                <div
                  className="h-full bg-cyan-400 transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(((neetcode.solved || 0) / 150) * 100)
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                Roadmap URL
              </label>
              <input
                type="url"
                value={neetcode.url}
                onChange={(e) =>
                  updateAchievement(neetcodeIdx, { url: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                Status Badge
              </label>
              <input
                type="text"
                value={neetcode.status}
                onChange={(e) =>
                  updateAchievement(neetcodeIdx, {
                    status: e.target.value as Achievement["status"],
                  })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                Description
              </label>
              <textarea
                rows={2}
                value={neetcode.description}
                onChange={(e) =>
                  updateAchievement(neetcodeIdx, { description: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
            </div>
          </div>
        )}

        {/* 3. HackerRank */}
        {hackerrank && hackerrankIdx !== -1 && (
          <div className="p-5 rounded-panel border border-emerald-500/30 bg-surface/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <span className="font-mono text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded border text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                HackerRank
              </span>
              <span className="font-mono text-[11px] text-muted">Verification</span>
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                Verified Badges
              </label>
              <input
                type="number"
                min="0"
                value={hackerrank.badges ?? 0}
                onChange={(e) =>
                  updateAchievement(hackerrankIdx, {
                    badges: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                Profile URL
              </label>
              <input
                type="url"
                value={hackerrank.url}
                onChange={(e) =>
                  updateAchievement(hackerrankIdx, { url: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                Status Badge
              </label>
              <input
                type="text"
                value={hackerrank.status}
                onChange={(e) =>
                  updateAchievement(hackerrankIdx, {
                    status: e.target.value as Achievement["status"],
                  })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-xs uppercase text-foreground font-semibold">
                Description
              </label>
              <textarea
                rows={2}
                value={hackerrank.description}
                onChange={(e) =>
                  updateAchievement(hackerrankIdx, {
                    description: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Ground Station Parameters */}
      <div className="p-5 rounded-panel border border-border bg-surface/60 space-y-4">
        <h3 className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
          Ground Station Coordinates &amp; Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block font-mono text-xs uppercase text-foreground font-semibold">
              Ground Station Location
            </label>
            <input
              type="text"
              value={stationLocation}
              onChange={(e) => setStationLocation(e.target.value)}
              placeholder="e.g. Durgapur, West Bengal, India"
              className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block font-mono text-xs uppercase text-foreground font-semibold">
              Telemetry Status Callsign
            </label>
            <input
              type="text"
              value={stationStatus}
              onChange={(e) => setStationStatus(e.target.value)}
              placeholder="e.g. MISSION ACTIVE // SYSTEMS NOMINAL"
              className="w-full px-3.5 py-2 rounded-lg bg-surface-elevated border border-border font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </div>

      {/* Live Preview Deck */}
      <div className="space-y-4 pt-4 border-t border-border/40">
        <div className="flex items-center space-x-2 text-muted font-mono text-xs">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span>{"// Real-Time WYSIWYG Public Card Previews"}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((ach) => (
            <AchievementCard key={ach.platform} achievement={ach} />
          ))}
        </div>
      </div>

      {/* Submit Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/40">
        <div className="font-mono text-xs text-muted">
          All modifications will be committed atomically to{" "}
          <code className="text-foreground">src/data/achievements.json</code> and{" "}
          <code className="text-foreground">profile.json</code>.
        </div>
        <Button
          type="submit"
          variant="primary"
          disabled={isSaving}
          className="space-x-2 font-mono text-xs w-full sm:w-auto"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Synchronizing Telemetry...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save &amp; Commit Telemetry Sync</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
