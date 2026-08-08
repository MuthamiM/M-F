// src/features/landing/components/Footer.tsx
"use client";

import Link from "next/link";

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

        {/* Links: Starts from left edge to middle (max-w-3xl), right side is blank */}
        <div className="w-full flex flex-wrap justify-start gap-x-8 gap-y-3 text-xs font-medium max-w-3xl mr-auto">
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

          <Link
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors py-1"
          >
            Privacy Policy
          </Link>

          <Link
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
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
