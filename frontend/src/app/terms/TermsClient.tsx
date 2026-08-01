// src/app/terms/TermsClient.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";

export function TermsClient() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="bg-[#F4F6F8] border-b border-[#9AA5B1]/20">
        <div className="mx-0 max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3E4C59] hover:text-[#1B222C] transition-colors mb-6 sm:mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center text-[#1B222C] border border-[#9AA5B1]/20 shadow-sm">
              <Scale className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3E4C59]">
              Legal Terms &amp; Agreement
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-[#1B222C] sm:text-4xl md:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#6B7684]">
            Effective Date: July 31, 2026 &bull; Last Updated: July 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-0 max-w-6xl px-4 py-12 sm:px-6 sm:py-16 text-[#3E4C59] leading-relaxed space-y-8 text-sm sm:text-base">
        <div>
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-3">1. Acceptance of Terms</h2>
          <p className="max-w-3xl">
            By accessing or using the platforms, APIs, SDKs, or services provided by M&amp;F Technologies, you agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of a financial institution, you represent that you have legal authority to bind that entity.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-3">2. API Access &amp; Acceptable Use</h2>
          <p className="max-w-3xl">
            Partner institutions are granted a limited, non-exclusive, non-transferable license to access M&amp;F lending engine APIs. You agree not to reverse engineer, disrupt system rate limits, or perform unauthorized security scans against production infrastructure.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-3">3. Service Level Agreement (SLA)</h2>
          <p className="max-w-3xl">
            M&amp;F Technologies strives for 99.99% operational uptime across all core ledger and credit scoring services, backed by enterprise SLA guarantees for partner banks and licensed micro-lenders.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-3">4. Intellectual Property</h2>
          <p className="max-w-3xl">
            All proprietary algorithms, risk scoring models, API designs, software source code, and trademarks remain the exclusive intellectual property of M&amp;F Technologies.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-3">5. Limitation of Liability</h2>
          <p className="max-w-3xl">
            M&amp;F Technologies provides automated risk scoring tools and core lending infrastructure. Underwriting decisions and loan disbursements remain the sole legal responsibility of the partner institution.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-3">6. Governing Law</h2>
          <p className="max-w-3xl">
            These Terms are governed by and construed in accordance with international commercial law and applicable financial software regulatory statutes.
          </p>
        </div>
      </section>
    </main>
  );
}
