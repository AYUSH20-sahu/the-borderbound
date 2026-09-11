import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { Application, IApplication } from "@/models/Application";
import { checkRateLimit } from "@/lib/rateLimit";

// In-memory runtime cache for local dev / testing before Atlas connection is plugged
const memoryApplications: Map<string, Record<string, unknown>> = new Map();

// Zod Validation Schema
const ApplicationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Valid email address required"),
  phone: z.string().min(7, "Phone number is required").max(25),
  age: z.number().min(21, "Must be at least 21 years old to audition"),
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
  googleId: z.string().optional(),
});

function generateApplicationId(): string {
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `BB-2026-${randomSuffix}`;
}

// =========================================================================
// POST: Submit New Application
// =========================================================================
export async function POST(request: NextRequest) {
  try {
    // 1. Code-Level Rate Limit (Free tier: max 5 submissions per hour per IP)
    const ip = request.headers.get("x-forwarded-for") || "local-client";
    const limit = checkRateLimit(`apply_${ip}`, 5, 60 * 60 * 1000);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many submissions from this connection. Please try again later." },
        { status: 429 }
      );
    }

    // 2. Parse & Validate Payload
    const body = await request.json();
    const validated = ApplicationSchema.safeParse(body);

    if (!validated.success) {
      const errorMsg = validated.error.errors.map((e) => e.message).join(". ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const data = validated.data;
    const applicationId = generateApplicationId();

    // 3. Attempt MongoDB Storage
    const db = await connectToDatabase();

    if (db) {
      // Check for duplicate application by email
      const existing = await Application.findOne({
        "applicant.email": data.email.toLowerCase(),
      });

      if (existing) {
        return NextResponse.json(
          {
            error: "An application with this email address has already been submitted for Season 1.",
            existingApplicationId: existing.applicationId,
          },
          { status: 409 }
        );
      }

      // Create new application document
      const doc = await Application.create({
        applicationId,
        applicant: {
          fullName: data.fullName,
          email: data.email.toLowerCase(),
          phone: data.phone,
          age: data.age,
          occupation: data.occupation,
          hometown: data.hometown,
          hasValidPassport: data.hasValidPassport,
          googleId: data.googleId,
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
        message: "Application successfully submitted and queued for review.",
      });
    } else {
      // In-memory fallback (if MongoDB Atlas is not yet linked)
      if (memoryApplications.has(data.email.toLowerCase())) {
        const prev = memoryApplications.get(data.email.toLowerCase());
        return NextResponse.json(
          {
            error: "An application with this email address has already been submitted for Season 1.",
            existingApplicationId: prev?.applicationId,
          },
          { status: 409 }
        );
      }

      const mockRecord = {
        applicationId,
        applicant: {
          fullName: data.fullName,
          email: data.email.toLowerCase(),
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
        createdAt: new Date().toISOString(),
      };

      memoryApplications.set(data.email.toLowerCase(), mockRecord);
      memoryApplications.set(applicationId, mockRecord);

      return NextResponse.json({
        success: true,
        applicationId,
        status: "pending",
        message: "Application submitted and queued for casting review.",
      });
    }
  } catch (err: unknown) {
    console.error("Application submission error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to submit application." },
      { status: 500 }
    );
  }
}

// =========================================================================
// GET: Query Application Status (Masked public lookup)
// =========================================================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.toLowerCase().trim();
    const id = searchParams.get("id")?.trim();

    if (!email && !id) {
      return NextResponse.json(
        { error: "Email or Application ID query parameter is required." },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    if (db) {
      const query = email
        ? { "applicant.email": email }
        : { applicationId: id };

      const found = await Application.findOne(query).select(
        "applicationId applicant.fullName applicant.email status createdAt pitch.sectorPreference"
      );

      if (!found) {
        return NextResponse.json(
          { error: "No application matching this record was found." },
          { status: 404 }
        );
      }

      return NextResponse.json({
        found: true,
        applicationId: found.applicationId,
        status: found.status,
        submittedAt: found.createdAt,
        sectorPreference: found.pitch.sectorPreference,
        // Mask name for privacy: e.g. "A*** C***"
        applicantMasked: found.applicant.fullName
          .split(" ")
          .map((n: string) => n[0] + "***")
          .join(" "),
      });
    } else {
      // Search in memory
      const record = email
        ? memoryApplications.get(email)
        : memoryApplications.get(id || "");

      if (!record) {
        return NextResponse.json(
          { error: "No application matching this record was found in the system." },
          { status: 404 }
        );
      }

      const applicant = record.applicant as Record<string, string>;
      const pitch = record.pitch as Record<string, string>;

      return NextResponse.json({
        found: true,
        applicationId: record.applicationId,
        status: record.status,
        submittedAt: record.createdAt,
        sectorPreference: pitch?.sectorPreference,
        applicantMasked: (applicant?.fullName || "Applicant")
          .split(" ")
          .map((n: string) => n[0] + "***")
          .join(" "),
      });
    }
  } catch (err: unknown) {
    console.error("Lookup error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve status." },
      { status: 500 }
    );
  }
}
