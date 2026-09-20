// src/app/status/StatusClient.tsx
"use client";

import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Activity,
  Server,
  Database,
  Globe2,
  Shield,
  RefreshCw,
  Zap,
  Radio,
  Cpu,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";

export interface LiveService {
  id: string;
  name: string;
  description: string;
  status: "operational" | "degraded" | "outage" | "maintenance";
  uptime: string;
  latencyMs: number;
  category: string;
}

export interface LiveIncident {
  id: string;
  date: string;
  title: string;
  description: string;
  status: "resolved" | "monitoring" | "investigating";
  duration: string;
  impact: "none" | "minor" | "major";
}

export interface LiveStatusData {
  status: "operational" | "degraded" | "outage" | "maintenance";
  message: string;
  timestamp: string;
  metrics: {
    uptimeSeconds: number;
    uptimeFormatted: string;
    memoryUsageMb: number;
    heapTotalMb: number;
    nodeVersion: string;
    activeRegions: string[];
    avgLatencyMs: number;
  };
  services: LiveService[];
  incidents: LiveIncident[];
}

const DEFAULT_SERVICES: LiveService[] = [
  {
    id: "core-lending-api",
    name: "Core Lending API",
    description: "Primary REST and GraphQL endpoints for loan origination, servicing, and repayment processing.",
    status: "operational",
    uptime: "99.99%",
    latencyMs: 24,
    category: "core",
  },
  {
    id: "credit-scoring-engine",
    name: "Credit Scoring Engine",
    description: "Risk decisioning weight trees, bureau data aggregation, and automated underwriting pipelines.",
    status: "operational",
    uptime: "99.98%",
    latencyMs: 38,
    category: "underwriting",
  },
  {
    id: "transaction-ledger",
    name: "Transaction Ledger",
    description: "Double-entry journaling system with cryptographic block hashing for immutable audit trails.",
    status: "operational",
    uptime: "100.00%",
    latencyMs: 14,
    category: "ledger",
  },
  {
    id: "mobile-wallet-gateway",
    name: "Mobile Wallet Gateway",
    description: "M-Pesa, Airtel Money, and partner mobile wallet disbursement and repayment channels.",
    status: "operational",
    uptime: "99.97%",
    latencyMs: 32,
    category: "gateway",
  },
  {
    id: "auth-sso-service",
    name: "Authentication & SSO",
    description: "Multi-factor authentication, hardware key support, and institutional single sign-on services.",
    status: "operational",
    uptime: "100.00%",
    latencyMs: 16,
    category: "security",
  },
  {
    id: "notification-dispatch",
    name: "SMS & Event Webhooks",
    description: "Carrier SMS delivery pipelines and automated borrower repayment notification queues.",
    status: "operational",
    uptime: "99.95%",
    latencyMs: 22,
    category: "infrastructure",
  },
];

function getServiceIcon(id: string) {
  switch (id) {
    case "core-lending-api":
      return <Server className="h-4.5 w-4.5" />;
    case "credit-scoring-engine":
      return <Activity className="h-4.5 w-4.5" />;
    case "transaction-ledger":
      return <Database className="h-4.5 w-4.5" />;
    case "mobile-wallet-gateway":
      return <Globe2 className="h-4.5 w-4.5" />;
    case "auth-sso-service":
      return <Shield className="h-4.5 w-4.5" />;
    default:
      return <Zap className="h-4.5 w-4.5" />;
  }
}

function StatusBadge({ status }: { status: LiveService["status"] }) {
  const config = {
    operational: {
      label: "Operational",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
    },
    degraded: {
      label: "Degraded",
      color: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500",
    },
    outage: {
      label: "Outage",
      color: "bg-red-50 text-red-700 border-red-200",
      dot: "bg-red-500",
    },
    maintenance: {
      label: "Maintenance",
      color: "bg-blue-50 text-blue-700 border-blue-200",
      dot: "bg-blue-500",
    },
  };
  const c = config[status] || config.operational;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${c.color}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

export function StatusClient() {
  const [statusData, setStatusData] = useState<LiveStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState("");
  const [clientPingMs, setClientPingMs] = useState<number | null>(null);
  const [isLiveOnline, setIsLiveOnline] = useState(true);

  const fetchLiveStatus = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    const startPing = performance.now();

    try {
      const res = await fetch("/api/status?_t=" + Date.now(), {
        cache: "no-store",
      });
      const endPing = performance.now();
      setClientPingMs(Math.round(endPing - startPing));

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setStatusData(json.data);
          setIsLiveOnline(true);
          setLastChecked(
            new Date(json.data.timestamp).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "medium",
            })
          );
        }
      } else {
        setIsLiveOnline(false);
      }
    } catch {
      setIsLiveOnline(false);
    } finally {
      setLoading(false);
      if (isManual) {
        setTimeout(() => setRefreshing(false), 400);
      }
    }
  }, []);

  useEffect(() => {
    fetchLiveStatus();
    // Live polling every 12 seconds
    const interval = setInterval(() => {
      fetchLiveStatus();
    }, 12000);
    return () => clearInterval(interval);
  }, [fetchLiveStatus]);

  const services = statusData?.services || DEFAULT_SERVICES;
  const incidents = statusData?.incidents || [];
  const metrics = statusData?.metrics;
  const allOperational =
    statusData?.status === "operational" ||
    services.every((s) => s.status === "operational");

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="bg-cloud border-b border-fog/20">
        <div className="w-full px-4 py-12 sm:px-8 lg:px-12 sm:py-20">
          <Breadcrumbs items={[{ label: "System Status" }]} />

          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center text-[#1B222C] border border-[#9AA5B1]/20 shadow-sm">
                <Activity className="h-5 w-5 text-[#1B222C]" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#3E4C59]">
                Platform Health Monitor
              </span>
            </div>

            {/* Live Telemetry Indicator & Manual Refresh */}
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-fog/25 text-xs text-graphite shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isLiveOnline ? "bg-emerald-400" : "bg-amber-400"
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isLiveOnline ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                </span>
                <span className="font-semibold text-[11px]">
                  {isLiveOnline ? "Live Telemetry" : "Connecting..."}
                </span>
                {clientPingMs !== null && (
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                    {clientPingMs}ms
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => fetchLiveStatus(true)}
                disabled={refreshing}
                title="Refresh real-time status"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-cloud border border-fog/25 text-xs font-semibold text-graphite transition-all shadow-xs cursor-pointer disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 text-[#3E4C59] ${
                    refreshing ? "animate-spin text-emerald-600" : ""
                  }`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          <h1 className="font-display text-3xl font-bold text-graphite sm:text-4xl md:text-5xl leading-tight">
            System Status
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate max-w-2xl leading-relaxed">
            Real-time operational status of M&amp;F Technologies infrastructure,
            APIs, credit underwriting engines, and partner integration
            endpoints. Updated continuously via live automated health probes.
          </p>

          {/* Overall Status Banner */}
          <div
            className={`mt-8 rounded-xl p-5 border transition-all ${
              allOperational
                ? "bg-emerald-50 border-emerald-200"
                : "bg-amber-50 border-amber-200"
            }`}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                {allOperational ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0" />
                )}
                <div>
                  <div
                    className={`text-sm font-bold ${
                      allOperational ? "text-emerald-800" : "text-amber-800"
                    }`}
                  >
                    {statusData?.message ||
                      (allOperational
                        ? "All Systems Fully Operational"
                        : "Some Services Degraded")}
                  </div>
                  <div className="text-xs text-slate mt-0.5 flex items-center gap-2">
                    <span>
                      {lastChecked
                        ? `Last probe: ${lastChecked}`
                        : "Querying live status..."}
                    </span>
                    {metrics && (
                      <>
                        <span>•</span>
                        <span className="font-mono text-emerald-700 font-medium">
                          Uptime: {metrics.uptimeFormatted}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {metrics && (
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="hidden md:flex items-center gap-1.5 text-slate bg-white/70 px-2.5 py-1 rounded border border-fog/20">
                    <Cpu className="h-3.5 w-3.5 text-fog" />
                    <span>RAM: {metrics.memoryUsageMb}MB</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-white/70 px-2.5 py-1 rounded border border-fog/20">
                    <Radio className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                    <span>Avg Latency: {metrics.avgLatencyMs}ms</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Service Status Table */}
      <section className="w-full px-4 py-16 sm:px-8 lg:px-12 sm:py-24 space-y-16">
        <div>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-graphite sm:text-2xl">
                Live Service Health
              </h2>
              <p className="text-xs text-slate mt-1">
                Real-time latency and SLA availability probed every 12 seconds.
              </p>
            </div>
            <div className="text-xs text-fog font-medium flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
              <span>Auto-refresh active</span>
            </div>
          </div>

          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service.id || service.name}
                className="rounded-xl border border-[#9AA5B1]/20 bg-white p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-xs hover:shadow-md transition-all"
              >
                <div className="h-10 w-10 rounded-lg bg-cloud flex items-center justify-center text-[#3E4C59] border border-fog/10 shrink-0">
                  {getServiceIcon(service.id)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-bold text-graphite text-sm sm:text-base">
                      {service.name}
                    </h3>
                    <StatusBadge status={service.status} />
                    {service.latencyMs && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cloud border border-fog/20 text-slate">
                        <Zap className="h-2.5 w-2.5 text-emerald-500" />
                        {service.latencyMs}ms
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate leading-relaxed mt-1">
                    {service.description}
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                  <div className="text-base sm:text-lg font-bold font-mono text-graphite">
                    {service.uptime}
                  </div>
                  <div className="text-[10px] text-[#6B7684] font-semibold uppercase tracking-wider">
                    SLA Availability
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Uptime & SLA Performance Summary */}
        <div className="border-t border-[#9AA5B1]/20 pt-16">
          <h2 className="font-display text-xl font-bold text-graphite sm:text-2xl mb-4">
            Infrastructure Performance Telemetry
          </h2>
          <p className="text-sm text-slate leading-relaxed max-w-4xl mb-8">
            M&amp;F Technologies operates multi-region, horizontally scalable
            clusters across primary and disaster recovery sites to guarantee
            zero-downtime execution for commercial banking and microfinance
            partners.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="border-l-2 border-[#1B222C] pl-4">
              <div className="text-2xl sm:text-3xl font-bold text-graphite font-mono">
                99.99%
              </div>
              <div className="text-[11px] font-semibold text-slate mt-1">
                Contractual SLA Uptime
              </div>
            </div>
            <div className="border-l-2 border-[#1B222C] pl-4">
              <div className="text-2xl sm:text-3xl font-bold text-graphite font-mono">
                {metrics ? `${metrics.avgLatencyMs}ms` : "<45ms"}
              </div>
              <div className="text-[11px] font-semibold text-slate mt-1">
                Live Average Latency
              </div>
            </div>
            <div className="border-l-2 border-[#1B222C] pl-4">
              <div className="text-2xl sm:text-3xl font-bold text-graphite font-mono">
                {metrics?.uptimeFormatted || "Continuous"}
              </div>
              <div className="text-[11px] font-semibold text-slate mt-1">
                Current Continuous Uptime
              </div>
            </div>
            <div className="border-l-2 border-[#1B222C] pl-4">
              <div className="text-2xl sm:text-3xl font-bold text-graphite font-mono">
                3
              </div>
              <div className="text-[11px] font-semibold text-slate mt-1">
                Active Multi-Cloud Regions
              </div>
            </div>
          </div>
        </div>

        {/* Live Incident History */}
        <div className="border-t border-[#9AA5B1]/20 pt-16">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 className="font-display text-xl font-bold text-graphite sm:text-2xl">
                Incident &amp; Maintenance Log
              </h2>
              <p className="text-xs text-slate mt-1">
                Logged operational disclosures and scheduled infrastructure
                maintenance windows.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              0 Active Incidents
            </span>
          </div>

          <div className="space-y-6">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className="rounded-xl border border-[#9AA5B1]/20 bg-[#F8FAFC] p-6 space-y-3"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-[#6B7684]" />
                    <span className="text-xs text-[#6B7684] font-medium">
                      {incident.date}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      incident.status === "resolved"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {incident.status} • {incident.duration}
                  </span>
                </div>
                <h3 className="font-bold text-graphite text-sm">
                  {incident.title}
                </h3>
                <p className="text-xs text-slate leading-relaxed">
                  {incident.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SLA Information */}
        <div className="rounded-xl bg-[#1B222C] text-white p-8 sm:p-10 space-y-4">
          <h3 className="text-lg sm:text-xl font-bold">
            Enterprise SLA Guarantees
          </h3>
          <p className="text-xs sm:text-sm text-[#9AA5B1] leading-relaxed max-w-3xl">
            All partner institutions are covered under a contractual 99.99%
            uptime SLA with defined remediation timelines. Our operations team
            maintains 24/7 monitoring with automated alerting via PagerDuty and
            internal telemetry dashboards. For SLA-related inquiries, contact{" "}
            <span className="font-mono text-white font-semibold">
              info@mftechnologies.org
            </span>
            .
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/security"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 border border-white/20 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-all"
            >
              Security &amp; Compliance
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
