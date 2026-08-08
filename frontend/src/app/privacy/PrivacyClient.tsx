// src/app/privacy/PrivacyClient.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export function PrivacyClient() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="bg-[#F4F6F8] border-b border-[#9AA5B1]/20">
        <div className="w-full px-4 py-16 sm:px-8 lg:px-12 sm:py-24">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3E4C59] hover:text-[#1B222C] transition-colors mb-6 sm:mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center text-[#1B222C] border border-[#9AA5B1]/20 shadow-sm">
              <Shield className="h-5 w-5 text-[#1B222C]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3E4C59]">
              Legal &amp; Privacy Standards
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-[#1B222C] sm:text-4xl md:text-5xl">
            Privacy Policy &amp; Data Sovereignty
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#6B7684]">
            Effective Date: July 31, 2026 &bull; Last Updated: August 2026 &bull; Version 2.1
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="w-full px-4 py-16 sm:px-8 lg:px-12 sm:py-20 text-[#3E4C59] leading-relaxed space-y-10 text-sm sm:text-base">
        <div>
          <p className="max-w-4xl font-medium text-[#1B222C]">
            M&amp;F Technologies is committed to maintaining the confidentiality, integrity, and security of personal, financial, and telemetry data processed across our systems. This Privacy Policy details our operational data practices as a data processor for banking clients, credit unions, and microfinance institutions.
          </p>
        </div>

        <div className="border-t border-[#9AA5B1]/20 pt-8">
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-4">1. Scope and Categories of Collected Data</h2>
          <p className="max-w-4xl">
            Depending on your interface with M&amp;F Technologies (as a developer integrating our APIs, an administrator of a partner banking portal, or a customer of a partner institution), we collect and process data across several broad categories:
          </p>
          <ul className="list-disc pl-5 mt-4 space-y-3 max-w-4xl text-xs sm:text-sm text-[#3E4C59]">
            <li>
              <strong>Technical Network Telemetry:</strong> To guarantee API availability, protect endpoints from distributed denial-of-service (DDoS) attacks, and enforce rate limits, we log accessing IP addresses, geographical routing metadata, User-Agent strings, HTTP response codes, and system latency measurements.
            </li>
            <li>
              <strong>API Access Payloads:</strong> Development and staging integration logs record JSON request and response payloads, including endpoint path identifiers, parameter keys, and authentication headers. Production payloads containing personal identification information (PII) are isolated and encrypted immediately at the application boundary.
            </li>
            <li>
              <strong>Credential &amp; Profile Data:</strong> We store administrative metadata for developer portal registrations, including name, email address, organizational title, company name, phone contacts, and multi-factor authentication setup hashes.
            </li>
            <li>
              <strong>Underwriting Support Artifacts:</strong> If a partner banking client employs our OCR extraction services, we temporarily process financial balance sheets, credit history files, and registration certs provided via encrypted pipelines.
            </li>
          </ul>
        </div>

        <div className="border-t border-[#9AA5B1]/20 pt-8">
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-4">2. Processing Rationale &amp; Legal Bases</h2>
          <p className="max-w-4xl">
            We process telemetry and account information under GDPR Article 6 guidelines and equivalent national central bank regulatory mandates:
          </p>
          <ul className="list-disc pl-5 mt-4 space-y-3 max-w-4xl text-xs sm:text-sm text-[#3E4C59]">
            <li>
              <strong>Contractual Fulfillment:</strong> To deliver operational access to high-volume lending systems, verify active developer sessions, and compute API transaction invoices for partner financial institutions.
            </li>
            <li>
              <strong>Legitimate Cybersecurity Interests:</strong> To actively trace bad actors, block automated request scanners, mitigate SQL-injection attempts, and debug database latency bottlenecks.
            </li>
            <li>
              <strong>Regulatory Compliance:</strong> To maintain tamper-evident double-entry ledgers matching regional banking records laws and anti-money laundering (AML) compliance timelines.
            </li>
          </ul>
        </div>

        <div className="border-t border-[#9AA5B1]/20 pt-8">
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-4">3. Data Processing Isolation &amp; Sovereignty</h2>
          <p className="max-w-4xl">
            M&amp;F Technologies enforces logical multi-tenant database isolation. Administrative logs, staging environments, and production systems run on completely independent network networks. To comply with national data sovereignty mandates (e.g. Kenya Data Protection Act, EU GDPR, US federal laws), partner institutions can request localized routing configurations where all resident lending data resides within specific regional virtual private clouds.
          </p>
        </div>

        <div className="border-t border-[#9AA5B1]/20 pt-8">
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-4">4. Sharing and Disclosure Protocols</h2>
          <p className="max-w-4xl">
            M&amp;F Technologies does not sell, lease, trade, or distribute credit histories, telemetry records, or admin profiles to third-party advertising companies. Data disclosures are restricted to:
          </p>
          <ul className="list-disc pl-5 mt-4 space-y-3 max-w-4xl text-xs sm:text-sm text-[#3E4C59]">
            <li>Accredited cloud hosting partners hosting regional server instances under strict business associate agreements.</li>
            <li>Regulatory agencies or central banking auditors, exclusively when presented with a valid legal mandate, subpoena, or compliance audit order.</li>
            <li>Integration providers (e.g., identity verification databases, regional credit bureaus) as explicitly configured and authorized by the partner banking client.</li>
          </ul>
        </div>

        <div className="border-t border-[#9AA5B1]/20 pt-8">
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-4">5. Telemetry &amp; Cookie Configurations</h2>
          <p className="max-w-4xl">
            We use strictly necessary browser storage objects to secure administrative sessions, prevent CSRF attacks, and verify multi-tenant credentials. We also utilize optional performance cookies to help analyze user paths and site load times. You can modify your choices at any time:
          </p>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("open_cookie_preferences"))}
              className="inline-flex items-center gap-2 rounded bg-[#1B222C] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#3E4C59] transition-colors cursor-pointer shadow-sm"
            >
              Configure Telemetry Settings
            </button>
          </div>
        </div>

        <div className="border-t border-[#9AA5B1]/20 pt-8">
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-4">6. Data Retention Limits &amp; Security Audits</h2>
          <p className="max-w-4xl">
            Developer portal profile data is maintained for the duration of the active partnership agreement. API telemetry and error logs are automatically pruned and deleted after 30 days. Historical financial ledger blocks are retained indefinitely in a read-only state as required to comply with central banking audit laws.
          </p>
          <p className="mt-3 max-w-4xl">
            All stored systems undergo daily vulnerability checks, weekly package security reviews, and annual external SOC 2 audits to verify the operational safety of M&amp;F data.
          </p>
        </div>

        <div className="border-t border-[#9AA5B1]/20 pt-8">
          <h2 className="font-display text-xl font-bold text-[#1B222C] mb-4">7. Regulatory Contact Information</h2>
          <p className="max-w-4xl">
            For questions, data access requests, or information regarding regional data isolation policies, please contact our Compliance Office:
          </p>
          <div className="mt-4 p-5 rounded-lg bg-[#F4F6F8] border border-[#9AA5B1]/20 max-w-xl space-y-1.5 text-xs">
            <p className="font-bold text-[#1B222C]">Compliance &amp; Data Protection Office</p>
            <p className="text-[#3E4C59]">M&amp;F Technologies Inc.</p>
            <p className="text-[#6B7684]">Email: <span className="font-mono text-[#1B222C] font-semibold">compliance@mandftechnologies.com</span></p>
            <p className="text-[#6B7684]">Response SLA: Within 48 business hours for institutional partners.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
