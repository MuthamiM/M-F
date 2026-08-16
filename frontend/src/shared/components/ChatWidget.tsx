// src/shared/components/ChatWidget.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, X, Send, User, PhoneCall, HelpCircle, UserCheck, ArrowLeft, CheckCircle2, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Message {
  id: string;
  role: "bot" | "user" | "system";
  text: string;
  timestamp: string;
}

interface ChatSession {
  messages: Message[];
  liveTicket?: string | null;
  ticketClosed?: boolean;
  popCount?: number;
}

interface IosNotification {
  id: string;
  title: string;
  body: string;
  time: string;
}

/* ------------------------------------------------------------------ */
/*  M&F Institutional Logo                                              */
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

let sharedWidgetAudioCtx: AudioContext | null = null;

function initWidgetAudioContext() {
  if (typeof window === "undefined") return;
  if (!sharedWidgetAudioCtx) {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (Ctx) {
      sharedWidgetAudioCtx = new Ctx();
    }
  }
  if (sharedWidgetAudioCtx && sharedWidgetAudioCtx.state === "suspended") {
    sharedWidgetAudioCtx.resume().catch(() => {});
  }
}

function playIosNotificationSound() {
  try {
    initWidgetAudioContext();
    if (!sharedWidgetAudioCtx) return;

    const ctx = sharedWidgetAudioCtx;
    const playTone = (freq: number, start: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.18, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur);
    };
    const now = ctx.currentTime;
    // Classic iOS Note Chime (C6 -> E6 -> G6)
    playTone(1046.5, now, 0.12);
    playTone(1318.51, now + 0.08, 0.12);
    playTone(1567.98, now + 0.16, 0.25);
  } catch {}
}

/* ------------------------------------------------------------------ */
/*  Clean Text Helper                                                  */
/* ------------------------------------------------------------------ */
function cleanText(text: string): string {
  return text
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/#{1,6}\s?/g, "")
    .replace(/`(.+?)`/g, "$1")
    .trim();
}

/* ------------------------------------------------------------------ */
/*  Session Storage                                                    */
/* ------------------------------------------------------------------ */
const STORAGE_KEY = "mf_chat_session_v6";
const INACTIVITY_LIMIT_MS = 4 * 60 * 1000; // 4 minutes
const MAX_AUTO_POPS = 5;

function loadSession(): ChatSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(session: ChatSession) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {}
}

function clearSessionData() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {}
}

/* ------------------------------------------------------------------ */
/*  ChatWidget Component                                               */
/* ------------------------------------------------------------------ */
export function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [liveTicket, setLiveTicket] = useState<string | null>(null);
  const [ticketClosed, setTicketClosed] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [popCount, setPopCount] = useState<number>(0);
  const [promptState, setPromptState] = useState<"waiting" | "visible" | "dismissed">("waiting");
  
  // iOS Push Banner state
  const [iosBanner, setIosBanner] = useState<IosNotification | null>(null);

  // Active Form Mode: null | "callback" | "live_agent"
  const [activeForm, setActiveForm] = useState<null | "callback" | "live_agent">(null);

  // Form fields
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formReason, setFormReason] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Do not render inside admin pages
  if (typeof window !== "undefined" && pathname?.startsWith("/admin")) {
    return null;
  }

  const touchActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  /* ---- Show iOS Push Notification Banner ---- */
  const triggerIosNotification = (title: string, body: string) => {
    setIosBanner({
      id: "ios-notif-" + Date.now(),
      title,
      body,
      time: "now",
    });
    playIosNotificationSound();

    setTimeout(() => {
      setIosBanner((current) => (current?.title === title ? null : current));
    }, 5000);
  };

  /* ---- Trigger Pop-Up Prompt with iPhone sound ---- */
  const triggerPopUpPrompt = useCallback(() => {
    if (isOpen || popCount >= MAX_AUTO_POPS) return;

    setPromptState("visible");
    playIosNotificationSound();
    setPopCount((prev) => prev + 1);
  }, [isOpen, popCount]);

  /* ---- Restore Session ---- */
  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      if (saved.messages && saved.messages.length > 0) {
        setMessages(saved.messages);
      }
      setLiveTicket(saved.liveTicket || null);
      setTicketClosed(saved.ticketClosed || false);
      if (typeof saved.popCount === "number") {
        setPopCount(saved.popCount);
      }
    }
  }, []);

  /* ---- Save Session ---- */
  useEffect(() => {
    saveSession({ messages, liveTicket, ticketClosed, popCount });
  }, [messages, liveTicket, ticketClosed, popCount]);

  const isServicesPage = pathname?.startsWith("/services");

  // Unlock Chat AudioContext on user interaction
  useEffect(() => {
    const handleInteraction = () => {
      initWidgetAudioContext();
    };
    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  /* ---- Initial Immediate Pop-Up (600ms) on site load ---- */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (popCount === 0 && !isOpen && !liveTicket) {
        triggerPopUpPrompt();
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [popCount, isOpen, triggerPopUpPrompt, liveTicket]);

  /* ---- Services Page Special Behavior: Always present prompt ---- */
  useEffect(() => {
    if (isServicesPage && !isOpen && !liveTicket && promptState !== "visible") {
      setPromptState("visible");
      playIosNotificationSound();
    }
  }, [pathname, isServicesPage, isOpen, liveTicket]);

  /* ---- Route Navigation Pop-Up Trigger (up to 5 times as user navigates) ---- */
  useEffect(() => {
    if (!isServicesPage && !liveTicket && popCount > 0 && popCount < MAX_AUTO_POPS && !isOpen) {
      const timer = setTimeout(() => {
        triggerPopUpPrompt();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [pathname, isServicesPage, liveTicket]);

  /* ---- 30-Second Interval Pop-Up Trigger (every 30s up to 5 times) ---- */
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isServicesPage && !liveTicket && popCount < MAX_AUTO_POPS && !isOpen && promptState !== "visible") {
        triggerPopUpPrompt();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [popCount, isOpen, promptState, triggerPopUpPrompt, isServicesPage, liveTicket]);

  /* ---- Active Support Ticket Polling (every 4s) ---- */
  useEffect(() => {
    if (!liveTicket || ticketClosed) return;

    let pollInterval: NodeJS.Timeout;
    let isFetching = false;

    const pollMessages = async () => {
      if (isFetching) return;
      isFetching = true;
      try {
        const apiHost = typeof window !== "undefined" ? "" : "http://localhost:4000";
        const res = await fetch(`${apiHost}/api/tickets/${liveTicket}/messages`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            // Update ticket status dynamically (e.g. if admin closed it on their end)
            if (data.status === "closed" && !ticketClosed) {
              setTicketClosed(true);
              const closedTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              setMessages((prev) => [
                ...prev,
                {
                  id: "sys-" + Date.now(),
                  role: "system",
                  text: `Support Session for ${liveTicket} was ended at ${closedTime}.`,
                  timestamp: new Date().toISOString(),
                },
              ]);
              triggerIosNotification("Support Session Ended", `Ticket ${liveTicket} closed`);
              return;
            }

            // Map API messages to client messages
            const mapped: Message[] = data.data.map((m: any) => ({
              id: m.id || `msg-${new Date(m.timestamp).getTime()}`,
              role: m.sender === "client" ? "user" : "bot",
              text: m.text,
              timestamp: m.timestamp,
            }));

            // Check if there are new messages
            setMessages((prev) => {
              // Find any message in mapped that does not exist in prev
              const newMsgs = mapped.filter(
                (m) => !prev.some((p) => p.text === m.text && Math.abs(new Date(p.timestamp).getTime() - new Date(m.timestamp).getTime()) < 5000)
              );

              if (newMsgs.length > 0) {
                // If any new message is from the agent, play sound!
                const hasAgentMsg = newMsgs.some((m) => m.role === "bot");
                if (hasAgentMsg) {
                  playIosNotificationSound();
                  // If chat panel is closed or minimized, trigger the iOS banner alert!
                  if (!isOpen) {
                    const latestAgentMsg = newMsgs.filter((m) => m.role === "bot").pop();
                    if (latestAgentMsg) {
                      triggerIosNotification("Support Agent Reply", latestAgentMsg.text);
                    }
                  }
                }

                // Reconstruct the message list: start with the greeting if it exists,
                // then append all mapped messages, plus any system messages.
                const greetingMsg = prev.find((m) => m.id.startsWith("greeting-"));
                const systemMsgs = prev.filter((m) => m.role === "system");

                const combined: Message[] = [];
                if (greetingMsg) {
                  combined.push(greetingMsg);
                }
                for (const m of mapped) {
                  combined.push(m);
                }
                for (const sys of systemMsgs) {
                  combined.push(sys);
                }
                combined.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                return combined;
              }
              return prev;
            });
          }
        }
      } catch (err) {
        console.error("Failed to poll live agent messages:", err);
      } finally {
        isFetching = false;
      }
    };

    pollMessages();
    pollInterval = setInterval(pollMessages, 4000);

    return () => clearInterval(pollInterval);
  }, [liveTicket, ticketClosed, isOpen]);

  /* ---- Inactivity 4-minute check ---- */
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastActivityRef.current >= INACTIVITY_LIMIT_MS) {
        clearSessionData();
        setMessages([]);
        setLiveTicket(null);
        setTicketClosed(false);
        setActiveForm(null);
        setIsOpen(false);
        setPromptState("dismissed");
        setIosBanner(null);
        setPopCount(0);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  /* ---- Auto-scroll ---- */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, activeForm]);

  /* ---- Focus input ---- */
  useEffect(() => {
    if (isOpen && !activeForm) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, activeForm]);

  /* ---- Start Chat ---- */
  const initChat = useCallback(() => {
    if (messages.length > 0) return;
    const greetMsg: Message = {
      id: "greeting-" + Date.now(),
      role: "bot",
      text: "Welcome to M&F Technologies. How can we help you today?",
      timestamp: new Date().toISOString(),
    };
    setMessages([greetMsg]);
  }, [messages]);

  const handleOpenChat = () => {
    touchActivity();
    setPromptState("dismissed");
    setIosBanner(null);
    setIsOpen(true);
    initChat();
  };

  const handleMinimize = () => {
    touchActivity();
    setIsOpen(false);
  };

  const handleDismissPrompt = () => {
    touchActivity();
    setPromptState("dismissed");
  };

  /* ---- Quick Menu Actions ---- */
  const handleWhatWeDo = () => {
    touchActivity();
    sendUserQuery("What core solutions and services does M&F Technologies provide?");
  };

  /* ---- Submit Callback Form ---- */
  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    touchActivity();
    if (!formName.trim() || !formPhone.trim() || formSubmitting) return;

    setFormSubmitting(true);
    const userSummary = `Requested Callback: ${formName.trim()} (${formPhone.trim()})`;

    const userMsg: Message = {
      id: "user-" + Date.now(),
      role: "user",
      text: userSummary,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const apiHost = typeof window !== "undefined" ? "" : "http://localhost:4000";
      const res = await fetch(`${apiHost}/api/chatbot/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "request_callback",
          name: formName.trim(),
          phone: formPhone.trim(),
          email: formEmail.trim(),
          reason: formReason.trim(),
        }),
      });

      const data = await res.json();
      const botText = data.success
        ? cleanText(data.data.response)
        : "Your callback request has been logged. Our team will contact you shortly.";

      const botMsg: Message = {
        id: "bot-" + Date.now(),
        role: "bot",
        text: botText,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);

      if (!isOpen) {
        triggerIosNotification("Callback Logged", botText);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          role: "bot",
          text: "Your callback request has been logged. Our team will contact you shortly.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setFormSubmitting(false);
      setActiveForm(null);
      resetFormFields();
    }
  };

  /* ---- Submit Live Agent Form ---- */
  const handleLiveAgentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    touchActivity();
    if (!formName.trim() || !formEmail.trim() || formSubmitting) return;

    setFormSubmitting(true);
    const userSummary = `Request Live Support Agent: ${formName.trim()} (${formEmail.trim()})`;

    const userMsg: Message = {
      id: "user-" + Date.now(),
      role: "user",
      text: userSummary,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const apiHost = typeof window !== "undefined" ? "" : "http://localhost:4000";
      const res = await fetch(`${apiHost}/api/chatbot/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "request_live_agent",
          name: formName.trim(),
          email: formEmail.trim(),
          issue: formReason.trim(),
        }),
      });

      const data = await res.json();
      const tId = data.success && data.data.ticket ? data.data.ticket : "TKT-LIVE-SESSION";

      setLiveTicket(tId);
      setTicketClosed(false);

      const botText = data.success
        ? cleanText(data.data.response)
        : "Live support ticket created. An agent will join this session shortly.";

      const botMsg: Message = {
        id: "bot-" + Date.now(),
        role: "bot",
        text: botText,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);

      triggerIosNotification("Support Ticket Created", `${tId} — Agent will join shortly`);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          role: "bot",
          text: "Live support ticket created. An agent will join this session shortly.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setFormSubmitting(false);
      setActiveForm(null);
      resetFormFields();
    }
  };

  /* ---- End Live Support Ticket Session ---- */
  const handleEndLiveTicket = () => {
    touchActivity();
    if (!liveTicket) return;
    const closedTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const closeMsg: Message = {
      id: "sys-" + Date.now(),
      role: "system",
      text: `Support Session for ${liveTicket} was ended at ${closedTime}.`,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, closeMsg]);
    setTicketClosed(true);

    triggerIosNotification("Support Session Ended", `Ticket ${liveTicket} closed at ${closedTime}`);
  };

  const resetFormFields = () => {
    setFormName("");
    setFormPhone("");
    setFormEmail("");
    setFormReason("");
  };

  /* ---- Send Message ---- */
  const sendUserQuery = async (queryText: string) => {
    touchActivity();
    if (!queryText.trim() || isTyping || ticketClosed) return;

    const userMsg: Message = {
      id: "user-" + Date.now(),
      role: "user",
      text: queryText.trim(),
      timestamp: new Date().toISOString(),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setIsTyping(true);

    try {
      const history = updated.slice(1).map((m) => ({
        role: m.role === "bot" ? "assistant" : "user",
        content: m.text,
      }));

      const apiHost = typeof window !== "undefined" ? "" : "http://localhost:4000";
      const res = await fetch(`${apiHost}/api/chatbot/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: queryText.trim(), history, ticket: liveTicket }),
      });

      const data = await res.json();
      if (data.success && data.data?.ticket && !liveTicket) {
        setLiveTicket(data.data.ticket);
      }

      const botText = data.success
        ? cleanText(data.data.response)
        : "We are currently experiencing connection delays. Please contact info@mftechnologies.org or call +254 748 329 410 for assistance.";

      const botMsg: Message = {
        id: "bot-" + Date.now(),
        role: "bot",
        text: botText,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);

      if (!isOpen || liveTicket) {
        triggerIosNotification(liveTicket ? "Support Agent Reply" : "M&F Support", botText);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          role: "bot",
          text: "Connection error. Please check your network connection.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText("");
    sendUserQuery(text);
  };

  const fmtTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <>
      {/* iOS NOTIFICATION BANNER (Top-Center / Top-Right Push Style) */}
      <AnimatePresence>
        {iosBanner && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            onClick={() => {
              setIosBanner(null);
              handleOpenChat();
            }}
            className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[360px] z-[100000] cursor-pointer"
          >
            <div className="bg-[#111827]/90 backdrop-blur-xl text-white rounded-[22px] p-3.5 shadow-2xl border border-white/15 flex flex-col gap-1.5 select-none hover:bg-[#111827]/95 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-md bg-[#1B222C] border border-white/20 flex items-center justify-center p-0.5">
                    <MfLogo size={14} />
                  </div>
                  <span className="text-[10px] font-bold tracking-wider text-slate-300 uppercase">
                    M&amp;F SUPPORT
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-medium">{iosBanner.time}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIosBanner(null);
                    }}
                    className="text-slate-400 hover:text-white p-0.5 rounded-full"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Bell className="h-3 w-3 text-blue-400" />
                  {iosBanner.title}
                </h4>
                <p className="text-xs text-slate-300 font-normal line-clamp-2 leading-tight mt-0.5">
                  {iosBanner.body}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pop-up Prompt Bubble */}
      <AnimatePresence>
        {promptState === "visible" && !isOpen && !iosBanner && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed right-4 sm:right-6 z-[99999] w-[260px] sm:w-[280px]"
            style={{ bottom: "calc(5.2rem + var(--cookie-banner-h, 0px))", transition: "bottom 0.3s ease-out" }}
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
              <div className="bg-[#1B222C] px-3.5 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MfLogo size={18} />
                  <span className="text-xs font-semibold text-white">M&amp;F Support</span>
                </div>
                <button
                  onClick={handleDismissPrompt}
                  className="text-[#9AA5B1] hover:text-white transition-colors p-0.5"
                  aria-label="Dismiss"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="p-3.5">
                <p className="text-xs text-[#1B222C] font-medium leading-relaxed mb-3">
                  Do you want help getting started?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleOpenChat}
                    className="flex-1 py-1.5 px-3 text-xs font-semibold text-white bg-[#1B222C] hover:bg-[#3E4C59] rounded-lg transition-colors cursor-pointer"
                  >
                    Contact Us
                  </button>
                  <button
                    onClick={handleDismissPrompt}
                    className="flex-1 py-1.5 px-3 text-xs font-semibold text-[#616E7C] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    No, thanks
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pr-5">
              <div className="w-2.5 h-2.5 bg-white border-r border-b border-slate-200 rotate-45 -mt-1.5" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Round Toggle Button (FAB) */}
      <div className="fixed right-4 sm:right-6 z-[99999]" style={{ bottom: "calc(1.25rem + var(--cookie-banner-h, 0px))", transition: "bottom 0.3s ease-out" }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (isOpen) {
              handleMinimize();
            } else {
              handleOpenChat();
            }
          }}
          className="relative flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-[#1B222C] text-white shadow-xl hover:bg-[#3E4C59] transition-colors focus:outline-none"
          aria-label="Toggle chat window"
        >
          {isOpen ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
        </motion.button>
      </div>

      {/* Compact Expanded Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed right-4 sm:right-6 w-[320px] sm:w-[350px] h-[450px] sm:h-[480px] bg-white border border-slate-200 rounded-2xl shadow-2xl z-[99999] flex flex-col overflow-hidden"
            style={{ bottom: "calc(4.8rem + var(--cookie-banner-h, 0px))", transition: "bottom 0.3s ease-out" }}
          >
            {/* Header */}
            <div className="bg-[#1B222C] text-white px-3.5 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <MfLogo size={26} />
                <div>
                  <h3 className="text-xs font-bold tracking-tight">M&amp;F Support</h3>
                  <span className="text-[9px] text-[#9AA5B1] block -mt-0.5">Online</span>
                </div>
              </div>
              <button
                onClick={handleMinimize}
                className="text-[#9AA5B1] hover:text-white transition-colors rounded-lg p-1"
                aria-label="Minimize chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Pinned Live Ticket Banner */}
            {liveTicket && (
              <div className="bg-slate-100 border-b border-slate-200 px-3 py-1.5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    {ticketClosed ? "Ticket Closed" : "Live Session"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#1B222C] font-mono">
                    {liveTicket}
                  </span>
                  {!ticketClosed && (
                    <button
                      onClick={handleEndLiveTicket}
                      title="End Session"
                      className="text-[9px] font-semibold text-red-600 hover:underline"
                    >
                      End
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/50">
              {messages.map((msg) => {
                if (msg.role === "system") {
                  return (
                    <div key={msg.id} className="my-2 py-1.5 px-3 bg-slate-200/70 rounded-xl text-center">
                      <p className="text-[10px] font-semibold text-slate-600 flex items-center justify-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-slate-500" />
                        {msg.text}
                      </p>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className="space-y-0.5">
                    <div className={`flex items-start gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                      {msg.role === "bot" ? (
                        <div className="shrink-0 mt-0.5">
                          <MfLogo size={20} />
                        </div>
                      ) : (
                        <div className="h-5 w-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                          <User className="h-3 w-3" />
                        </div>
                      )}

                      <div
                        className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed whitespace-pre-line shadow-sm border ${
                          msg.role === "bot"
                            ? "bg-white text-[#1B222C] border-slate-200 rounded-tl-none"
                            : "bg-[#1B222C] text-white border-transparent rounded-tr-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                    <span
                      className={`text-[8px] font-medium text-slate-400 block ${
                        msg.role === "user" ? "text-right mr-7" : "text-left ml-7"
                      }`}
                    >
                      {msg.role === "bot" ? "M&F Support" : "You"} &bull; {fmtTime(msg.timestamp)}
                    </span>
                  </div>
                );
              })}

              {/* Support Options Menu — ONLY SHOWN IF NO LIVE TICKET & NO ACTIVE FORM */}
              {!liveTicket && !activeForm && !ticketClosed && messages.length > 0 && (
                <div className="space-y-1.5 pt-1 pl-6">
                  <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Support Options
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={handleWhatWeDo}
                      disabled={isTyping}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#1B222C] bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors text-left shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      <HelpCircle className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span>What We Do</span>
                    </button>
                    <button
                      onClick={() => {
                        touchActivity();
                        resetFormFields();
                        setActiveForm("live_agent");
                      }}
                      disabled={isTyping}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#1B222C] bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors text-left shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      <UserCheck className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span>Talk to Live Support Agent</span>
                    </button>
                    <button
                      onClick={() => {
                        touchActivity();
                        resetFormFields();
                        setActiveForm("callback");
                      }}
                      disabled={isTyping}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#1B222C] bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors text-left shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      <PhoneCall className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span>Request Callback</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Form 1: Request Callback Form */}
              {activeForm === "callback" && (
                <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-md space-y-2 mt-1 ml-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-xs font-bold text-[#1B222C]">Request Callback</span>
                    <button onClick={() => setActiveForm(null)} className="text-slate-400 hover:text-slate-600 p-0.5">
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <form onSubmit={handleCallbackSubmit} className="space-y-1.5">
                    <div>
                      <label className="block text-[9px] font-semibold text-slate-500 mb-0.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => { touchActivity(); setFormName(e.target.value); }}
                        placeholder="John Doe"
                        className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B222C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-slate-500 mb-0.5">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formPhone}
                        onChange={(e) => { touchActivity(); setFormPhone(e.target.value); }}
                        placeholder="+254 700 000 000"
                        className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B222C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-slate-500 mb-0.5">Email Address</label>
                      <input
                        type="email"
                        value={formEmail}
                        onChange={(e) => { touchActivity(); setFormEmail(e.target.value); }}
                        placeholder="john@institution.com"
                        className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B222C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-slate-500 mb-0.5">Reason for Callback *</label>
                      <input
                        type="text"
                        required
                        value={formReason}
                        onChange={(e) => { touchActivity(); setFormReason(e.target.value); }}
                        placeholder="e.g. Core Lending Integration"
                        className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B222C]"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={formSubmitting || !formName.trim() || !formPhone.trim() || !formReason.trim()}
                        className="flex-1 py-1.5 text-xs font-semibold text-white bg-[#1B222C] hover:bg-[#3E4C59] rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {formSubmitting ? "Submitting..." : "Submit Callback"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveForm(null)}
                        className="py-1.5 px-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Form 2: Talk to Live Agent Form */}
              {activeForm === "live_agent" && (
                <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-md space-y-2 mt-1 ml-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-xs font-bold text-[#1B222C]">Connect Live Support</span>
                    <button onClick={() => setActiveForm(null)} className="text-slate-400 hover:text-slate-600 p-0.5">
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <form onSubmit={handleLiveAgentSubmit} className="space-y-1.5">
                    <div>
                      <label className="block text-[9px] font-semibold text-slate-500 mb-0.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => { touchActivity(); setFormName(e.target.value); }}
                        placeholder="John Doe"
                        className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B222C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-slate-500 mb-0.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formEmail}
                        onChange={(e) => { touchActivity(); setFormEmail(e.target.value); }}
                        placeholder="john@institution.com"
                        className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B222C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-slate-500 mb-0.5">Issue Description *</label>
                      <input
                        type="text"
                        required
                        value={formReason}
                        onChange={(e) => { touchActivity(); setFormReason(e.target.value); }}
                        placeholder="e.g. API authentication issue"
                        className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#1B222C]"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={formSubmitting || !formName.trim() || !formEmail.trim() || !formReason.trim()}
                        className="flex-1 py-1.5 text-xs font-semibold text-white bg-[#1B222C] hover:bg-[#3E4C59] rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {formSubmitting ? "Connecting..." : "Request Live Ticket"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveForm(null)}
                        className="py-1.5 px-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 pl-2">
                  <div className="shrink-0 mt-0.5">
                    <MfLogo size={20} />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-3 py-2 flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    <span className="text-[9px] text-slate-500 ml-1 font-medium">
                      {liveTicket ? "Support Agent is typing..." : "Typing..."}
                    </span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleFormSend} className="p-2.5 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => { touchActivity(); setInputText(e.target.value); }}
                disabled={isTyping || activeForm !== null || ticketClosed}
                placeholder={
                  ticketClosed
                    ? "Session closed."
                    : activeForm !== null
                    ? "Fill in details above..."
                    : isTyping
                    ? "Responding..."
                    : "Type your message..."
                }
                className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#1B222C] transition-colors disabled:bg-slate-50 disabled:text-slate-400"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping || activeForm !== null || ticketClosed}
                className="h-7 w-7 flex items-center justify-center rounded-lg bg-[#1B222C] hover:bg-[#3E4C59] text-white disabled:bg-slate-200 disabled:text-slate-400 transition-colors cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
