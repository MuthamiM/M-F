// src/features/landing/components/Footer.tsx
"use client";

import Link from "next/link";
import { Clock, Mail, Phone, MapPin, ShieldCheck, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-cloud text-slate w-full pt-16 pb-10 border-t border-fog/30">
      <div className="w-full px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-fog/25">

          {/* Brand & Contact — Span 2 cols */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center gap-2.5 group hover:opacity-80 transition-opacity">
              <span className="relative flex h-7 w-7 items-center justify-center">
                <span className="absolute h-7 w-7 rounded-full bg-graphite group-hover:scale-105 transition-transform" />
                <span className="absolute right-0 h-3.5 w-3.5 rounded-full bg-white border border-cloud" />
              </span>
              <span className="text-lg font-bold text-graphite tracking-tight">
                M&amp;F <span className="font-normal text-fog">Technologies</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate leading-relaxed max-w-sm">
              Institutional-grade lending technology, automated credit underwriting, and secure transactional double-entry ledgers for commercial banks, credit unions, and microfinance providers.
            </p>

            {/* Direct Contact Points */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-fog shrink-0" />
                <a
                  href="mailto:info@mftechnologies.org"
                  className="text-graphite hover:text-slate font-semibold transition-colors"
                >
                  info@mftechnologies.org
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-fog shrink-0" />
                <a
                  href="tel:+254748329410"
                  className="text-graphite hover:text-slate font-medium transition-colors"
                >
                  +254 748 329 410
                </a>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-fog shrink-0 mt-0.5" />
                <span className="text-slate">
                  Nairobi Hub &bull; Registered in UK &amp; West Africa
                </span>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-fog/25 text-[11px] text-slate shadow-sm">
              <Clock className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span className="font-semibold text-graphite">Hours:</span>
              <span>Mon–Fri 08:00–17:00 (EACT)</span>
              <span className="text-fog">•</span>
              <span className="text-emerald-600 font-medium">24/7 API Monitoring</span>
            </div>
          </div>

          {/* Column: Platform & Services */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-graphite">
              Platform &amp; Services
            </h3>
            <ul className="space-y-2.5 text-xs text-slate">
              <li>
                <Link href="/services" className="hover:text-graphite transition-colors">
                  All Services Catalog
                </Link>
              </li>
              <li>
                <Link href="/services/core-lending-systems" className="hover:text-graphite transition-colors">
                  Core Lending Systems
                </Link>
              </li>
              <li>
                <Link href="/services/credit-scoring-platforms" className="hover:text-graphite transition-colors">
                  Credit Scoring Platforms
                </Link>
              </li>
              <li>
                <Link href="/services/collections-management" className="hover:text-graphite transition-colors">
                  Collections Management
                </Link>
              </li>
              <li>
                <Link href="/services/workflow-automation" className="hover:text-graphite transition-colors">
                  Workflow Automation
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-graphite transition-colors inline-flex items-center gap-1">
                  <span>API Documentation</span>
                  <ArrowUpRight className="h-3 w-3 opacity-50" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Company */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-graphite">
              Company
            </h3>
            <ul className="space-y-2.5 text-xs text-slate">
              <li>
                <Link href="/about" className="hover:text-graphite transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/where-we-are" className="hover:text-graphite transition-colors">
                  Where We Are
                </Link>
              </li>
              <li>
                <Link href="/our-clients" className="hover:text-graphite transition-colors">
                  Our Clients
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-graphite transition-colors inline-flex items-center gap-1.5">
                  <span>Careers</span>
                  <span className="rounded bg-emerald-100 text-emerald-700 px-1.5 py-0.5 text-[9px] font-bold border border-emerald-200/60">
                    Hiring
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/get-involved" className="hover:text-graphite transition-colors">
                  Partner Program &amp; Advisory
                </Link>
              </li>
              <li>
                <Link href="/request-demo" className="hover:text-graphite transition-colors">
                  Schedule Platform Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Trust & Resources */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-graphite">
              Trust &amp; Resources
            </h3>
            <ul className="space-y-2.5 text-xs text-slate">
              <li>
                <Link href="/news" className="hover:text-graphite transition-colors">
                  News &amp; Announcements
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="hover:text-graphite transition-colors">
                  Institutional Case Studies
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-graphite transition-colors">
                  Security &amp; Compliance
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-graphite transition-colors inline-flex items-center gap-1.5">
                  <span>System Status</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-graphite transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-graphite transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-graphite transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-fog">
          <p>
            &copy; {new Date().getFullYear()} M&amp;F Technologies. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <Link href="/privacy" className="hover:text-graphite transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-graphite transition-colors">
              Terms
            </Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open_cookie_preferences"))}
              className="hover:text-graphite transition-colors cursor-pointer"
            >
              Cookie Preferences
            </button>
            <div className="flex items-center gap-1 text-[11px] text-slate">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span className="font-medium">SOC 2 Type II Audited</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
