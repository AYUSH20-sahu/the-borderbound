import React from "react";
import Link from "next/link";
import {
  Flame,
  Shield,
  Trophy,
  Users,
  Compass,
  Zap,
  Target,
  ChevronRight,
  ArrowUpRight,
  AlertTriangle,
  Play,
  CheckCircle2,
} from "lucide-react";
import CountdownTimer from "@/components/ui/CountdownTimer";
import TrailerSection from "@/components/home/TrailerSection";
import SocialFeedSection from "@/components/home/SocialFeedSection";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* Background ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Show Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-red-500/30 backdrop-blur-md mb-6 animate-pulse-slow">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs font-mono uppercase tracking-widest text-red-400 font-semibold">
            Streaming Original • Season 1 Official Auditions
          </span>
        </div>

        {/* Main Title & Cinematic Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase max-w-5xl leading-[0.95] mb-6">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-amber-500">Border</span>bound
        </h1>

        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-slate-300 font-light leading-relaxed mb-10">
          32 competitors dropped into 4 unforgiving wilderness sectors. Physical endurance meets psychological warfare. One survivor claims the $1,000,000 title.
        </p>

        {/* Dual CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-14 w-full sm:w-auto">
          <Link
            href="/apply"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-xl shadow-red-600/30 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-red-400/40"
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>Apply For Season 1</span>
            <ChevronRight className="w-4 h-4" />
          </Link>

          <Link
            href="/about"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-bold text-sm uppercase tracking-wider text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-white/30 backdrop-blur-md transition-all duration-200"
          >
            <Play className="w-4 h-4 text-red-400 fill-red-400" />
            <span>The Concept & Lore</span>
          </Link>
        </div>

        {/* Countdown Timer */}
        <div className="w-full max-w-xl mb-14">
          <CountdownTimer />
        </div>

        {/* Live Stat HUD Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full">
          {[
            { icon: Users, label: "CONTESTANTS", val: "32 Selected" },
            { icon: Compass, label: "FRONTIER BIOMES", val: "4 Sectors" },
            { icon: Trophy, label: "GRAND PRIZE", val: "$1,000,000" },
            { icon: Zap, label: "SECOND CHANCES", val: "ZERO" },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-4 rounded-xl flex items-center gap-3 text-left border-white/5 hover:border-red-500/30 transition-colors"
              >
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-red-400">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                    {item.label}
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white tracking-wide">
                    {item.val}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. THE FORMAT & 4 PILLARS */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#07080B] border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-red-400 mb-3">
              <Target className="w-3.5 h-3.5" />
              <span>The Crucible Format</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
              How The Borderbound Works
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
              Neither pure muscle nor cunning diplomacy alone will save you. Victory demands total mastery over the 4 pillars of the competition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: "01",
                title: "Territorial Drop",
                desc: "32 contestants are divided into 4 opposing sector factions. No shelter. Minimal rations. You must establish your domain or freeze.",
                tag: "Survival",
              },
              {
                num: "02",
                title: "Frontier Trials",
                desc: "Weekly physical, logical, and psychological challenges that test team cohesion and personal grit. Winners secure immunity and luxury supply crates.",
                tag: "Competition",
              },
              {
                num: "03",
                title: "The Silent Nexus",
                desc: "Secret negotiations between cross-sector rivals. Forged alliances, covert pacts, and betrayal are broadcast exclusively to viewers.",
                tag: "Psychology",
              },
              {
                num: "04",
                title: "Tribunal of Exile",
                desc: "Every Sunday, the losing factions gather at the Borderline. Blind voting and strategic plays determine who is permanently eliminated.",
                tag: "Elimination",
              },
            ].map((pillar) => (
              <div
                key={pillar.num}
                className="hud-corner glass-panel p-6 rounded-xl flex flex-col justify-between hover:bg-white/[0.04] transition-all duration-300 group border-white/10 hover:border-red-500/40"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black font-mono text-red-500/40 group-hover:text-red-500 transition-colors">
                      {pillar.num}
                    </span>
                    <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                      {pillar.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-red-300 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-slate-500 group-hover:text-red-400 transition-colors">
                  <span>Protocol Active</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. THE 4 BIOMES / SECTORS */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-2 block">
                Hostile Terrains
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
                The 4 Sector Battlegrounds
              </h2>
            </div>
            <Link
              href="/about#sectors"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-red-400 hover:text-red-300 uppercase tracking-widest"
            >
              <span>Explore Biome Maps</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                sector: "SECTOR ALPHA",
                name: "The Permafrost Ridge",
                climate: "Sub-Zero Alpine",
                challenge: "Severe Hypothermia & Frozen Navigation",
                accent: "border-cyan-500/30 hover:border-cyan-500/60",
                badge: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
                desc: "Elevations above 3,500m where temperatures plummet to -15°C. Fire-making is the first survival test; warmth is the ultimate currency.",
              },
              {
                sector: "SECTOR BETA",
                name: "The Scorch Basin",
                climate: "Arid Canyon Badlands",
                challenge: "Water Scarcity & Heat Exhaustion",
                accent: "border-amber-500/30 hover:border-amber-500/60",
                badge: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                desc: "Endless red rock canyons and baking sun exceeding 44°C. Contestants must locate natural cisterns or win resource challenges.",
              },
              {
                sector: "SECTOR GAMMA",
                name: "The Blackwood Mire",
                climate: "Dense Wetland Swamps",
                challenge: "Disorientation & Torrential Rain",
                accent: "border-emerald-500/30 hover:border-emerald-500/60",
                badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                desc: "A labyrinth of mangrove bogs and murky waters where visibility rarely exceeds 15 meters. Predators and relentless damp test psychological fortitude.",
              },
              {
                sector: "SECTOR DELTA",
                name: "The Iron Compound",
                climate: "Decommissioned Industrial Outpost",
                challenge: "CQC Strategy & Close-Quarters Tension",
                accent: "border-red-500/30 hover:border-red-500/60",
                badge: "text-red-400 bg-red-500/10 border-red-500/20",
                desc: "A sprawling brutalist fortress where all 4 factions converge for high-stakes elimination battles and the final showdown.",
              },
            ].map((sector) => (
              <div
                key={sector.sector}
                className={`glass-panel p-6 sm:p-8 rounded-2xl border transition-all duration-300 hover:bg-white/[0.03] flex flex-col justify-between ${sector.accent}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono tracking-widest text-slate-400">
                      {sector.sector}
                    </span>
                    <span className={`text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full border ${sector.badge}`}>
                      {sector.climate}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    {sector.name}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    {sector.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-300">
                  <span className="text-slate-500">Key Hazard:</span>
                  <span className="text-white font-semibold">{sector.challenge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.5 FEATURED CONTESTANTS PREVIEW */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#06070B] border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-red-500 mb-2 block">
                The Class of Season 1
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
                Featured Competitors
              </h2>
              <p className="text-slate-400 text-sm mt-2 max-w-xl">
                Get an early glimpse into four of the 32 survivalists and tacticians vying for the $1,000,000 title.
              </p>
            </div>
            <Link
              href="/contestants"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all"
            >
              <span>Explore All 32 Contestants</span>
              <ArrowUpRight className="w-4 h-4 text-red-400" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Viktor Vance",
                sector: "Sector Alpha",
                archetype: "The Survivalist",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
                tagline: "The mountain doesn't care about your feelings, and neither do I.",
                threat: "High",
                threatColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
              },
              {
                name: "Darius Thorne",
                sector: "Sector Beta",
                archetype: "The Enforcer",
                image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80",
                tagline: "Heat is an illusion. Discipline is absolute.",
                threat: "Critical",
                threatColor: "text-red-400 border-red-500/30 bg-red-500/10",
              },
              {
                name: "Seraphina Vance",
                sector: "Sector Gamma",
                archetype: "The Tactician",
                image: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=600&auto=format&fit=crop&q=80",
                tagline: "The body betrays the lie before the tongue speaks.",
                threat: "Critical",
                threatColor: "text-red-400 border-red-500/30 bg-red-500/10",
              },
              {
                name: "Cassian Drake",
                sector: "Sector Delta",
                archetype: "The Tactician",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
                tagline: "Every compound has a blind spot. Find it, exploit it.",
                threat: "Critical",
                threatColor: "text-red-400 border-red-500/30 bg-red-500/10",
              },
            ].map((c, i) => (
              <Link
                key={i}
                href="/contestants"
                className="hud-corner glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-red-500/40 transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="relative h-56 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1219] via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-black/60 border border-white/20 text-white backdrop-blur-md">
                      {c.sector}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${c.threatColor}`}>
                      {c.threat}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      {c.archetype}
                    </span>
                    <h3 className="text-lg font-bold text-white uppercase group-hover:text-red-400 transition-colors">
                      {c.name}
                    </h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-slate-300 italic line-clamp-2">
                    "{c.tagline}"
                  </p>
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>DOSSIER READY</span>
                    <span className="text-red-400 group-hover:text-red-300 flex items-center gap-1 font-semibold">
                      INSPECT <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3.6 OFFICIAL TRAILER SECTION */}
      <TrailerSection />

      {/* 3.7 SOCIAL CHANNELS & MULTI-PLATFORM GRID */}
      <SocialFeedSection />

      {/* 4. AUDITION CALLOUT BANNER */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-12 glass-panel-crimson border border-red-500/30 relative overflow-hidden text-center sm:text-left">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-mono uppercase tracking-widest mb-4">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Auditions Close Soon</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight mb-3">
                Do You Have What It Takes To Cross The Border?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
                Casting directors are reviewing applications daily. Submit your 60-second video audition and profile today.
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-slate-300 font-mono">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-red-400" />
                  <span>Age 21+ Required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-red-400" />
                  <span>Valid International Passport</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-red-400" />
                  <span>Zero Prior TV Experience Needed</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <Link
                href="/apply"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 shadow-xl shadow-red-600/40 hover:scale-[1.02] transition-all"
              >
                <span>Start Application</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/rules"
                className="text-center text-xs font-mono text-slate-400 hover:text-white uppercase tracking-wider"
              >
                Review Rules & Eligibility
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
