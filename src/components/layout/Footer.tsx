import React from "react";
import Link from "next/link";
import { Shield, Flame, Radio, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#050609] border-t border-white/10 pt-16 pb-12 overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-red-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-600/20 border border-red-500/40">
                <Shield className="w-5 h-5 text-red-500" />
              </div>
              <span className="font-extrabold tracking-widest text-lg text-white uppercase">
                The Borderbound
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              32 Contestants. 4 Isolated Frontiers. 1 Ultimate Victor. A psychological and physical survival tournament testing human loyalty, endurance, and strategy to the absolute edge.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-md w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>OFFICIAL BROADCAST NETWORK • SEASON 1</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-300 font-semibold">
              The Tournament
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-slate-400">
              <li>
                <Link href="/about" className="hover:text-red-400 transition-colors">
                  Show Concept & Lore
                </Link>
              </li>
              <li>
                <Link href="/contestants" className="hover:text-red-400 transition-colors">
                  The 32 Contestants
                </Link>
              </li>
              <li>
                <Link href="/rules" className="hover:text-red-400 transition-colors">
                  Rules of Engagement
                </Link>
              </li>
              <li>
                <Link href="/updates" className="hover:text-red-400 transition-colors">
                  Production Dispatches
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Applications & Auditions */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-300 font-semibold">
              Auditions
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-slate-400">
              <li>
                <Link href="/apply" className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  Submit Audition Form
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-red-400 transition-colors">
                  Check Submission Status
                </Link>
              </li>
              <li>
                <Link href="/rules#eligibility" className="hover:text-red-400 transition-colors">
                  Eligibility Criteria
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-red-400 transition-colors">
                  Sponsorship & Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Admin */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-slate-300 font-semibold">
              Platform
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-slate-400">
              <li>
                <Link href="/admin/login" className="hover:text-slate-200 transition-colors flex items-center gap-1">
                  <span>Producer Portal</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <span className="text-xs text-slate-500 font-mono">
                  Stack: Next.js 15 • MongoDB Atlas • Cloudinary
                </span>
              </li>
              <li>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                  <span>Telemetry Active</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <p>© {new Date().getFullYear()} The Borderbound Productions Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-slate-400 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/rules" className="hover:text-slate-400 transition-colors">
              Contestant Waiver
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
