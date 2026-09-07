import { ContactForm } from "../../features/landing/components/ContactForm";
import { Nav } from "@/features/landing/components/Nav";
import { Footer } from "@/features/landing/components/Footer";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import { Mail, Phone, Clock, MapPin, Sparkles } from "lucide-react";
import RequestDemoButton from "@/shared/components/RequestDemoButton";

export const metadata = {
  title: "Contact Us — M&F Technologies",
  description: "Get in touch with M&F Technologies. Reach our infrastructure, engineering, and partner accounts teams for integration inquiries or support.",
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-white">
        {/* Hero Header */}
        <section className="bg-cloud border-b border-fog/20">
          <div className="w-full px-4 py-12 sm:px-8 lg:px-12 sm:py-20">
            <Breadcrumbs items={[{ label: "Contact Us" }]} />

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
                    <a href="mailto:info@mftechnologies.org" className="font-medium text-[#1B222C] hover:underline">
                      info@mftechnologies.org
                    </a>
                  </div>

                  <div className="flex items-center gap-3 text-xs sm:text-sm text-slate">
                    <Phone className="h-4 w-4 text-[#3E4C59]" />
                    <a href="tel:+254748329410" className="font-medium text-[#1B222C] hover:underline">
                      +254 748 329 410 (Operational Support)
                    </a>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-slate border-t border-fog/20 pt-4">
                    <Clock className="h-4.5 w-4.5 text-[#3E4C59] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-graphite">Support Availability</div>
                      <div className="mt-1">Mon–Fri, 08:00–17:00 (EACT) &bull; 24/7 API Monitoring Active</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-xs text-slate border-t border-fog/20 pt-4">
                    <MapPin className="h-4.5 w-4.5 text-[#3E4C59] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-graphite">Engineering Headquarters</div>
                      <div className="mt-1">Nairobi, Kenya &bull; Operational Hubs in London (UK) &amp; Lagos (Nigeria)</div>
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
      <Footer />
    </>
  );
}
