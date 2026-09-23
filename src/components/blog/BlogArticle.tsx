import * as React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { BlogPost } from "@/lib/blog";
import { Calendar, Clock, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface BlogArticleProps {
  post: BlogPost;
}

const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-8 mb-4 border-b border-border/40 pb-2" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-8 mb-3" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-xl sm:text-2xl font-semibold text-foreground mt-6 mb-2" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-base text-foreground/90 leading-relaxed my-4" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside space-y-1.5 my-4 text-foreground/90 pl-2" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside space-y-1.5 my-4 text-foreground/90 pl-2" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-base text-foreground/90" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-4 border-accent/60 pl-4 py-1 my-6 italic text-muted bg-surface-elevated/40 rounded-r" {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-left text-sm font-mono border-collapse border border-border" {...props} />
    </div>
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="bg-surface-elevated p-3 border border-border text-foreground font-semibold" {...props} />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="p-3 border border-border text-foreground/90" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    // Check if inline code
    const isInline = !props.className?.includes("hljs") && !props.className?.includes("language-");
    if (isInline) {
      return (
        <code
          className="px-1.5 py-0.5 rounded bg-surface-elevated text-accent font-mono text-xs border border-border/60"
          {...props}
        />
      );
    }
    return <code {...props} />;
  },
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <div className="relative my-6 rounded-lg overflow-hidden border border-border bg-[#050816] text-[#E2E8F0]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-surface-elevated/40 font-mono text-xs text-muted">
        <div className="flex items-center space-x-1.5">
          <Terminal className="w-3.5 h-3.5 text-accent" />
          <span>CODE ENGINE</span>
        </div>
      </div>
      <pre className="p-4 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed" {...props} />
    </div>
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-8 border-border/40" {...props} />
  ),
};

export function BlogArticle({ post }: BlogArticleProps) {
  return (
    <article className="max-w-4xl mx-auto">
      {/* Header Info */}
      <header className="pb-8 border-b border-border/40 space-y-4">
        <div className="flex items-center space-x-3 font-mono text-xs text-muted">
          <span className="text-accent font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-accent/10 border border-accent/30">
            {post.category}
          </span>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5" />
            <time dateTime={post.date}>{post.date}</time>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readTime}</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
          {post.title}
        </h1>

        <p className="text-lg sm:text-xl text-muted leading-relaxed pt-1">
          {post.description}
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="tech" tech={post.category} size="sm">
              #{tag}
            </Badge>
          ))}
        </div>
      </header>

      {/* Rendered MDX Content */}
      <div className="prose prose-invert max-w-none pt-8">
        <MDXRemote
          source={post.content}
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeHighlight],
            },
          }}
        />
      </div>
    </article>
  );
}
