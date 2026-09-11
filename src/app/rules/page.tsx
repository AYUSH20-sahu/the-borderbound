"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  CheckCircle2,
  FileText,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Lock,
} from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: "Is there any application fee or charge to audition?",
    a: "Absolutely not. Auditioning for The Borderbound is 100% free. We will never ask for credit card details, audition processing fees, or wire transfers. Beware of phishing scams and only submit through this official domain.",
  },
  {
    q: "Do I need professional wilderness or survival experience?",
    a: "No. While outdoor aptitude is helpful, The Borderbound is primarily a psychological, strategic, and human game. We look for compelling personalities, mental fortitude, analytical minds, and diverse perspectives from every background.",
  },
  {
    q: "What are the exact filming dates and time commitment?",
    a: "Selected contestants must be fully available for up to 45 consecutive days during production. Accommodations, travel, gear, and daily stipends are fully provided by production.",
  },
  {
    q: "What should I include in my 60-second video audition?",
    a: "Tell us who you are, why you want to enter the tournament, and what your secret strategy will be. Film in good lighting with clear audio. Do not edit with heavy filters or background music — we want to see the real, unfiltered you.",
  },
  {
    q: "Can couples, friends, or family members apply together?",
    a: "Every applicant must submit an individual application. You may note in your application if an acquaintance is also applying, but selection is based strictly on individual merit.",
  },
  {
    q: "How will I know if my application was reviewed?",
    a: "You can track the live status of your submission anytime on our 'Check Status' page using your registered Google email address. Shortlisted applicants will be contacted directly by our casting team via telephone and email.",
  },
];

export default function RulesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="flex flex-col w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono uppercase tracking-widest mb-4">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Official Contestant Regulations</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight mb-6">
          Rules & Eligibility
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Before submitting your audition for Season 1, review the comprehensive eligibility requirements, terms of participation, and competition bylaws.
        </p>
      </div>

      {/* Eligibility Grid */}
      <div id="eligibility" className="mb-20">
        <h2 className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-3">
          Section 01 // Requirements
        </h2>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white uppercase mb-8">
          Contestant Eligibility Criteria
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Age & Legal Status",
              reqs: [
                "Must be at least 21 years of age at the time of audition submission.",
                "Must hold valid government-issued photo identification.",
                "Must hold a valid international passport with at least 6 months validity.",
              ],
            },
            {
              title: "Medical & Fitness",
              reqs: [
                "Must pass an independent comprehensive physical examination.",
                "Must clear psychological screening conducted by show physicians.",
                "Must be capable of moderate outdoor physical exertion in wilderness conditions.",
              ],
            },
            {
              title: "Availability & Ethics",
              reqs: [
                "Must be available for up to 45 consecutive days for filming.",
                "Must not be an employee or immediate relative of production staff.",
                "Must agree to complete non-disclosure agreement (NDA) prior to arrival.",
              ],
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 sm:p-8 rounded-2xl border-white/10 flex flex-col justify-between"
            >
              <div>
                <h4 className="text-lg font-bold text-white mb-4 pb-2 border-b border-white/10 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-red-500" />
                  <span>{card.title}</span>
                </h4>
                <ul className="flex flex-col gap-3 text-xs sm:text-sm text-slate-400">
                  {card.reqs.map((req, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Code of Conduct & Integrity */}
      <div className="mb-20 glass-panel-amber p-8 sm:p-12 rounded-3xl border border-amber-500/30">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-widest mb-3">
            <Lock className="w-4 h-4" />
            <span>Section 02 // Tournament Integrity</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white uppercase mb-4">
            Zero-Tolerance Code of Conduct
          </h3>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            The Borderbound is an aggressive test of strategy and resilience, but player safety and moral boundaries are strictly enforced. Any of the following will result in immediate disqualification, forfeiture of all stipends, and prompt ejection from the premises:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-1">Physical Violence</strong>
                Intentional physical assault or bodily threat toward any contestant or production crew member.
              </div>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-1">Environmental Tampering</strong>
                Poaching of indigenous wildlife, intentional arson, or hazardous contamination of water sources.
              </div>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-1">Contraband Possession</strong>
                Possession of unapproved electronic devices, communication tools, GPS units, or outside rations.
              </div>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-1">Collusion Breach</strong>
                Bribing production staff or attempting to compromise off-camera technical infrastructure.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-red-400 mb-2">
            Section 03 // Answers
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white uppercase">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="glass-panel rounded-xl border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-white hover:text-red-300 transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-red-400" : "text-slate-400"
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-400 border-t border-white/5 leading-relaxed bg-black/20">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center bg-[#0B0D14] border border-white/10 rounded-2xl p-8 sm:p-10">
        <h3 className="text-xl sm:text-2xl font-bold text-white uppercase mb-2">
          Ready to Step Up to the Challenge?
        </h3>
        <p className="text-slate-400 text-sm max-w-lg mx-auto mb-6">
          Submit your official contestant application now. Our team reviews all video submissions in the order they are received.
        </p>
        <Link
          href="/apply"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/30 transition-all"
        >
          <span>Begin Application Form</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
