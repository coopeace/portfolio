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
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "blog";

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    // Sanitize folder
    const targetFolder = ["blog", "projects", "profile"].includes(folder)
      ? folder
      : "blog";

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const ext = path.extname(file.name) || ".png";
    const baseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-");
    const uniqueFileName = `${baseName}-${Date.now()}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "images", targetFolder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, uniqueFileName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/images/${targetFolder}/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      message: "Media uploaded successfully",
      url: publicUrl,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
