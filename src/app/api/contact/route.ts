import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import { ContactInquiry } from "@/models/ContactInquiry";
import { checkRateLimit } from "@/lib/rateLimit";
import { verifyRecaptchaToken } from "@/lib/recaptcha";

const ContactSchema = z.object({
  fullName: z.string().min(2, "Full name required").max(100),
  email: z.string().email("Valid email required"),
  organization: z.string().max(100).optional(),
  category: z.enum([
    "brand_sponsorship",
    "press_media",
    "broadcast_licensing",
    "casting_inquiry",
    "general",
  ]),
  message: z.string().min(10, "Message must be at least 10 characters").max(3000),
  recaptchaToken: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Free-tier code-level rate limiting (max 5 messages per 10 mins per IP)
    const ip = request.headers.get("x-forwarded-for") || "contact-client";
    const limit = checkRateLimit(`contact_${ip}`, 5, 10 * 60 * 1000);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many messages sent. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }

    // 2. Server-side validation
    const body = await request.json();
    const validated = ContactSchema.safeParse(body);

    if (!validated.success) {
      const msg = validated.error.errors.map((e) => e.message).join(". ");
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const data = validated.data;

    // 2.5 Server-Side reCAPTCHA Verification (P1.4)
    if (data.recaptchaToken) {
      const captchaResult = await verifyRecaptchaToken(data.recaptchaToken);
      if (!captchaResult.success) {
        return NextResponse.json(
          { error: captchaResult.error || "Bot verification failed." },
          { status: 403 }
        );
      }
    }

    const inquiryId = `INQ-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

    // 3. Connect to Database & Persist (Fail-closed)
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { error: "Communication database is temporarily offline. Please retry your inquiry shortly." },
        { status: 503 }
      );
    }

    await ContactInquiry.create({
      inquiryId,
      fullName: data.fullName,
      email: data.email.toLowerCase().trim(),
      organization: data.organization?.trim() || "",
      category: data.category,
      message: data.message,
      status: "new",
    });

    return NextResponse.json({
      success: true,
      inquiryId,
      message: "Your inquiry has been recorded and queued for executive review.",
    });
  } catch (err: unknown) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Failed to process inquiry. Please try again." },
      { status: 500 }
    );
  }
}
