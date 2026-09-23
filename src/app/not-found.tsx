import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="max-w-md space-y-6">
        {/* Error Callsign Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 font-mono text-xs text-accent">
          <AlertTriangle className="w-4 h-4" />
          <span>TRAJECTORY DEVIATION // CODE 404</span>
        </div>

        {/* 404 Big Heading */}
        <h1 className="text-6xl sm:text-7xl font-extrabold font-mono tracking-tighter text-foreground">
          404
        </h1>

        <h2 className="text-xl font-bold text-foreground">
          Coordinates Lost in Deep Space
        </h2>

        <p className="text-muted text-sm leading-relaxed">
          The requested celestial waypoint or orbital document does not exist in this sector of the mission database. Return to the primary command center to recalculate trajectory.
        </p>

        {/* Return Button */}
        <div className="pt-4 flex justify-center">
          <Link href="/">
            <Button variant="primary" className="space-x-2 font-mono text-xs">
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Mission Launchpad</span>
            </Button>
          </Link>
        </div>

        {/* Footer telemetry */}
        <div className="pt-8 border-t border-border/40 font-mono text-[11px] text-muted/60">
          STATION: Durgapur Telemetry Ground Station // SD-01
        </div>
      </div>
    </div>
  );
}
