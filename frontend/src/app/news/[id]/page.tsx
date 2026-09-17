// src/app/news/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  BookOpen, 
  FileText,
  Lock,
  Server
} from "lucide-react";
import { ARTICLES } from "../articles";
import { Nav } from "@/features/landing/components/Nav";
import { Footer } from "@/features/landing/components/Footer";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import { ShareButton } from "./ShareButton";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({
    id: article.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = ARTICLES.find((a) => a.id === id);
  if (!article) {
    return { title: "Article Not Found" };
  }
  return {
    title: `${article.title} — M&F Technologies Engineering`,
    description: article.summary,
    alternates: {
      canonical: `https://mftechnologies.org/news/${article.id}`,
    },
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      publishedTime: article.date,
      authors: ["Musa Mutindi", "M&F Technologies Systems Engineering Group"],
      url: `https://mftechnologies.org/news/${article.id}`,
      siteName: "M&F Technologies",
      images: [
        {
          url: "https://mftechnologies.org/og-image.png",
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      images: ["https://mftechnologies.org/og-image.png"],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = ARTICLES.find((a) => a.id === id);

  if (!article) {
    notFound();
  }

  // Related articles: same category first or closest recent articles, excluding current
  const related = ARTICLES.filter((a) => a.id !== article.id)
    .sort((a, b) => {
      if (a.category === article.category && b.category !== article.category) return -1;
      if (a.category !== article.category && b.category === article.category) return 1;
      return 0;
    })
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: article.title,
    description: article.summary,
    datePublished: article.date,
    dateModified: article.date,
    articleSection: article.category,
    inLanguage: "en-US",
    mainEntityOfPage: `https://mftechnologies.org/news/${article.id}`,
    author: [
      {
        "@type": "Person",
        name: "Musa Mutindi",
        jobTitle: "Founder & Principal Systems Architect",
        url: "https://mftechnologies.org/about",
        worksFor: {
          "@type": "Organization",
          name: "M&F Technologies",
          url: "https://mftechnologies.org",
        },
      },
      {
        "@type": "Organization",
        name: "M&F Technologies Systems Engineering Group",
        url: "https://mftechnologies.org",
      },
    ],
    publisher: {
      "@type": "Organization",
      name: "M&F Technologies",
      url: "https://mftechnologies.org",
      logo: {
        "@type": "ImageObject",
        url: "https://mftechnologies.org/icon-v2-512.png",
      },
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
        {/* Header Banner - Edge to Edge */}
        <header className="w-full bg-[#F4F6F8] border-b border-[#9AA5B1]/20">
          <div className="w-full px-4 sm:px-8 lg:px-12 py-10 sm:py-16">
            <Breadcrumbs
              items={[
                { label: "News & Insights", href: "/news" },
                { label: article.title },
              ]}
            />

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7684] mb-4">
              <span className="rounded-full bg-[#1B222C] text-white px-3 py-1 font-semibold text-[11px] tracking-wide">
                {article.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <time dateTime={article.date}>{article.date}</time>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{article.readTime}</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 font-medium text-[#1B222C]">
                <User className="h-3.5 w-3.5" />
                <span>Musa Mutindi &amp; Systems Engineering</span>
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-[#1B222C] leading-tight tracking-tight">
              {article.title}
            </h1>

            {/* Lead Summary Callout */}
            <div className="mt-6 rounded-xl border border-[#9AA5B1]/25 bg-white p-5 sm:p-6 text-[#3E4C59] text-sm sm:text-base leading-relaxed italic shadow-sm">
              &ldquo;{article.summary}&rdquo;
            </div>
          </div>
        </header>

        {/* Main Article Body & Sidebar Layout - Edge to Edge */}
        <div className="w-full px-4 sm:px-8 lg:px-12 py-10 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Main Article Text */}
            <article className="lg:col-span-8 xl:col-span-9 space-y-6 text-[#3E4C59] text-sm sm:text-base leading-relaxed">
              {article.body.split("\n\n").map((block, bIdx) => {
                // Subheadings: lines wrapped in **
                if (block.startsWith("**") && block.endsWith("**") && !block.includes("\n")) {
                  const headingText = block.replace(/\*\*/g, "");
                  return (
                    <h2
                      key={bIdx}
                      className="font-display text-xl sm:text-2xl font-bold text-[#1B222C] pt-6 pb-2 border-b border-[#9AA5B1]/20 mt-4"
                    >
                      {headingText}
                    </h2>
                  );
                }

                // Bullet lists
                if (block.startsWith("- ") || block.includes("\n- ")) {
                  const items = block.split("\n").filter((l) => l.trim().startsWith("- "));
                  return (
                    <ul key={bIdx} className="space-y-3 pl-4 border-l-2 border-[#1B222C]/20 my-4">
                      {items.map((item, iIdx) => {
                        const text = item.replace(/^- /, "");
                        const parts = text.split("**");
                        return (
                          <li key={iIdx} className="leading-relaxed text-[#3E4C59]">
                            {parts.length >= 3 ? (
                              <>
                                <strong className="text-[#1B222C] font-semibold">{parts[1]}</strong>
                                {parts.slice(2).join("")}
                              </>
                            ) : (
                              text
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  );
                }

                // Numbered lists (1. , 2. )
                if (/^\d+\.\s/.test(block)) {
                  const items = block.split("\n").filter((l) => /^\d+\.\s/.test(l.trim()));
                  return (
                    <ol key={bIdx} className="list-decimal pl-6 space-y-2.5 my-4">
                      {items.map((item, iIdx) => (
                        <li key={iIdx} className="leading-relaxed text-[#3E4C59]">
                          {item.replace(/^\d+\.\s/, "")}
                        </li>
                      ))}
                    </ol>
                  );
                }

                // Paragraphs with inline bold formatting
                const formattedParagraph = block.split("**").map((chunk, cIdx) =>
                  cIdx % 2 === 1 ? (
                    <strong key={cIdx} className="text-[#1B222C] font-semibold">
                      {chunk}
                    </strong>
                  ) : (
                    chunk
                  )
                );

                return (
                  <p key={bIdx} className="leading-relaxed">
                    {formattedParagraph}
                  </p>
                );
              })}

              {/* Author Bio Box (E-E-A-T Credibility) */}
              <div className="mt-12 rounded-2xl border border-[#9AA5B1]/25 bg-[#F8FAFC] p-6 sm:p-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#1B222C] text-white flex items-center justify-center font-bold text-base shrink-0">
                    MM
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-[#1B222C] text-base sm:text-lg">
                        Musa Mutindi
                      </h3>
                      <span className="rounded bg-[#E4E7EB] px-2 py-0.5 text-[10px] font-bold text-[#1B222C] uppercase tracking-wider">
                        Founder &amp; Principal Architect
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#3E4C59] leading-relaxed">
                      Musa oversees core platform architecture, transactional double-entry ledger engines, and algorithmic credit underwriting models at M&amp;F Technologies. With deep experience in distributed banking middleware across Sub-Saharan Africa, his work centers on institutional financial resilience and high-throughput ledger fault tolerance.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#9AA5B1]/20 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#3E4C59]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Peer-reviewed by M&amp;F Systems Engineering Board</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Audited against SOC 2 Type II &amp; ISO/IEC 27001</span>
                  </div>
                </div>
              </div>

              {/* Editorial Disclosure & Integrity Notice */}
              <div className="rounded-xl border border-[#9AA5B1]/20 bg-white p-5 text-xs text-[#6B7684] space-y-2">
                <div className="flex items-center gap-2 text-[#1B222C] font-semibold">
                  <BookOpen className="h-4 w-4 text-[#1B222C]" />
                  <span>Editorial Integrity &amp; Research Standards</span>
                </div>
                <p className="leading-relaxed">
                  Publications on the M&amp;F Technologies Engineering portal undergo rigorous technical validation against production benchmarks, unit test suites, and cryptographic ledger simulations. We do not accept sponsored placements or paid editorial endorsements. Technical inquiries, errata notifications, or peer feedback can be submitted directly to our engineering desk at{" "}
                  <a href="mailto:engineering@mftechnologies.org" className="text-[#1B222C] underline font-medium">
                    engineering@mftechnologies.org
                  </a>.
                </p>
              </div>

              {/* Share / Back Bar */}
              <div className="pt-8 mt-8 border-t border-[#9AA5B1]/20 flex flex-wrap items-center justify-between gap-4">
                <Link
                  href="/news"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3E4C59] hover:text-[#1B222C] transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to all engineering publications</span>
                </Link>

                <ShareButton />
              </div>
            </article>

            {/* Sticky Aside / Article Info */}
            <aside className="lg:col-span-4 xl:col-span-3 space-y-6 lg:sticky lg:top-24">
              <div className="rounded-xl border border-[#9AA5B1]/25 bg-[#F8FAFC] p-5 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7684]">
                  Publication Details
                </h3>
                <div className="text-xs text-[#3E4C59] space-y-2">
                  <div>
                    <span className="font-semibold text-[#1B222C]">Published:</span> {article.date}
                  </div>
                  <div>
                    <span className="font-semibold text-[#1B222C]">Category:</span> {article.category}
                  </div>
                  <div>
                    <span className="font-semibold text-[#1B222C]">Author:</span> Musa Mutindi
                  </div>
                  <div>
                    <span className="font-semibold text-[#1B222C]">Review:</span> Systems Board
                  </div>
                  <div>
                    <span className="font-semibold text-[#1B222C]">Status:</span> Production Verified
                  </div>
                </div>

                <div className="border-t border-[#9AA5B1]/20 pt-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B222C]">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Developer Sandbox</span>
                  </div>
                  <p className="text-[11px] text-[#3E4C59] leading-relaxed">
                    Test our lending APIs in an isolated sandbox with mock loan portfolios and real-time ledger simulation.
                  </p>
                  <Link
                    href="/docs"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1B222C] hover:underline"
                  >
                    <span>Explore API Reference</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="border-t border-[#9AA5B1]/20 pt-4 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B222C]">
                    <Server className="h-3.5 w-3.5" />
                    <span>Institutional Security</span>
                  </div>
                  <p className="text-[11px] text-[#3E4C59] leading-relaxed">
                    Review our SOC 2 Type II compliance framework, AES-256-GCM encryption, and RBAC policies.
                  </p>
                  <Link
                    href="/security"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1B222C] hover:underline"
                  >
                    <span>Read Security Paper</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="border-t border-[#9AA5B1]/20 pt-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B222C]">
                    <FileText className="h-3.5 w-3.5" />
                    <span>Official Profile</span>
                  </div>
                  <p className="text-[11px] text-[#3E4C59] leading-relaxed">
                    Download our official corporate capabilities overview and architecture whitepaper.
                  </p>
                  <Link
                    href="/company-profile"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1B222C] hover:underline"
                  >
                    <span>View Company Profile</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Related Articles Section - Edge to Edge */}
        {related.length > 0 && (
          <section className="w-full bg-[#F4F6F8] border-t border-[#9AA5B1]/20 py-12 sm:py-18">
            <div className="w-full px-4 sm:px-8 lg:px-12 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B7684]">
                    Further Reading
                  </span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1B222C] mt-1">
                    Related Technical Announcements
                  </h2>
                </div>
                <Link
                  href="/news"
                  className="text-xs font-bold text-[#3E4C59] hover:text-[#1B222C] transition-colors"
                >
                  View all articles &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((rel) => (
                  <article
                    key={rel.id}
                    className="rounded-xl border border-[#9AA5B1]/20 bg-white p-5 flex flex-col justify-between hover:shadow-md hover:border-[#1B222C] transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[11px] text-[#6B7684]">
                        <span className="rounded bg-[#F4F6F8] px-2 py-0.5 font-semibold text-[#1B222C] border border-[#9AA5B1]/20">
                          {rel.category}
                        </span>
                        <span>{rel.readTime}</span>
                      </div>

                      <h3 className="font-bold text-[#1B222C] text-sm sm:text-base line-clamp-2 leading-snug">
                        {rel.title}
                      </h3>

                      <p className="text-xs text-[#3E4C59] line-clamp-3 leading-relaxed">
                        {rel.summary}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#9AA5B1]/20">
                      <Link
                        href={`/news/${rel.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#1B222C] hover:underline"
                      >
                        <span>Read full article</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
