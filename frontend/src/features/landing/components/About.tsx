// src/features/landing/components/About.tsx
"use client";

import { Shield, Cpu, Zap, Activity } from "lucide-react";

export function About() {
  const stats = [
    { value: "$1B+", label: "Processed Disbursements" },
    { value: "99.99%", label: "Uptime SLA Guarantee" },
    { value: "<200ms", label: "Average API Latency" },
    { value: "SOC 2", label: "Compliance Pathway" },
  ];

  return (
    <section id="about" className="bg-cloud py-16 px-4 sm:py-24 sm:px-6">
      <div className="mx-0 max-w-6xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate border border-slate/30 px-3 py-1 rounded-full">
              Who We Are
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-graphite sm:text-4xl md:text-5xl">
              Institutional-grade financial infrastructure
            </h2>
            <p className="mt-4 sm:mt-6 text-sm sm:text-base leading-relaxed text-slate">
              M&F Technologies designs, builds, and maintains custom lending systems, credit scoring platforms, and portal interfaces for banks, credit unions, and fintech leaders worldwide. 
            </p>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-slate">
              We focus on speed, security, and scalability, ensuring your core systems are compliant, performant, and ready to support institutional credit growth.
            </p>

            <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-4 sm:gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className="border-l-2 border-slate pl-3 sm:pl-4">
                  <div className="text-2xl sm:text-3xl font-bold text-graphite">{stat.value}</div>
                  <div className="text-[11px] sm:text-xs font-medium text-slate mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="rounded-lg bg-white p-5 sm:p-6 shadow-sm border border-fog/20">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-md bg-cloud flex items-center justify-center text-graphite mb-3 sm:mb-4">
                <Shield className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </div>
              <h3 className="font-semibold text-graphite text-base sm:text-lg">Bank-Grade Security</h3>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate">
                AES-256 encryption at rest, TLS 1.3 in transit, and role-based access control built-in from day one.
              </p>
            </div>

            <div className="rounded-lg bg-white p-5 sm:p-6 shadow-sm border border-fog/20">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-md bg-cloud flex items-center justify-center text-graphite mb-3 sm:mb-4">
                <Cpu className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </div>
              <h3 className="font-semibold text-graphite text-base sm:text-lg">Robust Ledger</h3>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate">
                Double-entry transaction ledger matching strict accounting guidelines and supporting full historical audits.
              </p>
            </div>

            <div className="rounded-lg bg-white p-5 sm:p-6 shadow-sm border border-fog/20">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-md bg-cloud flex items-center justify-center text-graphite mb-3 sm:mb-4">
                <Zap className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </div>
              <h3 className="font-semibold text-graphite text-base sm:text-lg">Automation First</h3>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate">
                Automated KYC/KYB parsing, financial statement OCR, and instant credit underwriting weight trees.
              </p>
            </div>

            <div className="rounded-lg bg-white p-5 sm:p-6 shadow-sm border border-fog/20">
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-md bg-cloud flex items-center justify-center text-graphite mb-3 sm:mb-4">
                <Activity className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
              </div>
              <h3 className="font-semibold text-graphite text-base sm:text-lg">API Centric</h3>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate">
                Connect core systems to payment gateways, credit bureaus, and external partners seamlessly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
