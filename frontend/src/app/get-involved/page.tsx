import Link from "next/link";
import { Handshake, Lightbulb, Users2, ArrowRight } from "lucide-react";
import { ARTICLES } from "../news/articles";
import { Nav } from "@/features/landing/components/Nav";
import { Footer } from "@/features/landing/components/Footer";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";

export const metadata = {
  title: "Get Involved — Partner Program & Advisory | M&F Technologies",
  description: "Collaborate with M&F Technologies. Join our system integration partner program, institutional advisory board, or academic research initiatives.",
};

export default function GetInvolved() {
  const preview = ARTICLES.slice(0, 2);

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-white">
        {/* Hero Header */}
        <section className="bg-cloud border-b border-fog/20">
          <div className="w-full px-4 py-12 sm:px-8 lg:px-12 sm:py-20">
            <Breadcrumbs items={[{ label: "Get Involved" }]} />

            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center text-[#1B222C] border border-[#9AA5B1]/20 shadow-sm">
                <Handshake className="h-5 w-5 text-[#1B222C]" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#3E4C59]">
                Partner Program &amp; Advisory
              </span>
            </div>

            <h1 className="font-display text-3xl font-bold text-graphite sm:text-4xl md:text-5xl leading-tight">
              Collaborate with M&amp;F Technologies
            </h1>
            <p className="mt-4 text-sm sm:text-base text-slate max-w-2xl leading-relaxed">
              We partner with regional banks, microfinance networks, integration agencies, and academic researchers to advance financial inclusion and scale transactional technology.
            </p>
          </div>
        </section>

        {/* Collaboration Tracks */}
        <section className="w-full px-4 py-16 sm:px-8 lg:px-12 sm:py-24 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Track 1 */}
            <div className="rounded-xl border border-[#9AA5B1]/20 bg-white p-6 sm:p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
              <div className="h-10 w-10 rounded-lg bg-cloud flex items-center justify-center text-graphite border border-fog/10">
                <Users2 className="h-5 w-5" />
              </div>
              <h2 className="font-bold text-graphite text-base sm:text-lg">System Integration Partners</h2>
              <p className="text-xs sm:text-sm text-slate leading-relaxed">
                For tech agencies and system integrators deploying banking middleware. Get access to developer support channels, custom sandbox accounts, and early SDK releases to assist commercial bank migrations.
              </p>
            </div>

            {/* Track 2 */}
            <div className="rounded-xl border border-[#9AA5B1]/20 bg-white p-6 sm:p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
              <div className="h-10 w-10 rounded-lg bg-cloud flex items-center justify-center text-graphite border border-fog/10">
                <Lightbulb className="h-5 w-5" />
              </div>
              <h2 className="font-bold text-graphite text-base sm:text-lg">Institutional Advisory</h2>
              <p className="text-xs sm:text-sm text-slate leading-relaxed">
                We welcome banking compliance specialists, risk officers, and policy advisors to our advisory board, helping shape our regulatory auto-reporting schema updates and scoring trees.
              </p>
            </div>

            {/* Track 3 */}
            <div className="rounded-xl border border-[#9AA5B1]/20 bg-white p-6 sm:p-8 space-y-4 shadow-sm hover:shadow-md transition-all">
              <div className="h-10 w-10 rounded-lg bg-cloud flex items-center justify-center text-graphite border border-fog/10">
                <Handshake className="h-5 w-5" />
              </div>
              <h2 className="font-bold text-graphite text-base sm:text-lg">Academic &amp; Policy Research</h2>
              <p className="text-xs sm:text-sm text-slate leading-relaxed">
                Collaborate on alternative data scoring trees. We share aggregated, de-identified transaction patterns with academic bodies researching access to credit and credit scoring performance.
              </p>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="rounded-xl bg-[#1B222C] text-white p-8 sm:p-10 text-center space-y-4 max-w-3xl mx-auto">
            <h3 className="text-lg sm:text-xl font-bold">Interested in partnership opportunities?</h3>
            <p className="text-xs sm:text-sm text-[#9AA5B1] leading-relaxed max-w-xl mx-auto">
              Email us directly at <span className="font-mono text-white font-semibold">partnerships@mftechnologies.org</span> or send an inquiry via our contact channel. Let&apos;s build financial infrastructure together.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 rounded-lg bg-white px-5 py-2.5 text-xs font-bold text-[#1B222C] hover:bg-[#E4E7EB] transition-all shadow-sm"
              >
                <span>Go to Contact Page</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* News Preview Section */}
          <div className="border-t border-[#9AA5B1]/20 pt-16 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-graphite sm:text-2xl">
                Latest Operational Updates
              </h2>
              <Link
                href="/news"
                className="text-xs font-bold text-[#3E4C59] hover:text-[#1B222C] transition-colors"
              >
                See all announcements
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {preview.map((a) => (
                <article key={a.id} className="rounded-xl border border-[#9AA5B1]/20 bg-white p-6 space-y-3">
                  <div className="text-[10px] uppercase font-bold text-[#6B7684] tracking-wider">
                    {a.category} &bull; {a.date}
                  </div>
                  <h3 className="font-bold text-[#1B222C] text-sm sm:text-base leading-snug">{a.title}</h3>
                  <p className="text-xs text-[#3E4C59] leading-relaxed line-clamp-2">{a.summary}</p>
                  <div className="pt-2">
                    <Link
                      href={`/news/${a.id}`}
                      className="text-xs font-bold text-[#1B222C] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Read article</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
