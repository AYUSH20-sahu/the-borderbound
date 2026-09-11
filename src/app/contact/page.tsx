"useclient";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Building,
  Briefcase,
  Send,
  CheckCircle2,
  AlertCircle,
  Shield,
  Radio,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    organization: "",
    category: "brand_sponsorship",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit message.");
      }

      setSuccessId(data.inquiryId);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono uppercase tracking-widest mb-4">
          <Briefcase className="w-3.5 h-3.5 text-red-400" />
          <span>Executive Partnerships & Communications</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight mb-4">
          Contact & Partnerships
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          For corporate sponsorships, brand integrations, broadcast licensing, and press accreditation inquiries for Season 1.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Direct Contacts & Hours */}
        <div className="flex flex-col gap-6">
          <div className="hud-corner glass-panel p-6 rounded-2xl border-white/10">
            <h3 className="text-sm font-bold text-white uppercase mb-3 flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-500 animate-pulse" />
              <span>Production Wire</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Our business operations and executive teams are headquartered in Los Angeles with satellite production field offices at each isolated sector outpost.
            </p>
            <div className="flex flex-col gap-3 text-xs font-mono text-slate-300 pt-3 border-t border-white/5">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Sponsorships</span>
                <span className="text-white">partnerships@borderbound.show</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Press & Media</span>
                <span className="text-white">press@borderbound.show</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Casting Questions</span>
                <span className="text-white">casting@borderbound.show</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border-white/10">
            <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2 font-bold">
              Audition Support
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              If you have already submitted your audition reel and want to check your evaluation status, use the instant status portal.
            </p>
            <Link
              href="/status"
              className="text-xs font-mono uppercase text-red-400 hover:text-red-300 font-bold flex items-center gap-1.5 transition-colors"
            >
              <span>Launch Status Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-2">
          {successId ? (
            <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-emerald-500/40 text-center animate-in zoom-in-95 duration-300">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase mb-2">
                Transmission Received
              </h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto mb-4">
                Your partnership dispatch has been assigned reference <strong>{successId}</strong>. A production representative will respond within 48 business hours.
              </p>
              <button
                onClick={() => {
                  setSuccessId(null);
                  setFormData({
                    fullName: "",
                    email: "",
                    organization: "",
                    category: "brand_sponsorship",
                    message: "",
                  });
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                Send Another Dispatch
              </button>
            </div>
          ) : (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/50 flex items-start gap-3 text-red-200 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Samantha Hayes"
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="samantha@brand.com"
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                      Organization / Brand
                    </label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="e.g. RedLine Gear / Media Network"
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                      Inquiry Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      <option value="brand_sponsorship">Brand Sponsorship & Product Placement</option>
                      <option value="press_media">Press, Media & Interview Access</option>
                      <option value="broadcast_licensing">Streaming & Broadcast Licensing</option>
                      <option value="casting_inquiry">Contestant Audition Support</option>
                      <option value="general">General Corporate Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Transmission Message *
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Provide details regarding your proposal, deadline, or inquiry..."
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Transmitting..." : "Send Official Inquiry"}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
