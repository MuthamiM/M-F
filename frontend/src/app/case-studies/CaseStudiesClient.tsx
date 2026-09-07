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
  challenge: string;
  architecture: string;
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
      { label: "NPL Reduction", value: "24.2%" },
    ],
    challenge:
      "Apex Commercial Union operated with bottlenecked manual underwriting processes across 34 regional branches. Loan application forms required manual verification of bank statement history, alternative score validation, and human risk weighting. This resulted in an average turnaround of 3 business days per application, leading to high consumer churn rates and significant operational overhead in credit evaluation teams.",
    architecture:
      "Deploying a dual-region microservice architecture leveraging M&F's Credit Scoring Platform. The stack implements automated OCR parsers for financial statements, REST endpoints connecting directly to regional credit reference bureaus, and dynamic weight tree logic that evaluates applicant debt-to-income (DTI) metrics and history arrays in less than 150 milliseconds.",
    solution:
      "Integrated the M&F Credit Scoring Platform and Core Lending Engine API. Apex successfully reduced turnaround time from 3 days to 45 seconds for 88% of qualifying digital loan requests. Furthermore, the alternative score telemetry allowed the union to capture lower-risk portfolios previously missed by manual checks, decreasing Non-Performing Loans (NPL) by 24.2% while processing over $180M in credit disbursements.",
  },
  {
    id: "pan-african-microfinance",
    client: "Horizon Micro-Credit Ltd",
    industry: "Digital Microfinance Provider",
    title: "Deploying Zero-Downtime Double-Entry Ledger for 1.5M Mobile Borrowers",
    metrics: [
      { label: "Active Borrowers", value: "1.5 Million" },
      { label: "Daily Disbursements", value: "120,000+" },
      { label: "Ledger Drift", value: "0.00%" },
    ],
    challenge:
      "Horizon Micro-Credit struggled with transactional consistency and balance drift in their high-frequency mobile lending systems. Their legacy relational database frequently experienced lock contentions during peak repayment hours, resulting in mismatched ledger balances, manual reconciliation bottlenecks, and database server crashes that directly impacted business revenue.",
    architecture:
      "An immutable, event-sourced transaction ledger system using PostgreSQL with logical replica shards. The system writes credit and debit journals in atomic database transactions, producing cryptographic blocks (SHA-256) of prior logs to prevent ledger manipulation. The network handles over 800 write queries per second with zero-lock concurrency control.",
    solution:
      "Migrated Horizon's complete database layer to M&F's transaction ledger engine. The migration was achieved with zero service interruption. The new engine successfully processed over 120,000 daily disbursements with 0.00% ledger balance drift. In addition, automated webhook triggers enabled instant, sub-second payment settlement notifications and integrated automated SMS notification workflows for borrowers.",
  },
  {
    id: "tier1-bank-syndication",
    client: "Equatorial Commercial Bank",
    industry: "Tier-1 Commercial Bank",
    title: "Multi-Currency Syndications Ledger & Cross-Border Float Optimization",
    metrics: [
      { label: "Cross-Border Settlement", value: "< 3 Seconds" },
      { label: "Monthly Volume", value: "$320M" },
      { label: "Reconciliation Accuracy", value: "100.0%" },
    ],
    challenge:
      "Equatorial Commercial Bank managed syndicated commercial loans across 4 East African jurisdictions using fragmented spreadsheet reconciliations and legacy batch core banking routines. Currency conversions, fluctuating interbank rates, and multi-participant dividend distributions took up to 10 days to reconcile at month-end.",
    architecture:
      "A distributed multi-currency ledger module with automated FX rate feed hooks, atomic multi-participant journal entries, and programmatic escrow allocations. Built with Node.js and PostgreSQL read-replicas across three cloud regions.",
    solution:
      "Implemented M&F's API-first syndication engine, enabling automated dividend splits and near-instant cross-border mobile wallet float rebalancing. Month-end reconciliation time was reduced from 10 days to under 15 minutes, with zero currency allocation discrepancies across over $320M in monthly volume.",
  },
  {
    id: "agricultural-credit-cooperative",
    client: "Kilimo Bora Credit Cooperative",
    industry: "Rural SACCO Federation",
    title: "Offline-First Tablet Underwriting & Biometric KYC for 250,000 Smallholder Farmers",
    metrics: [
      { label: "Farmers Reached", value: "250,000+" },
      { label: "Approval Cycle", value: "Same-Day" },
      { label: "Repayment Rate", value: "96.8%" },
    ],
    challenge:
      "Kilimo Bora's loan officers traveled to remote rural farming communities with poor cellular connectivity, manually filling out paper credit applications and taking days to return to town centers for data entry. Farmer loan approvals routinely took 4 to 6 weeks, frequently missing planting seasons.",
    architecture:
      "An offline-first mobile app using SQLite on encrypted Android tablets, synchronizing bidirectionally with M&F's core lending engine whenever field officers reach cellular reception or Wi-Fi mesh points. Integrated local biometric fingerprint validation against offline encrypted identity caches.",
    solution:
      "Equipped 120 field credit officers with M&F's offline underwriting app. Farmers now receive credit decisions and seasonal fertilizer vouchers on the same day. Over 250,000 farmers were successfully onboarded, and delinquency rates remained below 3.2% due to predictive harvest cycle repayment scheduling.",
  },
];

import { Breadcrumbs } from "@/shared/components/Breadcrumbs";

export function CaseStudiesClient() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#F4F6F8] border-b border-[#9AA5B1]/20">
        <div className="w-full px-4 py-12 sm:px-8 lg:px-12 sm:py-20">
          <Breadcrumbs items={[{ label: "Case Studies" }]} />

          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center text-[#1B222C] border border-[#9AA5B1]/20 shadow-sm">
              <BookOpen className="h-5 w-5 text-[#1B222C]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3E4C59]">
              Institutional Impact Reports
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-[#1B222C] sm:text-4xl md:text-5xl leading-tight">
            Case Studies &amp; Architectural Results
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#3E4C59] max-w-2xl leading-relaxed">
            See how leading financial institutions, credit unions, and microfinance organizations implement M&amp;F core technology to optimize underwriting pipelines, secure financial transactions, and improve operational efficiencies.
          </p>
        </div>
      </section>

      {/* Case Studies List */}
      <section className="w-full px-4 py-16 sm:px-8 lg:px-12 sm:py-24">
        <div className="flex flex-col gap-10">
          {CASE_STUDIES.map((study) => (
            <div
              key={study.id}
              className="rounded-2xl border border-[#9AA5B1]/25 bg-white p-6 sm:p-10 shadow-sm transition-all duration-300 hover:border-[#1B222C] hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#6B7684]">
                <span className="flex items-center gap-1.5 font-bold text-[#1B222C] uppercase tracking-wider">
                  <Building2 className="h-4 w-4 text-[#3E4C59]" />
                  {study.client}
                </span>
                <span className="rounded-full bg-[#F4F6F8] px-3 py-1 font-semibold text-[#3E4C59] border border-[#9AA5B1]/20">
                  {study.industry}
                </span>
              </div>

              <h2 className="mt-4 font-display text-2xl font-bold text-[#1B222C] leading-snug">
                {study.title}
              </h2>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-4 mt-6 p-5 bg-[#F4F6F8] rounded-xl border border-[#9AA5B1]/20">
                {study.metrics.map((m) => (
                  <div key={m.label} className="border-l border-[#9AA5B1]/30 pl-3">
                    <span className="text-[10px] sm:text-xs text-[#6B7684] block font-semibold uppercase tracking-wider">
                      {m.label}
                    </span>
                    <p className="text-sm sm:text-xl font-bold text-[#1B222C] mt-1 font-mono tracking-tight">
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-6 text-sm text-[#3E4C59] leading-relaxed">
                <div>
                  <strong className="text-[#1B222C] font-bold block mb-1 text-xs uppercase tracking-wider">Operational Challenge:</strong>
                  <p>{study.challenge}</p>
                </div>
                <div>
                  <strong className="text-[#1B222C] font-bold block mb-1 text-xs uppercase tracking-wider">Engineering Architecture:</strong>
                  <p>{study.architecture}</p>
                </div>
                <div>
                  <strong className="text-[#1B222C] font-bold block mb-1 text-xs uppercase tracking-wider">Results &amp; Solution:</strong>
                  <p>{study.solution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
