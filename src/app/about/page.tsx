import type { Metadata } from "next";
import { profile } from "@/data/profile";
import { socialLinks } from "@/data/social";
import { Badge } from "@/components/ui/Badge";
import { PhilosophyCard } from "@/components/about/PhilosophyCard";
import { OrbitalLogTimeline } from "@/components/about/OrbitalLogTimeline";
import { getAboutContent } from "@/lib/about";
import {
  Compass,
  Radio,
  Terminal,
  Cpu,
  Github,
  Linkedin,
  Mail,
  User,
  GraduationCap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Shishir Dev | Systems & Backend Exploration",
  description:
    "Learn about Shishir Dev's engineering journey, systems philosophy, Linux internals focus, and technical values.",
  openGraph: {
    title: "About Shishir Dev // Flight Records",
    description: "Backend engineer and systems enthusiast based in Durgapur, India.",
  },
};

export default function AboutPage() {
  const about = getAboutContent();

  return (
    <div className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-16">
      {/* Page Header */}
      <header className="pb-10 border-b border-border/40 space-y-4">
        <div className="flex items-center space-x-2 text-accent font-mono text-xs uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>{about.frontmatter.dossierStream || "Personnel Dossier // Flight Log SD-01"}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-300">
          About {profile.name}
        </h1>

        <p className="text-xl font-mono text-accent font-semibold">
          {about.frontmatter.role || profile.role}
        </p>

        <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-muted pt-2">
          <div className="flex items-center space-x-1.5">
            <Radio className="w-4 h-4 text-success animate-pulse" />
            <span>Status: <strong className="text-foreground">{about.frontmatter.status || profile.status}</strong></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <GraduationCap className="w-4 h-4 text-accent" />
            <span>Academic Base: <strong className="text-foreground">{about.frontmatter.academicBase || "BCA · MMMC (KNU)"}</strong></span>
          </div>
        </div>
      </header>

      {/* Main Narrative & Profile Image Area */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
        {/* Left 2 Cols: Detailed Bio from content/about.md */}
        <div className="md:col-span-2 space-y-6 text-foreground/90 leading-relaxed text-base">
          <h2 className="text-2xl font-bold font-mono text-foreground flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-accent" />
            <span>{about.frontmatter.heading || "Engineering Journey"}</span>
          </h2>

          {about.paragraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {/* Right 1 Col: Reserved Profile Card */}
        <div className="space-y-4 p-6 rounded-panel border border-border bg-surface/80 backdrop-blur-md text-center flex flex-col items-center justify-center shadow-lg">
          <div
            className="w-44 h-44 rounded-full border-2 border-dashed border-accent/60 bg-surface-elevated flex flex-col items-center justify-center p-4 text-center group hover:border-accent transition-colors"
            aria-label="Profile representation area"
          >
            <User className="w-12 h-12 text-muted/60 mb-2 group-hover:text-accent transition-colors" />
            <span className="font-mono text-[11px] text-muted uppercase tracking-wider">
              Profile Image
            </span>
            <span className="font-mono text-[10px] text-muted/60 mt-1">
              public/images/profile/
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-foreground">{profile.name}</h3>
            <p className="font-mono text-xs text-muted">STATION OPERATOR</p>
            <p className="font-mono text-[11px] text-accent">BCA Student · Systems Enthusiast</p>
          </div>

          {/* Direct Social Links */}
          <div className="pt-3 border-t border-border/40 w-full flex items-center justify-center space-x-3">
            {socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="p-2 rounded-lg text-muted hover:text-accent hover:bg-surface-elevated transition-colors"
              >
                {link.platform === "GitHub" && <Github className="w-4 h-4" />}
                {link.platform === "LinkedIn" && <Linkedin className="w-4 h-4" />}
                {link.platform === "Email" && <Mail className="w-4 h-4" />}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Foundation & Institutional Affiliation */}
      <section className="space-y-4 p-6 sm:p-8 rounded-panel border border-border bg-surface/80 backdrop-blur-md shadow-lg">
        <div className="flex items-center space-x-2 text-accent font-mono text-xs uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          <span>Academic Foundation // Curriculum &amp; Systems Base</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold font-mono text-foreground">
              Bachelor of Computer Applications (BCA)
            </h3>
            <p className="text-sm text-muted">
              Michael Madhusudan Memorial College · Affiliated with Kazi Nazrul University
            </p>
          </div>
          <div className="font-mono text-xs text-accent px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/30 w-fit">
            Theoretical Grounding + First-Principles Systems Exploration
          </div>
        </div>
      </section>

      {/* Primary Technical Focus Areas */}
      <section className="space-y-6 pt-8 border-t border-border/40">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold font-mono text-foreground flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-accent" />
            <span>Technical Proficiencies &amp; Exploration Vectors</span>
          </h2>
          <p className="text-muted text-sm">
            Core capabilities and engineering disciplines under continuous study.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {profile.focusAreas.map((area) => (
            <Badge key={area} variant="tech" tech={area} className="font-mono text-sm py-1.5 px-3.5">
              {area}
            </Badge>
          ))}
        </div>
      </section>

      {/* Engineering Philosophy Cards */}
      <section className="space-y-6 pt-8 border-t border-border/40">
        <h2 className="text-2xl font-bold font-mono text-foreground">
          Core Operating Tenets
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {profile.philosophies.map((item) => (
            <PhilosophyCard
              key={item.title}
              title={item.title}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </div>
      </section>

      {/* Orbital Log: Interactive Learning Journey Timeline */}
      <OrbitalLogTimeline />
    </div>
  );
}
