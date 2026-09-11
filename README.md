# The Borderbound — Official Reality Competition Platform

> Core platform features are implemented, including public pages, contestant application workflow, uploads, applicant status lookup, admin application management, analytics, and CSV export. Production hardening, external-service configuration, and deployment-specific security validation should be completed before handling real applicant data.

The official digital platform for **The Borderbound**, an unscripted reality survival & strategy tournament featuring 32 contestants competing across 4 isolated frontiers for a $1,000,000 grand prize.

---

## 🛠️ Free-Tier Architecture Overview

Strictly adheres to genuinely free, open-source and free-tier infrastructure:

| Component | Technology | Free-Tier Plan & Limits | Implementation Note |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) + React 19 + TypeScript | Open Source | Full-stack server actions & API routes |
| **Styling** | Tailwind CSS + Cinematic Custom Utilities | Open Source | Custom dark theme tokens & glassmorphism |
| **Hosting** | Vercel Hobby Tier | Free (SSL, CDN, Edge Routing) | Serverless execution model |
| **Database** | MongoDB Atlas M0 Cluster | 512MB Storage (URL-only pointers) | Mongoose ODM; fails closed if offline |
| **Applicant Auth** | NextAuth.js (Google OAuth v2) | Free Tier (Google Cloud Console) | Server-side session verification enforced |
| **Admin Auth** | Signed JWT (`jose` HS256) + HTTP-Only Cookie | Open Source / Zero external cost | Role-Based Access Control (`producer`, `casting_director`, `viewer`) |
| **Media Storage** | Cloudinary Free Tier | 25GB Storage / 25GB Bandwidth | Magic byte validation, 5MB image / 50MB video limit |
| **Bot Protection** | Google reCAPTCHA v3 | Free Tier (1M requests/mo) | Server-side token verification |
| **Rate Limiting** | Sliding Window Memory Limiter | In-Memory (Zero cost) | Throttles abuse per IP; suitable for single-instance/demo |

---

## 🔒 Security Architecture & Hardening

1. **Applicant Identity Enforcement (P0.4):**
   - Direct API calls without an active Google NextAuth session return `401 Unauthorized`.
   - The applicant's email address is derived server-side from `session.user.email` and cannot be spoofed via client request payload.
2. **Fail-Closed Persistence (P0.5):**
   - If MongoDB is disconnected or unavailable, API routes return `503 Service Unavailable`.
   - Never silently saves applicant submissions to ephemeral in-memory arrays.
3. **Admin Authentication & RBAC (P0.2, P1.7, P1.8):**
   - Admin credentials and `ADMIN_JWT_SECRET` (minimum 32 characters) must be configured in environment variables; no default passwords or fallback secrets exist in source code.
   - Signs tokens with HS256 and sets `httpOnly`, `sameSite: "lax"`, and `secure: true` in production.
   - Enforces granular Role-Based Access Control:
     - `producer`: Full administrative control, status mutation, note review, and CSV export.
     - `casting_director`: Dossier review, notes, status mutation; prohibited from CSV data export.
     - `viewer`: Read-only access to dossiers and high-level analytics.
4. **Media Upload Hardening (P1.2, P1.3):**
   - Server validates file size: Images <= 5MB, Audition Videos <= 50MB.
   - Magic byte header inspection (`validateImageSignature`) checks real file signatures for JPEG (`ffd8ff`), PNG (`89504e`), and WebP (`RIFF...WEBP`), actively rejecting disguised executables.
   - Client video duration is capped at 60 seconds.
5. **Anti-Enumeration Status Lookup (P1.5):**
   - Status lookup (`/api/applications?id=BB-2026-XXXXXX`) is rate-limited (15 queries per 5 minutes).
   - Applicant names are masked (e.g. `J*** M***`) to prevent PII harvesting.
6. **Cryptographic Identifier Generation (P1.6):**
   - Application IDs use `crypto.randomBytes(3)` to produce collision-resistant IDs (`BB-2026-[0-9A-F]{6}`).

---

## 📁 Project Directory Structure

```text
the-borderbound/
├── .env.example               # Secure environment variables template
├── docs/
│   ├── REMEDIATION_AUDIT.md   # Initial baseline audit & defect log
│   └── FINAL_SECURITY_AND_FUNCTIONALITY_REPORT.md # Final validation report
├── tests/
│   └── core-security-and-validation.test.mjs      # Automated security & validation test suite
├── package.json               # Dependencies, build, lint & test scripts
├── tailwind.config.ts         # Cinematic entertainment theme tokens
├── tsconfig.json              # TypeScript configuration
└── src/
    ├── app/
    │   ├── globals.css        # Cinematic dark palette, glows & glass panels
    │   ├── layout.tsx         # Root layout with fonts, NextAuth SessionProvider, Navbar & Footer
    │   ├── page.tsx           # Home landing: Hero, countdown timer, pillars & biomes
    │   ├── about/             # Show lore, 4 tournament phases & tribunal rules
    │   ├── rules/             # Eligibility criteria, code of conduct & FAQ
    │   ├── contestants/       # 32-player dossier gallery with modal and filters
    │   ├── apply/             # 4-step contestant application pipeline
    │   ├── status/            # Masked applicant tracking portal
    │   ├── updates/           # Production bulletins & dispatches
    │   ├── contact/           # Persistent contact & media press inquiries
    │   ├── admin/login/       # Staff portal login
    │   ├── admin/dashboard/   # Protected management console with RBAC
    │   └── api/
    │       ├── applications/  # Application submission & masked status lookup
    │       ├── upload/        # Cloudinary upload handler with magic-byte validation
    │       ├── contact/       # Persistent contact inquiry recording
    │       ├── auth/          # NextAuth.js OAuth endpoints
    │       └── admin/         # Admin login, applications management, and CSV export
    ├── components/            # UI components (Navigation, Wizard, Filters, Player)
    ├── lib/                   # Auth, rate limiting, reCAPTCHA, Cloudinary, and MongoDB utils
    └── models/                # Mongoose models: Application, ContactInquiry
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.18+ or 20+ (Node 22 recommended)
- MongoDB database (local or free MongoDB Atlas M0 cluster)
- Cloudinary account (Free tier)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/AYUSH20-sahu/the-borderbound.git
cd the-borderbound

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local` and populate the required variables:
```bash
cp .env.example .env.local
```

Required variables:
- `MONGODB_URI`: MongoDB connection string.
- `NEXTAUTH_SECRET`: Random 32+ character string (`openssl rand -hex 32`).
- `NEXTAUTH_URL`: Canonical URL (e.g. `http://localhost:3000`).
- `ADMIN_EMAIL`: Staff admin email.
- `ADMIN_PASSWORD`: Staff admin password.
- `ADMIN_JWT_SECRET`: Dedicated 32+ character secret for admin tokens.
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name.
- `CLOUDINARY_API_KEY` & `CLOUDINARY_API_SECRET`: Cloudinary API credentials.

### 4. Running the Test Suite
Run the automated security and validation test suite:
```bash
npm test
```

### 5. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Production Build & Linting
```bash
npm run lint
npm run build
npm run start
```

---

## ⚠️ Free-Tier Security & Operational Disclosures

- **Rate Limiting:** The built-in rate limiter uses an in-memory sliding window Map. On distributed serverless deployments (such as multiple Vercel serverless instances), memory is not shared across instances. For high-scale production, integrate an external distributed cache (such as Upstash Redis Free Tier).
- **Google OAuth:** To audition in production, applicants must sign in with a valid Google account. For local offline testing only, a demo credentials provider can be enabled by explicitly setting `ENABLE_DEMO_AUTH=true` in `NODE_ENV=development`.
- **Database Durability:** All applicant dossiers and contact inquiries are durably stored in MongoDB. When the database is offline, operations fail closed (`503 Service Unavailable`) to prevent phantom or unpersisted records.
