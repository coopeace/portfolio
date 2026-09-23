import * as React from "react";
import Link from "next/link";
import { profile } from "@/data/profile";
import { Radio, Terminal, GraduationCap, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function MissionProfile() {
  return (
    <div className="p-8 sm:p-10 rounded-panel border border-border bg-surface/90 backdrop-blur-md shadow-xl">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
        {/* Left Column: Mission Persona (Preview) */}
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center space-x-2 text-accent font-mono text-xs uppercase tracking-wider">
            <Radio className="w-4 h-4 text-success animate-pulse" />
            <span>Mission Dossier // Callsign {profile.callsign}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {profile.role}
          </h3>

          <p className="text-muted leading-relaxed text-sm sm:text-base">
            {profile.shortBio}
          </p>

          <p className="text-muted/80 leading-relaxed text-sm">
            Engineering journey built around self-directed, first-principles learning — exploring beneath abstractions from high-level Python services down to Linux internals, memory management, and network stacks.
          </p>

          {/* Academic Base & Telemetry Status */}
          <div className="pt-2 flex flex-wrap items-center gap-4 font-mono text-xs text-muted">
            <div className="flex items-center space-x-1.5">
              <Radio className="w-4 h-4 text-success animate-pulse" />
              <span>Status: <strong className="text-foreground">{profile.status}</strong></span>
            </div>
            <div className="flex items-center space-x-1.5">
              <GraduationCap className="w-4 h-4 text-accent" />
              <span>Academic Base: <strong className="text-foreground">BCA · MMMC (KNU)</strong></span>
            </div>
          </div>

          {/* CTA to full About page */}
          <div className="pt-2">
            <Link
              href="/about"
              className="inline-flex items-center space-x-2 font-mono text-xs sm:text-sm text-accent hover:text-accent-secondary font-semibold transition-colors group"
            >
              <span>Read Full Engineering Journey &amp; Dossier</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Right Column: Focus Areas & Badges */}
        <div className="w-full lg:w-96 space-y-4 p-6 rounded-lg bg-surface-elevated border border-border/60">
          <div className="flex items-center space-x-2 text-foreground font-mono text-xs font-semibold uppercase tracking-wider pb-2 border-b border-border/40">
            <Terminal className="w-4 h-4 text-accent" />
            <span>Primary Flight Systems</span>
          </div>

          <p className="text-xs text-muted leading-relaxed">
            Core domains under active development and systems exploration:
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {profile.focusAreas.map((area) => (
              <Badge key={area} variant="tech" tech={area} className="font-mono text-xs">
                {area}
              </Badge>
            ))}
          </div>

          <div className="pt-4 mt-2 border-t border-border/40 space-y-2 text-[11px] font-mono text-muted">
            <div className="flex items-center justify-between">
              <span>Operating Identity</span>
              <span className="text-accent font-semibold">{profile.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Academic Foundation</span>
              <span className="text-foreground font-medium">BCA · MMMC (KNU)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
