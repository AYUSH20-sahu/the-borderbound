"useclient";

import React from "react";
import Image from "next/image";
import { Contestant } from "@/types/contestant";
import { Shield, Flame, AlertTriangle, Skull, Eye, Activity, Award } from "lucide-react";

interface ContestantCardProps {
  contestant: Contestant;
  onSelect: (contestant: Contestant) => void;
}

export default function ContestantCard({ contestant, onSelect }: ContestantCardProps) {
  // Sector styling tokens
  const getSectorColor = (sector: string) => {
    if (sector.includes("Alpha")) return "text-cyan-400 border-cyan-500/30 bg-cyan-950/30";
    if (sector.includes("Beta")) return "text-amber-400 border-amber-500/30 bg-amber-950/30";
    if (sector.includes("Gamma")) return "text-emerald-400 border-emerald-500/30 bg-emerald-950/30";
    return "text-red-400 border-red-500/30 bg-red-950/30";
  };

  const getStatusBadge = () => {
    switch (contestant.status) {
      case "immunity_holder":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20">
            <Award className="w-3 h-3" />
            Immunity
          </span>
        );
      case "tribunal_risk":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            Tribunal Risk
          </span>
        );
      case "eliminated":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-red-950/80 text-red-400 border border-red-800">
            <Skull className="w-3 h-3" />
            Exiled • Ep {contestant.eliminationEpisode || "?"}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Active
          </span>
        );
    }
  };

  const isEliminated = contestant.status === "eliminated";

  return (
    <div
      onClick={() => onSelect(contestant)}
      className={`hud-corner glass-panel rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
        isEliminated
          ? "border-white/5 opacity-65 grayscale hover:grayscale-0 hover:opacity-100 hover:border-red-500/40"
          : "border-white/10 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-950/40 hover:-translate-y-1"
      }`}
    >
      {/* Top Image Banner */}
      <div className="relative w-full h-64 overflow-hidden bg-slate-900">
        <Image
          src={contestant.avatarUrl}
          alt={contestant.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Ambient Dark Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1219] via-[#0F1219]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span
            className={`text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-md border backdrop-blur-md ${getSectorColor(
              contestant.sector
            )}`}
          >
            {contestant.sector.split(" ")[0]}
          </span>
          {getStatusBadge()}
        </div>

        {/* Quick Threat Meter */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
              {contestant.archetype}
            </span>
            <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-red-400 transition-colors">
              {contestant.name}
            </h3>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400">AGE</span>
            <div className="text-sm font-bold font-mono text-white">{contestant.age}</div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2 pb-2 border-b border-white/5">
            <span>{contestant.occupation}</span>
            <span>{contestant.hometown}</span>
          </div>

          <p className="text-xs text-slate-300 italic line-clamp-2 mb-4 leading-relaxed">
            "{contestant.tagline}"
          </p>

          {/* Stat Bars Grid */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 mb-4 text-[11px] font-mono">
            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>STRATEGY</span>
                <span className="text-white font-bold">{contestant.stats.strategy}</span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full"
                  style={{ width: `${contestant.stats.strategy}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>SURVIVAL</span>
                <span className="text-white font-bold">{contestant.stats.survival}</span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                  style={{ width: `${contestant.stats.survival}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>ENDURANCE</span>
                <span className="text-white font-bold">{contestant.stats.endurance}</span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 rounded-full"
                  style={{ width: `${contestant.stats.endurance}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-0.5">
                <span>SOCIAL</span>
                <span className="text-white font-bold">{contestant.stats.social}</span>
              </div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-400 rounded-full"
                  style={{ width: `${contestant.stats.social}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer info & CTA button */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="text-[10px] text-slate-500">ALLIANCE:</span>
            <span className="text-white truncate max-w-[130px]">{contestant.alliance}</span>
          </div>

          <div className="flex items-center gap-1 text-red-400 group-hover:text-red-300 font-semibold uppercase">
            <Eye className="w-3.5 h-3.5" />
            <span>Dossier</span>
          </div>
        </div>
      </div>
    </div>
  );
}
