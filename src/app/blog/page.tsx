import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { BlogList } from "@/components/blog/BlogList";
import { BookOpen, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Engineering Logs & Articles | Shishir Dev — Backend & Systems Developer",
  description:
    "Technical writings on backend systems, network protocols, Linux performance, and algorithms by Shishir Dev.",
  openGraph: {
    title: "Engineering Logs // Shishir Dev",
    description: "Deep dives into Linux internals, backend architecture, network programming, and algorithms.",
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      {/* Header */}
      <div className="pb-10 border-b border-border/40 space-y-4">
        <div className="flex items-center space-x-2 text-accent font-mono text-xs uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Engineering Logs // Systems &amp; Backend Articles</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-200 to-indigo-300">
          Engineering Logs &amp; Articles
        </h1>

        <p className="text-muted text-lg max-w-3xl leading-relaxed">
          Technical explorations into Linux systems programming, network protocol design, high-performance backend architecture, and algorithmic problem solving.
        </p>

        <div className="pt-2 flex flex-wrap gap-6 font-mono text-xs text-muted">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span>PUBLISHED ESSAYS: <strong className="text-foreground font-semibold">{posts.length}</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>FORMAT: <span className="text-foreground font-semibold">MDX DYNAMIC PIPELINE</span></span>
          </div>
        </div>
      </div>

      {/* Blog List Grid */}
      <div className="pt-12">
        <BlogList posts={posts} showFilters={true} />
      </div>
    </div>
  );
}
