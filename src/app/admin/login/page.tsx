"useclient";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Admin authentication will activate in Phase 4.");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/40 text-red-500 mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Production Staff Portal
          </h1>
          <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mt-1">
            Restricted Access • Casting & Administration
          </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 transition-colors flex items-center justify-center gap-2"
            >
              <span>Authenticate Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center text-[11px] font-mono text-slate-500">
            Secure JWT Auth Layer • Phase 4 Feature
          </div>
        </div>
      </div>
    </div>
  );
}
