import { NextRequest, NextResponse } from "next/server";
import { authenticateAdminRequest } from "@/lib/adminAuth";
import { connectToDatabase } from "@/lib/mongodb";
import { Application } from "@/models/Application";
import { INITIAL_APPLICATIONS } from "@/data/seedApplications";

function escapeCSV(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export async function GET(request: NextRequest) {
  try {
    const admin = await authenticateAdminRequest(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Staff session required." }, { status: 401 });
    }

    const db = await connectToDatabase();
    let records = [];

    if (db) {
      const mongoDocs = await Application.find({}).sort({ createdAt: -1 }).lean();
      if (mongoDocs && mongoDocs.length > 0) {
        records = mongoDocs.map((d) => ({
          id: d.applicationId,
          name: d.applicant.fullName,
          email: d.applicant.email,
          phone: d.applicant.phone,
          age: d.applicant.age,
          occupation: d.applicant.occupation,
          hometown: d.applicant.hometown,
          passport: d.applicant.hasValidPassport ? "Yes" : "No",
          sector: d.pitch.sectorPreference,
          archetype: d.pitch.archetypePreference,
          status: d.status,
          photoUrl: d.media.photoUrl,
          videoUrl: d.media.videoAuditionUrl,
          strategy: d.pitch.strategyPitch,
          notes: d.internalNotes || "",
          submittedAt: d.createdAt ? new Date(d.createdAt).toISOString() : "",
        }));
      } else {
        records = INITIAL_APPLICATIONS.map((d) => ({
          id: d.applicationId,
          name: d.applicant.fullName,
          email: d.applicant.email,
          phone: d.applicant.phone,
          age: d.applicant.age,
          occupation: d.applicant.occupation,
          hometown: d.applicant.hometown,
          passport: d.applicant.hasValidPassport ? "Yes" : "No",
          sector: d.pitch.sectorPreference,
          archetype: d.pitch.archetypePreference,
          status: d.status,
          photoUrl: d.media.photoUrl,
          videoUrl: d.media.videoAuditionUrl,
          strategy: d.pitch.strategyPitch,
          notes: d.internalNotes || "",
          submittedAt: d.createdAt,
        }));
      }
    } else {
      records = INITIAL_APPLICATIONS.map((d) => ({
        id: d.applicationId,
        name: d.applicant.fullName,
        email: d.applicant.email,
        phone: d.applicant.phone,
        age: d.applicant.age,
        occupation: d.applicant.occupation,
        hometown: d.applicant.hometown,
        passport: d.applicant.hasValidPassport ? "Yes" : "No",
        sector: d.pitch.sectorPreference,
        archetype: d.pitch.archetypePreference,
        status: d.status,
        photoUrl: d.media.photoUrl,
        videoUrl: d.media.videoAuditionUrl,
        strategy: d.pitch.strategyPitch,
        notes: d.internalNotes || "",
        submittedAt: d.createdAt,
      }));
    }

    // Build CSV Headers
    const headers = [
      "Application ID",
      "Full Name",
      "Email",
      "Phone",
      "Age",
      "Occupation",
      "Hometown",
      "Valid Passport",
      "Preferred Sector",
      "Archetype",
      "Status",
      "Photo URL",
      "Audition Video URL",
      "Strategy Pitch",
      "Producer Internal Notes",
      "Submitted At",
    ];

    const rows = records.map((r) => [
      escapeCSV(r.id),
      escapeCSV(r.name),
      escapeCSV(r.email),
      escapeCSV(r.phone),
      escapeCSV(r.age),
      escapeCSV(r.occupation),
      escapeCSV(r.hometown),
      escapeCSV(r.passport),
      escapeCSV(r.sector),
      escapeCSV(r.archetype),
      escapeCSV(r.status),
      escapeCSV(r.photoUrl),
      escapeCSV(r.videoUrl),
      escapeCSV(r.strategy),
      escapeCSV(r.notes),
      escapeCSV(r.submittedAt),
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="borderbound_contestant_applications.csv"',
      },
    });
  } catch (err: unknown) {
    console.error("CSV export error:", err);
    return NextResponse.json({ error: "Failed to generate CSV export." }, { status: 500 });
  }
}
