"useclient";

import React, { useEffect } from "react";
import Image from "next/image";
import { Contestant } from "@/types/contestant";
import { X, Shield, Award, AlertTriangle, Skull, Target, Zap, Activity, Users, Flame, Play } from "lucide-react";

interface ContestantModalProps {
  contestant: Contestant | null;
  onClose: () => void;
}

export default function ContestantModal({ contestant, onClose }: ContestantModalProps) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!contestant) return null;

  const isEliminated = contestant.status === "eliminated";

  const getThreatBadge = (level: string) => {
    if (level === "Critical") {
      return (
        <span className="px-2.5 py-1 rounded-md text-xs font-mono uppercase bg-red-600/20 text-red-400 border border-red-500/40 animate-pulse">
          Critical Threat
        </span>
      );
    }
    if (level === "High") {
      return (
        <span className="px-2.5 py-1 rounded-md text-xs font-mono uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40">
          High Threat
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-md text-xs font-mono uppercase bg-blue-500/20 text-blue-400 border border-blue-500/40">
        Moderate Threat
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop click handler */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#0B0E14] border border-white/15 shadow-2xl overflow-hidden z-10 my-auto flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-slate-300 hover:text-white border border-white/15 hover:border-white/30 transition-colors"
          aria-label="Close dossier"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image & Badges */}
        <div className="relative w-full md:w-5/12 h-80 md:h-auto min-h-[350px] bg-slate-900">
          <Image
            src={contestant.avatarUrl}
            alt={contestant.name}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent to-black/50" />

          {/* Overlay info */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase bg-black/70 border border-white/20 text-white backdrop-blur-md">
              <Shield className="w-3.5 h-3.5 text-red-500" />
              {contestant.sector}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="text-xs font-mono text-slate-400 uppercase mb-1">
              Contestant #{contestant.id.toUpperCase()}
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
              {contestant.name}
            </h2>
            <p className="text-sm font-mono text-slate-300">
              {contestant.age} Years Old • {contestant.hometown}
            </p>
          </div>
        </div>

        {/* Right Column: Dossier Details */}
        <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between overflow-y-auto max-h-[85vh] md:max-h-[650px]">
          <div>
            {/* Top Stat Ribbon */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Archetype:
                </span>
                <span className="text-xs font-bold font-mono text-white px-2 py-0.5 rounded bg-white/10">
                  {contestant.archetype}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Evaluation:
                </span>
                {getThreatBadge(contestant.threatLevel)}
              </div>
            </div>

            {/* Tagline */}
            <blockquote className="p-4 rounded-xl bg-white/[0.03] border-l-4 border-red-500 text-sm italic text-slate-200 mb-6">
              "{contestant.tagline}"
            </blockquote>

            {/* Background Dossier */}
            <div className="mb-6">
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2 font-semibold">
                Intelligence Dossier & Bio
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {contestant.bio}
              </p>
            </div>

            {/* Key Attributes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-1">
                  Primary Field Strength
                </span>
                <span className="text-xs sm:text-sm font-semibold text-white">
                  {contestant.keyStrength}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-1">
                  Confirmed Alliance
                </span>
                <span className="text-xs sm:text-sm font-semibold text-amber-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {contestant.alliance}
                </span>
              </div>
            </div>

            {/* Stat Progress Bars */}
            <div className="mb-6">
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3 font-semibold">
                Combat & Survival Index
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Endurance & Stamina", val: contestant.stats.endurance, col: "bg-cyan-500" },
                  { label: "Strategic Acumen", val: contestant.stats.strategy, col: "bg-red-500" },
                  { label: "Social & Diplomacy", val: contestant.stats.social, col: "bg-purple-500" },
                  { label: "Bushcraft & Survival", val: contestant.stats.survival, col: "bg-emerald-500" },
                ].map((stat) => (
                  <div key={stat.label} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-slate-400">{stat.label}</span>
                      <span className="text-white font-bold">{stat.val}/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${stat.col} rounded-full transition-all duration-700`}
                        style={{ width: `${stat.val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-500">
              Official Cast Roster • Season 1
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
