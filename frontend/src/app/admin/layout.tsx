"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Ticket, PhoneCall, LogOut, Shield, Menu, X, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminNotification {
  id: string;
  ticketId: string;
  title: string;
  body: string;
  time: string;
}

let sharedAudioCtx: AudioContext | null = null;

function initAudioContext() {
  if (typeof window === "undefined") return;
  if (!sharedAudioCtx) {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (Ctx) {
      sharedAudioCtx = new Ctx();
    }
  }
  if (sharedAudioCtx && sharedAudioCtx.state === "suspended") {
    sharedAudioCtx.resume().catch(() => {});
  }
}

function playAdminNotificationSound() {
  try {
    initAudioContext();
    if (!sharedAudioCtx) return;

    const ctx = sharedAudioCtx;
    const playTone = (freq: number, start: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.22, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur);
    };
    const now = ctx.currentTime;
    // Classic 3-tone iOS Chime (High alert tone for admin)
    playTone(1318.51, now, 0.12);
    playTone(1567.98, now + 0.08, 0.12);
    playTone(2093.00, now + 0.16, 0.30);
  } catch {}
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [knownTickets, setKnownTickets] = useState<Map<string, number> | null>(null);
  const [adminBanner, setAdminBanner] = useState<AdminNotification | null>(null);

  useEffect(() => {
    // Skip auth check if on login page
    if (pathname === "/admin/login") {
      setAuthorized(true);
      setLoading(false);
      return;
    }

    const token = sessionStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    } else {
      setAuthorized(true);
    }
    setLoading(false);
  }, [pathname, router]);

  // Unlock AudioContext on first click or keypress
  useEffect(() => {
    const handleInteraction = () => {
      initAudioContext();
    };
    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  // Background polling for new tickets / client messages to trigger sound + iOS banner
  useEffect(() => {
    if (!authorized || pathname === "/admin/login") return;

    const checkNewTickets = async () => {
      try {
        const token = sessionStorage.getItem("adminToken");
        if (!token) return;

        const res = await fetch("/api/tickets", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const resData = await res.json();
          if (resData.success && Array.isArray(resData.data)) {
            const currentMap = new Map<string, number>();
            for (const t of resData.data) {
              const msgCount = Array.isArray(t.messages) ? t.messages.length : 0;
              currentMap.set(t.id, msgCount);
            }

            setKnownTickets((prev) => {
              if (prev === null) {
                // Initial load: seed known tickets without popping alert
                return currentMap;
              }

              for (const ticket of resData.data) {
                const prevMsgCount = prev.get(ticket.id);
                const currentMsgCount = Array.isArray(ticket.messages) ? ticket.messages.length : 0;

                // Brand new ticket
                if (prevMsgCount === undefined) {
                  playAdminNotificationSound();
                  setAdminBanner({
                    id: "notif-" + Date.now(),
                    ticketId: ticket.id,
                    title: `NEW INBOUND ${ticket.id}`,
                    body: `${ticket.name} (${ticket.company || "Visitor"}): ${ticket.message}`,
                    time: "Just now",
                  });
                  break;
                } 
                // New message in existing ticket
                else if (currentMsgCount > prevMsgCount) {
                  const lastMsg = ticket.messages[ticket.messages.length - 1];
                  if (lastMsg && lastMsg.sender === "client") {
                    playAdminNotificationSound();
                    setAdminBanner({
                      id: "notif-" + Date.now(),
                      ticketId: ticket.id,
                      title: `NEW CLIENT MSG — ${ticket.id}`,
                      body: `${lastMsg.senderName || ticket.name}: ${lastMsg.text}`,
                      time: "Just now",
                    });
                    break;
                  }
                }
              }

              return currentMap;
            });
          }
        }
      } catch (err) {
        console.warn("Background notification check failed:", err);
      }
    };

    checkNewTickets();
    const interval = setInterval(checkNewTickets, 4000); // Check every 4 seconds
    return () => clearInterval(interval);
  }, [authorized, pathname]);

  // Auto dismiss notification banner after 6s
  useEffect(() => {
    if (adminBanner) {
      const timer = setTimeout(() => setAdminBanner(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [adminBanner]);

  // Close sidebar on navigation change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-4 border-[#1B222C] border-t-transparent animate-spin" />
          <span className="text-xs font-semibold text-[#3E4C59]">Verifying credentials...</span>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Tickets Console", href: "/admin/tickets", icon: Ticket },
    { label: "Call Center Queue", href: "/admin/call-center", icon: PhoneCall },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex font-sans antialiased text-[#1B222C] relative">
      
      {/* iOS NOTIFICATION BANNER FOR ADMIN CONSOLE */}
      <AnimatePresence>
        {adminBanner && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            onClick={() => {
              const tId = adminBanner.ticketId;
              setAdminBanner(null);
              router.push(`/admin/tickets/${tId}`);
            }}
            className="fixed top-4 right-4 sm:right-6 z-[100000] w-[340px] sm:w-[380px] cursor-pointer"
          >
            <div className="bg-[#111827]/95 backdrop-blur-xl text-white rounded-[22px] p-4 shadow-2xl border border-white/20 flex flex-col gap-1.5 select-none hover:bg-[#111827] transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold tracking-wider text-slate-300 uppercase">
                    INBOUND ALERT
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-medium">{adminBanner.time}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAdminBanner(null);
                    }}
                    className="text-slate-400 hover:text-white p-0.5 rounded-full"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Bell className="h-3.5 w-3.5 text-amber-400" />
                  {adminBanner.title}
                </h4>
                <p className="text-xs text-slate-300 font-normal line-clamp-2 leading-tight mt-1">
                  {adminBanner.body}
                </p>
              </div>

              <div className="mt-1 text-[9px] font-bold text-blue-400 underline flex items-center justify-end">
                Click to open console &rarr;
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile Sidebar Overlay ─────────────────────────────────────── */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar Navigation (Responsive) ──────────────────────────────── */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-[#1B222C] text-white flex flex-col justify-between shrink-0 z-50 transform lg:transform-none lg:static transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Logo & Brand Header */}
          <div className="p-6 border-b border-[#3E4C59]/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8 rounded-full bg-[#3E4C59] flex items-center justify-center shrink-0">
                <span className="h-4 w-4 rounded-full bg-white absolute" />
                <span className="h-2 w-2 rounded-full bg-[#3E4C59] absolute right-0" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-wider uppercase">M&amp;F Platform</h1>
                <span className="text-[9px] text-[#9AA5B1] font-semibold uppercase tracking-wider block">Admin Console</span>
              </div>
            </div>
            
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden p-1.5 hover:bg-[#3E4C59]/50 rounded-lg text-[#9AA5B1] hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? "bg-[#3E4C59] text-white"
                      : "text-[#9AA5B1] hover:text-white hover:bg-[#3E4C59]/30"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile / Logout */}
        <div className="p-4 border-t border-[#3E4C59]/30">
          <div className="flex items-center justify-between bg-[#3E4C59]/20 p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-slate-600 flex items-center justify-center">
                <Shield className="h-4 w-4 text-[#9AA5B1]" />
              </div>
              <div>
                <div className="text-xs font-bold truncate max-w-[120px]">Super Administrator</div>
                <div className="text-[9px] text-[#9AA5B1]">admin@mftechnologies.com</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-[#9AA5B1] hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-[#E4E7EB] px-4 lg:px-8 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-[#3E4C59]"
            >
              <Menu className="h-5 w-5" />
            </button>

            <h2 className="text-xs sm:text-sm font-bold text-[#1B222C]">
              {navItems.find((i) => i.href === pathname)?.label || "Platform Management"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-[10px] sm:text-xs text-slate-500 font-medium">
              Status: <span className="text-emerald-500 font-semibold">Active</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
