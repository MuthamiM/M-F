"use client";

import { useState } from "react";

interface Service {
  title: string;
  desc: string;
  details: string;
}

const SERVICES: Service[] = [
  { 
    title: "Core Lending Systems", 
    desc: "Loan origination, servicing, and lifecycle management.",
    details: "Our core lending engine handles the entire loan lifecycle from initial application and underwriting to disbursal, interest calculation, servicing, and final maturity. Built on a double-entry ledger database schema, it guarantees absolute transactional integrity, real-time auditability, and flawless integration with general ledgers."
  },
  { 
    title: "Credit Scoring Platforms", 
    desc: "Configurable models for risk-based decisioning.",
    details: "An advanced decision engine that aggregates data from traditional credit bureaus, alternative payment networks, and custom telemetry data. Operators can define configurable risk scoring weight trees, rule matrices, and cutoff thresholds to automate instant-approvals or flag high-risk accounts for manual underwriting."
  },
  { 
    title: "Collections Management", 
    desc: "Workflow-driven recovery and delinquency handling.",
    details: "Delinquency tracking system designed to optimize recovery rates. Automatically segments overdue accounts by risk tier, triggers automated reminders via SMS, email, and automated dialers, and manages agent queues with workflow escalation from soft collections to legal recovery."
  },
  { 
    title: "Web Portals", 
    desc: "Client and borrower-facing portals, built on your API.",
    details: "Responsive web portals for borrowers and credit brokers. Features include real-time application trackers, secure document upload zones, self-service loan modifications, payment scheduling (cards/mobile money), and instant balance lookups."
  },
  { 
    title: "Mobile Apps", 
    desc: "Native and cross-platform apps for borrowers and staff.",
    details: "Secure Android and iOS applications built for high performance and offline operations. Empowers field agents to capture KYC/KYB data on the ground, and provides borrowers with push notifications, wallet management, and biometrically secured micro-lending access."
  },
  { 
    title: "CRM", 
    desc: "Relationship and pipeline management for your lending team.",
    details: "A pipeline manager tailored for credit institutions. Tracks borrower communications, manages sales officer tasks, maps conversion rates across campaigns, and features pre-built integrations with phone systems and helpdesks."
  },
  { 
    title: "Document Management", 
    desc: "Secure storage, e-signature, and audit trails.",
    details: "Secure, encrypted cloud storage complying with data privacy regulations. Includes integrated OCR parsing for automated ID/statement reading, version tracking, e-signature signing flows, and immutable access audit logging."
  },
  { 
    title: "Workflow Automation", 
    desc: "Remove manual steps from underwriting and servicing.",
    details: "Eliminates operational bottlenecks by automating routine verification tasks. Automate AML/PEP watchlist checks, trigger income verification checks via bank APIs, and automatically route high-value files to senior credit committees."
  },
  { 
    title: "API Development & Integration", 
    desc: "Connect core systems to bureaus, payments, and partners.",
    details: "Standardized, highly secured JSON REST and GraphQL APIs. Facilitates seamless connection of your lending stack to external ecosystem nodes including payment networks, third-party underwriting services, and corporate enterprise systems."
  },
  { 
    title: "Cloud Hosting & Support", 
    desc: "Managed infrastructure with defined uptime SLAs.",
    details: "High-availability hosting platforms set up on premium cloud infrastructure (AWS/Azure) under a 99.99% uptime SLA. Features isolated database pools, continuous automated backups, and 24/7 security monitoring."
  },
  { 
    title: "System Maintenance & Training", 
    desc: "Ongoing support and team onboarding.",
    details: "Comprehensive training and enablement programs for your IT and risk officers. Ongoing support covers emergency patches, security updates, feature requests, and dedicated Slack/Teams response lines."
  },
];

export function Services() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <section id="services" className="px-6 py-20 bg-white">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-3xl font-bold text-graphite">
          What we build
        </h2>
        <p className="text-center text-slate mt-2 max-w-lg mx-auto text-sm">
          Click any service card to view technical implementation details and capabilities.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <button
              key={service.title}
              onClick={() => setSelectedService(service)}
              className="text-left block w-full rounded-lg border border-fog/40 bg-white p-6 transition-all hover:shadow-md hover:border-slate cursor-pointer focus:outline-none focus:ring-2 focus:ring-graphite focus:ring-offset-2"
            >
              <h3 className="font-semibold text-graphite text-lg flex items-center justify-between">
                <span>{service.title}</span>
                <span className="text-silver text-xs font-normal border border-silver/30 px-2 py-0.5 rounded-full group-hover:bg-cloud">
                  Read more
                </span>
              </h3>
              <p className="mt-2 text-sm text-slate">{service.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Modal Detail Overlay */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-graphite/60 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-white rounded-lg p-6 shadow-xl border border-fog/20 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-2xl font-bold text-graphite leading-snug">
              {selectedService.title}
            </h3>
            <p className="text-silver text-sm font-medium mt-1">
              {selectedService.desc}
            </p>
            <div className="mt-4 border-t border-fog/20 pt-4 text-slate text-sm leading-relaxed">
              {selectedService.details}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedService(null)}
                className="px-4 py-2 text-sm font-semibold text-white bg-graphite hover:bg-slate rounded-md cursor-pointer transition-colors focus:outline-none"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
