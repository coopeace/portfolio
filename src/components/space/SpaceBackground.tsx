"use client";

import React from "react";
import { StarField } from "./StarField";
import { NebulaLayer } from "./NebulaLayer";
import { MilkyWay } from "./MilkyWay";
import { ShootingStars } from "./ShootingStars";
import { OrbitalLayer } from "./OrbitalLayer";
import { PlanetLayer } from "./PlanetLayer";
import dynamic from "next/dynamic";

const InteractiveArtCanvas = dynamic(
  () =>
    import("@/components/art/InteractiveArtCanvas").then(
      (mod) => mod.InteractiveArtCanvas
    ),
  { ssr: false }
);

export interface SpaceBackgroundProps {
  className?: string;
  mobileStarCount?: number;
  desktopStarCount?: number;
}

export function SpaceBackground({
  className = "",
  mobileStarCount,
  desktopStarCount,
}: SpaceBackgroundProps) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* Interactive Generative Canvas & Constellation Physics */}
      <InteractiveArtCanvas particleCount={desktopStarCount ?? 65} />

      {/* 1. Nebula gradient mesh (deepest atmospheric layer) */}
      <NebulaLayer />

      {/* 2. Realistic Milky Way galactic core stardust band & dusk crepuscular glow */}
      <MilkyWay />

      {/* 3. Streaking shooting stars / meteors */}
      <ShootingStars />

      {/* 4. Concentric telemetry orbital tracks */}
      <OrbitalLayer />

      {/* 5. Subtle parallax planet in periphery */}
      <PlanetLayer />

      {/* 6. Twinkling & drifting star field */}
      <StarField
        mobileCount={mobileStarCount}
        desktopCount={desktopStarCount}
      />
    </div>
  );
}
