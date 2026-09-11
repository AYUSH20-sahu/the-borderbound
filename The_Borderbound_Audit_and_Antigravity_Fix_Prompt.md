# The Borderbound — Complete Audit Report & Antigravity Fix Master Prompt

## 1. Purpose

This document combines the full audit of the current **The Borderbound** repository with a copy-paste-ready **Antigravity remediation prompt**.

Repository:
- GitHub: https://github.com/AYUSH20-sahu/the-borderbound

Reference requirements:
- The project master prompt specifies a premium/cinematic reality-competition platform with public pages, contestant applications, uploads, applicant status lookup, protected admin management, analytics, CSV export, and free-tier infrastructure. 
- The master prompt also explicitly requires server-side validation, rate limiting, JWT expiry, environment variables, secure cookies, file validation, reCAPTCHA, and clear disclosure of free-tier security limitations.

---

# 2. Executive Audit

## Overall Scores

| Area | Score | Assessment |
|---|---:|---|
| Architecture | 8/10 | Good Next.js full-stack structure |
| UI / Visual Design | 8/10 | Strong cinematic portfolio presentation |
| Application System | 6/10 | Good flow, but backend enforcement gaps |
| Admin System | 5/10 | Functional prototype, production security gaps |
| Authentication | 5/10 | JWT approach is reasonable, but demo/fallback risks exist |
| Upload System | 6/10 | Good basic limits, incomplete media validation |
| Database/Persistence | 5/10 | MongoDB exists, but memory fallbacks are dangerous |
| Security | 4/10 | Several production-hardening issues |
| Testing | 3/10 | Automated coverage is insufficient |
| Requirement Coverage | 7/10 | Most major features exist, some requirements are incomplete |
| Production Readiness | 4.5/10 | Needs hardening before real applicant data |
| Portfolio Value | 8/10 | Very relevant to the target Web Developer role |

### Overall conclusion

The project is a **strong full-stack prototype / portfolio demonstration**, but it should not currently be described as fully production-ready.

The UI and architecture are good enough to demonstrate real development ability. The main weaknesses are security enforcement, persistence fallbacks, authentication design, testing, and production hardening.

---

# 3. Critical Findings

## P0 — Fix Before Employer Review

### P0.1 Incorrect `"useclient"` directive

The following files contain:

```tsx
"useclient";
```

instead of:

```tsx
"use client";
```

Known affected areas:
- `src/app/status/page.tsx`
- `src/components/apply/ApplicationWizard.tsx`

These files use React client hooks such as `useState`, `useEffect`, and/or `useSearchParams`.

### Required fix

Replace the directive with:

```tsx
"use client";
```

Then run:
- TypeScript check
- lint
- production build
- browser verification

---

## P0.2 Default admin credentials / secret fallback

The admin authentication implementation has fallback values for credentials/secrets.

This is unsafe because a production deployment with missing environment variables could silently use predictable credentials.

### Required behavior

Production must fail closed.

Do NOT use:

```ts
process.env.ADMIN_PASSWORD || "some-default-password"
```

or:

```ts
process.env.ADMIN_JWT_SECRET || "some-default-secret"
```

Instead:

```ts
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const jwtSecret = process.env.ADMIN_JWT_SECRET;

if (!adminEmail || !adminPassword || !jwtSecret) {
  throw new Error("Required admin environment variables are missing");
}
```

Never expose real credentials in source control.

---

## P0.3 Google demo authentication must not be available in production

The project contains a Google-demo credential provider intended for testing.

That is acceptable only for local development.

### Required behavior

The demo provider must be disabled unless an explicit development flag is enabled.

Example:

```ts
const enableDemoAuth =
  process.env.NODE_ENV === "development" &&
  process.env.ENABLE_DEMO_AUTH === "true";
```

Production must use actual Google OAuth verification.

---

## P0.4 Google authentication must be enforced server-side

The frontend currently checks Google verification before submission, but frontend checks can be bypassed by directly calling the API.

The master requirement says Google Sign-In is required before submission.

### Required behavior

The application API must verify the authenticated session server-side.

Do not trust a browser-supplied:

```json
{
  "googleId": "anything"
}
```

The server must derive identity from the authenticated session.

Preferred flow:

```text
Google OAuth
    ↓
NextAuth session
    ↓
POST /api/applications
    ↓
Server verifies session
    ↓
Application associated with authenticated user
    ↓
MongoDB
```

Unauthorized direct API calls must return `401`.

---

## P0.5 Never silently fall back to in-memory persistence

The application API currently has an in-memory fallback when MongoDB is unavailable.

This is dangerous for real applicant data.

A serverless deployment can lose this data between invocations.

### Required behavior

If MongoDB is required and unavailable:

```text
MongoDB unavailable
      ↓
503 Service Unavailable
      ↓
Clear retry message
```

Never report a successful application submission if it was not durably persisted.

The same principle applies to admin application data.

---

# 4. High-Priority Findings

## P1.1 Contact form uses in-memory storage

The contact API stores inquiries in an in-memory array.

This means submissions are not durable and may disappear.

### Required fix

Create a MongoDB contact/inquiry model.

Suggested model:

```text
ContactInquiry
- name
- email
- phone (optional)
- subject
- message
- type/category
- status
- createdAt
- updatedAt
```

Persist every submission.

If email notifications are not implemented, do not claim that the message has been "routed to the executive team."

---

## P1.2 Video duration is not actually validated

The requirements call for short audition clips.

The implementation checks file size/type, but actual video duration should be validated rather than trusting client metadata.

### Required fix

Implement server-side media-duration validation where practical.

Reject videos outside the configured maximum duration.

The limit must be centralized in configuration, not duplicated across components.

---

## P1.3 File validation needs stronger server-side checks

Do not rely solely on:

```ts
file.type
```

because MIME information comes from the client/request.

### Required behavior

Validate:
- file size
- allowed extension
- MIME type
- actual file signature where feasible
- image dimensions where relevant
- video duration
- upload destination
- generated Cloudinary URL

Never accept executable/script file types.

---

## P1.4 reCAPTCHA requirement is incomplete

The master requirements explicitly call for reCAPTCHA v3 on public-facing forms.

Rate limiting is not a substitute for bot verification.

### Required fix

Implement reCAPTCHA v3 on appropriate public forms, especially:
- application submission
- contact form

Verify the token server-side.

Do not accept a client-only success flag.

Use environment variables for site/secret keys.

---

## P1.5 Status lookup is weakly authenticated

An email-only application status lookup can expose whether a particular person has an application.

### Required improvement

Prefer:

```text
Application ID + authenticated applicant
```

or another secure verification mechanism.

If email lookup remains, do not return sensitive applicant information and add:
- rate limiting
- generic responses
- abuse protection
- careful error messages

Never allow enumeration of applicant records.

---

## P1.6 Application ID generation should use cryptographically secure randomness

Avoid:

```ts
Math.random()
```

for security-sensitive identifiers.

Use:

```ts
crypto.randomUUID()
```

or another cryptographically secure identifier.

If a human-readable ID is required, combine a secure random value with the desired prefix.

---

# 5. Admin / RBAC Findings

## P1.7 RBAC is only partially implemented

The code supports role concepts such as producer/casting director, but the current login flow effectively assigns the same role.

That means role-based access control is not yet meaningfully enforced.

### Required fix

Define an explicit permission matrix.

Example:

```text
producer
- view applications
- search/filter
- update status
- internal notes
- analytics
- CSV export

casting_director
- view applications
- review applications
- update permitted statuses
- internal notes

viewer
- read-only
```

Adjust according to the actual business requirements.

Enforce authorization on the server/API, not just by hiding frontend buttons.

---

# 6. JWT Findings

## P1.8 Correct the "encrypted JWT" terminology

If the implementation uses:

```text
HS256
```

with `SignJWT`, the token is **signed**, not encrypted.

Use accurate comments/documentation:

```text
Creates a signed JWT with an 8-hour expiration.
```

Do not claim that the JWT payload is encrypted.

---

# 7. Rate Limiting

## P2.1 Current in-memory rate limiter is suitable only for low-scale/demo use

An in-memory Map does not provide reliable distributed protection on serverless infrastructure.

### Recommended production improvement

Use a distributed free-tier-compatible limiter if available.

If keeping the in-memory implementation for the demo:
- document the limitation
- apply it to every public sensitive endpoint
- never present it as enterprise-grade protection

---

# 8. Testing Audit

## Current assessment: 3/10

There is insufficient automated testing for a system involving:
- authentication
- applicant data
- file uploads
- admin actions
- status changes
- persistence

### Minimum recommended coverage

## Unit tests

- application schema validation
- status transition rules
- application ID generation
- authentication helpers
- rate limiter
- upload validation

## API/integration tests

- application creation
- unauthorized application creation
- duplicate application handling
- application status lookup
- admin login
- unauthorized admin API access
- role restrictions
- status update
- contact submission
- upload rejection for invalid files

## E2E

At least:

```text
Applicant:
Landing → Apply → Auth → Form → Upload → Submit → Status

Admin:
Login → Applications → Filter → Open → Update Status → Verify

Security:
Unauthenticated API → 401
Unauthorized role → 403
Invalid upload → rejection
Invalid form → validation error
```

---

# 9. README Accuracy

The README currently presents the project as fully completed.

After this audit, that is too strong.

Use wording closer to:

> Core platform features are implemented, including public pages, contestant application workflow, uploads, applicant status lookup, admin application management, analytics, and CSV export. Production hardening, external-service configuration, and deployment-specific security validation should be completed before handling real applicant data.

This is more accurate and professional.

---

# 10. What Is Already Good

Do NOT unnecessarily rewrite working parts.

The project already has several strengths:

- Next.js App Router
- React
- TypeScript
- Tailwind
- structured source tree
- MongoDB/Mongoose integration
- Zod validation
- NextAuth integration
- JWT admin authentication
- Cloudinary upload architecture
- responsive UI
- cinematic design direction
- contestant gallery
- multi-step application wizard
- application status states
- admin dashboard
- filters/search
- analytics UI
- CSV export
- environment variable template

The master requirements specifically ask for a premium/cinematic mobile-first experience and explicitly say design, UX, functionality, and code structure should not be compromised even under free-tier constraints. The current project is strongest in these areas.

---

# 11. Recommended Final Architecture

After remediation:

```text
Browser
   │
   ├── Public Pages
   │
   ├── Applicant Auth
   │       └── Google OAuth / NextAuth
   │
   └── Admin Auth
           └── Signed JWT + RBAC
                │
                ▼
        Next.js API Routes
                │
        ┌───────┼────────┐
        ▼       ▼        ▼
     Zod    Auth/RBAC  Rate Limit
        │       │        │
        └───────┼────────┘
                ▼
            MongoDB
                │
                └── Cloudinary
                    (media only)
```

Rules:

1. Browser input is never trusted.
2. Authorization is enforced server-side.
3. MongoDB failure never silently becomes memory storage.
4. Secrets exist only in environment variables.
5. Demo auth is development-only.
6. Media is validated before persistence.
7. Public sensitive endpoints are rate-limited.
8. Applicant data is minimized.
9. Errors do not leak sensitive implementation details.

---

# 12. COPY-PASTE ANTIGRAVITY MASTER REMEDIATION PROMPT

Paste the following prompt into Antigravity at the project root.

---

## ROLE

You are the senior full-stack engineer responsible for **auditing, fixing, hardening, testing, and validating the existing "The Borderbound" application**.

This is an EXISTING project.

**Do NOT rebuild the application from scratch.**

Preserve the existing:
- UI
- visual design
- routes
- working features
- component structure
- database schema where possible
- API contracts where possible
- Cloudinary integration
- NextAuth integration
- admin dashboard
- application wizard

Only modify what is necessary to fix verified problems and improve production safety.

---

## SOURCE OF TRUTH

Before making changes, inspect the ENTIRE project:

```text
/src
/public
/package.json
/next.config.*
/tsconfig.json
/tailwind.config.*
/.env.example
README*
```

Also inspect all:
- API routes
- auth files
- models
- upload utilities
- rate-limit utilities
- admin components
- application components
- status page
- contact API
- database connection code

Do not guess about existing functionality.

---

# PHASE 0 — BASELINE AUDIT

Before changing code:

1. Run the project.
2. Run lint.
3. Run TypeScript validation.
4. Run production build.
5. Inspect browser console.
6. Test:
   - homepage
   - contestants
   - application
   - status
   - admin login
   - admin applications
   - contact
7. Inspect API requests in browser network tools.
8. Record every failure.

Create:

```text
/docs/REMEDIATION_AUDIT.md
```

with:
- current status
- discovered errors
- files affected
- planned fixes

Do not stop after the first error.

---

# PHASE 1 — FIX CLIENT DIRECTIVES

Search the entire project for:

```text
"useclient"
```

Replace incorrect directives with:

```tsx
"use client";
```

Pay particular attention to:

```text
src/app/status/page.tsx
src/components/apply/ApplicationWizard.tsx
```

Then verify all client-hook files.

Run:

```bash
npm run lint
npm run build
```

Fix any resulting errors.

---

# PHASE 2 — REMOVE INSECURE DEFAULT ADMIN CREDENTIALS

Search the entire project for:

```text
ADMIN_PASSWORD
ADMIN_EMAIL
ADMIN_JWT_SECRET
default password
fallback secret
```

Remove production fallback credentials.

NEVER use:

```ts
process.env.ADMIN_PASSWORD || "default"
```

NEVER use a hardcoded JWT secret.

Required production behavior:

```ts
const required = [
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "ADMIN_JWT_SECRET",
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`${key} is required`);
  }
}
```

Do not expose secrets in:
- source
- logs
- API responses
- client bundles
- README
- screenshots

Update:

```text
.env.example
```

with placeholders only.

---

# PHASE 3 — DISABLE DEMO AUTH IN PRODUCTION

Find any demo Google authentication provider.

It may be used for local development only.

Implement:

```text
NODE_ENV === development
AND
ENABLE_DEMO_AUTH === true
```

Only then may demo authentication exist.

In production:
- demo provider must not be registered
- demo credentials must not work
- actual Google OAuth must be used

Test both development and production behavior.

---

# PHASE 4 — ENFORCE APPLICANT AUTH SERVER-SIDE

The frontend must NEVER be the authority for Google verification.

The application submission API must verify the authenticated NextAuth session.

Required logic:

```text
POST /api/applications
        ↓
Validate session
        ↓
No session → 401
        ↓
Validate request body with Zod
        ↓
Check duplicate application
        ↓
Persist authenticated user identity
        ↓
Persist application
```

Do not trust:

```json
{
  "googleId": "client supplied value"
}
```

If `googleId` remains in the schema for compatibility, compare it with the authenticated identity rather than trusting it.

Do not allow anonymous direct API submission.

Test:

1. browser submission
2. direct unauthenticated POST
3. manipulated googleId
4. duplicate submission

---

# PHASE 5 — REMOVE DANGEROUS MEMORY FALLBACKS

Find all:

```text
Map()
Array()
runtimeApplications
in-memory fallback
INITIAL_APPLICATIONS
```

used as persistence.

Separate:

### Development seed/demo data

from:

### Production data

MongoDB must be the authoritative production database.

If MongoDB is unavailable:

```text
return HTTP 503
```

Do NOT:

```text
save to memory
return success
```

Do not show seed data as if it were real applicant data.

The UI should display a useful retry/error state.

Apply this to:
- applications
- admin applications
- contact inquiries
- any other persistent user data

---

# PHASE 6 — MAKE CONTACT FORM PERSISTENT

Create a Mongoose model such as:

```text
ContactInquiry
```

Fields:

```text
name
email
phone (optional)
subject
message
category/type
status
createdAt
updatedAt
```

POST flow:

```text
Validate with Zod
      ↓
Rate limit
      ↓
reCAPTCHA verification
      ↓
MongoDB
      ↓
success response
```

Do not claim the inquiry was forwarded unless an actual forwarding mechanism exists.

---

# PHASE 7 — HARDEN FILE UPLOADS

Inspect the complete Cloudinary upload flow.

Validate server-side:

- maximum size
- allowed MIME types
- allowed extensions
- actual file signature where practical
- image dimensions where required
- video duration
- upload resource type
- generated Cloudinary URL

Centralize limits:

```text
MAX_IMAGE_SIZE
MAX_VIDEO_SIZE
MAX_VIDEO_DURATION_SECONDS
```

Do not trust client-side validation.

Reject:
- executables
- scripts
- unknown file types
- oversized files
- videos exceeding duration limit

Never expose Cloudinary secrets to the browser.

---

# PHASE 8 — IMPLEMENT SERVER-SIDE reCAPTCHA

The requirements call for reCAPTCHA v3 on public-facing forms.

Implement it server-side for:

- application submission
- contact form

Required flow:

```text
Browser receives reCAPTCHA token
          ↓
POST API
          ↓
Server sends token to reCAPTCHA verification
          ↓
Verification fails → 400/403
          ↓
Verification succeeds → continue
```

Never trust:

```json
{
  "captchaVerified": true
}
```

from the browser.

Use environment variables:

```text
NEXT_PUBLIC_RECAPTCHA_SITE_KEY
RECAPTCHA_SECRET_KEY
```

Do not hardcode secrets.

If configuration is missing in development, make the behavior explicit and documented rather than silently pretending verification happened.

---

# PHASE 9 — IMPROVE STATUS LOOKUP SECURITY

Review:

```text
/api/applications
/status
```

Do not expose sensitive applicant information.

Prefer:

```text
authenticated applicant → own application
```

If public lookup remains necessary:

```text
Application ID
+
secure verification
```

must be used.

At minimum:
- rate limit lookup
- avoid revealing whether arbitrary email addresses exist
- avoid returning personal contact information
- use generic error messages
- prevent enumeration

---

# PHASE 10 — SECURE APPLICATION IDS

Find any:

```ts
Math.random()
```

used for application IDs.

Replace with cryptographically secure randomness.

Preferred:

```ts
crypto.randomUUID()
```

If a human-friendly ID is required, generate it using secure randomness.

Ensure uniqueness with a database unique index.

Handle collisions gracefully.

---

# PHASE 11 — IMPLEMENT REAL RBAC

Audit admin roles.

Define roles and permissions clearly.

Example:

```text
producer
casting_director
```

Do not assign every user the same role unless that is explicitly required.

Create a centralized authorization helper.

Example concept:

```ts
can(user, "application:update")
```

Enforce authorization in API routes.

Frontend hiding is NOT security.

Test:

```text
producer → permitted actions
casting_director → permitted actions
unauthorized → 403
```

---

# PHASE 12 — JWT HARDENING

Keep signed JWT authentication if it is appropriate for the existing architecture.

Requirements:

- strong secret from environment
- explicit expiration
- HTTP-only cookie
- Secure cookie in production
- SameSite protection
- no sensitive data in payload
- server-side verification
- no client-controlled role

Use accurate terminology.

If using HS256:

```text
signed JWT
```

NOT:

```text
encrypted JWT
```

---

# PHASE 13 — RATE LIMITING

Audit all public sensitive endpoints:

```text
application submission
contact
status lookup
admin login
uploads
```

Ensure they have appropriate rate limits.

If the current in-memory limiter is retained for the demo, document that it is not distributed.

Prefer a free-tier distributed solution if it fits the existing stack and constraints.

Do not introduce paid infrastructure.

---

# PHASE 14 — ERROR HANDLING

Audit all API routes.

Never return:
- stack traces
- DB connection strings
- secrets
- internal file paths
- raw provider errors containing credentials

Use consistent response structures.

Example:

```json
{
  "success": false,
  "error": "Unable to process request"
}
```

Log detailed errors server-side only.

---

# PHASE 15 — DATABASE HARDENING

Audit all Mongoose models.

Ensure:
- unique application ID
- useful indexes
- email indexing where appropriate
- status indexing
- timestamps
- validation
- lean documents
- no huge embedded media binaries

Cloudinary should store media.

MongoDB should store metadata/URLs.

---

# PHASE 16 — TEST SUITE

Add a practical automated test suite.

Do NOT create fake tests that only assert `true`.

Test real behavior.

Minimum:

### Unit

- Zod validation
- ID generation
- status transitions
- upload validation
- authorization helper

### API

- authenticated application submission
- unauthenticated application rejection
- duplicate application
- contact submission
- admin login
- unauthorized admin request
- RBAC
- status update
- invalid upload

### E2E

Applicant:

```text
Home
→ Apply
→ Google auth
→ form
→ upload
→ submit
→ application ID
→ status
```

Admin:

```text
Login
→ dashboard
→ search
→ filter
→ open application
→ update status
→ verify
```

---

# PHASE 17 — SECURITY REVIEW

Search the entire project for:

```text
password
secret
api_key
apikey
token
JWT
authorization
console.log
process.env
NEXT_PUBLIC_
```

Confirm:
- no real secrets committed
- no credentials in client code
- no admin password in frontend
- no Cloudinary secret in frontend
- no MongoDB URI exposed
- no JWT secret exposed
- no debug authentication endpoint exposed

Check `.gitignore`.

---

# PHASE 18 — PRODUCTION BUILD

Run:

```bash
npm install
npm run lint
npm run build
```

Fix ALL errors.

Then run the production server and test every major route.

Verify:

```text
/
 /about
 /contestants
 /apply
 /status
 /rules
 /updates
 /contact
 /admin
```

and all corresponding APIs.

---

# PHASE 19 — RESPONSIVE QA

Test at minimum:

```text
360px
390px
768px
1024px
1280px
1440px
```

Check:
- navigation
- hero
- contestant cards
- application wizard
- upload UI
- admin tables
- modals
- forms
- buttons
- status page

Do NOT redesign the existing UI unless a functional problem requires it.

---

# PHASE 20 — PERFORMANCE

Check:
- `next/image`
- image dimensions
- lazy loading
- unnecessary client components
- bundle size
- large dependencies
- duplicate API requests
- loading states
- error states

Do not add unnecessary animation libraries.

Preserve the cinematic design.

---

# PHASE 21 — UPDATE DOCUMENTATION

Update:

```text
README.md
.env.example
/docs/REMEDIATION_AUDIT.md
```

README must accurately describe:
- implemented functionality
- free-tier limitations
- production requirements
- required environment variables
- setup steps
- test commands
- deployment notes

Do NOT claim:
- production-ready
- enterprise security
- real executive email forwarding
- encrypted JWT
- Google verification
unless the implementation actually provides it.

---

# PHASE 22 — FINAL VALIDATION REPORT

Create:

```text
/docs/FINAL_SECURITY_AND_FUNCTIONALITY_REPORT.md
```

Include:

## Fixed

List every fixed issue.

## Remaining limitations

List only genuine remaining limitations.

## Authentication

Explain applicant and admin authentication.

## Authorization

Explain RBAC.

## Storage

Explain MongoDB + Cloudinary.

## Security

Explain:
- validation
- rate limiting
- reCAPTCHA
- secure cookies
- secret handling
- upload validation

## Testing

List commands and results.

## Production readiness

Give an honest status:

```text
READY
READY WITH CONFIGURATION
NOT READY
```

Do not mark READY if critical security or data-loss problems remain.

---

# GIT / CHANGE MANAGEMENT RULES

Before starting, inspect:

```bash
git status
git branch
git log --oneline -10
```

Do NOT delete history.

Do NOT reset the project.

Do NOT force-push.

Do NOT change unrelated files.

Create logical commits.

Suggested sequence:

```text
fix: correct client component directives
fix: harden admin authentication
fix: enforce applicant authentication
fix: remove persistence fallbacks
fix: harden uploads and captcha
fix: secure status lookup and application ids
fix: implement admin RBAC
test: add authentication and application tests
docs: update audit and production documentation
```

After every logical milestone:

```bash
git status
npm run lint
npm run build
```

If tests exist, run them too.

---

# ABSOLUTE RULES

1. Do NOT rebuild the project.
2. Do NOT replace Next.js.
3. Do NOT replace MongoDB unless technically unavoidable.
4. Do NOT replace Cloudinary without a verified reason.
5. Do NOT remove working features just to simplify the code.
6. Do NOT introduce paid services.
7. Do NOT hardcode credentials.
8. Do NOT trust client-side authentication flags.
9. Do NOT trust client-side file validation.
10. Do NOT silently store production data in memory.
11. Do NOT expose applicant personal data unnecessarily.
12. Do NOT invent APIs that are not needed.
13. Do NOT fabricate successful persistence.
14. Do NOT claim a feature is implemented until it is tested.
15. Do NOT mark the project production-ready while P0 issues remain.
16. Preserve the existing cinematic design.
17. Make the smallest safe change necessary.
18. Test after every milestone.
19. Inspect actual implementation before deciding that a feature is missing.
20. At the end, provide a concise summary of changed files, fixes, tests, and remaining limitations.

---

# FINAL SUCCESS CRITERIA

The remediation is complete only when:

- `npm run lint` passes
- `npm run build` passes
- applicant auth is enforced server-side
- demo auth cannot work in production
- default admin credentials are removed
- JWT secret has no fallback
- MongoDB failures do not cause fake successful submissions
- contact submissions are persistent
- uploads have server-side validation
- video duration is validated
- reCAPTCHA is server-verified
- status lookup cannot easily enumerate applicants
- application IDs use secure randomness
- admin RBAC is actually enforced
- sensitive errors are not exposed
- tests cover critical workflows
- responsive QA has been performed
- README accurately reflects reality
- final security report is created

Do not stop after fixing the first error.

Perform the complete remediation, test the result, and report what was actually verified.
