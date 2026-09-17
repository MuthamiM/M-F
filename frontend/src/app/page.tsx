// src/app/page.tsx
import { Nav } from "@/features/landing/components/Nav";
import { Hero } from "@/features/landing/components/Hero";
import { About } from "@/features/landing/components/About";
import { Services } from "@/features/landing/components/Services";
import { Footer } from "@/features/landing/components/Footer";
import { ScrollAnimate } from "@/shared/components/ScrollAnimate";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { ARTICLES } from "@/app/news/articles";

const operatingPrinciples = [
  {
    title: "Start with the lending journey",
    text: "We map the full path from application and identity checks through approval, disbursement, repayment, and collections. That gives every team a shared view of the customer and the controls around each decision.",
  },
  {
    title: "Make decisions explainable",
    text: "Credit policies are easier to govern when every score, rule, override, and approval has a traceable reason. Our systems keep decision data available for operations, risk, and compliance teams.",
  },
  {
    title: "Integrate without replacing everything",
    text: "Banks and credit providers can connect existing core systems, payment rails, bureaus, and identity services through well-defined APIs while modernizing the workflows that need the most attention.",
  },
];

export default function HomePage() {
  const featuredArticles = ARTICLES.slice(0, 3);

  return (
    <>
      <Nav />
      <main className="overflow-x-hidden">
        <Hero />
        <ScrollAnimate>
          <About />
        </ScrollAnimate>
        <ScrollAnimate>
          <Services />
        </ScrollAnimate>
        <section className="bg-graphite px-4 py-20 text-white sm:px-8 sm:py-28 lg:px-12" aria-labelledby="approach-heading">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">Our approach</span>
              <h2 id="approach-heading" className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
                Practical infrastructure for responsible growth
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-mist sm:text-base">
                Financial technology should make good decisions easier to repeat, inspect, and improve. We pair domain knowledge with dependable engineering so teams can move faster without losing control.
              </p>
              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-mist"
              >
                Learn about M&amp;F Technologies
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="divide-y divide-white/15 border-y border-white/15">
              {operatingPrinciples.map((principle) => (
                <article key={principle.title} className="grid gap-4 py-7 sm:grid-cols-[1fr_1.5fr] sm:gap-10">
                  <h3 className="flex items-start gap-3 text-lg font-semibold text-white">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-mist" aria-hidden="true" />
                    {principle.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-mist">{principle.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Engineering & Financial Insights */}
        <section className="bg-white px-4 py-20 sm:px-8 sm:py-28 lg:px-12 border-b border-fog/20" aria-labelledby="insights-heading">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate">Engineering &amp; Industry Publications</span>
                <h2 id="insights-heading" className="mt-3 font-display text-3xl font-bold tracking-tight text-graphite sm:text-4xl">
                  Latest Insights &amp; Operational Reports
                </h2>
                <p className="mt-2 text-sm text-slate max-w-xl">
                  Explore peer-reviewed systems documentation, double-entry ledger audits, and real-time fintech infrastructure benchmarks.
                </p>
              </div>
              <Link
                href="/news"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-graphite hover:text-slate transition-colors shrink-0 group"
              >
                <span>Browse all publications</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {featuredArticles.map((article) => (
                <article
                  key={article.id}
                  className="rounded-xl border border-fog/20 bg-cloud/40 hover:bg-cloud/70 p-6 flex flex-col justify-between transition-all hover:border-slate/40 hover:shadow-sm group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate">
                      <span className="rounded-full bg-white px-2.5 py-0.5 border border-fog/20 text-graphite">
                        {article.category}
                      </span>
                      <span>{article.readTime}</span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-graphite group-hover:text-slate transition-colors line-clamp-2">
                      <Link href={`/news/${article.id}`}>
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-slate leading-relaxed line-clamp-3">
                      {article.summary}
                    </p>
                  </div>
                  <div className="pt-5 mt-4 border-t border-fog/15 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate">{article.date}</span>
                    <Link
                      href={`/news/${article.id}`}
                      className="font-semibold text-graphite group-hover:underline inline-flex items-center gap-1"
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
