"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Menu,
  X,
  Sun,
  Moon,
  ArrowRight,
  Shield,
  Key,
  Layers,
  Terminal,
  Cpu,
  CreditCard,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  Code2,
  BookOpen,
} from "lucide-react";
import { DOCS_DATA, EndpointSpec } from "../docsData";
import { ProtocolSidebar } from "./ProtocolSidebar";
import { ProtocolEndpointView } from "./ProtocolEndpointView";
import { ProtocolSearchModal } from "./ProtocolSearchModal";

export function ProtocolDocs() {
  const [activeId, setActiveId] = useState<string>("introduction");
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("mf_docs_theme") === "dark";
    }
    return false;
  });

  // Sync theme with localStorage and html class
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mf_docs_theme", isDarkMode ? "dark" : "light");
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [isDarkMode]);

  // Global keyboard shortcut for Command+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Find if activeId maps to a specific endpoint
  const currentEndpoint = useMemo(() => {
    for (const cat of DOCS_DATA) {
      const found = cat.items.find((item) => item.id === activeId);
      if (found) return found;
    }
    return null;
  }, [activeId]);

  return (
    <div className={`min-h-screen font-sans relative transition-colors duration-200 ${
      isDarkMode
        ? "bg-[#0B0F14] text-[#E6EDF3] selection:bg-[#58A6FF]/20 selection:text-[#58A6FF]"
        : "bg-white text-[#1B222C] selection:bg-[#1B222C]/10 selection:text-[#1B222C]"
    }`}>
      {/* M&F Soft Atmospheric Glow */}
      <div className={`absolute top-0 right-0 left-0 h-[420px] pointer-events-none -z-10 ${
        isDarkMode
          ? "bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(88,166,255,0.06),rgba(11,15,20,0))]"
          : "bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(27,34,44,0.04),rgba(255,255,255,0))]"
      }`} />

      {/* ── Fixed / Sticky M&F Navigation Bar (Full Width) ── */}
      <header className={`sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors ${
        isDarkMode
          ? "bg-[#0E1217]/95 border-[#21262D]"
          : "bg-white/95 border-[#E4E7EB]"
      }`}>
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 h-14 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className={`lg:hidden p-1.5 -ml-1.5 rounded-lg cursor-pointer transition-colors ${
                isDarkMode ? "text-[#8B949E] hover:text-[#F0F6FC]" : "text-[#3E4C59] hover:text-[#1B222C]"
              }`}
              aria-label="Open Navigation Menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="relative flex h-7 w-7 items-center justify-center">
                <span className={`absolute h-7 w-7 rounded-full transition-transform group-hover:scale-105 ${
                  isDarkMode ? "bg-[#58A6FF]" : "bg-[#1B222C]"
                }`} />
                <span className={`absolute right-0 h-3.5 w-3.5 rounded-full border-2 ${
                  isDarkMode ? "bg-[#0B0F14] border-[#58A6FF]" : "bg-white border-[#1B222C]"
                }`} />
              </span>
              <span className={`font-display font-bold text-base tracking-tight flex items-center gap-1.5 ${
                isDarkMode ? "text-[#F0F6FC]" : "text-[#1B222C]"
              }`}>
                M&amp;F <span className={`font-normal ${isDarkMode ? "text-[#8B949E]" : "text-[#6B7684]"}`}>Technologies</span>
                <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${
                  isDarkMode
                    ? "text-[#58A6FF] bg-[#161B22] border-[#30363D]"
                    : "text-[#1B222C] bg-[#E4E7EB] border-[#9AA5B1]/40"
                }`}>
                  API v2.4
                </span>
              </span>
            </Link>
          </div>

          {/* Center Search Pill (Find something... ⌘K) */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className={`w-full h-9 rounded-full px-3.5 flex items-center justify-between text-xs transition-colors cursor-pointer group border ${
                isDarkMode
                  ? "bg-[#161B22] hover:bg-[#21262D] border-[#30363D] text-[#8B949E]"
                  : "bg-[#F4F6F8] hover:bg-[#E4E7EB]/60 border-[#9AA5B1]/30 text-[#6B7684]"
              }`}
            >
              <div className="flex items-center gap-2">
                <Search className={`h-4 w-4 transition-colors ${
                  isDarkMode ? "text-[#8B949E] group-hover:text-[#58A6FF]" : "text-[#9AA5B1] group-hover:text-[#1B222C]"
                }`} />
                <span>Find endpoints, guides, parameters...</span>
              </div>
              <kbd className={`font-mono text-[10px] rounded px-1.5 py-0.5 border shadow-2xs ${
                isDarkMode
                  ? "bg-[#21262D] border-[#30363D] text-[#8B949E]"
                  : "bg-white border-[#9AA5B1]/40 text-[#6B7684]"
              }`}>
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Header Navigation & Actions */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setActiveId("create-loan-application");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                currentEndpoint
                  ? isDarkMode
                    ? "bg-[#F0F6FC] text-[#0E1217] shadow-xs"
                    : "bg-[#1B222C] text-white shadow-xs"
                  : isDarkMode
                  ? "text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#161B22]"
                  : "text-[#3E4C59] hover:text-[#1B222C] hover:bg-[#F4F6F8]"
              }`}
            >
              API Reference
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveId("introduction");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                !currentEndpoint
                  ? isDarkMode
                    ? "bg-[#F0F6FC] text-[#0E1217] shadow-xs"
                    : "bg-[#1B222C] text-white shadow-xs"
                  : isDarkMode
                  ? "text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#161B22]"
                  : "text-[#3E4C59] hover:text-[#1B222C] hover:bg-[#F4F6F8]"
              }`}
            >
              Documentation
            </button>

            {/* Support - Opens Live ChatBot directly */}
            <button
              type="button"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("mf-open-chat"));
              }}
              className={`hidden sm:inline-block transition-colors px-2 py-1 cursor-pointer font-medium ${
                isDarkMode ? "text-[#8B949E] hover:text-[#F0F6FC]" : "text-[#3E4C59] hover:text-[#1B222C]"
              }`}
              title="Open Live Support Chat"
            >
              Support
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              type="button"
              onClick={() => setIsDarkMode((prev) => !prev)}
              className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                isDarkMode
                  ? "text-amber-400 hover:bg-[#21262D]"
                  : "text-[#6B7684] hover:text-[#1B222C] hover:bg-[#F4F6F8]"
              }`}
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Get API Key Button */}
            <Link
              href="/request-demo"
              className={`rounded-full px-4 py-1.5 text-xs font-semibold shadow-xs transition-colors cursor-pointer ${
                isDarkMode
                  ? "bg-[#58A6FF] text-[#0B0F14] hover:bg-[#79C0FF]"
                  : "bg-[#1B222C] text-white hover:bg-[#3E4C59]"
              }`}
            >
              Get API Key
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Container: Sidebar + Content (Full Width Edge-to-Edge) ── */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="flex w-full">
          {/* Left Desktop Sticky Sidebar */}
          <div className="hidden lg:block w-64 shrink-0 py-8 pr-6 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto scrollbar-thin">
            <ProtocolSidebar
              activeId={activeId}
              isDarkMode={isDarkMode}
              onSelect={(id) => {
                setActiveId(id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>

          {/* Main Content Area (Fills entire screen from left to right) */}
          <main className="flex-1 min-w-0 py-8 lg:pl-8 xl:pl-10 w-full">
            {/* 1. Introduction / Hero Documentation View */}
            {activeId === "introduction" && (
              <div className="space-y-12">
                {/* Hero Section */}
                <div className="space-y-4 max-w-3xl">
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1B222C] font-display">
                    Developer API Documentation
                  </h1>
                  <p className="text-base sm:text-lg text-[#3E4C59] leading-relaxed">
                    Use the M&amp;F Technologies API to programmatically orchestrate lending origination, algorithmic credit score evaluations, SMS gateway dispatches, and delinquency collections queues for modern commercial financial institutions.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveId("quickstart")}
                      className="rounded-full bg-[#1B222C] hover:bg-[#3E4C59] text-white px-4.5 py-2 text-sm font-semibold inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
                    >
                      <span>Quickstart Guide</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveId("create-loan-application")}
                      className="rounded-full bg-[#F4F6F8] hover:bg-[#E4E7EB] text-[#1B222C] border border-[#9AA5B1]/30 px-4.5 py-2 text-sm font-semibold transition-all cursor-pointer active:scale-95"
                    >
                      Explore Endpoints
                    </button>
                  </div>
                </div>

                {/* Getting Started Section */}
                <div className="space-y-3 pt-6 border-t border-[#E4E7EB] max-w-3xl">
                  <h2 className="text-xl font-bold text-[#1B222C] font-display">
                    Getting started
                  </h2>
                  <p className="text-sm text-[#3E4C59] leading-relaxed">
                    To get started, request sandbox credentials in our{" "}
                    <Link href="/request-demo" className="text-[#1B222C] font-bold underline hover:text-[#3E4C59]">
                      developer portal
                    </Link>
                    , then review our guides on authenticating server-to-server operations. When your integration is ready for production certification, submit your technical onboarding dossier to receive institutional live keys.
                  </p>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveId("authentication")}
                      className="text-[#1B222C] hover:text-[#3E4C59] text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Get your institutional API key</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Guides Grid */}
                <div className="space-y-4 pt-6 border-t border-[#E4E7EB]">
                  <h2 className="text-xl font-bold text-[#1B222C] font-display">
                    Guides
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Authentication */}
                    <div className="p-6 rounded-2xl border border-[#E4E7EB] bg-white hover:border-[#9AA5B1]/50 transition-all space-y-3 shadow-2xs">
                      <h3 className="text-base font-bold text-[#1B222C] font-display">
                        Authentication
                      </h3>
                      <p className="text-xs text-[#6B7684] leading-relaxed">
                        Learn how to authenticate requests using institutional secret API keys and cryptographic bearer signatures.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveId("authentication")}
                        className="text-xs font-bold text-[#1B222C] hover:text-[#3E4C59] inline-flex items-center gap-1 cursor-pointer pt-2"
                      >
                        <span>Read more</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Pagination */}
                    <div className="p-6 rounded-2xl border border-[#E4E7EB] bg-white hover:border-[#9AA5B1]/50 transition-all space-y-3 shadow-2xs">
                      <h3 className="text-base font-bold text-[#1B222C] font-display">
                        Pagination
                      </h3>
                      <p className="text-xs text-[#6B7684] leading-relaxed">
                        Understand cursor-based scrolling, batch sizes, and traversal across high-volume transaction feeds.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveId("pagination")}
                        className="text-xs font-bold text-[#1B222C] hover:text-[#3E4C59] inline-flex items-center gap-1 cursor-pointer pt-2"
                      >
                        <span>Read more</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Errors */}
                    <div className="p-6 rounded-2xl border border-[#E4E7EB] bg-white hover:border-[#9AA5B1]/50 transition-all space-y-3 shadow-2xs">
                      <h3 className="text-base font-bold text-[#1B222C] font-display">
                        Errors &amp; Retries
                      </h3>
                      <p className="text-xs text-[#6B7684] leading-relaxed">
                        Review standardized RFC-7807 problem details, rate limit buckets, and idempotent key replays.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveId("errors")}
                        className="text-xs font-bold text-[#1B222C] hover:text-[#3E4C59] inline-flex items-center gap-1 cursor-pointer pt-2"
                      >
                        <span>Read more</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Featured Resources Section */}
                <div className="space-y-4 pt-6 border-t border-[#E4E7EB]">
                  <h2 className="text-xl font-bold text-[#1B222C] font-display">
                    Core API Modules
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveId("create-loan-application")}
                      className="p-5 rounded-2xl border border-[#E4E7EB] hover:border-[#1B222C]/40 bg-white text-left transition-all group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-[#1B222C] group-hover:text-[#3E4C59] transition-colors">
                          Core Lending Systems
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-[#E4E7EB] text-[#1B222C] border border-[#9AA5B1]/40 px-2 py-0.5 rounded">
                          POST
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7684] leading-relaxed">
                        Create borrower profiles, submit collateral schedules, and calculate multi-tranche amortization schedules.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveId("send-sms-message")}
                      className="p-5 rounded-2xl border border-[#E4E7EB] hover:border-[#1B222C]/40 bg-white text-left transition-all group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-[#1B222C] group-hover:text-[#3E4C59] transition-colors">
                          SMS Gateway Infrastructure
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-[#E4E7EB] text-[#1B222C] border border-[#9AA5B1]/40 px-2 py-0.5 rounded">
                          POST
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7684] leading-relaxed">
                        Dispatch transactional SMS alerts, route across connected Android modem devices, and verify OTP codes.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveId("evaluate-credit-score")}
                      className="p-5 rounded-2xl border border-[#E4E7EB] hover:border-[#1B222C]/40 bg-white text-left transition-all group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-[#1B222C] group-hover:text-[#3E4C59] transition-colors">
                          Credit Scoring Engine
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-[#E4E7EB] text-[#1B222C] border border-[#9AA5B1]/40 px-2 py-0.5 rounded">
                          POST
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7684] leading-relaxed">
                        Execute proprietary credit scoring models with debt-to-income and bureau vintage calculations.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveId("get-collections-queue")}
                      className="p-5 rounded-2xl border border-[#E4E7EB] hover:border-[#1B222C]/40 bg-white text-left transition-all group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-[#1B222C] group-hover:text-[#3E4C59] transition-colors">
                          CRM &amp; Collections Queue
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-[#F4F6F8] text-[#3E4C59] border border-[#9AA5B1]/30 px-2 py-0.5 rounded">
                          GET
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7684] leading-relaxed">
                        Query real-time delinquent accounts, aging buckets (1-30, 31-60, 61-90 DPD), and recovery strategies.
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeId === "resources-overview" && (
              <div className="space-y-8 max-w-4xl">
                <div className="space-y-2 border-b border-[#E4E7EB] pb-6">
                  <span className="text-xs font-bold text-[#1B222C] uppercase tracking-wider">
                    API Reference
                  </span>
                  <h1 className="text-3xl font-bold text-[#1B222C] tracking-tight font-display">
                    API Resources
                  </h1>
                  <p className="text-sm text-[#3E4C59] leading-relaxed">
                    Browse the resources available in the M&amp;F Technologies API. Select a resource to review its endpoint, authentication requirements, request fields, response shape, and code examples.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      id: "create-loan-application",
                      title: "Lending Applications",
                      method: "POST",
                      description: "Create and manage borrower loan applications, collateral details, and origination workflows.",
                    },
                    {
                      id: "get-loan-application",
                      title: "Application Status",
                      method: "GET",
                      description: "Retrieve the current state, decision metadata, and repayment details for an application.",
                    },
                    {
                      id: "evaluate-credit-score",
                      title: "Credit Scoring",
                      method: "POST",
                      description: "Submit borrower financial data for an explainable credit score and risk-band evaluation.",
                    },
                    {
                      id: "get-collections-queue",
                      title: "CRM & Collections",
                      method: "GET",
                      description: "Read delinquency queues, aging buckets, recovery priorities, and assigned collection actions.",
                    },
                    {
                      id: "send-sms-message",
                      title: "SMS Messaging",
                      method: "POST",
                      description: "Send transactional messages and notifications through the connected SMS gateway.",
                    },
                    {
                      id: "list-sms-messages",
                      title: "Message History",
                      method: "GET",
                      description: "List outbound SMS messages with delivery status, timestamps, recipients, and provider metadata.",
                    },
                    {
                      id: "list-sms-devices",
                      title: "Gateway Devices",
                      method: "GET",
                      description: "Inspect connected SIM devices, routing availability, signal health, and gateway capacity.",
                    },
                    {
                      id: "verify-sms-otp",
                      title: "Mobile OTP Verification",
                      method: "POST",
                      description: "Verify a one-time password issued to a borrower or account holder’s mobile number.",
                    },
                    {
                      id: "webhook-verification",
                      title: "Webhook Events",
                      method: "POST",
                      description: "Validate webhook payloads and test event delivery before enabling production integrations.",
                    },
                    {
                      id: "changelog-v2",
                      title: "Changelog",
                      method: "GUIDE",
                      description: "Review API version changes, new capabilities, compatibility notes, and migration guidance.",
                    },
                  ].map((resource) => (
                    <button
                      key={resource.id}
                      type="button"
                      onClick={() => setActiveId(resource.id)}
                      className="p-5 rounded-2xl border border-[#E4E7EB] hover:border-[#1B222C]/40 bg-white text-left transition-all group cursor-pointer shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="text-sm font-bold text-[#1B222C] group-hover:text-[#3E4C59] transition-colors">
                          {resource.title}
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-[#F4F6F8] text-[#3E4C59] border border-[#9AA5B1]/30 px-2 py-0.5 rounded shrink-0">
                          {resource.method}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7684] leading-relaxed">{resource.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Quickstart Guide */}
            {activeId === "quickstart" && (
              <div className="space-y-8 max-w-4xl">
                <div className="space-y-2 border-b border-[#E4E7EB] pb-6">
                  <span className="text-xs font-bold text-[#1B222C] uppercase tracking-wider">
                    Getting Started
                  </span>
                  <h1 className="text-3xl font-bold text-[#1B222C] tracking-tight font-display">
                    Quickstart Guide
                  </h1>
                  <p className="text-sm text-[#3E4C59] leading-relaxed">
                    Set up your development environment and execute your first live API request in less than two minutes.
                  </p>
                </div>

                <div className="space-y-6 text-sm text-[#3E4C59] leading-relaxed">
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-[#1B222C] font-display">
                      1. Obtain Sandbox Credentials
                    </h2>
                    <p>
                      Every developer is assigned an isolated sandbox environment. Pass your key in the <code className="text-xs font-mono bg-[#F4F6F8] text-[#1B222C] px-1.5 py-0.5 rounded border border-[#9AA5B1]/30">X-API-Key</code> header.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-[#1B222C] font-display">
                      2. Make Your First Call (cURL)
                    </h2>
                    <div className="p-4 rounded-xl bg-[#1B222C] text-[#F4F6F8] font-mono text-xs overflow-x-auto shadow-sm border border-[#3E4C59]/40">
                      <pre>
{`curl -X POST https://api.mftechnologies.org/v1/messages \\
  -H "X-API-Key: your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+254712345678",
    "message": "Welcome to M&F Technologies! Your OTP is 492019.",
    "priority": "HIGH"
  }'`}
                      </pre>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-[#1B222C] font-display">
                      3. Inspect the Real Response
                    </h2>
                    <p>
                      All responses return standard HTTP status codes accompanied by live transaction IDs and delivery queue metadata.
                    </p>
                    <div className="p-4 rounded-xl bg-[#1B222C] text-[#F4F6F8] font-mono text-xs overflow-x-auto shadow-sm border border-[#3E4C59]/40">
                      <pre>
{`{
  "success": true,
  "data": {
    "id": "msg_90182374-4b91",
    "status": "SENT",
    "to": "+254712345678",
    "parts": 1,
    "costUsd": 0.0075,
    "createdAt": "2026-09-04T10:15:00.000Z"
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Authentication Guide */}
            {activeId === "authentication" && (
              <div className="space-y-8 max-w-4xl">
                <div className="space-y-2 border-b border-[#E4E7EB] pb-6">
                  <span className="text-xs font-bold text-[#1B222C] uppercase tracking-wider">
                    Security &amp; Keys
                  </span>
                  <h1 className="text-3xl font-bold text-[#1B222C] tracking-tight font-display">
                    Authentication
                  </h1>
                  <p className="text-sm text-[#3E4C59] leading-relaxed">
                    How to securely authenticate requests to the M&amp;F Technologies API using institutional API keys and bearer signatures.
                  </p>
                </div>

                <div className="space-y-6 text-sm text-[#3E4C59] leading-relaxed">
                  <p>
                    The M&amp;F Technologies API requires authentication for all protected endpoints. Keys can be rotated or scoped with granular permissions.
                  </p>

                  <div className="p-4 rounded-2xl bg-[#F4F6F8] border border-[#9AA5B1]/30 text-xs text-[#1B222C] space-y-1">
                    <p className="font-bold">Security Best Practice</p>
                    <p className="text-[#6B7684]">
                      Your institutional secret keys carry significant transactional privileges. Never commit secret keys to client-side repositories or public codebases.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-lg font-bold text-[#1B222C] font-display">
                      Passing the API Key
                    </h2>
                    <p>
                      Include your key in the <code className="text-xs font-mono bg-[#F4F6F8] text-[#1B222C] px-1.5 py-0.5 rounded border border-[#9AA5B1]/30">X-API-Key</code> request header:
                    </p>
                    <div className="p-4 rounded-xl bg-[#1B222C] text-[#F4F6F8] font-mono text-xs overflow-x-auto border border-[#3E4C59]/40">
                      <code>X-API-Key: your_api_key</code>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Pagination Guide */}
            {activeId === "pagination" && (
              <div className="space-y-8 max-w-4xl">
                <div className="space-y-2 border-b border-[#E4E7EB] pb-6">
                  <span className="text-xs font-bold text-[#1B222C] uppercase tracking-wider">
                    API Concepts
                  </span>
                  <h1 className="text-3xl font-bold text-[#1B222C] tracking-tight font-display">
                    Pagination
                  </h1>
                  <p className="text-sm text-[#3E4C59] leading-relaxed">
                    Learn how to navigate large transaction datasets using cursor-based pagination.
                  </p>
                </div>

                <div className="space-y-4 text-sm text-[#3E4C59] leading-relaxed">
                  <p>
                    All collection-based API resources support bulk fetches via cursor pagination. Parameters include:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-xs">
                    <li><code className="font-mono font-bold text-[#1B222C]">limit</code>: Maximum number of objects returned (1 to 100, default 20).</li>
                    <li><code className="font-mono font-bold text-[#1B222C]">starting_after</code>: Cursor ID defining your offset in the list.</li>
                    <li><code className="font-mono font-bold text-[#1B222C]">ending_before</code>: Cursor ID defining your offset for backwards traversal.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 5. Errors Guide */}
            {activeId === "errors" && (
              <div className="space-y-8 max-w-4xl">
                <div className="space-y-2 border-b border-[#E4E7EB] pb-6">
                  <span className="text-xs font-bold text-[#1B222C] uppercase tracking-wider">
                    API Concepts
                  </span>
                  <h1 className="text-3xl font-bold text-[#1B222C] tracking-tight font-display">
                    Errors &amp; Rate Limits
                  </h1>
                  <p className="text-sm text-[#3E4C59] leading-relaxed">
                    Standardized error codes, RFC-7807 problem details, and retry conventions.
                  </p>
                </div>

                <div className="space-y-4 text-sm text-[#3E4C59] leading-relaxed">
                  <div className="border border-[#E4E7EB] rounded-xl overflow-hidden bg-white shadow-2xs">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#F4F6F8] border-b border-[#E4E7EB] font-semibold text-[#1B222C]">
                        <tr>
                          <th className="p-3 font-display">Status</th>
                          <th className="p-3 font-display">Meaning</th>
                          <th className="p-3 font-display">Remedy</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E4E7EB] text-[#3E4C59]">
                        <tr>
                          <td className="p-3 font-mono font-bold text-[#1B222C]">200 / 201</td>
                          <td className="p-3 font-medium">Success</td>
                          <td className="p-3 text-[#6B7684]">Request was executed cleanly.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-[#3E4C59]">400 Bad Request</td>
                          <td className="p-3 font-medium">Validation Failure</td>
                          <td className="p-3 text-[#6B7684]">Check missing required fields or invalid JSON.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-[#3E4C59]">401 Unauthorized</td>
                          <td className="p-3 font-medium">Invalid API Key</td>
                          <td className="p-3 text-[#6B7684]">Verify your X-API-Key header.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-[#3E4C59]">429 Rate Limited</td>
                          <td className="p-3 font-medium">Quota Exceeded</td>
                          <td className="p-3 text-[#6B7684]">Implement exponential backoff.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 6. SDKs Guide */}
            {activeId === "sdks" && (
              <div className="space-y-8 max-w-4xl">
                <div className="space-y-2 border-b border-[#E4E7EB] pb-6">
                  <span className="text-xs font-bold text-[#1B222C] uppercase tracking-wider">
                    Developer Libraries
                  </span>
                  <h1 className="text-3xl font-bold text-[#1B222C] tracking-tight font-display">
                    Official SDKs
                  </h1>
                  <p className="text-sm text-[#3E4C59] leading-relaxed">
                    Official client SDKs for seamless institutional integration.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border border-[#E4E7EB] bg-white space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1B222C]">Node.js / TypeScript</span>
                      <span className="text-xs font-mono bg-[#F4F6F8] text-[#1B222C] border border-[#9AA5B1]/30 px-2 py-0.5 rounded">npm i @mf/sdk</span>
                    </div>
                    <p className="text-xs text-[#6B7684]">TypeScript types, auto-retries, webhook HMAC signature verification.</p>
                  </div>

                  <div className="p-5 rounded-2xl border border-[#E4E7EB] bg-white space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1B222C]">Python</span>
                      <span className="text-xs font-mono bg-[#F4F6F8] text-[#1B222C] border border-[#9AA5B1]/30 px-2 py-0.5 rounded">pip install mf-tech</span>
                    </div>
                    <p className="text-xs text-[#6B7684]">Asyncio support, algorithmic scoring wrappers, pandas dataframes.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 7. Webhooks Guide */}
            {activeId === "webhooks" && (
              <div className="space-y-8 max-w-4xl">
                <div className="space-y-2 border-b border-[#E4E7EB] pb-6">
                  <span className="text-xs font-bold text-[#1B222C] uppercase tracking-wider">
                    Event Streaming
                  </span>
                  <h1 className="text-3xl font-bold text-[#1B222C] tracking-tight font-display">
                    Webhooks &amp; Signatures
                  </h1>
                  <p className="text-sm text-[#3E4C59] leading-relaxed">
                    Receive real-time notifications when loan applications are approved, SMS messages are delivered, or repayments clear.
                  </p>
                </div>

                <div className="space-y-4 text-sm text-[#3E4C59] leading-relaxed">
                  <p>
                    Every webhook payload is signed with an HMAC-SHA256 signature passed in the <code className="font-mono text-xs bg-[#F4F6F8] text-[#1B222C] px-1.5 py-0.5 rounded border border-[#9AA5B1]/30">X-MF-Signature</code> header.
                  </p>
                  <div className="p-4 rounded-xl bg-[#1B222C] text-[#F4F6F8] font-mono text-xs overflow-x-auto border border-[#3E4C59]/40">
                    <code>X-MF-Signature: t=1788516780,v1=9a8b7c6d5e4f3a2b1c...</code>
                  </div>
                </div>
              </div>
            )}

            {/* 8. Specific Endpoint Split View (Protocol & Stripe Style with Live Console) */}
            {currentEndpoint && (
              <ProtocolEndpointView endpoint={currentEndpoint} />
            )}
          </main>
        </div>
      </div>

      {/* ── Mobile Navigation Drawer ── */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-200 border-r border-[#E4E7EB]">
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#E4E7EB] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-6 w-6 items-center justify-center">
                  <span className="absolute h-6 w-6 rounded-full bg-[#1B222C]" />
                  <span className="absolute right-0 h-3 w-3 rounded-full bg-white border-2 border-[#1B222C]" />
                </span>
                <span className="font-display font-bold text-[#1B222C] text-sm">M&amp;F Developer API</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-md text-[#6B7684] hover:text-[#1B222C] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Button inside Mobile Drawer */}
            <div className="p-4 border-b border-[#E4E7EB]">
              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setSearchModalOpen(true);
                }}
                className="w-full h-9 rounded-full bg-[#F4F6F8] border border-[#9AA5B1]/30 px-3.5 flex items-center justify-between text-xs text-[#6B7684]"
              >
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-[#9AA5B1]" />
                  <span>Find endpoints...</span>
                </div>
                <kbd className="font-mono text-[10px] bg-white border border-[#9AA5B1]/40 text-[#6B7684] rounded px-1.5 py-0.5">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Navigation List */}
            <div className="flex-1 overflow-y-auto p-4">
              <ProtocolSidebar
                activeId={activeId}
                onSelect={(id) => setActiveId(id)}
                onCloseMobile={() => setMobileDrawerOpen(false)}
              />
            </div>
          </div>
          <div className="flex-1 bg-[#1B222C]/40 backdrop-blur-xs" onClick={() => setMobileDrawerOpen(false)} />
        </div>
      )}

      {/* ── Command+K Search Modal ── */}
      <ProtocolSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelect={(id) => {
          setActiveId(id);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
}
