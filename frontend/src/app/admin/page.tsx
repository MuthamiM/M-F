"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Ticket, 
  MessageSquare, 
  Layers, 
  Mail, 
  ArrowUpRight, 
  Clock, 
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface Stats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  typeChatbot: number;
  typeDemo: number;
  typeContact: number;
}

interface TicketItem {
  id: string;
  type: "chatbot" | "demo" | "contact";
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentTickets, setRecentTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("adminToken");
      if (!token) {
        window.location.href = "/admin/login";
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, listRes] = await Promise.all([
        fetch("/api/tickets/stats", { headers }),
        fetch("/api/tickets", { headers }),
      ]);

      if (statsRes.status === 401 || listRes.status === 401) {
        sessionStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        return;
      }

      const statsData = await statsRes.json();
      const listData = await listRes.json();

      if (statsRes.ok && listRes.ok && statsData.success && listData.success) {
        setStats(statsData.data);
        setRecentTickets(listData.data.slice(0, 5)); // Top 5 recent
        setErrorMsg("");
      } else {
        setErrorMsg("Failed to retrieve console data. Please verify session or refresh.");
      }
    } catch {
      setErrorMsg("Failed to load ticketing metrics. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Polling every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 rounded-full border-2 border-[#1B222C] border-t-transparent animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Loading metrics...</span>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="bg-red-50 text-red-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        <span>{errorMsg}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans antialiased text-[#1B222C]">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">System Overview</h1>
          <p className="text-xs text-slate-500 mt-1">Real-time statistics of inbound chatbot callbacks and institutional demo requests.</p>
        </div>
        <button 
          onClick={() => { setLoading(true); fetchData(); }}
          className="px-4 py-2 border border-[#E4E7EB] hover:border-[#1B222C] text-xs font-bold rounded-xl bg-white transition-all cursor-pointer"
        >
          Refresh Feed
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-[#E4E7EB] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Tickets</span>
            <div className="p-2 rounded-lg bg-slate-100"><Ticket className="h-4 w-4 text-slate-700" /></div>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <span className="text-[10px] text-slate-400 font-medium">All inbound requests</span>
          </div>
        </div>

        <div className="bg-white border border-[#E4E7EB] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Open Queues</span>
            <div className="p-2 rounded-lg bg-blue-50"><Clock className="h-4 w-4 text-blue-600 animate-pulse" /></div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{stats?.open || 0}</div>
            <span className="text-[10px] text-slate-400 font-medium">Awaiting response callback</span>
          </div>
        </div>

        <div className="bg-white border border-[#E4E7EB] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">In Progress</span>
            <div className="p-2 rounded-lg bg-amber-50"><Layers className="h-4 w-4 text-amber-600" /></div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">{stats?.inProgress || 0}</div>
            <span className="text-[10px] text-slate-400 font-medium">Active agent review</span>
          </div>
        </div>

        <div className="bg-white border border-[#E4E7EB] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Resolved Cases</span>
            <div className="p-2 rounded-lg bg-emerald-50"><CheckCircle className="h-4 w-4 text-emerald-600" /></div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600">{stats?.resolved || 0}</div>
            <span className="text-[10px] text-slate-400 font-medium">Completed interactions</span>
          </div>
        </div>
      </div>

      {/* Ticket Source Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E4E7EB] rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Chatbot Callback</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Direct lead calls initiated via the client chat widget beep interface.</p>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold">{stats?.typeChatbot || 0}</span>
            <MessageSquare className="h-10 w-10 text-slate-200" />
          </div>
        </div>

        <div className="bg-white border border-[#E4E7EB] rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Demo Applications</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Evaluation pipeline setups requested by institutional clients.</p>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold">{stats?.typeDemo || 0}</span>
            <Layers className="h-10 w-10 text-slate-200" />
          </div>
        </div>

        <div className="bg-white border border-[#E4E7EB] rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Contact Submissions</h3>
            <p className="text-xs text-slate-400 leading-relaxed">General compliance, pricing, or developer requests.</p>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold">{stats?.typeContact || 0}</span>
            <Mail className="h-10 w-10 text-slate-200" />
          </div>
        </div>
      </div>

      {/* Recent Feed Table */}
      <div className="bg-white border border-[#E4E7EB] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[#E4E7EB] flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Recent Ticketing Feed</h3>
          <Link href="/admin/tickets" className="text-xs font-semibold text-[#1B222C] hover:underline flex items-center gap-1">
            View All Tickets <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-[#E4E7EB]">
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">ID</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Subject / Message</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Requester</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Source</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Priority</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Created</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EB]">
              {recentTickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-[#1B222C]">{t.id}</td>
                  <td className="px-6 py-4 text-xs max-w-xs truncate font-medium text-slate-700" title={t.message}>
                    {t.message}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <div className="font-bold">{t.name}</div>
                    <div className="text-[10px] text-slate-400 font-medium">{t.email}</div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border ${
                      t.type === "chatbot" ? "bg-purple-50 text-purple-700 border-purple-200" :
                      t.type === "demo" ? "bg-blue-50 text-blue-700 border-blue-200" :
                      "bg-slate-50 text-slate-700 border-slate-200"
                    }`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      t.status === "open" ? "bg-red-50 text-red-600 border border-red-200" :
                      t.status === "in_progress" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                      t.status === "resolved" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                      "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}>
                      {t.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs uppercase tracking-wider font-bold">
                    <span className={
                      t.priority === "high" ? "text-red-600" :
                      t.priority === "medium" ? "text-amber-500" :
                      "text-slate-400"
                    }>
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400 font-medium">
                    {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {/* Link to detail page alone */}
                    <Link
                      href={`/admin/tickets/${t.id}`}
                      className="px-2.5 py-1.5 border border-[#E4E7EB] hover:border-[#1B222C] text-[#3E4C59] hover:text-[#1B222C] text-[10px] font-bold rounded-lg transition-colors inline-block cursor-pointer"
                    >
                      Manage alone
                    </Link>
                  </td>
                </tr>
              ))}
              {recentTickets.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-xs font-semibold text-slate-500">
                    No active tickets received.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
