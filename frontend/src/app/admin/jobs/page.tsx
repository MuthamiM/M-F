"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  BriefcaseBusiness,
  Search,
  RefreshCw,
  FileText,
  Mail,
  Phone,
  ExternalLink,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  User,
  ArrowUpRight,
  Globe,
  Filter,
  Check,
  ChevronRight,
  Download,
  Building,
  Sparkles
} from "lucide-react";

interface JobApplicationTicket {
  id: string;
  type: "application";
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt?: string;
  ipAddress?: string;
}

export default function AdminJobsPage() {
  const [applications, setApplications] = useState<JobApplicationTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<JobApplicationTicket | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [docLoading, setDocLoading] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const token = sessionStorage.getItem("adminToken");
      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      const params = new URLSearchParams();
      params.append("type", "application");
      if (selectedStatus !== "all") {
        params.append("status", selectedStatus);
      }
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      const res = await fetch(`/api/tickets?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        sessionStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        return;
      }

      const data = await res.json();
      if (res.ok && data.success) {
        setApplications(data.data || []);
      } else {
        setErrorMsg(data.error || "Unable to load job applications registry.");
      }
    } catch {
      setErrorMsg("Failed to connect to careers service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplications();
  };

  const handleStatusChange = async (id: string, newStatus: "open" | "in_progress" | "resolved" | "closed") => {
    try {
      setUpdatingId(id);
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(`/api/tickets/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
        );
        if (selectedApp && selectedApp.id === id) {
          setSelectedApp((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const openDocument = async (id: string, kind: "cv" | "resume") => {
    try {
      setDocLoading(`${id}-${kind}`);
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(`/api/tickets/${id}/application-documents/${kind}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        alert(`Document not available or failed to load.`);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      alert("Failed to open document.");
    } finally {
      setDocLoading(null);
    }
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = applications.length;
    const open = applications.filter((a) => a.status === "open").length;
    const inProgress = applications.filter((a) => a.status === "in_progress").length;
    const resolved = applications.filter((a) => a.status === "resolved").length;
    const closed = applications.filter((a) => a.status === "closed").length;
    return { total, open, inProgress, resolved, closed };
  }, [applications]);

  // Parse extracted details from application message
  const parseAppDetails = (message: string) => {
    let experience = "Software Engineer";
    let portfolio = "";
    let cover = "";

    const expMatch = message.match(/Experience:\s*([^\n]+)/i);
    if (expMatch) experience = expMatch[1].trim();

    const portMatch = message.match(/Portfolio:\s*([^\n]+)/i);
    if (portMatch && portMatch[1].trim() !== "Not provided") portfolio = portMatch[1].trim();

    const summaryMatch = message.match(/Summary & qualifications:\s*([\s\S]*?)(?=\n\n(?:CV:|Résumé:|$))/i);
    if (summaryMatch) {
      cover = summaryMatch[1].trim();
    } else {
      cover = message;
    }

    return { experience, portfolio, cover };
  };

  return (
    <div className="space-y-6 font-sans antialiased text-[#1B222C]">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight">Recruitment & Job Applications</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#1B222C] text-white">
              {applications.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review inbound candidates for Software Developer (Backend & Core Systems), evaluate documents, and track recruitment stages.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/careers"
            target="_blank"
            className="px-3 py-2 border border-[#E4E7EB] hover:border-slate-300 text-xs font-semibold rounded-xl bg-white text-slate-700 transition-all flex items-center gap-1.5"
          >
            <Globe className="h-3.5 w-3.5 text-slate-500" />
            Public Careers Page
            <ArrowUpRight className="h-3 w-3 text-slate-400" />
          </Link>
          <button
            onClick={fetchApplications}
            disabled={loading}
            className="px-4 py-2 border border-[#E4E7EB] hover:border-[#1B222C] text-xs font-bold rounded-xl bg-white text-[#1B222C] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div 
          onClick={() => setSelectedStatus("all")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === "all"
              ? "bg-white border-[#1B222C] ring-2 ring-[#1B222C]/10 shadow-sm"
              : "bg-white border-[#E4E7EB] hover:border-slate-300 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Received</span>
            <BriefcaseBusiness className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-[#1B222C]">{stats.total}</div>
          <span className="text-[11px] text-slate-400">All submitted CVs</span>
        </div>

        <div 
          onClick={() => setSelectedStatus("open")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === "open"
              ? "bg-amber-50/50 border-amber-400 ring-2 ring-amber-400/20 shadow-sm"
              : "bg-white border-[#E4E7EB] hover:border-amber-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between text-amber-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Review</span>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-700">{stats.open}</div>
          <span className="text-[11px] text-amber-600/80">Awaiting screening</span>
        </div>

        <div 
          onClick={() => setSelectedStatus("in_progress")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === "in_progress"
              ? "bg-blue-50/50 border-blue-400 ring-2 ring-blue-400/20 shadow-sm"
              : "bg-white border-[#E4E7EB] hover:border-blue-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between text-blue-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">In Evaluation</span>
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-700">{stats.inProgress}</div>
          <span className="text-[11px] text-blue-600/80">Interview / Assessment</span>
        </div>

        <div 
          onClick={() => setSelectedStatus("resolved")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatus === "resolved"
              ? "bg-emerald-50/50 border-emerald-400 ring-2 ring-emerald-400/20 shadow-sm"
              : "bg-white border-[#E4E7EB] hover:border-emerald-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between text-emerald-600 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Shortlisted / Hired</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{stats.resolved}</div>
          <span className="text-[11px] text-emerald-600/80">Qualified talent</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: List (2 cols on large screen) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search and Filters */}
          <div className="bg-white border border-[#E4E7EB] rounded-2xl p-4 shadow-sm space-y-3">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by candidate name, email, phone, experience, or skills..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1B222C]/10 focus:border-[#1B222C] transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#1B222C] hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                Search
              </button>
            </form>

            <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-0.5 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Status:</span>
              {[
                { id: "all", label: "All Candidates" },
                { id: "open", label: "Pending (Open)" },
                { id: "in_progress", label: "In Review" },
                { id: "resolved", label: "Shortlisted" },
                { id: "closed", label: "Closed / Archived" },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStatus(st.id)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    selectedStatus === st.id
                      ? "bg-[#1B222C] text-white shadow-sm"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Applications Registry Card List */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {loading ? (
            <div className="bg-white border border-[#E4E7EB] rounded-2xl p-12 text-center shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="h-7 w-7 rounded-full border-2 border-[#1B222C] border-t-transparent animate-spin" />
                <span className="text-xs font-semibold text-slate-500">Retrieving candidate profiles...</span>
              </div>
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-white border border-[#E4E7EB] rounded-2xl p-12 text-center shadow-sm space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <BriefcaseBusiness className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-[#1B222C]">No applications found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {selectedStatus !== "all" || searchQuery
                  ? "No candidate records matched the active filter or search criteria."
                  : "No career applications have been submitted to the platform yet."}
              </p>
              {(selectedStatus !== "all" || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedStatus("all");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 border border-slate-200 text-xs font-bold rounded-xl hover:bg-slate-50"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => {
                const { experience, portfolio, cover } = parseAppDetails(app.message);
                const isSelected = selectedApp?.id === app.id;

                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`bg-white border rounded-2xl p-5 shadow-sm transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? "border-[#1B222C] ring-2 ring-[#1B222C]/10 bg-slate-50/50"
                        : "border-[#E4E7EB] hover:border-slate-300 hover:shadow"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Left: Avatar + Details */}
                      <div className="flex items-start gap-3.5">
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#1B222C] to-slate-700 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                          {app.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-sm text-[#1B222C] hover:text-blue-600 transition-colors">
                              {app.name}
                            </h3>
                            <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-slate-100 text-slate-700">
                              Software Developer
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-slate-400" />
                              <a
                                href={`mailto:${app.email}`}
                                onClick={(e) => e.stopPropagation()}
                                className="hover:underline hover:text-[#1B222C]"
                              >
                                {app.email}
                              </a>
                            </span>
                            {app.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-slate-400" />
                                <a
                                  href={`tel:${app.phone}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="hover:underline hover:text-[#1B222C]"
                                >
                                  {app.phone}
                                </a>
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-[11px] text-slate-400">
                              <Calendar className="h-3 w-3" />
                              {new Date(app.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>

                          <div className="pt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            <span className="font-semibold text-slate-700">Experience:</span> {experience} • {cover}
                          </div>
                        </div>
                      </div>

                      {/* Right: Status and Quick Documents */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        {/* Status Badge */}
                        <div onClick={(e) => e.stopPropagation()}>
                          <select
                            value={app.status}
                            disabled={updatingId === app.id}
                            onChange={(e) =>
                              handleStatusChange(
                                app.id,
                                e.target.value as "open" | "in_progress" | "resolved" | "closed"
                              )
                            }
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer transition-all ${
                              app.status === "open"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : app.status === "in_progress"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : app.status === "resolved"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                            }`}
                          >
                            <option value="open">Pending Review</option>
                            <option value="in_progress">In Evaluation</option>
                            <option value="resolved">Shortlisted</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>

                        {/* Document Buttons */}
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => openDocument(app.id, "cv")}
                            disabled={docLoading === `${app.id}-cv`}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-[#1B222C] bg-white text-[11px] font-bold text-slate-700 hover:text-black transition-all flex items-center gap-1 shadow-2xs"
                            title="Open CV"
                          >
                            <FileText className="h-3 w-3 text-blue-600" />
                            CV
                          </button>
                          <button
                            type="button"
                            onClick={() => openDocument(app.id, "resume")}
                            disabled={docLoading === `${app.id}-resume`}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-[#1B222C] bg-white text-[11px] font-bold text-slate-700 hover:text-black transition-all flex items-center gap-1 shadow-2xs"
                            title="Open Résumé / Cover"
                          >
                            <Download className="h-3 w-3 text-emerald-600" />
                            Résumé
                          </button>
                          <Link
                            href={`/admin/tickets/${app.id}`}
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-[#1B222C] text-slate-500 hover:text-black transition-all"
                            title="Open full conversation ticket"
                          >
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Candidate Profile Inspector */}
        <div className="bg-white border border-[#E4E7EB] rounded-2xl p-6 shadow-sm sticky top-6 space-y-6">
          {selectedApp ? (
            (() => {
              const { experience, portfolio, cover } = parseAppDetails(selectedApp.message);

              return (
                <div className="space-y-6">
                  {/* Candidate Header */}
                  <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-[#1B222C] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                        {selectedApp.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-[#1B222C]">{selectedApp.name}</h2>
                        <span className="text-xs text-slate-500 block">Candidate ID: {selectedApp.id}</span>
                      </div>
                    </div>
                    <Link
                      href={`/admin/tickets/${selectedApp.id}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#1B222C] hover:text-white text-xs font-bold text-slate-700 transition-all flex items-center gap-1.5"
                    >
                      <span>Discussion</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>

                  {/* Recruitment Status Control */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Recruitment Stage
                    </label>
                    <select
                      value={selectedApp.status}
                      disabled={updatingId === selectedApp.id}
                      onChange={(e) =>
                        handleStatusChange(
                          selectedApp.id,
                          e.target.value as "open" | "in_progress" | "resolved" | "closed"
                        )
                      }
                      className="w-full text-xs font-bold p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1B222C]/10 cursor-pointer bg-white"
                    >
                      <option value="open">Pending Review (New)</option>
                      <option value="in_progress">In Evaluation (Technical Screen)</option>
                      <option value="resolved">Shortlisted (Offer Candidate)</option>
                      <option value="closed">Closed / Not Selected</option>
                    </select>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-slate-50 rounded-xl p-4 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Email:</span>
                      <a href={`mailto:${selectedApp.email}`} className="font-bold text-blue-600 hover:underline">
                        {selectedApp.email}
                      </a>
                    </div>
                    {selectedApp.phone && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-medium">Phone:</span>
                        <a href={`tel:${selectedApp.phone}`} className="font-bold text-[#1B222C] hover:underline">
                          {selectedApp.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium">Submitted:</span>
                      <span className="text-slate-700 font-medium">
                        {new Date(selectedApp.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {portfolio && (
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                        <span className="text-slate-400 font-medium">Portfolio:</span>
                        <a
                          href={portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-blue-600 hover:underline flex items-center gap-1 max-w-[180px] truncate"
                        >
                          {portfolio}
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Documents Section */}
                  <div className="space-y-2.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Submitted Documents
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => openDocument(selectedApp.id, "cv")}
                        disabled={docLoading === `${selectedApp.id}-cv`}
                        className="p-3 rounded-xl border border-slate-200 hover:border-[#1B222C] bg-white text-xs font-bold text-slate-800 transition-all flex flex-col items-center gap-1.5 shadow-2xs hover:bg-slate-50"
                      >
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span>Curriculum Vitae</span>
                        <span className="text-[10px] font-normal text-slate-400">View / Download</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openDocument(selectedApp.id, "resume")}
                        disabled={docLoading === `${selectedApp.id}-resume`}
                        className="p-3 rounded-xl border border-slate-200 hover:border-[#1B222C] bg-white text-xs font-bold text-slate-800 transition-all flex flex-col items-center gap-1.5 shadow-2xs hover:bg-slate-50"
                      >
                        <Download className="h-5 w-5 text-emerald-600" />
                        <span>Cover / Résumé</span>
                        <span className="text-[10px] font-normal text-slate-400">View / Download</span>
                      </button>
                    </div>
                  </div>

                  {/* Candidate Statement */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Candidate Statement &amp; Qualifications
                    </label>
                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 text-xs text-slate-700 leading-relaxed max-h-64 overflow-y-auto whitespace-pre-wrap">
                      {cover}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-col gap-2">
                    <a
                      href={`mailto:${selectedApp.email}?subject=M%26F%20Technologies%20Interview%20Invitation%20%E2%80%94%20Software%20Developer`}
                      className="w-full py-2.5 bg-[#1B222C] hover:bg-black text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Mail className="h-4 w-4" />
                      Email Candidate
                    </a>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="py-16 text-center space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <User className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-[#1B222C]">No Candidate Selected</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Click on any applicant in the registry to inspect their full qualifications, contact details, and submitted CV.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
