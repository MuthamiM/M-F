// src/app/news/[id]/ArticleDetailClient.tsx
"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Clock, ArrowRight, Share2, Check, User, Sparkles } from "lucide-react";
import { useState } from "react";
import type { Article } from "../articles";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";

interface ArticleDetailClientProps {
  article: Article;
  related: Article[];
}

export function ArticleDetailClient({ article, related }: ArticleDetailClientProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header Banner */}
      <section className="bg-cloud border-b border-fog/20">
        <div className="w-full px-4 py-12 sm:px-8 lg:px-12 sm:py-20 max-w-5xl mx-auto">
          <Breadcrumbs
            items={[
              { label: "News & Insights", href: "/news" },
              { label: article.title },
            ]}
          />

          <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7684] mb-4">
            <span className="rounded-full bg-[#1B222C] text-white px-3 py-1 font-semibold text-[11px]">
              {article.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {article.date}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {article.readTime}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 font-medium text-[#1B222C]">
              <User className="h-3.5 w-3.5" />
              M&amp;F Engineering Team
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-graphite leading-tight tracking-tight">
            {article.title}
          </h1>

          {/* Lead Summary Callout */}
          <div className="mt-6 rounded-xl border border-[#9AA5B1]/25 bg-white p-5 sm:p-6 text-slate text-sm sm:text-base leading-relaxed italic shadow-sm">
            &ldquo;{article.summary}&rdquo;
          </div>
        </div>
      </section>

      {/* Main Article Body & Sidebar Layout */}
      <section className="w-full px-4 py-12 sm:px-8 lg:px-12 sm:py-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          {/* Main Article Text */}
          <article className="lg:col-span-3 space-y-6 text-[#3E4C59] text-sm sm:text-base leading-relaxed">
            {article.body.split("\n\n").map((block, bIdx) => {
              // Markdown subheadings (e.g. **Heading**)
              if (block.startsWith("**") && block.endsWith("**") && !block.includes("\n")) {
                return (
                  <h2
                    key={bIdx}
                    className="font-display text-xl sm:text-2xl font-bold text-graphite pt-6 pb-2 border-b border-[#9AA5B1]/20"
                  >
                    {block.replace(/\*\*/g, "")}
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
                        <li key={iIdx} className="leading-relaxed text-slate">
                          {parts.length >= 3 ? (
                            <>
                              <strong className="text-graphite font-semibold">{parts[1]}</strong>
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
                      <li key={iIdx} className="leading-relaxed text-slate">
                        {item.replace(/^\d+\.\s/, "")}
                      </li>
                    ))}
                  </ol>
                );
              }

              // Paragraphs with inline bold formatting
              const formattedParagraph = block.split("**").map((chunk, cIdx) =>
                cIdx % 2 === 1 ? (
                  <strong key={cIdx} className="text-graphite font-semibold">
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

            {/* Share / Back Bar */}
            <div className="pt-8 mt-8 border-t border-[#9AA5B1]/20 flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/news"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3E4C59] hover:text-[#1B222C] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to all announcements</span>
              </Link>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#9AA5B1]/30 bg-[#F4F6F8] px-3.5 py-1.5 text-xs font-semibold text-[#1B222C] hover:bg-[#E4E7EB] transition-all cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
                <span>{copied ? "Link Copied!" : "Share Article"}</span>
              </button>
            </div>
          </article>

          {/* Sticky Aside / Article Info */}
          <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
            <div className="rounded-xl border border-[#9AA5B1]/25 bg-[#F8FAFC] p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7684]">
                About This Release
              </h3>
              <div className="text-xs text-slate space-y-2">
                <div>
                  <span className="font-semibold text-[#1B222C]">Published:</span> {article.date}
                </div>
                <div>
                  <span className="font-semibold text-[#1B222C]">Category:</span> {article.category}
                </div>
                <div>
                  <span className="font-semibold text-[#1B222C]">Author:</span> Systems Engineering
                </div>
              </div>

              <div className="border-t border-[#9AA5B1]/20 pt-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B222C] mb-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Developer Sandbox</span>
                </div>
                <p className="text-[11px] text-slate leading-relaxed mb-3">
                  Test our lending API endpoints in an isolated sandbox with mock data.
                </p>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#1B222C] hover:underline"
                >
                  <span>Explore API Reference</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related Articles Section */}
      {related.length > 0 && (
        <section className="w-full bg-[#F4F6F8] border-t border-[#9AA5B1]/20 py-16 sm:py-20">
          <div className="w-full px-4 sm:px-8 lg:px-12 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B7684]">
                  Further Reading
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-graphite mt-1">
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
  );
}
