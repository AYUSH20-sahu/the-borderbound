"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ targetDate }: { targetDate?: string }) {
  // Default to 45 days from now if not specified
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 42,
    hours: 14,
    minutes: 36,
    seconds: 19,
  });

  useEffect(() => {
    // Target date set in future
    const target = targetDate
      ? new Date(targetDate).getTime()
      : new Date().getTime() + (42 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 mb-3 text-xs font-mono tracking-widest text-amber-400 uppercase bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
        <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "12s" }} />
        <span>Audition Deadline Lockdown</span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg w-full">
        {[
          { label: "DAYS", value: timeLeft.days },
          { label: "HOURS", value: timeLeft.hours },
          { label: "MINS", value: timeLeft.minutes },
          { label: "SECS", value: timeLeft.seconds },
        ].map((unit) => (
          <div
            key={unit.label}
            className="hud-corner flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg bg-[#0E121B]/90 border border-white/10 shadow-lg shadow-black/60 relative group"
          >
            <span className="text-2xl sm:text-4xl font-extrabold font-mono text-white tracking-tight group-hover:text-red-400 transition-colors">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-[9px] sm:text-[11px] font-mono tracking-widest text-slate-400 mt-1 uppercase">
              {unit.label}
            </span>
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
          </div>
        ))}
      </div>
    </div>
  );
}
