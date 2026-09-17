// src/app/company-profile/CompanyProfileClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import { ScrollAnimate } from "@/shared/components/ScrollAnimate";
import {
  FileText,
  Download,
  ShieldCheck,
  Zap,
  Building2,
  Database,
  Lock,
  ArrowRight,
  CheckCircle2,
  Server,
  Layers,
  Award,
  Globe2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu,
  Clock
} from "lucide-react";

export function CompanyProfileClient() {
  const [activeTab, setActiveTab] = useState<"overview" | "modules" | "security" | "case-studies" | "roadmap">("overview");

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-cloud border-b border-fog/20 relative overflow-hidden">
        <div className="w-full px-4 py-12 sm:px-8 lg:px-12 sm:py-20 relative z-10">
          <Breadcrumbs items={[{ label: "Company Profile" }]} />

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center text-graphite border border-fog/20 shadow-sm">
              <FileText className="h-5 w-5 text-graphite" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate">
              Official Corporate Dossier • 2026 Edition
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              SOC 2 Type II Audited
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <h1 className="font-display text-3xl font-bold text-graphite sm:text-4xl md:text-5xl leading-tight">
                M&amp;F Technologies Corporate Profile &amp; Platform Capabilities
              </h1>
              <p className="text-sm sm:text-base text-slate max-w-2xl leading-relaxed">
                A complete institutional briefing on our core lending architecture, automated credit decisioning 
                engines, and bank-grade transactional middleware powering commercial banks, credit unions, and microfinance institutions.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-3 items-center">
                <a
                  href="/MF_Technologies_Company_Profile.pdf"
                  download="MF_Technologies_Company_Profile.pdf"
                  className="inline-flex items-center gap-2 rounded-lg bg-graphite px-5 py-3 text-xs sm:text-sm font-bold text-white hover:bg-slate transition-all shadow-sm active:scale-98"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Official PDF Profile</span>
                  <span className="text-[11px] font-mono opacity-60 ml-1">~860 KB</span>
                </a>

                <a
                  href="/MF_Technologies_Company_Profile.docx"
                  download="MF_Technologies_Company_Profile.docx"
                  className="inline-flex items-center gap-2 rounded-lg bg-white border border-graphite/20 px-5 py-3 text-xs sm:text-sm font-bold text-graphite hover:bg-cloud transition-all shadow-sm active:scale-98"
                >
                  <FileText className="h-4 w-4 text-slate" />
                  <span>Download Word Doc (.docx)</span>
                  <span className="text-[11px] font-mono text-slate/70 ml-1">~77 KB</span>
                </a>

                <a
                  href="/MF_Technologies_Company_Profile.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-fog/40 bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-graphite hover:bg-cloud transition-colors"
                >
                  <span>View PDF</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                </a>

                <Link
                  href="/request-demo"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate hover:text-graphite px-2 py-3 transition-colors"
                >
                  <span>Schedule Executive Briefing</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Document Quick Spec Card */}
            <div className="lg:col-span-4">
              <div className="rounded-xl bg-white border border-fog/20 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-fog/15 pb-3">
                  <span className="text-xs font-bold text-graphite uppercase tracking-wider">Document Specs</span>
                  <span className="text-[11px] font-mono text-slate font-semibold">REF: MF-CORP-2026-V1</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-fog/10">
                    <span className="text-slate">Document Type:</span>
                    <span className="font-semibold text-graphite">Corporate Dossier</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-fog/10">
                    <span className="text-slate">Page Count:</span>
                    <span className="font-semibold text-graphite font-mono">8 Pages (A4 Portrait)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-fog/10">
                    <span className="text-slate">Compliance Standard:</span>
                    <span className="font-semibold text-graphite">SOC 2 Type II / ISO 27001</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-fog/10">
                    <span className="text-slate">Headquarters:</span>
                    <span className="font-semibold text-graphite">Nairobi, Kenya</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate">Official Release:</span>
                    <span className="font-semibold text-graphite font-mono">September 2026</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href="/MF_Technologies_Company_Profile.pdf"
                    download="MF_Technologies_Company_Profile.pdf"
                    className="flex items-center justify-center gap-1.5 rounded-md bg-cloud border border-fog/30 py-2.5 px-2 text-xs font-bold text-graphite hover:bg-ash transition-colors text-center"
                  >
                    <Download className="h-3.5 w-3.5 text-graphite shrink-0" />
                    <span>PDF Dossier</span>
                  </a>
                  <a
                    href="/MF_Technologies_Company_Profile.docx"
                    download="MF_Technologies_Company_Profile.docx"
                    className="flex items-center justify-center gap-1.5 rounded-md bg-white border border-fog/40 py-2.5 px-2 text-xs font-bold text-graphite hover:bg-cloud transition-colors text-center"
                  >
                    <FileText className="h-3.5 w-3.5 text-slate shrink-0" />
                    <span>Word Doc</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Audited Operational Metrics */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-8 border-t border-fog/20">
            <div className="border-l-2 border-graphite pl-4">
              <div className="text-2xl sm:text-3xl font-bold text-graphite font-mono tracking-tight">$1.4B+</div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate mt-1">Processed Volume</div>
              <div className="text-[10px] text-silver mt-0.5">Disbursements &amp; collections</div>
            </div>
            <div className="border-l-2 border-graphite pl-4">
              <div className="text-2xl sm:text-3xl font-bold text-graphite font-mono tracking-tight">99.99%</div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate mt-1">Production Uptime</div>
              <div className="text-[10px] text-silver mt-0.5">Active-active cloud clusters</div>
            </div>
            <div className="border-l-2 border-graphite pl-4">
              <div className="text-2xl sm:text-3xl font-bold text-graphite font-mono tracking-tight">&lt;100ms</div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate mt-1">P99 API Latency</div>
              <div className="text-[10px] text-silver mt-0.5">Mobile money settlement</div>
            </div>
            <div className="border-l-2 border-graphite pl-4">
              <div className="text-2xl sm:text-3xl font-bold text-graphite font-mono tracking-tight">0.00%</div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate mt-1">Balance Drift</div>
              <div className="text-[10px] text-silver mt-0.5">Cryptographic double-entry</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Tabs Navigation */}
      <section className="sticky top-[57px] z-20 bg-white/95 backdrop-blur-md border-b border-fog/20">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <div className="flex overflow-x-auto gap-2 py-3 no-scrollbar">
            {[
              { id: "overview", label: "1. Executive Summary & Pillars" },
              { id: "modules", label: "2. The 10 Technology Modules" },
              { id: "security", label: "3. Security & Governance" },
              { id: "case-studies", label: "4. Client Case Studies" },
              { id: "roadmap", label: "5. Implementation & Roadmap" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-graphite text-white shadow-sm"
                    : "bg-cloud text-slate hover:bg-ash hover:text-graphite"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content Body - Edge to Edge */}
      <section className="w-full px-4 py-12 sm:px-8 lg:px-12 sm:py-16">
        <div className="w-full">
          
          {/* TAB 1: EXECUTIVE SUMMARY */}
          {activeTab === "overview" && (
            <div className="space-y-12">
              <ScrollAnimate>
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-slate uppercase tracking-wider">
                    <Building2 className="h-4 w-4 text-graphite" />
                    <span>Company Overview</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-graphite">
                    Democratizing Institutional-Grade Lending Technology
                  </h2>
                  <p className="text-sm sm:text-base text-slate leading-relaxed">
                    M&amp;F Technologies was founded in 2021 to resolve a systemic barrier facing financial institutions 
                    in emerging markets: monolithic legacy core banking platforms cannot support high-velocity digital credit. 
                    Traditional systems cause slow multi-day disbursements, high manual underwriting costs, and frequent 
                    balance discrepancies between core databases and external payment rails.
                  </p>
                  <p className="text-sm sm:text-base text-slate leading-relaxed">
                    We bridge this gap with an API-first microservices platform built on strict double-entry mathematical ledgers. 
                    Financial institutions can deploy M&amp;F as an autonomous core banking system or layer our microservices over 
                    their existing core without multi-year migration disruption.
                  </p>
                </div>
              </ScrollAnimate>

              {/* 4 Strategic Pillars */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-silver mb-4">
                  The Four Core Pillars
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-xl border border-fog/20 p-6 bg-white shadow-sm hover:shadow-md transition-all">
                    <div className="h-10 w-10 rounded-lg bg-cloud flex items-center justify-center text-graphite mb-4">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-graphite text-base">1. Security-First Architecture</h4>
                    <p className="mt-2 text-xs sm:text-sm text-slate leading-relaxed">
                      Every system component begins with zero-trust security: AES-256-GCM data encryption at rest, enforced TLS 1.3 
                      with Perfect Forward Secrecy in transit, hardware-backed MFA, and immutable cryptographic audit trails.
                    </p>
                  </div>

                  <div className="rounded-xl border border-fog/20 p-6 bg-white shadow-sm hover:shadow-md transition-all">
                    <div className="h-10 w-10 rounded-lg bg-cloud flex items-center justify-center text-graphite mb-4">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-graphite text-base">2. Financial Inclusion Engine</h4>
                    <p className="mt-2 text-xs sm:text-sm text-slate leading-relaxed">
                      Alternative credit scoring models aggregate mobile money transactional velocity, telecom utility records, 
                      and behavioral telemetry to accurately underwrite thin-file and unbanked populations traditionally locked out of credit.
                    </p>
                  </div>

                  <div className="rounded-xl border border-fog/20 p-6 bg-white shadow-sm hover:shadow-md transition-all">
                    <div className="h-10 w-10 rounded-lg bg-cloud flex items-center justify-center text-graphite mb-4">
                      <Database className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-graphite text-base">3. Mathematical Double-Entry</h4>
                    <p className="mt-2 text-xs sm:text-sm text-slate leading-relaxed">
                      Every financial transaction is enforced as an atomic journal entry where total debits mathematically equal total credits. 
                      Guarantees 0.00% balance drift between institutional accounts and third-party telecom disbursement channels.
                    </p>
                  </div>

                  <div className="rounded-xl border border-fog/20 p-6 bg-white shadow-sm hover:shadow-md transition-all">
                    <div className="h-10 w-10 rounded-lg bg-cloud flex items-center justify-center text-graphite mb-4">
                      <Clock className="h-5 w-5" />
                    </div>
                    <h4 className="font-bold text-graphite text-base">4. Institutional Partnership &amp; SLAs</h4>
                    <p className="mt-2 text-xs sm:text-sm text-slate leading-relaxed">
                      We operate as an extension of your technology team. Includes 24/7/365 infrastructure monitoring, a 15-minute 
                      critical incident response SLA, regulatory auto-reporting updates, and dedicated Technical Account Managers.
                    </p>
                  </div>
                </div>
              </div>

              {/* PDF & DOC Banner CTA */}
              <div className="rounded-xl bg-graphite text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-base sm:text-lg font-bold">Review the Complete 8-Page Corporate Dossier</h4>
                  <p className="text-xs sm:text-sm text-fog">
                    Available in print-ready PDF and official editable Microsoft Word (.docx) formats with full document control.
                  </p>
                </div>
                <div className="shrink-0 flex flex-wrap gap-2.5">
                  <a
                    href="/MF_Technologies_Company_Profile.pdf"
                    download="MF_Technologies_Company_Profile.pdf"
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-graphite hover:bg-ash transition-all shadow-sm"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </a>
                  <a
                    href="/MF_Technologies_Company_Profile.docx"
                    download="MF_Technologies_Company_Profile.docx"
                    className="inline-flex items-center gap-2 rounded-lg bg-white/10 border border-white/20 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-all shadow-sm"
                  >
                    <FileText className="h-4 w-4 text-white" />
                    <span>Download Word (.docx)</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THE 10 TECHNOLOGY MODULES */}
          {activeTab === "modules" && (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-slate uppercase tracking-wider">
                  <Layers className="h-4 w-4 text-graphite" />
                  <span>Platform Architecture</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-graphite">
                  The 10 Enterprise Technology Modules
                </h2>
                <p className="text-sm text-slate max-w-3xl leading-relaxed">
                  Available as a turnkey suite or standalone modular microservices integrating into existing core banking hosts via REST and GraphQL.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    code: "MOD 01",
                    title: "Core Lending Engine & Ledger",
                    desc: "Handles the complete loan lifecycle from application and underwriting to disbursal, interest calculation (reducing, flat, amortized), and maturity. Built on mathematical double-entry accounting.",
                    tags: ["Double-Entry", "Zero Drift", "ACID Compliance"]
                  },
                  {
                    code: "MOD 02",
                    title: "Configurable Credit Scoring Platform",
                    desc: "Advanced algorithmic decisioning aggregating credit reference bureaus, alternative payment networks, and mobile wallet velocity. Risk teams configure weights and score cutoffs dynamically.",
                    tags: ["Alternative Data", "Bureau Integration", "-18% Defaults"]
                  },
                  {
                    code: "MOD 03",
                    title: "Collections & Delinquency Management",
                    desc: "Automated delinquency tracking. Segments overdue loans by risk tier, triggers automated SMS/email reminders, schedules automated STK push payment prompts, and routes collector queues.",
                    tags: ["STK Push", "Queue Routing", "+31% Recovery"]
                  },
                  {
                    code: "MOD 04",
                    title: "Workflow & Underwriting Automation",
                    desc: "Automates multi-tiered credit committee approval hierarchies, automated AML/PEP sanctions screening, and bank statement verification for instant-decision retail credit lines.",
                    tags: ["AML/PEP Screening", "Approval Trees", "Instant Underwriting"]
                  },
                  {
                    code: "MOD 05",
                    title: "Developer Suite & API Gateway",
                    desc: "High-throughput JSON REST and GraphQL APIs with sub-100ms P99 latency. Includes real-time webhook subscription engine, multi-tenant rate limiting, and turnkey staging sandboxes.",
                    tags: ["<100ms Latency", "REST & GraphQL", "Webhooks"]
                  },
                  {
                    code: "MOD 06",
                    title: "Regulatory Auto-Reporting Engine",
                    desc: "Automates statutory returns for Central Banks and regulators. Generates standard IFRS 9 loan staging matrices, capital adequacy returns, and mandatory audit files in 1 click.",
                    tags: ["IFRS 9 Staging", "Central Bank Schemas", "Audit Trails"]
                  },
                  {
                    code: "MOD 07",
                    title: "Multi-Currency & Cross-Border Ledger",
                    desc: "Multi-currency general ledger supporting instant FX rate conversions, cross-border remittances, and multi-jurisdictional liquidity management for regional institutions.",
                    tags: ["Multi-Currency", "FX Rate Feeds", "Cross-Border"]
                  },
                  {
                    code: "MOD 08",
                    title: "Document Management & OCR Vault",
                    desc: "Bank-grade encrypted cloud storage. Features automated OCR parsing for national IDs, passports, and bank statements, combined with legal e-signatures and audit logs.",
                    tags: ["OCR Extraction", "E-Signature", "Encrypted Vault"]
                  },
                  {
                    code: "MOD 09",
                    title: "Real-Time Telemetry & Observability",
                    desc: "Comprehensive observability suite featuring Grafana and Prometheus metrics. Provides real-time distributed tracing, endpoint health probes, and sub-minute incident alerts.",
                    tags: ["Grafana/Prometheus", "Distributed Tracing", "24/7 Monitoring"]
                  },
                  {
                    code: "MOD 10",
                    title: "Borrower & Field Officer Portals",
                    desc: "Turnkey responsive borrower web portals and offline-first mobile apps for field credit officers. Captures biometric KYC and loan applications in remote areas with background synchronization.",
                    tags: ["Offline-First", "Biometric KYC", "White-Label"]
                  }
                ].map((mod, idx) => (
                  <div key={idx} className="rounded-xl border border-fog/20 bg-white p-6 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold bg-graphite text-white px-2.5 py-0.5 rounded">
                        {mod.code}
                      </span>
                      <div className="flex gap-1.5 flex-wrap">
                        {mod.tags.map((t, tidx) => (
                          <span key={tidx} className="text-[10px] font-semibold bg-cloud text-slate px-2 py-0.5 rounded border border-fog/20">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <h3 className="font-bold text-graphite text-base">{mod.title}</h3>
                    <p className="text-xs sm:text-sm text-slate leading-relaxed">{mod.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY & GOVERNANCE */}
          {activeTab === "security" && (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-slate uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-graphite" />
                  <span>Institutional Assurance</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-graphite">
                  Enterprise Security, Compliance &amp; Governance
                </h2>
                <p className="text-sm text-slate max-w-3xl leading-relaxed">
                  Lending infrastructure demands uncompromising trust. M&amp;F Technologies implements institutional-grade 
                  security protocols, rigorous audit standards, and regulatory frameworks verified by independent auditors.
                </p>
              </div>

              {/* SOC 2 Deep Dive */}
              <div className="rounded-xl bg-graphite text-white p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-fog font-bold">Independent Audit</span>
                    <h3 className="text-xl font-bold mt-1">SOC 2 Type II Certified</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                    Verified Operational Controls
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-fog leading-relaxed">
                  Following an exhaustive 12-month independent audit conducted by a recognized third-party firm, M&amp;F Technologies 
                  achieved SOC 2 Type II certification across all five Trust Services Criteria: Security, Availability, Processing Integrity, 
                  Confidentiality, and Privacy.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="rounded-lg bg-white/5 border border-white/10 p-3 text-center">
                    <div className="text-[11px] font-bold text-fog uppercase">Encryption at Rest</div>
                    <div className="text-sm font-bold text-white mt-1 font-mono">AES-256-GCM</div>
                  </div>
                  <div className="rounded-lg bg-white/5 border border-white/10 p-3 text-center">
                    <div className="text-[11px] font-bold text-fog uppercase">In-Transit Transit</div>
                    <div className="text-sm font-bold text-white mt-1 font-mono">TLS 1.3 / PFS</div>
                  </div>
                  <div className="rounded-lg bg-white/5 border border-white/10 p-3 text-center">
                    <div className="text-[11px] font-bold text-fog uppercase">Access Governance</div>
                    <div className="text-sm font-bold text-white mt-1 font-mono">Hardware MFA</div>
                  </div>
                  <div className="rounded-lg bg-white/5 border border-white/10 p-3 text-center">
                    <div className="text-[11px] font-bold text-fog uppercase">Data Isolation</div>
                    <div className="text-sm font-bold text-white mt-1 font-mono">Tenant RBAC</div>
                  </div>
                </div>
              </div>

              {/* Disaster Recovery & Privacy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl border border-fog/20 p-6 bg-white space-y-3">
                  <h4 className="font-bold text-graphite text-base flex items-center gap-2">
                    <Server className="h-4 w-4 text-graphite" />
                    <span>High Availability &amp; Disaster Recovery</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate leading-relaxed">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Multi-Region Active-Active:</strong> Database nodes replicate in near-real-time across isolated physical cloud zones.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>RPO &lt; 1 Minute:</strong> Transaction journal replication ensures sub-minute recovery point objectives.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>RTO &lt; 5 Minutes:</strong> Automated health probes trigger sub-five-minute cluster failovers during localized server outages.</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-fog/20 p-6 bg-white space-y-3">
                  <h4 className="font-bold text-graphite text-base flex items-center gap-2">
                    <Globe2 className="h-4 w-4 text-graphite" />
                    <span>Regulatory &amp; Data Privacy Alignment</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate leading-relaxed">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Central Bank Compliance:</strong> Built to conform with regional prudential guidelines, capital ratios, and loan loss provisioning.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>ODPC &amp; GDPR Conformance:</strong> Guarantees data residency, consent lifecycle management, and privacy by design.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>AML/CFT Oversight:</strong> Automated screening against global OFAC, UN, and PEP sanction watchlists.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CASE STUDIES & IMPACT */}
          {activeTab === "case-studies" && (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-slate uppercase tracking-wider">
                  <Award className="h-4 w-4 text-graphite" />
                  <span>Verified Impact</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-graphite">
                  Institutional Deployments &amp; Case Studies
                </h2>
                <p className="text-sm text-slate max-w-3xl leading-relaxed">
                  Real-world deployment outcomes across commercial banking, cooperative credit unions, and agricultural microfinance providers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    client: "Apex International Bank",
                    sector: "Commercial Banking • Nairobi, Kenya",
                    badge: "1.2M Retail Accounts",
                    challenge: "Outdated legacy core banking caused 4-day loan turnaround times, leading to high drop-off rates for digital retail facilities.",
                    solution: "Deployed M&F Core Lending Engine and API Gateway to automate origination and direct-to-mobile disbursements.",
                    impact: ["74% reduction in approval turnaround (from 4 days to 4 minutes)", "18% lower default rates via alternative credit decisioning"]
                  },
                  {
                    client: "Pioneer Teachers SACCO",
                    sector: "Credit Union / Cooperative • Nairobi, Kenya",
                    badge: "65,000 Members",
                    challenge: "Manual spreadsheet tracking for overdue member facilities resulted in mounting delinquency and slow collection cycles.",
                    solution: "Integrated M&F Collections & Delinquency Management with automated SMS schedules and mobile money STK push prompts.",
                    impact: ["31% recovery rate improvement in the first 90 days", "100% automated payment reconciliation with zero manual spreadsheets"]
                  },
                  {
                    client: "Sunrise Micro-Finance Group",
                    sector: "Rural & Agricultural MFI • Mombasa, Kenya",
                    badge: "Offline-First Mobile",
                    challenge: "Field credit officers operating in remote agricultural zones lacked reliable internet, slowing KYC capture and disbursements.",
                    solution: "Equipped 200+ field officers with the M&F Offline-First Mobile App with encrypted SQLite storage and biometric capture.",
                    impact: ["60% boost in daily field officer application throughput", "Automated sync on network reconnect with zero corrupted records"]
                  },
                  {
                    client: "Equatorial United Bank",
                    sector: "Commercial Bank • Kampala, Uganda",
                    badge: "High-Velocity Telemetry",
                    challenge: "Bank experienced server crashes during month-end salary loan peaks, causing angry borrower backlogs and SLA penalties.",
                    solution: "Deployed M&F Configurable Decisioning Engine with dynamic query queuing and active-active load balancing.",
                    impact: ["Processed 45,000+ credit scoring queries/hour during peak windows", "100% uptime with zero server lockups across 24 consecutive months"]
                  }
                ].map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-fog/20 bg-white p-6 shadow-sm space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-graphite text-base">{item.client}</h3>
                        <p className="text-xs text-silver font-medium mt-0.5">{item.sector}</p>
                      </div>
                      <span className="text-[10px] font-bold bg-cloud text-graphite border border-fog/25 px-2.5 py-1 rounded">
                        {item.badge}
                      </span>
                    </div>
                    <div className="space-y-2 text-xs text-slate leading-relaxed">
                      <p><strong>Challenge:</strong> {item.challenge}</p>
                      <p><strong>Solution:</strong> {item.solution}</p>
                    </div>
                    <div className="rounded-lg bg-cloud p-3 space-y-1">
                      <div className="text-[11px] font-bold text-graphite uppercase tracking-wider">Quantifiable Results:</div>
                      {item.impact.map((imp, iidx) => (
                        <div key={iidx} className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{imp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ROADMAP & GOVERNANCE */}
          {activeTab === "roadmap" && (
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-slate uppercase tracking-wider">
                  <Clock className="h-4 w-4 text-graphite" />
                  <span>Execution &amp; Governance</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-graphite">
                  4-Phase Implementation Methodology
                </h2>
                <p className="text-sm text-slate max-w-3xl leading-relaxed">
                  Our structured onboarding process guarantees risk-free integration with zero disruption to daily banking operations.
                </p>
              </div>

              {/* Timeline Table */}
              <div className="rounded-xl border border-fog/20 bg-white overflow-hidden shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-fog/20">
                  <div className="p-5 space-y-2">
                    <div className="text-xs font-mono font-bold text-silver">PHASE 01 • WEEKS 1-2</div>
                    <h3 className="font-bold text-graphite text-sm">Gap Analysis &amp; Blueprint</h3>
                    <p className="text-xs text-slate leading-relaxed">
                      Audit existing core banking interfaces, map data dictionaries, define risk trees, and configure loan products.
                    </p>
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="text-xs font-mono font-bold text-silver">PHASE 02 • WEEKS 3-4</div>
                    <h3 className="font-bold text-graphite text-sm">Sandbox &amp; API Integration</h3>
                    <p className="text-xs text-slate leading-relaxed">
                      Deploy private multi-tenant sandbox, configure payment webhooks (M-Pesa/Airtel/RTGS), and connect bureaus.
                    </p>
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="text-xs font-mono font-bold text-silver">PHASE 03 • WEEKS 5-6</div>
                    <h3 className="font-bold text-graphite text-sm">Shadow Ledger &amp; UAT</h3>
                    <p className="text-xs text-slate leading-relaxed">
                      Run M&amp;F double-entry ledger in parallel with legacy system to certify 0.00% balance drift and complete UAT.
                    </p>
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="text-xs font-mono font-bold text-silver">PHASE 04 • WEEK 7+</div>
                    <h3 className="font-bold text-graphite text-sm">Production Cutover &amp; SLA</h3>
                    <p className="text-xs text-slate leading-relaxed">
                      Live production traffic cutover, staff enablement workshops, and initiation of dedicated 24/7 Tier-1 support.
                    </p>
                  </div>
                </div>
              </div>

              {/* Corporate Leadership */}
              <div className="pt-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-silver">
                  Corporate Governance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="rounded-xl border border-fog/20 bg-white p-5 space-y-2">
                    <h4 className="font-bold text-graphite text-sm">Musa Mutindi</h4>
                    <div className="text-[11px] font-semibold text-slate uppercase">Founder &amp; Chief Executive Officer</div>
                    <p className="text-xs text-slate leading-relaxed">
                      Leads corporate strategy, regulatory alignment, and institutional partnerships across Pan-African emerging markets.
                    </p>
                  </div>
                  <div className="rounded-xl border border-fog/20 bg-white p-5 space-y-2">
                    <h4 className="font-bold text-graphite text-sm">Distributed Engineering Group</h4>
                    <div className="text-[11px] font-semibold text-slate uppercase">Systems &amp; Ledger Architects</div>
                    <p className="text-xs text-slate leading-relaxed">
                      Engineers distributed systems across five time zones to ensure sub-100ms response SLAs and 99.99% system availability.
                    </p>
                  </div>
                  <div className="rounded-xl border border-fog/20 bg-white p-5 space-y-2">
                    <h4 className="font-bold text-graphite text-sm">Risk &amp; Compliance Advisory</h4>
                    <div className="text-[11px] font-semibold text-slate uppercase">Regulatory Advisory Council</div>
                    <p className="text-xs text-slate leading-relaxed">
                      Specialized banking risk officers and legal advisors ensuring continuous CBK reporting and SOC 2 compliance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Institutional Procurement & Download Box */}
      <section className="bg-cloud border-t border-fog/20 py-16">
        <div className="w-full px-4 sm:px-8 lg:px-12 text-center space-y-6">
          <div className="h-12 w-12 rounded-xl bg-graphite text-white flex items-center justify-center mx-auto shadow-md">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-bold font-display text-graphite">
            Request an Institutional Architecture Briefing or RFP Packet
          </h3>
          <p className="text-sm text-slate max-w-xl mx-auto leading-relaxed">
            Financial institutions conducting core modernization feasibility studies or vendor security evaluations 
            can download our complete corporate profile or schedule a direct consultation with our systems leads.
          </p>
          <div className="pt-2 flex flex-wrap gap-3 justify-center items-center">
            <a
              href="/MF_Technologies_Company_Profile.pdf"
              download="MF_Technologies_Company_Profile.pdf"
              className="inline-flex items-center gap-2 rounded-lg bg-graphite px-5 py-3 text-xs sm:text-sm font-bold text-white hover:bg-slate transition-all shadow-sm"
            >
              <Download className="h-4 w-4" />
              <span>Download Official PDF Profile</span>
            </a>
            <a
              href="/MF_Technologies_Company_Profile.docx"
              download="MF_Technologies_Company_Profile.docx"
              className="inline-flex items-center gap-2 rounded-lg bg-white border border-graphite/20 px-5 py-3 text-xs sm:text-sm font-bold text-graphite hover:bg-cloud transition-all shadow-sm"
            >
              <FileText className="h-4 w-4 text-slate" />
              <span>Download Word Doc (.docx)</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-lg border border-fog/40 bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-graphite hover:bg-ash transition-colors"
            >
              <span>Contact RFP Desk</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
