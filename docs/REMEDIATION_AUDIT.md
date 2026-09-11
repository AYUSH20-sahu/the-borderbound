# Remediation Baseline Audit & Tracking

**Target Repository:** The Borderbound Digital Platform  
**Date:** September 2026  
**Status:** In Remediation (Executing Antigravity Master Fixes)

---

## 1. Discovered Vulnerabilities & Remediation Plan

### Phase 1: Client Directives (P0.1)
- **Problem:** 13 client components had `"useclient";` (missing space) instead of `"use client";`.
- **Files Affected:**
  - `src/components/ui/CountdownTimer.tsx`
  - `src/components/home/TrailerSection.tsx`
  - `src/components/contestants/ContestantCard.tsx`
  - `src/components/contestants/ContestantFilter.tsx`
  - `src/components/contestants/ContestantModal.tsx`
  - `src/components/layout/Navbar.tsx`
  - `src/components/apply/ApplicationWizard.tsx`
  - `src/app/contestants/page.tsx`
  - `src/app/contact/page.tsx`
  - `src/app/admin/login/page.tsx`
  - `src/app/admin/dashboard/page.tsx`
  - `src/app/rules/page.tsx`
  - `src/app/status/page.tsx`
- **Fix:** Replace with standard `"use client";`.

### Phase 2: Insecure Admin Secrets & Credentials Fallback (P0.2)
- **Problem:** `src/lib/adminAuth.ts` had fallback credentials (`borderbound2026!` and default JWT secret string).
- **Fix:** Fail closed. In production, throw an explicit error if `ADMIN_EMAIL`, `ADMIN_PASSWORD`, or `ADMIN_JWT_SECRET` are missing.

### Phase 3: Disable Demo Auth in Production (P0.3)
- **Problem:** `src/lib/auth.ts` unconditionally registered a demo Google CredentialsProvider.
- **Fix:** Restrict demo provider strictly to `NODE_ENV === "development" && process.env.ENABLE_DEMO_AUTH === "true"`.

### Phase 4: Enforce Applicant Auth Server-Side (P0.4)
- **Problem:** `/api/applications` did not verify `getServerSession(authOptions)` server-side.
- **Fix:** Authenticate session server-side on POST `/api/applications`, extract authenticated user identity, reject unauthenticated calls with 401.

### Phase 5: Remove Silent Memory Fallbacks (P0.5)
- **Problem:** Applications API silently stored records in an in-memory `Map()` when MongoDB was disconnected, falsely reporting success.
- **Fix:** Return HTTP 503 Service Unavailable with a clear retry message if MongoDB is required and disconnected. Never fabricate success.

### Phase 6: Make Contact Form Persistent (P1.1)
- **Problem:** `/api/contact` stored messages in a local array `contactInquiries = []`.
- **Fix:** Create Mongoose `ContactInquiry` model and persist inquiries into MongoDB.

### Phase 7: Media Upload Hardening & Validation (P1.2 & P1.3)
- **Problem:** Client-supplied MIME types were trusted; limits were scattered.
- **Fix:** Centralize limits in `src/lib/constants.ts`, validate file extensions, magic bytes/signatures, and server-side constraints.

### Phase 8: Server-Side reCAPTCHA v3 Verification (P1.4)
- **Problem:** reCAPTCHA tokens were not verified server-side.
- **Fix:** Implement server verification against Google siteverify endpoint for forms.

### Phase 9 & 10: Secure Status Lookup & Cryptographic Application IDs (P1.5 & P1.6)
- **Problem:** `Math.random()` was used for IDs; status queries risked enumeration.
- **Fix:** Use `crypto.randomBytes(4)` for high-entropy unique IDs; rate limit and protect status queries.

### Phase 11 & 12: Admin RBAC & JWT Accuracy (P1.7 & P1.8)
- **Problem:** RBAC was not enforced in APIs; HS256 tokens were called "encrypted" instead of "signed".
- **Fix:** Define permission helper `can(user, action)` and enforce in admin routes; correct documentation terminology.
