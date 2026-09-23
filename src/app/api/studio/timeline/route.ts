import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { isAuthenticatedStudioRequest } from "@/lib/studio-auth";

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

    const timelineFilePath = path.join(
      process.cwd(),
      "src",
      "data",
      "timeline.json"
    );

    const payload = {
      orbitalLogMilestones,
      dsaJourneyMilestones,
    };

    fs.writeFileSync(
      timelineFilePath,
      JSON.stringify(payload, null, 2),
      "utf8"
    );

    return NextResponse.json({
      success: true,
      message: "Orbital log and DSA milestones synchronized to timeline.json successfully!",
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
