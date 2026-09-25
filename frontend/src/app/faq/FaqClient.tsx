// src/app/faq/FaqClient.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  Shield,
  Layers,
  Cpu,
  Clock,
  MessageSquare,
  FileQuestion,
} from "lucide-react";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";
import { FAQ_ITEMS, FAQ_CATEGORIES } from "@/shared/data/faqData";

export function FaqClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "faq-what-is-mf": true,
    "faq-cloud-vs-onprem": true,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const allOpen: Record<string, boolean> = {};
    FAQ_ITEMS.forEach((item) => {
      allOpen[item.id] = true;
    });
    setOpenItems(allOpen);
  };

  const collapseAll = () => {
    setOpenItems({});
  };

  const filteredItems = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      if (activeCategory !== "all" && item.category !== activeCategory) {
        return false;
      }
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const inQuestion = item.question.toLowerCase().includes(q);
      const inAnswer = item.answer.toLowerCase().includes(q);
      const inKeywords = item.keywords.some((kw) => kw.toLowerCase().includes(q));
      const inBullets = item.bulletPoints?.some((bp) => bp.toLowerCase().includes(q));

      return inQuestion || inAnswer || inKeywords || inBullets;
    });
  }, [activeCategory, searchQuery]);

  const handleOpenChat = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-mf-chat"));
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8]/60 pb-20">
      {/* Hero Header */}
      <section className="bg-[#1B222C] text-white pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-[#CBD2D9] font-medium">
            <span className="font-bold">?</span>
            <span>Institutional Lending Technology FAQ</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Frequently Asked Questions
          </h1>

          <p className="text-sm sm:text-base text-[#CBD2D9] max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about M&amp;F Technologies core lending engine, automated credit scoring, security architecture, and regulatory compliance.
          </p>

          {/* Search Bar in Hero */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9AA5B1]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, e.g. 'credit scoring', 'SLA', 'API', 'CRB'..."
                className="w-full pl-11 pr-10 py-3 text-sm sm:text-base bg-white text-[#1B222C] rounded-xl shadow-xl placeholder:text-[#9AA5B1] focus:outline-none focus:ring-2 focus:ring-[#9AA5B1] border-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9AA5B1] hover:text-[#1B222C] p-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />

        {/* Quick Highlights / Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-8">
          <div className="bg-white p-4 rounded-xl border border-[#E4E7EB] shadow-xs flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#F4F6F8] text-[#1B222C] border border-[#CBD2D9] flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-[#6B7684] font-medium">Uptime Guarantee</p>
              <p className="text-sm font-bold text-[#1B222C]">99.95% SLA</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E4E7EB] shadow-xs flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#F4F6F8] text-[#1B222C] border border-[#CBD2D9] flex items-center justify-center shrink-0">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-[#6B7684] font-medium">Scoring Speed</p>
              <p className="text-sm font-bold text-[#1B222C]">&lt; 3 Seconds</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E4E7EB] shadow-xs flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#F4F6F8] text-[#1B222C] border border-[#CBD2D9] flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-[#6B7684] font-medium">Security</p>
              <p className="text-sm font-bold text-[#1B222C]">AES-256 / SOC 2</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E4E7EB] shadow-xs flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#F4F6F8] text-[#1B222C] border border-[#CBD2D9] flex items-center justify-center shrink-0">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-[#6B7684] font-medium">Core Banking</p>
              <p className="text-sm font-bold text-[#1B222C]">Temenos, Finacle+</p>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {FAQ_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#1B222C] text-white shadow-xs"
                    : "bg-white text-[#3E4C59] hover:bg-[#E4E7EB] border border-[#CBD2D9]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Action Controls (Count + Expand All) */}
        <div className="flex items-center justify-between text-xs text-[#6B7684] mt-4 mb-3 px-1">
          <span>
            Showing <strong>{filteredItems.length}</strong> {filteredItems.length === 1 ? "question" : "questions"}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={expandAll}
              className="hover:text-[#1B222C] hover:underline font-medium cursor-pointer"
            >
              Expand All
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={collapseAll}
              className="hover:text-[#1B222C] hover:underline font-medium cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E4E7EB] p-12 text-center space-y-4">
              <FileQuestion className="h-12 w-12 text-[#9AA5B1] mx-auto" />
              <h3 className="text-base font-bold text-[#1B222C]">No questions found matching your search</h3>
              <p className="text-xs sm:text-sm text-[#6B7684] max-w-md mx-auto">
                We couldn&apos;t find an answer matching &quot;{searchQuery}&quot;. Our technical advisors are available to answer your specific infrastructure questions.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#E4E7EB] hover:bg-[#CBD2D9] text-[#1B222C] transition-colors"
                >
                  Clear Search
                </button>
                <button
                  type="button"
                  onClick={handleOpenChat}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#1B222C] hover:bg-[#3E4C59] text-white transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Ask Live Chat</span>
                </button>
              </div>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isExpanded = !!openItems[item.id];
              return (
                <article
                  key={item.id}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? "bg-white border-[#CBD2D9] shadow-sm"
                      : "bg-white border-[#E4E7EB] hover:border-[#CBD2D9]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isExpanded}
                    className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 cursor-pointer"
                  >
                    <div className="space-y-1.5">
                      <span className="inline-block text-[10px] font-semibold text-[#3E4C59] bg-[#E4E7EB] px-2.5 py-0.5 rounded border border-[#CBD2D9]">
                        {item.categoryLabel}
                      </span>
                      <h2 className="text-sm sm:text-base font-bold text-[#1B222C] leading-snug">
                        {item.question}
                      </h2>
                    </div>
                    <div
                      className={`p-1.5 rounded text-[#6B7684] transition-transform duration-200 shrink-0 ${
                        isExpanded ? "rotate-180 text-[#1B222C] bg-[#E4E7EB]" : ""
                      }`}
                    >
                      <ChevronDown className="h-5 w-5" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 pt-1 border-t border-[#E4E7EB] space-y-3.5 text-xs sm:text-sm text-[#3E4C59] leading-relaxed">
                          <p>{item.answer}</p>

                          {item.bulletPoints && item.bulletPoints.length > 0 && (
                            <ul className="space-y-2 pt-1 pl-1">
                              {item.bulletPoints.map((bp, idx) => (
                                <li key={idx} className="flex items-start gap-2.5 text-[#3E4C59]">
                                  <CheckCircle2 className="h-4 w-4 text-[#1B222C] shrink-0 mt-0.5" />
                                  <span>{bp}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {item.actionLink && (
                            <div className="pt-2">
                              <Link
                                href={item.actionLink.href}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B222C] hover:text-[#3E4C59] underline underline-offset-4 decoration-[#CBD2D9] hover:decoration-[#1B222C] group"
                              >
                                <span>{item.actionLink.label}</span>
                                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                              </Link>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              );
            })
          )}
        </div>

        {/* CTA Contact Footer Box */}
        <div className="mt-12 bg-[#1B222C] rounded-2xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-[#3E4C59]">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">Have a technical architecture question?</h3>
            <p className="text-xs sm:text-sm text-[#CBD2D9] max-w-lg leading-relaxed">
              Our core infrastructure specialists and credit risk engineers can review your integration requirements, custom bureau models, and sandbox access.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleOpenChat}
              className="w-full sm:w-auto px-5 py-3 rounded-lg bg-white hover:bg-[#E4E7EB] text-[#1B222C] font-semibold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="h-4 w-4 text-[#1B222C]" />
              <span>Chat Live Now</span>
            </button>

            <Link
              href="/request-demo"
              className="w-full sm:w-auto px-5 py-3 rounded-lg bg-[#3E4C59] hover:bg-[#2C3847] text-white font-semibold text-xs sm:text-sm transition-all shadow-md border border-white/20 flex items-center justify-center gap-2"
            >
              <span>Request Sandbox Demo</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
