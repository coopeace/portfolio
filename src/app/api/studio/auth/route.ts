import { NextResponse } from "next/server";
import {
  isStudioAuthEnabled,
  verifyStudioPassword,
  isAuthenticatedStudioRequest,
  getStudioSessionCookie,
  getClearStudioSessionCookie,
} from "@/lib/studio-auth";

export async function GET(request: Request) {
  const isAuthRequired = isStudioAuthEnabled();
  const authenticated = await isAuthenticatedStudioRequest(request);

  return NextResponse.json({
    isAuthRequired,
    isAuthenticated: authenticated,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action = "login", password } = body;

    if (action === "logout") {
      const response = NextResponse.json({
        success: true,
        message: "Studio session terminated. Logged out successfully.",
      });
      const cookieData = getClearStudioSessionCookie();
      response.cookies.set(cookieData.name, cookieData.value, cookieData);
      return response;
    }

    // Login action
    if (!verifyStudioPassword(password)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid mission clearance code. Access denied.",
        },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Clearance code accepted. Studio access granted.",
    });

    const cookieData = getStudioSessionCookie();
    response.cookies.set(cookieData.name, cookieData.value, cookieData);
    return response;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Authentication request malformed.",
      },
      { status: 400 }
    );
  }
}
