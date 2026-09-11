import React from "react";
import Link from "next/link";
import { Radio, Calendar, ArrowRight, Bell } from "lucide-react";

const DISPATCHES = [
  {
    date: "September 10, 2026",
    category: "Production",
    title: "Filming Locations Confirmed: The Four Frontier Sectors",
    excerpt:
      "Showrunners have finalized the 4 extreme remote environments selected for Season 1. Survey crews have installed over 120 solar-powered 4K surveillance sensors across Sector Alpha and Sector Beta.",
  },
  {
    date: "September 02, 2026",
    category: "Casting",
    title: "Season 1 Contestant Auditions Officially Opened Worldwide",
    excerpt:
      "Applications for the inaugural 32 contestant slots are now live. Casting producers are reviewing video audition reels on a rolling basis.",
  },
  {
    date: "August 18, 2026",
    category: "Announcements",
    title: "The Borderbound Greenlit with $1,000,000 Grand Prize",
    excerpt:
      "The groundbreaking survival-strategy reality series has officially entered pre-production, promising an unprecedented format blending physical isolation with high-stakes psychological strategy.",
  },
];

export default function UpdatesPage() {
  return (
    <div className="flex flex-col w-full py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono uppercase tracking-widest mb-4">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>Production Telemetry & Wire</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight mb-4">
          Show Updates & Dispatches
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Official transmission bulletins from the showrunners and casting directors of The Borderbound.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {DISPATCHES.map((item, idx) => (
          <article
            key={idx}
            className="hud-corner glass-panel p-6 sm:p-8 rounded-2xl border-white/10 hover:border-red-500/30 transition-all group"
          >
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mb-3">
              <span className="text-red-400 font-semibold uppercase">{item.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {item.date}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
              {item.title}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              {item.excerpt}
            </p>
            <div className="flex items-center gap-1.5 text-xs font-mono text-red-500 font-semibold group-hover:translate-x-1 transition-transform">
              <span>Read Full Transmission</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
