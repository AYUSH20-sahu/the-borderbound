import React from "react";
import Link from "next/link";
import { Flame, Shield, CheckCircle2, Lock, ArrowRight, User, Video, Compass, FileCheck } from "lucide-react";

export default function ApplyPage() {
  return (
    <div className="flex flex-col w-full py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono uppercase tracking-widest mb-4">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Season 1 Auditions</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-4">
          Contestant Application
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Take the first step toward the $1,000,000 championship. The multi-step application pipeline will open completely in Phase 3.
        </p>
      </div>

      {/* The 4-Step Pipeline Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { step: "01", name: "Personal Bio", desc: "Contact details, background & physical stats", icon: User },
          { step: "02", name: "Audition Reel", desc: "60-sec video pitch & high-res headshot", icon: Video },
          { step: "03", name: "Strategy & Lore", desc: "Sector preference & game strategy", icon: Compass },
          { step: "04", name: "Verification", desc: "Google sign-in & eligibility consent", icon: FileCheck },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.step} className="hud-corner glass-panel p-5 rounded-xl border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-red-400">STEP {s.step}</span>
                  <Icon className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="text-base font-bold text-white mb-1">{s.name}</h4>
                <p className="text-xs text-slate-400">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center">
        <h3 className="text-xl font-bold text-white uppercase mb-2">
          Audition Portal Configuration Underway
        </h3>
        <p className="text-sm text-slate-400 max-w-lg mx-auto mb-6">
          In <strong>Phase 3</strong>, this page will activate Google OAuth, Cloudinary direct upload integration, and real-time MongoDB application storage.
        </p>
        <Link
          href="/rules"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-mono uppercase tracking-wider font-bold bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all"
        >
          <span>Prepare Your Video Audition Guidelines</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
