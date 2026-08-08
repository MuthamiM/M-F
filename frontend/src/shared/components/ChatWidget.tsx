// src/shared/components/ChatWidget.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, CheckCircle, User, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
  actions?: { label: string; value: string }[];
}

/* ------------------------------------------------------------------ */
/*  Knowledge base – keyword → answer                                  */
/* ------------------------------------------------------------------ */
const FAQ_RESPONSES = [
  {
    keywords: ["service", "what do you build", "what we build", "what do you do", "features", "products"],
    answer:
      "M&F Technologies builds high-availability financial software including:\n\n• Core Lending Systems — end-to-end loan lifecycle management.\n• Credit Scoring Platforms — automated risk-based decisioning engines.\n• Collections Management — workflow-driven recovery trackers.\n• Portals & Mobile Apps — secure client/borrower self-service apps.\n• API Integration — secure JSON REST & GraphQL endpoints.\n\nYou can explore more in the Services section or request a callback from an agent.",
  },
  {
    keywords: ["price", "cost", "pricing", "free", "tier", "subscription"],
    answer:
      "We offer customized enterprise pricing based on your transaction volume, database size, and specific deployment needs (cloud-hosted SLA or on-premise installation). Contact our sales team or request an agent callback to receive a tailored quotation.",
  },
  {
    keywords: ["security", "comply", "compliance", "safe", "encrypt", "soc", "gdpr", "audit"],
    answer:
      "Our systems are built on a secure, bank-grade architecture featuring AES-256 encryption at rest, TLS 1.3 in transit, and immutable database audit trails. We support SOC 2 compliance readiness and local data protection regulations.",
  },
  {
    keywords: ["contact", "office", "location", "where", "nairobi", "phone", "email", "address"],
    answer:
      "Our main engineering office is located in Nairobi, Kenya. You can reach us via email at contact@mftechnologies.co. Alternatively, request an agent callback and someone will be in touch within minutes.",
  },
  {
    keywords: ["api", "developer", "documentation", "docs", "graphql", "rest"],
    answer:
      "Our comprehensive developer API reference is hosted locally. You can find detailed schemas and integration endpoints by clicking the API Reference button in our header.",
  },
  {
    keywords: ["demo", "trial", "test", "try"],
    answer:
      "We would love to walk you through a live demo! Request an agent callback and one of our integration specialists will reach out to you within minutes to set everything up.",
  },
];

/* ------------------------------------------------------------------ */
/*  M&F Logo – reusable inline SVG-style component                    */
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
/*  ChatWidget                                                         */
/* ------------------------------------------------------------------ */
export function ChatWidget() {
  /* ---- state ---- */
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "greet-1",
      sender: "bot",
      text: "Hello! Welcome to M&F Technologies. I\u2019m your digital assistant. How can I help you today?",
      timestamp: new Date(),
      actions: [
        { label: "What we build", value: "services" },
        { label: "System Pricing", value: "pricing" },
        { label: "Security & Compliance", value: "security" },
        { label: "Talk to an Agent", value: "connect_agent" },
      ],
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Agent callback form state
  const [formType, setFormType] = useState<"chat" | "callback" | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userRequest, setUserRequest] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Live Chat connection state
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [liveMessages, setLiveMessages] = useState<any[]>([]);
  const [liveName, setLiveName] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Poll for messages in Live Chat mode
  useEffect(() => {
    if (!isLiveMode || !ticketId) return;

    const fetchLiveMessages = async () => {
      try {
        const apiHost = typeof window !== "undefined" ? "" : "http://localhost:4000";
        const response = await fetch(`${apiHost}/api/tickets/${ticketId}/messages`);
        const resData = await response.json();
        if (response.ok && resData.success) {
          setLiveMessages(resData.data);
        }
      } catch (err) {
        console.error("Failed to sync live chat messages:", err);
      }
    };

    fetchLiveMessages();
    const interval = setInterval(fetchLiveMessages, 3000);
    return () => clearInterval(interval);
  }, [isLiveMode, ticketId]);

  /* ---- audio beep on open ---- */
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      /* browser may block audio before user gesture */
    }
  };

  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) playBeep();
  };

  /* ---- scroll to bottom ---- */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, liveMessages, isTyping, formType]);

  /* ---- helpers ---- */
  const addBotMessage = (text: string, actions?: { label: string; value: string }[]) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, sender: "bot", text, timestamp: new Date(), actions },
      ]);
      setIsTyping(false);
    }, 600);
  };

  const mainMenuActions = [
    { label: "What we build", value: "services" },
    { label: "System Pricing", value: "pricing" },
    { label: "Talk to a Live Agent", value: "connect_agent" },
    { label: "Book a Callback", value: "book_callback" },
  ];

  /* ---- action handler ---- */
  const handleActionClick = (value: string, label: string) => {
    // echo user choice
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: "user", text: label, timestamp: new Date() },
    ]);

    if (value === "connect_agent") {
      addBotMessage(
        "To start a live chat session with an agent immediately, please provide your name and email:"
      );
      setTimeout(() => setFormType("chat"), 700);
    } else if (value === "book_callback") {
      addBotMessage(
        "Please fill in the form details below to schedule a phone callback from our team:"
      );
      setTimeout(() => setFormType("callback"), 700);
    } else if (value === "helpful_yes") {
      addBotMessage("Great! Glad I could help. Let me know if you need anything else.", mainMenuActions);
    } else if (value === "helpful_no") {
      addBotMessage(
        "I’m sorry I wasn’t able to fully assist you. Would you like to start a live chat or schedule a callback?",
        [
          { label: "Talk to Live Agent", value: "connect_agent" },
          { label: "Book a Callback", value: "book_callback" },
          { label: "Main Menu", value: "restart" },
        ]
      );
    } else {
      handleBotResponse(value);
    }
  };

  /* ---- FAQ matching ---- */
  const handleBotResponse = (query: string) => {
    const q = query.toLowerCase();
    const match = FAQ_RESPONSES.find((item) => item.keywords.some((kw) => q.includes(kw)));

    if (match) {
      addBotMessage(match.answer + "\n\nWas this response helpful?", [
        { label: "Yes, thank you", value: "helpful_yes" },
        { label: "No", value: "helpful_no" },
      ]);
    } else if (q === "restart" || q === "hello" || q === "hi" || q === "hey" || q === "menu") {
      addBotMessage("How else can I assist you today?", mainMenuActions);
    } else {
      addBotMessage(
        "I’m not sure I fully understand that query.\n\nWas this response helpful, or would you like to speak to a live agent?",
        [
          { label: "Talk to Live Agent", value: "connect_agent" },
          { label: "Book a Callback", value: "book_callback" },
          { label: "Main Menu", value: "restart" },
        ]
      );
    }
  };

  /* ---- free-text input ---- */
  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText.trim();
    setInputText("");

    if (isLiveMode && ticketId) {
      try {
        const apiHost = typeof window !== "undefined" ? "" : "http://localhost:4000";
        // Send message to the backend public chat endpoint
        const res = await fetch(`${apiHost}/api/tickets/${ticketId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            senderName: liveName || "Visitor",
          }),
        });
        
        if (res.ok) {
          const resData = await res.json();
          // Optimistically append client message
          if (resData.success && resData.data) {
            setLiveMessages((prev) => [...prev, resData.data]);
          }
        }
      } catch (err) {
        console.error("Failed to deliver client message:", err);
      }
    } else {
      setMessages((prev) => [
        ...prev,
        { id: `user-${Date.now()}`, sender: "user", text, timestamp: new Date() },
      ]);
      handleBotResponse(text);
    }
  };

  /* ---- agent form submit ---- */
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isCallback = formType === "callback";

    // Callback requires phone + request; Live chat only needs name + email
    if (!userName.trim() || !userEmail.trim()) {
      setErrorMsg("Please fill in your name and email.");
      return;
    }
    if (isCallback && (!userPhone.trim() || !userRequest.trim())) {
      setErrorMsg("Please fill in all fields including phone and request details.");
      return;
    }

    setErrorMsg("");
    setFormSubmitting(true);

    try {
      const companyTag = isCallback ? "ChatBot — Callback Scheduled" : "ChatBot — Live Chat";
      const messageBody = isCallback
        ? `Callback requested.\nPhone: ${userPhone}\nRequest: ${userRequest}`
        : `Live chat initiated.\nPhone: ${userPhone || "Not provided"}\nRequest: ${userRequest || "Live support session"}`;

      const apiHost = typeof window !== "undefined" ? "" : "http://localhost:4000";
      const res = await fetch(`${apiHost}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          phone: userPhone || undefined,
          company: companyTag,
          message: messageBody,
          website: "",
        }),
      });

      if (res.ok) {
        const resData = await res.json();
        const ticketId = resData.data?.id || resData.id || "pending";
        const clientName = userName.trim();
        setLiveName(clientName);
        setFormType(null);
        setFormSubmitting(false);

        if (isCallback) {
          // Callback mode: confirm scheduling, do NOT enter live chat
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-done-${Date.now()}`,
              sender: "bot",
              text: `Thank you, ${clientName}! Your callback request has been scheduled. Ticket ID: ${ticketId}.\n\nOur team will call you at ${userPhone} shortly. You can close this chat or continue browsing.`,
              timestamp: new Date(),
              actions: mainMenuActions,
            },
          ]);
        } else {
          // Live chat mode: enter real-time conversation
          setTicketId(ticketId);
          setIsLiveMode(true);
          setLiveMessages([
            {
              id: `msg-init-${Date.now()}`,
              sender: "client",
              senderName: clientName,
              text: userRequest || "Hi, I need live support.",
              timestamp: new Date().toISOString(),
            }
          ]);

          setMessages((prev) => [
            ...prev,
            {
              id: `bot-done-${Date.now()}`,
              sender: "bot",
              text: `You're connected, ${clientName}! Ticket ID: ${ticketId}. An agent has been notified — you can now chat with them directly in this window.`,
              timestamp: new Date(),
            },
          ]);
        }

        setUserName("");
        setUserEmail("");
        setUserPhone("");
        setUserRequest("");
      } else {
        const errData = await res.json().catch(() => null);
        const detailsMsg = errData?.details?.[0]?.message;
        const errMsg = errData?.error || detailsMsg || "Submission failed";
        throw new Error(errMsg);
      }
    } catch (err: any) {
      setFormSubmitting(false);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */
  return (
    <>
      {/* ---- Floating toggle ---- */}
      <div className="fixed bottom-6 right-6 z-[99999]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggle}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1B222C] text-white shadow-xl hover:bg-[#3E4C59] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B222C]"
          aria-label="Open support chat"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
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
            className="fixed bottom-24 right-6 w-[360px] sm:w-[400px] h-[550px] bg-white border border-[#9AA5B1]/20 rounded-2xl shadow-2xl z-[99999] flex flex-col overflow-hidden"
          >
            {/* ---- Header ---- */}
            <div className="bg-[#1B222C] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MfLogo size={32} />
                <div>
                  <h3 className="text-sm font-bold tracking-tight">M&amp;F Support Agent</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-[#9AA5B1]">Online &bull; Instant Support</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[#9AA5B1] hover:text-white transition-colors rounded-lg p-1.5">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* ---- Messages ---- */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {isLiveMode ? (
                liveMessages.map((msg) => (
                  <div key={msg.id} className="space-y-1">
                    <div className={`flex items-start gap-2.5 ${msg.sender === "client" ? "flex-row-reverse" : ""}`}>
                      {/* avatar */}
                      {msg.sender === "agent" ? (
                        <MfLogo size={24} />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                          <User className="h-3.5 w-3.5" />
                        </div>
                      )}

                      {/* bubble */}
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-line shadow-sm border ${
                          msg.sender === "agent"
                            ? "bg-white text-[#1B222C] border-[#9AA5B1]/10 rounded-tl-none"
                            : "bg-[#1B222C] text-white border-transparent rounded-tr-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                    <span className={`text-[8px] font-bold text-slate-400 block ${
                      msg.sender === "client" ? "text-right mr-8" : "text-left ml-8"
                    }`}>
                      {msg.senderName} • {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                    </span>
                  </div>
                ))
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="space-y-2">
                    <div className={`flex items-start gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                      {/* avatar */}
                      {msg.sender === "bot" ? (
                        <MfLogo size={24} />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                          <User className="h-3.5 w-3.5" />
                        </div>
                      )}

                      {/* bubble */}
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed whitespace-pre-line shadow-sm border ${
                          msg.sender === "bot"
                            ? "bg-white text-[#1B222C] border-[#9AA5B1]/10 rounded-tl-none"
                            : "bg-[#1B222C] text-white border-transparent rounded-tr-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>

                    {/* action buttons */}
                    {msg.sender === "bot" && msg.actions && msg.actions.length > 0 && (
                      <div className="pl-8 flex flex-wrap gap-2">
                        {msg.actions.map((act) => (
                          <button
                            key={act.value}
                            onClick={() => handleActionClick(act.value, act.label)}
                            className="bg-white border border-[#9AA5B1]/20 hover:border-[#1B222C] text-[#3E4C59] hover:text-[#1B222C] px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
                          >
                            {act.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}

              {/* typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 pl-2">
                  <MfLogo size={24} />
                  <div className="bg-white border border-[#9AA5B1]/10 rounded-2xl rounded-tl-none px-4 py-2 flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}

              {/* ---- Live Chat Form (name + email) ---- */}
              {formType === "chat" && !formSubmitting && (
                <div className="pl-8 pt-2">
                  <form onSubmit={handleFormSubmit} className="bg-white border border-[#9AA5B1]/20 rounded-xl p-4 space-y-3 shadow-md">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                      Start Live Chat Session
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-600 block">Your Name</label>
                      <input
                        type="text"
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B222C] transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-600 block">Work Email</label>
                      <input
                        type="email"
                        required
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="john@yourbank.com"
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B222C] transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-600 block">What do you need help with? <span className="text-slate-400">(optional)</span></label>
                      <textarea
                        value={userRequest}
                        onChange={(e) => setUserRequest(e.target.value)}
                        placeholder="e.g. Need help integrating your credit scoring API..."
                        rows={2}
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B222C] transition-colors resize-none"
                      />
                    </div>

                    {errorMsg && <div className="text-[10px] font-medium text-red-600">{errorMsg}</div>}

                    <button
                      type="submit"
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Connect to Live Agent</span>
                    </button>
                  </form>
                </div>
              )}

              {/* ---- Callback Booking Form (full details) ---- */}
              {formType === "callback" && !formSubmitting && (
                <div className="pl-8 pt-2">
                  <form onSubmit={handleFormSubmit} className="bg-white border border-[#9AA5B1]/20 rounded-xl p-4 space-y-3 shadow-md">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B7684]">
                      Schedule a Phone Callback
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-600 block">Your Name</label>
                      <input
                        type="text"
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B222C] transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-600 block">Work Email</label>
                      <input
                        type="email"
                        required
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="john@yourbank.com"
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B222C] transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-600 block">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        placeholder="+254 700 000000"
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B222C] transition-colors"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-600 block">What do you need help with?</label>
                      <textarea
                        required
                        value={userRequest}
                        onChange={(e) => setUserRequest(e.target.value)}
                        placeholder="e.g. Requesting a demo for credit scoring..."
                        rows={2}
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B222C] transition-colors resize-none"
                      />
                    </div>

                    {errorMsg && <div className="text-[10px] font-medium text-red-600">{errorMsg}</div>}

                    <button
                      type="submit"
                      className="w-full py-2 bg-[#1B222C] hover:bg-[#3E4C59] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Schedule Callback</span>
                    </button>
                  </form>
                </div>
              )}

              {/* submitting spinner */}
              {formSubmitting && (
                <div className="pl-8 pt-4 flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="h-6 w-6 text-[#3E4C59] animate-spin" />
                  <span className="text-[11px] text-[#6B7684]">Submitting your request...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* ---- Input bar ---- */}
            <form onSubmit={handleSendText} className="p-3 border-t border-[#9AA5B1]/20 bg-white flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={!!formType}
                placeholder={isLiveMode ? "Type your reply to agent..." : formType ? "Complete the form above..." : "Ask me anything..."}
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B222C] transition-colors disabled:bg-slate-50 disabled:text-slate-400"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || !!formType}
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
