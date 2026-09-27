import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import { isAuthenticatedStudioRequest } from "@/lib/studio-auth";
import { persistStudioFile } from "@/lib/studio-persistence";

export async function GET() {
  try {
    const timelineFilePath = path.join(
      process.cwd(),
      "src",
      "data",
      "timeline.json"
    );

    let data = { orbitalLogMilestones: [], dsaJourneyMilestones: [] };
    if (fs.existsSync(timelineFilePath)) {
      data = JSON.parse(fs.readFileSync(timelineFilePath, "utf8"));
    }

    return NextResponse.json({
      success: true,
      orbitalLogMilestones: data.orbitalLogMilestones || [],
      dsaJourneyMilestones: data.dsaJourneyMilestones || [],
    });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to load timeline data";
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
    const body = await request.json();
    const { orbitalLogMilestones, dsaJourneyMilestones } = body;

    if (!Array.isArray(orbitalLogMilestones) || !Array.isArray(dsaJourneyMilestones)) {
      return NextResponse.json(
        { success: false, message: "Invalid payload format. Expected arrays for milestones." },
        { status: 400 }
      );
    }

    const payload = {
      orbitalLogMilestones,
      dsaJourneyMilestones,
    };

    const persistResult = await persistStudioFile(
      "src/data/timeline.json",
      JSON.stringify(payload, null, 2) + "\n",
      "chore(studio): update orbital log & dsa progression milestones"
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

    try {
      revalidatePath("/about");
      revalidatePath("/telemetry");
      revalidatePath("/");
    } catch {
      // Revalidation is non-blocking
    }

    return NextResponse.json({
      success: true,
      mode: persistResult.mode,
      commitUrl: persistResult.commitUrl,
      message:
        persistResult.mode === "github"
          ? "Orbital log and DSA milestones committed to GitHub! Vercel is deploying updates."
          : "Orbital log and DSA milestones synchronized to timeline.json successfully!",
    });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to save timeline data";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
