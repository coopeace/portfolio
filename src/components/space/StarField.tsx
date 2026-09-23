import React from "react";

export interface StarFieldProps {
  className?: string;
  mobileCount?: number; // Clamped within 30-50
  desktopCount?: number; // Clamped within 80-120
}

interface StarDescriptor {
  id: number;
  top: string;
  left: string;
  size: number;
  duration: string;
  delay: string;
  isDesktopOnly: boolean;
  colorType: "white" | "cyan" | "violet";
}

// Configured thresholds matching tests/e2e/config.mjs
export const STAR_THRESHOLDS = {
  mobileMin: 30,
  mobileMax: 50,
  desktopMin: 80,
  desktopMax: 120,
} as const;

export const DEFAULT_MOBILE_STAR_COUNT = 40;
export const DEFAULT_DESKTOP_STAR_COUNT = 100;

// Deterministic Mulberry32 PRNG to eliminate SSR/CSR hydration mismatches
function createDeterministicRandom(seed: number) {
  let s = seed;
  return function () {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Statically generate bounded pool of 100 stars (strictly < 200 elements)
const STATIC_STARS: StarDescriptor[] = (() => {
  const rng = createDeterministicRandom(1997);
  const stars: StarDescriptor[] = [];

  for (let i = 0; i < DEFAULT_DESKTOP_STAR_COUNT; i++) {
    const top = `${(rng() * 98 + 1).toFixed(2)}%`;
    const left = `${(rng() * 98 + 1).toFixed(2)}%`;

    // Vary sizes: majority 1-1.5px, some 2px, rare 2.2px
    const sizeRoll = rng();
    const size = sizeRoll < 0.65 ? 1 : sizeRoll < 0.9 ? 1.5 : 2.2;

    // Twinkle durations between 2.5s and 5.5s
    const duration = `${(rng() * 3 + 2.5).toFixed(1)}s`;
    const delay = `${(rng() * 4).toFixed(1)}s`;

    // Color distribution
    const colorRoll = rng();
    const colorType = colorRoll < 0.7 ? "white" : colorRoll < 0.88 ? "cyan" : "violet";

    // First 40 stars visible on both mobile and desktop; next 60 desktop only
    const isDesktopOnly = i >= DEFAULT_MOBILE_STAR_COUNT;

    stars.push({
      id: i,
      top,
      left,
      size,
      duration,
      delay,
      isDesktopOnly,
      colorType,
    });
  }

  return stars;
})();

export function StarField({
  className = "",
  mobileCount = DEFAULT_MOBILE_STAR_COUNT,
  desktopCount = DEFAULT_DESKTOP_STAR_COUNT,
}: StarFieldProps) {
  // Clamp counts within configured budget bounds
  const clampedMobile = Math.min(
    Math.max(mobileCount, STAR_THRESHOLDS.mobileMin),
    STAR_THRESHOLDS.mobileMax
  );
  const clampedDesktop = Math.min(
    Math.max(desktopCount, STAR_THRESHOLDS.desktopMin),
    STAR_THRESHOLDS.desktopMax
  );

  // Filter stars according to clamped budget without creating unbounded arrays
  const activeStars = STATIC_STARS.slice(0, clampedDesktop);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-700 ease-in-out dark:opacity-100 opacity-20 ${className}`}
      aria-hidden="true"
    >
      <style>{`
        @keyframes starDriftSlow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-14px) translateX(8px); }
        }
        @keyframes starDriftAlt {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(12px) translateX(-10px); }
        }
        .star-drift-slow {
          animation: starDriftSlow 18s ease-in-out infinite alternate;
        }
        .star-drift-alt {
          animation: starDriftAlt 14s ease-in-out infinite alternate;
        }
        @media (prefers-reduced-motion: reduce) {
          .star-drift-slow,
          .star-drift-alt {
            animation: none !important;
          }
        }
      `}</style>

      {/* Parallax Drift Sub-Layer 1: Slow Drift */}
      <div className="absolute inset-0 star-drift-slow motion-reduce:!animate-none">
        {activeStars.slice(0, Math.floor(clampedDesktop * 0.5)).map((star) => {
          const isMobileStar = star.id < clampedMobile;
          return (
            <span
              key={`drift1-${star.id}`}
              className={`absolute rounded-full pointer-events-none ${
                isMobileStar ? "block" : "hidden md:block"
              } ${
                star.colorType === "cyan"
                  ? "bg-accent dark:bg-accent shadow-[0_0_3px_rgba(56,189,248,0.8)]"
                  : star.colorType === "violet"
                  ? "bg-accent-secondary dark:bg-accent-secondary shadow-[0_0_3px_rgba(129,140,248,0.7)]"
                  : "bg-muted dark:bg-white shadow-[0_0_2px_rgba(255,255,255,0.7)]"
              } motion-safe:animate-star-pulse motion-reduce:!animate-none`}
              style={{
                top: star.top,
                left: star.left,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDuration: star.duration,
                animationDelay: star.delay,
              }}
            />
          );
        })}
      </div>

      {/* Parallax Drift Sub-Layer 2: Alternate Drift */}
      <div className="absolute inset-0 star-drift-alt motion-reduce:!animate-none">
        {activeStars.slice(Math.floor(clampedDesktop * 0.5)).map((star) => {
          const isMobileStar = star.id < clampedMobile;
          return (
            <span
              key={`drift2-${star.id}`}
              className={`absolute rounded-full pointer-events-none ${
                isMobileStar ? "block" : "hidden md:block"
              } ${
                star.colorType === "cyan"
                  ? "bg-accent dark:bg-accent shadow-[0_0_3px_rgba(56,189,248,0.8)]"
                  : star.colorType === "violet"
                  ? "bg-accent-secondary dark:bg-accent-secondary shadow-[0_0_3px_rgba(129,140,248,0.7)]"
                  : "bg-muted dark:bg-white shadow-[0_0_2px_rgba(255,255,255,0.7)]"
              } motion-safe:animate-star-pulse motion-reduce:!animate-none`}
              style={{
                top: star.top,
                left: star.left,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDuration: star.duration,
                animationDelay: star.delay,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
