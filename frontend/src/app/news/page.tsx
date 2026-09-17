// src/app/news/page.tsx
import Link from "next/link";
import { 
  Newspaper, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  BookOpen, 
  FileText 
} from "lucide-react";
import { Nav } from "@/features/landing/components/Nav";
import { Footer } from "@/features/landing/components/Footer";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import { ARTICLES } from "./articles";

export const metadata = {
  title: "Engineering Publications, Systems Research & Technical News — M&F Technologies",
  description: "Official technical publications, core lending benchmarks, distributed double-entry ledger architecture, and institutional engineering research from M&F Technologies.",
  alternates: {
    canonical: "https://mftechnologies.org/news",
  },
  openGraph: {
    title: "Engineering Publications & Research — M&F Technologies",
    description: "Official technical publications, core lending benchmarks, distributed double-entry ledger architecture, and institutional engineering research.",
    url: "https://mftechnologies.org/news",
    siteName: "M&F Technologies",
    type: "website",
    images: [
      {
        url: "https://mftechnologies.org/og-image.png",
        width: 1200,
        height: 630,
        alt: "M&F Technologies Engineering Publications",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Publications & Research — M&F Technologies",
    description: "Official technical publications, core lending benchmarks, distributed double-entry ledger architecture, and institutional engineering research.",
    images: ["https://mftechnologies.org/og-image.png"],
  },
};

export default function NewsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "M&F Technologies Engineering Publications & Technical Insights",
    description: "Official technical publications, core lending benchmarks, and financial systems engineering research from M&F Technologies.",
    url: "https://mftechnologies.org/news",
    publisher: {
      "@type": "Organization",
      name: "M&F Technologies",
      url: "https://mftechnologies.org",
      logo: {
        "@type": "ImageObject",
        url: "https://mftechnologies.org/icon-v2-512.png",
      },
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: ARTICLES.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://mftechnologies.org/news/${article.id}`,
        name: article.title,
        description: article.summary,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />

      <main className="min-h-screen bg-white">
        {/* Hero Section - Edge to Edge */}
        <section className="w-full bg-[#F4F6F8] border-b border-[#9AA5B1]/20">
          <div className="w-full px-4 sm:px-8 lg:px-12 py-12 sm:py-18">
            <Breadcrumbs items={[{ label: "News & Insights" }]} />

            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center text-[#1B222C] border border-[#9AA5B1]/20 shadow-sm">
                <Newspaper className="h-5 w-5 text-[#1B222C]" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#3E4C59]">
                Systems Engineering &amp; Operational Publications
              </span>
            </div>

            <h1 className="font-display text-3xl font-bold tracking-tight text-[#1B222C] sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
              Engineering Publications, Architecture &amp; Technical Announcements
            </h1>
            <p className="mt-4 text-sm sm:text-base text-[#3E4C59] max-w-4xl leading-relaxed">
              Explore in-depth technical whitepapers, distributed double-entry ledger specifications, high-throughput credit scoring benchmarks, and institutional compliance standards authored by the M&amp;F Technologies engineering group.
            </p>

            {/* Credibility & E-E-A-T Highlights */}
            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-[#3E4C59] pt-6 border-t border-[#9AA5B1]/20">
              <div className="flex items-center gap-1.5 font-medium text-[#1B222C]">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Production-Validated Telemetry</span>
              </div>
              <span className="text-[#9AA5B1]">&bull;</span>
              <div className="flex items-center gap-1.5 font-medium text-[#1B222C]">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>SOC 2 Type II Audited Architecture</span>
              </div>
              <span className="text-[#9AA5B1]">&bull;</span>
              <div className="flex items-center gap-1.5 font-medium text-[#1B222C]">
                <BookOpen className="h-4 w-4 text-emerald-600" />
                <span>Peer-Reviewed Engineering Standards</span>
              </div>
            </div>
          </div>
        </section>

        {/* Articles Directory Section - Full Width Front Edge to Edge */}
        <section className="w-full px-4 sm:px-8 lg:px-12 py-10 sm:py-16">
          {/* Top Featured Article - Full Width Banner */}
          {ARTICLES.length > 0 && (
            <article className="group rounded-2xl border-2 border-[#1B222C]/15 bg-white p-6 sm:p-10 transition-all duration-300 hover:border-[#1B222C] hover:shadow-xl w-full mb-8 sm:mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7684]">
                    <span className="rounded-full bg-[#1B222C] px-3.5 py-1 font-semibold text-white text-[11px] uppercase tracking-wider">
                      Featured Publication
                    </span>
                    <span className="rounded-full bg-[#F4F6F8] px-3 py-1 font-semibold text-[#1B222C] border border-[#9AA5B1]/25 text-[11px]">
                      {ARTICLES[0].category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="h-3.5 w-3.5" />
                      <time dateTime={ARTICLES[0].date}>{ARTICLES[0].date}</time>
                    </span>
                    <span className="text-[#9AA5B1]">&bull;</span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{ARTICLES[0].readTime}</span>
                    </span>
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1B222C] group-hover:text-[#3E4C59] transition-colors leading-tight">
                    <Link href={`/news/${ARTICLES[0].id}`} className="hover:underline">
                      {ARTICLES[0].title}
                    </Link>
                  </h2>

                  <p className="text-sm sm:text-base text-[#3E4C59] leading-relaxed">
                    {ARTICLES[0].summary}
                  </p>
                </div>

                <div className="lg:col-span-5 bg-[#F8FAFC] border border-[#9AA5B1]/20 rounded-xl p-6 space-y-4">
                  <div className="text-xs text-[#6B7684] space-y-2">
                    <div className="font-semibold text-[#1B222C]">Architecture Review &amp; Specification</div>
                    <p className="text-[11px] leading-relaxed text-[#3E4C59]">
                      Includes complete benchmark telemetry, API route specifications, and distributed ledger transaction diagrams.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#9AA5B1]/15 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-[#6B7684]">
                      By <strong className="text-[#1B222C]">Musa Mutindi &amp; Engineering Board</strong>
                    </span>
                    <Link
                      href={`/news/${ARTICLES[0].id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#1B222C] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#3E4C59] transition-all shadow-sm"
                    >
                      <span>Read Publication</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* Grid of Remaining Technical Publications - Edge to Edge */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 w-full">
            {ARTICLES.slice(1).map((article) => (
              <article
                key={article.id}
                className="group rounded-2xl border border-[#9AA5B1]/25 bg-white p-6 sm:p-8 transition-all duration-300 hover:border-[#1B222C] hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B7684]">
                    <span className="rounded-full bg-[#F4F6F8] px-3 py-1 font-semibold text-[#1B222C] border border-[#9AA5B1]/25 text-[11px]">
                      {article.category}
                    </span>
                    <div className="flex items-center gap-2.5 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <time dateTime={article.date}>{article.date}</time>
                      </span>
                      <span className="text-[#9AA5B1]">&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{article.readTime}</span>
                      </span>
                    </div>
                  </div>

                  <h2 className="mt-4 font-display text-lg sm:text-xl font-bold text-[#1B222C] group-hover:text-[#3E4C59] transition-colors leading-snug">
                    <Link href={`/news/${article.id}`} className="hover:underline">
                      {article.title}
                    </Link>
                  </h2>

                  <p className="mt-3 text-xs sm:text-sm text-[#3E4C59] leading-relaxed line-clamp-4">
                    {article.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#9AA5B1]/15 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] text-[#6B7684]">
                    By <strong className="text-[#1B222C] font-semibold">Musa Mutindi</strong>
                  </span>

                  <Link
                    href={`/news/${article.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1B222C] hover:text-[#3E4C59] group-hover:translate-x-0.5 transition-all"
                  >
                    <span>Read Publication</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Institutional Engineering Resource Card - Edge to Edge */}
          <div className="mt-16 sm:mt-20 w-full rounded-2xl border border-[#9AA5B1]/25 bg-[#F8FAFC] p-8 sm:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B7684]">
                  Institutional Resources
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1B222C]">
                  Need Custom Integration or Institutional Architecture Reviews?
                </h3>
                <p className="text-xs sm:text-sm text-[#3E4C59] leading-relaxed">
                  Our systems engineering team works directly with commercial banks, credit unions, and microfinance institutions to design bespoke core banking middleware and credit scoring pipelines.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-3">
                <Link
                  href="/request-demo"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1B222C] px-5 py-3 text-xs font-semibold text-white hover:bg-[#3E4C59] transition-all text-center shadow-sm"
                >
                  <span>Schedule Technical Demo</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/company-profile"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#9AA5B1]/30 bg-white px-5 py-3 text-xs font-semibold text-[#1B222C] hover:bg-[#F4F6F8] transition-all text-center"
                >
                  <FileText className="h-4 w-4" />
                  <span>Download Company Profile</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
