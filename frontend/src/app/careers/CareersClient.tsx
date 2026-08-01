// src/app/careers/CareersClient.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, Briefcase, Mail, Terminal, Coins, Globe } from "lucide-react";

export function CareersClient() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-cloud border-b border-fog/20">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate hover:text-graphite transition-colors mb-6 sm:mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>

          <h1 className="font-display text-3xl font-bold tracking-tight text-graphite sm:text-4xl md:text-5xl animate-fade-in-up">
            Careers
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-slate max-w-2xl leading-relaxed animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Join us in building the future of institutional lending technology.
          </p>
        </div>
      </section>

      {/* No Open Roles */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex flex-col items-center text-center animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          {/* Icon */}
          <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-cloud border border-fog/20 mb-6 sm:mb-8">
            <Briefcase className="h-8 w-8 sm:h-10 sm:w-10 text-fog" />
          </div>

          <h2 className="font-display text-2xl font-bold text-graphite sm:text-3xl">
            No Current Open Roles
          </h2>
          <p className="mt-4 max-w-md text-sm sm:text-base text-slate leading-relaxed">
            We don&apos;t have any open positions at the moment, but we&apos;re always interested in hearing from talented people. Check back soon or send us your resume.
          </p>

          {/* CTA */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <a
              href="mailto:careers@mftechnologies.co"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-graphite px-6 py-3 text-sm font-semibold text-white hover:bg-slate transition-colors w-full sm:w-auto"
            >
              <Mail className="h-4 w-4" />
              Send Your Resume
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-fog/40 bg-white px-6 py-3 text-sm font-semibold text-graphite hover:bg-cloud transition-colors w-full sm:w-auto"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* Why M&F Section */}
        <div className="mt-16 sm:mt-20 border-t border-fog/20 pt-12 sm:pt-16">
          <h3 className="text-center font-display text-xl font-bold text-graphite sm:text-2xl">
            Why M&amp;F Technologies?
          </h3>
          <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="rounded-xl border border-fog/30 bg-cloud p-5 sm:p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center text-graphite mb-4 shadow-sm border border-fog/10">
                <Terminal className="h-5 w-5" />
              </div>
              <h4 className="mt-2 font-semibold text-graphite text-sm sm:text-base">Cutting-Edge Stack</h4>
              <p className="mt-2 text-xs sm:text-sm text-slate">
                Work with modern tools — Node.js, React, PostgreSQL, and cloud-native infrastructure.
              </p>
            </div>
            <div className="rounded-xl border border-fog/30 bg-cloud p-5 sm:p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center text-graphite mb-4 shadow-sm border border-fog/10">
                <Coins className="h-5 w-5" />
              </div>
              <h4 className="mt-2 font-semibold text-graphite text-sm sm:text-base">Real Impact</h4>
              <p className="mt-2 text-xs sm:text-sm text-slate">
                Build systems that process billions in disbursements for financial institutions worldwide.
              </p>
            </div>
            <div className="rounded-xl border border-fog/30 bg-cloud p-5 sm:p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center text-graphite mb-4 shadow-sm border border-fog/10">
                <Globe className="h-5 w-5" />
              </div>
              <h4 className="mt-2 font-semibold text-graphite text-sm sm:text-base">Remote-First</h4>
              <p className="mt-2 text-xs sm:text-sm text-slate">
                Work from anywhere. We value output over hours, and trust over micromanagement.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
