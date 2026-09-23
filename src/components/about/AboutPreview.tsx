import * as React from "react";
import Link from "next/link";
import { profile } from "@/data/profile";
import { MissionProfile } from "./MissionProfile";
import { PhilosophyCard } from "./PhilosophyCard";
import { ArrowRight, Compass } from "lucide-react";

export function AboutPreview() {
  return (
    <section
      id="about-preview"
      aria-label="Mission Profile and Developer Identity"
      className="scroll-mt-20 py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-border/40"
    >
      {/* Header */}
      <div className="flex flex-col space-y-4 pb-8 border-b border-border/40">
        <div className="flex items-center space-x-2 text-accent font-mono text-xs uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Mission Profile // Origin &amp; Systems Trajectory</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-300">
              Mission Profile &amp; Architecture
            </h2>
            <p className="text-muted text-base sm:text-lg max-w-2xl mt-1">
              Engineering journey built on self-directed, first-principles learning — exploring beneath software abstractions from Python to Linux internals and network stacks.
            </p>
          </div>

          <Link
            href="/about"
            className="inline-flex items-center space-x-1.5 font-mono text-sm text-accent hover:text-accent-secondary transition-colors"
          >
            <span>Full Mission Background</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main Profile Component */}
      <div className="mt-10">
        <MissionProfile />
      </div>

      {/* Engineering Philosophies */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-foreground mb-6 font-mono text-xs uppercase tracking-wider text-muted">
          {"// Core Operating Tenets"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {profile.philosophies.map((item) => (
            <PhilosophyCard
              key={item.title}
              title={item.title}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </div>

        {/* Action Link to Full About Dossier */}
        <div className="pt-6 flex justify-end">
          <Link
            href="/about"
            className="inline-flex items-center space-x-2 font-mono text-sm text-accent hover:text-accent-secondary font-medium transition-colors group"
          >
            <span>Read complete personnel dossier &amp; engineering journey</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
