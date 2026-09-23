import React from "react";

export interface NebulaLayerProps {
  className?: string;
}

export function NebulaLayer({ className = "" }: NebulaLayerProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <style>{`
        @keyframes nebulaDrift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(24px, -18px) scale(1.04); }
        }
        @keyframes nebulaDrift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, 16px) scale(0.97); }
        }
        @keyframes nebulaPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.32; }
        }
        .nebula-drift-1 {
          animation: nebulaDrift1 38s ease-in-out infinite alternate;
        }
        .nebula-drift-2 {
          animation: nebulaDrift2 48s ease-in-out infinite alternate;
        }
        .nebula-pulse {
          animation: nebulaPulse 30s ease-in-out infinite alternate;
        }
        @media (prefers-reduced-motion: reduce) {
          .nebula-drift-1,
          .nebula-drift-2,
          .nebula-pulse {
            animation: none !important;
          }
        }
      `}</style>

      {/* =========================================================================
          DARK MODE: Deep Cosmic Nebulae (Obsidian Void, Cyan & Electric Violet)
          ========================================================================= */}
      <div className="absolute inset-0 transition-opacity duration-700 ease-in-out opacity-0 dark:opacity-100">
        {/* Primary Cloud (Cyan/Sky): Subtle crisp atmospheric depth */}
        <div
          className="absolute -top-[20%] -left-[10%] w-[90vw] sm:w-[65vw] h-[65vh] rounded-full blur-[35px] sm:blur-[50px] opacity-12 pointer-events-none transition-colors duration-500 will-change-transform nebula-drift-1 motion-reduce:!animate-none"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, rgba(56, 189, 248, 0.3) 0%, rgba(6, 182, 212, 0.08) 45%, transparent 70%)",
          }}
        />

        {/* Secondary Cloud (Violet/Indigo): Subtle cosmic accent */}
        <div
          className="absolute top-[35%] -right-[15%] w-[95vw] sm:w-[70vw] h-[75vh] rounded-full blur-[35px] sm:blur-[55px] opacity-10 pointer-events-none transition-colors duration-500 will-change-transform nebula-drift-2 motion-reduce:!animate-none"
          style={{
            background:
              "radial-gradient(circle at 65% 65%, rgba(129, 140, 248, 0.25) 0%, rgba(147, 51, 234, 0.06) 50%, transparent 75%)",
          }}
        />

        {/* Deep Center Cloud (Atmospheric Depth) */}
        <div
          className="absolute top-[15%] right-[15%] w-[55vw] h-[55vh] rounded-full blur-[35px] opacity-6 pointer-events-none transition-colors duration-500 will-change-transform nebula-pulse motion-reduce:!animate-none"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(30, 58, 138, 0.2) 0%, rgba(2, 6, 23, 0.05) 60%, transparent 80%)",
          }}
        />
      </div>

      {/* =========================================================================
          LIGHT MODE: Orbital Observatory Atmospheric Lighting
          Cool atmospheric cyan, pale sky blue, and subtle twilight violet wash
          ========================================================================= */}
      <div className="absolute inset-0 transition-opacity duration-700 ease-in-out opacity-100 dark:opacity-0">
        {/* Upper Atmospheric Sky / Cyan Horizon */}
        <div
          className="absolute -top-[15%] right-[5%] sm:right-[15%] w-[85vw] sm:w-[60vw] h-[65vh] rounded-full blur-[50px] sm:blur-[80px] pointer-events-none transition-colors duration-500 will-change-transform nebula-drift-1 motion-reduce:!animate-none"
          style={{
            background:
              "radial-gradient(circle at 60% 30%, rgba(56, 189, 248, 0.08) 0%, rgba(14, 165, 233, 0.02) 50%, transparent 75%)",
          }}
        />

        {/* Subtle Twilight Violet Lower Horizon */}
        <div
          className="absolute top-[40%] -left-[10%] w-[95vw] sm:w-[70vw] h-[75vh] rounded-full blur-[50px] sm:blur-[80px] pointer-events-none transition-colors duration-500 will-change-transform nebula-drift-2 motion-reduce:!animate-none"
          style={{
            background:
              "radial-gradient(circle at 35% 65%, rgba(124, 58, 237, 0.06) 0%, rgba(99, 102, 241, 0.02) 50%, transparent 75%)",
          }}
        />

        {/* Soft Technical Observatory Blue Core */}
        <div
          className="absolute top-[15%] left-[20%] w-[60vw] h-[60vh] rounded-full blur-[60px] pointer-events-none transition-colors duration-500 will-change-transform nebula-pulse motion-reduce:!animate-none"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.04) 0%, transparent 70%)",
          }}
        />
      </div>
    </div>
  );
}
