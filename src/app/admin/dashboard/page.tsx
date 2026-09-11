"useclient";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Search,
  Filter,
  Download,
  LogOut,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  AlertTriangle,
  Play,
  Film,
  Camera,
  X,
  Phone,
  Mail,
  MapPin,
  Compass,
  FileText,
  Save,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { AdminApplicationItem } from "@/data/seedApplications";

interface AnalyticsData {
  totalApplications: number;
  statusCounts: {
    pending: number;
    under_review: number;
    shortlisted: number;
    rejected: number;
    selected: number;
  };
  funnel: {
    siteVisits: number;
    formStarted: number;
    formCompleted: number;
    shortlisted: number;
    selectedRoster: number;
    targetRoster: number;
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<{ email: string; role: string } | null>(null);

  const [applications, setApplications] = useState<AdminApplicationItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");

  // Selected applicant drawer
  const [selectedApp, setSelectedApp] = useState<AdminApplicationItem | null>(null);
  const [newStatus, setNewStatus] = useState<AdminApplicationItem["status"]>("pending");
  const [notes, setNotes] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // Check auth session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/me");
        if (!res.ok) {
          router.push("/admin/login");
          return;
        }
        const data = await res.json();
        setAdminUser(data.user);
        loadDashboardData();
      } catch {
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [router]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [appsRes, analyticsRes] = await Promise.all([
        fetch("/api/admin/applications"),
        fetch("/api/admin/analytics"),
      ]);

      if (appsRes.ok) {
        const data = await appsRes.json();
        setApplications(data.applications || []);
      }

      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error("Dashboard data fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // Open applicant drawer
  const openDrawer = (app: AdminApplicationItem) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setNotes(app.internalNotes || "");
  };

  // Update status & notes
  const handleSaveStatus = async () => {
    if (!selectedApp) return;
    setSavingNote(true);

    try {
      const res = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: selectedApp.applicationId,
          status: newStatus,
          internalNotes: notes,
        }),
      });

      if (res.ok) {
        // Update local state
        setApplications((prev) =>
          prev.map((a) =>
            a.applicationId === selectedApp.applicationId
              ? { ...a, status: newStatus, internalNotes: notes }
              : a
          )
        );
        setSelectedApp((prev) => (prev ? { ...prev, status: newStatus, internalNotes: notes } : null));
        // Refresh analytics
        const aRes = await fetch("/api/admin/analytics");
        if (aRes.ok) {
          const aData = await aRes.json();
          setAnalytics(aData.analytics);
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setSavingNote(false);
    }
  };

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      search.trim() === "" ||
      app.applicant.fullName.toLowerCase().includes(search.toLowerCase()) ||
      app.applicationId.toLowerCase().includes(search.toLowerCase()) ||
      app.applicant.email.toLowerCase().includes(search.toLowerCase()) ||
      app.applicant.hometown.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesSector = sectorFilter === "all" || app.pitch.sectorPreference.includes(sectorFilter);

    return matchesSearch && matchesStatus && matchesSector;
  });

  const getStatusBadge = (status: AdminApplicationItem["status"]) => {
    switch (status) {
      case "selected":
        return "text-red-400 bg-red-500/20 border-red-500/40";
      case "shortlisted":
        return "text-emerald-400 bg-emerald-500/20 border-emerald-500/40";
      case "under_review":
        return "text-cyan-400 bg-cyan-500/20 border-cyan-500/40";
      case "rejected":
        return "text-slate-400 bg-slate-800 border-slate-700";
      default:
        return "text-amber-400 bg-amber-500/20 border-amber-500/40";
    }
  };

  if (loading && !adminUser) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-3 text-slate-400 font-mono text-xs">
          <RefreshCw className="w-6 h-6 animate-spin text-red-500" />
          <span>Authenticating Production Console...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 font-bold">
              <Shield className="w-3 h-3" />
              Executive Producer Dashboard
            </span>
            <span className="text-xs font-mono text-slate-400">
              Staff: {adminUser?.email}
            </span>
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight mt-1">
            Casting & Applicant Pipeline
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/api/admin/export"
            download="borderbound_applicants.csv"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider font-bold bg-white/5 hover:bg-white/10 text-white border border-white/15 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export CSV</span>
          </a>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono uppercase text-slate-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 border border-white/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* KPI Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="hud-corner glass-panel p-5 rounded-2xl border-white/10">
            <div className="flex justify-between items-center text-slate-400 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest">
                Total Submissions
              </span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white">
              {analytics.totalApplications}
            </div>
            <span className="text-[10px] font-mono text-emerald-400 mt-1 block">
              +14% this week
            </span>
          </div>

          <div className="hud-corner glass-panel p-5 rounded-2xl border-white/10">
            <div className="flex justify-between items-center text-slate-400 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest">
                Under Producer Review
              </span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">
              {analytics.statusCounts.under_review + analytics.statusCounts.pending}
            </div>
            <span className="text-[10px] font-mono text-slate-400 mt-1 block">
              {analytics.statusCounts.pending} in intake queue
            </span>
          </div>

          <div className="hud-corner glass-panel p-5 rounded-2xl border-white/10">
            <div className="flex justify-between items-center text-slate-400 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest">
                Shortlisted Callbacks
              </span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
              {analytics.statusCounts.shortlisted}
            </div>
            <span className="text-[10px] font-mono text-slate-400 mt-1 block">
              Ready for Round 2 interviews
            </span>
          </div>

          <div className="hud-corner glass-panel p-5 rounded-2xl border-white/10">
            <div className="flex justify-between items-center text-slate-400 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest">
                Final Roster Filled
              </span>
              <Award className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400">
              {analytics.statusCounts.selected} / 32
            </div>
            <span className="text-[10px] font-mono text-slate-400 mt-1 block">
              Target: 32 Official Cast
            </span>
          </div>
        </div>
      )}

      {/* Funnel Telemetry Bar */}
      {analytics && (
        <div className="glass-panel p-5 rounded-2xl border-white/10 mb-8">
          <div className="flex items-center justify-between mb-3 text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-400" />
              <span>Conversion Funnel Telemetry</span>
            </span>
            <span className="text-slate-500">
              Visits: {analytics.funnel.siteVisits.toLocaleString()} → Starts: {analytics.funnel.formStarted.toLocaleString()} → Completes: {analytics.funnel.formCompleted}
            </span>
          </div>

          <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-white/10">
            <div
              className="h-full bg-blue-500 rounded-l-full"
              style={{ width: "40%" }}
              title="Site Traffic"
            />
            <div
              className="h-full bg-amber-500"
              style={{ width: "35%" }}
              title="Form Started"
            />
            <div
              className="h-full bg-emerald-500 rounded-r-full"
              style={{ width: "25%" }}
              title="Completed Applications"
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
            <span>Landing Page Visitors (100%)</span>
            <span>Started Multi-Step (23.0%)</span>
            <span>Final Submissions (5.7% Conversion)</span>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, hometown, email..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#0E121B] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          {[
            { label: "All", val: "all" },
            { label: "Pending", val: "pending" },
            { label: "Under Review", val: "under_review" },
            { label: "Shortlisted", val: "shortlisted" },
            { label: "Selected", val: "selected" },
            { label: "Rejected", val: "rejected" },
          ].map((tab) => (
            <button
              key={tab.val}
              onClick={() => setStatusFilter(tab.val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
                statusFilter === tab.val
                  ? "bg-red-600 text-white font-bold"
                  : "bg-white/5 text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}

          {/* Sector Selector */}
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="bg-[#0E121B] border border-white/10 text-xs font-mono text-white rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="all">All Sectors</option>
            <option value="Alpha">Sector Alpha</option>
            <option value="Beta">Sector Beta</option>
            <option value="Gamma">Sector Gamma</option>
            <option value="Delta">Sector Delta</option>
          </select>
        </div>
      </div>

      {/* Applications Data Table */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-black/60 border-b border-white/10 text-slate-400 uppercase tracking-widest text-[10px]">
              <tr>
                <th className="p-4">Reference ID</th>
                <th className="p-4">Applicant</th>
                <th className="p-4">Preferred Sector</th>
                <th className="p-4">Archetype</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => (
                  <tr
                    key={app.applicationId}
                    className="hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="p-4 text-amber-400 font-bold">
                      {app.applicationId}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                          <img
                            src={app.media.photoUrl}
                            alt={app.applicant.fullName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-white font-bold">{app.applicant.fullName}</div>
                          <div className="text-[10px] text-slate-500">
                            Age {app.applicant.age} • {app.applicant.hometown}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">
                      {app.pitch.sectorPreference.split(" ")[0]} {app.pitch.sectorPreference.split(" ")[1]}
                    </td>
                    <td className="p-4 text-slate-400">
                      {app.pitch.archetypePreference}
                    </td>
                    <td className="p-4 text-slate-500 text-[11px]">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {app.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openDrawer(app)}
                        className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 hover:text-white border border-red-500/30 text-[11px] uppercase tracking-wider transition-colors"
                      >
                        Inspect Dossier
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No applications matched your search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* APPLICANT INSPECTION DRAWER / MODAL */}
      {/* ========================================================= */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => setSelectedApp(null)} />

          <div className="relative w-full max-w-3xl rounded-3xl bg-[#0B0E14] border border-white/15 shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[90vh]">
            {/* Drawer Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400">DOSSIER:</span>
                <span className="text-sm font-mono font-black text-amber-400">
                  {selectedApp.applicationId}
                </span>
                <span
                  className={`inline-flex items-center text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                    selectedApp.status
                  )}`}
                >
                  {selectedApp.status.replace("_", " ")}
                </span>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto flex flex-col gap-6 text-xs font-mono">
              {/* Profile Card Summary */}
              <div className="flex flex-col sm:flex-row gap-6 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                <div className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-900 border border-white/15 shrink-0">
                  <img
                    src={selectedApp.media.photoUrl}
                    alt={selectedApp.applicant.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white uppercase">
                    {selectedApp.applicant.fullName}
                  </h3>
                  <div className="text-slate-400 mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <span>Age: {selectedApp.applicant.age}</span>
                    <span>Occupation: {selectedApp.applicant.occupation}</span>
                    <span>Hometown: {selectedApp.applicant.hometown}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-white/5 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      {selectedApp.applicant.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      {selectedApp.applicant.phone}
                    </span>
                    <span className="text-emerald-400">
                      Passport: {selectedApp.applicant.hasValidPassport ? "Verified" : "Missing"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Audition Video Player Preview */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-2 font-bold">
                  60-Second Video Audition Tape
                </span>
                <div className="rounded-2xl overflow-hidden bg-black border border-white/10 aspect-video relative">
                  <video
                    src={selectedApp.media.videoAuditionUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Strategy and Lore Answers */}
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] uppercase text-red-400 font-bold block mb-1">
                    Primary Game Strategy:
                  </span>
                  <p className="text-slate-300 leading-relaxed text-xs font-sans">
                    {selectedApp.pitch.strategyPitch}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] uppercase text-amber-400 font-bold block mb-1">
                    Survival & Wilderness Experience:
                  </span>
                  <p className="text-slate-300 leading-relaxed text-xs font-sans">
                    {selectedApp.pitch.survivalExperience}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] uppercase text-cyan-400 font-bold block mb-1">
                    Why The Borderbound?
                  </span>
                  <p className="text-slate-300 leading-relaxed text-xs font-sans">
                    {selectedApp.pitch.whyBorderbound}
                  </p>
                </div>
              </div>

              {/* Status Update & Producer Internal Notes */}
              <div className="p-5 rounded-2xl bg-black/60 border border-white/10 flex flex-col gap-4">
                <h4 className="text-xs uppercase text-white font-bold tracking-wider">
                  Producer Decision & Internal Review
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 mb-1">
                      Update Application Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as AdminApplicationItem["status"])}
                      className="w-full px-3 py-2 rounded-lg bg-[#0E121B] border border-white/15 text-white text-xs focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      <option value="pending">Pending (In Queue)</option>
                      <option value="under_review">Under Review</option>
                      <option value="shortlisted">Shortlisted (Round 2)</option>
                      <option value="selected">Selected (Official Cast)</option>
                      <option value="rejected">Rejected / Ineligible</option>
                    </select>
                  </div>

                  <div className="text-[11px] text-slate-400 leading-tight">
                    Changing this status immediately updates the candidate's tracking telemetry on the public portal.
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-slate-400 mb-1">
                    Confidential Producer Notes
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Internal evaluation notes (not visible to applicant)..."
                    className="w-full px-3 py-2 rounded-lg bg-[#0E121B] border border-white/15 text-white text-xs focus:outline-none focus:border-red-500 font-sans"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveStatus}
                    disabled={savingNote}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingNote ? "Saving Changes..." : "Save Producer Decision"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
