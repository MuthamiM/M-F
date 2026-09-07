// src/app/status/StatusClient.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertTriangle, Clock, Activity, Server, Database, Globe2, Shield } from "lucide-react";
import { useEffect, useState } from "react";

interface ServiceStatus {
  name: string;
  description: string;
  status: "operational" | "degraded" | "maintenance";
  uptime: string;
  icon: React.ReactNode;
}

const SERVICES: ServiceStatus[] = [
  {
    name: "Core Lending API",
    description: "Primary REST and GraphQL endpoints for loan origination, servicing, and repayment processing.",
    status: "operational",
    uptime: "99.99%",
    icon: <Server className="h-4.5 w-4.5" />,
  },
  {
    name: "Credit Scoring Engine",
    description: "Risk decisioning weight trees, bureau data aggregation, and automated underwriting pipelines.",
    status: "operational",
    uptime: "99.98%",
    icon: <Activity className="h-4.5 w-4.5" />,
  },
  {
    name: "Transaction Ledger",
    description: "Double-entry journaling system with cryptographic block hashing for immutable audit trails.",
    status: "operational",
    uptime: "100%",
    icon: <Database className="h-4.5 w-4.5" />,
  },
  {
    name: "Mobile Wallet Gateway",
    description: "M-Pesa, Airtel Money, and partner mobile wallet disbursement and repayment channels.",
    status: "operational",
    uptime: "99.97%",
    icon: <Globe2 className="h-4.5 w-4.5" />,
  },
  {
    name: "Authentication & SSO",
    description: "Multi-factor authentication, hardware key support, and institutional single sign-on services.",
    status: "operational",
    uptime: "100%",
    icon: <Shield className="h-4.5 w-4.5" />,
  },
];

interface Incident {
  date: string;
  title: string;
  description: string;
  status: "resolved" | "monitoring";
  duration: string;
}

const RECENT_INCIDENTS: Incident[] = [
  {
    date: "August 28, 2026",
    title: "Scheduled Database Cluster Migration — East Africa Region",
    description: "Planned zero-downtime migration of primary PostgreSQL clusters to upgraded hardware. All services remained operational throughout the maintenance window. No transaction failures recorded.",
    status: "resolved",
    duration: "2h 15m",
  },
  {
    date: "August 14, 2026",
    title: "Elevated Latency on Credit Bureau Aggregation Endpoints",
    description: "Third-party bureau response times exceeded normal thresholds due to upstream provider maintenance. Automated fallback caching ensured continued service for partner institutions.",
    status: "resolved",
    duration: "45m",
  },
  {
    date: "July 30, 2026",
    title: "CDN Configuration Update for Static Asset Delivery",
    description: "Rolled out updated Cloudflare edge caching rules to improve first-byte-time for portal assets. Brief cache invalidation during deployment caused minor latency spikes.",
    status: "resolved",
    duration: "12m",
  },
];

function StatusBadge({ status }: { status: ServiceStatus["status"] }) {
  const config = {
    operational: { label: "Operational", color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
    degraded: { label: "Degraded", color: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
    maintenance: { label: "Maintenance", color: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${c.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

import { Breadcrumbs } from "@/shared/components/Breadcrumbs";

export function StatusClient() {
  const [lastChecked, setLastChecked] = useState("");

  useEffect(() => {
    setLastChecked(new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }));
  }, []);

  const allOperational = SERVICES.every((s) => s.status === "operational");

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-cloud border-b border-fog/20">
        <div className="w-full px-4 py-12 sm:px-8 lg:px-12 sm:py-20">
          <Breadcrumbs items={[{ label: "System Status" }]} />

          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center text-[#1B222C] border border-[#9AA5B1]/20 shadow-sm">
              <Activity className="h-5 w-5 text-[#1B222C]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3E4C59]">
              Platform Health Monitor
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold text-graphite sm:text-4xl md:text-5xl leading-tight">
            System Status
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate max-w-2xl leading-relaxed">
            Real-time operational status of M&amp;F Technologies infrastructure, APIs, and partner integration endpoints. Updated continuously via automated health checks.
          </p>

          {/* Overall Status Banner */}
          <div className={`mt-8 rounded-xl p-5 border ${allOperational ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
            <div className="flex items-center gap-3">
              {allOperational ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              )}
              <div>
                <div className={`text-sm font-bold ${allOperational ? "text-emerald-800" : "text-amber-800"}`}>
                  {allOperational ? "All Systems Operational" : "Some Systems Experiencing Issues"}
                </div>
                {lastChecked && (
                  <div className="text-xs text-slate mt-0.5">
                    Last checked: {lastChecked}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Status Table */}
      <section className="w-full px-4 py-16 sm:px-8 lg:px-12 sm:py-24 space-y-16">
        <div>
          <h2 className="font-display text-xl font-bold text-graphite sm:text-2xl mb-8">
            Service Health Overview
          </h2>

          <div className="space-y-4">
            {SERVICES.map((service) => (
              <div
                key={service.name}
                className="rounded-xl border border-[#9AA5B1]/20 bg-white p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="h-10 w-10 rounded-lg bg-cloud flex items-center justify-center text-[#3E4C59] border border-fog/10 shrink-0">
                  {service.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-bold text-graphite text-sm sm:text-base">{service.name}</h3>
                    <StatusBadge status={service.status} />
                  </div>
                  <p className="text-xs text-slate leading-relaxed mt-1">{service.description}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-lg font-bold font-mono text-graphite">{service.uptime}</div>
                  <div className="text-[10px] text-[#6B7684] font-semibold uppercase tracking-wider">30-day uptime</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Uptime Summary */}
        <div className="border-t border-[#9AA5B1]/20 pt-16">
          <h2 className="font-display text-xl font-bold text-graphite sm:text-2xl mb-6">
            Infrastructure Performance Summary
          </h2>
          <p className="text-sm text-slate leading-relaxed max-w-4xl mb-8">
            M&amp;F Technologies operates a multi-region, fault-tolerant infrastructure designed to ensure uninterrupted service for partner financial institutions. Our platform consistently achieves industry-leading availability targets backed by contractual SLA guarantees.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="border-l-2 border-[#1B222C] pl-4">
              <div className="text-2xl sm:text-3xl font-bold text-graphite font-mono">99.99%</div>
              <div className="text-[11px] font-semibold text-slate mt-1">Verified Uptime (90-Day)</div>
            </div>
            <div className="border-l-2 border-[#1B222C] pl-4">
              <div className="text-2xl sm:text-3xl font-bold text-graphite font-mono">&lt;95ms</div>
              <div className="text-[11px] font-semibold text-slate mt-1">P99 API Latency</div>
            </div>
            <div className="border-l-2 border-[#1B222C] pl-4">
              <div className="text-2xl sm:text-3xl font-bold text-graphite font-mono">0</div>
              <div className="text-[11px] font-semibold text-slate mt-1">Transaction Failures (90-Day)</div>
            </div>
            <div className="border-l-2 border-[#1B222C] pl-4">
              <div className="text-2xl sm:text-3xl font-bold text-graphite font-mono">3</div>
              <div className="text-[11px] font-semibold text-slate mt-1">Active Cloud Regions</div>
            </div>
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="border-t border-[#9AA5B1]/20 pt-16">
          <h2 className="font-display text-xl font-bold text-graphite sm:text-2xl mb-8">
            Recent Incident History
          </h2>

          <div className="space-y-6">
            {RECENT_INCIDENTS.map((incident, idx) => (
              <div key={idx} className="rounded-xl border border-[#9AA5B1]/20 bg-[#F8FAFC] p-6 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-[#6B7684]" />
                    <span className="text-xs text-[#6B7684] font-medium">{incident.date}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    incident.status === "resolved"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}>
                    {incident.status} • {incident.duration}
                  </span>
                </div>
                <h3 className="font-bold text-graphite text-sm">{incident.title}</h3>
                <p className="text-xs text-slate leading-relaxed">{incident.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SLA Information */}
        <div className="rounded-xl bg-[#1B222C] text-white p-8 sm:p-10 space-y-4">
          <h3 className="text-lg sm:text-xl font-bold">Enterprise SLA Guarantees</h3>
          <p className="text-xs sm:text-sm text-[#9AA5B1] leading-relaxed max-w-3xl">
            All partner institutions are covered under a contractual 99.99% uptime SLA with defined remediation timelines. Our operations team maintains 24/7 monitoring with automated alerting via PagerDuty and internal telemetry dashboards. For SLA-related inquiries, contact <span className="font-mono text-white font-semibold">info@mftechnologies.org</span>.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/security"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 border border-white/20 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-all"
            >
              Security & Compliance
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-[#1B222C] hover:bg-[#E4E7EB] transition-all"
            >
              Contact Operations Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
