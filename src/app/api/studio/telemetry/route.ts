import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { isAuthenticatedStudioRequest } from "@/lib/studio-auth";
import { persistStudioFiles, type FileToPersist } from "@/lib/studio-persistence";

export async function GET() {
  try {
    const achievementsFilePath = path.join(
      process.cwd(),
      "src",
      "data",
      "achievements.json"
    );
    const profileFilePath = path.join(
      process.cwd(),
      "src",
      "data",
      "profile.json"
    );

    let achievements = [];
    if (fs.existsSync(achievementsFilePath)) {
      achievements = JSON.parse(fs.readFileSync(achievementsFilePath, "utf8"));
    }

    let profile = {};
    if (fs.existsSync(profileFilePath)) {
      profile = JSON.parse(fs.readFileSync(profileFilePath, "utf8"));
    }

    return NextResponse.json({
      success: true,
      achievements,
      profile,
    });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to load telemetry";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

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
    const { achievements, profile } = data;
    const filesToPersist: FileToPersist[] = [];

    if (achievements) {
      filesToPersist.push({
        relativePath: "src/data/achievements.json",
        content: JSON.stringify(achievements, null, 2) + "\n",
      });
    }

    if (profile) {
      const profileFilePath = path.join(
        process.cwd(),
        "src",
        "data",
        "profile.json"
      );
      let currentProfile = {};
      if (fs.existsSync(profileFilePath)) {
        try {
          currentProfile = JSON.parse(fs.readFileSync(profileFilePath, "utf8"));
        } catch {
          // ignore parse error if empty
        }
      }
      const updatedProfile = { ...currentProfile, ...profile };
      filesToPersist.push({
        relativePath: "src/data/profile.json",
        content: JSON.stringify(updatedProfile, null, 2) + "\n",
      });

      // Synchronize Markdown frontmatter in content/profile.md
      const profileMdPath = path.join(process.cwd(), "content", "profile.md");
      if (fs.existsSync(profileMdPath)) {
        try {
          const rawMd = fs.readFileSync(profileMdPath, "utf8");
          const parsed = matter(rawMd);
          const updatedMd = matter.stringify(parsed.content, {
            ...parsed.data,
            ...profile,
          });
          filesToPersist.push({
            relativePath: "content/profile.md",
            content: updatedMd,
          });
        } catch {
          // Skip if markdown parsing fails
        }
      }

      // Synchronize Markdown frontmatter in content/about.md
      const aboutMdPath = path.join(process.cwd(), "content", "about.md");
      if (fs.existsSync(aboutMdPath)) {
        try {
          const rawMd = fs.readFileSync(aboutMdPath, "utf8");
          const parsed = matter(rawMd);
          const updatedData: Record<string, unknown> = { ...parsed.data };
          if (profile.status) updatedData.status = profile.status;
          if (profile.location) updatedData.location = profile.location;
          const updatedMd = matter.stringify(parsed.content, updatedData);
          filesToPersist.push({
            relativePath: "content/about.md",
            content: updatedMd,
          });
        } catch {
          // Skip if markdown parsing fails
        }
      }
    }

    if (filesToPersist.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No telemetry parameters were modified.",
      });
    }

    const persistResult = await persistStudioFiles(
      filesToPersist,
      "chore(studio): update telemetry & ground station profile metrics"
    );

    if (!persistResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: persistResult.message,
          needsTokenSetup: persistResult.needsTokenSetup,
          error: persistResult.error,
        },
        { status: persistResult.needsTokenSetup ? 400 : 500 }
      );
    }

    // Invalidate cached static routes so Next.js presents updated data
    try {
      revalidatePath("/telemetry");
      revalidatePath("/");
      revalidatePath("/about");
    } catch {
      // Revalidation is non-blocking
    }

    return NextResponse.json({
      success: true,
      mode: persistResult.mode,
      commitUrl: persistResult.commitUrl,
      message:
        persistResult.mode === "github"
          ? "Telemetry changes committed to GitHub repository! Vercel is deploying the updates."
          : "Telemetry, profile, and Markdown parameters synchronized successfully!",
    });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to sync telemetry";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
