// src/app/security/SecurityClient.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Key, Server, FileCheck, Eye } from "lucide-react";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";

export function SecurityClient() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="bg-[#F4F6F8] border-b border-[#9AA5B1]/20">
        <div className="w-full px-4 py-12 sm:px-8 lg:px-12 sm:py-20">
          <Breadcrumbs items={[{ label: "Security & Compliance" }]} />

          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center text-[#1B222C] border border-[#9AA5B1]/20 shadow-sm">
              <ShieldCheck className="h-5 w-5 text-[#1B222C]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3E4C59]">
              Trust &amp; Compliance Center
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-[#1B222C] sm:text-4xl md:text-5xl leading-tight max-w-3xl">
            Institutional Trust &amp; Bank-Grade Security Architecture
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#3E4C59] max-w-3xl leading-relaxed">
            At M&amp;F Technologies, security is not an afterthought or an add-on layer—it is the foundational constraint under which all of our code, infrastructure configurations, and corporate policies are developed. We design and operate transactional infrastructure engineered for zero-trust environments, rigorous regulatory audits, and total multi-tenant isolation.
          </p>
        </div>
      </section>

      {/* Security Pillars Grid */}
      <section className="w-full px-4 py-16 sm:px-8 lg:px-12 sm:py-24">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B7684] mb-8">
          Core Infrastructure Controls &amp; Engineering Specifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Pillar 1 */}
          <div className="rounded-xl border border-[#9AA5B1]/25 bg-white p-6 sm:p-8 space-y-4">
            <div className="h-10 w-10 rounded-lg bg-[#F4F6F8] flex items-center justify-center text-[#1B222C] border border-[#9AA5B1]/20">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl font-bold text-[#1B222C]">
              Encryption Standards (At-Rest &amp; In-Transit)
            </h3>
            <p className="text-sm text-[#3E4C59] leading-relaxed">
              All client profiles, credit underwriting documents, database ledgers, and backup storage objects are encrypted using hardware-backed AES-256-GCM. Cryptographic keys are rotated automatically every 90 days via isolated Key Management Services (KMS). In-transit network payloads are encrypted using strict TLS 1.3 with Perfect Forward Secrecy (PFS), enforced through HTTP Strict Transport Security (HSTS) headers.
            </p>
            <p className="text-xs text-[#6B7684] leading-relaxed">
              * Details: RSA-4096 and ECDSA P-256 signatures are used for external API authorization tokens.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="rounded-xl border border-[#9AA5B1]/25 bg-white p-6 sm:p-8 space-y-4">
            <div className="h-10 w-10 rounded-lg bg-[#F4F6F8] flex items-center justify-center text-[#1B222C] border border-[#9AA5B1]/20">
              <FileCheck className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl font-bold text-[#1B222C]">
              Immutable Transaction Ledger
            </h3>
            <p className="text-sm text-[#3E4C59] leading-relaxed">
              To prevent financial balance drift and internal bad-actor manipulation, every account balance update, disbursement, and repayment is committed to our proprietary double-entry ledger database. Each ledger block contains a SHA-256 hash of the preceding block, generating a mathematically verifiable, tamper-evident audit log that complies with regulatory audit mandates.
            </p>
            <p className="text-xs text-[#6B7684] leading-relaxed">
              * Details: Supports point-in-time state recovery with real-time replication across independent hardware zones.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="rounded-xl border border-[#9AA5B1]/25 bg-white p-6 sm:p-8 space-y-4">
            <div className="h-10 w-10 rounded-lg bg-[#F4F6F8] flex items-center justify-center text-[#1B222C] border border-[#9AA5B1]/20">
              <Key className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl font-bold text-[#1B222C]">
              Granular Role-Based Access (RBAC)
            </h3>
            <p className="text-sm text-[#3E4C59] leading-relaxed">
              We enforce the principle of least privilege across all internal operating teams and external API consumers. System operations require multi-factor hardware tokens, and admin endpoints are locked down to secure virtual private clouds (VPC). Multi-tenant database schemas are separated at the logical and row levels, preventing any chance of cross-tenant information bleeding.
            </p>
            <p className="text-xs text-[#6B7684] leading-relaxed">
              * Details: System event trails are archived to read-only compliance storage that cannot be modified or deleted.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="rounded-xl border border-[#9AA5B1]/25 bg-white p-6 sm:p-8 space-y-4">
            <div className="h-10 w-10 rounded-lg bg-[#F4F6F8] flex items-center justify-center text-[#1B222C] border border-[#9AA5B1]/20">
              <Server className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl font-bold text-[#1B222C]">
              Isolated Regional Sovereign Hosting
            </h3>
            <p className="text-sm text-[#3E4C59] leading-relaxed">
              To assist partner banks in complying with localized central banking guidelines and data residency regulations, our application instances can be fully partitioned and deployed in specific regional data centers. This ensures that sensitive personal identification information (PII) and lending histories never leave regional jurisdictions.
            </p>
            <p className="text-xs text-[#6B7684] leading-relaxed">
              * Details: Active deployment targets available in North America, Europe, East Africa, and Southeast Asia.
            </p>
          </div>
        </div>

        {/* Detailed Operational Uptime */}
        <div className="mt-12 rounded-xl border border-[#9AA5B1]/20 bg-[#F4F6F8] p-8 sm:p-10 space-y-6">
          <h3 className="font-display text-2xl font-bold text-[#1B222C]">
            Incident Response &amp; Continuity Plans
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-[#3E4C59]">
            <div className="space-y-2">
              <h4 className="font-bold text-[#1B222C]">Vulnerability Management</h4>
              <p className="leading-relaxed text-xs">
                Automated continuous scanning of software source repositories and dependency libraries. Monthly clean container deployments prevent configuration drift.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-[#1B222C]">Disaster Recovery</h4>
              <p className="leading-relaxed text-xs">
                Database updates are replicated synchronously. We execute bi-annual recovery exercises to guarantee a Recovery Point Objective (RPO) under 2 minutes and a Recovery Time Objective (RTO) under 15 minutes.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-[#1B222C]">Third-Party Audits</h4>
              <p className="leading-relaxed text-xs">
                Annual external penetration tests are executed by accredited cybersecurity firms. Technical reports and findings can be shared with partner bank compliance committees under NDA.
              </p>
            </div>
          </div>
        </div>

        {/* Compliance Standards Footer Note */}
        <div className="mt-8 rounded-xl bg-[#1B222C] text-white p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9AA5B1]">
              SOC 2 Type II &amp; ISO 27001 Security Roadmap
            </span>
            <h3 className="text-xl font-bold mt-1">Continuous Security Monitoring</h3>
            <p className="text-sm text-[#9AA5B1] mt-2 max-w-xl">
              Our complete application network undergoes hourly vulnerability tracking, package updates, and continuous integration testing to guarantee security stability.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#3E4C59]/50 border border-[#9AA5B1]/30 rounded-lg px-4 py-2 text-xs font-mono text-[#E4E7EB] shrink-0">
            <Eye className="h-4 w-4 text-white" />
            <span>Zero-Trust Protocol Active</span>
          </div>
        </div>
      </section>
    </main>
  );
}
