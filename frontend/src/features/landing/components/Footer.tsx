// src/features/landing/components/Footer.tsx
"use client";

import Link from "next/link";
import { Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1B222C] text-[#9AA5B1] w-full px-0 py-10 sm:py-12 border-t border-[#3E4C59]/40">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="w-full flex flex-col items-center gap-6 sm:gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group hover:opacity-90 transition-opacity">
          <span className="relative flex h-6 w-6 items-center justify-center">
            <span className="absolute h-6 w-6 rounded-full bg-[#3E4C59] group-hover:scale-105 transition-transform" />
            <span className="absolute right-0 h-3 w-3 rounded-full bg-white" />
          </span>
          <span className="text-md font-semibold text-white">
            M&amp;F <span className="font-normal text-[#6B7684]">Technologies</span>
          </span>
        </Link>

        {/* Operating Hours Display */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-[#9AA5B1]">
          <Clock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span className="font-medium text-white">Operating Hours:</span>
          <span>Mon–Fri 08:00–17:00 (EACT)</span>
          <span className="text-[#6B7684]">•</span>
          <span className="text-emerald-400 font-medium">24/7 SLA &amp; API Monitoring Active</span>
        </div>

        {/* Links */}
        <div className="w-full flex flex-wrap justify-center sm:justify-start gap-x-8 gap-y-3 text-xs font-medium max-w-4xl">
          <Link href="/about" className="hover:text-white transition-colors py-1">
            About Us
          </Link>

          <Link href="/services" className="hover:text-white transition-colors py-1">
            Services
          </Link>

          <Link href="/news" className="hover:text-white transition-colors py-1">
            News
          </Link>

          <Link href="/case-studies" className="hover:text-white transition-colors py-1">
            Case Studies
          </Link>

          <Link href="/our-clients" className="hover:text-white transition-colors py-1">
            Our Clients
          </Link>

          <Link href="/security" className="hover:text-white transition-colors py-1">
            Security &amp; Compliance
          </Link>

          <Link href="/status" className="hover:text-white transition-colors py-1">
            System Status
          </Link>

          <Link href="/careers" className="hover:text-white transition-colors py-1">
            Careers
          </Link>

          <Link href="/where-we-are" className="hover:text-white transition-colors py-1">
            Where We Are
          </Link>

          <Link href="/get-involved" className="hover:text-white transition-colors py-1">
            Get Involved
          </Link>

          <Link href="/contact" className="hover:text-white transition-colors py-1">
            Contact
          </Link>

          <Link
            href="/privacy"
            className="hover:text-white transition-colors py-1"
          >
            Privacy Policy
          </Link>

          <Link
            href="/terms"
            className="hover:text-white transition-colors py-1"
          >
            Terms of Service
          </Link>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open_cookie_preferences"))}
            className="hover:text-white transition-colors py-1 text-left cursor-pointer"
          >
            Cookie Preferences
          </button>
        </div>

        <p className="text-xs text-[#6B7684] text-center">
          &copy; {new Date().getFullYear()} M&amp;F Technologies. All rights reserved.
        </p>
        </div>
      </div>
    </footer>
  );
}
