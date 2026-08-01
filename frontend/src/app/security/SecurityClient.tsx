// src/app/security/SecurityClient.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Key, Server, FileCheck, Eye } from "lucide-react";

export function SecurityClient() {
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
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3E4C59]">
              Trust &amp; Compliance Center
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-[#1B222C] sm:text-4xl md:text-5xl">
            Bank-Grade Security Architecture
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#3E4C59] max-w-2xl leading-relaxed">
            M&amp;F Technologies builds institutional financial infrastructure engineered for zero-trust environments, rigorous auditing, and total data isolation.
          </p>
        </div>
      </section>

      {/* Security Pillars Grid */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Pillar 1 */}
          <div className="rounded-xl border border-[#9AA5B1]/25 bg-white p-6 sm:p-8">
            <div className="h-10 w-10 rounded-lg bg-[#F4F6F8] flex items-center justify-center text-[#1B222C] mb-5 border border-[#9AA5B1]/20">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-bold text-[#1B222C]">
              Encryption at Rest &amp; Transit
            </h2>
            <p className="mt-3 text-sm text-[#3E4C59] leading-relaxed">
              All borrower records, transaction payload data, and database ledgers are encrypted using AES-256-GCM at rest and TLS 1.3 in transit with strict HSTS enforcement.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="rounded-xl border border-[#9AA5B1]/25 bg-white p-6 sm:p-8">
            <div className="h-10 w-10 rounded-lg bg-[#F4F6F8] flex items-center justify-center text-[#1B222C] mb-5 border border-[#9AA5B1]/20">
              <FileCheck className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-bold text-[#1B222C]">
              Immutable Ledger Auditing
            </h2>
            <p className="mt-3 text-sm text-[#3E4C59] leading-relaxed">
              Every financial transaction is recorded via double-entry ledger mechanisms with cryptographic hashing, ensuring complete tamper-evident audit trails for regulatory compliance.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="rounded-xl border border-[#9AA5B1]/25 bg-white p-6 sm:p-8">
            <div className="h-10 w-10 rounded-lg bg-[#F4F6F8] flex items-center justify-center text-[#1B222C] mb-5 border border-[#9AA5B1]/20">
              <Key className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-bold text-[#1B222C]">
              Role-Based Access Control (RBAC)
            </h2>
            <p className="mt-3 text-sm text-[#3E4C59] leading-relaxed">
              Strict principle-of-least-privilege access controls with multi-tenant data partitioning prevent unauthorized internal or external cross-tenant access.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="rounded-xl border border-[#9AA5B1]/25 bg-white p-6 sm:p-8">
            <div className="h-10 w-10 rounded-lg bg-[#F4F6F8] flex items-center justify-center text-[#1B222C] mb-5 border border-[#9AA5B1]/20">
              <Server className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-bold text-[#1B222C]">
              Isolated Regional Environments
            </h2>
            <p className="mt-3 text-sm text-[#3E4C59] leading-relaxed">
              Supports localized database hosting and regional cloud VPC isolation to meet strict national central bank data sovereignty laws.
            </p>
          </div>
        </div>

        {/* Compliance Standards Footer Note */}
        <div className="mt-12 rounded-xl bg-[#1B222C] text-white p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9AA5B1]">
              SOC 2 Type II &amp; ISO 27001 Roadmap
            </span>
            <h3 className="text-xl font-bold mt-1">Continuous Security Monitoring</h3>
            <p className="text-sm text-[#9AA5B1] mt-2 max-w-xl">
              Our infrastructure undergoes continuous vulnerability scanning, automated dependency auditing, and annual third-party penetration testing.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#3E4C59]/50 border border-[#9AA5B1]/30 rounded-lg px-4 py-2 text-xs font-mono text-[#E4E7EB] shrink-0">
            <Eye className="h-4 w-4 text-emerald-400" />
            <span>Zero-Trust Active</span>
          </div>
        </div>
      </section>
    </main>
  );
}
