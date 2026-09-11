import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { z } from "zod";

// ============================================================================
// 1. Zod Application Schema Validation Tests
// ============================================================================
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

test("ApplicationSchema: accepts valid audition dossier", () => {
  const validDossier = {
    fullName: "Elena Rostova",
    phone: "+1 (555) 234-5678",
    age: 28,
    occupation: "Expedition Guide",
    hometown: "Anchorage, Alaska",
    hasValidPassport: true,
    photoUrl: "https://res.cloudinary.com/borderbound/image/upload/v1/headshots/elena.jpg",
    videoAuditionUrl: "https://res.cloudinary.com/borderbound/video/upload/v1/auditions/elena.mp4",
    sectorPreference: "Sector Alpha (Permafrost)",
    archetypePreference: "The Survivalist",
    strategyPitch: "Form an early cold-weather coalition to secure firecraft supplies.",
    survivalExperience: "Led 14 high-altitude sub-zero alpine expeditions across Denali.",
    whyBorderbound: "I want to prove that methodical bushcraft beats social deception.",
  };

  const result = ApplicationSchema.safeParse(validDossier);
  assert.equal(result.success, true);
});

test("ApplicationSchema: rejects applicants under legal age limit (< 21)", () => {
  const underageDossier = {
    fullName: "Tyler Swift",
    phone: "+1 (555) 999-0000",
    age: 19, // Underage
    occupation: "College Student",
    hometown: "Denver, Colorado",
    hasValidPassport: true,
    photoUrl: "https://res.cloudinary.com/borderbound/image/upload/v1/headshot.jpg",
    videoAuditionUrl: "https://res.cloudinary.com/borderbound/video/upload/v1/reel.mp4",
    sectorPreference: "Sector Beta",
    archetypePreference: "The Tactician",
    strategyPitch: "Play both sides of the perimeter fence.",
    survivalExperience: "Extensive scout training and endurance marathon running.",
    whyBorderbound: "Ready for the supreme frontier challenge.",
  };

  const result = ApplicationSchema.safeParse(underageDossier);
  assert.equal(result.success, false);
  assert.match(result.error.errors[0].message, /21 years old/i);
});

test("ApplicationSchema: rejects invalid media URLs and empty pitches", () => {
  const invalidDossier = {
    fullName: "X",
    phone: "123",
    age: 30,
    occupation: "Engineer",
    hometown: "Austin, TX",
    hasValidPassport: true,
    photoUrl: "not-a-valid-url",
    videoAuditionUrl: "ftp://invalid-scheme",
    sectorPreference: "Alpha",
    archetypePreference: "Tactician",
    strategyPitch: "short",
    survivalExperience: "",
    whyBorderbound: "win",
  };

  const result = ApplicationSchema.safeParse(invalidDossier);
  assert.equal(result.success, false);
  assert.ok(result.error.errors.length >= 4);
});

// ============================================================================
// 2. Cryptographically Secure Application ID Generation
// ============================================================================
function generateSecureApplicationId() {
  const randomHex = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `BB-2026-${randomHex}`;
}

test("Application ID: conforms to BB-2026-XXXXXX format and entropy", () => {
  const idPattern = /^BB-2026-[0-9A-F]{6}$/;

  const id = generateSecureApplicationId();
  assert.match(id, idPattern);
  assert.equal(id.length, 15);
});

test("Application ID: collision resistance across 1,000 iterations", () => {
  const generated = new Set();
  for (let i = 0; i < 1000; i++) {
    const id = generateSecureApplicationId();
    assert.equal(generated.has(id), false, `Collision detected on identifier: ${id}`);
    generated.add(id);
  }
  assert.equal(generated.size, 1000);
});

// ============================================================================
// 3. Role-Based Access Control (RBAC) Matrix Tests
// ============================================================================
function can(user, permission) {
  if (user.role === "producer") return true;
  if (user.role === "casting_director") {
    return permission !== "application:export_csv";
  }
  if (user.role === "viewer") {
    return permission === "application:read" || permission === "analytics:view";
  }
  return false;
}

test("RBAC: Executive Producer has full access to all features", () => {
  const producer = { email: "producer@borderbound.show", role: "producer" };

  assert.equal(can(producer, "application:read"), true);
  assert.equal(can(producer, "application:update_status"), true);
  assert.equal(can(producer, "application:add_notes"), true);
  assert.equal(can(producer, "application:export_csv"), true);
  assert.equal(can(producer, "analytics:view"), true);
});

test("RBAC: Casting Director can manage applications but CANNOT export CSV data", () => {
  const castingDirector = { email: "casting@borderbound.show", role: "casting_director" };

  assert.equal(can(castingDirector, "application:read"), true);
  assert.equal(can(castingDirector, "application:update_status"), true);
  assert.equal(can(castingDirector, "application:add_notes"), true);
  assert.equal(can(castingDirector, "analytics:view"), true);
  assert.equal(can(castingDirector, "application:export_csv"), false); // Protected action
});

test("RBAC: Viewer is strictly read-only and denied mutations", () => {
  const viewer = { email: "intern@borderbound.show", role: "viewer" };

  assert.equal(can(viewer, "application:read"), true);
  assert.equal(can(viewer, "analytics:view"), true);
  assert.equal(can(viewer, "application:update_status"), false);
  assert.equal(can(viewer, "application:add_notes"), false);
  assert.equal(can(viewer, "application:export_csv"), false);
});

test("RBAC: Unknown or tampered role is denied all permissions", () => {
  const rogue = { email: "hacker@test.com", role: "superadmin" };
  assert.equal(can(rogue, "application:read"), false);
  assert.equal(can(rogue, "application:export_csv"), false);
});

// ============================================================================
// 4. File Magic Bytes and Upload Validation Tests
// ============================================================================
function validateImageSignature(buffer) {
  if (!buffer || buffer.length < 12) return false;
  const hex = buffer.subarray(0, 12).toString("hex");

  // JPEG: FFD8FF
  if (hex.startsWith("ffd8ff")) return true;
  // PNG: 89504E470D0A1A0A
  if (hex.startsWith("89504e470d0a1a0a")) return true;
  // WEBP: RIFF....WEBP (52494646....57454250)
  if (hex.startsWith("52494646") && hex.substring(16, 24) === "57454250") return true;

  return false;
}

test("Upload Validation: validates genuine JPEG magic bytes", () => {
  const jpegHeader = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
  assert.equal(validateImageSignature(jpegHeader), true);
});

test("Upload Validation: validates genuine PNG magic bytes", () => {
  const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
  assert.equal(validateImageSignature(pngHeader), true);
});

test("Upload Validation: rejects disguised script/executable masquerading as image", () => {
  const fakeImage = Buffer.from("<?php echo 'malicious payload'; ?><html><script>alert(1)</script>");
  assert.equal(validateImageSignature(fakeImage), false);

  const fakeExe = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00]); // MZ header
  assert.equal(validateImageSignature(fakeExe), false);
});

// ============================================================================
// 5. Code-Level Rate Limiter Tests
// ============================================================================
const rateLimitMap = new Map();

function checkRateLimit(key, limit = 5, windowMs = 60000) {
  const now = Date.now();
  const entry = rateLimitMap.get(key) || { count: 0, resetTime: now + windowMs };

  if (now > entry.resetTime) {
    entry.count = 0;
    entry.resetTime = now + windowMs;
  }

  entry.count += 1;
  rateLimitMap.set(key, entry);

  if (entry.count > limit) {
    return {
      success: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((entry.resetTime - now) / 1000),
    };
  }

  return {
    success: true,
    remaining: limit - entry.count,
    retryAfterSeconds: 0,
  };
}

test("Rate Limiting: allows calls within configured threshold and throttles excess", () => {
  const testKey = "test_applicant_ip_1";
  const limit = 3;
  const windowMs = 10000;

  assert.equal(checkRateLimit(testKey, limit, windowMs).success, true);
  assert.equal(checkRateLimit(testKey, limit, windowMs).success, true);
  assert.equal(checkRateLimit(testKey, limit, windowMs).success, true);

  // 4th call should be throttled
  const throttled = checkRateLimit(testKey, limit, windowMs);
  assert.equal(throttled.success, false);
  assert.equal(throttled.remaining, 0);
  assert.ok(throttled.retryAfterSeconds > 0);
});

// ============================================================================
// 6. Contact Form Zod Validation Tests
// ============================================================================
const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(25).optional().or(z.literal("")),
  subject: z.string().min(3).max(150),
  message: z.string().min(10).max(3000),
  category: z.enum(["press", "casting", "sponsorship", "general", "rules"]).default("general"),
  recaptchaToken: z.string().optional(),
});

test("ContactSchema: validates legal and press inquiries", () => {
  const validInquiry = {
    name: "Sarah Jenkins",
    email: "sjenkins@variety.com",
    subject: "Press Accreditation Request for Season 1 Screening",
    message: "We would like to request media credentials to cover the opening perimeter reveal episode.",
    category: "press",
  };

  const parsed = ContactSchema.safeParse(validInquiry);
  assert.equal(parsed.success, true);
});

test("ContactSchema: rejects spam or short messages", () => {
  const spam = {
    name: "A",
    email: "not-an-email",
    subject: "Hi",
    message: "short",
  };

  const parsed = ContactSchema.safeParse(spam);
  assert.equal(parsed.success, false);
  assert.ok(parsed.error.errors.length >= 3);
});
