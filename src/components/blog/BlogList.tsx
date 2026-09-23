"use client";

import * as React from "react";
import type { BlogPost } from "@/lib/blog";
import { BlogCard } from "./BlogCard";
import { cn } from "@/lib/utils";

export interface BlogListProps {
  posts: BlogPost[];
  showFilters?: boolean;
  className?: string;
}

export function BlogList({ posts, showFilters = true, className }: BlogListProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

  const categories = React.useMemo(() => {
    const cats = Array.from(new Set(posts.map((p) => p.category)));
    return ["All", ...cats];
  }, [posts]);

  const filteredPosts = React.useMemo(() => {
    if (selectedCategory === "All") return posts;
    return posts.filter((p) => p.category === selectedCategory);
  }, [posts, selectedCategory]);

  return (
    <div className={cn("space-y-8", className)}>
      {showFilters && categories.length > 2 && (
        <div className="flex flex-wrap items-center gap-2 pb-2">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg font-mono text-xs font-medium transition-all",
                  isSelected
                    ? "bg-accent text-accent-foreground shadow-sm"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="p-12 text-center rounded-panel border border-border bg-surface text-muted font-mono text-sm">
          No engineering logs found matching the selected category filter.
        </div>
      )}
    </div>
  );
}
