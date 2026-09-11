import { NextRequest, NextResponse } from "next/server";
import { authenticateAdminRequest } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  const admin = await authenticateAdminRequest(request);

  if (!admin) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: admin,
  });
}
