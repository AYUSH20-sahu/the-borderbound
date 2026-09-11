# The Borderbound — Official Reality Competition Platform

The official digital platform for **The Borderbound**, an unscripted reality survival & strategy tournament featuring 32 contestants competing across 4 isolated frontiers for a $1,000,000 grand prize.

---

## 🛠️ Free-Tier Architecture Overview

Strictly adheres to genuinely free, open-source and free-tier infrastructure:

| Component | Technology | Free-Tier Plan & Limits |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) + React 19 + TypeScript | Open Source |
| **Styling** | Tailwind CSS + Cinematic Custom Utilities | Open Source |
| **Hosting** | Vercel Hobby Tier | Free (SSL, CDN, Edge Routing) |
| **Database** | MongoDB Atlas M0 Cluster | 512MB Storage (URL-only pointers) |
| **Auth** | NextAuth.js (Google OAuth) + Custom JWT | Open Source |
| **Media Storage** | Cloudinary Free Tier | 25GB Storage / 25GB Bandwidth |
| **Bot Protection** | Google reCAPTCHA v3 | Free Tier |

---

## 📁 Project Directory Structure

```text
the-borderbound/
├── .env.example               # Full environment variables template
├── next.config.ts             # Next.js config with remote image rules
├── package.json               # Dependencies & scripts
├── postcss.config.mjs         # PostCSS config
├── tailwind.config.ts         # Cinematic entertainment theme tokens
├── tsconfig.json              # TypeScript configuration
└── src/
    ├── app/
    │   ├── globals.css        # Cinematic dark palette, glows & glass panels
    │   ├── layout.tsx         # Root layout with fonts, Navbar & Footer
    │   ├── page.tsx           # Home landing: Hero, live countdown, pillars & biomes
    │   ├── about/             # Show lore, 4 tournament phases & tribunal rules
    │   ├── rules/             # Eligibility criteria, code of conduct & FAQ
    │   ├── contestants/       # 32-player dossier gallery (Phase 2)
    │   ├── apply/             # 4-step contestant application pipeline (Phase 3)
    │   ├── status/            # Applicant tracking portal (Phase 3)
    │   ├── updates/           # Production bulletins & dispatches
    │   └── admin/login/       # Staff portal login (Phase 4)
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx     # Floating glassmorphism navbar with mobile drawer
    │   │   └── Footer.tsx     # Cinematic footer with status ticker
    │   └── ui/
    │       └── CountdownTimer.tsx # Live ticking countdown HUD
    └── lib/
        └── utils.ts           # Class merging and formatting utilities
```

---

## 🚀 Getting Started

1. Clone or open the project folder:
   ```bash
   cd the-borderbound
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏆 Current Progress
- [x] **Phase 1 — Foundation**: Design system, layout, Home, About, and Rules pages.
- [x] **Phase 2 — Contestants Gallery**: Complete 32-player dataset across 4 sectors, search & sector filters, archetype filters, sort controls, and detailed tactical dossier modal.
- [ ] **Next Up: Phase 3 — Application System**: Multi-step registration form, Google auth, file upload pipeline, and DB schema for applications.
- [ ] **Phase 4 — Admin Dashboard**: Admin auth, application list/table, status management, basic analytics.
- [ ] **Phase 5 — Polish**: Social/YouTube embeds, contact form, analytics, performance optimization.
