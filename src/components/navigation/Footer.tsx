"use client";

import * as React from "react";
import { Github, Linkedin, Mail, Radio, Terminal, Activity } from "lucide-react";
import { socialLinks, type SocialLink } from "@/data/social";
import { playClickSound, playHoverSound } from "@/lib/audio";

function SocialIcon({ icon, className }: { icon: SocialLink["icon"]; className?: string }) {
  switch (icon) {
    case "Github":
      return <Github className={className} />;
    case "Linkedin":
      return <Linkedin className={className} />;
    case "Mail":
      return <Mail className={className} />;
    default:
      return null;
  }
}

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="border-t border-border bg-[#010206]/80 backdrop-blur-md py-14 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto">
        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 pb-10 border-b border-border/60">
          {/* Column 1: Identity & Status */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-md bg-surface border border-border">
                <Terminal className="w-4 h-4 text-accent" />
              </div>
              <div>
                <span className="font-mono text-sm font-bold tracking-wider text-foreground">
                  SHISHIR DEV
                </span>
                <span className="block text-xs text-muted">
                  Backend &amp; Systems Developer
                </span>
              </div>
            </div>

            {/* Operational Status Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-border bg-surface-elevated shadow-sm">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              <span className="font-mono text-xs font-semibold tracking-wider text-foreground">
                SYSTEMS NOMINAL // ARCHITECTURE ACTIVE
              </span>
            </div>

            {/* Station Status Indicator */}
            <div className="flex items-center space-x-2 text-xs font-mono text-muted">
              <Radio className="w-3.5 h-3.5 text-success animate-pulse flex-shrink-0" aria-hidden="true" />
              <span>Station: Durgapur, West Bengal, India</span>
            </div>
          </div>

          {/* Column 2: Telemetry & Channels */}
          <div className="space-y-3">
            <div className="flex items-center space-x-1.5 text-accent font-mono text-xs uppercase tracking-wider font-semibold">
              <Activity className="w-4 h-4" />
              <span>Algorithmic &amp; Systems Telemetry</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Verified problem-solving telemetry across LeetCode, NeetCode, and HackerRank. Deep focus on Linux networking, distributed storage, and zero-fabrication metrics.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              {socialLinks.map((item) => (
                <a
                  key={item.platform}
                  href={item.url}
                  target={item.platform === "Email" ? undefined : "_blank"}
                  rel={item.platform === "Email" ? undefined : "noopener noreferrer"}
                  aria-label={item.label}
                  onClick={playClickSound}
                  onMouseEnter={playHoverSound}
                  className="p-2 rounded-lg border border-border bg-surface text-muted hover:text-accent hover:border-border-hover hover:bg-surface-elevated transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <SocialIcon icon={item.icon} className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted font-mono">
          <p>© {currentYear} Shishir Dev. Systems &amp; Backend Engineering.</p>
          <p>Built with Next.js 15, React 19, Motion &amp; Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
