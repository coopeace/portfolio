"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TerminalSnippet } from "./TerminalSnippet";
import { socialLinks } from "@/data/social";
import { ArrowDown, Activity, Mail, Github, Linkedin, Radio, GraduationCap } from "lucide-react";
import { playClickSound, playHoverSound } from "@/lib/audio";
import { cn } from "@/lib/utils";

export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  name?: string;
  role?: string;
  tagline?: string;
  bio?: string;
  location?: string;
  statusText?: string;
}

export function Hero({
  name = "Shishir Dev",
  role = "Backend & Systems Developer",
  tagline = "Building Resilient Systems & Exploring Beneath Abstractions",
  bio = "BCA student at Michael Madhusudan Memorial College (KNU) and self-directed developer exploring software beneath abstractions — building practical backend services, command-line tools, and diving into Linux systems and network protocols.",
  location = "Durgapur, India",
  statusText = "MISSION ACTIVE // SYSTEMS NOMINAL",
  className,
  ...props
}: HeroProps) {
  const githubLink = socialLinks.find((l) => l.platform === "GitHub");
  const linkedinLink = socialLinks.find((l) => l.platform === "LinkedIn");

  const stats = [
    { label: "Systems Missions", value: "4" },
    { label: "Core Stack", value: "Python · Linux" },
    { label: "Foundations", value: "POSIX · Sockets" },
    { label: "Integrity", value: "Zero Fake Stats" },
  ];

  return (
    <section
      id="hero"
      aria-label="Systems Developer Introduction"
      className={cn(
        "relative isolate overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col justify-center",
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 w-full">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Status Beacon Badge */}
          <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full border border-accent/30 bg-surface-elevated shadow-[0_0_15px_rgb(var(--accent-rgb)/0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold">
              {statusText}
            </span>
          </div>

          {/* Name & Role */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-300 drop-shadow-sm">
              {name}
            </h1>
            <p className="font-mono text-base sm:text-2xl text-accent font-semibold tracking-wide max-w-3xl mx-auto">
              {role}
            </p>
            {tagline && (
              <p className="font-mono text-xs sm:text-sm text-muted tracking-wider uppercase">
                {tagline}
              </p>
            )}
          </div>

          {/* Bio */}
          <p className="max-w-3xl text-muted text-base sm:text-lg leading-relaxed">
            {bio}
          </p>

          {/* Centered Systems Terminal Snippet */}
          <div className="w-full max-w-2xl pt-2">
            <TerminalSnippet />
          </div>

          {/* Telemetry Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-3xl pt-2">
            {stats.map((item) => (
              <div
                key={item.label}
                className="p-3.5 rounded-lg border border-border bg-surface/70 backdrop-blur-sm text-center space-y-1 hover:border-accent/40 transition-colors"
              >
                <div className="font-mono text-lg sm:text-xl font-bold text-foreground">
                  {item.value}
                </div>
                <div className="font-mono text-[11px] text-muted uppercase tracking-wider">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 w-full">
            <Button
              href="#projects"
              variant="primary"
              size="lg"
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
              rightIcon={<ArrowDown className="w-4 h-4" />}
            >
              Explore Missions
            </Button>

            <Button
              href="/telemetry"
              variant="telemetry"
              size="lg"
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
              leftIcon={<Activity className="w-4 h-4" />}
            >
              View Telemetry
            </Button>

            <Button
              href="/contact"
              variant="secondary"
              size="lg"
              onMouseEnter={playHoverSound}
              onClick={playClickSound}
              rightIcon={<Mail className="w-4 h-4" />}
            >
              Comms Channel
            </Button>
          </div>

          {/* Verified Channels & Location */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-muted text-xs font-mono">
            <div className="flex items-center space-x-1.5">
              <Radio className="w-3.5 h-3.5 text-success animate-pulse" />
              <span>STATION: <strong className="text-foreground">{location}</strong></span>
            </div>

            <div className="flex items-center space-x-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-accent" />
              <span>ACADEMY: <strong className="text-foreground">BCA · MMMC (KNU)</strong></span>
            </div>

            {githubLink && (
              <Link
                href={githubLink.url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={playHoverSound}
                className="flex items-center space-x-1.5 hover:text-accent transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>github.com/coopeace</span>
              </Link>
            )}

            {linkedinLink && (
              <Link
                href={linkedinLink.url}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={playHoverSound}
                className="flex items-center space-x-1.5 hover:text-accent transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>linkedin.com/in/shishir-dev</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
