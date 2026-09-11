"useclient";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Shield, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight } from "lucide-react";

export default function StatusPage() {
  const [email, setEmail] = useState("");
  const [queried, setQueried] = useState(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setQueried(true);
  };

  return (
    <div className="flex flex-col w-full py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono uppercase tracking-widest mb-4">
          <Shield className="w-3.5 h-3.5" />
          <span>Contestant Portal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-4">
          Check Application Status
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Enter the Google account email address you used to submit your Season 1 audition.
        </p>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 mb-8">
        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. alex.chen@gmail.com"
            className="flex-1 px-4 py-3.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-red-500 transition-colors"
          />
          <button
            type="submit"
            className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Track Application</span>
          </button>
        </form>

        {queried && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-4">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 mt-1">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 uppercase">
                    Status: <strong className="text-amber-400">PENDING_REVIEW</strong>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">ID: #BB-S1-DEMO</span>
                </div>
                <h4 className="text-white font-bold text-base mt-1">
                  Application Logged in System
                </h4>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  Your video audition has been queued for screening by the casting directors. You will receive an email notification if moved to the Shortlist stage.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-slate-500 font-mono">
        Haven't applied yet?{" "}
        <Link href="/apply" className="text-red-400 hover:text-red-300 uppercase underline ml-1">
          Submit your audition form now
        </Link>
      </div>
    </div>
  );
}
