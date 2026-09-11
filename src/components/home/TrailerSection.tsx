"use client";

import React, { useState } from "react";
import { Play, X, Film, Volume2, Shield, Flame } from "lucide-react";

export default function TrailerSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#06070B] border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono uppercase tracking-widest mb-4">
            <Film className="w-3.5 h-3.5" />
            <span>Official First Look</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-4">
            Season 1 Concept Trailer
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Watch the premiere teaser introducing the 4 hostile sectors, the ruthless survival conditions, and the $1,000,000 prize awaiting the lone victor.
          </p>
        </div>

        {/* Video Frame */}
        <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden border border-white/15 shadow-2xl aspect-video bg-black group">
          {isPlaying ? (
            <div className="relative w-full h-full">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1"
                title="The Borderbound Official Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                onClick={() => setIsPlaying(false)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 transition-colors"
                aria-label="Close trailer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsPlaying(true)}
              className="relative w-full h-full cursor-pointer flex items-center justify-center"
            >
              {/* Cinematic Backdrop Image */}
              <img
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80"
                alt="Trailer Backdrop"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-65"
              />

              {/* Dark Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-black/40 to-black/60" />

              {/* Play Button Trigger */}
              <div className="relative z-10 flex flex-col items-center text-center p-4">
                <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-600/90 text-white shadow-2xl shadow-red-600/60 group-hover:scale-110 group-hover:bg-red-500 transition-all duration-300 border-2 border-white/30 mb-4">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white ml-1" />
                  <div className="absolute inset-0 rounded-full bg-red-500/40 animate-ping pointer-events-none" />
                </div>
                <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-white">
                  Play Official Trailer (01:45)
                </span>
                <span className="text-[10px] font-mono text-slate-400 mt-1 uppercase">
                  4K UHD • 5.1 Surround Sound
                </span>
              </div>

              {/* Bottom Metadata Badges */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded bg-black/70 text-slate-300 border border-white/10 backdrop-blur-md">
                  Broadcast Premiere: Season 1
                </span>
                <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded bg-red-600/30 text-red-300 border border-red-500/40 backdrop-blur-md">
                  Original Production
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
