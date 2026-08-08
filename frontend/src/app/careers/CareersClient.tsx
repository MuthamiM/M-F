// src/app/careers/CareersClient.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, Briefcase, Mail, Terminal, Coins, Globe, Heart, Shield, Cpu } from "lucide-react";

export function CareersClient() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-cloud border-b border-fog/20">
        <div className="w-full px-4 py-16 sm:px-8 lg:px-12 sm:py-24">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate hover:text-graphite transition-colors mb-6 sm:mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>

          <h1 className="font-display text-3xl font-bold tracking-tight text-graphite sm:text-4xl md:text-5xl animate-fade-in-up">
            Join M&amp;F Technologies
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate max-w-3xl leading-relaxed animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            We design, build, and scale high-performance banking infrastructure, credit scoring frameworks, and secure transactional middleware that process billions in micro-lending disbursements worldwide.
          </p>
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
            At M&amp;F Technologies, we believe that access to credit is a fundamental pillar of economic growth and social mobility. By replacing slow, error-prone legacy underwriting pipelines with automated microservices and secure database systems, we help financial institutions serve millions of underbanked individuals across emerging markets.
          </p>
          <p className="text-sm sm:text-base text-slate leading-relaxed">
            We operate as a highly collaborative, remote-first team of system engineers, database architects, security experts, and financial product thinkers. We care deeply about clean code, performance testing (our API response latency SLAs are sub-200ms), automated test suites, and strict mathematical ledger validation. If you enjoy solving hard backend coordination challenges, optimizing PostgreSQL databases, and designing resilient API contracts, you will fit right in.
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
                We build with Next.js, Node.js, TypeScript, PostgreSQL, Docker, and Kubernetes. We run clean migrations, strict lint rules, and automated CI/CD pipelines.
              </p>
            </div>
            <div className="rounded-xl border border-fog/30 bg-cloud p-6 flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center text-graphite shadow-sm border border-fog/10">
                <Coins className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-graphite text-sm sm:text-base">Global Financial Impact</h4>
              <p className="text-xs text-slate leading-relaxed">
                Our code processes disbursements for real commercial banks and regional lending platforms. Your work directly affects the efficiency of small-business lending systems.
              </p>
            </div>
            <div className="rounded-xl border border-fog/30 bg-cloud p-6 flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center text-graphite shadow-sm border border-fog/10">
                <Globe className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-graphite text-sm sm:text-base font-semibold">Remote-First Flexibility</h4>
              <p className="text-xs text-slate leading-relaxed">
                Work from anywhere in the world. We focus on engineering output, documentation completeness, and communication quality over rigid office hours.
              </p>
            </div>
          </div>
        </div>

        {/* Potential Roles */}
        <div className="border-t border-fog/20 pt-16 space-y-8">
          <div>
            <h3 className="font-display text-xl font-bold text-graphite sm:text-2xl">
              Future Opportunities &amp; Core Disciplines
            </h3>
            <p className="text-sm text-slate mt-2 max-w-2xl leading-relaxed">
              While we are currently fully staffed and have no active hiring requisitions, we are always on the lookout for talented team members in the following areas:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-[#9AA5B1]/20 rounded-xl p-6 bg-[#F8FAFC] space-y-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-4.5 w-4.5 text-[#3E4C59]" />
                <h4 className="font-bold text-graphite text-sm sm:text-base">Backend &amp; Ledger Systems Engineer</h4>
              </div>
              <p className="text-xs text-slate leading-relaxed">
                Responsible for maintaining the double-entry accounting engine, scaling database replication, securing microservice middleware, and optimizing transaction consistency models. Proficient in Node.js, SQL, and distributed system architectures.
              </p>
            </div>

            <div className="border border-[#9AA5B1]/20 rounded-xl p-6 bg-[#F8FAFC] space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4.5 w-4.5 text-[#3E4C59]" />
                <h4 className="font-bold text-graphite text-sm sm:text-base">Infrastructure Security Specialist</h4>
              </div>
              <p className="text-xs text-slate leading-relaxed">
                Coordinates our SOC 2 auditing pipelines, vulnerability tracking, key rotation routines, network isolation rules, and hardware MFA setups. Strong understanding of AWS/GCP IAM, VPC firewalls, and cryptographic practices.
              </p>
            </div>
          </div>
        </div>

        {/* No Active Openings Announcement */}
        <div className="border-t border-fog/20 pt-16 flex flex-col items-center text-center space-y-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cloud border border-fog/20">
            <Briefcase className="h-6 w-6 text-slate" />
          </div>

          <div className="space-y-2">
            <h3 className="font-display text-xl font-bold text-graphite sm:text-2xl">
              No Open Requisitions at the Moment
            </h3>
            <p className="max-w-md text-xs sm:text-sm text-slate leading-relaxed">
              We are currently in a period of team stability and are not interviewing. However, if you are an exceptional engineer passionate about lending technology, you can send us a message.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2">
            <a
              href="mailto:careers@mftechnologies.co"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1B222C] hover:bg-[#3E4C59] px-6 py-3 text-xs font-semibold text-white transition-colors w-full sm:w-auto shadow-sm"
            >
              <Mail className="h-4 w-4 text-white" />
              Submit Resume for Future Openings
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
    </main>
  );
}
