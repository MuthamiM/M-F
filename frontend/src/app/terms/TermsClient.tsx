// src/app/terms/TermsClient.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";

export function TermsClient() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="bg-[#F4F6F8] border-b border-[#9AA5B1]/20">
        <div className="w-full px-4 py-16 sm:px-8 lg:px-12 sm:py-24">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3E4C59] hover:text-[#1B222C] transition-colors mb-6 sm:mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center text-[#1B222C] border border-[#9AA5B1]/20 shadow-sm">
              <Scale className="h-5 w-5 text-[#1B222C]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3E4C59]">
              Legal Terms &amp; Conditions Agreement
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-[#1B222C] sm:text-4xl md:text-5xl">
            Institutional Terms of Service
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#6B7684]">
            Effective Date: July 31, 2026 &bull; Last Updated: August 2026 &bull; Version 3.0
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="w-full px-4 py-16 sm:px-8 lg:px-12 sm:py-20 text-[#3E4C59] leading-relaxed space-y-10 text-sm sm:text-base">
        <div>
          <p className="font-medium text-[#1B222C]">
            Please read these Institutional Terms of Service (&quot;Agreement&quot; or &quot;Terms&quot;) carefully. This is a legally binding contract between M&amp;F Technologies Inc. (&quot;M&amp;F&quot;) and the entity accessing our services (&quot;Partner Institution&quot;, &quot;Client&quot;, or &quot;User&quot;).
          </p>
        </div>

        <div className="border-t border-[#9AA5B1]/20 pt-8">
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-4">1. Acceptance of Terms &amp; Corporate Authority</h2>
          <p className="max-w-4xl">
            By registering for an administrative portal, integrating our software development kits (SDKs), executing calls to our production application programming interfaces (APIs), or subscribing to our core hosting packages, you represent that you have read, understood, and agree to be bound by this Agreement. If you are entering into these terms on behalf of a licensed commercial bank, savings credit union, microfinance organization, or financial technology provider, you represent and warrant that you possess the explicit legal and corporate authority to bind such entity.
          </p>
        </div>

        <div className="border-t border-[#9AA5B1]/20 pt-8">
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-4">2. License Grant, API Credentials &amp; Rate Limits</h2>
          <p className="max-w-4xl">
            Subject to continuous compliance with this Agreement and the payment of all applicable licensing fees, M&amp;F grants the Partner Institution a limited, non-exclusive, non-sublicensable, non-transferable, revocable license to query our core lending APIs and leverage our developer resources solely to automate underwriting, ledger audits, and loan disbursements.
          </p>
          <ul className="list-disc pl-5 mt-4 space-y-3 text-xs sm:text-sm text-[#3E4C59]">
            <li>
              <strong>Credential Protection:</strong> You must secure all administrative API keys and client secrets. Sharing production tokens across unaffiliated corporate bodies is strictly prohibited.
            </li>
            <li>
              <strong>System Limits:</strong> M&amp;F enforces strict rate limits based on your subscription tier (e.g. 500 requests per minute for sandbox, 5,000 for standard production). Automated script loops designed to bypass or stress test these limits without prior authorization will result in temporary credential suspension.
            </li>
            <li>
              <strong>Reverse Engineering:</strong> You agree not to decompile, reverse engineer, extract schema layouts, or attempt to derive the underlying source code of the M&amp;F lending engine.
            </li>
          </ul>
        </div>

        <div className="border-t border-[#9AA5B1]/20 pt-8">
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-4">3. Service Levels, Maintenance &amp; Uptime Guarantees</h2>
          <p className="max-w-4xl">
            M&amp;F guarantees an Operational Service Level Agreement (SLA) uptime of 99.99% for our core transaction databases and scoring weight tree engines. Operational status, latency indicators, and incident histories are published publicly on our Status Center.
          </p>
          <p className="mt-3 max-w-4xl">
            Scheduled maintenance windows are executed on Sundays between 02:00 AM and 04:00 AM UTC, with notice provided to administrator emails at least 72 hours prior. Emergency patches required to mitigate immediate security threats are executed as needed and logged post-implementation.
          </p>
        </div>

        <div className="border-t border-[#9AA5B1]/20 pt-8">
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-4">4. Intellectual Property &amp; Patent Reservation</h2>
          <p className="max-w-4xl">
            As between the parties, M&amp;F Technologies retains all rights, titles, and interests in and to all proprietary code, database schema configurations, OCR extraction parsing models, UI layout assets, machine learning weight trees, documentation, and trademark marks. No licenses or ownership rights are transferred under this agreement, save for the operational API queries explicitly described herein.
          </p>
        </div>

        <div className="border-t border-[#9AA5B1]/20 pt-8">
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-4">5. Disclaimer of Underwriting Responsibility &amp; Financial Liability</h2>
          <p className="max-w-4xl">
            M&amp;F Technologies is a software infrastructure vendor and does not operate as a licensed bank, deposit-taking institution, or microfinance lender. We design and deliver automated decision tools, analytical pipelines, and accounting ledgers based on configurations provided by the Client.
          </p>
          <p className="mt-3 font-bold text-[#1B222C]">
            THE FINAL DECISION TO APPROVE LOANS, DISBURSE FUNDS, ENFORCE INTEREST RATES, AND COLLECT REPAYMENTS REMAINS THE SOLE LEGAL, COMPLIANCE, AND OPERATIONAL RESPONSIBILITY OF THE CLIENT. M&amp;F SHALL NOT BE HELD LIABLE FOR LOAN DEFAULT RATES, CREDIT LOSSES, BALANCES INACCURACIES ARISING FROM CLIENT CONFIGURATION ERRORS, OR REGULATORY SANCTIONS IMPOSED UPON THE PARTNER INSTITUTION.
          </p>
        </div>

        <div className="border-t border-[#9AA5B1]/20 pt-8">
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-4">6. Indemnification &amp; Limitations of Liability</h2>
          <p className="max-w-4xl">
            Partner Institution agrees to indemnify, defend, and hold harmless M&amp;F Technologies and its officers, directors, and employees from and against any claims, losses, liabilities, damages, or regulatory penalties arising from unauthorized API usage, breach of resident data privacy laws, or third-party integrations.
          </p>
          <p className="mt-3 max-w-4xl">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL M&amp;F TECHNOLOGIES BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES (INCLUDING LOSS OF PROFITS, DATA CORRUPTION, OR SYSTEM DOWN-TIME), REGARDLESS OF THE LEGAL THEORY ADVANCED.
          </p>
        </div>

        <div className="border-t border-[#9AA5B1]/20 pt-8">
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-4">7. Termination, Data Export &amp; Off-Boarding</h2>
          <p className="max-w-4xl">
            Either party may terminate this agreement at any time upon 30 days written notice. In the event of partnership termination, the Partner Institution will lose all operational API query access. Upon request and subject to outstanding licensing invoices, M&amp;F will compile and export all historical borrower databases and ledger audit logs in standard CSV/JSON formats within 15 business days.
          </p>
        </div>

        <div className="border-t border-[#9AA5B1]/20 pt-8">
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-4">8. Governing Jurisdiction &amp; Dispute Resolution</h2>
          <p className="max-w-4xl">
            This Agreement, and all disputes arising out of or relating to it, shall be governed by and construed in accordance with international commercial law. Any disputes that cannot be settled amicably within 30 days shall be resolved through final and binding arbitration in accordance with standard international arbitration regulations.
          </p>
        </div>
      </section>
    </main>
  );
}
