import Link from "next/link";
import { ArrowLeft, Terminal, ShieldAlert, Cpu, Code2, Link2 } from "lucide-react";

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="bg-cloud border-b border-fog/20">
        <div className="w-full px-4 py-16 sm:px-8 lg:px-12 sm:py-24">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3E4C59] hover:text-[#1B222C] transition-colors mb-6 sm:mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>

          <h1 className="font-display text-3xl font-bold text-graphite sm:text-4xl md:text-5xl leading-tight">
            Developer Documentation &amp; API Reference
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate max-w-2xl leading-relaxed">
            Integrate M&amp;F Technologies core lending systems, credit decision weight trees, double-entry accounting ledgers, and KYC verification pipelines directly into your software.
          </p>
        </div>
      </section>

      {/* Main Docs Section */}
      <section className="w-full px-4 py-16 sm:px-8 lg:px-12 sm:py-24 space-y-16">
        
        {/* Core Resources Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-xl border border-[#9AA5B1]/20 bg-white p-6 sm:p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
            <div className="h-10 w-10 rounded-lg bg-cloud flex items-center justify-center text-graphite border border-fog/10">
              <Code2 className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-graphite text-lg">Integration Specifications</h2>
            <p className="text-sm text-slate leading-relaxed">
              Step-by-step setup guides, client SDK initializations, webhook signature validation procedures, and idempotency key guidelines for processing high-volume micro-lending transactions.
            </p>
            <div className="pt-2">
              <span className="text-xs font-semibold text-[#1B222C] underline decoration-[#9AA5B1]/40 cursor-not-allowed">
                Integration Guides (PDF Available Under NDA)
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-[#9AA5B1]/20 bg-white p-6 sm:p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
            <div className="h-10 w-10 rounded-lg bg-cloud flex items-center justify-center text-graphite border border-fog/10">
              <Link2 className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-graphite text-lg">OpenAPI Reference Sitemap</h2>
            <p className="text-sm text-slate leading-relaxed">
              Browse interactive query schemas, parameters definitions, data types, validation constraints, and response payload examples generated directly from our active API servers.
            </p>
            <div className="pt-2">
              <a
                href="http://localhost:4000/api/docs/sitemap"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-white bg-[#1B222C] hover:bg-[#3E4C59] py-2 px-3 rounded inline-flex items-center gap-1 transition-all shadow-sm"
              >
                <span>Launch OpenAPI Sitemap</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        </div>

        {/* Detailed API Spec Guide */}
        <div className="border-t border-[#9AA5B1]/20 pt-16 space-y-8">
          <div className="space-y-3">
            <h3 className="font-display text-xl font-bold text-graphite sm:text-2xl">
              API Architecture &amp; Authentication Protocol
            </h3>
            <p className="text-sm text-slate max-w-3xl leading-relaxed">
              M&amp;F APIs are organized around REST principles. All request bodies must be JSON, and responses return standard HTTP status codes. Telemetry headers are injected into each reply to assist in latency tracking.
            </p>
          </div>

          <div className="bg-[#1B222C] text-slate-100 rounded-xl p-6 sm:p-8 font-mono text-xs overflow-x-auto space-y-4 shadow-lg border border-[#3E4C59]">
            <div>
              <p className="text-[#9AA5B1]">{"// Authenticating requests (Bearer token pattern)"}</p>
              <p className="text-[#E4E7EB] mt-1">
                curl -X POST &quot;https://api.mandftechnologies.com/v2/disbursements&quot; \
              </p>
              <p className="text-[#E4E7EB] pl-4">
                -H &quot;Authorization: Bearer YOUR_PRODUCTION_API_KEY&quot; \
              </p>
              <p className="text-[#E4E7EB] pl-4">
                -H &quot;Content-Type: application/json&quot; \
              </p>
              <p className="text-[#E4E7EB] pl-4">
                -H &quot;Idempotency-Key: id_8f0e2193b2a95c81&quot; \
              </p>
              <p className="text-[#E4E7EB] pl-4">
                -d &apos;&#123;&quot;account_id&quot;: &quot;acc_01h8j92m&quot;, &quot;amount&quot;: 5000.00, &quot;currency&quot;: &quot;KES&quot;&#125;&apos;
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate leading-relaxed">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-graphite">
                <Terminal className="h-4.5 w-4.5 text-[#3E4C59]" />
                <h4>Idempotent Requests</h4>
              </div>
              <p className="text-xs">
                To guarantee zero double-disbursements in micro-loan payouts under spotty mobile network coverage, client requests must pass a unique `Idempotency-Key` header. Duplicate attempts are safely returned from cache.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-graphite">
                <ShieldAlert className="h-4.5 w-4.5 text-[#3E4C59]" />
                <h4>JSON Rate Limits</h4>
              </div>
              <p className="text-xs">
                Standard institutional access limits queries to 5,000 per minute. Exceeding operations return an HTTP `429 Too Many Requests` code with a `Retry-After` header indicating reset parameters.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-graphite">
                <Cpu className="h-4.5 w-4.5 text-[#3E4C59]" />
                <h4>Webhook Security</h4>
              </div>
              <p className="text-xs">
                Loan state updates are delivered as POST payloads to your registered callback URL. Webhooks carry a HMAC-SHA-256 header signature computed using your secret key to prevent spoofing.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
