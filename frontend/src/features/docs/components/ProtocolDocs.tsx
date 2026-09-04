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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

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
    <div className="min-h-screen bg-white text-slate-900 selection:bg-emerald-500/20 selection:text-emerald-900 font-sans relative">
      {/* Signature Protocol Top Radial Light Mesh */}
      <div className="absolute top-0 right-0 left-0 h-[480px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-15%,rgba(16,185,129,0.13),rgba(255,255,255,0))] pointer-events-none -z-10" />

      {/* ── Fixed / Sticky Protocol Navigation Bar ── */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-1.5 -ml-1.5 text-slate-600 hover:text-slate-900 rounded-lg"
              aria-label="Open Navigation Menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              {/* Protocol Emerald Geometric Icon */}
              <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center shadow-xs group-hover:bg-emerald-600 transition-colors">
                <div className="w-2.5 h-2.5 rounded-xs bg-white transform rotate-45" />
              </div>
              <span className="font-display font-bold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
                Protocol
                <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                  API
                </span>
              </span>
            </Link>
          </div>

          {/* Center Search Pill (Find something... ⌘K) */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="w-full h-9 rounded-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 px-3.5 flex items-center justify-between text-xs text-slate-400 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                <span>Find something...</span>
              </div>
              <kbd className="font-mono text-[10px] bg-white border border-slate-200 text-slate-500 rounded px-1.5 py-0.5 shadow-2xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Header Navigation & Actions */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setActiveId("create-loan-application")}
              className="hidden sm:inline-block hover:text-slate-900 transition-colors cursor-pointer"
            >
              API
            </button>
            <button
              type="button"
              onClick={() => setActiveId("introduction")}
              className="hidden sm:inline-block hover:text-slate-900 transition-colors cursor-pointer"
            >
              Documentation
            </button>
            <Link
              href="/contact"
              className="hidden sm:inline-block hover:text-slate-900 transition-colors"
            >
              Support
            </Link>

            {/* Light / Dark Mode Toggle */}
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg cursor-pointer"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Sign In / Key Pill Button */}
            <Link
              href="/request-demo"
              className="rounded-full bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Container: Sidebar + Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex">
          {/* Left Desktop Sticky Sidebar */}
          <div className="hidden lg:block w-64 shrink-0 py-8 pr-6 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto scrollbar-thin">
            <ProtocolSidebar
              activeId={activeId}
              onSelect={(id) => {
                setActiveId(id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 py-10 lg:pl-10">
            {/* 1. Introduction / Hero Documentation View */}
            {activeId === "introduction" && (
              <div className="space-y-12">
                {/* Hero Section */}
                <div className="space-y-4 max-w-3xl">
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-display">
                    API Documentation
                  </h1>
                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                    Use the Protocol API to access contacts, conversations, group messages, lending applications, credit scoring models, SMS gateway dispatches, and more, and seamlessly integrate your product into the workflows of dozens of devoted Protocol users.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveId("quickstart")}
                      className="rounded-full bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-sm font-semibold inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Quickstart</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveId("sdks")}
                      className="rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
                    >
                      Explore SDKs
                    </button>
                  </div>
                </div>

                {/* Getting Started Section */}
                <div className="space-y-3 pt-6 border-t border-slate-100 max-w-3xl">
                  <h2 className="text-xl font-bold text-slate-900 font-display">
                    Getting started
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    To get started, create a new application in your{" "}
                    <Link href="/request-demo" className="text-emerald-600 font-medium hover:underline">
                      developer settings
                    </Link>
                    , then read about how to make requests for the resources you need to access using our HTTP APIs or dedicated client SDKs. When your integration is ready to go live, publish it to our{" "}
                    <Link href="/services/core-lending-systems" className="text-emerald-600 font-medium hover:underline">
                      integrations directory
                    </Link>{" "}
                    to reach the Protocol community.
                  </p>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveId("authentication")}
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Get your API key</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Guides Grid */}
                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <h2 className="text-xl font-bold text-slate-900 font-display">
                    Guides
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Authentication */}
                    <div className="p-6 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all space-y-3">
                      <h3 className="text-base font-bold text-slate-900 font-display">
                        Authentication
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Learn how to authenticate your API requests using API tokens and HMAC signatures.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveId("authentication")}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 cursor-pointer pt-2"
                      >
                        <span>Read more</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Pagination */}
                    <div className="p-6 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all space-y-3">
                      <h3 className="text-base font-bold text-slate-900 font-display">
                        Pagination
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Understand how to work with paginated responses, cursor boundaries, and limit sizes.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveId("pagination")}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 cursor-pointer pt-2"
                      >
                        <span>Read more</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Errors */}
                    <div className="p-6 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all space-y-3">
                      <h3 className="text-base font-bold text-slate-900 font-display">
                        Errors
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Read about the standard RFC-7807 error formats, error codes, and idempotent retries.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveId("errors")}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 cursor-pointer pt-2"
                      >
                        <span>Read more</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Featured Resources Section */}
                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <h2 className="text-xl font-bold text-slate-900 font-display">
                    Core Resources
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveId("create-loan-application")}
                      className="p-5 rounded-2xl border border-slate-200/80 hover:border-emerald-500/50 bg-white text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          Core Lending Systems
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                          POST
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Create borrower profiles, submit collateral schedules, and calculate multi-tranche amortization schedules.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveId("send-sms-message")}
                      className="p-5 rounded-2xl border border-slate-200/80 hover:border-emerald-500/50 bg-white text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          SMS Gateway (GatewaySms)
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                          POST
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Dispatch high-throughput SMS alerts, route across SIM device modems, and stream real-time delivery receipts.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveId("evaluate-credit-score")}
                      className="p-5 rounded-2xl border border-slate-200/80 hover:border-emerald-500/50 bg-white text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          Credit Scoring Engine
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                          POST
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Evaluate borrower risk weights, compute PD scores, and generate automated risk-tier credit limit approvals.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveId("get-collections-queue")}
                      className="p-5 rounded-2xl border border-slate-200/80 hover:border-emerald-500/50 bg-white text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                          CRM &amp; Collections
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded">
                          GET
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Prioritized delinquent accounts queue, borrower interaction timeline, and automated repayment reminders.
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Quickstart Guide */}
            {activeId === "quickstart" && (
              <div className="space-y-8 max-w-4xl">
                <div className="space-y-2 border-b border-slate-100 pb-6">
                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                    Getting Started
                  </span>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-display">
                    Quickstart Guide
                  </h1>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Set up your development environment and make your first API request in less than five minutes.
                  </p>
                </div>

                <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-slate-900 font-display">
                      1. Obtain Sandbox Credentials
                    </h2>
                    <p>
                      Every developer is assigned a dedicated sandbox environment isolated from live customer ledgers. Request access to obtain your <code className="text-xs font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">X-API-Key</code>.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-slate-900 font-display">
                      2. Make Your First Call (cURL)
                    </h2>
                    <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto shadow-sm">
                      <pre>
{`curl -X POST https://api.mftechnologies.org/v1/messages \\
  -H "X-API-Key: mf_sand_8923a10bf8392c019a82e9" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+254712345678",
    "content": "Welcome to M&F Technologies! Your OTP code is 982144.",
    "priority": 1
  }'`}
                      </pre>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-lg font-bold text-slate-900 font-display">
                      3. Inspect the Response
                    </h2>
                    <p>
                      All responses return standard HTTP 200/201 status codes accompanied by unique tracking IDs and delivery queue metadata.
                    </p>
                    <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto shadow-sm">
                      <pre>
{`{
  "success": true,
  "data": {
    "id": "msg_90182374-4b91",
    "status": "QUEUED",
    "recipient": "+254712345678",
    "parts": 1,
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
                <div className="space-y-2 border-b border-slate-100 pb-6">
                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                    Security &amp; Keys
                  </span>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-display">
                    Authentication
                  </h1>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    How to securely authenticate requests to the M&amp;F Protocol API using institutional API keys and HMAC signatures.
                  </p>
                </div>

                <div className="space-y-6 text-sm text-slate-600 leading-relaxed">
                  <p>
                    The M&amp;F Protocol API uses API keys to authenticate requests. You can view and manage your API keys in the developer settings portal.
                  </p>

                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <p className="font-semibold">Keep your API keys secret</p>
                    <p>
                      Your API keys carry significant privileges. Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, or browser scripts.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-lg font-bold text-slate-900 font-display">
                      Passing the API Key
                    </h2>
                    <p>
                      Include your key in the <code className="text-xs font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">X-API-Key</code> request header:
                    </p>
                    <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto">
                      <code>X-API-Key: your_api_key019a82e9</code>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Pagination Guide */}
            {activeId === "pagination" && (
              <div className="space-y-8 max-w-4xl">
                <div className="space-y-2 border-b border-slate-100 pb-6">
                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                    API Concepts
                  </span>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-display">
                    Pagination
                  </h1>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Learn how to navigate large datasets using cursor-based pagination.
                  </p>
                </div>

                <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                  <p>
                    All top-level API resources support bulk fetches via cursor pagination. Pagination parameters include:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-xs">
                    <li><code className="font-mono font-semibold text-slate-900">limit</code>: A limit on the number of objects to be returned (1 to 100, default 20).</li>
                    <li><code className="font-mono font-semibold text-slate-900">starting_after</code>: An object ID defining your place in the list for forward scrolling.</li>
                    <li><code className="font-mono font-semibold text-slate-900">ending_before</code>: An object ID defining your place in the list for backwards traversal.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 5. Errors Guide */}
            {activeId === "errors" && (
              <div className="space-y-8 max-w-4xl">
                <div className="space-y-2 border-b border-slate-100 pb-6">
                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                    API Concepts
                  </span>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-display">
                    Errors
                  </h1>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Standardized error codes, RFC-7807 problem details, and retry conventions.
                  </p>
                </div>

                <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                  <p>
                    Protocol APIs use conventional HTTP response codes to indicate success or failure:
                  </p>
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-900">
                        <tr>
                          <th className="p-3">Status</th>
                          <th className="p-3">Meaning</th>
                          <th className="p-3">Remedy</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="p-3 font-mono font-bold text-slate-900">200 / 201</td>
                          <td className="p-3">Success</td>
                          <td className="p-3">Request was executed cleanly.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-amber-700">400 Bad Request</td>
                          <td className="p-3">Validation Failure</td>
                          <td className="p-3">Check missing required fields or invalid JSON.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-amber-700">401 Unauthorized</td>
                          <td className="p-3">Invalid API Key</td>
                          <td className="p-3">Verify your X-API-Key token in headers.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold text-amber-700">429 Rate Limited</td>
                          <td className="p-3">Quota Exceeded</td>
                          <td className="p-3">Implement exponential backoff.</td>
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
                <div className="space-y-2 border-b border-slate-100 pb-6">
                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                    Developer Libraries
                  </span>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-display">
                    Official SDKs
                  </h1>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Official client SDKs for seamless integration in your language of choice.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Node.js / TypeScript</span>
                      <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">npm i @mf/sdk</span>
                    </div>
                    <p className="text-xs text-slate-600">Full TypeScript types, auto-retries, webhook signature verification.</p>
                  </div>

                  <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Python</span>
                      <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">pip install mf-tech</span>
                    </div>
                    <p className="text-xs text-slate-600">Asyncio support, algorithmic credit scoring wrappers, pandas utilities.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 7. Webhooks Guide */}
            {activeId === "webhooks" && (
              <div className="space-y-8 max-w-4xl">
                <div className="space-y-2 border-b border-slate-100 pb-6">
                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                    Event Streaming
                  </span>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-display">
                    Webhooks &amp; Signatures
                  </h1>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Receive real-time notifications when loan applications are approved, SMS messages are delivered, or repayments clear.
                  </p>
                </div>

                <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                  <p>
                    Every webhook payload is signed with an HMAC-SHA256 signature passed in the <code className="font-mono text-xs bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">X-MF-Signature</code> header. Verify the signature against your webhook secret before parsing.
                  </p>
                  <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto">
                    <code>X-MF-Signature: t=1788516780,v1=9a8b7c6d5e4f3a2b1c...</code>
                  </div>
                </div>
              </div>
            )}

            {/* 8. Specific Endpoint Split View (Protocol & Stripe Style) */}
            {currentEndpoint && (
              <ProtocolEndpointView endpoint={currentEndpoint} />
            )}
          </main>
        </div>
      </div>

      {/* ── Mobile Navigation Drawer (Right panel in screenshot) ── */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-200 border-r border-slate-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-xs bg-white transform rotate-45" />
                </div>
                <span className="font-display font-bold text-slate-900">Protocol</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Button inside Mobile Drawer */}
            <div className="p-4 border-b border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setSearchModalOpen(true);
                }}
                className="w-full h-9 rounded-full bg-slate-50 border border-slate-200 px-3.5 flex items-center justify-between text-xs text-slate-400"
              >
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-slate-400" />
                  <span>Find something...</span>
                </div>
                <kbd className="font-mono text-[10px] bg-white border border-slate-200 text-slate-500 rounded px-1.5 py-0.5">
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
          <div className="flex-1 bg-slate-900/40 backdrop-blur-xs" onClick={() => setMobileDrawerOpen(false)} />
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
