import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { isAuthenticatedStudioRequest } from "@/lib/studio-auth";

export async function POST(request: Request) {
  const isAuth = await isAuthenticatedStudioRequest(request);
  if (!isAuth) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Mission clearance code required." },
      { status: 401 }
    );
  }
  try {
    const data = await request.json();
    const {
      title,
      slug,
      description,
      category = "Systems",
      tags = [],
      readTime = "5 min read",
      featured = false,
      content = "",
    } = data;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { success: false, message: "Title, slug, and content are required." },
        { status: 400 }
      );
    }

    // Sanitize slug
    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-");

    const today = new Date().toISOString().split("T")[0];

    // Format YAML frontmatter
    const tagsYaml = Array.isArray(tags)
      ? tags.map((t: string) => `  - ${t.trim()}`).join("\n")
      : `  - ${category}`;

    const mdxContent = `---
title: "${title.replace(/"/g, '\\"')}"
description: "${description.replace(/"/g, '\\"')}"
date: "${today}"
category: "${category}"
tags:
${tagsYaml}
readTime: "${readTime}"
featured: ${Boolean(featured)}
---

${content.trim()}
`;

    const blogDir = path.join(process.cwd(), "content", "blog");
    if (!fs.existsSync(blogDir)) {
      fs.mkdirSync(blogDir, { recursive: true });
    }

    const filePath = path.join(blogDir, `${cleanSlug}.mdx`);
    fs.writeFileSync(filePath, mdxContent, "utf8");

    return NextResponse.json({
      success: true,
      message: `Article '${title}' published successfully!`,
      slug: cleanSlug,
      url: `/blog/${cleanSlug}`,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to publish blog post";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
