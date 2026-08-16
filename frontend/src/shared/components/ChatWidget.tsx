// src/shared/components/ChatWidget.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MessageSquare, X, Send, User, Bot, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Message {
  id: string;
  role: "bot" | "user";
  text: string;
  timestamp: string;
}

interface ChatSession {
  ticket: string;
  messages: Message[];
}

/* ------------------------------------------------------------------ */
/*  M&F Logo                                                           */
/* ------------------------------------------------------------------ */
function MfLogo({ size = 24 }: { size?: number }) {
  const inner = Math.round(size * 0.5);
  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <span className="absolute rounded-full bg-[#3E4C59]" style={{ width: size, height: size }} />
      <span className="absolute right-0 rounded-full bg-white" style={{ width: inner, height: inner }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Notification sound via Web Audio API                               */
/* ------------------------------------------------------------------ */
function playNotificationSound() {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const playTone = (freq: number, start: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.15, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur);
    };
    const now = ctx.currentTime;
    playTone(880, now, 0.12);
    playTone(1174.66, now + 0.15, 0.18);
    playTone(1318.51, now + 0.35, 0.25);
  } catch { /* blocked before gesture */ }
}

/* ------------------------------------------------------------------ */
/*  Session storage helpers                                            */
/* ------------------------------------------------------------------ */
const STORAGE_KEY = "mf_chat_session";

function loadSession(): ChatSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveSession(session: ChatSession) {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session)); } catch {}
}

/* ------------------------------------------------------------------ */
/*  ChatWidget                                                         */
/* ------------------------------------------------------------------ */
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [ticket, setTicket] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasAutoPopped, setHasAutoPopped] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Do not render inside admin pages
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
    return null;
  }

  /* ---- Restore session on mount ---- */
  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      setTicket(saved.ticket);
      setMessages(saved.messages);
    }
  }, []);

  /* ---- Persist on change ---- */
  useEffect(() => {
    if (ticket && messages.length > 0) {
      saveSession({ ticket, messages });
    }
  }, [ticket, messages]);

  /* ---- Auto-scroll ---- */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* ---- Focus input when opened ---- */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  /* ---- Auto-pop after 3s ---- */
  useEffect(() => {
    if (hasAutoPopped) return;
    const saved = loadSession();
    if (saved) return; // Don't auto-pop if resuming a session

    const timer = setTimeout(() => {
      setHasAutoPopped(true);
      startSession(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [hasAutoPopped]);

  /* ---- Start chat session ---- */
  const startSession = useCallback(async (autoOpen = false) => {
    // If we already have a ticket from storage, just open
    const saved = loadSession();
    if (saved) {
      setTicket(saved.ticket);
      setMessages(saved.messages);
      if (autoOpen) {
        setIsOpen(true);
        playNotificationSound();
        setShowPulse(false);
      }
      return;
    }

    try {
      const apiHost = typeof window !== "undefined" ? "" : "http://localhost:4000";
      const res = await fetch(`${apiHost}/api/chatbot/start`, { method: "POST" });
      const data = await res.json();

      if (data.success) {
        const greetMsg: Message = {
          id: "greeting-" + Date.now(),
          role: "bot",
          text: data.data.message,
          timestamp: new Date().toISOString(),
        };
        setTicket(data.data.ticket);
        setMessages([greetMsg]);

        if (autoOpen) {
          setIsOpen(true);
          playNotificationSound();
          setShowPulse(false);
        }
      }
    } catch (err) {
      console.error("Failed to start chatbot session:", err);
    }
  }, []);

  /* ---- Toggle chat ---- */
  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      setShowPulse(false);
      if (!ticket) startSession(false);
      playNotificationSound();
    }
  };

  /* ---- Send message ---- */
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;

    const userText = inputText.trim();
    setInputText("");

    const userMsg: Message = {
      id: "user-" + Date.now(),
      role: "user",
      text: userText,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      // Build history for the API (skip the greeting for context efficiency)
      const history = updatedMessages
        .filter((m) => m.id !== messages[0]?.id) // skip pinned greeting
        .map((m) => ({
          role: m.role === "bot" ? "assistant" : "user",
          content: m.text,
        }));

      const apiHost = typeof window !== "undefined" ? "" : "http://localhost:4000";
      const res = await fetch(`${apiHost}/api/chatbot/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket, message: userText, history }),
      });

      const data = await res.json();

      const botMsg: Message = {
        id: "bot-" + Date.now(),
        role: "bot",
        text: data.success
          ? data.data.response
          : "I'm having trouble right now. Please try again or contact info@mftechnologies.org.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          role: "bot",
          text: "Connection error. Please check your internet and try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  /* ---- Format timestamp ---- */
  const fmtTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch { return ""; }
  };

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */
  return (
    <>
      {/* ---- Floating toggle button ---- */}
      <div className="fixed right-6 z-[99999]" style={{ bottom: "calc(1.5rem + var(--cookie-banner-h, 0px))" }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggle}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#1B222C] text-white shadow-xl hover:bg-[#3E4C59] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B222C]"
          aria-label="Open AI support chat"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}

          {/* Pulse ring for attention */}
          {showPulse && !isOpen && (
            <span className="absolute inset-0 rounded-full border-2 border-[#1B222C] animate-ping opacity-40" />
          )}

          {/* AI badge */}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 shadow-md">
              <Sparkles className="h-3 w-3 text-white" />
            </span>
          )}
        </motion.button>
      </div>

      {/* ---- Chat panel ---- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-6 w-[360px] sm:w-[400px] h-[560px] bg-white border border-[#9AA5B1]/20 rounded-2xl shadow-2xl z-[99999] flex flex-col overflow-hidden"
            style={{ bottom: "calc(6rem + var(--cookie-banner-h, 0px))" }}
          >
            {/* ---- Header ---- */}
            <div className="bg-[#1B222C] text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <MfLogo size={32} />
                <div>
                  <h3 className="text-sm font-bold tracking-tight flex items-center gap-1.5">
                    M&amp;F AI Assistant
                    <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-[#9AA5B1]">Powered by AI &bull; Always Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#9AA5B1] hover:text-white transition-colors rounded-lg p-1.5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* ---- Ticket banner (pinned) ---- */}
            {ticket && (
              <div className="bg-slate-50 border-b border-[#E4E7EB] px-4 py-2 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Support Ticket
                  </span>
                </div>
                <span className="text-[11px] font-bold text-[#1B222C] font-mono tracking-wide">
                  {ticket}
                </span>
              </div>
            )}

            {/* ---- Messages ---- */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-1">
                  <div className={`flex items-start gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    {/* Avatar */}
                    {msg.role === "bot" ? (
                      <div className="shrink-0 relative">
                        <MfLogo size={24} />
                        <Sparkles className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 text-emerald-500" />
                      </div>
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                        <User className="h-3.5 w-3.5" />
                      </div>
                    )}

                    {/* Bubble */}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-line shadow-sm border ${
                        msg.role === "bot"
                          ? "bg-white text-[#1B222C] border-[#9AA5B1]/10 rounded-tl-none"
                          : "bg-[#1B222C] text-white border-transparent rounded-tr-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                  <span
                    className={`text-[8px] font-bold text-slate-400 block ${
                      msg.role === "user" ? "text-right mr-8" : "text-left ml-8"
                    }`}
                  >
                    {msg.role === "bot" ? "M&F AI" : "You"} &bull; {fmtTime(msg.timestamp)}
                  </span>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 pl-2">
                  <div className="shrink-0 relative">
                    <MfLogo size={24} />
                    <Sparkles className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 text-emerald-500" />
                  </div>
                  <div className="bg-white border border-[#9AA5B1]/10 rounded-2xl rounded-tl-none px-4 py-2.5 flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="text-[9px] text-slate-400 ml-1.5 font-medium">AI is thinking...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* ---- Input bar ---- */}
            <form onSubmit={handleSend} className="p-3 border-t border-[#9AA5B1]/20 bg-white flex items-center gap-2 shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isTyping}
                placeholder={isTyping ? "AI is responding..." : "Ask me anything about M&F Technologies..."}
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B222C] transition-colors disabled:bg-slate-50 disabled:text-slate-400"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#1B222C] hover:bg-[#3E4C59] text-white disabled:bg-slate-200 disabled:text-slate-400 transition-colors cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
