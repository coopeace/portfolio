import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { isAuthenticatedStudioRequest } from "@/lib/studio-auth";

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

    if (achievements) {
      const achievementsFilePath = path.join(
        process.cwd(),
        "src",
        "data",
        "achievements.json"
      );
      fs.writeFileSync(
        achievementsFilePath,
        JSON.stringify(achievements, null, 2),
        "utf8"
      );
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
        currentProfile = JSON.parse(fs.readFileSync(profileFilePath, "utf8"));
      }
      const updatedProfile = { ...currentProfile, ...profile };
      fs.writeFileSync(
        profileFilePath,
        JSON.stringify(updatedProfile, null, 2),
        "utf8"
      );

      // Synchronize Markdown frontmatter in content/profile.md
      const profileMdPath = path.join(process.cwd(), "content", "profile.md");
      if (fs.existsSync(profileMdPath)) {
        const rawMd = fs.readFileSync(profileMdPath, "utf8");
        const parsed = matter(rawMd);
        const updatedMd = matter.stringify(parsed.content, {
          ...parsed.data,
          ...profile,
        });
        fs.writeFileSync(profileMdPath, updatedMd, "utf8");
      }

      // Synchronize Markdown frontmatter in content/about.md
      const aboutMdPath = path.join(process.cwd(), "content", "about.md");
      if (fs.existsSync(aboutMdPath)) {
        const rawMd = fs.readFileSync(aboutMdPath, "utf8");
        const parsed = matter(rawMd);
        const updatedData: Record<string, unknown> = { ...parsed.data };
        if (profile.status) updatedData.status = profile.status;
        if (profile.location) updatedData.location = profile.location;
        const updatedMd = matter.stringify(parsed.content, updatedData);
        fs.writeFileSync(aboutMdPath, updatedMd, "utf8");
      }
    }

    return NextResponse.json({
      success: true,
      message: "Telemetry, profile, and Markdown parameters synchronized successfully!",
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
