import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { projects, getProjectBySlug } from "@/data/projects";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Terminal,
  Cpu,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Mission Not Found | Shishir Dev",
    };
  }

  return {
    title: `${project.name} // Technical Dossier | Shishir Dev`,
    description: project.description,
    openGraph: {
      title: `${project.name} - Systems Engineering Project`,
      description: project.tagline,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Back Button */}
      <div className="pb-8">
        <Link
          href="/projects"
          className="inline-flex items-center space-x-2 font-mono text-xs text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Mission Catalog</span>
        </Link>
      </div>

      {/* Header Dossier */}
      <header className="pb-10 border-b border-border/40 space-y-4">
        <div className="flex items-center space-x-3 font-mono text-xs">
          <span className="text-accent font-bold px-2.5 py-0.5 rounded bg-accent/10 border border-accent/30">
            {project.missionNumber}
          </span>
          <span className="text-muted uppercase tracking-wider">
            Subsystem: {project.category}
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          {project.name}
        </h1>

        <p className="text-xl font-mono text-accent">
          {project.tagline}
        </p>

        <p className="text-muted text-base sm:text-lg leading-relaxed pt-2">
          {project.description}
        </p>

        {/* Links and Actions */}
        <div className="pt-4 flex flex-wrap items-center gap-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-surface border border-border hover:border-accent text-foreground font-mono text-xs font-semibold shadow-sm transition-all"
            >
              <Github className="w-4 h-4" />
              <span>Source Repository</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-accent text-white font-mono text-xs font-semibold shadow-[0_0_15px_rgb(var(--accent-rgb)/0.25)] hover:bg-accent/90 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Deployment</span>
            </a>
          )}
        </div>
      </header>

      {/* Main Technical Breakdown */}
      <div className="py-12 space-y-12">
        {/* Architecture Specifications */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-mono text-foreground flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-accent" />
            <span>Telemetry &amp; Specification Parameters</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-surface border border-border font-mono text-xs space-y-1">
              <span className="text-muted uppercase text-[11px]">Runtime Environment</span>
              <p className="text-foreground font-semibold">{project.specs.runtime}</p>
            </div>
            <div className="p-4 rounded-lg bg-surface border border-border font-mono text-xs space-y-1">
              <span className="text-muted uppercase text-[11px]">Protocol / Data Format</span>
              <p className="text-foreground font-semibold">{project.specs.protocolOrFormat}</p>
            </div>
            <div className="p-4 rounded-lg bg-surface border border-border font-mono text-xs space-y-1">
              <span className="text-muted uppercase text-[11px]">Architecture Pattern</span>
              <p className="text-foreground font-semibold">{project.specs.architectureType}</p>
            </div>
            <div className="p-4 rounded-lg bg-surface border border-border font-mono text-xs space-y-1">
              <span className="text-muted uppercase text-[11px]">Verification Strategy</span>
              <p className="text-foreground font-semibold">{project.specs.testingStrategy}</p>
            </div>
          </div>
        </section>

        {/* Architecture Highlights */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-mono text-foreground flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-accent" />
            <span>Architecture &amp; Design Highlights</span>
          </h2>

          <div className="space-y-3">
            {project.architectureHighlights.map((highlight, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-4 rounded-lg bg-surface border border-border"
              >
                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground leading-relaxed">{highlight}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Engineering Challenges */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold font-mono text-foreground flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-accent" />
            <span>Engineering Challenges &amp; Solutions</span>
          </h2>

          <div className="space-y-3">
            {project.keyChallenges.map((challenge, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-surface border border-border/80 text-sm text-muted leading-relaxed"
              >
                {challenge}
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack Pills */}
        <section className="space-y-4 pt-4 border-t border-border/40">
          <h2 className="text-sm font-mono uppercase text-muted tracking-wider">
            Verified Technologies
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="tech" tech={project.category} size="md">
                {tech}
              </Badge>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
