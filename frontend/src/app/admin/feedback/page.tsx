"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  Filter,
  Star,
  RefreshCw,
  Trash2,
  Mail,
  CheckCircle,
  Clock,
  Archive,
  MessageSquare,
  Sparkles,
  Globe,
  AlertCircle,
} from "lucide-react";

interface FeedbackItem {
  id: string;
  rating: number | null;
  feedback: string;
  name: string | null;
  email: string | null;
  category: string;
  status: "new" | "reviewed" | "resolved" | "archived";
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  updatedAt: string;
}

interface FeedbackStats {
  total: number;
  newCount: number;
  reviewedCount: number;
  resolvedCount: number;
  avgRating: number;
}

export default function AdminFeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [stats, setStats] = useState<FeedbackStats>({
    total: 0,
    newCount: 0,
    reviewedCount: 0,
    resolvedCount: 0,
    avgRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedRating, setSelectedRating] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const fetchFeedback = async () => {
    try {
      setRefreshing(true);
      setErrorMsg("");
      const token = sessionStorage.getItem("adminToken");
      const headers = { Authorization: `Bearer ${token}` };

      const params = new URLSearchParams();
      if (selectedStatus !== "all") params.append("status", selectedStatus);
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const [resList, resStats] = await Promise.all([
        fetch(`/api/feedback?${params.toString()}`, { headers }),
        fetch("/api/feedback/stats", { headers }),
      ]);

      if (resList.ok) {
        const listData = await resList.json();
        if (listData.success && Array.isArray(listData.data)) {
          setFeedbackList(listData.data);
        }
      } else {
        setErrorMsg("Failed to load feedback records.");
      }

      if (resStats.ok) {
        const statsData = await resStats.json();
        if (statsData.success && statsData.data) {
          setStats(statsData.data);
        }
      }
    } catch (err: any) {
      setErrorMsg("Network error connecting to feedback API.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [selectedStatus, selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFeedback();
  };

  // Optimistic status update
  const handleStatusChange = async (id: string, newStatus: FeedbackItem["status"]) => {
    const prevList = [...feedbackList];
    setFeedbackList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(`/api/feedback/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error();
      }
      // Refresh stats
      fetchFeedback();
    } catch {
      setFeedbackList(prevList);
      alert("Failed to update status on server.");
    }
  };

  // Delete feedback item
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this feedback entry?")) {
      return;
    }

    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(`/api/feedback/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setFeedbackList((prev) => prev.filter((item) => item.id !== id));
        fetchFeedback();
      } else {
        alert("Failed to delete feedback entry.");
      }
    } catch {
      alert("Network error deleting entry.");
    }
  };

  // Filter list by selected rating on frontend
  const filteredList = useMemo(() => {
    return feedbackList.filter((item) => {
      if (selectedRating !== "all") {
        if (selectedRating === "stars-5" && item.rating !== 5) return false;
        if (selectedRating === "stars-4" && item.rating !== 4) return false;
        if (selectedRating === "stars-3" && item.rating !== 3) return false;
        if (selectedRating === "low" && (item.rating === null || item.rating > 2)) return false;
      }
      return true;
    });
  }, [feedbackList, selectedRating]);

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1B222C]">
            FAQ &amp; User Feedback Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time feedback submitted by visitors, institutional partners, and developers.
          </p>
        </div>

        <button
          onClick={fetchFeedback}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-[#CBD2D9] hover:bg-slate-50 text-[#1B222C] transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Feedback */}
        <div className="bg-white p-5 rounded-2xl border border-[#E4E7EB] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Submissions
            </p>
            <h3 className="text-2xl font-extrabold text-[#1B222C] mt-1">{stats.total}</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <MessageSquare className="h-5 w-5" />
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white p-5 rounded-2xl border border-[#E4E7EB] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Average Rating
            </p>
            <div className="flex items-center gap-2 mt-1">
              <h3 className="text-2xl font-extrabold text-[#1B222C]">
                {stats.avgRating > 0 ? stats.avgRating : "N/A"}
              </h3>
              {stats.avgRating > 0 && (
                <div className="flex items-center text-amber-500">
                  <Star className="h-4 w-4 fill-amber-400" />
                </div>
              )}
            </div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>

        {/* New / Pending Review */}
        <div className="bg-white p-5 rounded-2xl border border-[#E4E7EB] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Review
            </p>
            <h3 className="text-2xl font-extrabold text-blue-600 mt-1">{stats.newCount}</h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {/* Reviewed / Resolved */}
        <div className="bg-white p-5 rounded-2xl border border-[#E4E7EB] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Processed &amp; Resolved
            </p>
            <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">
              {stats.reviewedCount + stats.resolvedCount}
            </h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E4E7EB] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keyword, name, email, or message..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-[#CBD2D9] rounded-xl text-[#1B222C] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1B222C]"
          />
        </form>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-[#CBD2D9] rounded-xl px-3 py-2 text-[#1B222C] font-medium focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="new">New (Pending)</option>
            <option value="reviewed">Reviewed</option>
            <option value="resolved">Resolved</option>
            <option value="archived">Archived</option>
          </select>

          {/* Rating Filter */}
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="text-xs bg-slate-50 border border-[#CBD2D9] rounded-xl px-3 py-2 text-[#1B222C] font-medium focus:outline-none"
          >
            <option value="all">All Ratings</option>
            <option value="stars-5">5 Stars</option>
            <option value="stars-4">4 Stars</option>
            <option value="stars-3">3 Stars</option>
            <option value="low">1 - 2 Stars</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-[#CBD2D9] rounded-xl px-3 py-2 text-[#1B222C] font-medium focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="general">General</option>
            <option value="lending">Core Lending</option>
            <option value="scoring">Credit Scoring</option>
            <option value="security">Security</option>
            <option value="integrations">Integrations</option>
            <option value="suggestion">Suggestions</option>
          </select>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Feedback List Table / Cards */}
      <div className="bg-white rounded-2xl border border-[#E4E7EB] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-4 border-[#1B222C] border-t-transparent animate-spin" />
            <span className="text-xs font-semibold text-slate-500">Loading database records...</span>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <MessageSquare className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-[#1B222C]">No Feedback Records Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are no submissions matching your current search criteria.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredList.map((item) => {
              const formattedDate = new Date(item.createdAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              });

              return (
                <article key={item.id} className="p-4 sm:p-6 hover:bg-slate-50/70 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Left: User, Rating & Message */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Rating Stars */}
                        {item.rating ? (
                          <div className="flex items-center gap-0.5 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  (item.rating ?? 0) >= star
                                    ? "fill-amber-400 text-amber-500"
                                    : "text-slate-300"
                                }`}
                              />
                            ))}
                            <span className="text-[10px] font-bold text-amber-700 ml-1">
                              {item.rating}/5
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            No Rating
                          </span>
                        )}

                        {/* Category Badge */}
                        <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {item.category}
                        </span>

                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            item.status === "new"
                              ? "bg-blue-100 text-blue-700 border border-blue-200"
                              : item.status === "reviewed"
                              ? "bg-purple-100 text-purple-700 border border-purple-200"
                              : item.status === "resolved"
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {item.status}
                        </span>

                        <span className="text-[11px] text-slate-400">• {formattedDate}</span>
                      </div>

                      {/* Feedback Body */}
                      <p className="text-xs sm:text-sm text-[#1B222C] font-normal leading-relaxed whitespace-pre-line bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
                        {item.feedback}
                      </p>

                      {/* Author / Metadata strip */}
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                        <span className="font-semibold text-slate-700">
                          {item.name || "Anonymous Visitor"}
                        </span>

                        {item.email && (
                          <a
                            href={`mailto:${item.email}?subject=Re: Your M%26F Technologies Feedback`}
                            className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                          >
                            <Mail className="h-3 w-3" />
                            <span>{item.email}</span>
                          </a>
                        )}

                        {item.ipAddress && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <Globe className="h-3 w-3" />
                            <span>{item.ipAddress}</span>
                          </span>
                        )}

                        <span className="text-slate-400 font-mono text-[10px]">ID: {item.id}</span>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex md:flex-col items-center md:items-end gap-2 shrink-0 self-end md:self-start">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(item.id, e.target.value as FeedbackItem["status"])
                        }
                        className="text-xs bg-white border border-[#CBD2D9] rounded-lg px-2.5 py-1.5 text-[#1B222C] font-medium shadow-2xs focus:outline-none cursor-pointer"
                      >
                        <option value="new">Mark as New</option>
                        <option value="reviewed">Mark as Reviewed</option>
                        <option value="resolved">Mark as Resolved</option>
                        <option value="archived">Archive</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete feedback entry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
