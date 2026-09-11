"useclient";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Video,
  Compass,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Upload,
  ArrowRight,
  ArrowLeft,
  Flame,
  Shield,
  Clock,
  Sparkles,
  Copy,
  Check,
  Film,
  Camera,
} from "lucide-react";

interface FormData {
  // Step 1: Personal
  fullName: string;
  email: string;
  phone: string;
  age: number;
  occupation: string;
  hometown: string;
  hasValidPassport: boolean;

  // Step 2: Media
  photoUrl: string;
  videoAuditionUrl: string;

  // Step 3: Strategy & Lore
  sectorPreference: string;
  archetypePreference: string;
  strategyPitch: string;
  survivalExperience: string;
  whyBorderbound: string;

  // Step 4: Verification
  googleVerified: boolean;
  termsAgreed: boolean;
}

const INITIAL_FORM: FormData = {
  fullName: "",
  email: "",
  phone: "",
  age: 24,
  occupation: "",
  hometown: "",
  hasValidPassport: true,
  photoUrl: "",
  videoAuditionUrl: "",
  sectorPreference: "Sector Alpha (Permafrost)",
  archetypePreference: "The Tactician",
  strategyPitch: "",
  survivalExperience: "",
  whyBorderbound: "",
  googleVerified: false,
  termsAgreed: false,
};

export default function ApplicationWizard() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [videoFileName, setVideoFileName] = useState<string | null>(null);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Field change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "age") {
      setForm((prev) => ({ ...prev, age: parseInt(value) || 21 }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Upload Photo
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Headshot photo exceeds 5MB size limit.");
      return;
    }

    setPhotoPreview(URL.createObjectURL(file));
    setUploadingPhoto(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "photo");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload photo");

      setForm((prev) => ({ ...prev, photoUrl: data.url }));
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Photo upload failed");
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Upload Video
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setErrorMsg("Video file exceeds 50MB. Videos must be between 30 and 60 seconds.");
      return;
    }

    setVideoFileName(file.name);
    setUploadingVideo(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "video");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload video");

      setForm((prev) => ({ ...prev, videoAuditionUrl: data.url }));
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Video upload failed");
    } finally {
      setUploadingVideo(false);
    }
  };

  // Step Validation
  const validateStep = (currentStep: number): boolean => {
    setErrorMsg(null);

    if (currentStep === 1) {
      if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
        setErrorMsg("Please fill in your name, email, and phone number.");
        return false;
      }
      if (form.age < 21) {
        setErrorMsg("Applicants must be at least 21 years old.");
        return false;
      }
      if (!form.hometown.trim() || !form.occupation.trim()) {
        setErrorMsg("Please provide your current occupation and hometown.");
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      if (!form.photoUrl) {
        setErrorMsg("Please upload a clear headshot photo.");
        return false;
      }
      if (!form.videoAuditionUrl) {
        setErrorMsg("Please upload your 60-second video audition reel.");
        return false;
      }
      return true;
    }

    if (currentStep === 3) {
      if (
        form.strategyPitch.trim().length < 20 ||
        form.survivalExperience.trim().length < 20 ||
        form.whyBorderbound.trim().length < 20
      ) {
        setErrorMsg("Please write at least a couple of sentences for each strategy and lore question.");
        return false;
      }
      return true;
    }

    if (currentStep === 4) {
      if (!form.googleVerified) {
        setErrorMsg("Please verify your account via Google Sign-In to prevent duplicate submissions.");
        return false;
      }
      if (!form.termsAgreed) {
        setErrorMsg("You must accept the Eligibility Terms & Contestant Agreement.");
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    setStep((prev) => prev - 1);
  };

  // Final Submission
  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setSubmittedId(data.applicationId);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyId = () => {
    if (submittedId) {
      navigator.clipboard.writeText(submittedId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // SUCCESS SCREEN
  if (submittedId) {
    return (
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-emerald-500/40 text-center max-w-2xl mx-auto shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-widest mb-3">
          <span>Submission Confirmed</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-3">
          Audition Dossier Received!
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
          Your Season 1 audition has been encrypted and submitted to the casting producers. Save your official Application ID to monitor review updates.
        </p>

        {/* Application ID Card */}
        <div className="p-4 rounded-xl bg-black/60 border border-white/15 flex items-center justify-between gap-4 max-w-md mx-auto mb-8">
          <div className="text-left">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">
              Application Reference ID
            </span>
            <span className="text-xl font-mono font-black text-amber-400">
              {submittedId}
            </span>
          </div>
          <button
            onClick={copyId}
            className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase flex items-center gap-1.5 transition-colors"
          >
            {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedId ? "Copied" : "Copy ID"}</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/status?email=${encodeURIComponent(form.email)}`}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs font-mono uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 transition-colors"
          >
            Track Status in Portal
          </Link>
          <Link
            href="/contestants"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white bg-white/5 border border-white/10 transition-colors"
          >
            Browse The 32 Competitors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl max-w-3xl mx-auto">
      {/* Step Milestone Indicators */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-8 pb-6 border-b border-white/10">
        {[
          { num: 1, label: "Personal", icon: User },
          { num: 2, label: "Audition Reel", icon: Video },
          { num: 3, label: "Strategy & Lore", icon: Compass },
          { num: 4, label: "Review & Sign", icon: FileCheck },
        ].map((s) => {
          const Icon = s.icon;
          const isActive = step === s.num;
          const isDone = step > s.num;
          return (
            <div
              key={s.num}
              className={`flex flex-col items-center text-center transition-colors ${
                isActive
                  ? "text-red-400 font-bold"
                  : isDone
                  ? "text-emerald-400"
                  : "text-slate-500"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1 text-xs font-mono transition-all ${
                  isActive
                    ? "bg-red-600 text-white shadow-lg shadow-red-900/50 scale-110"
                    : isDone
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-white/5 text-slate-500 border border-white/10"
                }`}
              >
                {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider hidden sm:block">
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Error Notice */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/50 flex items-start gap-3 text-red-200 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 1: PERSONAL DETAILS */}
      {/* ========================================================= */}
      {step === 1 && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          <div>
            <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-1">
              Step 1: Personal Background
            </h3>
            <p className="text-xs text-slate-400">
              Provide your verified identity and contact information for the casting directors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={form.fullName}
                onChange={handleChange}
                placeholder="e.g. Jordan Miller"
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="jordan.miller@gmail.com"
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Contact Phone *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 (555) 019-2834"
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Age (Minimum 21 Required) *
              </label>
              <input
                type="number"
                name="age"
                min={21}
                max={75}
                required
                value={form.age}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Current Occupation *
              </label>
              <input
                type="text"
                name="occupation"
                required
                value={form.occupation}
                onChange={handleChange}
                placeholder="e.g. Wilderness Guide / Civil Engineer"
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Hometown / Residence *
              </label>
              <input
                type="text"
                name="hometown"
                required
                value={form.hometown}
                onChange={handleChange}
                placeholder="e.g. Austin, TX"
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="hasValidPassport"
                checked={form.hasValidPassport}
                onChange={handleChange}
                className="w-4 h-4 rounded text-red-600 bg-black/50 border-white/20 focus:ring-red-500"
              />
              <span className="text-xs text-slate-300">
                I hold a valid international passport with at least 6 months remaining validity.
              </span>
            </label>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 2: MEDIA AUDITION UPLOAD */}
      {/* ========================================================= */}
      {step === 2 && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-1">
              Step 2: Media Audition Reel
            </h3>
            <p className="text-xs text-slate-400">
              Upload your headshot and a 30–60 second video pitch showcasing your personality and strategy.
            </p>
          </div>

          {/* Photo Dropzone */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-28 h-28 rounded-2xl bg-slate-900 border border-white/15 overflow-hidden shrink-0 flex items-center justify-center">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Headshot Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-8 h-8 text-slate-600" />
              )}
              {uploadingPhoto && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center text-[10px] font-mono text-amber-400">
                  Uploading...
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-sm font-bold text-white mb-1">High-Resolution Headshot Photo</h4>
              <p className="text-xs text-slate-400 mb-3">
                JPG, PNG, or WebP. Maximum file size: 5MB. Clear lighting, neutral background.
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-mono uppercase cursor-pointer border border-white/10 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{form.photoUrl ? "Change Headshot" : "Select Headshot"}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              {form.photoUrl && (
                <span className="ml-3 text-xs text-emerald-400 font-mono inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              )}
            </div>
          </div>

          {/* Video Dropzone */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-28 h-28 rounded-2xl bg-slate-900 border border-white/15 flex items-center justify-center shrink-0">
              <Film className="w-8 h-8 text-slate-600" />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-sm font-bold text-white mb-1">60-Second Video Audition Reel</h4>
              <p className="text-xs text-slate-400 mb-3">
                MP4, MOV, or WebM. Max size: 50MB. Answer: Who are you, and what is your survival strategy?
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs font-mono uppercase cursor-pointer border border-red-500/30 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{videoFileName ? "Change Audition Tape" : "Upload Video (Max 60s)"}</span>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
              {uploadingVideo && (
                <span className="ml-3 text-xs text-amber-400 font-mono animate-pulse">
                  Compressing & Uploading...
                </span>
              )}
              {form.videoAuditionUrl && (
                <span className="ml-3 text-xs text-emerald-400 font-mono inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Video Ready ({videoFileName})
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 3: STRATEGY & LORE */}
      {/* ========================================================= */}
      {step === 3 && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          <div>
            <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-1">
              Step 3: Tactical Strategy & Lore
            </h3>
            <p className="text-xs text-slate-400">
              Tell the producers how you intend to outwit 31 adversaries across the border.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Sector Placement Preference
              </label>
              <select
                name="sectorPreference"
                value={form.sectorPreference}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500 cursor-pointer"
              >
                <option value="Sector Alpha (Permafrost)">Sector Alpha (Permafrost Alpine)</option>
                <option value="Sector Beta (Scorch Basin)">Sector Beta (Arid Badlands)</option>
                <option value="Sector Gamma (Blackwood Mire)">Sector Gamma (Wetland Swamps)</option>
                <option value="Sector Delta (Iron Compound)">Sector Delta (Industrial Outpost)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Dominant Archetype Persona
              </label>
              <select
                name="archetypePreference"
                value={form.archetypePreference}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500 cursor-pointer"
              >
                <option value="The Tactician">The Tactician (Game theory & voting blocs)</option>
                <option value="The Survivalist">The Survivalist (Bushcraft & shelter)</option>
                <option value="The Diplomat">The Diplomat (Social charm & mediation)</option>
                <option value="The Enforcer">The Enforcer (Physical challenge dominator)</option>
                <option value="The Wildcard">The Wildcard (Unpredictable disruptor)</option>
                <option value="The Underdog">The Underdog (Relentless perseverance)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              What is your primary game strategy? *
            </label>
            <textarea
              name="strategyPitch"
              rows={3}
              required
              value={form.strategyPitch}
              onChange={handleChange}
              placeholder="Explain how you will navigate the alliances, voting tribunals, and covert pacts..."
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              What wilderness or crisis survival experience do you have? *
            </label>
            <textarea
              name="survivalExperience"
              rows={3}
              required
              value={form.survivalExperience}
              onChange={handleChange}
              placeholder="Past outdoor expeditions, high-pressure environments, military or sports background..."
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
              Why should you be chosen for The Borderbound? *
            </label>
            <textarea
              name="whyBorderbound"
              rows={2}
              required
              value={form.whyBorderbound}
              onChange={handleChange}
              placeholder="What makes your story unique? Why will audiences root for you?"
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-red-500"
            />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 4: REVIEW & GOOGLE SIGN-IN GATE */}
      {/* ========================================================= */}
      {step === 4 && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div>
            <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-1">
              Step 4: Verification & Consent
            </h3>
            <p className="text-xs text-slate-400">
              Confirm your identity via Google Sign-In to lock in your application and prevent duplicate entries.
            </p>
          </div>

          {/* Dossier Summary Card */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-slate-300 flex flex-col gap-2">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-500">Applicant:</span>
              <span className="text-white font-bold">{form.fullName} ({form.age})</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-500">Contact:</span>
              <span>{form.email} • {form.phone}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-500">Preferred Sector:</span>
              <span className="text-amber-400">{form.sectorPreference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Media Audition:</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Photo & Audition Reel Attached
              </span>
            </div>
          </div>

          {/* Google Sign-in Gate */}
          <div className="p-6 rounded-2xl bg-[#090C12] border border-white/10 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>

            <h4 className="text-base font-bold text-white mb-1">
              Google Account Authentication
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              Requires an authenticated Google account to bind with this audition. This guarantees that each applicant submits exactly once.
            </p>

            {form.googleVerified ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified with Google: {form.email}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, googleVerified: true }))}
                className="px-6 py-3 rounded-xl bg-white text-black hover:bg-slate-200 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
              >
                Verify With Google Account
              </button>
            )}
          </div>

          {/* Legal Terms Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="termsAgreed"
                checked={form.termsAgreed}
                onChange={handleChange}
                className="w-4 h-4 rounded text-red-600 bg-black/50 border-white/20 focus:ring-red-500 mt-0.5"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                I hereby certify that all information submitted is accurate and that I meet the age, legal, and health eligibility requirements. I agree to the <Link href="/rules" className="text-red-400 underline" target="_blank">Rules & Terms of Participation</Link> and non-disclosure obligations.
              </span>
            </label>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* NAVIGATION CONTROLS */}
      {/* ========================================================= */}
      <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white bg-white/5 border border-white/10 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 transition-colors flex items-center gap-1.5 shadow-lg shadow-red-950/50"
          >
            <span>Proceed to Step {step + 1}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 transition-all flex items-center gap-2 shadow-xl shadow-red-600/40 disabled:opacity-50"
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>{submitting ? "Transmitting Dossier..." : "Submit Audition Application"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
