"use client";

import * as React from "react";
import type { Project, ProjectCategory } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { playClickSound, playHoverSound } from "@/lib/audio";
import { cn } from "@/lib/utils";

export interface ProjectGridProps {
  projects: Project[];
  showFilters?: boolean;
  className?: string;
}

type CategoryFilter = "All" | ProjectCategory;

export function ProjectGrid({
  projects,
  showFilters = true,
  className,
}: ProjectGridProps) {
  const [activeCategory, setActiveCategory] = React.useState<CategoryFilter>("All");

  const categories: CategoryFilter[] = [
    "All",
    "Systems",
    "Backend",
    "Networking",
    "Tools",
  ];

  const filteredProjects = React.useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

  return (
    <div className={cn("space-y-8", className)}>
      {/* Category Filter Tabs */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-2 pb-2">
          {categories.map((category) => {
            const isSelected = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveCategory(category);
                }}
                onMouseEnter={playHoverSound}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg font-mono text-xs font-medium transition-all",
                  isSelected
                    ? "bg-accent text-white shadow-[0_0_12px_rgb(var(--accent-rgb)/0.3)]"
                    : "bg-surface-elevated text-muted hover:text-foreground border border-border/60 hover:border-border"
                )}
                aria-pressed={isSelected}
              >
                {category}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="p-12 text-center rounded-panel border border-border bg-surface text-muted font-mono text-sm">
          No missions found matching the selected subsystem filter.
        </div>
      )}
    </div>
  );
}
