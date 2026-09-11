import { NextRequest, NextResponse } from "next/server";
import { authenticateAdminRequest, can } from "@/lib/adminAuth";
import { connectToDatabase } from "@/lib/mongodb";
import { Application } from "@/models/Application";
import { INITIAL_APPLICATIONS, AdminApplicationItem } from "@/data/seedApplications";

// Runtime mock storage strictly for development preview
let devSeedApplications: AdminApplicationItem[] = [...INITIAL_APPLICATIONS];

export async function GET(request: NextRequest) {
  try {
    const admin = await authenticateAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Staff session expired." }, { status: 401 });
    }

    if (!can(admin, "application:read")) {
      return NextResponse.json({ error: "Forbidden. Insufficient permissions to view applicant data." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase() || "";
    const status = searchParams.get("status") || "all";
    const sector = searchParams.get("sector") || "all";

    const db = await connectToDatabase();

    let list: AdminApplicationItem[] = [];

    if (db) {
      const query: Record<string, unknown> = {};
      if (status !== "all") query.status = status;
      if (sector !== "all") query["pitch.sectorPreference"] = { $regex: sector, $options: "i" };

      const mongoDocs = await Application.find(query).sort({ createdAt: -1 }).lean();

      if (mongoDocs && mongoDocs.length > 0) {
        list = mongoDocs.map((doc) => ({
          applicationId: doc.applicationId,
          applicant: {
            fullName: doc.applicant.fullName,
            email: doc.applicant.email,
            phone: doc.applicant.phone,
            age: doc.applicant.age,
            occupation: doc.applicant.occupation,
            hometown: doc.applicant.hometown,
            hasValidPassport: doc.applicant.hasValidPassport,
          },
          media: {
            photoUrl: doc.media.photoUrl,
            videoAuditionUrl: doc.media.videoAuditionUrl,
          },
          pitch: {
            sectorPreference: doc.pitch.sectorPreference,
            archetypePreference: doc.pitch.archetypePreference,
            strategyPitch: doc.pitch.strategyPitch,
            survivalExperience: doc.pitch.survivalExperience,
            whyBorderbound: doc.pitch.whyBorderbound,
          },
          status: doc.status as AdminApplicationItem["status"],
          internalNotes: doc.internalNotes || "",
          createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
        }));
      } else if (process.env.NODE_ENV === "development") {
        list = [...devSeedApplications];
      }
    } else {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: "Database service unavailable. Cannot load applicant data." },
          { status: 503 }
        );
      }
      list = [...devSeedApplications];
    }

    // Filter by query
    if (search.trim() !== "") {
      list = list.filter(
        (a) =>
          a.applicant.fullName.toLowerCase().includes(search) ||
          a.applicant.email.toLowerCase().includes(search) ||
          a.applicationId.toLowerCase().includes(search) ||
          a.applicant.hometown.toLowerCase().includes(search)
      );
    }

    if (status !== "all") {
      list = list.filter((a) => a.status === status);
    }

    if (sector !== "all") {
      list = list.filter((a) => a.pitch.sectorPreference.includes(sector));
    }

    return NextResponse.json({
      success: true,
      count: list.length,
      applications: list,
    });
  } catch (err: unknown) {
    console.error("Admin applications query error:", err);
    return NextResponse.json({ error: "Failed to load applications." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await authenticateAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Staff session expired." }, { status: 401 });
    }

    if (!can(admin, "application:update_status")) {
      return NextResponse.json({ error: "Forbidden. Insufficient permissions to modify candidate status." }, { status: 403 });
    }

    const { applicationId, status, internalNotes } = await request.json();

    if (!applicationId) {
      return NextResponse.json({ error: "Application ID is required." }, { status: 400 });
    }

    const db = await connectToDatabase();

    if (!db) {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: "Database service unavailable. Status cannot be saved." },
          { status: 503 }
        );
      }
      // Dev only update in memory
      devSeedApplications = devSeedApplications.map((app) =>
        app.applicationId === applicationId
          ? {
              ...app,
              status: status || app.status,
              internalNotes: internalNotes !== undefined ? internalNotes : app.internalNotes,
            }
          : app
      );

      return NextResponse.json({
        success: true,
        message: `[Development] Application ${applicationId} status updated locally.`,
      });
    }

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (internalNotes !== undefined) updateData.internalNotes = internalNotes;
    updateData.reviewedBy = admin.email;

    const result = await Application.findOneAndUpdate({ applicationId }, updateData, { new: true });

    if (!result) {
      return NextResponse.json({ error: "Candidate application record not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Application ${applicationId} status updated successfully to ${status}.`,
    });
  } catch (err: unknown) {
    console.error("Admin status update error:", err);
    return NextResponse.json({ error: "Failed to update application." }, { status: 500 });
  }
}
