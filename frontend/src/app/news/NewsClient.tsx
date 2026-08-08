// src/app/news/NewsClient.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Newspaper, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { ARTICLES } from "./articles";

export function NewsClient() {
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedArticleId((prev) => (prev === id ? null : id));
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
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
              <Newspaper className="h-5 w-5 text-[#1B222C]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3E4C59]">
              Official Company News
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-[#1B222C] sm:text-4xl md:text-5xl leading-tight">
            News, Technical Insights &amp; Announcements
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#3E4C59] max-w-2xl leading-relaxed">
            Latest operational details, technical engineering updates, database benchmarks, and official institutional announcements from the M&amp;F Technologies product team.
          </p>
        </div>
      </section>

      {/* Articles List */}
      <section className="w-full px-4 py-16 sm:px-8 lg:px-12 sm:py-24">
        <div className="flex flex-col gap-8">
          {ARTICLES.map((article) => {
            const isExpanded = expandedArticleId === article.id;
            return (
              <article
                key={article.id}
                className="group rounded-2xl border border-[#9AA5B1]/25 bg-white p-6 sm:p-10 transition-all duration-300 hover:border-[#1B222C] hover:shadow-md cursor-pointer"
                onClick={() => toggleExpand(article.id)}
              >
                <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#6B7684]">
                  <span className="rounded-full bg-[#F4F6F8] px-3 py-1 font-semibold text-[#1B222C] border border-[#9AA5B1]/20">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {article.date}
                    </span>
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h2 className="mt-4 font-display text-xl sm:text-2xl font-bold text-[#1B222C] group-hover:text-[#3E4C59] transition-colors leading-snug">
                  {article.title}
                </h2>

                <p className="mt-3 text-sm sm:text-base text-[#3E4C59] leading-relaxed">
                  {article.summary}
                </p>

                {/* Expanded Body Content */}
                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-[#9AA5B1]/20 text-xs sm:text-sm text-[#3E4C59] space-y-4 animate-in fade-in duration-200">
                    {article.body.split("\n\n").map((para, pIdx) => {
                      if (para.startsWith("- **")) {
                        // Render lists
                        return (
                          <ul key={pIdx} className="list-disc pl-5 space-y-2">
                            {para.split("\n").map((li, lIdx) => (
                              <li key={lIdx} className="leading-relaxed">
                                {li.replace("- ", "").replace(/\*\*/g, "")}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      return (
                        <p key={pIdx} className="leading-relaxed whitespace-pre-line">
                          {para}
                        </p>
                      );
                    })}
                  </div>
                )}

                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#1B222C]">
                  <span>{isExpanded ? "Collapse announcement" : "Read full announcement"}</span>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
