// src/features/landing/components/About.tsx
"use client";

import { Shield, Cpu, Zap, Activity } from "lucide-react";
import { ScrollAnimate } from "@/shared/components/ScrollAnimate";

export function About() {
  const stats = [
    { value: "$1.4B+", label: "Processed Disbursements & Repayments" },
    { value: "99.995%", label: "Verified Production Uptime SLA" },
    { value: "<180ms", label: "P99 Core API Endpoint Latency" },
    { value: "SOC 2 Type II", label: "Active Security Audit Path" },
  ];

  return (
    <section id="about" className="bg-cloud py-20 px-4 sm:py-28 sm:px-8 lg:px-12 overflow-hidden">
      <div className="w-full">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          <ScrollAnimate delay={0.1}>
            <div className="space-y-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate border border-slate/30 px-3 py-1 rounded-full bg-white">
                Institutional Core Profile
              </span>
              <h2 className="font-display text-3xl font-bold tracking-tight text-graphite sm:text-4xl md:text-5xl leading-tight">
                Engineered for High-Volume Institutional Credit Operations
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-slate">
                M&amp;F Technologies develops, integrates, and operates high-performance financial systems for global banking institutions, credit unions, and micro-lending platforms. We bridges the gap between legacy core systems and modern digital interfaces by deploying microservice-driven transaction engines, automated credit scoring, and ultra-secure middleware.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-slate">
                Our architecture is built from the ground up to prevent balance drift, ensure transaction consistency under heavy load, and comply automatically with financial regulations. Through unified APIs, we empower credit providers to automate underwriting pipelines, ingest rich credit bureau payloads, and disperse funds instantly.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-slate">
                By maintaining strict compliance pathways and real-time monitoring interfaces, we ensure that risk managers and compliance officers have total visibility into loan portfolios, audit histories, and overall platform health at any given millisecond.
              </p>

              <div className="pt-6 grid grid-cols-2 gap-6 border-t border-[#9AA5B1]/20">
                {stats.map((stat, idx) => (
                  <div key={idx} className="border-l-2 border-[#1B222C] pl-4">
                    <div className="text-2xl sm:text-3xl font-bold text-graphite font-mono tracking-tight">{stat.value}</div>
                    <div className="text-[11px] sm:text-xs font-semibold text-slate mt-1.5 leading-snug">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimate>

          <ScrollAnimate delay={0.2}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-xl bg-white p-6 sm:p-8 shadow-sm border border-[#9AA5B1]/20 hover:shadow-md transition-all duration-300">
                <div className="h-11 w-11 rounded-lg bg-cloud flex items-center justify-center text-graphite mb-5 border border-[#9AA5B1]/10">
                  <Shield className="h-5 w-5 text-[#1B222C]" />
                </div>
                <h3 className="font-bold text-graphite text-base sm:text-lg">Bank-Grade Security</h3>
                <p className="mt-2.5 text-xs sm:text-sm text-slate leading-relaxed">
                  Strict AES-256-GCM encryption for all stored records, TLS 1.3 encryption for data in transit, multi-factor hardware keys, and fine-grained role-based access controls (RBAC) enforced across all database tenants.
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 sm:p-8 shadow-sm border border-[#9AA5B1]/20 hover:shadow-md transition-all duration-300">
                <div className="h-11 w-11 rounded-lg bg-cloud flex items-center justify-center text-graphite mb-5 border border-[#9AA5B1]/10">
                  <Cpu className="h-5 w-5 text-[#3E4C59]" />
                </div>
                <h3 className="font-bold text-graphite text-base sm:text-lg">Double-Entry Ledger</h3>
                <p className="mt-2.5 text-xs sm:text-sm text-slate leading-relaxed">
                  A high-throughput, transactionally consistent ledger system that enforces strict double-entry accounting. Features cryptographic block hashing to guarantee ledger immutability and complete historical auditability.
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 sm:p-8 shadow-sm border border-[#9AA5B1]/20 hover:shadow-md transition-all duration-300">
                <div className="h-11 w-11 rounded-lg bg-cloud flex items-center justify-center text-graphite mb-5 border border-[#9AA5B1]/10">
                  <Zap className="h-5 w-5 text-[#6B7684]" />
                </div>
                <h3 className="font-bold text-graphite text-base sm:text-lg">Automated Underwriting</h3>
                <p className="mt-2.5 text-xs sm:text-sm text-slate leading-relaxed">
                  Execute risk scoring matrices in milliseconds. Features automated parser modules for KYC/KYB document verification, financial statement OCR extraction, and multi-bureau telemetry consolidation.
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 sm:p-8 shadow-sm border border-[#9AA5B1]/20 hover:shadow-md transition-all duration-300">
                <div className="h-11 w-11 rounded-lg bg-cloud flex items-center justify-center text-graphite mb-5 border border-[#9AA5B1]/10">
                  <Activity className="h-5 w-5 text-[#9AA5B1]" />
                </div>
                <h3 className="font-bold text-graphite text-base sm:text-lg">Unified Core API</h3>
                <p className="mt-2.5 text-xs sm:text-sm text-slate leading-relaxed">
                  Seamlessly bridge mobile transaction apps, external payment gateways, central bank settlement networks, and national identification databases using modern, rate-limited REST and GraphQL endpoints.
                </p>
              </div>
            </div>
          </ScrollAnimate>
        </div>
      </div>
    </section>
  );
}
