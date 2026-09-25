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
  Star,
  Send,
  MessageSquarePlus,
} from "lucide-react";
import { FAQ_ITEMS, FAQ_CATEGORIES } from "@/shared/data/faqData";

/* ------------------------------------------------------------------ */
/*  M&F Institutional Logo (matches ChatWidget exactly)               */
/* ------------------------------------------------------------------ */
function MfLogo({ size = 22 }: { size?: number }) {
  const inner = Math.round(size * 0.5);
  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <span className="absolute rounded-full bg-[#3E4C59]" style={{ width: size, height: size }} />
      <span className="absolute right-0 rounded-full bg-white" style={{ width: inner, height: inner }} />
    </div>
  );
}

export function FloatingFaq() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [activeTab, setActiveTab] = useState<"questions" | "feedback">("questions");

  // FAQ state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "faq-what-is-mf": true,
  });

  // Feedback form state
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState("general");
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const isHoveredRef = useRef(false);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Hide on admin, docs, or api-reference routes to maintain dedicated workspaces
  const isHiddenRoute =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/docs") ||
    pathname?.startsWith("/api-reference");

  // Hover handlers: open on hover, autohide when cursor moves away IF NOT CLICKED
  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    if (isPinned) return; // If clicked/pinned, do NOT autohide on mouse leave
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    // Autohide promptly once cursor moves away from trigger & window
    closeTimerRef.current = setTimeout(() => {
      if (!isHoveredRef.current && !isPinned) {
        setIsOpen(false);
      }
    }, 180);
  };

  const handleWindowClick = () => {
    // Clicking anywhere inside the window pins it so it doesn't autohide
    setIsPinned(true);
  };

  const handleClose = () => {
    isHoveredRef.current = false;
    setIsOpen(false);
    setIsPinned(false);
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  // Only auto-focus search if the user clicked/pinned the window (prevents focus trapping on simple hover)
  useEffect(() => {
    if (isOpen && isPinned && activeTab === "questions") {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isPinned, activeTab]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Click outside listener when pinned
  useEffect(() => {
    if (!isOpen || !isPinned) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        windowRef.current &&
        !windowRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, isPinned]);

  // Listen for external open triggers (e.g. from Footer or CTA buttons)
  useEffect(() => {
    const handleOpenEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab?: "questions" | "feedback" }>;
      if (customEvent.detail?.tab) {
        setActiveTab(customEvent.detail.tab);
      }
      setIsPinned(true);
      setIsOpen(true);
    };

    window.addEventListener("open_faq_window", handleOpenEvent);
    return () => window.removeEventListener("open_faq_window", handleOpenEvent);
  }, []);

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
    setIsPinned(true);
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Open Chat Widget from FAQ
  const handleOpenChat = () => {
    handleClose();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-mf-chat"));
    }
  };

  // Submit Feedback to Backend API & DB
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim() || feedbackText.trim().length < 3) {
      setSubmitError("Please provide a brief feedback message (at least 3 characters).");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setIsPinned(true);

    const payload = {
      rating,
      feedback: feedbackText.trim(),
      category: feedbackCategory,
      name: feedbackName.trim() || undefined,
      email: feedbackEmail.trim() || undefined,
    };

    try {
      let resData: any = null;
      let ok = false;

      // 1. Try local App Router /api/feedback
      try {
        const res = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const text = await res.text();
        try {
          resData = JSON.parse(text);
          ok = res.ok && resData?.success;
        } catch {}
      } catch {}

      // 2. Direct fallback to https://api.mftechnologies.org/api/feedback
      if (!ok) {
        try {
          const directRes = await fetch("https://api.mftechnologies.org/api/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const directText = await directRes.text();
          resData = JSON.parse(directText);
          ok = directRes.ok && resData?.success;
        } catch {}
      }

      if (!ok || !resData || !resData.success) {
        throw new Error(
          (resData && resData.message) ||
          "Unable to record feedback right now. Please try again."
        );
      }

      setSubmitSuccess(true);
      setFeedbackText("");
    } catch (err: any) {
      setSubmitError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isHiddenRoute) {
    return null;
  }

  return (
    <>
      {/* ── GREY TAB TRIGGER WITH THREE VISIBLE HAMBURGER LINES (OPENS ON HOVER) ── */}
      <aside
        ref={triggerRef}
        aria-label="FAQ & Feedback"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[99990] select-none"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          type="button"
          onClick={() => {
            if (isOpen && isPinned) {
              handleClose();
            } else {
              setIsPinned(true);
              setIsOpen(true);
            }
          }}
          id="floating-faq-hamburger-btn"
          aria-expanded={isOpen}
          aria-label="Frequently Asked Questions & Feedback"
          title="FAQ & Feedback"
          className="group relative flex flex-col items-center justify-center bg-[#475569] hover:bg-[#334155] active:bg-[#1E293B] text-white border-l border-t border-b border-slate-400/50 shadow-xl cursor-pointer transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-slate-300 w-4 sm:w-5 hover:w-6 h-14 sm:h-16 rounded-l-md px-1"
        >
          {/* Three visible hamburger lines */}
          <div className="flex flex-col items-center justify-center gap-1.5 w-full">
            <span className="w-2.5 sm:w-3.5 h-0.5 bg-white/95 rounded-full transition-transform duration-150 group-hover:scale-x-110" />
            <span className="w-2.5 sm:w-3.5 h-0.5 bg-white/95 rounded-full transition-transform duration-150 group-hover:scale-x-110" />
            <span className="w-2.5 sm:w-3.5 h-0.5 bg-white/95 rounded-full transition-transform duration-150 group-hover:scale-x-110" />
          </div>

          {/* Hover tooltip label */}
          <span className="absolute right-full mr-2 px-2 py-1 bg-[#1B222C] text-white text-[11px] font-semibold rounded shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:inline-block">
            FAQ &amp; Feedback
          </span>
        </button>
      </aside>

      {/* ── CHATBOT-SIZED FLOATING FAQ & FEEDBACK WINDOW (MATCHES CHATWIDGET AESTHETIC) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={windowRef}
            id="floating-faq-window"
            role="dialog"
            aria-modal="true"
            aria-labelledby="faq-window-title"
            initial={{ opacity: 0, x: 25, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 25, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleWindowClick}
            className="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-[100000] w-[350px] sm:w-[380px] max-w-[calc(100vw-16px)] h-[520px] max-h-[85vh] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#1B222C] font-sans before:absolute before:left-full before:top-0 before:bottom-0 before:w-8 before:content-['']"
          >
            {/* Header (Exact same font, colors, and MfLogo as ChatWidget) */}
            <div className="bg-[#1B222C] text-white px-3.5 py-3 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-2">
                <MfLogo size={26} />
                <div>
                  <h3 id="faq-window-title" className="text-xs font-bold tracking-tight">
                    M&amp;F FAQ &amp; Feedback
                  </h3>
                  <span className="text-[9px] text-[#9AA5B1] block -mt-0.5">
                    Online Knowledge Base
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="text-[#9AA5B1] hover:text-white transition-colors rounded-lg p-1 cursor-pointer"
                title="Close"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Sub-Header Tabs Switcher */}
            <div className="bg-slate-50 px-3 pt-2 pb-1.5 border-b border-slate-200 shrink-0 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsPinned(true);
                  setActiveTab("questions");
                }}
                className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "questions"
                    ? "bg-white text-[#1B222C] shadow-xs border border-slate-200"
                    : "text-slate-500 hover:text-[#1B222C] hover:bg-white/60"
                }`}
              >
                <span>Answered Questions</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-[#3E4C59]">
                  {FAQ_ITEMS.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPinned(true);
                  setActiveTab("feedback");
                  setSubmitSuccess(false);
                  setSubmitError("");
                }}
                className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "feedback"
                    ? "bg-white text-[#1B222C] shadow-xs border border-slate-200"
                    : "text-slate-500 hover:text-[#1B222C] hover:bg-white/60"
                }`}
              >
                <MessageSquarePlus className="h-3.5 w-3.5 text-[#3E4C59]" />
                <span>Leave Feedback</span>
              </button>
            </div>

            {/* ── TAB 1: ANSWERED QUESTIONS ── */}
            {activeTab === "questions" && (
              <div className="flex-1 flex flex-col overflow-hidden bg-white">
                {/* Search Bar + Categories */}
                <div className="p-3 bg-slate-50/70 border-b border-slate-200 space-y-2 shrink-0">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setIsPinned(true);
                        setSearchQuery(e.target.value);
                      }}
                      placeholder="Search lending, scoring, APIs, security..."
                      className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-[#1B222C] placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1B222C] focus:border-[#1B222C] transition-all shadow-2xs"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1B222C] p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  {/* Horizontal Scrollable Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
                    {FAQ_CATEGORIES.map((cat) => {
                      const isActive = activeCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setIsPinned(true);
                            setActiveCategory(cat.id);
                          }}
                          className={`shrink-0 px-2 py-0.8 rounded text-[11px] font-medium transition-all cursor-pointer ${
                            isActive
                              ? "bg-[#1B222C] text-white shadow-2xs"
                              : "bg-white text-[#3E4C59] hover:bg-slate-100 border border-slate-200"
                          }`}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Questions Scrollable Accordion List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  {filteredItems.length === 0 ? (
                    <div className="text-center py-8 px-3 space-y-2.5">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                        <Search className="h-5 w-5" />
                      </div>
                      <h4 className="text-xs font-bold text-[#1B222C]">No questions found</h4>
                      <p className="text-[11px] text-slate-500 max-w-[240px] mx-auto">
                        No matches for &quot;{searchQuery}&quot;. Share your inquiry or ask our live engineers.
                      </p>
                      <div className="flex items-center justify-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsPinned(true);
                            setActiveTab("feedback");
                            setFeedbackText(`Inquiry regarding: ${searchQuery}`);
                          }}
                          className="px-2.5 py-1.5 text-[11px] font-semibold text-[#1B222C] bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-colors"
                        >
                          Submit Inquiry
                        </button>
                        <button
                          type="button"
                          onClick={handleOpenChat}
                          className="px-2.5 py-1.5 text-[11px] font-semibold text-white bg-[#1B222C] hover:bg-[#3E4C59] rounded-md transition-colors shadow-2xs"
                        >
                          Ask Live Chat
                        </button>
                      </div>
                    </div>
                  ) : (
                    filteredItems.map((item) => {
                      const isExpanded = !!openItems[item.id];
                      return (
                        <div
                          key={item.id}
                          className={`rounded-lg border transition-all ${
                            isExpanded
                              ? "bg-slate-50/80 border-slate-300 shadow-2xs"
                              : "bg-white border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleItem(item.id)}
                            aria-expanded={isExpanded}
                            className="w-full text-left px-3 py-2.5 flex items-start justify-between gap-2.5 cursor-pointer"
                          >
                            <div className="space-y-0.5">
                              <span className="inline-block text-[9px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                                {item.categoryLabel}
                              </span>
                              <h4 className="text-xs font-bold text-[#1B222C] leading-snug">
                                {item.question}
                              </h4>
                            </div>
                            <div
                              className={`p-1 rounded text-slate-500 transition-transform duration-200 shrink-0 ${
                                isExpanded ? "rotate-180 text-[#1B222C] bg-slate-200" : ""
                              }`}
                            >
                              <ChevronDown className="h-3.5 w-3.5" />
                            </div>
                          </button>

                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.18 }}
                                className="overflow-hidden"
                              >
                                <div className="px-3 pb-3 pt-1 space-y-2 text-xs text-[#3E4C59] leading-relaxed border-t border-slate-200 mt-0.5">
                                  <p className="text-[11px]">{item.answer}</p>

                                  {item.bulletPoints && item.bulletPoints.length > 0 && (
                                    <ul className="space-y-1 pt-0.5">
                                      {item.bulletPoints.map((bp, idx) => (
                                        <li key={idx} className="flex items-start gap-1.5 text-[11px] text-[#3E4C59]">
                                          <CheckCircle2 className="h-3 w-3 text-[#1B222C] shrink-0 mt-0.5" />
                                          <span>{bp}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}

                                  {item.actionLink && (
                                    <div className="pt-1">
                                      <Link
                                        href={item.actionLink.href}
                                        onClick={handleClose}
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1B222C] hover:text-[#3E4C59] underline underline-offset-2 decoration-slate-300 hover:decoration-[#1B222C] group"
                                      >
                                        <span>{item.actionLink.label}</span>
                                        <ArrowRight className="h-2.5 w-2.5 group-hover:translate-x-0.5 transition-transform" />
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

                {/* Footer Quick Links */}
                <div className="p-2.5 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-between text-[11px]">
                  <Link
                    href="/faq"
                    onClick={handleClose}
                    className="font-medium text-slate-500 hover:text-[#1B222C] hover:underline flex items-center gap-1"
                  >
                    <span>Full FAQ Page</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={handleOpenChat}
                    className="font-semibold text-[#1B222C] hover:text-[#3E4C59] flex items-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="h-3 w-3 text-[#3E4C59]" />
                    <span>Live Chat Support</span>
                  </button>
                </div>
              </div>
            )}

            {/* ── TAB 2: LEAVE FEEDBACK FORM (STORED IN DB) ── */}
            {activeTab === "feedback" && (
              <div className="flex-1 overflow-y-auto p-4 bg-white flex flex-col justify-between">
                {submitSuccess ? (
                  <div className="my-auto text-center py-6 px-3 space-y-3">
                    <div className="h-12 w-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-[#1B222C]">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h4 className="text-sm font-bold text-[#1B222C]">Thank You for Your Feedback!</h4>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                      Your feedback has been stored and routed to our administrative team for review.
                    </p>
                    <div className="pt-2 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitSuccess(false);
                          setFeedbackText("");
                          setIsPinned(true);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-[#1B222C] border border-slate-200 transition-colors"
                      >
                        Submit More Feedback
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("questions");
                          setIsPinned(true);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#1B222C] hover:bg-[#3E4C59] text-white transition-colors"
                      >
                        Back to FAQ
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-3.5">
                    <div>
                      <h4 className="text-xs font-bold text-[#1B222C]">We Value Your Feedback</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Tell us what you think or suggest questions we should include.
                      </p>
                    </div>

                    {/* Star Rating */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#3E4C59] block">
                        Rate your experience:
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isFilled = (hoverRating ?? rating) >= star;
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => {
                                setIsPinned(true);
                                setRating(star);
                              }}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(null)}
                              className="p-1 text-slate-300 hover:scale-110 transition-transform cursor-pointer"
                              aria-label={`Rate ${star} star`}
                            >
                              <Star
                                className={`h-5 w-5 ${
                                  isFilled ? "fill-amber-400 text-amber-500" : "text-slate-300"
                                }`}
                              />
                            </button>
                          );
                        })}
                        <span className="text-[11px] text-slate-500 ml-2 font-medium">
                          {rating === 5
                            ? "Excellent"
                            : rating === 4
                            ? "Good"
                            : rating === 3
                            ? "Average"
                            : rating === 2
                            ? "Needs Improvement"
                            : "Poor"}
                        </span>
                      </div>
                    </div>

                    {/* Category Selector */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#3E4C59] block">
                        Topic Category:
                      </label>
                      <select
                        value={feedbackCategory}
                        onChange={(e) => {
                          setIsPinned(true);
                          setFeedbackCategory(e.target.value);
                        }}
                        className="w-full text-xs bg-slate-50/70 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[#1B222C] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1B222C]"
                      >
                        <option value="general">General &amp; Usability</option>
                        <option value="lending">Core Lending Systems</option>
                        <option value="scoring">Credit Scoring &amp; Risk</option>
                        <option value="security">Security &amp; Compliance</option>
                        <option value="integrations">APIs &amp; Core Banking</option>
                        <option value="suggestion">Content Suggestion</option>
                      </select>
                    </div>

                    {/* Feedback Text Area */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-[#3E4C59] block">
                        Your Feedback / Question <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={feedbackText}
                        onChange={(e) => {
                          setIsPinned(true);
                          setFeedbackText(e.target.value);
                        }}
                        placeholder="What question were you trying to answer? How can we improve our platform?"
                        className="w-full text-xs p-2.5 bg-slate-50/70 border border-slate-200 rounded-lg text-[#1B222C] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1B222C] resize-none"
                        required
                      />
                    </div>

                    {/* Optional Name & Email for Follow-up */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-500 block">
                          Name (Optional)
                        </label>
                        <input
                          type="text"
                          value={feedbackName}
                          onChange={(e) => {
                            setIsPinned(true);
                            setFeedbackName(e.target.value);
                          }}
                          placeholder="Your name"
                          className="w-full text-xs px-2.5 py-1.5 bg-slate-50/70 border border-slate-200 rounded-lg text-[#1B222C] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1B222C]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-500 block">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          value={feedbackEmail}
                          onChange={(e) => {
                            setIsPinned(true);
                            setFeedbackEmail(e.target.value);
                          }}
                          placeholder="you@company.com"
                          className="w-full text-xs px-2.5 py-1.5 bg-slate-50/70 border border-slate-200 rounded-lg text-[#1B222C] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1B222C]"
                        />
                      </div>
                    </div>

                    {submitError && (
                      <p className="text-[11px] text-red-600 bg-red-50 p-2 rounded border border-red-200">
                        {submitError}
                      </p>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-[#1B222C] hover:bg-[#3E4C59] active:bg-[#111827] text-white transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-3 w-3" />
                          <span>Submit Feedback to Database</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
