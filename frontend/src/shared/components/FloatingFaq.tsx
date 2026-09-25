// src/shared/components/FloatingFaq.tsx
"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  X,
  Search,
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { FAQ_ITEMS, FAQ_CATEGORIES, FaqItem } from "@/shared/data/faqData";

export function FloatingFaq() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "faq-what-is-mf": true, // First item open by default for immediate context
  });
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Hide on admin, docs, or api-reference routes to maintain dedicated workspaces
  const isHiddenRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/docs") || pathname?.startsWith("/api-reference");

  // Focus search input when drawer opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Lock body scroll when drawer is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Filter items based on active category and search query
  const filteredItems = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      // Category filter
      if (activeCategory !== "all" && item.category !== activeCategory) {
        return false;
      }

      // Search filter
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const inQuestion = item.question.toLowerCase().includes(q);
      const inAnswer = item.answer.toLowerCase().includes(q);
      const inKeywords = item.keywords.some((kw) => kw.toLowerCase().includes(q));
      const inBullets = item.bulletPoints?.some((bp) => bp.toLowerCase().includes(q));

      return inQuestion || inAnswer || inKeywords || inBullets;
    });
  }, [activeCategory, searchQuery]);

  // Toggle single item accordion
  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Open Chat Widget from FAQ
  const handleOpenChat = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-mf-chat"));
    }
  };

  if (isHiddenRoute) {
    return null;
  }

  return (
    <>
      {/* ── FLOATING TRIGGER ON RIGHT OF SCREEN (Laptop & Phone) ── */}
      <aside
        aria-label="Frequently Asked Questions Floating Access"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[99990] select-none"
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          id="floating-faq-btn"
          aria-expanded={isOpen}
          aria-controls="floating-faq-drawer"
          className="group relative flex items-center gap-1.5 sm:gap-2 bg-[#1B222C]/95 hover:bg-[#283341] text-white py-2.5 px-3 sm:py-3 sm:px-4 rounded-l-2xl shadow-2xl border-l border-t border-b border-white/20 backdrop-blur-md transition-all duration-300 hover:pr-5 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          {/* Active Ping Beacon */}
          <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500" />
          </span>

          {/* Help Icon */}
          <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400 group-hover:scale-110 group-hover:rotate-6 transition-transform shrink-0" />

          {/* Labels */}
          <div className="flex flex-col text-left">
            <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-white leading-tight">
              FAQ
            </span>
            <span className="hidden sm:inline-block text-[9px] text-slate-300 font-medium -mt-0.5 leading-tight">
              Quick Help
            </span>
          </div>
        </button>
      </aside>

      {/* ── SLIDE-OVER FAQ DRAWER ON RIGHT OF SCREEN ── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100000] flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
              aria-hidden="true"
            />

            {/* Slide-over Content Panel */}
            <motion.div
              id="floating-faq-drawer"
              role="dialog"
              aria-modal="true"
              aria-labelledby="faq-drawer-title"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 32 }}
              className="relative w-full sm:w-[480px] lg:w-[520px] max-w-[100vw] h-full bg-white shadow-2xl flex flex-col z-10 overflow-hidden border-l border-slate-200"
            >
              {/* Header */}
              <div className="bg-[#1B222C] text-white px-4 sm:px-6 py-4.5 shrink-0 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-emerald-400">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 id="faq-drawer-title" className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                      Frequently Asked Questions
                    </h2>
                    <p className="text-[11px] text-slate-300 font-normal">
                      M&amp;F Technologies Lending Infrastructure &amp; APIs
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close FAQ drawer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200 shrink-0 space-y-2.5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search lending, scoring, APIs, security, SLAs..."
                    className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B222C] focus:border-transparent transition-all shadow-xs"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Pills (Horizontal scrollable) */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                  {FAQ_CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveCategory(cat.id)}
                        className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                          isActive
                            ? "bg-[#1B222C] text-white shadow-xs"
                            : "bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200"
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Match Counter */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 px-0.5">
                  <span>
                    Showing {filteredItems.length} of {FAQ_ITEMS.length} questions
                  </span>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setActiveCategory("all");
                      }}
                      className="text-emerald-700 hover:underline font-semibold"
                    >
                      Reset filters
                    </button>
                  )}
                </div>
              </div>

              {/* Questions Accordion List */}
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3 divide-y divide-slate-100">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12 px-4 space-y-3">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                      <Search className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">No questions found</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      We couldn&apos;t find any matches for &quot;{searchQuery}&quot;. Try adjusting your keywords or chat directly with our engineering team.
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenChat}
                      className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#1B222C] hover:bg-[#283341] rounded-xl transition-colors shadow-xs cursor-pointer"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      Ask Our Team via Live Chat
                    </button>
                  </div>
                ) : (
                  filteredItems.map((item) => {
                    const isExpanded = !!openItems[item.id];
                    return (
                      <div
                        key={item.id}
                        className={`rounded-xl border transition-all pt-2 ${
                          isExpanded
                            ? "bg-slate-50/70 border-slate-300 shadow-xs"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          aria-expanded={isExpanded}
                          className="w-full text-left px-3.5 py-3 flex items-start justify-between gap-3 cursor-pointer"
                        >
                          <div className="space-y-1">
                            <span className="inline-block text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              {item.categoryLabel}
                            </span>
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                              {item.question}
                            </h3>
                          </div>
                          <div
                            className={`p-1 rounded-md text-slate-400 transition-transform duration-200 shrink-0 ${
                              isExpanded ? "rotate-180 text-slate-700 bg-slate-200" : ""
                            }`}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </div>
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-3.5 pb-4 pt-1 space-y-3 text-xs text-slate-700 leading-relaxed border-t border-slate-200/60 mt-1">
                                <p>{item.answer}</p>

                                {item.bulletPoints && item.bulletPoints.length > 0 && (
                                  <ul className="space-y-1.5 pt-1">
                                    {item.bulletPoints.map((bp, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-slate-600">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                        <span>{bp}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}

                                {item.actionLink && (
                                  <div className="pt-2">
                                    <Link
                                      href={item.actionLink.href}
                                      onClick={() => setIsOpen(false)}
                                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline group"
                                    >
                                      <span>{item.actionLink.label}</span>
                                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom Quick Action Footer */}
              <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 shrink-0 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Need more assistance?</span>
                  </div>
                  <Link
                    href="/faq"
                    onClick={() => setIsOpen(false)}
                    className="text-[11px] font-medium text-slate-500 hover:text-slate-800 hover:underline flex items-center gap-1"
                  >
                    <span>Full FAQ Page</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleOpenChat}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 transition-colors shadow-2xs cursor-pointer"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
                    <span>Chat Support</span>
                  </button>

                  <Link
                    href="/request-demo"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl bg-[#1B222C] hover:bg-[#283341] text-white transition-colors shadow-2xs"
                  >
                    <span>Request Demo</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
