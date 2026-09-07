"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter, AlertCircle, Phone, FileText, Mail, RefreshCw, ArrowUpRight, MapPin, Globe } from "lucide-react";

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
  assignedAgent?: string;
  latitude?: number;
  longitude?: number;
  ipAddress?: string;
  geoCity?: string;
  geoCountry?: string;
  geoRegion?: string;
  createdAt: string;
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Filters state
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTickets = async () => {
    try {
      const token = sessionStorage.getItem("adminToken");
      const headers = { Authorization: `Bearer ${token}` };

      // Build query string based on filters
      const params = new URLSearchParams();
      if (selectedStatus !== "all") params.append("status", selectedStatus);
      if (selectedPriority !== "all") params.append("priority", selectedPriority);
      if (selectedType !== "all") params.append("type", selectedType);
      if (searchQuery.trim() !== "") params.append("search", searchQuery);

      const response = await fetch(`/api/tickets?${params.toString()}`, { headers });
      const resData = await response.json();

      if (response.ok && resData.success) {
        setTickets(resData.data);
      } else {
        setErrorMsg("Could not fetch tickets queue.");
      }
    } catch {
      setErrorMsg("Failed to connect to backend service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [selectedStatus, selectedPriority, selectedType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    fetchTickets();
  };

  return (
    <div className="space-y-6 font-sans antialiased text-[#1B222C]">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Support Ticket Registry</h1>
          <p className="text-xs text-slate-500 mt-1">Manage and assign support tickets initiated from chatbot callback queues, contact logs, and platform demos.</p>
        </div>
        <button 
          onClick={() => { setLoading(true); fetchTickets(); }}
          className="px-4 py-2 border border-[#E4E7EB] hover:border-[#1B222C] text-xs font-bold rounded-xl bg-white transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* Grid Layout: Main Table (Left) + Search Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Main Table Column */}
        <div className="lg:col-span-3 bg-white border border-[#E4E7EB] rounded-2xl shadow-sm overflow-hidden space-y-4 py-4">
          {/* Internal Filters Bar */}
          <div className="px-6 flex flex-wrap gap-2 items-center justify-between border-b border-[#E4E7EB]/60 pb-4">
            <div className="flex items-center gap-1.5">
              {/* Quick Status Filters */}
              {["all", "open", "in_progress", "resolved", "closed"].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedStatus === st
                      ? "bg-[#1B222C] text-white"
                      : "bg-[#F4F6F8] hover:bg-slate-200 text-[#3E4C59]"
                  }`}
                >
                  {st === "all" ? "All Queue" : st.replace("_", " ").toUpperCase()}
                </button>
              ))}
            </div>

            {/* Total Results Count */}
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {tickets.length} Matches Found
            </span>
          </div>

          {errorMsg && (
            <div className="mx-6 bg-red-50 text-red-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Ticket Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50 border-b border-[#E4E7EB]">
                   <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">ID</th>
                   <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Subject</th>
                   <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Requester</th>
                   <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Source</th>
                   <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Priority</th>
                   <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Agent</th>
                   <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Created</th>
                   <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                   <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-[#E4E7EB]">
                 {loading ? (
                   <tr>
                     <td colSpan={9} className="text-center py-12">
                       <div className="inline-block h-5 w-5 rounded-full border-2 border-[#1B222C] border-t-transparent animate-spin" />
                     </td>
                   </tr>
                 ) : tickets.map((t) => (
                   <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                     <td className="px-6 py-4 text-xs font-bold text-[#1B222C]">{t.id}</td>
                     <td className="px-6 py-4 text-xs max-w-[180px] truncate font-medium text-slate-700" title={t.message}>
                       {t.message}
                     </td>
                     <td className="px-6 py-4 text-xs">
                        <div className="font-bold">{t.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{t.company}</div>
                        {(t.geoCity || t.geoCountry || t.ipAddress) && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-600 font-medium mt-1" title={t.ipAddress ? `IP: ${t.ipAddress}` : undefined}>
                            <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
                            <span>{[t.geoCity, t.geoCountry].filter(Boolean).join(", ") || t.ipAddress}</span>
                          </div>
                        )}
                      </td>
                     <td className="px-6 py-4 text-xs">
                       <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold border ${
                         t.type === "chatbot" ? "bg-purple-50 text-purple-700 border-purple-200" :
                         t.type === "demo" ? "bg-blue-50 text-blue-700 border-blue-200" :
                         "bg-slate-50 text-slate-700 border-slate-200"
                       }`}>
                         {t.type === "chatbot" && <Phone className="h-2.5 w-2.5" />}
                         {t.type === "demo" && <FileText className="h-2.5 w-2.5" />}
                         {t.type === "contact" && <Mail className="h-2.5 w-2.5" />}
                         {t.type.toUpperCase()}
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
                     <td className="px-6 py-4 text-xs text-slate-600 font-bold">
                       {t.assignedAgent || <span className="text-slate-300 font-normal italic">Unassigned</span>}
                     </td>
                     <td className="px-6 py-4 text-xs text-slate-500">
                       {new Date(t.createdAt).toLocaleString()}
                     </td>
                     <td className="px-6 py-4 text-xs">
                       <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                         t.status === "open" ? "bg-red-50 text-red-600 border border-red-200" :
                         t.status === "in_progress" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                         t.status === "resolved" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                         "bg-slate-100 text-slate-500 border border-slate-200"
                       }`}>
                         {t.status.replace("_", " ")}
                       </span>
                     </td>
                     <td className="px-6 py-4 text-xs">
                       {/* Navigate directly to this ticket page alone */}
                       <Link
                         href={`/admin/tickets/${t.id}`}
                         className="px-2 py-1.5 border border-[#E4E7EB] hover:border-[#1B222C] text-[#3E4C59] hover:text-[#1B222C] text-[10px] font-bold rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                       >
                         Manage Alone <ArrowUpRight className="h-3 w-3" />
                       </Link>
                     </td>
                   </tr>
                 ))}
                 {tickets.length === 0 && !loading && (
                   <tr>
                     <td colSpan={9} className="text-center py-12 text-xs font-semibold text-slate-500">
                       No tickets matching current filters.
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
          </div>
        </div>

        {/* Right Filter Sidebar (Interactive Query Tools) */}
        <div className="space-y-4 lg:col-span-1">
          {/* Keyword Search */}
          <div className="bg-white border border-[#E4E7EB] rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Query Database</h3>
            
            <form onSubmit={handleSearchSubmit} className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Name, email, organization..."
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B222C]"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-2 bg-[#1B222C] hover:bg-[#3E4C59] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Execute Query
              </button>
            </form>
          </div>

          {/* Additional Structured Filters */}
          <div className="bg-white border border-[#E4E7EB] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-1.5">
              <Filter className="h-4 w-4 text-slate-600" />
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Advanced Filters</h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500">Ticket Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B222C]"
                >
                  <option value="all">All Sources</option>
                  <option value="chatbot">Chatbot Callback</option>
                  <option value="demo">Demo Request</option>
                  <option value="contact">Contact Message</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-500">Priority Level</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B222C]"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
