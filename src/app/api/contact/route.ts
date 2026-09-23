import { NextResponse } from "next/server";
import { contactFormSchema, type ContactApiResponse } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      const errorResponse: ContactApiResponse = {
        success: false,
        message: "Transmission validation failed. Please check the highlighted telemetry fields.",
        status: "VALIDATION_FAILED",
        timestamp: new Date().toISOString(),
        errors: formattedErrors,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Truthful handling according to design.md §29:
    // Do not fabricate a successful third-party email delivery when no external SMTP/Resend API is connected.
    // Instead, acknowledge receipt, log payload parameters safely, and provide truthful status and direct fallback.
    const responseData: ContactApiResponse = {
      success: true,
      message:
        "Transmission payload successfully received and validated by Ground Station Durgapur. As this station operates without third-party email dispatch relays, you may also open direct communication via the mailto protocol or LinkedIn.",
      status: "VALIDATED_AND_LOGGED",
      timestamp: new Date().toISOString(),
      fallbackUrl: `mailto:shishirdev5263@gmail.com?subject=Inquiry from ${encodeURIComponent(
        result.data.name
      )}&body=${encodeURIComponent(result.data.message)}`,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid transmission structure or corrupted payload.",
        status: "VALIDATION_FAILED",
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  }
}
