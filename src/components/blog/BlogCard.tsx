import * as React from "react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import type { BlogPost } from "@/lib/blog";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

export function BlogCard({ post, className }: BlogCardProps) {
  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between p-6 rounded-panel border border-border bg-surface hover:border-accent/40 transition-all duration-300 shadow-sm hover:shadow-md",
        className
      )}
    >
      <div>
        {/* Category & Read Time */}
        <div className="flex items-center justify-between pb-3 border-b border-border/40 font-mono text-xs text-muted">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-3.5 h-3.5 text-accent" />
            <span className="text-accent font-semibold uppercase tracking-wider">
              {post.category}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-foreground mt-4 group-hover:text-accent transition-colors">
          <Link href={`/blog/${post.slug}`} className="focus:outline-none focus:underline">
            {post.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-muted text-sm mt-2.5 leading-relaxed line-clamp-3">
          {post.description}
        </p>

        {/* Tags - Unified Highlight Color Per Blog Card */}
        <div className="flex flex-wrap gap-1.5 mt-5">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="tech" tech={post.category} size="sm">
              #{tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-6 mt-6 border-t border-border/40 flex items-center justify-between font-mono text-xs text-muted">
        <div className="flex items-center space-x-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <time dateTime={post.date}>{post.date}</time>
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center space-x-1 text-foreground hover:text-accent font-medium transition-colors"
        >
          <span>Read Log</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
