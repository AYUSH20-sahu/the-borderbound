import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "borderbound_admin_token";

export type AdminRole = "producer" | "casting_director" | "viewer";

export interface AdminPayload {
  email: string;
  role: AdminRole;
}

export type Permission =
  | "application:read"
  | "application:update_status"
  | "application:add_notes"
  | "application:export_csv"
  | "analytics:view";

/**
 * Enforces Role-Based Access Control (RBAC)
 */
export function can(user: AdminPayload, permission: Permission): boolean {
  if (user.role === "producer") return true; // Executive Producers have full access
  if (user.role === "casting_director") {
    // Casting directors can view, edit status, and notes, but cannot export all CSV data
    return permission !== "application:export_csv";
  }
  if (user.role === "viewer") {
    return permission === "application:read" || permission === "analytics:view";
  }
  return false;
}

function getJwtSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "[SECURITY CONFIGURATION] ADMIN_JWT_SECRET environment variable must be set with at least 32 characters."
    );
  }
  return new TextEncoder().encode(secret);
}

/**
 * Creates a signed JWT token (HS256) with 8-hour expiration.
 * Note: Payload is cryptographically signed, not encrypted.
 */
export async function signAdminToken(payload: AdminPayload): Promise<string> {
  const secret = getJwtSecret();
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);
}

/**
 * Verifies a signed JWT token
 */
export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
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
 * Verifies staff email and password.
 * Fails closed if environment variables are not configured.
 */
export function verifyAdminCredentials(email: string, pass: string): { valid: boolean; role: AdminRole } {
  const configuredEmail = process.env.ADMIN_EMAIL;
  const configuredPass = process.env.ADMIN_PASSWORD;

  if (!configuredEmail || !configuredPass) {
    throw new Error(
      "[SECURITY CONFIGURATION] ADMIN_EMAIL and ADMIN_PASSWORD environment variables must be configured in environment."
    );
  }

  const isMatch =
    email.trim().toLowerCase() === configuredEmail.trim().toLowerCase() &&
    pass === configuredPass;

  return { valid: isMatch, role: "producer" };
}
