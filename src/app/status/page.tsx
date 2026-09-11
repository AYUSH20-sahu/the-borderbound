"useclient";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Award,
  Calendar,
  Compass,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

interface StatusResult {
  found: boolean;
  applicationId: string;
  status: "pending" | "under_review" | "shortlisted" | "rejected" | "selected";
  submittedAt: string;
  sectorPreference: string;
  applicantMasked: string;
}

export default function StatusPage() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [query, setQuery] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StatusResult | null>(null);

  const fetchStatus = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const isEmail = searchTerm.includes("@");
      const paramKey = isEmail ? "email" : "id";
      const res = await fetch(
        `/api/applications?${paramKey}=${encodeURIComponent(searchTerm.trim())}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Application not found.");
      }

      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lookup failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialEmail) {
      fetchStatus(initialEmail);
    }
  }, [initialEmail]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStatus(query);
  };

  const getStatusBadge = (status: StatusResult["status"]) => {
    switch (status) {
      case "selected":
        return {
          label: "OFFICIAL CONTESTANT SELECTED",
          color: "text-red-400 bg-red-600/20 border-red-500/50",
          icon: Award,
          desc: "Congratulations! You have been selected into the final 32 cast members for Season 1. The executive producer team will reach out via phone.",
        };
      case "shortlisted":
        return {
          label: "SHORTLISTED — ROUND 2 CALLBACKS",
          color: "text-emerald-400 bg-emerald-500/20 border-emerald-500/40",
          icon: CheckCircle,
          desc: "Your audition tape has cleared the initial screening! You have been advanced to the callback phase for secondary video interviews.",
        };
      case "under_review":
        return {
          label: "UNDER PRODUCER REVIEW",
          color: "text-cyan-400 bg-cyan-500/20 border-cyan-500/40",
          icon: Clock,
          desc: "Your video audition reel is actively being evaluated by the casting directors. Check back regularly for updates.",
        };
      case "rejected":
        return {
          label: "APPLICATION CONCLUDED",
          color: "text-slate-400 bg-slate-800/40 border-slate-700",
          icon: XCircle,
          desc: "Thank you for auditioning for Season 1. Due to high volume, your application was not selected for this season's roster.",
        };
      default:
        return {
          label: "INTAKE PENDING — QUEUED",
          color: "text-amber-400 bg-amber-500/20 border-amber-500/40",
          icon: Clock,
          desc: "Your submission has been logged securely into the casting database and queued for reviewer assignment.",
        };
    }
  };

  return (
    <div className="flex flex-col w-full py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono uppercase tracking-widest mb-4">
          <Shield className="w-3.5 h-3.5" />
          <span>Real-Time Audition Telemetry</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-4">
          Application Status Portal
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Enter your registered Google email address or your official Application ID (e.g., <code>BB-2026-XXXXX</code>).
        </p>
      </div>

      {/* Query Form */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 mb-8">
        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. jordan.miller@gmail.com OR BB-2026-48912"
            className="flex-1 px-4 py-3.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-red-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>{loading ? "Searching..." : "Inspect Status"}</span>
          </button>
        </form>

        {/* Error Feedback */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-950/50 border border-red-500/30 flex items-start gap-3 text-red-300 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Record Not Located</strong>
              {error} Double-check that you entered the exact email address used on your application form.
            </div>
          </div>
        )}

        {/* Result Card */}
        {result && (
          <div className="mt-8 pt-6 border-t border-white/10 animate-in fade-in duration-300">
            {(() => {
              const badge = getStatusBadge(result.status);
              const Icon = badge.icon;
              return (
                <div className="p-6 rounded-2xl bg-black/40 border border-white/10 flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono text-slate-400">
                      IDENTIFIER: <strong className="text-amber-400 font-bold">{result.applicationId}</strong>
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold uppercase ${badge.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{badge.label}</span>
                    </span>
                  </div>

                  <div className="pt-2">
                    <h3 className="text-lg font-bold text-white mb-1">
                      Applicant: {result.applicantMasked}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                      {badge.desc}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/5 text-xs font-mono text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Submitted: {new Date(result.submittedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Compass className="w-3.5 h-3.5 text-slate-500" />
                      <span>Sector Preference: {result.sectorPreference}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      <div className="text-center text-xs text-slate-500 font-mono">
        Haven't submitted an audition reel yet?{" "}
        <Link href="/apply" className="text-red-400 hover:text-red-300 uppercase underline ml-1 font-semibold">
          Apply for Season 1 Now
        </Link>
      </div>
    </div>
  );
}
