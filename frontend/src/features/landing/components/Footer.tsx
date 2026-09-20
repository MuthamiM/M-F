// src/features/landing/components/Footer.tsx
"use client";

import Link from "next/link";
import { Clock, Mail, Phone, MapPin, ShieldCheck, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-cloud text-slate w-full pt-12 sm:pt-16 pb-10 border-t border-fog/30">
      <div className="w-full px-3.5 sm:px-8 lg:px-12 max-w-7xl mx-auto space-y-10">

        {/* Brand & Direct Contact Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pb-8 border-b border-fog/25 items-start">
          {/* Brand Info */}
          <div className="space-y-3.5">
            <Link href="/" className="inline-flex items-center gap-2.5 group hover:opacity-80 transition-opacity">
              <span className="relative flex h-7 w-7 items-center justify-center">
                <span className="absolute h-7 w-7 rounded-full bg-graphite group-hover:scale-105 transition-transform" />
                <span className="absolute right-0 h-3.5 w-3.5 rounded-full bg-white border border-cloud" />
              </span>
              <span className="text-lg font-bold text-graphite tracking-tight">
                M&amp;F <span className="font-normal text-fog">Technologies</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate leading-relaxed max-w-md">
              Institutional-grade lending technology, automated credit underwriting, and secure transactional double-entry ledgers for commercial banks, credit unions, and microfinance providers.
            </p>
          </div>

          {/* Contact Details & Operating Telemetry */}
          <div className="flex flex-col sm:items-end space-y-3">
            <div className="flex flex-col sm:items-end space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-fog shrink-0" />
                <a
                  href="mailto:info@mftechnologies.org"
                  className="text-graphite hover:text-slate font-semibold transition-colors"
                >
                  info@mftechnologies.org
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-fog shrink-0" />
                <a
                  href="tel:+254748329410"
                  className="text-graphite hover:text-slate font-medium transition-colors"
                >
                  +254 748 329 410 (Support)
                </a>
              </div>

              <div className="flex items-center gap-2 text-slate text-[11px] sm:text-xs">
                <MapPin className="h-3.5 w-3.5 text-fog shrink-0" />
                <span>The Pavilion, 4th Fl, Lower Kabete Rd, Westlands, Nairobi</span>
              </div>
            </div>

            {/* Operating Hours Pill */}
            <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-fog/25 text-[10px] sm:text-[11px] text-slate shadow-sm">
              <Clock className="h-3 w-3 text-emerald-500 shrink-0" />
              <span className="font-semibold text-graphite">Hours:</span>
              <span>Mon–Fri 08:00–17:00 (EAT)</span>
              <span className="text-fog">•</span>
              <span className="text-emerald-600 font-medium">24/7 Monitoring</span>
            </div>
          </div>
        </div>

        {/* 4 Subcategories — Displayed in 4 Columns on Both Phone & Laptop */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-6 lg:gap-8 pb-10 border-b border-fog/25">

          {/* Subcategory 1: Platform & Services */}
          <div className="space-y-3">
            <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-graphite truncate" title="Platform & Services">
              Platform
            </h3>
            <ul className="space-y-2 text-[10px] sm:text-xs text-slate leading-snug">
              <li>
                <Link href="/services" className="hover:text-graphite transition-colors block break-words">
                  All Services
                </Link>
              </li>
              <li>
                <Link href="/services/core-lending-systems" className="hover:text-graphite transition-colors block break-words">
                  Core Lending
                </Link>
              </li>
              <li>
                <Link href="/services/credit-scoring-platforms" className="hover:text-graphite transition-colors block break-words">
                  Credit Scoring
                </Link>
              </li>
              <li>
                <Link href="/services/collections-management" className="hover:text-graphite transition-colors block break-words">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/services/workflow-automation" className="hover:text-graphite transition-colors block break-words">
                  Workflow Auto
                </Link>
              </li>
            </ul>
          </div>

          {/* Subcategory 2: Developer & API */}
          <div className="space-y-3">
            <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-graphite truncate" title="Developer & API">
              Developers
            </h3>
            <ul className="space-y-2 text-[10px] sm:text-xs text-slate leading-snug">
              <li>
                <Link href="/docs" className="hover:text-graphite transition-colors inline-flex items-center gap-0.5 break-words">
                  <span>API Docs</span>
                  <ArrowUpRight className="h-2.5 w-2.5 opacity-40 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-graphite transition-colors inline-flex items-center gap-1 break-words">
                  <span>Status</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-graphite transition-colors block break-words">
                  Security Arch
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-graphite transition-colors block break-words">
                  REST &amp; GraphQL
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-graphite transition-colors block break-words">
                  Telemetry Logs
                </Link>
              </li>
            </ul>
          </div>

          {/* Subcategory 3: Company & Team */}
          <div className="space-y-3">
            <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-graphite truncate" title="Company & Team">
              Company
            </h3>
            <ul className="space-y-2 text-[10px] sm:text-xs text-slate leading-snug">
              <li>
                <Link href="/about" className="hover:text-graphite transition-colors block break-words">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/company-profile" className="hover:text-graphite transition-colors block break-words font-medium text-graphite">
                  Company Profile (PDF / DOC)
                </Link>
              </li>
              <li>
                <Link href="/where-we-are" className="hover:text-graphite transition-colors block break-words">
                  Where We Are
                </Link>
              </li>
              <li>
                <Link href="/our-clients" className="hover:text-graphite transition-colors block break-words">
                  Our Clients
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-graphite transition-colors inline-flex flex-wrap items-center gap-1.5 break-words">
                  <span>Careers</span>
                  <span className="rounded bg-emerald-100 text-emerald-800 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold border border-emerald-200/80">
                    Hiring
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/get-involved" className="hover:text-graphite transition-colors block break-words">
                  Advisory
                </Link>
              </li>
              <li>
                <Link href="/request-demo" className="hover:text-graphite transition-colors block break-words font-medium text-graphite">
                  Schedule Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Subcategory 4: Trust, Legal & Support */}
          <div className="space-y-3">
            <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-graphite truncate" title="Trust & Legal">
              Trust &amp; Legal
            </h3>
            <ul className="space-y-2 text-[10px] sm:text-xs text-slate leading-snug">
              <li>
                <Link href="/news" className="hover:text-graphite transition-colors block break-words">
                  News &amp; Press
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="hover:text-graphite transition-colors block break-words">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-graphite transition-colors block break-words">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-graphite transition-colors block break-words">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-graphite transition-colors block break-words">
                  Terms of Use
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("open_cookie_preferences"))}
                  className="hover:text-graphite transition-colors cursor-pointer text-left block break-words"
                >
                  Cookies
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-[11px] text-fog">
          <p>
            &copy; {new Date().getFullYear()} M&amp;F Technologies. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
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
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span className="font-medium">SOC 2 Type II Audited</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
