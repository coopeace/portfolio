import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "studio_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

/**
 * Returns whether password protection is configured in environment variables.
 */
export function isStudioAuthEnabled(): boolean {
  return Boolean(process.env.STUDIO_PASSWORD && process.env.STUDIO_PASSWORD.trim().length > 0);
}

/**
 * Computes a deterministic session signature for the configured password.
 */
function getExpectedToken(): string {
  const secret = process.env.STUDIO_PASSWORD || "antigravity-studio-fallback";
  return crypto.createHash("sha256").update(`sd-studio:${secret}`).digest("hex");
}

/**
 * Verifies a password string against the configured STUDIO_PASSWORD.
 */
export function verifyStudioPassword(password: string): boolean {
  if (!isStudioAuthEnabled()) {
    // If not configured, allow access
    return true;
  }
  const configured = (process.env.STUDIO_PASSWORD || "").trim();
  const provided = (password || "").trim();
  if (!configured || !provided) return false;

  // Timing-safe comparison to prevent timing attacks
  const bufA = Buffer.from(configured);
  const bufB = Buffer.from(provided);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Validates whether an incoming HTTP Request or cookie is authenticated.
 */
export async function isAuthenticatedStudioRequest(request?: Request): Promise<boolean> {
  if (!isStudioAuthEnabled()) {
    return true;
  }

  const expectedToken = getExpectedToken();

  // 1. Check Authorization header: Bearer <token> or Bearer <password>
  if (request) {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "").trim();
      if (token === expectedToken || token === (process.env.STUDIO_PASSWORD || "").trim()) {
        return true;
      }
    }
  }

  // 2. Check HTTP-only cookie
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);
    if (sessionCookie && sessionCookie.value === expectedToken) {
      return true;
    }
  } catch {
    // If cookies() is unavailable, fall through
  }

  return false;
}

/**
 * Generates cookie parameters for a verified session.
 */
export function getStudioSessionCookie() {
  return {
    name: COOKIE_NAME,
    value: getExpectedToken(),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: SESSION_MAX_AGE,
    path: "/",
  };
}

/**
 * Generates cookie parameters to clear the session.
 */
export function getClearStudioSessionCookie() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 0,
    path: "/",
  };
}
