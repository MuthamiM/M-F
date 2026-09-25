// src/features/status/status.types.ts

export type ServiceHealthStatus = "operational" | "degraded" | "outage" | "maintenance";

export interface ServiceHealthItem {
  id: string;
  name: string;
  description: string;
  status: ServiceHealthStatus;
  uptime: string;
  latencyMs: number;
  category: "core" | "underwriting" | "ledger" | "gateway" | "security" | "infrastructure";
}

export interface SystemMetrics {
  uptimeSeconds: number;
  uptimeFormatted: string;
  memoryUsageMb: number;
  heapTotalMb: number;
  nodeVersion: string;
  activeRegions: string[];
  avgLatencyMs: number;
  totalRequestsHandled?: number;
}

export interface IncidentItem {
  id: string;
  date: string;
  title: string;
  description: string;
  status: "resolved" | "monitoring" | "investigating";
  duration: string;
  impact: "none" | "minor" | "major";
}

export interface PlatformStatusData {
  status: ServiceHealthStatus;
  message: string;
  timestamp: string;
  metrics: SystemMetrics;
  services: ServiceHealthItem[];
  incidents: IncidentItem[];
}
