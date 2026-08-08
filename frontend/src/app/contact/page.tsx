import { ContactForm } from "../../features/landing/components/ContactForm";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Clock, MapPin, Sparkles } from "lucide-react";
import RequestDemoButton from "@/shared/components/RequestDemoButton";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="bg-cloud border-b border-fog/20">
        <div className="w-full px-4 py-16 sm:px-8 lg:px-12 sm:py-24">
          <div className="mb-6 sm:mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3E4C59] hover:text-[#1B222C] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Home
            </Link>
          </div>

          <h1 className="font-display text-3xl font-bold text-graphite sm:text-4xl md:text-5xl leading-tight">
            Connect with our Infrastructure Team
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate max-w-2xl leading-relaxed">
            Whether you are looking to integrate alternative credit scoring weight trees, migrate a legacy database to our immutable double-entry ledger, or schedule a SOC 2 audit compliance review, we are here to assist.
          </p>
        </div>
      </section>

      {/* Main Form and Info Layout */}
      <section className="w-full px-4 py-16 sm:px-8 lg:px-12 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Contact Form Card */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="font-bold text-graphite text-lg sm:text-xl">Send an Institutional Inquiry</h2>
              <p className="text-xs text-slate leading-relaxed">
                Provide your organizational contacts and integration objectives. A technical accounts manager will reach out within 24 business hours.
              </p>
            </div>
            <ContactForm />
          </div>

          {/* Right: Info Panel */}
          <aside className="lg:sticky lg:top-24 space-y-6">
            <div className="rounded-xl border border-fog/30 bg-cloud p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-graphite sm:text-lg">Contact Information</h3>
                <p className="text-xs text-slate leading-relaxed">
                  For quick inquiries or developer integration questions, use our direct communication lines:
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate">
                  <Mail className="h-4 w-4 text-[#3E4C59]" />
                  <a href="mailto:musamwange2@gmail.com" className="font-medium text-[#1B222C] hover:underline">
                    musamwange2@gmail.com
                  </a>
                </div>

                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate">
                  <Phone className="h-4 w-4 text-[#3E4C59]" />
                  <a href="tel:0114945842" className="font-medium text-[#1B222C] hover:underline">
                    0114945842 (Operational Support)
                  </a>
                </div>

                <div className="flex items-start gap-3 text-xs text-slate border-t border-fog/20 pt-4">
                  <Clock className="h-4.5 w-4.5 text-[#3E4C59] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-graphite">Support Availability</div>
                    <div className="mt-1">Mon–Fri, 09:00–17:00 GMT (SLA response active)</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs text-slate border-t border-fog/20 pt-4">
                  <MapPin className="h-4.5 w-4.5 text-[#3E4C59] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-graphite">Engineering Headquarters</div>
                    <div className="mt-1">Regional operational offices listed inside partner agreement portfolios.</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-fog/20 flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-xs text-[#3E4C59]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Looking to schedule a production evaluation?</span>
                </div>
                <RequestDemoButton className="inline-block w-full rounded-lg bg-graphite px-4 py-3 text-xs font-bold text-white text-center hover:bg-slate transition-colors shadow-sm" />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
