// src/app/news/NewsClient.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, Newspaper, Calendar, ArrowRight } from "lucide-react";

interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  readTime: string;
}

import { ARTICLES } from "./articles";

export function NewsClient() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#F4F6F8] border-b border-[#9AA5B1]/20">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3E4C59] hover:text-[#1B222C] transition-colors mb-6 sm:mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center text-[#1B222C] border border-[#9AA5B1]/20 shadow-sm">
              <Newspaper className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3E4C59]">
              Official Company News
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-[#1B222C] sm:text-4xl md:text-5xl">
            News &amp; Press Releases
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#3E4C59] max-w-2xl leading-relaxed">
            Latest announcements, technical engineering updates, and product releases from M&amp;F Technologies.
          </p>
        </div>
      </section>

      {/* Articles List */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-6 sm:gap-8">
          {ARTICLES.map((article) => (
            <article
              key={article.id}
              className="group rounded-xl border border-[#9AA5B1]/25 bg-white p-6 sm:p-8 transition-all hover:border-[#3E4C59] hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B7684]">
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

              <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-[#1B222C] group-hover:translate-x-1 transition-transform">
                <span>Read announcement</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
