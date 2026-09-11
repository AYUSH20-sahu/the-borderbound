import React from "react";
import Link from "next/link";
import { Shield, FileText, ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
          <FileText className="w-3.5 h-3.5" />
          <span>Legal Bylaws</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-2">
          Terms & Conditions
        </h1>
        <p className="text-slate-400 text-xs font-mono">
          Last Updated: September 2026 • The Borderbound Productions Inc.
        </p>
      </div>

      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 flex flex-col gap-8 text-slate-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-white uppercase mb-2">
            1. Audition Agreement & Eligibility
          </h2>
          <p>
            By submitting an application for Season 1 of "The Borderbound", you warrant that you are at least 21 years of age, hold a valid international passport, and meet all physical and medical clearances set forth by show physicians. All audition submissions are free of charge.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white uppercase mb-2">
            2. Intellectual Property & Media Release
          </h2>
          <p>
            Any video audition reels, photographs, and statements submitted through this platform become the non-exclusive property of The Borderbound Productions Inc. for the purposes of evaluating candidate viability and promotional casting broadcasts.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white uppercase mb-2">
            3. Strict Non-Disclosure & Secrecy
          </h2>
          <p>
            Contestants selected for callbacks and the final 32 cast must execute a comprehensive Non-Disclosure Agreement (NDA). Leaking production filming locations, challenge designs, or elimination outcomes on social media will result in forfeiture of prize eligibility and liquidated damages.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-white uppercase mb-2">
            4. Tournament Rules & Disqualification
          </h2>
          <p>
            The producers reserve the absolute right to disqualify any competitor found engaging in physical violence, unauthorized communications, contraband possession, or intentional environmental hazards as detailed in our <Link href="/rules" className="text-red-400 underline">Rules of Engagement</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
