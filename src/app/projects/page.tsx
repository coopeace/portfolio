import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { Badge } from "@/components/ui/Badge";
import { Terminal, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Engineering Missions & Projects | Shishir Dev",
  description:
    "Explore engineering projects, system tools, Linux network packet analyzers, and storage engines built by Shishir Dev.",
  openGraph: {
    title: "Engineering Projects // Shishir Dev",
    description: "Systems, backend architectures, networking tools, and algorithms.",
  },
};

export default function ProjectsPage() {
  return (
    <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Page Header */}
      <div className="pb-10 border-b border-border/40 space-y-4">
        <div className="flex items-center space-x-2 text-accent font-mono text-xs uppercase tracking-wider">
          <Terminal className="w-4 h-4" />
          <span>Mission Catalog // Projects &amp; Systems</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-300">
          Engineering Projects
        </h1>

        <p className="text-muted text-lg max-w-3xl leading-relaxed">
          A curated catalog of systems programming, backend services, networking tools, and algorithmic benchmarks. Each mission reflects first-principles exploration and rigorous implementation.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-6 font-mono text-xs text-muted">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span>TOTAL MISSIONS: <strong className="text-foreground font-semibold">{projects.length}</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-accent" />
            <span>DOMAINS:</span>
            <div className="flex flex-wrap gap-1.5">
              {["Linux", "Networking", "Backend", "Tools"].map((domain) => (
                <Badge key={domain} variant="tech" tech={domain} size="sm">
                  {domain}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="pt-12">
        <ProjectGrid projects={projects} showFilters={true} />
      </div>
    </div>
  );
}
