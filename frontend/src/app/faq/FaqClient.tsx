// src/app/faq/FaqClient.tsx
"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  Search,
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Shield,
  Layers,
  Cpu,
  Clock,
  MessageSquare,
  FileQuestion,
  PhoneCall,
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
    <div className="min-h-screen bg-slate-50/60 pb-20">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-emerald-400 font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Institutional Lending Technology FAQ</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Frequently Asked Questions
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about M&amp;F Technologies core lending engine, automated credit scoring, security architecture, and regulatory compliance.
          </p>

          {/* Search Bar in Hero */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by topic, e.g. 'credit scoring', 'SLA', 'API', 'CRB'..."
                className="w-full pl-11 pr-10 py-3 text-sm sm:text-base bg-white text-slate-900 rounded-2xl shadow-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 border-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
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
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Uptime Guarantee</p>
              <p className="text-sm font-bold text-slate-900">99.95% SLA</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Scoring Speed</p>
              <p className="text-sm font-bold text-slate-900">&lt; 3 Seconds</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Security</p>
              <p className="text-sm font-bold text-slate-900">AES-256 / SOC 2</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Core Banking</p>
              <p className="text-sm font-bold text-slate-900">Temenos, Finacle+</p>
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
                className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#1B222C] text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Action Controls (Count + Expand All) */}
        <div className="flex items-center justify-between text-xs text-slate-500 mt-4 mb-3 px-1">
          <span>
            Showing <strong>{filteredItems.length}</strong> {filteredItems.length === 1 ? "question" : "questions"}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={expandAll}
              className="hover:text-slate-900 hover:underline font-medium cursor-pointer"
            >
              Expand All
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={collapseAll}
              className="hover:text-slate-900 hover:underline font-medium cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Accordions */}
        <div className="space-y-3.5">
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <FileQuestion className="h-12 w-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No questions found matching your search</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                We couldn&apos;t find an answer matching &quot;{searchQuery}&quot;. Our technical advisors are available to answer your specific infrastructure questions.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                >
                  Clear Search
                </button>
                <button
                  type="button"
                  onClick={handleOpenChat}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#1B222C] hover:bg-[#283341] text-white transition-colors flex items-center gap-1.5"
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
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? "bg-white border-slate-300 shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isExpanded}
                    className="w-full text-left px-5 py-4.5 flex items-start justify-between gap-4 cursor-pointer"
                  >
                    <div className="space-y-1.5">
                      <span className="inline-block text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        {item.categoryLabel}
                      </span>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {item.question}
                      </h2>
                    </div>
                    <div
                      className={`p-1.5 rounded-lg text-slate-400 transition-transform duration-200 shrink-0 ${
                        isExpanded ? "rotate-180 text-slate-800 bg-slate-100" : ""
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
                        <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                          <p>{item.answer}</p>

                          {item.bulletPoints && item.bulletPoints.length > 0 && (
                            <ul className="space-y-2 pt-1 pl-1">
                              {item.bulletPoints.map((bp, idx) => (
                                <li key={idx} className="flex items-start gap-2.5 text-slate-600">
                                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                  <span>{bp}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {item.actionLink && (
                            <div className="pt-2">
                              <Link
                                href={item.actionLink.href}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline group"
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
        <div className="mt-12 bg-linear-to-br from-[#1B222C] to-[#2C3847] rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">Have a technical architecture question?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
              Our core infrastructure specialists and credit risk engineers can review your integration requirements, custom bureau models, and sandbox access.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleOpenChat}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <span>Chat Live Now</span>
            </button>

            <Link
              href="/request-demo"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
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
