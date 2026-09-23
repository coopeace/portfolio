"use client";

import React, { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { toggleSound } from "@/lib/audio";
import { cn } from "@/lib/utils";

export function AudioToggle({ className = "" }: { className?: string }) {
  const [enabled, setEnabled] = useState(false);

  const handleToggle = () => {
    const nextState = toggleSound();
    setEnabled(nextState);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={enabled ? "Mute interactive audio feedback" : "Enable interactive audio feedback"}
      title={enabled ? "Audio: Active (Click to mute)" : "Audio: Muted (Click to enable audio feedback)"}
      className={cn(
        "inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-surface text-muted transition-all duration-200",
        "hover:text-accent hover:border-accent/40 hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        enabled && "text-accent border-accent/40 bg-surface-elevated shadow-[0_0_10px_rgb(var(--accent-rgb)/0.15)]",
        className
      )}
    >
      {enabled ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-accent animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-accent font-semibold">
            SOUND ON
          </span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-muted/70" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted/70">
            SOUND
          </span>
        </>
      )}
    </button>
  );
}
