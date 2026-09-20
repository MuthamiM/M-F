import { About } from "@/features/landing/components/About";
import { Nav } from "@/features/landing/components/Nav";
import { Footer } from "@/features/landing/components/Footer";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import { Compass, Globe2, Building2 } from "lucide-react";
import { NearestOffice } from "@/features/landing/components/NearestOffice";

export const metadata = {
  title: "Where We Are — M&F Technologies",
  description: "Explore M&F Technologies global presence, remote-first engineering culture, and regional operational hubs across London, Nairobi, and Lagos.",
};

export default function WhereWeAre() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-white">
        {/* Hero Header */}
        <section className="bg-cloud border-b border-fog/20">
          <div className="w-full px-4 py-12 sm:px-8 lg:px-12 sm:py-20">
            <Breadcrumbs items={[{ label: "Where We Are" }]} />

            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center text-[#1B222C] border border-[#9AA5B1]/20 shadow-sm">
                <Compass className="h-5 w-5 text-[#1B222C]" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#3E4C59]">
                Engineering Footprint
              </span>
            </div>

            <h1 className="font-display text-3xl font-bold text-graphite sm:text-4xl md:text-5xl leading-tight">
              Our Global Operations &amp; Presence
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate max-w-2xl leading-relaxed">
              M&amp;F Technologies is a remote-first, globally distributed team of system engineers, compliance professionals, and financial interface designers operating across key international financial hubs.
            </p>
          </div>
        </section>

        {/* Reuse the About section component */}
        <About />

        {/* Office Presence Section */}
        <section className="w-full px-4 py-16 sm:px-8 lg:px-12 sm:py-24 space-y-12">
          <div className="border-t border-[#9AA5B1]/20 pt-16">
            <h2 className="font-display text-2xl font-bold text-graphite sm:text-3xl mb-6">
              Global Hubs &amp; Corporate Structure
            </h2>
            <p className="text-sm sm:text-base text-slate leading-relaxed max-w-4xl">
              To coordinate database rollouts, regional regulatory approvals, and on-the-ground deployment reviews, M&amp;F maintains physical hubs and registered support representatives across key operational regions. By combining a remote-first workflow with localized compliance support, we guarantee quick turnarounds for bank audits and service-level responses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            <div className="rounded-xl border border-[#9AA5B1]/20 bg-[#F8FAFC] p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-[#3E4C59]" />
                <h3 className="font-bold text-graphite text-sm sm:text-base">Remote-First Culture</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate leading-relaxed">
                Our engineering team is distributed across five time zones. This allows us to maintain continuous, 24/7 monitoring capabilities for partner banking portals and provide near-instant support coverage for critical system patches and database management operations.
              </p>
            </div>

            <div className="rounded-xl border border-[#9AA5B1]/20 bg-[#F8FAFC] p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#3E4C59]" />
                <h3 className="font-bold text-graphite text-sm sm:text-base">Registered Support Footprint</h3>
              </div>
              <div className="text-xs sm:text-sm text-slate space-y-2">
                <p>
                  <strong>Nairobi Engineering Headquarters:</strong> The Pavilion, 4th Floor, Lower Kabete Road, Westlands, Nairobi, Kenya.
                </p>
                <p>
                  <strong>Corporate Registry:</strong> Remote-first structure with legal registrations in the United Kingdom and West African operational hubs in Lagos, Nigeria.
                </p>
              </div>
            </div>
          </div>

          <NearestOffice />
        </section>
      </main>
      <Footer />
    </>
  );
}
