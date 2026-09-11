"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Lock, ArrowRight, Eye, EyeOff, AlertCircle, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed. Check your staff credentials.");
      }

      // Route into the dashboard
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Staff authentication error.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoStaffCredentials = () => {
    setEmail("admin@borderbound.show");
    setPassword("borderbound2026!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-500 mb-4 shadow-lg shadow-red-950/40">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">
            Production Staff Portal
          </h1>
          <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mt-1">
            Restricted Producer & Casting Access
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/50 flex items-start gap-3 text-red-200 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Card */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl">
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Staff Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="producer@borderbound.show"
                className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Staff Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 disabled:opacity-50"
            >
              <span>{loading ? "Verifying Credentials..." : "Authenticate Session"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <button
              type="button"
              onClick={fillDemoStaffCredentials}
              className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-amber-300 uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Autofill Demo Staff Credentials</span>
            </button>
            <div className="text-center text-[10px] font-mono text-slate-500 mt-2">
              Default: admin@borderbound.show • borderbound2026!
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs font-mono text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition-colors">
            ← Return to Public Platform
          </Link>
        </div>
      </div>
    </div>
  );
}
