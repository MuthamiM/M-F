"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Phone, 
  Users, 
  Clock, 
  TrendingUp, 
  User, 
  Building,
  Mail,
  ArrowUpRight,
  Play,
  Pause,
  AlertCircle
} from "lucide-react";

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

export default function CallCenterPage() {
  const [callbacks, setCallbacks] = useState<TicketItem[]>([]);
  const [selectedCall, setSelectedCall] = useState<TicketItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchCallbacks = async () => {
    try {
      const token = sessionStorage.getItem("adminToken");
      const headers = { Authorization: `Bearer ${token}` };

      const host = typeof window !== "undefined" ? window.location.hostname : "localhost";
      const response = await fetch(`http://${host}:4000/api/tickets?type=chatbot&status=open`, { headers });
      const resData = await response.json();

      if (response.ok && resData.success) {
        setCallbacks(resData.data);
        if (resData.data.length > 0 && !selectedCall) {
          setSelectedCall(resData.data[0]); // Default to first caller
        }
      } else {
        setErrorMsg("Failed to retrieve callbacks queue.");
      }
    } catch {
      setErrorMsg("Failed to contact the backend service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCallbacks();
    const interval = setInterval(fetchCallbacks, 8000); // Poll every 8 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 font-sans antialiased text-[#1B222C]">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-[#E4E7EB] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Callbacks Pending</span>
            <div className="p-2 rounded-lg bg-red-50"><Phone className="h-4 w-4 text-red-600 animate-bounce" /></div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{callbacks.length}</div>
            <span className="text-[10px] text-slate-400 font-medium">Awaiting voice response</span>
          </div>
        </div>

        <div className="bg-white border border-[#E4E7EB] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Agents Online</span>
            <div className="p-2 rounded-lg bg-emerald-50"><Users className="h-4 w-4 text-emerald-600" /></div>
          </div>
          <div>
            <div className="text-2xl font-bold">12</div>
            <span className="text-[10px] text-slate-400 font-medium">Managers active now</span>
          </div>
        </div>

        <div className="bg-white border border-[#E4E7EB] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Avg Response Time</span>
            <div className="p-2 rounded-lg bg-blue-50"><Clock className="h-4 w-4 text-blue-600" /></div>
          </div>
          <div>
            <div className="text-2xl font-bold">1.8 Min</div>
            <span className="text-[10px] text-slate-400 font-medium">Standard SLA response</span>
          </div>
        </div>

        <div className="bg-white border border-[#E4E7EB] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Inbound Call Traffic</span>
            <div className="p-2 rounded-lg bg-slate-100"><TrendingUp className="h-4 w-4 text-slate-700" /></div>
          </div>
          <div>
            <div className="text-2xl font-bold">+40%</div>
            <span className="text-[10px] text-slate-400 font-medium">Inbound growth this week</span>
          </div>
        </div>
      </div>

      {/* Grid: Callers List (Left) + Caller Information Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Callers Queue Table */}
        <div className="lg:col-span-2 bg-white border border-[#E4E7EB] rounded-2xl shadow-sm overflow-hidden py-4">
          <div className="px-6 pb-4 border-b border-[#E4E7EB]/60 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Callback Queue</h3>
            <button 
              onClick={() => { setLoading(true); fetchCallbacks(); }}
              className="text-xs font-bold text-[#1B222C] hover:underline"
            >
              Force Sync
            </button>
          </div>

          {errorMsg && (
            <div className="mx-6 mt-4 bg-red-50 text-red-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-[#E4E7EB]">
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Time Requested</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Name / Company</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Phone</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EB]">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12">
                      <div className="inline-block h-5 w-5 rounded-full border-2 border-[#1B222C] border-t-transparent animate-spin" />
                    </td>
                  </tr>
                ) : callbacks.map((c) => (
                  <tr 
                    key={c.id} 
                    onClick={() => setSelectedCall(c)}
                    className={`cursor-pointer transition-colors ${
                      selectedCall?.id === c.id ? "bg-slate-100/70" : "hover:bg-slate-50/50"
                    }`}
                  >
                    <td className="px-6 py-4 text-xs text-slate-500 font-semibold">
                      {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="font-bold text-[#1B222C]">{c.name}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">{c.company}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono font-bold text-slate-700">
                      {c.phone || "No phone provided"}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <button 
                        className="px-2.5 py-1.5 bg-[#1B222C] hover:bg-[#3E4C59] text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Select Caller
                      </button>
                    </td>
                  </tr>
                ))}
                {callbacks.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-xs font-semibold text-slate-500">
                      No callbacks pending in queue.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Caller Information Panel */}
        <div className="space-y-4 lg:col-span-1">
          {selectedCall ? (
            <div className="bg-white border border-[#E4E7EB] rounded-2xl p-5 shadow-sm space-y-6">
              <div className="text-center space-y-2 pb-4 border-b border-[#E4E7EB]/60">
                <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                  <User className="h-8 w-8 text-[#3E4C59]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1B222C]">{selectedCall.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{selectedCall.company}</p>
                </div>
              </div>

              {/* Call Details */}
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Phone Number</span>
                    <a href={`tel:${selectedCall.phone}`} className="font-bold text-slate-700 hover:underline">
                      {selectedCall.phone || "N/A"}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Email Address</span>
                    <a href={`mailto:${selectedCall.email}`} className="font-bold text-slate-700 hover:underline">
                      {selectedCall.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* AI Summarize Block */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#1B222C]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Inbound Request Details</span>
                </div>
                <p className="text-[11px] font-semibold text-slate-700 leading-relaxed">
                  {selectedCall.message}
                </p>
              </div>

              {/* Interactive Call Recording & Waves UI */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pre-call Simulator</span>
                  <span className="text-[9px] text-slate-400 font-medium">Channel Ready</span>
                </div>
                
                {/* Wave animation simulator */}
                <div className="h-10 flex items-center justify-center gap-1 bg-white rounded-lg border border-slate-100 overflow-hidden px-4">
                  {[...Array(20)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`w-1 rounded-full bg-[#1B222C] transition-all duration-300 ${
                        isPlaying ? "animate-pulse" : ""
                      }`}
                      style={{ 
                        height: isPlaying ? `${Math.floor(Math.random() * 24) + 6}px` : "4px",
                        animationDelay: `${i * 30}ms`
                      }}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#1B222C] hover:bg-[#3E4C59] text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    <span>{isPlaying ? "Pause Channel" : "Listen Channel"}</span>
                  </button>
                  <span className="text-[10px] font-mono text-slate-400 font-semibold">00:00 / 00:12</span>
                </div>
              </div>

              {/* Manage Alone Link */}
              <Link
                href={`/admin/tickets/${selectedCall.id}`}
                className="w-full py-2.5 border border-[#E4E7EB] hover:border-[#1B222C] text-[#3E4C59] hover:text-[#1B222C] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-[#1B222C] hover:bg-[#3E4C59] !text-white"
              >
                <span>Open Live Chat &amp; Call Console</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-[#E4E7EB] rounded-2xl p-6 text-center shadow-sm">
              <Phone className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-400 mt-2">Select a callback request to preview detailed caller data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
