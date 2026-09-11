import { NextRequest, NextResponse } from "next/server";
import { signAdminToken, verifyAdminCredentials, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting on login attempts (Max 10 per 15 mins per IP)
    const ip = request.headers.get("x-forwarded-for") || "admin-client";
    const limit = checkRateLimit(`login_${ip}`, 10, 15 * 60 * 1000);
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many failed login attempts. Account temporarily throttled." },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Staff email and password are required." },
        { status: 400 }
      );
    }

    const isValid = verifyAdminCredentials(email, password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid staff credentials. Access denied." },
        { status: 401 }
      );
    }

    // 2. Issue JWT Token
    const token = await signAdminToken({
      email: email.toLowerCase(),
      role: "producer",
    });

    const response = NextResponse.json({
      success: true,
      user: {
        email: email.toLowerCase(),
        role: "producer",
      },
      message: "Admin session authenticated successfully.",
    });

    // 3. Set Secure HTTP-Only Cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 8 * 60 * 60, // 8 hours
    });

    return response;
  } catch (err: unknown) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { error: "Authentication system error. Please try again." },
      { status: 500 }
    );
  }
}
