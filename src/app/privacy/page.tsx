import React from "react";
import Link from "next/link";
import { Shield, Lock, AlertCircle, ArrowLeft, Database, Cloud } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col w-full py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>

      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono uppercase tracking-widest mb-3">
          <Lock className="w-3.5 h-3.5" />
          <span>Security & Data Protection</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-2">
          Privacy Policy & Architecture Disclosure
        </h1>
        <p className="text-slate-400 text-xs font-mono">
          Last Updated: September 2026 • The Borderbound Platform
        </p>
      </div>

      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 flex flex-col gap-8 text-slate-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-white uppercase mb-2">
            1. Information Collected
          </h2>
          <p>
            We collect the personal information you supply directly via the Season 1 Audition Form, including legal name, email, phone number, age, occupation, hometown, passport status, headshot photograph, 60-second video audition reel, and strategy statements.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white uppercase mb-2">
            2. Transparent Storage & Infrastructure Architecture
          </h2>
          <p className="mb-3">
            In accordance with open digital standards and lean cloud deployment, this platform operates on genuinely free-tier verified cloud infrastructure:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-start gap-3">
              <Database className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-1">MongoDB Atlas M0 Cluster</strong>
                Application metadata is stored in lean JSON documents (512MB limit). No heavy binary files are embedded directly into database rows; media pointers and URLs are referenced externally.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-start gap-3">
              <Cloud className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-1">Cloudinary Free Tier</strong>
                Headshot photos (max 5MB) and audition videos (max 50MB, 60 seconds) are stored in secure cloud storage under monthly bandwidth management.
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-white uppercase mb-2">
            3. Security Baseline & Transparent Limitations
          </h2>
          <p className="mb-3">
            We implement code-level protections to ensure applicant integrity without relying on paid enterprise add-ons:
          </p>
          <ul className="flex flex-col gap-2 text-xs font-mono text-slate-400 mb-4">
            <li>• Server-side Zod input sanitization and schema validation on all API endpoints.</li>
            <li>• In-memory sliding-window rate limiting to prevent automated spam floods.</li>
            <li>• Strict MIME-type and byte-size enforcement on media uploads.</li>
            <li>• Encrypted HTTP-only cookies with SameSite flags for administrative staff sessions.</li>
          </ul>

          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold mb-0.5">Transparent Security Disclosure</strong>
              Because this platform operates on zero-cost infrastructure, it does not incorporate a dedicated enterprise Web Application Firewall (WAF), paid DDoS mitigation hardware, or automated malware file scanning. Users should submit standard video formats only.
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-white uppercase mb-2">
            4. Applicant Privacy & Status Lookup
          </h2>
          <p>
            The public application status portal displays only masked candidate initials (e.g. <code>J*** M***</code>) and submission review stages to prevent enumeration and protect personal applicant details.
          </p>
        </section>
      </div>
    </div>
  );
}
