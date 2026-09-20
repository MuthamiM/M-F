// src/app/services/page.tsx
import Link from "next/link";
import { ArrowRight, Cpu, Layers, ShieldCheck, Zap, Server, Activity, Database, CheckCircle2 } from "lucide-react";
import { SERVICES } from "@/features/landing/data/services";
import { Nav } from "@/features/landing/components/Nav";
import { Footer } from "@/features/landing/components/Footer";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";

export const metadata = {
  title: "Services & Platform Architecture — M&F Technologies",
  description:
    "Explore M&F Technologies' 10 institutional lending technology modules: Core Lending Systems, Credit Scoring Platforms, Collections Management, Web Portals, Mobile Apps, CRM, Document Management, Workflow Automation, API Development, and Cloud Hosting.",
};

export default function ServicesIndexPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-cloud border-b border-fog/20">
          <div className="w-full px-4 py-12 sm:px-8 lg:px-12 sm:py-20">
            <Breadcrumbs items={[{ label: "Services" }]} />

            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center text-[#1B222C] border border-[#9AA5B1]/20 shadow-sm">
                <Layers className="h-5 w-5 text-[#1B222C]" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#3E4C59]">
                Platform Architecture
              </span>
            </div>

            <h1 className="font-display text-3xl font-bold text-graphite sm:text-4xl md:text-5xl leading-tight max-w-4xl">
              Enterprise Lending Infrastructure Modules
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate max-w-3xl leading-relaxed">
              M&amp;F Technologies provides an integrated suite of 10 modular, institutional-grade lending technology systems. Deploy the entire end-to-end stack or integrate targeted microservices into your existing core banking architecture via secure REST and GraphQL APIs.
            </p>

            {/* Architecture Highlights */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
              <div className="rounded-lg bg-white border border-[#9AA5B1]/20 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-graphite">
                  <Database className="h-4 w-4 text-[#1B222C]" />
                  <span>Double-Entry</span>
                </div>
                <p className="text-[11px] text-slate mt-1">Zero balance drift transactional ledger</p>
              </div>
              <div className="rounded-lg bg-white border border-[#9AA5B1]/20 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-graphite">
                  <Zap className="h-4 w-4 text-[#1B222C]" />
                  <span>&lt;100ms Latency</span>
                </div>
                <p className="text-[11px] text-slate mt-1">Real-time mobile wallet disbursements</p>
              </div>
              <div className="rounded-lg bg-white border border-[#9AA5B1]/20 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-graphite">
                  <ShieldCheck className="h-4 w-4 text-[#1B222C]" />
                  <span>SOC 2 Type II</span>
                </div>
                <p className="text-[11px] text-slate mt-1">AES-256-GCM &amp; TLS 1.3 encryption</p>
              </div>
              <div className="rounded-lg bg-white border border-[#9AA5B1]/20 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-graphite">
                  <Server className="h-4 w-4 text-[#1B222C]" />
                  <span>99.99% Uptime</span>
                </div>
                <p className="text-[11px] text-slate mt-1">Multi-region active-active clusters</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="w-full px-4 py-16 sm:px-8 lg:px-12 sm:py-24">
          <div className="max-w-7xl mx-auto space-y-12">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B7684]">
                Available Technology Modules
              </h2>
              <p className="text-2xl sm:text-3xl font-display font-bold text-graphite mt-2">
                Engineered for High-Volume Credit Operations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {SERVICES.map((service, index) => (
                <div
                  key={service.slug}
                  className="rounded-xl border border-[#9AA5B1]/25 bg-white p-6 sm:p-8 flex flex-col justify-between hover:border-[#1B222C] hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-semibold text-[#6B7684]">
                        Module {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#F4F6F8] px-2.5 py-0.5 text-[11px] font-semibold text-[#1B222C] border border-[#9AA5B1]/20">
                        {service.techStack[0]}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-display font-bold text-graphite group-hover:text-[#3E4C59] transition-colors">
                      {service.title}
                    </h3>

                    <p className="text-sm font-semibold text-[#3E4C59]">
                      {service.desc}
                    </p>

                    <p className="text-xs sm:text-sm text-slate leading-relaxed">
                      {service.details}
                    </p>

                    {/* Deliverables */}
                    <div className="pt-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7684] mb-2">
                        Key Capabilities:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {service.deliverables.map((item, dIdx) => (
                          <span
                            key={dIdx}
                            className="inline-flex items-center gap-1 rounded bg-[#F8FAFC] border border-[#9AA5B1]/20 px-2 py-1 text-[11px] text-[#3E4C59]"
                          >
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tech Stack Chips */}
                    <div className="pt-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B7684] mb-2">
                        Supported Technologies:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {service.techStack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="rounded bg-[#1B222C]/5 px-2 py-0.5 text-[10px] font-mono font-medium text-[#1B222C]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="pt-6 mt-6 border-t border-[#9AA5B1]/20">
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center justify-between w-full text-xs font-bold text-[#1B222C] group-hover:text-[#3E4C59] transition-colors"
                    >
                      <span>View Detailed Technical Specifications</span>
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Architecture Ecosystem Section */}
            <div className="rounded-2xl border border-[#9AA5B1]/25 bg-[#F8FAFC] p-8 sm:p-12 space-y-8">
              <div className="max-w-3xl space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B7684]">
                  Ecosystem Integration
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-graphite">
                  How Our Platform Modules Interconnect
                </h3>
                <p className="text-sm text-slate leading-relaxed">
                  Every M&amp;F Technologies module adheres to open, predictable API contracts. Data flows seamlessly from consumer application portals through automated credit scoring matrices, commits atomically to our double-entry ledger, and synchronizes with regional mobile wallet and banking networks in sub-second cycles.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="rounded-xl bg-white border border-[#9AA5B1]/20 p-5 space-y-2">
                  <div className="text-xs font-bold text-[#1B222C]">1. Origination &amp; KYC</div>
                  <p className="text-xs text-slate">
                    Web portals, mobile apps, and OCR document verification modules capture borrower data and validate identity credentials in seconds.
                  </p>
                </div>

                <div className="rounded-xl bg-white border border-[#9AA5B1]/20 p-5 space-y-2">
                  <div className="text-xs font-bold text-[#1B222C]">2. Automated Underwriting</div>
                  <p className="text-xs text-slate">
                    Decision weight trees evaluate alternative wallet transactions, bureau feeds, and debt-to-income models to return approval parameters in under 150ms.
                  </p>
                </div>

                <div className="rounded-xl bg-white border border-[#9AA5B1]/20 p-5 space-y-2">
                  <div className="text-xs font-bold text-[#1B222C]">3. Double-Entry Disbursal</div>
                  <p className="text-xs text-slate">
                    Transactions are debited and credited with cryptographic SHA-256 block journals, triggering instant mobile money disbursement callbacks.
                  </p>
                </div>

                <div className="rounded-xl bg-white border border-[#9AA5B1]/20 p-5 space-y-2">
                  <div className="text-xs font-bold text-[#1B222C]">4. Servicing &amp; Recovery</div>
                  <p className="text-xs text-slate">
                    Automated SMS/email collections queues, interest reconciliation, and central bank compliance reporting keep operations fully audit-ready.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="rounded-xl bg-[#1B222C] text-white p-8 sm:p-12 text-center space-y-4 max-w-4xl mx-auto">
              <h3 className="text-xl sm:text-2xl font-bold font-display">
                Ready to Upgrade Your Lending Infrastructure?
              </h3>
              <p className="text-xs sm:text-sm text-[#9AA5B1] leading-relaxed max-w-xl mx-auto">
                Schedule an architectural deep dive with our engineering team to review integration specifications, sandbox environments, and SLA guarantees.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link
                  href="/request-demo"
                  className="rounded-lg bg-white px-6 py-3 text-xs font-bold text-[#1B222C] hover:bg-[#E4E7EB] transition-all shadow-sm"
                >
                  Schedule Technical Demo
                </Link>
                <Link
                  href="/contact"
                  className="rounded-lg border border-white/30 px-6 py-3 text-xs font-bold text-white hover:bg-white/10 transition-all"
                >
                  Contact Engineering Team
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
