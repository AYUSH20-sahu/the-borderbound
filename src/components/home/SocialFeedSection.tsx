import React from "react";
import { Radio, ExternalLink, MessageCircle, Heart, Share2, Eye } from "lucide-react";

export default function SocialFeedSection() {
  const SOCIAL_CHANNELS = [
    {
      platform: "YouTube",
      handle: "@TheBorderboundShow",
      stat: "148K Subscribers",
      desc: "Full episode teasers, raw uncensored campfire recordings, and eliminated player exit interviews.",
      color: "border-red-600/30 hover:border-red-500",
      tag: "Video Broadcast",
      badgeCol: "text-red-400 bg-red-600/10 border-red-500/30",
    },
    {
      platform: "Instagram",
      handle: "@BorderboundOfficial",
      stat: "284K Followers",
      desc: "Daily behind-the-scenes photography, sector drone views, and exclusive contestant photo shoots.",
      color: "border-pink-600/30 hover:border-pink-500",
      tag: "Photography & Stories",
      badgeCol: "text-pink-400 bg-pink-600/10 border-pink-500/30",
    },
    {
      platform: "TikTok",
      handle: "#CrossTheBorder",
      stat: "12.4M Views",
      desc: "Trending fan audition submissions, highlight reels of physical gauntlets, and strategy breakdowns.",
      color: "border-cyan-500/30 hover:border-cyan-400",
      tag: "Shortform Highlights",
      badgeCol: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    },
    {
      platform: "X / Twitter",
      handle: "@BorderboundNews",
      stat: "92K Followers",
      desc: "Real-time production dispatches, live episode tweet-alongs, and official casting deadline notices.",
      color: "border-slate-500/30 hover:border-slate-300",
      tag: "Production Wire",
      badgeCol: "text-slate-300 bg-slate-800 border-slate-700",
    },
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#07090E] border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-2">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Multi-Platform Grid</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
              Follow The Campaign
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl">
              Connect across our verified channels for unreleased surveillance footage and community discussion.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SOCIAL_CHANNELS.map((ch) => (
            <div
              key={ch.platform}
              className={`hud-corner glass-panel p-6 rounded-2xl border transition-all duration-300 hover:bg-white/[0.04] flex flex-col justify-between group ${ch.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-white uppercase group-hover:text-red-400 transition-colors">
                    {ch.platform}
                  </span>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${ch.badgeCol}`}>
                    {ch.tag}
                  </span>
                </div>

                <div className="text-xs font-mono font-bold text-amber-400 mb-1">
                  {ch.handle}
                </div>
                <div className="text-[10px] font-mono text-slate-500 uppercase mb-3">
                  {ch.stat}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {ch.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-white">
                <span>View Channel</span>
                <ExternalLink className="w-3.5 h-3.5 text-red-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
