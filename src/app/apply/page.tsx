import React from "react";
import ApplicationWizard from "@/components/apply/ApplicationWizard";
import { Flame, Shield, Clock, Award, AlertTriangle } from "lucide-react";

export default function ApplyPage() {
  return (
    <div className="flex flex-col w-full py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono uppercase tracking-widest mb-4">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Season 1 Official Audition Portal</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight mb-4">
          Audition For Season 1
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          32 competitors will cross the border. Complete all 4 steps below, attach your 60-second video audition reel, and verify your account.
        </p>
      </div>

      {/* Free-Tier Architecture Assurance Callout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-xs font-mono text-slate-400 max-w-3xl mx-auto">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Rolling review by casting directors</span>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>100% Free Audition (No Fees)</span>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5">
          <Award className="w-4 h-4 text-red-400 shrink-0" />
          <span>$1,000,000 Grand Prize</span>
        </div>
      </div>

      {/* Multi-Step Wizard */}
      <ApplicationWizard />
    </div>
  );
}
