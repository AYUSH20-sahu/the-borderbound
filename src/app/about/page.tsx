import React from "react";
import Link from "next/link";
import {
  Shield,
  Compass,
  Trophy,
  Flame,
  Scale,
  Users,
  Eye,
  AlertOctagon,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono uppercase tracking-widest mb-4">
          <Shield className="w-3.5 h-3.5" />
          <span>The Tournament Concept & Lore</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight mb-6">
          The Ultimate Test Of Human Will
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          The Borderbound is not just another survival show. It is a calculated social and physical pressure cooker designed to strip away modern conveniences and test loyalty, grit, and tactical intellect.
        </p>
      </div>

      {/* The Premise Box */}
      <div className="relative rounded-3xl p-8 sm:p-12 glass-panel-crimson border border-red-500/30 mb-20 overflow-hidden">
        <div className="max-w-3xl">
          <h2 className="text-xs font-mono tracking-widest uppercase text-red-400 mb-2">
            The Premise
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white uppercase mb-4">
            32 Selected Citizens. 1 Isolated Frontier. 40 Days.
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            In an era of hyper-connected digital isolation, 32 individuals from across the nation are severed from the modern grid and dropped at the geographic perimeter known simply as **The Border**. Without smartphones, modern utilities, or predetermined leaders, they must build micro-societies within four hostile sectors while competing in high-stakes tactical challenges.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10">
            <div>
              <div className="text-2xl font-black font-mono text-white">40 DAYS</div>
              <div className="text-xs text-slate-400 uppercase font-mono">Zero Grid Access</div>
            </div>
            <div>
              <div className="text-2xl font-black font-mono text-red-400">32 → 1</div>
              <div className="text-xs text-slate-400 uppercase font-mono">Single Victor Outcome</div>
            </div>
            <div>
              <div className="text-2xl font-black font-mono text-amber-400">$1,000,000</div>
              <div className="text-xs text-slate-400 uppercase font-mono">Guaranteed Winner Purse</div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Stages */}
      <div className="mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-2">
            The Tournament Lifecycle
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white uppercase">
            Four Phases of Escalation
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              phase: "PHASE I",
              title: "The Quadrant Drop",
              days: "Days 1 – 10",
              desc: "Contestants are divided into 4 teams of 8 and marooned in their designated sector. Initial shelter construction, water procurement, and fire survival.",
              icon: Compass,
            },
            {
              phase: "PHASE II",
              title: "Territory Clashes",
              days: "Days 11 – 22",
              desc: "Cross-sector resource raids begin. Teams wage physical and strategic battles for vital food caches, medical kits, and immunity tokens.",
              icon: Flame,
            },
            {
              phase: "PHASE III",
              title: "The Border Dissolution",
              days: "Days 23 – 34",
              desc: "The sector walls fall. The remaining 12 contestants merge into a single chaotic encampment at the Iron Compound. All individual alliances fracture.",
              icon: AlertOctagon,
            },
            {
              phase: "PHASE IV",
              title: "The Final Crossing",
              days: "Days 35 – 40",
              desc: "The final 3 endure a multi-day gauntlet combining extreme endurance with a jury tribunal composed of the last 7 eliminated players.",
              icon: Trophy,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="hud-corner glass-panel p-6 rounded-2xl flex flex-col justify-between border-white/10 hover:border-red-500/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono tracking-widest text-red-400 font-bold">
                      {item.phase}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-slate-400">
                      {item.days}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-amber-400 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rules of Elimination & Judging */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="glass-panel p-8 rounded-2xl border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-red-600/20 text-red-500">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white uppercase">The Elimination Tribunal</h3>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Every 72 hours, the losing sector must convene at the Borderline Firepit. Elimination votes are cast by secret physical ballot.
          </p>
          <ul className="flex flex-col gap-3 text-xs sm:text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span><strong>Tie Breaker Gauntlet:</strong> In the event of an unbroken deadlocked vote, the two tied contestants immediately face a sudden-death survival challenge.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span><strong>The Exile Token:</strong> Hidden immunity relics concealed in each sector can cancel out votes if played before the ballots are read.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">•</span>
              <span><strong>Instant Departure:</strong> Eliminated players are escorted out immediately by ranger security with no re-entry.</span>
            </li>
          </ul>
        </div>

        <div className="glass-panel p-8 rounded-2xl border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-amber-600/20 text-amber-500">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white uppercase">Broadcast & Transparency</h3>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Over 120 automated 4K fixed-rig cameras and roaming camerapersons capture 24/7 unscripted activity without interference.
          </p>
          <ul className="flex flex-col gap-3 text-xs sm:text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Zero Producer Meddling:</strong> Contestant decisions, vote plots, and alliances unfold organically without scripted interventions.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Medical Safety First:</strong> A certified paramedic and emergency wilderness response team monitors vitals remotely at all times.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Audience Live Feed:</strong> Subscribers receive access to raw campfire livestreams and behind-the-scenes strategy deliberations.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center bg-[#0C0F17] border border-white/10 rounded-2xl p-8 sm:p-12">
        <h3 className="text-2xl sm:text-3xl font-black text-white uppercase mb-3">
          Think You Can Outsmart 31 Competitors?
        </h3>
        <p className="text-slate-400 text-sm max-w-xl mx-auto mb-6">
          Registrations for Season 1 are open to applicants from all walks of life. No prior outdoor experience is strictly required — mental resilience is what matters.
        </p>
        <Link
          href="/apply"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-red-600 to-amber-600 shadow-xl shadow-red-600/30 hover:scale-[1.02] transition-all"
        >
          <span>Begin Your Audition Form</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
