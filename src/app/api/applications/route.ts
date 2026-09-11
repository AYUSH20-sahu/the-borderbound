import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Application } from "@/models/Application";
import { checkRateLimit } from "@/lib/rateLimit";
import { verifyRecaptchaToken } from "@/lib/recaptcha";

// Zod Server Validation Schema
const ApplicationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  phone: z.string().min(7, "Valid phone number is required").max(25),
  age: z.number().min(21, "Must be at least 21 years old to audition").max(75),
  occupation: z.string().min(2, "Occupation is required").max(100),
  hometown: z.string().min(2, "Hometown is required").max(100),
  hasValidPassport: z.boolean(),
  photoUrl: z.string().url("Valid headshot photo URL required"),
  videoAuditionUrl: z.string().url("Valid audition video URL required"),
  sectorPreference: z.string().min(2, "Sector preference required"),
  archetypePreference: z.string().min(2, "Archetype preference required"),
  strategyPitch: z.string().min(10, "Strategy pitch must be at least 10 characters").max(2000),
  survivalExperience: z.string().min(10, "Survival experience summary is required").max(2000),
  whyBorderbound: z.string().min(10, "Statement of intent is required").max(2000),
  recaptchaToken: z.string().optional(),
});

/**
 * Generates a cryptographically secure, collision-resistant Application ID
 * Format: BB-2026-XXXXXX (e.g. BB-2026-F9B4D1)
 */
function generateSecureApplicationId(): string {
  const randomHex = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `BB-2026-${randomHex}`;
}

// =========================================================================
// POST: Submit New Application (Server-Side Authenticated)
// =========================================================================
export async function POST(request: NextRequest) {
  try {
    // 1. Code-Level Rate Limit (Max 5 submissions per hour per IP)
    const ip = request.headers.get("x-forwarded-for") || "client-ip";
    const limit = checkRateLimit(`apply_${ip}`, 5, 60 * 60 * 1000);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many submissions from this connection. Please wait before submitting again." },
        { status: 429 }
      );
    }

    // 2. Server-Side Authentication Verification (P0.4)
    // Never trust client-side boolean flags or browser-supplied identity.
    const session = await getServerSession(authOptions);
    const authenticatedEmail = session?.user?.email?.toLowerCase().trim();

    if (!authenticatedEmail) {
      return NextResponse.json(
        {
          error: "Authentication required. You must sign in with your verified Google account before submitting an application.",
        },
        { status: 401 }
      );
    }

    // 3. Parse & Validate Payload via Zod
    const body = await request.json();
    const validated = ApplicationSchema.safeParse(body);

    if (!validated.success) {
      const errorMsg = validated.error.errors.map((e) => e.message).join(". ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const data = validated.data;

    // 3.5 Verify reCAPTCHA token if configured (P1.4)
    const recaptcha = await verifyRecaptchaToken(data.recaptchaToken);
    if (!recaptcha.valid) {
      return NextResponse.json(
        { error: `Anti-bot security verification failed: ${recaptcha.reason}` },
        { status: 400 }
      );
    }

    // 4. Connect to Database (P0.5: Fail closed, no silent ephemeral memory storage)
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        {
          error: "Database storage service is temporarily unavailable. Your audition was NOT submitted. Please retry shortly.",
        },
        { status: 503 }
      );
    }

    // 5. Prevent Duplicate Applications by Authenticated Email
    const existing = await Application.findOne({
      "applicant.email": authenticatedEmail,
    });

    if (existing) {
      return NextResponse.json(
        {
          error: "An application has already been submitted for this verified Google account.",
          existingApplicationId: existing.applicationId,
        },
        { status: 409 }
      );
    }

    // 6. Generate Secure ID and Persist Application
    let applicationId = generateSecureApplicationId();
    let collisionCheck = await Application.findOne({ applicationId });
    while (collisionCheck) {
      applicationId = generateSecureApplicationId();
      collisionCheck = await Application.findOne({ applicationId });
    }

    const doc = await Application.create({
      applicationId,
      applicant: {
        fullName: data.fullName,
        email: authenticatedEmail, // Server-authenticated authority
        phone: data.phone,
        age: data.age,
        occupation: data.occupation,
        hometown: data.hometown,
        hasValidPassport: data.hasValidPassport,
      },
      media: {
        photoUrl: data.photoUrl,
        videoAuditionUrl: data.videoAuditionUrl,
      },
      pitch: {
        sectorPreference: data.sectorPreference,
        archetypePreference: data.archetypePreference,
        strategyPitch: data.strategyPitch,
        survivalExperience: data.survivalExperience,
        whyBorderbound: data.whyBorderbound,
      },
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      applicationId: doc.applicationId,
      status: doc.status,
      message: "Application successfully submitted and durably recorded.",
    });
  } catch (err: unknown) {
    console.error("Application submission error:", err);
    return NextResponse.json(
      { error: "Failed to submit application. Please verify your connection." },
      { status: 500 }
    );
  }
}

// =========================================================================
// GET: Query Application Status (Masked public lookup with anti-enumeration)
// =========================================================================
export async function GET(request: NextRequest) {
  try {
    // 1. Rate Limiting on status queries (Max 15 queries per 5 minutes per IP)
    const ip = request.headers.get("x-forwarded-for") || "client-ip";
    const limit = checkRateLimit(`status_${ip}`, 15, 5 * 60 * 1000);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a few minutes before checking status again." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.toLowerCase().trim();
    const id = searchParams.get("id")?.trim();

    if (!email && !id) {
      return NextResponse.json(
        { error: "Valid Email or Application ID query parameter is required." },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { error: "Status service temporarily unavailable. Please retry shortly." },
        { status: 503 }
      );
    }

    const query = email ? { "applicant.email": email } : { applicationId: id };

    const found = await Application.findOne(query).select(
      "applicationId applicant.fullName status createdAt pitch.sectorPreference"
    );

    if (!found) {
      return NextResponse.json(
        { error: "No matching application record was found." },
        { status: 404 }
      );
    }

    // Mask name for privacy to prevent PII harvesting (e.g. "J*** M***")
    const maskedName = found.applicant.fullName
      .split(" ")
      .map((part: string) => (part.length > 0 ? part[0] + "***" : ""))
      .join(" ");

    return NextResponse.json({
      found: true,
      applicationId: found.applicationId,
      status: found.status,
      submittedAt: found.createdAt,
      sectorPreference: found.pitch.sectorPreference,
      applicantMasked: maskedName,
    });
  } catch (err: unknown) {
    console.error("Status lookup error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve status." },
      { status: 500 }
    );
  }
}
