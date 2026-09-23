"use client";

import React, { useState, useEffect } from "react";

export interface ShootingStarsProps {
  className?: string;
  loadingDelayMs?: number;
}

interface MeteorConfig {
  id: number;
  top: string;
  left: string;
  delay: string;
  duration: string;
  tailLength: string;
}

// Staggered meteors positioned in upper regions, shooting diagonally down-left across the screen
const METEORS: MeteorConfig[] = [
  { id: 1, top: "8%", left: "84%", delay: "0.6s", duration: "5.6s", tailLength: "150px" },
  { id: 2, top: "18%", left: "94%", delay: "3.4s", duration: "6.8s", tailLength: "180px" },
  { id: 3, top: "12%", left: "62%", delay: "6.8s", duration: "5.2s", tailLength: "135px" },
  { id: 4, top: "28%", left: "78%", delay: "10.2s", duration: "6.2s", tailLength: "165px" },
  { id: 5, top: "6%", left: "48%", delay: "13.8s", duration: "5.8s", tailLength: "145px" },
];

export function ShootingStars({
  className = "",
  loadingDelayMs = 800,
}: ShootingStarsProps) {
  // Grace period before shooting stars mount, ensuring page layout, fonts, and stylesheets
  // are completely settled before animations begin. Prevents any unstyled initial horizontal frames.
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, loadingDelayMs);

    return () => clearTimeout(timer);
  }, [loadingDelayMs]);

  if (!isReady) {
    return null;
  }

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none motion-reduce:hidden ${className}`}
      aria-hidden="true"
    >
      <style>{`
        /* Pure diagonal streak: synchronous translation along (-d, +d) guarantees 100% 45-degree diagonal trajectory with zero axial drift */
        @keyframes diagonalMeteorStreak {
          0% {
            transform: translate3d(0, 0, 0) scale(0);
            opacity: 0;
          }
          6% {
            transform: translate3d(-35px, 35px, 0) scale(1);
            opacity: 1;
          }
          45% {
            transform: translate3d(-320px, 320px, 0) scale(0.9);
            opacity: 0.85;
          }
          70% {
            transform: translate3d(-520px, 520px, 0) scale(0.3);
            opacity: 0;
          }
          100% {
            transform: translate3d(-520px, 520px, 0) scale(0);
            opacity: 0;
          }
        }

        .diagonal-meteor-item {
          position: absolute;
          opacity: 0;
          transform: translate3d(0, 0, 0);
          animation-name: diagonalMeteorStreak;
          animation-timing-function: cubic-bezier(0.2, 0.8, 0.25, 1);
          animation-iteration-count: infinite;
          animation-fill-mode: both;
          will-change: transform, opacity;
          pointer-events: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .diagonal-meteor-item {
            animation: none !important;
            display: none !important;
          }
        }
      `}</style>

      {METEORS.map((meteor) => (
        <div
          key={meteor.id}
          className="diagonal-meteor-item"
          style={{
            top: meteor.top,
            left: meteor.left,
            animationDuration: meteor.duration,
            animationDelay: meteor.delay,
          }}
        >
          {/* Luminous meteor rotated strictly -45deg with origin anchored at the leading head center */}
          <div
            className="relative flex items-center pointer-events-none"
            style={{
              transform: "rotate(-45deg)",
              transformOrigin: "3px 3px",
            }}
          >
            {/* Luminous Core Head */}
            <span
              className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.9),0_0_12px_4px_rgba(56,189,248,0.8)]"
              aria-hidden="true"
            />

            {/* Fading Trailing Light Tail */}
            <span
              className="h-[1.5px] rounded-full -ml-[1px]"
              style={{
                width: meteor.tailLength,
                background:
                  "linear-gradient(90deg, rgba(255, 255, 255, 0.95) 0%, rgba(56, 189, 248, 0.75) 25%, rgba(167, 139, 250, 0.4) 60%, transparent 100%)",
                boxShadow: "0 0 8px rgba(56, 189, 248, 0.3)",
              }}
              aria-hidden="true"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
