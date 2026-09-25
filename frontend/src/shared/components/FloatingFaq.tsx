// src/shared/components/FloatingFaq.tsx
"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  ChevronDown,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { FAQ_ITEMS, FAQ_CATEGORIES } from "@/shared/data/faqData";

export function FloatingFaq() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isScrolling, setIsScrolling] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "faq-what-is-mf": true,
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Hide on admin, docs, or api-reference routes to maintain dedicated workspaces
  const isHiddenRoute =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/docs") ||
    pathname?.startsWith("/api-reference");

  // Track page scrolling to minimize into a line on edge of screen
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
      // Re-expand back into the square box 700ms after scrolling stops
      scrollTimerRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 700);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  // Focus search input when drawer opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Lock body scroll when drawer is open
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

  // Minimized state: scrolling and not currently hovered
  const isMinimized = isScrolling && !isHovered;

  return (
    <>
      {/* ── QUESTION MARK IN SQUARE BOX (Minimizes on scrolling to a line on edge) ── */}
      <aside
        aria-label="FAQ and Help Access"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[99990] select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          id="floating-faq-btn"
          aria-expanded={isOpen}
          aria-controls="floating-faq-drawer"
          title="Frequently Asked Questions (FAQ)"
          className={`relative flex items-center justify-center bg-[#1B222C] hover:bg-[#3E4C59] active:bg-[#111827] text-white border-l border-t border-b border-[#9AA5B1]/40 shadow-xl transition-all duration-300 ease-out cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#9AA5B1] ${
            isMinimized
              ? "w-1.5 h-11 sm:h-12 rounded-l-xs opacity-70 hover:opacity-100"
              : "w-9 h-9 sm:w-10 sm:h-10 rounded-l-md opacity-100"
          }`}
        >
          {isMinimized ? (
            /* Minimized state: thin vertical line docked on screen edge */
            <span className="w-full h-full bg-[#3E4C59] hover:bg-[#1B222C] rounded-l-xs" />
          ) : (
            /* Square box state: Question mark centered */
            <span className="font-display font-bold text-sm sm:text-base text-white leading-none">
              ?
            </span>
          )}
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
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-[#1B222C]/40 backdrop-blur-xs transition-opacity"
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
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="relative w-full sm:w-[480px] lg:w-[520px] max-w-[100vw] h-full bg-white shadow-2xl flex flex-col z-10 overflow-hidden border-l border-[#E4E7EB]"
            >
              {/* Header */}
              <div className="bg-[#1B222C] text-white px-4 sm:px-6 py-4.5 shrink-0 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-md bg-[#3E4C59] border border-white/15 flex items-center justify-center font-bold text-sm text-white">
                    ?
                  </div>
                  <div>
                    <h2
                      id="faq-drawer-title"
                      className="text-sm sm:text-base font-bold text-white tracking-tight"
                    >
                      Frequently Asked Questions
                    </h2>
                    <p className="text-[11px] text-[#9AA5B1] font-normal">
                      M&amp;F Technologies Lending Infrastructure &amp; APIs
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 rounded-md bg-white/10 hover:bg-white/20 text-[#9AA5B1] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close FAQ drawer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-3.5 sm:p-4 bg-[#F4F6F8] border-b border-[#E4E7EB] shrink-0 space-y-2.5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9AA5B1]" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search lending, scoring, APIs, security, SLAs..."
                    className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-[#CBD2D9] rounded-lg text-[#1B222C] placeholder:text-[#9AA5B1] focus:outline-none focus:ring-1 focus:ring-[#1B222C] focus:border-[#1B222C] transition-all shadow-xs"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9AA5B1] hover:text-[#1B222C] p-0.5 rounded-full"
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
                        className={`shrink-0 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
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

                {/* Match Counter */}
                <div className="flex items-center justify-between text-[11px] text-[#6B7684] px-0.5">
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
                      className="text-[#1B222C] hover:underline font-semibold"
                    >
                      Reset filters
                    </button>
                  )}
                </div>
              </div>

              {/* Questions Accordion List */}
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12 px-4 space-y-3">
                    <div className="h-12 w-12 rounded-full bg-[#F4F6F8] flex items-center justify-center mx-auto text-[#9AA5B1]">
                      <Search className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-bold text-[#1B222C]">No questions found</h3>
                    <p className="text-xs text-[#6B7684] max-w-xs mx-auto">
                      We couldn&apos;t find any matches for &quot;{searchQuery}&quot;. Try adjusting your keywords or chat directly with our engineering team.
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenChat}
                      className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#1B222C] hover:bg-[#3E4C59] rounded-lg transition-colors shadow-xs cursor-pointer"
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
                        className={`rounded-lg border transition-all ${
                          isExpanded
                            ? "bg-[#F4F6F8]/80 border-[#CBD2D9] shadow-xs"
                            : "bg-white border-[#E4E7EB] hover:border-[#CBD2D9]"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          aria-expanded={isExpanded}
                          className="w-full text-left px-3.5 py-3 flex items-start justify-between gap-3 cursor-pointer"
                        >
                          <div className="space-y-1">
                            <span className="inline-block text-[10px] font-semibold text-[#3E4C59] bg-[#E4E7EB] px-2 py-0.5 rounded border border-[#CBD2D9]">
                              {item.categoryLabel}
                            </span>
                            <h3 className="text-xs sm:text-sm font-bold text-[#1B222C] leading-snug">
                              {item.question}
                            </h3>
                          </div>
                          <div
                            className={`p-1 rounded text-[#6B7684] transition-transform duration-200 shrink-0 ${
                              isExpanded ? "rotate-180 text-[#1B222C] bg-[#E4E7EB]" : ""
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
                              <div className="px-3.5 pb-4 pt-1 space-y-3 text-xs text-[#3E4C59] leading-relaxed border-t border-[#E4E7EB] mt-1">
                                <p>{item.answer}</p>

                                {item.bulletPoints && item.bulletPoints.length > 0 && (
                                  <ul className="space-y-1.5 pt-1">
                                    {item.bulletPoints.map((bp, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-[#3E4C59]">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-[#1B222C] shrink-0 mt-0.5" />
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
                                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#1B222C] hover:text-[#3E4C59] underline underline-offset-4 decoration-[#CBD2D9] hover:decoration-[#1B222C] group"
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
              <div className="p-3.5 sm:p-4 bg-[#F4F6F8] border-t border-[#E4E7EB] shrink-0 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1B222C]">Need further assistance?</span>
                  <Link
                    href="/faq"
                    onClick={() => setIsOpen(false)}
                    className="text-[11px] font-medium text-[#6B7684] hover:text-[#1B222C] hover:underline flex items-center gap-1"
                  >
                    <span>Full FAQ Page</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleOpenChat}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-white hover:bg-[#E4E7EB] text-[#1B222C] border border-[#CBD2D9] transition-colors shadow-2xs cursor-pointer"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-[#3E4C59]" />
                    <span>Chat Support</span>
                  </button>

                  <Link
                    href="/request-demo"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-[#1B222C] hover:bg-[#3E4C59] text-white transition-colors shadow-2xs"
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
