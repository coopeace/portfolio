import Link from "next/link";
import { Github, ExternalLink, ArrowRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const categoryUpper = project.category.toUpperCase();
  const categoryColorClass =
    categoryUpper.includes("SYSTEM")
      ? "text-sky-300 border-sky-500/30 bg-sky-500/10"
      : categoryUpper.includes("BACKEND")
      ? "text-blue-300 border-blue-500/30 bg-blue-500/10"
      : categoryUpper.includes("NETWORK")
      ? "text-violet-300 border-violet-500/30 bg-violet-500/10"
      : "text-emerald-300 border-emerald-500/30 bg-emerald-500/10";

  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between p-6 sm:p-7 rounded-panel border border-border bg-surface/90 backdrop-blur-md hover:border-accent/60 hover:shadow-[0_0_30px_rgb(var(--accent-rgb)/0.18)] transition-all duration-300 shadow-md",
        className
      )}
    >
      <div>
        {/* Card Header: Mission Callsign and Category */}
        <div className="flex items-center justify-between pb-3 border-b border-border/40 font-mono text-xs">
          <span className="text-accent font-bold tracking-wider">
            {project.missionNumber}
          </span>
          <span className={cn("uppercase tracking-wider px-2 py-0.5 rounded font-semibold border text-[11px]", categoryColorClass)}>
            {project.category}
          </span>
        </div>

        {/* Project Name and Tagline */}
        <h3 className="text-xl sm:text-2xl font-bold text-foreground mt-4 group-hover:text-accent transition-colors">
          <Link href={`/projects/${project.slug}`} className="focus:outline-none focus:underline">
            {project.name}
          </Link>
        </h3>

        <p className="font-mono text-xs text-muted mt-1 font-medium">
          {project.tagline}
        </p>

        {/* Description */}
        <p className="text-muted text-sm mt-3 leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-1.5 mt-5">
          {project.technologies.map((tech) => (
            <Badge
              key={tech}
              variant="tech"
              tech={project.category}
              size="sm"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {/* Footer Navigation & Links */}
      <div className="pt-6 mt-6 border-t border-border/40 flex items-center justify-between font-mono text-xs">
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center space-x-1 text-foreground hover:text-accent font-medium transition-colors"
        >
          <span>Dossier Specs</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>

        <div className="flex items-center space-x-3">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.name} source code on GitHub`}
              className="text-muted hover:text-foreground transition-colors p-1"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.name} live deployment`}
              className="text-muted hover:text-foreground transition-colors p-1"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
