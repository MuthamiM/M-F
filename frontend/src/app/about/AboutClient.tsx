// src/app/about/AboutClient.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Shield, Cpu, Zap, Activity, Users2, Globe2, Target, Award } from "lucide-react";
import { ScrollAnimate } from "@/shared/components/ScrollAnimate";

const MILESTONES = [
  { year: "2021", title: "Founded in Nairobi", description: "M&F Technologies was established to address the critical gap in affordable, high-performance lending infrastructure for financial institutions across emerging markets." },
  { year: "2022", title: "First Institutional Partner", description: "Deployed our core lending engine for our first commercial bank partner, processing over 50,000 loan applications in the first quarter." },
  { year: "2023", title: "Multi-Region Expansion", description: "Expanded infrastructure to three cloud regions, established operational hubs in London and Lagos, and achieved SOC 2 Type II certification." },
  { year: "2024", title: "Credit Scoring Engine Launch", description: "Released our configurable risk decisioning weight trees, enabling institutions to integrate alternative mobile wallet data into underwriting workflows." },
  { year: "2025", title: "$1B+ Processed", description: "Crossed $1 billion in cumulative processed disbursements and repayments across all partner institutions with zero transaction failures." },
  { year: "2026", title: "Platform v2.4 & Scale", description: "Launched Core Lending Engine v2.4 with sub-100ms disbursement APIs and cryptographic ledger journaling. Surpassed $1.4B in processed volume." },
];

const LEADERSHIP = [
  { name: "Musa Mutindi", role: "Founder & Chief Executive Officer", description: "Musa leads M&F Technologies with a focus on building mission-driven financial infrastructure that expands access to credit for underserved markets. He oversees product strategy, institutional partnerships, and the company's long-term vision." },
  { name: "Engineering Leadership", role: "Distributed Technical Team", description: "Our engineering team is distributed across five time zones, comprising system architects, database reliability engineers, and security specialists focused on building fault-tolerant, high-throughput financial systems." },
  { name: "Compliance & Risk Advisory", role: "Regulatory Framework Team", description: "A dedicated advisory group of banking compliance specialists and risk officers who shape our regulatory auto-reporting schemas, ensure central bank reporting compliance, and maintain our SOC 2 certification." },
];

const VALUES = [
  { icon: <Shield className="h-5 w-5" />, title: "Security First", description: "Every system we build starts with security. AES-256-GCM encryption, TLS 1.3, hardware-backed MFA, and role-based access controls are foundational, not afterthoughts." },
  { icon: <Target className="h-5 w-5" />, title: "Financial Inclusion", description: "We believe technology should expand access to credit. Our alternative scoring models use mobile wallet data and payment patterns to serve thin-file and unbanked populations." },
  { icon: <Cpu className="h-5 w-5" />, title: "Engineering Excellence", description: "Double-entry ledger integrity, cryptographic audit trails, and sub-100ms API response times are the standards we hold ourselves to across every deployment." },
  { icon: <Users2 className="h-5 w-5" />, title: "Partner Success", description: "We measure our success by our partners' outcomes. Dedicated support channels, 24/7 SLA monitoring, and custom integration support ensure institutional success." },
];

import { Breadcrumbs } from "@/shared/components/Breadcrumbs";

export function AboutClient() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-cloud border-b border-fog/20">
        <div className="w-full px-4 py-12 sm:px-8 lg:px-12 sm:py-20">
          <Breadcrumbs items={[{ label: "About Us" }]} />

          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center text-[#1B222C] border border-[#9AA5B1]/20 shadow-sm">
              <Globe2 className="h-5 w-5 text-[#1B222C]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3E4C59]">
              About M&amp;F Technologies
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold text-graphite sm:text-4xl md:text-5xl leading-tight">
            Building the Infrastructure That Powers Institutional Lending
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate max-w-3xl leading-relaxed">
            M&amp;F Technologies is a financial technology company that designs, deploys, and operates high-performance lending infrastructure for banks, credit unions, and microfinance institutions. We bridge the gap between legacy core banking systems and modern digital interfaces through microservice-driven transaction engines, automated credit scoring, and ultra-secure middleware.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="border-l-2 border-[#1B222C] pl-4">
              <div className="text-2xl sm:text-3xl font-bold text-graphite font-mono tracking-tight">$1.4B+</div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate mt-1.5">Processed Volume</div>
            </div>
            <div className="border-l-2 border-[#1B222C] pl-4">
              <div className="text-2xl sm:text-3xl font-bold text-graphite font-mono tracking-tight">99.99%</div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate mt-1.5">Production Uptime</div>
            </div>
            <div className="border-l-2 border-[#1B222C] pl-4">
              <div className="text-2xl sm:text-3xl font-bold text-graphite font-mono tracking-tight">&lt;100ms</div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate mt-1.5">P99 API Latency</div>
            </div>
            <div className="border-l-2 border-[#1B222C] pl-4">
              <div className="text-2xl sm:text-3xl font-bold text-graphite font-mono tracking-tight">SOC 2</div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate mt-1.5">Type II Certified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="w-full px-4 py-16 sm:px-8 lg:px-12 sm:py-24 space-y-16">
        <ScrollAnimate>
          <div className="max-w-4xl space-y-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate border border-slate/30 px-3 py-1 rounded-full bg-cloud">
              Our Mission
            </span>
            <h2 className="font-display text-2xl font-bold text-graphite sm:text-3xl md:text-4xl leading-tight">
              Democratizing Access to Institutional-Grade Financial Technology
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-slate leading-relaxed">
              <p>
                Across emerging markets, financial institutions face a critical challenge: legacy core banking systems cannot keep pace with the demands of modern digital lending. Outdated infrastructure leads to slow disbursements, error-prone manual underwriting, and compliance gaps that expose institutions to regulatory risk.
              </p>
              <p>
                M&amp;F Technologies was founded to solve this problem. We build modular, high-throughput lending platforms that integrate seamlessly with existing banking infrastructure while delivering the speed, security, and reliability that modern credit operations demand. Our systems process millions of transactions with zero balance drift, enforce double-entry accounting integrity at the database level, and automatically generate compliant regulatory reports.
              </p>
              <p>
                By combining institutional-grade security (AES-256-GCM encryption, SOC 2 Type II compliance) with flexible, API-first architecture, we empower financial institutions to automate underwriting pipelines, integrate alternative credit data sources, and disburse funds in milliseconds — all while maintaining complete auditability.
              </p>
            </div>
          </div>
        </ScrollAnimate>

        {/* Core Values */}
        <ScrollAnimate delay={0.1}>
          <div className="border-t border-[#9AA5B1]/20 pt-16">
            <h2 className="font-display text-xl font-bold text-graphite sm:text-2xl mb-8">
              Core Principles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {VALUES.map((value, idx) => (
                <div key={idx} className="rounded-xl bg-white p-6 sm:p-8 shadow-sm border border-[#9AA5B1]/20 hover:shadow-md transition-all duration-300">
                  <div className="h-11 w-11 rounded-lg bg-cloud flex items-center justify-center text-graphite mb-5 border border-[#9AA5B1]/10">
                    {value.icon}
                  </div>
                  <h3 className="font-bold text-graphite text-base sm:text-lg">{value.title}</h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-slate leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollAnimate>

        {/* Leadership */}
        <ScrollAnimate delay={0.15}>
          <div className="border-t border-[#9AA5B1]/20 pt-16">
            <h2 className="font-display text-xl font-bold text-graphite sm:text-2xl mb-3">
              Leadership
            </h2>
            <p className="text-sm text-slate leading-relaxed max-w-3xl mb-8">
              Our leadership team combines deep expertise in financial systems engineering, banking compliance, and enterprise infrastructure operations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {LEADERSHIP.map((person, idx) => (
                <div key={idx} className="rounded-xl border border-[#9AA5B1]/20 bg-[#F8FAFC] p-6 space-y-3">
                  <div className="h-12 w-12 rounded-full bg-[#1B222C] flex items-center justify-center text-white text-sm font-bold">
                    {person.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="font-bold text-graphite text-sm sm:text-base">{person.name}</h3>
                    <div className="text-[11px] text-[#6B7684] font-semibold uppercase tracking-wider mt-0.5">{person.role}</div>
                  </div>
                  <p className="text-xs text-slate leading-relaxed">{person.description}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollAnimate>

        {/* Timeline */}
        <ScrollAnimate delay={0.2}>
          <div className="border-t border-[#9AA5B1]/20 pt-16">
            <h2 className="font-display text-xl font-bold text-graphite sm:text-2xl mb-8">
              Company Timeline
            </h2>
            <div className="space-y-6">
              {MILESTONES.map((milestone, idx) => (
                <div key={idx} className="flex gap-6 items-start">
                  <div className="shrink-0 w-16 text-right">
                    <span className="text-lg font-bold font-mono text-graphite">{milestone.year}</span>
                  </div>
                  <div className="relative flex flex-col items-center shrink-0">
                    <div className="h-3 w-3 rounded-full bg-[#1B222C] border-2 border-white shadow-sm" />
                    {idx < MILESTONES.length - 1 && <div className="w-px h-full bg-[#9AA5B1]/30 mt-1" />}
                  </div>
                  <div className="pb-6">
                    <h3 className="font-bold text-graphite text-sm sm:text-base">{milestone.title}</h3>
                    <p className="text-xs text-slate leading-relaxed mt-1">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollAnimate>

        {/* CTA */}
        <div className="rounded-xl bg-[#1B222C] text-white p-8 sm:p-10 text-center space-y-4 max-w-3xl mx-auto">
          <Award className="h-8 w-8 mx-auto text-[#9AA5B1]" />
          <h3 className="text-lg sm:text-xl font-bold">Partner with M&amp;F Technologies</h3>
          <p className="text-xs sm:text-sm text-[#9AA5B1] leading-relaxed max-w-xl mx-auto">
            Whether you are a commercial bank looking to modernize your lending stack, a microfinance institution seeking automated underwriting, or a technology integrator building banking middleware, we would love to connect.
          </p>
          <div className="pt-2 flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-5 py-2.5 text-xs font-bold text-[#1B222C] hover:bg-[#E4E7EB] transition-all shadow-sm"
            >
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/get-involved"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 border border-white/20 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-all"
            >
              Partner Program
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
