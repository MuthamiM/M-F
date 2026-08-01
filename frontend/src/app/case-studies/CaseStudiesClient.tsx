// src/app/case-studies/CaseStudiesClient.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Building2, TrendingUp, ShieldCheck, Zap } from "lucide-react";

interface CaseStudy {
  id: string;
  client: string;
  industry: string;
  title: string;
  metrics: { label: string; value: string }[];
  summary: string;
  solution: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "regional-credit-union",
    client: "Apex Commercial Union",
    industry: "Tier-2 Financial Institution",
    title: "Automating Commercial Loan Underwriting from 3 Days to 45 Seconds",
    metrics: [
      { label: "Underwriting Time", value: "45 Seconds" },
      { label: "Loan Volume Processed", value: "$180M+" },
      { label: "NPL Reduction", value: "24%" },
    ],
    summary:
      "Apex Commercial Union faced bottlenecked manual underwriting processes across 34 regional branches, restricting loan portfolio growth and increasing customer churn.",
    solution:
      "Integrated M&F's Credit Scoring Platform and Core Lending Engine API, enabling automated risk matrix evaluation, bureau payload aggregation, and instant mobile disbursements.",
  },
  {
    id: "pan-african-microfinance",
    client: "Horizon Micro-Credit Ltd",
    industry: "Digital Microfinance Provider",
    title: "Deploying Zero-Downtime Double-Entry Ledger for 1.5M Mobile Borrowers",
    metrics: [
      { label: "Active Borrowers", value: "1.5 Million" },
      { label: "Daily Disbursements", value: "120,000+" },
      { label: "Platform Uptime", value: "99.99%" },
    ],
    summary:
      "Horizon required a scalable financial ledger backend capable of processing high-frequency micro-loans with absolute transaction integrity and zero balance drift.",
    solution:
      "Migrated legacy database architecture to M&F's core double-entry transactional ledger engine with sub-100ms API response rates and automated SMS repayment workflows.",
  },
];

export function CaseStudiesClient() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#F4F6F8] border-b border-[#9AA5B1]/20">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3E4C59] hover:text-[#1B222C] transition-colors mb-6 sm:mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center text-[#1B222C] border border-[#9AA5B1]/20 shadow-sm">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3E4C59]">
              Institutional Impact Reports
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-[#1B222C] sm:text-4xl md:text-5xl">
            Case Studies &amp; Proven Results
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#3E4C59] max-w-2xl leading-relaxed">
            See how leading banks, credit unions, and micro-lenders transform loan origination and risk management with M&amp;F Technologies.
          </p>
        </div>
      </section>

      {/* Case Studies List */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-8">
          {CASE_STUDIES.map((study) => (
            <div
              key={study.id}
              className="rounded-2xl border border-[#9AA5B1]/25 bg-white p-6 sm:p-10 shadow-sm transition-all hover:border-[#3E4C59]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B7684]">
                <span className="flex items-center gap-1.5 font-bold text-[#1B222C] uppercase tracking-wider">
                  <Building2 className="h-4 w-4 text-[#3E4C59]" />
                  {study.client}
                </span>
                <span className="rounded-full bg-[#F4F6F8] px-3 py-1 font-medium text-[#3E4C59] border border-[#9AA5B1]/20">
                  {study.industry}
                </span>
              </div>

              <h2 className="mt-4 font-display text-2xl font-bold text-[#1B222C] leading-snug">
                {study.title}
              </h2>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6 p-4 sm:p-5 bg-[#F4F6F8] rounded-xl border border-[#9AA5B1]/20">
                {study.metrics.map((m) => (
                  <div key={m.label}>
                    <span className="text-[10px] sm:text-xs text-[#6B7684] block font-medium">
                      {m.label}
                    </span>
                    <p className="text-base sm:text-xl font-bold text-[#1B222C] mt-0.5 font-mono">
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4 text-sm text-[#3E4C59] leading-relaxed">
                <div>
                  <strong className="text-[#1B222C] font-semibold block mb-1">Challenge:</strong>
                  {study.summary}
                </div>
                <div>
                  <strong className="text-[#1B222C] font-semibold block mb-1">M&amp;F Solution:</strong>
                  {study.solution}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
