// src/app/privacy/PrivacyClient.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export function PrivacyClient() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="bg-[#F4F6F8] border-b border-[#9AA5B1]/20">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3E4C59] hover:text-[#1B222C] transition-colors mb-6 sm:mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center text-[#1B222C] border border-[#9AA5B1]/20 shadow-sm">
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3E4C59]">
              Legal &amp; Privacy Standards
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-[#1B222C] sm:text-4xl md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#6B7684]">
            Effective Date: July 31, 2026 &bull; Last Updated: July 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 text-[#3E4C59] leading-relaxed space-y-8 text-sm sm:text-base">
        <div>
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-3">1. Information We Collect</h2>
          <p>
            M&amp;F Technologies collects minimal telemetry, device identifier data, and account information required to provide institutional lending software, API endpoints, and financial infrastructure.
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-2 text-xs sm:text-sm">
            <li><strong>Technical Identifiers:</strong> IP addresses, browser types, operating systems, and device telemetry.</li>
            <li><strong>API Access Logs:</strong> Timestamped API request payloads, response statuses, and rate limiting headers.</li>
            <li><strong>Account Data:</strong> Contact email addresses, institution names, and API keys for partner credentials.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-3">2. How We Use Data</h2>
          <p>
            We process collected information strictly to operate, maintain, secure, and improve our financial software infrastructure:
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-2 text-xs sm:text-sm">
            <li>Verifying partner identities and managing API security credentials.</li>
            <li>Detecting, preventing, and mitigating fraudulent transactions or cyber security threats.</li>
            <li>Maintaining immutable double-entry ledger audits required for banking compliance.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-3">3. Data Protection &amp; Encryption</h2>
          <p>
            All data processed by M&amp;F Technologies is protected using bank-grade AES-256 encryption at rest and TLS 1.3 in transit. We enforce zero-trust access protocols and strict multi-tenant database isolation.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-3">4. Cookies &amp; Preferences</h2>
          <p>
            We use essential session cookies for authentication and performance cookies to monitor system latency. You can manage or customize your cookie preferences at any time using our Cookie Banner controls.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-3">5. Data Retention &amp; Rights</h2>
          <p>
            You have the right to request access to, correction of, or deletion of your personal contact data. Financial transaction ledgers are retained in accordance with applicable central banking regulations.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-3">6. Contact Us</h2>
          <p>
            If you have questions regarding this Privacy Policy, please reach out to our Compliance Office at <span className="font-mono text-[#1B222C] font-semibold">compliance@mandftechnologies.com</span>.
          </p>
        </div>
      </section>
    </main>
  );
}
