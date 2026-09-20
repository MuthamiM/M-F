// src/app/careers/CareersClient.tsx
"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  Briefcase,
  Mail,
  Terminal,
  Coins,
  Globe,
  Heart,
  Shield,
  Cpu,
  MapPin,
  Clock,
  Building2,
  CheckCircle2,
  Sparkles,
  Share2,
  Check,
  Code2,
  ChevronDown,
  ChevronUp,
  X,
  Send,
  FileText,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { IsometricDevice } from "@/features/landing/components/IsometricDevice";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import { apiFetch, ApiError } from "@/shared/lib/apiClient";

interface ApplicationForm {
  name: string;
  email: string;
  phone: string;
  experience: string;
  portfolio: string;
  coverNote: string;
  website: string; // Honeypot
}

const initialFormState: ApplicationForm = {
  name: "",
  email: "",
  phone: "",
  experience: "2-4 years",
  portfolio: "",
  coverNote: "",
  website: "",
};

export function CareersClient() {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [form, setForm] = useState<ApplicationForm>(initialFormState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = useCallback(() => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  }, []);

  const handleInputChange = (
    field: keyof ApplicationForm,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.website) return; // Honeypot triggered

    setStatus("submitting");
    setErrorMsg(null);

    if (!form.name.trim() || !form.email.trim() || !form.coverNote.trim()) {
      setErrorMsg("Please provide your full name, email, and a brief cover note.");
      setStatus("error");
      return;
    }

    try {
      const messageContent = [
        "JOB APPLICATION: Software Developer (Onsite)",
        `Candidate: ${form.name.trim()}`,
        `Email: ${form.email.trim()}`,
        `Phone: ${form.phone.trim() || "Not provided"}`,
        `Experience: ${form.experience}`,
        `Portfolio/LinkedIn/GitHub: ${form.portfolio.trim() || "Not provided"}`,
        "",
        "--- Cover Note & Pitch ---",
        form.coverNote.trim(),
      ].join("\n");

      await apiFetch("/api/contact", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          company: "Job Application: Software Developer (Onsite)",
          message: messageContent,
        }),
      });

      setStatus("success");
      setForm(initialFormState);
    } catch (err) {
      setErrorMsg(
        err instanceof ApiError
          ? err.message
          : "Unable to submit your application right now. Please email us directly at info@mftechnologies.org."
      );
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-cloud border-b border-fog/20 relative overflow-hidden">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 items-center gap-8 px-4 py-12 sm:px-8 lg:px-12 sm:py-20">
          {/* Left side text */}
          <div className="space-y-4">
            <Breadcrumbs items={[{ label: "Careers" }]} />

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              We Are Hiring — Onsite in Nairobi
            </div>

            <h1 className="font-display text-3xl font-bold tracking-tight text-graphite sm:text-4xl md:text-5xl animate-fade-in-up">
              Join M&amp;F Technologies
            </h1>
            <p
              className="mt-4 text-base sm:text-lg text-slate max-w-xl leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              We design, build, and scale high-performance banking infrastructure, credit scoring
              frameworks, and secure transactional middleware that process billions in micro-lending
              disbursements worldwide.
            </p>
          </div>

          {/* Right side illustration */}
          <div
            className="relative flex justify-center lg:justify-end animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="max-w-[280px] sm:max-w-[360px] md:max-w-md w-full">
              <IsometricDevice />
            </div>
          </div>
        </div>
      </section>

      {/* Main Careers Content */}
      <section className="w-full px-4 py-16 sm:px-8 lg:px-12 sm:py-24 space-y-20">
        {/* Culture & Operations */}
        <div className="space-y-6 max-w-4xl">
          <h2 className="font-display text-2xl font-bold text-graphite sm:text-3xl">
            Our Mission &amp; Engineering Culture
          </h2>
          <p className="text-sm sm:text-base text-slate leading-relaxed">
            At M&amp;F Technologies, we believe that access to credit is a fundamental pillar of
            economic growth and social mobility. By replacing slow, error-prone legacy underwriting
            pipelines with automated microservices and secure database systems, we help financial
            institutions serve millions of underbanked individuals across emerging markets.
          </p>
          <p className="text-sm sm:text-base text-slate leading-relaxed">
            We operate as a high-velocity engineering collective of system architects, database
            specialists, security auditors, and financial product thinkers. We care deeply about
            clean code, performance testing (our API response latency SLAs are sub-200ms), automated
            test suites, and strict mathematical ledger validation. If you enjoy solving hard backend
            coordination challenges, optimizing PostgreSQL databases, and designing resilient API
            contracts, you will fit right in.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="border-t border-fog/20 pt-16 space-y-8">
          <h3 className="font-display text-xl font-bold text-graphite sm:text-2xl text-center">
            Why Build Your Career at M&amp;F?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-xl border border-fog/30 bg-cloud p-6 flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center text-graphite shadow-sm border border-fog/10">
                <Terminal className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-graphite text-sm sm:text-base">Modern Tech Stack</h4>
              <p className="text-xs text-slate leading-relaxed">
                We build with Next.js, Node.js, TypeScript, PostgreSQL, Docker, and Kubernetes. We run
                clean migrations, strict lint rules, and automated CI/CD pipelines.
              </p>
            </div>
            <div className="rounded-xl border border-fog/30 bg-cloud p-6 flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center text-graphite shadow-sm border border-fog/10">
                <Coins className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-graphite text-sm sm:text-base">
                Global Financial Impact
              </h4>
              <p className="text-xs text-slate leading-relaxed">
                Our code processes disbursements for real commercial banks and regional lending
                platforms. Your work directly affects the efficiency of small-business lending
                systems.
              </p>
            </div>
            <div className="rounded-xl border border-fog/30 bg-cloud p-6 flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center text-graphite shadow-sm border border-fog/10">
                <Building2 className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-graphite text-sm sm:text-base font-semibold">
                Collaborative Onsite Hub
              </h4>
              <p className="text-xs text-slate leading-relaxed">
                Work from our modern engineering headquarters at The Pavilion in Westlands, Nairobi.
                Equipped with ergonomic stations, high-speed fiber, and collaborative whiteboard spaces.
              </p>
            </div>
          </div>
        </div>

        {/* Active Openings Section */}
        <div id="openings" className="border-t border-fog/20 pt-16 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                1 Active Position
              </div>
              <h3 className="font-display text-xl font-bold text-graphite sm:text-2xl">
                Active Job Openings
              </h3>
              <p className="text-sm text-slate mt-1 max-w-2xl leading-relaxed">
                We are actively recruiting passionate software developers to join our core engineering
                team onsite in Nairobi.
              </p>
            </div>

            <button
              onClick={handleShare}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate hover:text-graphite px-3 py-2 rounded-lg border border-fog/30 hover:border-fog transition-colors self-start sm:self-auto"
            >
              {copiedShare ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share Position</span>
                </>
              )}
            </button>
          </div>

          {/* Featured Role: Software Developer (Onsite) */}
          <div className="border border-fog/30 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Role Header Banner */}
            <div className="p-6 sm:p-8 border-b border-fog/20 bg-cloud/40">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#1B222C] text-white text-xs font-bold uppercase tracking-wider">
                      <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                      Onsite Role
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-fog/30 text-graphite text-xs font-medium">
                      <Clock className="h-3 w-3 text-slate" />
                      Full-Time
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-fog/30 text-graphite text-xs font-medium">
                      <MapPin className="h-3 w-3 text-slate" />
                      Westlands, Nairobi, Kenya
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-fog/30 text-graphite text-xs font-medium">
                      <Cpu className="h-3 w-3 text-slate" />
                      Engineering Department
                    </span>
                  </div>

                  <h4 className="font-display text-2xl font-bold text-graphite tracking-tight sm:text-3xl">
                    Software Developer (Full-Stack &amp; Core Systems)
                  </h4>

                  <p className="text-xs sm:text-sm text-slate max-w-3xl leading-relaxed">
                    Join our core engineering team onsite at our Nairobi headquarters. You will architect,
                    scale, and maintain mission-critical lending microservices, real-time double-entry
                    ledgers, and secure transactional payment integrations used by commercial banks and
                    microfinance institutions across Africa.
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setIsApplyModalOpen(true);
                      setStatus("idle");
                      setErrorMsg(null);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1B222C] hover:bg-[#3E4C59] px-6 py-3 text-xs font-semibold text-white transition-all shadow-sm hover:shadow active:scale-[0.99]"
                  >
                    <Send className="h-4 w-4" />
                    Apply for this Role
                  </button>

                  <a
                    href="mailto:info@mftechnologies.org?subject=Application%20-%20Software%20Developer%20(Onsite)%20Role&body=Dear%20M%26F%20Technologies%20Hiring%20Team%2C%0A%0AI%20am%20writing%20to%20apply%20for%20the%20Software%20Developer%20(Onsite)%20position%20at%20your%20Nairobi%20Hub.%0A%0AName%3A%20%0APhone%3A%20%0ALinkedIn%2FGitHub%3A%20%0AYears%20of%20Experience%3A%20%0A%0AAttached%20is%20my%20resume.%20Looking%20forward%20to%20hearing%20from%20you."
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-fog/40 bg-white hover:bg-cloud px-5 py-2.5 text-xs font-medium text-graphite transition-colors text-center"
                  >
                    <Mail className="h-3.5 w-3.5 text-slate" />
                    Apply via Email
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Specs Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-cloud/20 border-b border-fog/20 text-xs">
              <div>
                <span className="text-slate block text-[11px] uppercase tracking-wider font-semibold">
                  Location
                </span>
                <span className="font-bold text-graphite mt-0.5 block">
                  Onsite (The Pavilion, 4th Fl, Westlands)
                </span>
              </div>
              <div>
                <span className="text-slate block text-[11px] uppercase tracking-wider font-semibold">
                  Core Technologies
                </span>
                <span className="font-bold text-graphite mt-0.5 block">
                  TypeScript, Node.js, Next.js, PostgreSQL
                </span>
              </div>
              <div>
                <span className="text-slate block text-[11px] uppercase tracking-wider font-semibold">
                  Experience Level
                </span>
                <span className="font-bold text-graphite mt-0.5 block">
                  Mid to Senior Level (2+ Years)
                </span>
              </div>
              <div>
                <span className="text-slate block text-[11px] uppercase tracking-wider font-semibold">
                  Compensation
                </span>
                <span className="font-bold text-graphite mt-0.5 block">
                  Competitive + Benefits + Bonuses
                </span>
              </div>
            </div>

            {/* Collapsible Details Trigger */}
            <div className="px-6 sm:px-8 py-3 bg-white border-b border-fog/20 flex items-center justify-between">
              <span className="text-xs font-semibold text-graphite uppercase tracking-wider">
                Full Role Specification &amp; Responsibilities
              </span>
              <button
                type="button"
                onClick={() => setIsDetailsExpanded((prev) => !prev)}
                className="inline-flex items-center gap-1.5 text-xs text-slate hover:text-graphite font-medium py-1 px-2 rounded hover:bg-cloud transition-colors"
              >
                <span>{isDetailsExpanded ? "Hide Details" : "View Full Details"}</span>
                {isDetailsExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Expanded Role Details */}
            {isDetailsExpanded && (
              <div className="p-6 sm:p-8 space-y-8 text-sm text-slate animate-fade-in">
                {/* About the Role */}
                <div className="space-y-3">
                  <h5 className="font-bold text-graphite text-base flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-[#3E4C59]" />
                    About The Role
                  </h5>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    As a Software Developer at M&amp;F Technologies, you will be an integral member of
                    our onsite engineering team based in Westlands, Nairobi. You will directly
                    contribute to our core banking platforms, double-entry financial accounting ledgers,
                    and automated credit decision engines. This is a hands-on role where you will design
                    clean APIs, write maintainable TypeScript code, optimize PostgreSQL queries, and
                    collaborate directly with product leads and security auditors.
                  </p>
                </div>

                {/* Key Responsibilities */}
                <div className="space-y-3">
                  <h5 className="font-bold text-graphite text-base flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Key Responsibilities
                  </h5>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
                    <li className="flex items-start gap-2.5 p-3 rounded-lg bg-cloud/50 border border-fog/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-graphite mt-2 shrink-0" />
                      <span>
                        <strong className="text-graphite">Microservice Development:</strong> Design,
                        build, and scale reliable backend microservices with Node.js and TypeScript
                        capable of sub-200ms latency.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5 p-3 rounded-lg bg-cloud/50 border border-fog/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-graphite mt-2 shrink-0" />
                      <span>
                        <strong className="text-graphite">Double-Entry Financial Ledgers:</strong>{" "}
                        Implement strict mathematical ledger invariants, transaction atomicity (ACID),
                        and automated month-end reconciliation.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5 p-3 rounded-lg bg-cloud/50 border border-fog/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-graphite mt-2 shrink-0" />
                      <span>
                        <strong className="text-graphite">Payment Gateway Integrations:</strong> Integrate
                        and monitor regional payment rails including M-Pesa Daraja (C2B, B2C, Express
                        STK), PesaLink, RTGS, and CRB scoring feeds.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5 p-3 rounded-lg bg-cloud/50 border border-fog/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-graphite mt-2 shrink-0" />
                      <span>
                        <strong className="text-graphite">Modern Web Interfaces:</strong> Develop fast,
                        responsive borrower web portals and admin management dashboards using Next.js,
                        React, and modern Tailwind CSS.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5 p-3 rounded-lg bg-cloud/50 border border-fog/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-graphite mt-2 shrink-0" />
                      <span>
                        <strong className="text-graphite">Onsite Collaboration:</strong> Participate in
                        daily agile standups, whiteboard architectural reviews, and pair-programming
                        sessions at our Westlands office.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5 p-3 rounded-lg bg-cloud/50 border border-fog/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-graphite mt-2 shrink-0" />
                      <span>
                        <strong className="text-graphite">Security &amp; SOC 2 Compliance:</strong> Maintain
                        comprehensive automated test suites, execute zero-downtime database migrations, and
                        uphold strict cryptographic hygiene.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* What We Are Looking For */}
                <div className="space-y-3">
                  <h5 className="font-bold text-graphite text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#3E4C59]" />
                    Requirements &amp; Qualifications
                  </h5>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>
                        <strong className="text-graphite">Experience:</strong> 2+ years of production
                        software engineering experience building backend systems and modern web
                        applications.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>
                        <strong className="text-graphite">Proficient Tech Stack:</strong> Strong
                        demonstrated proficiency with TypeScript, Node.js, React, and Next.js.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>
                        <strong className="text-graphite">Relational Databases:</strong> Solid
                        understanding of PostgreSQL, schema normalization, ACID transactions, and index
                        optimization.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>
                        <strong className="text-graphite">API &amp; Systems Architecture:</strong> Deep
                        knowledge of RESTful API design, authentication protocols (JWT, RBAC), and
                        asynchronous queue processing.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>
                        <strong className="text-graphite">DevOps Literacy:</strong> Familiarity with Docker,
                        Git workflows, Linux environments, and CI/CD pipelines.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>
                        <strong className="text-graphite">Onsite Availability:</strong> Willingness and
                        legal authorization to work full-time onsite at our office at The Pavilion,
                        Westlands, Nairobi, Kenya.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Nice to Have */}
                <div className="space-y-2 bg-[#F8FAFC] border border-[#9AA5B1]/20 rounded-xl p-5">
                  <h6 className="font-bold text-graphite text-xs sm:text-sm">Nice to Have:</h6>
                  <p className="text-xs text-slate leading-relaxed">
                    Prior experience in FinTech, microfinance, banking platforms, or mobile money integrations
                    (e.g., Safaricom Daraja API). Experience with Redis caching, event-driven queues, or
                    Kubernetes is an added advantage.
                  </p>
                </div>

                {/* Onsite Benefits */}
                <div className="space-y-3">
                  <h5 className="font-bold text-graphite text-base flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    What We Offer (Onsite Benefits)
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 rounded-lg border border-fog/20 bg-white shadow-xs">
                      <div className="font-semibold text-graphite">Competitive Compensation</div>
                      <div className="text-slate mt-1 text-[11px]">
                        Market-leading salary benchmarked against regional tech standards + performance bonuses.
                      </div>
                    </div>
                    <div className="p-3.5 rounded-lg border border-fog/20 bg-white shadow-xs">
                      <div className="font-semibold text-graphite">Comprehensive Healthcare</div>
                      <div className="text-slate mt-1 text-[11px]">
                        Full inpatient &amp; outpatient medical cover for you and your dependents.
                      </div>
                    </div>
                    <div className="p-3.5 rounded-lg border border-fog/20 bg-white shadow-xs">
                      <div className="font-semibold text-graphite">Premium Workspace</div>
                      <div className="text-slate mt-1 text-[11px]">
                        Dual external 4K monitors, high-performance developer machines, and ergonomic chairs.
                      </div>
                    </div>
                    <div className="p-3.5 rounded-lg border border-fog/20 bg-white shadow-xs">
                      <div className="font-semibold text-graphite">Catered Lunches &amp; Coffee</div>
                      <div className="text-slate mt-1 text-[11px]">
                        Daily catered nutritious lunch, premium espresso bar, and healthy snacks.
                      </div>
                    </div>
                    <div className="p-3.5 rounded-lg border border-fog/20 bg-white shadow-xs">
                      <div className="font-semibold text-graphite">Learning Stipend</div>
                      <div className="text-slate mt-1 text-[11px]">
                        Annual educational allowance for engineering certifications, courses, and tech conferences.
                      </div>
                    </div>
                    <div className="p-3.5 rounded-lg border border-fog/20 bg-white shadow-xs">
                      <div className="font-semibold text-graphite">High-Scale Impact</div>
                      <div className="text-slate mt-1 text-[11px]">
                        Your code handles critical disbursements for commercial banks and credit unions across East Africa.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Card */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-fog/20">
                  <div className="text-xs text-slate">
                    Questions about this role? Email our talent team at{" "}
                    <a
                      href="mailto:info@mftechnologies.org"
                      className="text-graphite font-semibold underline underline-offset-2"
                    >
                      info@mftechnologies.org
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsApplyModalOpen(true);
                      setStatus("idle");
                      setErrorMsg(null);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#1B222C] hover:bg-[#3E4C59] px-6 py-2.5 text-xs font-semibold text-white transition-colors shadow-sm w-full sm:w-auto justify-center"
                  >
                    <Send className="h-4 w-4" />
                    Submit Application
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Future Opportunities & Core Disciplines */}
        <div className="border-t border-fog/20 pt-16 space-y-8">
          <div>
            <h3 className="font-display text-xl font-bold text-graphite sm:text-2xl">
              Future Opportunities &amp; Core Disciplines
            </h3>
            <p className="text-sm text-slate mt-2 max-w-2xl leading-relaxed">
              We are always on the lookout for talented engineers and specialists across our other core
              disciplines:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-[#9AA5B1]/20 rounded-xl p-6 bg-[#F8FAFC] space-y-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-4.5 w-4.5 text-[#3E4C59]" />
                <h4 className="font-bold text-graphite text-sm sm:text-base">
                  Backend &amp; Ledger Systems Engineer
                </h4>
              </div>
              <p className="text-xs text-slate leading-relaxed">
                Responsible for maintaining the double-entry accounting engine, scaling database
                replication, securing microservice middleware, and optimizing transaction consistency
                models. Proficient in Node.js, SQL, and distributed system architectures.
              </p>
            </div>

            <div className="border border-[#9AA5B1]/20 rounded-xl p-6 bg-[#F8FAFC] space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4.5 w-4.5 text-[#3E4C59]" />
                <h4 className="font-bold text-graphite text-sm sm:text-base">
                  Infrastructure Security Specialist
                </h4>
              </div>
              <p className="text-xs text-slate leading-relaxed">
                Coordinates our SOC 2 auditing pipelines, vulnerability tracking, key rotation routines,
                network isolation rules, and hardware MFA setups. Strong understanding of cloud IAM, VPC
                firewalls, and cryptographic practices.
              </p>
            </div>
          </div>
        </div>

        {/* General Application & Future Roles */}
        <div className="border-t border-fog/20 pt-16 flex flex-col items-center text-center space-y-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cloud border border-fog/20">
            <Heart className="h-6 w-6 text-slate" />
          </div>

          <div className="space-y-2">
            <h3 className="font-display text-xl font-bold text-graphite sm:text-2xl">
              Don&apos;t See the Right Fit?
            </h3>
            <p className="max-w-md text-xs sm:text-sm text-slate leading-relaxed">
              If you are an exceptional engineer passionate about lending technology but don&apos;t see
              an open role that matches your profile, you can still submit a general application.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2">
            <a
              href="mailto:info@mftechnologies.org?subject=General%20Application%20for%20Future%20Roles"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1B222C] hover:bg-[#3E4C59] px-6 py-3 text-xs font-semibold text-white transition-colors w-full sm:w-auto shadow-sm"
            >
              <Mail className="h-4 w-4 text-white" />
              Submit General Resume
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-fog/40 bg-white px-6 py-3 text-xs font-semibold text-graphite hover:bg-cloud transition-colors w-full sm:w-auto"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Application Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-graphite/60 backdrop-blur-xs animate-fade-in">
          <div
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-fog/30 overflow-hidden max-h-[92vh] flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-fog/20 bg-cloud flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Onsite Position &bull; Nairobi Hub
                </div>
                <h4 className="font-display text-lg sm:text-xl font-bold text-graphite">
                  Apply: Software Developer (Onsite)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="h-8 w-8 rounded-full bg-white border border-fog/30 flex items-center justify-center text-slate hover:text-graphite transition-colors"
                aria-label="Close application modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              {status === "success" ? (
                <div className="text-center py-8 space-y-4">
                  <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h5 className="font-display text-xl font-bold text-graphite">
                    Application Received!
                  </h5>
                  <p className="text-xs sm:text-sm text-slate max-w-md mx-auto leading-relaxed">
                    Thank you for applying for the <strong className="text-graphite">Software Developer (Onsite)</strong> role. Our engineering hiring team reviews all submissions and will reach out to schedule an onsite interview if your profile matches our requirements.
                  </p>
                  <div className="p-4 rounded-xl bg-cloud border border-fog/20 text-xs text-slate space-y-1">
                    <p className="font-semibold text-graphite">What happens next?</p>
                    <p>1. Technical profile review by our engineering leads.</p>
                    <p>2. Introduction call &amp; architecture walkthrough.</p>
                    <p>3. Onsite technical interview at The Pavilion, Westlands.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsApplyModalOpen(false);
                      setStatus("idle");
                    }}
                    className="inline-flex items-center justify-center rounded-xl bg-[#1B222C] hover:bg-[#3E4C59] px-6 py-2.5 text-xs font-semibold text-white transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplicationSubmit} className="space-y-4">
                  {/* Honeypot field */}
                  <input
                    type="text"
                    name="website"
                    value={form.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-graphite block">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="e.g. Jane Doe"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-fog/40 text-xs text-graphite focus:outline-hidden focus:ring-2 focus:ring-[#1B222C] bg-white transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-graphite block">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="jane@example.com"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-fog/40 text-xs text-graphite focus:outline-hidden focus:ring-2 focus:ring-[#1B222C] bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-graphite block">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+254 700 000 000"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-fog/40 text-xs text-graphite focus:outline-hidden focus:ring-2 focus:ring-[#1B222C] bg-white transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-graphite block">
                        Experience Level
                      </label>
                      <select
                        value={form.experience}
                        onChange={(e) => handleInputChange("experience", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-fog/40 text-xs text-graphite focus:outline-hidden focus:ring-2 focus:ring-[#1B222C] bg-white transition-all"
                      >
                        <option value="1-2 years">1–2 years (Junior / Mid)</option>
                        <option value="2-4 years">2–4 years (Mid-Level)</option>
                        <option value="5+ years">5+ years (Senior / Lead)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-graphite block">
                      GitHub / LinkedIn / Portfolio URL
                    </label>
                    <input
                      type="url"
                      value={form.portfolio}
                      onChange={(e) => handleInputChange("portfolio", e.target.value)}
                      placeholder="https://github.com/username or linkedin.com/in/..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-fog/40 text-xs text-graphite focus:outline-hidden focus:ring-2 focus:ring-[#1B222C] bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-graphite block">
                      Brief Cover Note &amp; Tech Stack Experience <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.coverNote}
                      onChange={(e) => handleInputChange("coverNote", e.target.value)}
                      placeholder="Tell us about the systems you've built, your experience with TypeScript/Node.js/PostgreSQL, and your availability for onsite work in Westlands, Nairobi..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-fog/40 text-xs text-graphite focus:outline-hidden focus:ring-2 focus:ring-[#1B222C] bg-white transition-all resize-y"
                    />
                  </div>

                  <div className="p-3 bg-cloud rounded-lg border border-fog/20 text-[11px] text-slate space-y-1">
                    <span className="font-semibold text-graphite block">Onsite Notice:</span>
                    <span>
                      This role requires working in-person at our Nairobi Headquarters (The Pavilion, 4th Floor, Lower Kabete Road, Westlands).
                    </span>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsApplyModalOpen(false)}
                      className="px-4 py-2.5 rounded-lg text-xs font-medium text-slate hover:text-graphite transition-colors w-full sm:w-auto text-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1B222C] hover:bg-[#3E4C59] px-6 py-2.5 text-xs font-semibold text-white transition-colors disabled:opacity-60 shadow-sm w-full sm:w-auto"
                    >
                      {status === "submitting" ? (
                        <>
                          <span className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          Submit Application
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
