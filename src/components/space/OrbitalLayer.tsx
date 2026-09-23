import React from "react";

export interface OrbitalLayerProps {
  className?: string;
}

export function OrbitalLayer({ className = "" }: OrbitalLayerProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      {/* Off-center orbital plane container */}
      <div className="relative w-[1200px] h-[1200px] max-w-none opacity-60 dark:opacity-40 will-change-transform motion-safe:animate-orbit-spin motion-reduce:!animate-none">
        <svg
          viewBox="0 0 1200 1200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Coordinate Center Telemetry Point */}
          <circle
            cx="600"
            cy="600"
            r="3"
            className="fill-accent/40 dark:fill-accent/60"
          />
          <circle
            cx="600"
            cy="600"
            r="12"
            className="stroke-accent/20 dark:stroke-accent/30"
            strokeWidth="1"
            strokeDasharray="2 4"
          />

          {/* Inner Trajectory: Fast Telemetry Arc */}
          <ellipse
            cx="600"
            cy="600"
            rx="360"
            ry="240"
            transform="rotate(-18 600 600)"
            className="stroke-accent/30 dark:stroke-accent/25"
            strokeWidth="1"
            strokeDasharray="4 8"
          />

          {/* Mid Trajectory: Primary Mission Orbit */}
          <ellipse
            cx="600"
            cy="600"
            rx="520"
            ry="340"
            transform="rotate(-28 600 600)"
            className="stroke-accent/25 dark:stroke-accent/20"
            strokeWidth="1.25"
            strokeDasharray="6 12"
          />

          {/* Outer Trajectory: Deep Trajectory */}
          <ellipse
            cx="600"
            cy="600"
            rx="700"
            ry="450"
            transform="rotate(-38 600 600)"
            className="stroke-accent-secondary/25 dark:stroke-accent-secondary/20"
            strokeWidth="1"
            strokeDasharray="8 16"
          />

          {/* Telemetry Waypoint Nodes on Orbit Tracks */}
          <g className="fill-accent dark:fill-accent">
            {/* Waypoint Alpha */}
            <circle cx="380" cy="480" r="3" />
            <circle
              cx="380"
              cy="480"
              r="7"
              className="stroke-accent/40"
              strokeWidth="1"
              fill="none"
            />

            {/* Waypoint Beta */}
            <circle cx="820" cy="720" r="2.5" />

            {/* Waypoint Gamma */}
            <circle cx="210" cy="530" r="3.5" />
            <circle
              cx="210"
              cy="530"
              r="9"
              className="stroke-accent/30"
              strokeWidth="1"
              fill="none"
            />

            {/* Waypoint Delta */}
            <circle cx="980" cy="670" r="3" />
          </g>
        </svg>
      </div>
    </div>
  );
}
