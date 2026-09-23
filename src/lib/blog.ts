import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogPostFrontmatter {
  title: string;
  description: string;
  date: string;
  category: "Motion" | "Generative Art" | "Engineering" | "Algorithms" | "Systems" | "Networking" | "Backend" | "Linux";
  tags: string[];
  readTime?: string;
  featured?: boolean;
}

export interface BlogPost extends BlogPostFrontmatter {
  slug: string;
  content: string;
}

/**
 * Get all blog posts sorted by date descending.
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR);
  const mdxFiles = files.filter(
    (file) =>
      (file.endsWith(".mdx") || file.endsWith(".md")) &&
      !file.startsWith("_") &&
      !file.startsWith(".")
  );

  const posts: BlogPost[] = mdxFiles.map((file) => {
    const slug = file.replace(/\.mdx?$/, "");
    const filePath = path.join(BLOG_DIR, file);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title || slug,
      description: data.description || "",
      date: data.date || "2026-09-18",
      category: data.category || "Systems",
      tags: data.tags || [],
      readTime: data.readTime || "5 min read",
      featured: Boolean(data.featured),
      content,
    };
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get a single blog post by its slug.
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const allPosts = await getAllPosts();
  const post = allPosts.find((p) => p.slug === slug);
  return post || null;
}

/**
 * Get featured blog posts for the homepage.
 */
export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  const featured = posts.filter((p) => p.featured);
  return featured.length > 0 ? featured : posts.slice(0, 2);
}
