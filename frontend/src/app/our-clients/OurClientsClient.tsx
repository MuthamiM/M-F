// src/app/our-clients/OurClientsClient.tsx
"use client";

import { Nav } from "@/features/landing/components/Nav";
import { Footer } from "@/features/landing/components/Footer";
import { ScrollAnimate } from "@/shared/components/ScrollAnimate";
import { Building2, ShieldCheck, Award, Users, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ClientSegment {
  category: string;
  description: string;
  clients: {
    name: string;
    location: string;
    details: string;
    impact: string;
  }[];
}

const CLIENT_SEGMENTS: ClientSegment[] = [
  {
    category: "Commercial & Retail Banks",
    description: "Tier-1 and Tier-2 financial institutions leveraging our core lending and scoring infrastructure to digitize retail portfolios.",
    clients: [
      {
        name: "Apex International Bank",
        location: "Nairobi, Kenya",
        details: "Full core lending stack migration, enabling automated loan processing for over 1.2 million retail accounts.",
        impact: "74% reduction in approval times & 18% lower default rates."
      },
      {
        name: "Equatorial United Bank",
        location: "Kampala, Uganda",
        details: "Risk scoring engine integration for mobile micro-loan portfolio, processing up to 45,000 queries per hour.",
        impact: "Zero downtime during peak month-end transaction spikes."
      },
      {
        name: "Horizon Merchant Alliance",
        location: "Dar es Salaam, Tanzania",
        details: "Structured syndications ledger for commercial asset-backed financing programs.",
        impact: "Auditable double-entry accounting ledger across multiple lenders."
      }
    ]
  },
  {
    category: "Credit Unions & SACCOs",
    description: "Community-focused institutions utilizing our portals and automated queues to offer local member loans.",
    clients: [
      {
        name: "Metro-Alliance Credit Cooperative",
        location: "Kigali, Rwanda",
        details: "Member portal deployment facilitating self-service loan applications and digital document upload zones.",
        impact: "Over 85,000 members onboarded, completely eliminating paper files."
      },
      {
        name: "Pioneer Teachers SACCO",
        location: "Nairobi, Kenya",
        details: "Collections queue automation and automated recovery SMS/email dispatch system.",
        impact: "Delinquency recovery rates improved by 31% in first quarter."
      }
    ]
  },
  {
    category: "Microfinance Institutions",
    description: "High-volume, rapid-disbursal micro-lenders powered by our mobile offline-first field agent applications.",
    clients: [
      {
        name: "Sunrise Micro-Finance Group",
        location: "Mombasa, Kenya",
        details: "KYC capture and offline-first mobile app deployment for field loan officers in rural areas.",
        impact: "Field officer efficiency increased by 60% with instant offline synchronization."
      },
      {
        name: "Unity Impact Fund",
        location: "Juba, South Sudan",
        details: "Auto-decision underwriting tree for agribusiness and micro-lending products.",
        impact: "Over $14M disbursed to smallholders with real-time risk telemetry."
      }
    ]
  }
];

export function OurClientsClient() {
  return (
    <div className="min-h-screen bg-white text-[#1B222C] flex flex-col w-full px-0">
      <Nav />

      {/* Hero Banner Section */}
      <section className="w-full bg-[#F4F6F8] border-b border-[#9AA5B1]/20 py-20 sm:py-24">
        <div className="w-full px-4 sm:px-8 lg:px-12">
          <ScrollAnimate delay={0.1}>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#3E4C59] bg-[#E4E7EB] px-2.5 py-1 rounded">
              Institutional Partners
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-[#1B222C] sm:text-5xl md:text-6xl">
              Trusted by Leading Financial Institutions
            </h1>
            <p className="mt-6 text-sm sm:text-base leading-relaxed text-[#3E4C59] max-w-3xl">
              From commercial retail banks to regional credit unions and high-volume microfinance institutions, M&amp;F Technologies provides the secure, bank-grade infrastructure that drives modern digital lending across East Africa.
            </p>
          </ScrollAnimate>
        </div>
      </section>

      {/* Trust Metrics Section */}
      <section className="w-full py-12 sm:py-16 border-b border-[#9AA5B1]/20">
        <div className="w-full px-4 sm:px-8 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-3">
            <Building2 className="h-10 w-10 text-[#3E4C59] shrink-0" />
            <div>
              <div className="text-xl font-bold text-[#1B222C]">40+</div>
              <div className="text-xs text-[#6B7684]">Institutions Deployed</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-10 w-10 text-[#3E4C59] shrink-0" />
            <div>
              <div className="text-xl font-bold text-[#1B222C]">2.5M+</div>
              <div className="text-xs text-[#6B7684]">End Borrowers Serviced</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-10 w-10 text-[#3E4C59] shrink-0" />
            <div>
              <div className="text-xl font-bold text-[#1B222C]">$480M+</div>
              <div className="text-xs text-[#6B7684]">Transaction Volume Audited</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Award className="h-10 w-10 text-[#3E4C59] shrink-0" />
            <div>
              <div className="text-xl font-bold text-[#1B222C]">99.99%</div>
              <div className="text-xs text-[#6B7684]">System Uptime SLA met</div>
            </div>
          </div>
        </div>
      </section>

      {/* Segments and Case Studies grid */}
      <section className="w-full py-20 sm:py-28 flex-1">
        <div className="w-full px-4 sm:px-8 lg:px-12 space-y-20">
          {CLIENT_SEGMENTS.map((segment, idx) => (
            <ScrollAnimate key={segment.category} delay={idx * 0.1}>
              <div className="border-b border-[#9AA5B1]/10 pb-6 mb-8">
                <h2 className="font-display text-2xl font-bold text-[#1B222C] sm:text-3xl">
                  {segment.category}
                </h2>
                <p className="mt-2 text-sm text-[#3E4C59] max-w-2xl">
                  {segment.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {segment.clients.map((client) => (
                  <div
                    key={client.name}
                    className="p-6 rounded-xl border border-[#9AA5B1]/20 bg-white hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm sm:text-base text-[#1B222C]">
                          {client.name}
                        </h3>
                        <span className="text-[10px] text-[#6B7684] bg-[#F4F6F8] px-2 py-0.5 rounded border border-[#9AA5B1]/10">
                          {client.location}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#3E4C59] leading-relaxed">
                        {client.details}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#9AA5B1]/10 flex items-start gap-2 text-xs">
                      <CheckCircle2 className="h-4.5 w-4.5 text-[#3E4C59] shrink-0 mt-0.5" />
                      <span className="text-[#1B222C] font-medium leading-normal">
                        <strong>Impact:</strong> {client.impact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollAnimate>
          ))}

          {/* Call to Action CTA */}
          <ScrollAnimate delay={0.2} className="w-full">
            <div className="w-full rounded-2xl border border-[#9AA5B1]/30 bg-[#F4F6F8] p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 mt-12">
              <div className="space-y-2 max-w-2xl">
                <h3 className="font-display font-bold text-xl sm:text-2xl text-[#1B222C]">
                  Ready to upgrade your lending infrastructure?
                </h3>
                <p className="text-xs sm:text-sm text-[#3E4C59]">
                  Book a direct architectural review and technical consulting session with our engineering integration team to map out your credit workflows.
                </p>
              </div>
              <Link
                href="/request-demo"
                className="inline-flex items-center gap-1.5 rounded bg-[#3E4C59] text-white hover:bg-[#6B7684] px-6 py-3 text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-sm"
              >
                <span>Request Core Systems Demo</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollAnimate>
        </div>
      </section>

      <Footer />
    </div>
  );
}
