// src/features/landing/components/Nav.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Menu, X, ChevronDown, ChevronRight, Shield, Zap, ArrowUpRight, HelpCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Home", href: "/", hash: "#home" },
  { label: "About", href: "/about", hash: "" },
  { label: "Services", href: "/services", hash: "" },
  { label: "News", href: "/news", hash: "" },
  { label: "Clients", href: "/our-clients", hash: "" },
  { label: "FAQ", href: "/faq", hash: "" },
  { label: "Careers", href: "/careers", hash: "" },
  { label: "Contact", href: "/contact", hash: "" },
];

const SERVICES_LIST = [
  { label: "All Services Overview", href: "/services", desc: "Complete 10-module infrastructure catalog" },
  { label: "Workflow Automation", href: "/services/workflow-automation", desc: "Intelligent credit approval pipelines" },
  { label: "Developer API & Docs", href: "/docs", desc: "REST & GraphQL integration suites" },
  { label: "Security & Compliance", href: "/security", desc: "Bank-grade AES-256 & SOC 2 audit readiness" },
  { label: "System Status", href: "/status", desc: "Real-time uptime & latency telemetry" },
];

const ABOUT_LIST = [
  { label: "About M&F", href: "/about", desc: "Company mission, leadership & milestones" },
  { label: "Who We Are", href: "/where-we-are", desc: "Our engineering leadership & vision" },
  { label: "Get Involved", href: "/get-involved", desc: "Partner program & institutional advisory" },
];

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("#home");
  const [aboutExpanded, setAboutExpanded] = useState(true);
  const [servicesExpanded, setServicesExpanded] = useState(true);
  const pathname = usePathname();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Sync active hash on mount / hash change
  useEffect(() => {
    const sync = () => {
      if (window.location.hash) {
        setActiveHash(window.location.hash);
      } else if (pathname === "/") {
        setActiveHash("#home");
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  const handleNavClick = useCallback((href: string) => {
    setMenuOpen(false);
    if (href.startsWith("/#")) {
      const hash = href.replace("/", "");
      setActiveHash(hash);
      const targetEl = document.querySelector(hash);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  const isActive = useCallback(
    (link: (typeof NAV_LINKS)[0]) => {
      if (!pathname) return false;
      if (link.href === "/about") return pathname === "/about";
      if (link.href === "/services") return pathname.startsWith("/services");
      if (link.href === "/news") return pathname.startsWith("/news");
      if (link.href === "/our-clients") return pathname === "/our-clients";
      if (link.href === "/faq") return pathname === "/faq";
      if (link.href === "/careers") return pathname === "/careers";
      if (link.href === "/contact") return pathname === "/contact";
      if (pathname === "/" && link.hash) return activeHash === link.hash;
      return false;
    },
    [pathname, activeHash]
  );

  const apiDocsUrl = "/docs";

  return (
    <>
      {/* Sticky Top Header Bar */}
      <header className="sticky top-0 w-full border-b border-[#9AA5B1]/20 bg-white/95 backdrop-blur-md z-[10001] transition-all">
        <div className="w-full flex items-center justify-between px-4 sm:px-8 lg:px-12 py-3 sm:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <span className="relative flex h-8 w-8 items-center justify-center">
              <span className="absolute h-8 w-8 rounded-full bg-[#1B222C] group-hover:scale-105 transition-transform" />
              <span className="absolute right-0 h-4 w-4 rounded-full bg-white border-2 border-[#1B222C]" />
            </span>
            <span className="text-lg font-bold tracking-tight text-[#1B222C]">
              M&amp;F <span className="font-normal text-[#6B7684]">Technologies</span>
            </span>
          </Link>

          {/* Header Controls */}
          <div className="flex items-center gap-3">
            {/* Desktop API CTA - Opens in a new tab */}
            <Link
              href="/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-[#1B222C] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#3E4C59] transition-colors"
            >
              <span>API Reference</span>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
            </Link>

            {/* Hamburger Menu Trigger Button */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open Navigation Menu"
              className="inline-flex items-center gap-2 rounded-lg border border-[#3E4C59]/30 bg-[#F4F6F8] px-3 py-1.5 text-xs font-semibold text-[#1B222C] hover:bg-[#E4E7EB] hover:border-[#1B222C]/40 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Menu className="h-4.5 w-4.5 text-[#1B222C]" />
              <span className="font-bold tracking-wide uppercase text-[11px]">Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hamburger Drawer Overlay & Panel */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-[10005] flex justify-end">
            {/* Soft Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/35 backdrop-blur-sm cursor-pointer"
            />

            {/* Sliding Drawer Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.55 }}
              className="relative w-full max-w-md bg-white text-[#1B222C] h-full shadow-2xl flex flex-col z-10 overflow-y-auto border-l border-[#9AA5B1]/20"
            >
              {/* Drawer Header */}
              <div className="sticky top-0 bg-white z-20 flex items-center justify-between p-5 sm:p-6 border-b border-[#9AA5B1]/20">
                <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
                  <span className="relative flex h-7 w-7 items-center justify-center">
                    <span className="absolute h-7 w-7 rounded-full bg-[#1B222C]" />
                    <span className="absolute right-0 h-3.5 w-3.5 rounded-full bg-white border-2 border-[#1B222C]" />
                  </span>
                  <span className="text-base font-bold text-[#1B222C]">
                    M&amp;F <span className="font-normal text-[#6B7684]">Technologies</span>
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="rounded-lg p-2 text-[#6B7684] hover:text-[#1B222C] hover:bg-[#F4F6F8] transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Drawer Main Body */}
              <div className="p-5 sm:p-6 space-y-6 flex-1 bg-[#F8FAFC]">
                {/* Section 1: Main Quick Links */}
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#6B7684] mb-3">
                    Navigation Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => handleNavClick(link.href)}
                        className={`px-3.5 py-2.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
                          isActive(link)
                            ? "bg-[#E2E8F0] text-[#1B222C] border-[#9AA5B1]/40 font-bold border-r-4 border-r-[#1B222C]"
                            : "bg-white text-[#3E4C59] border-[#9AA5B1]/20 hover:bg-[#F1F5F9] hover:text-[#1B222C]"
                        }`}
                      >
                        <span>{link.label}</span>
                        {isActive(link) && <span className="h-2 w-2 rounded-full bg-[#1B222C]" />}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Section 2: About Accordion */}
                <div className="border-t border-[#9AA5B1]/20 pt-5">
                  <button
                    type="button"
                    onClick={() => setAboutExpanded((v) => !v)}
                    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#6B7684] hover:text-[#1B222C] transition-colors mb-3 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-[#3E4C59]" />
                      About M&amp;F
                    </span>
                    {aboutExpanded ? <ChevronDown className="h-4 w-4 text-[#6B7684]" /> : <ChevronRight className="h-4 w-4 text-[#6B7684]" />}
                  </button>

                  <AnimatePresence>
                    {aboutExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-2 overflow-hidden"
                      >
                        {ABOUT_LIST.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => handleNavClick(item.href)}
                            className="block p-3 rounded-lg bg-white hover:bg-[#F1F5F9] border border-[#9AA5B1]/20 transition-colors group"
                          >
                            <div className="text-xs font-semibold text-[#3E4C59] group-hover:text-[#1B222C] flex items-center justify-between">
                              <span>{item.label}</span>
                              <ChevronRight className="h-3.5 w-3.5 text-[#6B7684] group-hover:translate-x-0.5 transition-transform" />
                            </div>
                            <div className="text-[11px] text-[#6B7684] mt-0.5">{item.desc}</div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Section 3: Services Accordion */}
                <div className="border-t border-[#9AA5B1]/20 pt-5">
                  <button
                    type="button"
                    onClick={() => setServicesExpanded((v) => !v)}
                    className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#6B7684] hover:text-[#1B222C] transition-colors mb-3 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-[#3E4C59]" />
                      Services &amp; Architecture
                    </span>
                    {servicesExpanded ? <ChevronDown className="h-4 w-4 text-[#6B7684]" /> : <ChevronRight className="h-4 w-4 text-[#6B7684]" />}
                  </button>

                  <AnimatePresence>
                    {servicesExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-2 overflow-hidden"
                      >
                        {SERVICES_LIST.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            target={item.href === "/docs" ? "_blank" : undefined}
                            rel={item.href === "/docs" ? "noopener noreferrer" : undefined}
                            onClick={() => handleNavClick(item.href)}
                            className="block p-3 rounded-lg bg-white hover:bg-[#F1F5F9] border border-[#9AA5B1]/20 transition-colors group"
                          >
                            <div className="text-xs font-semibold text-[#3E4C59] group-hover:text-[#1B222C] flex items-center justify-between">
                              <span>{item.label}</span>
                              <ChevronRight className="h-3.5 w-3.5 text-[#6B7684] group-hover:translate-x-0.5 transition-transform" />
                            </div>
                            <div className="text-[11px] text-[#6B7684] mt-0.5">{item.desc}</div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Section 4: Quick Actions */}
                <div className="border-t border-[#9AA5B1]/20 pt-5 space-y-2">
                  <Link
                    href="/request-demo"
                    onClick={() => setMenuOpen(false)}
                    className="w-full py-3 px-4 rounded-lg bg-[#1B222C] hover:bg-[#3E4C59] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
                  >
                    <span>Request Institutional Demo</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>

                  <a
                    href="mailto:info@mftechnologies.org"
                    className="w-full py-2.5 px-4 rounded-lg border border-[#9AA5B1] bg-white text-xs font-semibold text-[#3E4C59] hover:bg-[#F1F5F9] hover:text-[#1B222C] flex items-center justify-center gap-2 transition-colors"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>Contact Sales &amp; Support</span>
                  </a>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-5 border-t border-[#9AA5B1]/20 bg-white text-center text-xs text-[#6B7684]">
                &copy; {new Date().getFullYear()} M&amp;F Technologies. All rights reserved.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
