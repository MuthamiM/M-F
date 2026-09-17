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
        {/* Hero Section */}
        <section className="bg-[#F4F6F8] border-b border-[#9AA5B1]/20">
          <div className="w-full px-4 py-12 sm:px-8 lg:px-12 sm:py-20 max-w-5xl mx-auto">
            <Breadcrumbs items={[{ label: "News & Insights" }]} />

            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center text-[#1B222C] border border-[#9AA5B1]/20 shadow-sm">
                <Newspaper className="h-5 w-5 text-[#1B222C]" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#3E4C59]">
                Systems Engineering &amp; Operational Publications
              </span>
            </div>

            <h1 className="font-display text-3xl font-bold tracking-tight text-[#1B222C] sm:text-4xl md:text-5xl leading-tight">
              Engineering Publications, Architecture &amp; Technical Announcements
            </h1>
            <p className="mt-4 text-sm sm:text-base text-[#3E4C59] max-w-3xl leading-relaxed">
              Explore in-depth technical whitepapers, distributed double-entry ledger specifications, high-throughput credit scoring benchmarks, and institutional compliance standards authored by the M&amp;F Technologies engineering group.
            </p>

            {/* Credibility & E-E-A-T Highlights */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-[#3E4C59] pt-6 border-t border-[#9AA5B1]/20">
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

        {/* Articles Directory Section */}
        <section className="w-full px-4 py-16 sm:px-8 lg:px-12 sm:py-24 max-w-5xl mx-auto">
          <div className="flex flex-col gap-8">
            {ARTICLES.map((article) => (
              <article
                key={article.id}
                className="group rounded-2xl border border-[#9AA5B1]/25 bg-white p-6 sm:p-10 transition-all duration-300 hover:border-[#1B222C] hover:shadow-lg"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#6B7684]">
                  <span className="rounded-full bg-[#F4F6F8] px-3.5 py-1 font-semibold text-[#1B222C] border border-[#9AA5B1]/25">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <time dateTime={article.date}>{article.date}</time>
                    </span>
                    <span className="text-[#9AA5B1]">&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{article.readTime}</span>
                    </span>
                  </div>
                </div>

                <h2 className="mt-4 font-display text-xl sm:text-2xl font-bold text-[#1B222C] group-hover:text-[#3E4C59] transition-colors leading-snug">
                  <Link href={`/news/${article.id}`} className="hover:underline">
                    {article.title}
                  </Link>
                </h2>

                <p className="mt-3 text-sm sm:text-base text-[#3E4C59] leading-relaxed">
                  {article.summary}
                </p>

                <div className="mt-6 pt-5 border-t border-[#9AA5B1]/15 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-[#6B7684]">
                    Authored by <strong className="text-[#1B222C] font-semibold">Musa Mutindi &amp; Engineering Review Board</strong>
                  </span>

                  <Link
                    href={`/news/${article.id}`}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1B222C] hover:text-[#3E4C59] group-hover:translate-x-0.5 transition-all"
                  >
                    <span>Read Full Technical Publication</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Institutional Engineering Resource Card */}
          <div className="mt-16 rounded-2xl border border-[#9AA5B1]/25 bg-[#F8FAFC] p-8 sm:p-10">
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
