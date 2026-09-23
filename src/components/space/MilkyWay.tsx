import React from "react";

export interface MilkyWayProps {
  className?: string;
  opacity?: number;
}

export function MilkyWay({
  className = "",
  opacity = 0.22,
}: MilkyWayProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      <style>{`
        @keyframes photoGalacticDrift {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.015);
          }
        }
        .milky-way-photo-layer {
          animation: photoGalacticDrift 45s ease-in-out infinite alternate;
        }
        @media (prefers-reduced-motion: reduce) {
          .milky-way-photo-layer {
            animation: none !important;
          }
        }
      `}</style>

      {/* Dark Mode: High-Resolution Photorealistic Milky Way Cool HD */}
      <div className="hidden dark:block absolute inset-0">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 milky-way-photo-layer pointer-events-none will-change-transform motion-reduce:!animate-none"
            style={{
              backgroundImage: "url('/images/space/milky-way-cool-hd.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
              opacity: opacity,
              mixBlendMode: "screen",
              maskImage:
                "radial-gradient(ellipse 95% 85% at 50% 50%, black 50%, transparent 95%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 95% 85% at 50% 50%, black 50%, transparent 95%)",
              filter: "contrast(1.35) brightness(1.1) saturate(1.2)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
