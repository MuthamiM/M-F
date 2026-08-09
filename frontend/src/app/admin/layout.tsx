"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Ticket, PhoneCall, LogOut, Shield, Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [knownTickets, setKnownTickets] = useState<Set<string> | null>(null);

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

  // Background polling for new open tickets to trigger beep notifications
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
            const currentIds = resData.data.map((t: any) => t.id);
            
            setKnownTickets((prev) => {
              if (prev === null) {
                // Initial load: seed known tickets without beeping
                return new Set(currentIds);
              }

              let foundNewOpen = false;
              const nextSet = new Set(prev);

              for (const ticket of resData.data) {
                if (!prev.has(ticket.id)) {
                  nextSet.add(ticket.id);
                  if (ticket.status === "open") {
                    foundNewOpen = true;
                  }
                }
              }

              if (foundNewOpen) {
                // Synthesize the audio notification alert
                import("@/shared/lib/audioAlert").then((mod) => {
                  mod.playNotificationBeep();
                });
              }

              return nextSet;
            });
          }
        }
      } catch (err) {
        console.warn("Background notification check failed:", err);
      }
    };

    // Check immediately and then every 6 seconds
    checkNewTickets();
    const interval = setInterval(checkNewTickets, 6000);
    return () => clearInterval(interval);
  }, [authorized, pathname]);

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

  // If we are on the login page, render clean page without sidebar
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
            
            {/* Close Button for mobile */}
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
            {/* Hamburger button for mobile/tablet */}
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
