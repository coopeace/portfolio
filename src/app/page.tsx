import { Hero } from "@/components/hero/Hero";
import { AchievementDashboard } from "@/components/achievements/AchievementDashboard";
import { AboutPreview } from "@/components/about/AboutPreview";
import { getFeaturedProjects } from "@/data/projects";
import { getFeaturedPosts } from "@/lib/blog";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { BlogCard } from "@/components/blog/BlogCard";
import { Terminal, BookOpen, ArrowRight, Radio, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function HomePage() {
  const featuredProjects = getFeaturedProjects();
  const featuredPosts = await getFeaturedPosts();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Systems Developer Hero with Centered Layout & Terminal */}
      <Hero />

      {/* 2. Algorithmic Problem Solving & Achievement Telemetry */}
      <AchievementDashboard />

      {/* 3. About Preview, Systems Profile & Philosophy */}
      <AboutPreview />

      {/* 4. Target Anchor Section: Featured Engineering Missions */}
      <section
        id="projects"
        aria-label="Engineering Projects Dossier"
        className="scroll-mt-20 py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-border/40"
      >
        <div className="flex flex-col space-y-4 pb-8 border-b border-border/40">
          <div className="flex items-center space-x-2 text-accent font-mono text-xs uppercase tracking-wider">
            <Terminal className="w-4 h-4" />
            <span>Telemetry Mission Log // Featured Engineering</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-300">
                Featured Missions &amp; Projects
              </h2>
              <p className="text-muted text-base sm:text-lg max-w-2xl mt-1">
                High-performance backend systems, storage engines, and Linux networking tools.
              </p>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center space-x-1.5 font-mono text-sm text-accent hover:text-accent-secondary transition-colors"
            >
              <span>View Full Dossier</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Featured Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10 text-left">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      {/* 5. Latest Mission Logs & Technical Articles */}
      <section
        id="blog-preview"
        aria-label="Latest Technical Articles & Mission Logs"
        className="scroll-mt-20 py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-border/40"
      >
        <div className="flex flex-col space-y-4 pb-8 border-b border-border/40">
          <div className="flex items-center space-x-2 text-accent font-mono text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Technical Dispatches // Recent Research</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-300">
                Latest Mission Logs
              </h2>
              <p className="text-muted text-base sm:text-lg max-w-2xl mt-1">
                Deep dives into algorithms, Linux terminal mechanics, network sockets, and motion physics.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center space-x-1.5 font-mono text-sm text-accent hover:text-accent-secondary transition-colors"
            >
              <span>View All Logs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Blog Post Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 text-left">
          {featuredPosts.slice(0, 4).map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* 6. Contact Transmission CTA */}
      <section
        id="contact-cta"
        aria-label="Contact and Communications Uplink"
        className="scroll-mt-20 py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-t border-border/40"
      >
        <div className="p-8 sm:p-12 rounded-panel border border-border bg-surface/90 backdrop-blur-md text-center space-y-6 relative overflow-hidden shadow-xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 font-mono text-xs text-accent">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>GROUND STATION DURGAPUR // COMMUNICATIONS UPLINK</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-300 max-w-xl mx-auto">
            Ready to Collaborate on Systems &amp; Backend Engineering?
          </h2>

          <p className="text-muted text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Have a project, systems challenge, or technical inquiry? Open a transmission channel to connect.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button variant="primary" className="space-x-2 font-mono text-xs">
                <Mail className="w-4 h-4" />
                <span>Initiate Transmission</span>
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="secondary" className="space-x-2 font-mono text-xs">
                <Terminal className="w-4 h-4" />
                <span>Review Projects</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
