"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Send, Sparkles, Building, Layers } from "lucide-react";
import { Nav } from "@/features/landing/components/Nav";
import { Footer } from "@/features/landing/components/Footer";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";

export default function RequestDemoPage() {
  const [form, setForm] = useState(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = sessionStorage.getItem("demoPrefill");
        if (raw) {
          sessionStorage.removeItem("demoPrefill");
          return { name: "", email: "", company: "", message: "", ...JSON.parse(raw) };
        }
      }
    } catch {
      // ignore
    }
    return { name: "", email: "", company: "", message: "" };
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-white">
        {/* Hero Header */}
        <section className="bg-cloud border-b border-fog/20">
          <div className="w-full px-4 py-12 sm:px-8 lg:px-12 sm:py-20">
            <Breadcrumbs items={[{ label: "Request Demo" }]} />

          <h1 className="font-display text-3xl font-bold text-graphite sm:text-4xl md:text-5xl leading-tight">
            Schedule an Institutional Platform Demo
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate max-w-2xl leading-relaxed">
            Request a technical session with our systems architects. We will demonstrate how our core double-entry transaction database and scoring weight tree modules scale to handle high-frequency credit operations.
          </p>
        </div>
      </section>

      {/* Form Content */}
      <section className="w-full px-4 py-16 sm:px-8 lg:px-12 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column: Form Card */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="font-bold text-graphite text-lg sm:text-xl">Evaluation Request Details</h2>
              <p className="text-xs text-slate leading-relaxed">
                Provide your institutional details below to customize the demo sandbox.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-xl border border-fog/30 bg-[#F4F6F8] p-8 text-center space-y-4">
                <Sparkles className="h-8 w-8 text-[#1B222C] mx-auto animate-pulse" />
                <h3 className="font-bold text-graphite text-base sm:text-lg">Demo Request Received</h3>
                <p className="text-xs sm:text-sm text-slate leading-relaxed max-w-sm mx-auto">
                  Thank you. An integration architect will review your organizational requirements and schedule an online demonstration pool within 24 business hours.
                </p>
                <div className="pt-2">
                  <Link
                    href="/"
                    className="inline-block rounded-lg bg-[#1B222C] text-white py-2 px-4 text-xs font-bold hover:bg-[#3E4C59] transition-all"
                  >
                    Return to Home
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-graphite uppercase tracking-wider mb-1.5">Contact Name</label>
                  <input
                    type="text"
                    required
                    className="block w-full rounded-lg border border-fog/50 px-4 py-3 text-sm text-graphite focus:border-graphite focus:outline-none bg-white transition-colors"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-graphite uppercase tracking-wider mb-1.5">Work Email</label>
                  <input
                    type="email"
                    required
                    className="block w-full rounded-lg border border-fog/50 px-4 py-3 text-sm text-graphite focus:border-graphite focus:outline-none bg-white transition-colors"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@institution.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-graphite uppercase tracking-wider mb-1.5">Organization / Bank</label>
                  <input
                    type="text"
                    required
                    className="block w-full rounded-lg border border-fog/50 px-4 py-3 text-sm text-graphite focus:border-graphite focus:outline-none bg-white transition-colors"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-graphite uppercase tracking-wider mb-1.5">Integration Objectives</label>
                  <textarea
                    required
                    rows={4}
                    className="block w-full rounded-lg border border-fog/50 px-4 py-3 text-sm text-graphite focus:border-graphite focus:outline-none bg-white resize-none transition-colors"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="e.g. automating underwriting, scaling transactional ledger"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-graphite hover:bg-[#3E4C59] text-white px-5 py-3 text-xs font-bold transition-all shadow-sm active:scale-98 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Demo Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Platform Scope Details */}
          <aside className="space-y-6">
            <div className="rounded-xl border border-fog/30 bg-[#F4F6F8] p-6 sm:p-8 space-y-6">
              <h3 className="font-bold text-graphite text-sm sm:text-base uppercase tracking-wider text-[11px]">Evaluation Environment Details</h3>
              
              <div className="space-y-4 text-xs text-slate leading-relaxed">
                <div className="flex gap-3">
                  <Building className="h-5 w-5 text-graphite shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-graphite text-xs sm:text-sm">Pre-configured Sandbox</h4>
                    <p className="mt-1">
                      Our sandbox environment contains mock customer datasets, credit bureau logs, and multi-tenant ledger schemas ready for API experimentation.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 border-t border-[#9AA5B1]/20 pt-4">
                  <Layers className="h-5 w-5 text-graphite shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-graphite text-xs sm:text-sm">Architect Consultation</h4>
                    <p className="mt-1">
                      Demos include a 30-minute system consultation with a senior software architect to review regional data hosting and sovereignty rules.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
    <Footer />
  </>
  );
}
