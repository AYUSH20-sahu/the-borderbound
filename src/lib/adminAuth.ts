import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET_RAW = process.env.ADMIN_JWT_SECRET || "borderbound_admin_secret_key_32_characters_minimum";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_RAW);

export const ADMIN_COOKIE_NAME = "borderbound_admin_token";

export interface AdminPayload {
  email: string;
  role: "producer" | "casting_director";
}

/**
 * Creates an encrypted JWT token with 8-hour expiration
 */
export async function signAdminToken(payload: AdminPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(JWT_SECRET);
}

/**
 * Verifies a JWT token
 */
export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AdminPayload;
  } catch {
    return null;
  }
}

/**
 * Validates request credentials from cookies or Authorization header
 */
export async function authenticateAdminRequest(request?: NextRequest): Promise<AdminPayload | null> {
  // 1. Check Authorization header
  if (request) {
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const verified = await verifyAdminToken(token);
      if (verified) return verified;
    }
  }

  // 2. Check HTTP-only cookie
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;

  return verifyAdminToken(token);
}

/**
 * Verifies staff email and password
 */
export function verifyAdminCredentials(email: string, pass: string): boolean {
  const configuredEmail = process.env.ADMIN_EMAIL || "admin@borderbound.show";
  const configuredPass = process.env.ADMIN_PASSWORD || "borderbound2026!";

  return (
    email.trim().toLowerCase() === configuredEmail.trim().toLowerCase() &&
    pass === configuredPass
  );
}
