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
    const projectData = await request.json();
    const { name, slug, tagline, description, category, technologies } = projectData;

    if (!name || !slug || !description) {
      return NextResponse.json(
        { success: false, message: "Project name, slug, and description are required." },
        { status: 400 }
      );
    }

    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-");

    const projectsFilePath = path.join(process.cwd(), "src", "data", "projects.json");
    let currentProjects = [];
    if (fs.existsSync(projectsFilePath)) {
      currentProjects = JSON.parse(fs.readFileSync(projectsFilePath, "utf8"));
    }

    // Determine next mission number
    const missionNumber =
      projectData.missionNumber ||
      `MSN-${String(currentProjects.length + 1).padStart(2, "0")}`;

    const sanitizeUrl = (url: unknown): string | undefined => {
      if (typeof url !== "string") return undefined;
      const trimmed = url.trim();
      if (!trimmed || trimmed.toLowerCase().startsWith("file:") || trimmed.toLowerCase().startsWith("javascript:")) {
        return undefined;
      }
      return trimmed;
    };

    const newProject = {
      slug: cleanSlug,
      name,
      tagline: tagline || `${name} Systems Exploration`,
      description,
      category: category || "Systems",
      technologies: Array.isArray(technologies)
        ? technologies
        : (technologies || "Python, Linux").split(",").map((s: string) => s.trim()),
      github: sanitizeUrl(projectData.github) || "https://github.com/coopeace",
      liveUrl: sanitizeUrl(projectData.liveUrl),
      featured: Boolean(projectData.featured),
      missionNumber,
      architectureHighlights: projectData.architectureHighlights || [
        "Modular architecture designed for predictable, observable systems behavior.",
      ],
      keyChallenges: projectData.keyChallenges || [
        "Handling edge cases and optimizing algorithmic latency.",
      ],
      specs: projectData.specs || {
        runtime: "Linux / Python 3.11+",
        protocolOrFormat: "Standard Protocols",
        architectureType: "Modular Architecture",
        testingStrategy: "Unit and integration tests",
      },
    };

    // Replace if existing slug, else prepend
    const existingIndex = currentProjects.findIndex(
      (p: { slug: string }) => p.slug === cleanSlug
    );
    if (existingIndex >= 0) {
      currentProjects[existingIndex] = newProject;
    } else {
      currentProjects.unshift(newProject);
    }

    fs.writeFileSync(
      projectsFilePath,
      JSON.stringify(currentProjects, null, 2),
      "utf8"
    );

    return NextResponse.json({
      success: true,
      message: `Project '${name}' saved successfully to missions database!`,
      slug: cleanSlug,
      url: `/projects/${cleanSlug}`,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to save project";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
